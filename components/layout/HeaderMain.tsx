'use client'

import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { useLocationStore } from '@/zustand/useLocationStore';

export default function HeaderMain() {
  const address = useLocationStore((state) => state.address);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-15 pr-4 bg-bg-primary">
      {/* 로고 */}
      <Link href="/">
        <Image
          src="/images/Logo.png"
          alt="동네책장 로고"
          width={70}
          height={1}
          priority
        />
      </Link>

      {/* 오른쪽: 위치 재설정 버튼 */}
      <Link href="/location" aria-label="위치 설정" className="flex items-center gap-1 cursor-pointer">
        <MapPin size={24} className="text-font-dark" />
        {address && (
          <span className="text-sm text-font-dark font-medium max-w-20 truncate">
            {address}
          </span>
        )}
      </Link>
    </header>
  );
}
