import { useState } from 'react';
import { useUserStore } from '@/zustand/useUserStore';

export function useRequireAuth() {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const [showLogin, setShowLogin] = useState(false);

  // 로그인
  const checkAuth = (callback: () => void) => {
    if (!isLoggedIn) {
      setShowLogin(true);  // 비회원이면 모달 띄우기
      return false;
    }
    callback();  // 로그인 상태면 원래 동작 실행
    return true;
  };

  return { showLogin, setShowLogin, checkAuth };
}