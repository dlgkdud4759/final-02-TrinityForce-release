// 내 정보 - 알림 설정 토글 - 활성화 아이콘
export function AlertToggleOnIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={40}
      height={22}
      viewBox="0 0 40 22"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="40" height="22" rx="11" fill="#966E4F" />
      <circle cx="29" cy="11" r="8" fill="white" />
    </svg>
  );
}
