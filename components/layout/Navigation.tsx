// app/components/common/NavigationBar.tsx
import { House, Users, FilePlus, MessageSquareMore, User } from 'lucide-react';

export default function NavigationBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-16 md:h-20 max-w-6xl mx-auto px-4">
        {/* 홈 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center p-2 md:p-3 text-gray-medium hover:text-brown-accent active:text-brown-accent transition-colors"
          aria-label="홈"
        >
          <House size={24} className="md:w-7 md:h-7" />
        </button>

        {/* 모임 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center p-2 md:p-3 text-gray-medium hover:text-brown-accent active:text-brown-accent transition-colors"
          aria-label="모임"
        >
          <Users size={24} className="md:w-7 md:h-7" />
        </button>

        {/* 게시글 작성 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center p-2 md:p-3 text-gray-medium hover:text-brown-accent active:text-brown-accent transition-colors"
          aria-label="게시글 작성"
        >
          <FilePlus size={24} className="md:w-7 md:h-7" />
        </button>

        {/* 채팅 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center p-2 md:p-3 text-gray-medium hover:text-brown-accent active:text-brown-accent transition-colors"
          aria-label="채팅"
        >
          <MessageSquareMore size={24} className="md:w-7 md:h-7" />
        </button>

        {/* 마이페이지 버튼 */}
        <button
          type="button"
          className="flex items-center justify-center p-2 md:p-3 text-gray-medium hover:text-brown-accent active:text-brown-accent transition-colors"
          aria-label="마이페이지"
        >
          <User size={24} className="md:w-7 md:h-7" />
        </button>
      </div>
    </nav>
  );
}