// app/components/common/NavigationBar.tsx
'use client';

import Link from 'next/link';
import { House, Users, FilePlus, MessageSquareMore, User } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useRequireAuth } from '@/app/hooks/useRequireAuth';
import LoginModal from '@/components/modals/LoginModal';
import useChat from '@/app/chat/_hooks/useChat';

export default function NavigationBar() {
  const router = useRouter();
  const pathname = usePathname();
  const { showLogin, setShowLogin, checkAuth } = useRequireAuth();
  const { totalUnreadCount } = useChat();

  if (pathname.startsWith('/chat/')) {
    return null;
  }

  const getNavClass = (path: string) => {
    const isActive =
      path === '/'
        ? pathname === '/' ||
          pathname.startsWith('/book-detail') ||
          pathname.startsWith('/search')
        : pathname.startsWith(path);
    return `flex items-center justify-center p-2 md:p-3 transition-colors cursor-pointer ${
      isActive
        ? 'text-brown-accent'
        : 'text-gray-medium hover:text-brown-accent'
    }`;
  };

  // 게시글 작성 클릭
  const goToCreatePost = () => {
    checkAuth(() => {
      router.push('/book-registration');
    });
  };

  // 채팅 클릭
  const goToChat = () => {
    checkAuth(() => {
      router.push('/chat');
    });
  };

  // 내 정보 클릭
  const goToMyPage = () => {
    checkAuth(() => {
      router.push('/user/mypage');
    });
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="flex items-center justify-around h-16 md:h-20 max-w-6xl mx-auto px-4">
          {/* 홈 버튼 */}
          <Link href="/" className={getNavClass('/')} aria-label="홈">
            <House size={24} className="md:w-7 md:h-7" />
          </Link>

          {/* 모임 버튼 */}
          <Link
            href="/meetup"
            className={getNavClass('/meetup')}
            aria-label="모임"
          >
            <Users size={24} className="md:w-7 md:h-7" />
          </Link>

          {/* 게시글 작성 버튼 */}
          <button
            onClick={goToCreatePost}
            className={getNavClass('/book-registration')}
            aria-label="게시글 작성"
          >
            <FilePlus size={24} className="md:w-7 md:h-7" />
          </button>

          {/* 채팅 버튼 */}
          <button
            onClick={goToChat}
            className={getNavClass('/chat')}
            aria-label="채팅"
            style={{ position: 'relative' }}
          >
            <MessageSquareMore size={24} className="md:w-7 md:h-7" />
            {totalUnreadCount > 0 && (
              <span className="absolute top-1.5 right-0.75 w-4 h-4 md:w-4.5 md:h-4.5 bg-red-like/90 text-white rounded-full text-[12px] flex items-center justify-center px-1 font-semibold shadow-md z-10">
                {totalUnreadCount}
              </span>
            )}
          </button>

          {/* 마이페이지 버튼 */}
          <button
            onClick={goToMyPage}
            className={getNavClass('/user')}
            aria-label="마이페이지"
          >
            <User size={24} className="md:w-7 md:h-7" />
          </button>
        </div>
      </nav>

      {/* 로그인 모달 */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  );
}
