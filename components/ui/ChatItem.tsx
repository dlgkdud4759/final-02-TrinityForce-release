'use client';

import { ChatRoomState } from '@/app/chat/_types/chat';
import { useUserStore } from '@/zustand/useUserStore';
import useChatStore from '@/app/chat/_zustand/chatStore';
import Image from 'next/image';
import Link from 'next/link';

interface ChatRoomItemProps {
  room: ChatRoomState; // 채팅방 상태 정보 (방 정보, 마지막 메시지, 읽지 않은 수 등)
  isActive: boolean; // 현재 활성화(선택)된 방인지 여부
  onSelect: (id: string) => void; // 방 선택 시 실행될 핸들러
  onLeave: (id: string) => void; // 방 나가기 버튼 클릭 시 실행될 핸들러
}

export default function ChatItem({
  room,
  isActive,
  onSelect,
  onLeave,
}: ChatRoomItemProps) {
  const { user: currentUser } = useUserStore();
  const { setActiveRoomId } = useChatStore();

  // 현재 로그인한 사용자를 제외한 상대방 정보 추출
  const partner = room.members.find(
    (m) => String(m._id) !== String(currentUser?._id)
  );
  const displayName = partner?.name || '알 수 없는 사용자';
  const displayImage = partner?.image || '/images/favicon.svg';

  // 마지막 메시지 정보
  const lastMessage = room.lastMessage;

  // 채팅방 유형 정의 (본인이 만든 방일 경우 '문의', 상대방이 만든 방일 경우 '답변')
  // const chatType = room.ownerId === currentUser?._id ? '문의' : '답변';

  // 읽지 않은 메시지 수
  // const unreadCount = room.unreadCount || 0;

  // 마지막 메시지 내용 렌더링 함수
  const renderLastMessage = () => {
    if (!lastMessage) return '새로운 채팅방이 생성되었습니다.';
    return lastMessage.content || '새로운 메시지가 있습니다.';
  };

  // 채팅방 나가기 클릭 핸들러 (부모로 이벤트 전달)
  // const handleLeave = (e: React.MouseEvent) => {
  //   e.stopPropagation(); // 부모의 onClick(onSelect) 방지
  //   onLeave(String(room._id));
  // };

  return (
    <Link
      href={`/chat/${room._id}`}
      onClick={() => {
        // 즉시 활성화 처리하여 UI에서 언리드 카운트 제거
        setActiveRoomId(room._id);
      }}
    >
      <article className="flex items-center mx-4 my-3">
        <Image
          className="shrink-0 w-10.5 h-10.5 rounded-lg bg-border-primary"
          alt={`${displayName} 프로필`}
          src={displayImage}
          width={42}
          height={42}
        />
        <div className="flex flex-col gap-0.5 h-9.5 ml-2 flex-1 min-w-0">
          <h3 className="h-5 text-mg font-semibold text-font-dark">
            {displayName}
          </h3>
          <p className="h-4 ml-0.5 text-xs font-medium text-gray-dark truncate">
            {renderLastMessage()}
          </p>
        </div>
        {room.unreadCount ? (
          <div className="ml-3 shrink-0">
            <span className="inline-flex items-center justify-center bg-red-like text-white rounded-full w-6 h-6 text-xs font-semibold">
              {room.unreadCount}
            </span>
          </div>
        ) : null}
      </article>
    </Link>
  );
}
