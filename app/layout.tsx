'use client'

import './globals.css';
import LayoutWrapper from '@/components/layout/LayoutWrapper';
import { useEffect } from 'react';
import { useUserStore } from '@/zustand/useUserStore';
import { useLikeStore } from '@/zustand/useLikeStore';
import Script from 'next/script';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initUser = useUserStore((state) => state.initUser);
  const user = useUserStore((state) => state.user);
  const setCurrentUser = useLikeStore((state) => state.setCurrentUser);

  // 유저 정보 불러오기
  useEffect(() => {
    initUser();
  }, [initUser]);

  // 유저 변경 시 좋아요 스토어 동기화
  useEffect(() => {
    setCurrentUser(user?._id || null);
  }, [user?._id, setCurrentUser]);

  return (
    <html lang="ko">
      <head>
        <Script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JS_KEY}&autoload=false`}
          strategy="beforeInteractive"
        />
      </head>
      <body>
        <LayoutWrapper>{children}</LayoutWrapper>
      </body>
    </html>
  );
}
