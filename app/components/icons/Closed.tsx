// 헤더 - 닫기 아이콘
export function ClosedIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={28}
      height={28}
      viewBox="0 0 28 28"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21 7L7 21"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M7 7L21 21"
        stroke="black"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
}
