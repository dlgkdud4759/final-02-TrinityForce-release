'use client'

import Link from 'next/link';
import { MapPin, ChevronLeft } from 'lucide-react';
import { useLocationStore } from '@/zustand/useLocationStore';

interface HeaderSubProps {
  title?: string;
  backUrl?: string;
}

export default function HeaderSub({ title = '헤더', backUrl }: HeaderSubProps) {
  const address = useLocationStore((state) => state.address);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-15 px-4 bg-bg-primary">
      {backUrl ? (
        <Link href={backUrl}>
          <ChevronLeft size={32}/>
        </Link>
      ) : (
        <button onClick={() => window.history.back()}>
          <ChevronLeft size={32}/>
        </button>
      )}

      {/* 중앙 텍스트 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
        {title}
      </h1>

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
