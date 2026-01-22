// 소셜 로그인 - 카카오 아이콘
export function KakaoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={20}
      height={20}
      viewBox="0 0 20 20"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="9.56239" cy="9.56239" r="9.56239" fill="#FEE500" />
      <rect
        width="9.56239"
        height="9.56239"
        transform="translate(4.78125 4.78125)"
        fill="#FEE500"
      />
      <path
        d="M9.43985 5.18188C6.97651 5.18188 4.78125 6.88622 4.78125 8.98859C4.78125 10.2957 5.63042 11.4487 6.92339 12.1341L6.37934 14.131C6.33112 14.3078 6.53218 14.4484 6.68637 14.346L9.07125 12.7645C9.2723 12.7838 9.4769 12.7953 9.43985 12.7953C12.3933 12.7953 14.3436 11.0907 14.3436 8.98859C14.3436 6.88622 12.3933 5.18188 9.43985 5.18188Z"
        fill="black"
      />
      <defs>
        <clipPath id="clip0_167_1558">
          <rect
            width="9.56239"
            height="9.56239"
            fill="white"
            transform="translate(4.78125 4.78125)"
          />
        </clipPath>
      </defs>
    </svg>
  );
}
