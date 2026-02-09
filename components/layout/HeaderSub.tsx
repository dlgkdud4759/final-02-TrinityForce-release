'use client'

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, Bell, ChevronLeft } from 'lucide-react';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import LoginModal from '@/components/modals/LoginModal';

interface HeaderSubProps {
  title?: string;
  backUrl?: string;
}

export default function HeaderSub({ title = '헤더', backUrl }: HeaderSubProps) {
  const router = useRouter();
  const { showLogin, setShowLogin, checkAuth } = useRequireAuth();

  const goToAlert = () => {
    checkAuth(() => {
      router.push('/alert');
    });
  };

  return (
    <>
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

        {/* 오른쪽 아이콘 영역 */}
        <div className="flex items-center gap-3">

          {/* 위치 재설정 버튼 */}
          <Link href="/location" aria-label="위치 설정" className="cursor-pointer">
            <MapPin size={24} className="text-font-dark" />
          </Link>

          {/* 알림 버튼 */}
          <button type="button" onClick={goToAlert} aria-label="알림" className="relative cursor-pointer">
            <Bell size={24} className="text-font-dark" />
          </button>
        </div>
      </header>

      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
      />
    </>
  );
}
