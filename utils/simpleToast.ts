// 아주 간단한 토스트 유틸 (react-hot-toast 미사용)
export function showSimpleToast(message: string) {
  if (typeof window === 'undefined') return;
  const toast = document.createElement('div');
  toast.innerText = message;
  toast.style.position = 'fixed';
  toast.style.bottom = '60px';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = 'rgba(60, 60, 60, 0.95)';
  toast.style.color = '#fff';
  toast.style.padding = '12px 24px';
  toast.style.borderRadius = '999px';
  toast.style.fontSize = '16px';
  toast.style.zIndex = '9999';
  toast.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
  toast.style.opacity = '0';
  toast.style.transition = 'opacity 0.3s';
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '1';
  }, 10);
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), 300);
  }, 1800);
}
