import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Bell } from 'lucide-react';

export default function HeaderMain() {
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

      {/* 오른쪽 아이콘 영역 */}
      <div className="flex items-center gap-3">
        {/* 위치 재설정 버튼 */}
        <Link href="/location" aria-label="위치 설정" className="cursor-pointer">
          <MapPin size={24} className="text-font-dark" />
        </Link>

        {/* 알림 버튼 */}
        <button type="button" aria-label="알림" className="relative cursor-pointer">
          <Bell size={24} className="text-font-dark" />
        </button>
      </div>
    </header>
  );
}
