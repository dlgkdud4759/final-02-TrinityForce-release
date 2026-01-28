'use client';

import { createContext, useContext, useState, useSyncExternalStore, useCallback, ReactNode } from 'react';

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
  window.addEventListener('storage', callback);
  return () => window.removeEventListener('storage', callback);
}

// 클라이언트에서 localStorage 값 읽기
function getLocationAllowedSnapshot() {
  return localStorage.getItem('locationAllowed') === 'true';
}

// 서버에서 기본값 반환
function getLocationAllowedServerSnapshot() {
  return false;
}

export function LocationModalProvider({ children }: { children: ReactNode }) {
  // useSyncExternalStore로 localStorage와 동기화
  const isLocationAllowedFromStorage = useSyncExternalStore(
    subscribeToStorage,
    getLocationAllowedSnapshot,
    getLocationAllowedServerSnapshot
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLocationDenied, setIsLocationDenied] = useState(false);
  const [isLocationAllowed, setIsLocationAllowed] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기화 로직 - 최초 렌더링 시 한 번만 실행
  if (!isInitialized && typeof window !== 'undefined') {
    setIsModalOpen(!isLocationAllowedFromStorage);
    setIsLocationAllowed(isLocationAllowedFromStorage);
    setIsInitialized(true);
  }

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const allowLocation = useCallback(() => {
    setIsLocationAllowed(true);
    setIsLocationDenied(false);
    setIsModalOpen(false);
    localStorage.setItem('locationAllowed', 'true');
  }, []);

  const denyLocation = useCallback(() => {
    setIsLocationDenied(true);
    setIsModalOpen(false);
  }, []);

  const resetToHome = useCallback(() => {
    setIsLocationDenied(false);
    const allowed = localStorage.getItem('locationAllowed') === 'true';
    if (!allowed) {
      setIsModalOpen(true);
    }
  }, []);

  // 클라이언트에서 초기화될 때까지 렌더링 대기
  if (!isInitialized) {
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
