'use client';

import { usePathname } from 'next/navigation';
import HeaderMain from '@/components/layout/HeaderMain';
import Navigation from '@/components/layout/Navigation';
import { LocationModalProvider } from '@/contexts/LocationModalContext';

// HeaderMain을 숨길 페이지 경로들
const hideHeaderMainPaths = ['/meetup', '/location', '/book-detail'];

// 상단 패딩이 필요 없는 페이지 경로들
const noPaddingPaths = ['/location'];

export default function LayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const shouldHideHeaderMain = hideHeaderMainPaths.some((path) =>
    pathname.startsWith(path)
  );
  const shouldHidePadding = noPaddingPaths.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <LocationModalProvider>
      {!shouldHideHeaderMain && <HeaderMain />}
      <div className={shouldHidePadding ? '' : 'pt-15'}>
        {children}
      </div>
      <Navigation />
    </LocationModalProvider>
  );
}
