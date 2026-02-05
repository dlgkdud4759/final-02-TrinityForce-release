import type { UserDetail } from '../types/user';

/**
 * localStorage에서 사용자 정보를 가져오는 함수
 * 저장된 사용자 정보가 있으면 JSON 파싱하여 반환하고, 없으면 null을 반환합니다.
 *
 * @function getUser
 * @returns {UserDetail | null} - 사용자 객체 또는 null
 */
export function getUser(): UserDetail | null {
  const user = localStorage.getItem('user') || sessionStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

/**
 * 사용자 정보를 localStorage에 저장하는 함수
 *
 * @function setUser
 * @param {UserDetail} user - 저장할 사용자 객체
 * @returns {void}
 */
export function setUser(user: UserDetail): void {
  if (localStorage.getItem('user')) {
    localStorage.setItem('user', JSON.stringify(user));
  } else if (sessionStorage.getItem('user')) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }
}

/**
 * localStorage에서 사용자 정보를 제거하는 함수
 *
 * @function removeUser
 * @returns {void}
 */
export function removeUser(): void {
  localStorage.removeItem('user');
  sessionStorage.removeItem('user');
}

/**
 * 로그인 페이지로 이동하는 함수
 * 사용자에게 로그인 페이지 이동 여부를 확인하고,
 * 확인 시 현재 페이지 경로를 from 쿼리 파라미터에 포함하여 로그인 페이지로 이동합니다.
 * 취소 시 이전 페이지로 돌아갑니다.
 *
 * @function navigateLogin
 * @returns {void}
 */
export function navigateLogin() {
  const gotoLogin = confirm(
    '로그인 후 이용 가능합니다.\n로그인 페이지로 이동하시겠습니까?'
  );
  if (gotoLogin) {
    // 현재 페이지를 from 쿼리 파라미터에 지정해서 로그인 페이지로 이동
    // 로그인이 완료되면 from 쿼리 파라미터에 지정된 페이지로 이동
    location.replace(`/src/pages/user/login?from=${location.pathname}`);
  } else {
    // 이전 페이지로 이동
    history.back();
  }
}
