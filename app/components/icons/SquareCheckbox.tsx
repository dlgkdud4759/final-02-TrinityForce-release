// 후기 작성 - 체크박스 아이콘
export function SquareCheckboxIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width={30}
      height={30}
      viewBox="0 0 30 30"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3 10C3 5.58173 6.58172 2 11 2H19C23.4183 2 27 5.58172 27 10V18C27 22.4183 23.4183 26 19 26H11C6.58173 26 3 22.4183 3 18V10Z"
        fill="currentColor"
      />
      <path
        d="M22.2203 8.37719C22.5643 8.68295 22.5953 9.20968 22.2895 9.55367L13.4006 19.5537C13.2425 19.7316 13.0158 19.8334 12.7778 19.8334C12.5398 19.8334 12.3131 19.7316 12.1549 19.5537L7.7105 14.5537C7.40474 14.2097 7.43572 13.683 7.77971 13.3772C8.12369 13.0714 8.65042 13.1024 8.95618 13.4464L12.7778 17.7457L21.0438 8.44639C21.3496 8.10241 21.8763 8.07142 22.2203 8.37719Z"
        fill="white"
      />
      <defs>
        <filter
          id="filter0_dd_307_2054"
          x="0"
          y="0"
          width="30"
          height="30"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1" />
          <feGaussianBlur stdDeviation="1.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.101961 0 0 0 0 0.101961 0 0 0 0 0.101961 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_307_2054"
          />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="0.5" />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0.101961 0 0 0 0 0.101961 0 0 0 0 0.101961 0 0 0 0.08 0"
          />
          <feBlend
            mode="normal"
            in2="effect1_dropShadow_307_2054"
            result="effect2_dropShadow_307_2054"
          />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect2_dropShadow_307_2054"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
}
