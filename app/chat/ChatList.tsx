'use client';

import { useUserStore } from '@/zustand/useUserStore';
import useChat from './_hooks/useChat';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import ChatItem from '@/components/ui/ChatItem';

export default function ChatList() {
  const {
    rooms, // 채팅방 목록
    activeRoomId, // 현재 활성화된 방의 ID
    leaveRoom, // 채팅방 나가기
    enterRoom, // 채팅방 입장
  } = useChat();

  console.log(rooms);

  const { user: currentUser } = useUserStore();

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!currentUser) {
    }
  }, [currentUser, router, pathname, searchParams]);

  if (!currentUser) {
    return (
      <div className="flex justify-center items-center min-h-75">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200">
          잠시만 기다려 주세요...
        </h3>
      </div>
    );
  }

  return (
    <main className="fixed top-17.5 left-0 right-0 bottom-0 flex flex-col overflow-hidden bg-white dark:bg-gray-800 z-0">
      <div className="flex-1 flex items-stretch h-full min-h-0 overflow-hidden">
        {/* 채팅방 목록 */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
          {rooms.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-center">
              <p className="text-sm">참여 중인 대화가 없습니다.</p>
            </div>
          ) : (
            rooms.map((room) => (
              <ChatItem
                key={room._id}
                room={room}
                isActive={activeRoomId === room._id}
                onSelect={(id) => {
                  enterRoom({ resourceType: 'room', resourceId: Number(id) });
                  // 선택 시 URL 파라미터 초기화
                  router.replace(pathname);
                }}
                onLeave={(id) => {
                  leaveRoom(Number(id));
                }}
              />
            ))
          )}
        </div>
      </div>
    </main>
  );
}
