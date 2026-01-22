// 바텀바 - 채팅 아이콘
export function ChatIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M21.7 4H5.69995C4.59995 4 3.69995 4.9 3.69995 6V24L7.69995 20H21.7C22.8 20 23.7 19.1 23.7 18V6C23.7 4.9 22.8 4 21.7 4ZM21.7 18H6.86995L5.69995 19.17V6H21.7V18ZM8.69995 11H10.7V13H8.69995V11ZM16.7 11H18.7V13H16.7V11ZM12.7 11H14.7V13H12.7V11Z"
        fill="currentColor"
      />
      <defs>
        <clipPath id="clip0_162_1976">
          <rect width="24" height="24" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}
