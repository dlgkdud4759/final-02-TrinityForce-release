import axios, { AxiosError, type AxiosInstance } from 'axios';
import { getUser, navigateLogin, setUser } from './user';
import toast from 'react-hot-toast'

const API_SERVER = 'https://fesp-api.koyeb.app/market';
// const API_SERVER = 'http://localhost/market';
const LOGIN_EMAIL = process.env.NEXT_PUBLIC_LOGIN_EMAIL;
const LOGIN_PASSWORD = process.env.NEXT_PUBLIC_LOGIN_PASSWORD;
const CLIENT_ID = 'febc15-final02-ecad';

const fetchAccessToken = async () => {
  if (!LOGIN_EMAIL || !LOGIN_PASSWORD) return null;

  const response = await axios.post(
    `${API_SERVER}/users/login`,
    {
      email: LOGIN_EMAIL,
      password: LOGIN_PASSWORD,
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'Client-Id': CLIENT_ID,
      },
    }
  );

  if (!response.data?.ok) {
    throw new Error(response.data?.message || '로그인에 실패했습니다.');
  }

  return response.data.item?.token?.accessToken || null;
};

let isReauthing = false;
let reauthWaiters: Array<(token: string | null) => void> = [];

const requestReauth = async () => {
  if (isReauthing) {
    return new Promise<string | null>((resolve) => reauthWaiters.push(resolve));
  }

  isReauthing = true;
  try {
    const token = await fetchAccessToken();
    reauthWaiters.forEach((resolve) => resolve(token));
    reauthWaiters = [];
    return token;
  } finally {
    isReauthing = false;
  }
};
// access token 재발급 URL
const REFRESH_URL = '/auth/refresh';

/**
 * Axios 인스턴스를 생성하고 인터셉터를 설정하는 함수
 * 요청 인터셉터에서 공통 파라미터를 추가하고,
 * 응답 인터셉터에서 에러 처리 및 accessToken 재발행 로직을 처리합니다.
 *
 * @function getAxios
 * @returns {AxiosInstance} 설정된 Axios 인스턴스
 */
export function getAxios(): AxiosInstance {
  const user = getUser();
  const instance = axios.create({
    baseURL: API_SERVER, // 기본 URL
    timeout: 1000 * 5,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'Client-Id': CLIENT_ID,
      Authorization: `Bearer ${user?.token?.accessToken}`,
    },
  });

  // 요청 인터셉터 추가하기
  instance.interceptors.request.use(
    async (config) => {
      // 요청이 전달되기 전에 필요한 공통 작업 수행
      config.params = {
        // delay: 1000,
        ...config.params, // 기존 쿼리스트링 복사
      };
      return config;
    },
    (error) => {
      // 공통 에러 처리

      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 추가하기
  instance.interceptors.response.use(
    (response) => {
      console.log('정상 응답 인터셉터 호출', response);
      // 2xx 범위에 있는 상태 코드는 이 함수가 호출됨

      return response;
    },
    async (error) => {
      console.error('에러 응답 인터셉터 호출', error);
      // 2xx 외의 범위에 있는 상태 코드는 이 함수가 호출됨
      // 공통 에러 처리

      const errors = error.response?.data.errors;
      if (error.status === 422 && errors) {
        for (const err in errors) {
          const validationError = errors[err];
          // input이나 textarea에 에러 메시지 표시
          const element = document.querySelector(
            `input[name="${err}"] + .validation-error, textarea[name="${err}"] + .validation-error`
          );
          if (element) {
            element.textContent = validationError.msg;
          }
        }
        // 에러 처리를 했으므로 에러를 반환하지 않음
        return Promise.resolve(error.response);
      }

      const { config } = error;
      if (error.status === 401) {
        // 인증 실패
        if (config.url === REFRESH_URL) {
          // refresh token 만료
          navigateLogin();
        } else if (user) {
          // 로그인 했으나 access token 만료된 경우
          // refresh 토큰으로 access 토큰 재발급 요청
          const {
            data: { accessToken },
          } = await instance.get(REFRESH_URL, {
            headers: {
              Authorization: `Bearer ${user.token.refreshToken}`,
            },
          });
          // 갱신된 accessToken으로 스토리지 업데이트
          setUser({ ...user, token: { accessToken } });
          // 갱신된 accessToken으로 재요청
          config.headers.Authorization = `Bearer ${accessToken}`;
          return axios(config);
        } else if (LOGIN_EMAIL && LOGIN_PASSWORD) {
          const accessToken = await requestReauth();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
            return axios(config);
          }
          navigateLogin();
        } else {
          // 로그인 안한 경우
          navigateLogin();
        }
      }

      return Promise.reject(error);
    }
  );

  return instance;
}

/**
 * Axios 에러를 처리하는 함수
 * AxiosError인 경우 서버의 에러 응답 메시지 출력
 * 그 외의 경우 일반 Error 메시지를 표시합니다.
 *
 * @function handleAxiosError
 * @param {unknown} err - 처리할 에러 객체
 * @returns {void}
 */
export function handleAxiosError(err: unknown) {
  if (err instanceof AxiosError) {
    toast.error(err.response?.data.message || err.message);
  } else {
    toast.error((err as Error).message);
  }
}
