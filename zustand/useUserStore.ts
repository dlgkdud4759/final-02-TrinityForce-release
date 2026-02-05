import { create } from 'zustand';
import type { UserDetail } from '@/types/user';

type UserStore = {
  user: UserDetail | null;
  isLoggedIn: boolean;
  setUser: (user: UserDetail, keepLogin: boolean) => void;
  logout: () => void;
  initUser: () => void;
};

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoggedIn: false,

  // 로그인
  setUser: (user, keepLogin) => {
    if (typeof window !== 'undefined') {
      if (keepLogin) {
        localStorage.setItem('user', JSON.stringify(user)); // 영구 저장
      } else {
        sessionStorage.setItem('user', JSON.stringify(user)); // 임시 저장
      }
    }
    set({ user, isLoggedIn: true });
  },

  // 로그아웃
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
    }
    set({ user: null, isLoggedIn: false });
  },

  // 저장된 로그인 확인
  initUser: () => {
    if (typeof window === 'undefined') return;

    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const userData = localUser || sessionUser;

    if (userData) {
      set({ user: JSON.parse(userData), isLoggedIn: true });
    }
  },
}));
