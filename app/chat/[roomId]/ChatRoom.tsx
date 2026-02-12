'use client';

import HeaderSub from '@/components/layout/HeaderSub';
import ChatTransactionButton from '@/components/ui/ChatTransactionButton';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Chatting from '@/components/ui/Chatting';
import { useUserStore } from '@/zustand/useUserStore';
import useChat from '../_hooks/useChat';
import ChatInputForm from '../_components/ChatInputForm';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

interface ProductData {
  _id: number;
  name: string;
  content: string;
  mainImages?: { path: string; name: string }[];
}

// window 타입 확장 선언
declare global {
  interface Window {
    chatSocket?: import('socket.io-client').Socket;
  }
}

export default function ChatRoom({ roomId }: { roomId: string }) {
  console.log(roomId);
  // useChat 훅에서 채팅 관련 상태와 액션들을 가져옴
  const {
    activeRoomId,
    setActiveRoomId,
    rooms,
    messages,
    sendMessage,
    enterRoom,
  } = useChat();
  const user = useUserStore((state) => state.user); // 현재 로그인한 사용자 정보

  // 현재 활성화된 방 정보 찾기
  const activeRoom = rooms.find(
    (r) => activeRoomId !== undefined && String(r._id) === String(activeRoomId)
  );

  const [product, setProduct] = useState<ProductData | null>(null);

  // 초기 데이터 로드 및 가상 파트너 정보 가져오기
  useEffect(() => {
    if (!user?._id) return;

    const init = async () => {
      // 전달받은 정보를 기반으로 해당 채팅방 입장
      // postId: 게시글 ID(게시글에 대한 작성자와의 채팅), userId: 사용자 ID(사용자와의 일반 채팅)

      await enterRoom({ resourceType: 'room', resourceId: Number(roomId) });
    };

    init();
  }, [user, enterRoom, roomId]);

  useEffect(() => {
    return () => {
      setActiveRoomId(undefined);
      // 방에서 나갈 때 소켓에도 방 나감 신호 전달
      if (typeof window !== 'undefined') {
        const chatSocket = window.chatSocket;
        if (chatSocket && chatSocket.connected) {
          chatSocket.emit('setActiveRoomId', undefined);
        }
      }
    };
  }, [setActiveRoomId]);

  // 게시글 정보 로드
  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!activeRoom) return;

      // resourceType이 'product'이고 resourceId가 있을 때만
      if (activeRoom.resourceType === 'product' && activeRoom.resourceId) {
        try {
          const res = await fetch(
            `${API_URL}/products/${activeRoom.resourceId}`,
            {
              headers: { 'client-id': CLIENT_ID || '' },
            }
          );
          const data = await res.json();

          if (res.ok) {
            setProduct(data.item);
          }
        } catch (error) {
          console.error('게시글 정보 조회 실패:', error);
        }
      }
    };

    fetchProductInfo();
  }, [activeRoom]);

  // 이미지 URL 처리
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/images/book1.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath}`;
  };

  if (!user) return null;

  // 현재 방의 멤버 중 내가 아닌 상대방 정보 추출
  const partner = activeRoom?.members.find(
    (m) => String(m._id) !== String(user._id)
  );

  // 본인이 방의 개설자(ownerId)이면 '문의', 아니면 '답변'으로 표시
  // const chatType = activeRoom?.ownerId === user._id ? '문의' : '답변';

  return (
    <>
      <HeaderSub title={partner?.name} />

      {/* 게시글 정보 / 후기 작성 */}
      <div className="fixed right-0 left-0 bg-bg-primary border-b border-border-primary py-3 px-2 md:py-4 md:px-4 lg:px-6">
        <div className="flex flex-col gap-1 p-2 md:p-3">
          <article className="flex items-center gap-2 md:gap-3">
            <Image
              className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-border-primary rounded-md object-cover"
              alt="게시글 이미지"
              src={getImageUrl(product?.mainImages?.[0]?.path)}
              width={56}
              height={56}
            />
            <div className="flex-1 flex flex-col gap-0.5 min-w-0">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold text-font-dark truncate">
                {product?.name}
              </h3>
              <p className="text-xs md:text-sm font-medium text-gray-dark truncate">
                {product?.content}
              </p>
            </div>
          </article>

          {/* 완료 / 후기 버튼 */}
          <ChatTransactionButton
            orderId={activeRoom?._id || 0}
            productId={activeRoom?.resourceId || 0}
            isOwner={String(activeRoom?.ownerId) !== String(user._id)}
          />
        </div>
      </div>

      {/* 채팅 내용 */}
      <div className="pt-27.75 md:pt-33.5 lg:pt-35.75 pb-14">
        {messages.map((msg, index) => (
          <Chatting
            key={msg._id || index}
            message={msg}
            isMine={String(msg.senderId) === String(user._id)}
            sender={partner || undefined}
            currentUser={user}
          />
        ))}
      </div>

      {/* 채팅 입력 폼 */}
      <ChatInputForm onSendMessage={sendMessage} />
    </>
  );
}
