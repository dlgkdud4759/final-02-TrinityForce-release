'use client';

import { useSyncExternalStore } from 'react';

function subscribe(callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  const handler = () => callback();
  window.addEventListener('storage', handler);
  window.addEventListener('user:changed', handler);
  return () => {
    window.removeEventListener('storage', handler);
    window.removeEventListener('user:changed', handler);
  };
}

function getSnapshot() {
  if (typeof window === 'undefined') return false;
  const localUser = localStorage.getItem('user');
  const sessionUser = sessionStorage.getItem('user');
  return !!(localUser || sessionUser);
}

function getServerSnapshot() {
  return false;
}

export default function useAuthStatus() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
