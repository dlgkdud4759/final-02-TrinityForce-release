'use client';

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  useCallback,
  ReactNode,
} from 'react';

interface LocationModalContextType {
  isModalOpen: boolean;
  isLocationDenied: boolean;
  isLocationAllowed: boolean;
  openModal: () => void;
  closeModal: () => void;
  allowLocation: () => void;
  denyLocation: () => void;
  resetToHome: () => void;
}

const LocationModalContext = createContext<LocationModalContextType | null>(null);

// localStorage 구독 함수
function subscribeToStorage(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener('location:changed', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('location:changed', handler);
  };
}

// 클라이언트에서 localStorage 값 읽기
function getLocationAllowedSnapshot() {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('locationAllowed') === 'true';
}

// 서버에서 기본값 반환
function getLocationAllowedServerSnapshot() {
  return false;
}

// 클라이언트 마운트 감지
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function LocationModalProvider({ children }: { children: ReactNode }) {
  const hasMounted = useHasMounted();

  // useSyncExternalStore로 localStorage와 동기화
  const isLocationAllowed = useSyncExternalStore(
    subscribeToStorage,
    getLocationAllowedSnapshot,
    getLocationAllowedServerSnapshot
  );

  // 모달 명시적 제어 상태 (null = 자동 모드, true/false = 수동 제어)
  const [explicitModalState, setExplicitModalState] = useState<boolean | null>(null);
  const [isLocationDenied, setIsLocationDenied] = useState(false);

  // 모달 상태: 수동 제어 값이 있으면 그 값, 없으면 위치 미허용 시 자동 열기
  const isModalOpen = explicitModalState !== null
    ? explicitModalState
    : !isLocationAllowed;

  const openModal = useCallback(() => setExplicitModalState(true), []);
  const closeModal = useCallback(() => setExplicitModalState(false), []);

  const allowLocation = useCallback(() => {
    setIsLocationDenied(false);
    setExplicitModalState(false);
    localStorage.setItem('locationAllowed', 'true');
    window.dispatchEvent(new Event('location:changed'));
  }, []);

  const denyLocation = useCallback(() => {
    setIsLocationDenied(true);
    setExplicitModalState(false);
  }, []);

  const resetToHome = useCallback(() => {
    setIsLocationDenied(false);
    setExplicitModalState(null); // 자동 모드로 복귀
  }, []);

  // 클라이언트 마운트 전까지 렌더링 대기
  if (!hasMounted) {
    return null;
  }

  return (
    <LocationModalContext.Provider
      value={{
        isModalOpen,
        isLocationDenied,
        isLocationAllowed,
        openModal,
        closeModal,
        allowLocation,
        denyLocation,
        resetToHome,
      }}
    >
      {children}
    </LocationModalContext.Provider>
  );
}

export function useLocationModal() {
  const context = useContext(LocationModalContext);
  if (!context) {
    throw new Error('useLocationModal must be used within LocationModalProvider');
  }
  return context;
}
