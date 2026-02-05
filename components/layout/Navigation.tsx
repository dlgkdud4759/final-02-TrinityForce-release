'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House, Users, FilePlus, MessageSquareMore, User } from 'lucide-react';
import LoginModal from '@/components/modals/LoginModal';
import useAuthStatus from '@/utils/useAuthStatus';

export default function NavigationBar() {
  const pathname = usePathname();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isLoggedIn = useAuthStatus();

  const getLinkClassName = (href: string) => {
    const isActive = href === '/' ? pathname === '/' : pathname.startsWith(href);
    return `flex items-center justify-center p-2 md:p-3 transition-colors ${
      isActive ? 'text-brown-accent' : 'text-gray-medium hover:text-brown-accent'
    }`;
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16 md:h-20 max-w-6xl mx-auto px-4">
        {/* 홈 버튼 */}
        <Link href="/" className={getLinkClassName('/')} aria-label="홈">
          <House size={24} className="md:w-7 md:h-7" />
        </Link>

        {/* 모임 버튼 */}
        <Link href="/meetup" className={getLinkClassName('/meetup')} aria-label="모임">
          <Users size={24} className="md:w-7 md:h-7" />
        </Link>

        {/* 게시글 작성 버튼 */}
        <Link
          href={isLoggedIn ? '/book-registration' : '/user/login'}
          className={getLinkClassName('/book-registration')}
          aria-label="게시글 작성"
        >
          <FilePlus size={24} className="md:w-7 md:h-7" />
        </Link>

        {/* 채팅 버튼 */}
        {isLoggedIn ? (
          <Link href="/chat" className={getLinkClassName('/chat')} aria-label="채팅">
            <MessageSquareMore size={24} className="md:w-7 md:h-7" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => setIsLoginModalOpen(true)}
            className={getLinkClassName('/chat')}
            aria-label="채팅"
          >
            <MessageSquareMore size={24} className="md:w-7 md:h-7" />
          </button>
        )}

        {/* 마이페이지 버튼 */}
        <Link
          href={isLoggedIn ? '/user/mypage' : '/user/login'}
          className={getLinkClassName('/user/mypage')}
          aria-label="마이페이지"
        >
          <User size={24} className="md:w-7 md:h-7" />
        </Link>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </nav>
  );
}
