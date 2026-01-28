import Link from 'next/link';
import { MapPin, Bell, ChevronLeft} from 'lucide-react';

interface HeaderSubProps {
  title?: string;
}

export default function HeaderSub({ title = '헤더' }: HeaderSubProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between h-15 px-4 bg-bg-primary">
      {/* 왼쪽 뒤로가기 */}
      <Link href="/" >
        <ChevronLeft size={32}/>
      </Link>

      {/* 중앙 텍스트 */}
      <h1 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold">
        {title}
      </h1>

      {/* 오른쪽 아이콘 영역 */}
      <div className="flex items-center gap-3">
        
        {/* 위치 재설정 버튼 */}
        <button type="button" aria-label="위치 설정">
          <MapPin size={24} className="text-font-dark" />
        </button>

        {/* 알림 버튼 */}
        <button type="button" aria-label="알림" className="relative">
          <Bell size={24} className="text-font-dark" />
        </button>
      </div>
    </header>
  );
}
