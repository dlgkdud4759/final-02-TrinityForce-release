'use client'

import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/useUserStore';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initUser = useUserStore((state) => state.initUser);  // ✨ 추가!
  
  // 유저 정보 불러오기
  useEffect(() => {
    initUser();
  }, [initUser]);

  return (
    <html lang="ko">
      <body>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
          strategy="afterInteractive"
        />
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
