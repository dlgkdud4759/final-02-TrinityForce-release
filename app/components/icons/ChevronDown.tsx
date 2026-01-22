// 검색바 - 카테고리 드롭다운 아이콘
export function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={16}
      height={16}
      viewBox="0 0 16 16"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.946 5.45337H4.05268C3.41268 5.45337 3.09268 6.2267 3.54601 6.68004L6.99934 10.1334C7.55268 10.6867 8.45268 10.6867 9.00601 10.1334L10.3193 8.82004L12.4593 6.68004C12.906 6.2267 12.586 5.45337 11.946 5.45337Z"
        fill="currentColor"
      />
    </svg>
  );
}
