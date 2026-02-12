/**
 * 회원 관련 타입 정의
 */

// 회원 기본 정보
export interface User {
  _id: number;
  email: string;
  name: string;
  image?: string;
  address?: string;
}

// 회원 유형 타입
export type UserType = 'user' | 'seller' | 'admin';

// 회원 가입 요청
export interface CreateUserRequest extends Omit<User, '_id'> {
  type: UserType;
  password: string;
}

// 회원 정보 조회
export interface UserDetail extends User {
  token: {
    accessToken: string;
    refreshToken?: string;
  };
}
