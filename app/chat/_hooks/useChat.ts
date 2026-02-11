import { useCallback, useEffect, useMemo } from 'react';
import useChatStore from '../_zustand/chatStore';
import { getRoomInfo } from '../_api/chat';
import { useUserStore } from '@/zustand/useUserStore';

export default function useChat() {
  const { user } = useUserStore();
  const accessToken = user?.token?.accessToken;

  const {
    chatSocket, // 채팅 소켓 객체
    connectSocket, // 소켓 연결 함수
    disconnectSocket, // 소켓 연결 해제 함수
    messagesByRoom, // 룸 ID별 메시지 목록
    setMessages, // 메시지 설정 함수
    rooms, // 채팅 룸 목록
    activeRoomId, // 현재 활성화된 룸 ID
    setActiveRoomId, // 활성 룸 설정 함수
    addRooms, // 룸 추가 함수
  } = useChatStore();

  // 모든 채팅방의 읽지 않은 메시지 수 합계
  const totalUnreadCount = useMemo(() => {
    return rooms.reduce((acc, room) => acc + (room.unreadCount || 0), 0);
  }, [rooms]);

  // 로그인된 사용자라면 채팅 서버에 연결하고, 그렇지 않다면 연결 해제
  useEffect(() => {
    if (user) {
      connectSocket(user);
    } else {
      disconnectSocket();
    }
  }, [user, connectSocket, disconnectSocket]);

  // 채팅방 입장 (기존 방 선택 혹은 새로운 상대와의 채팅 시작)
  const enterRoom = useCallback(
    async ({
      resourceType,
      resourceId,
    }: {
      resourceType: string;
      resourceId: number;
    }): Promise<number | null> => {
      if (!accessToken || !user) return null;

      // 이미 존재하는 방을 선택할 경우 우선 활성화 (빠른 반응성)
      if (resourceType === 'room') {
        setActiveRoomId(resourceId);
      }

      try {
        // 1. 조건에 맞는 채팅방 정보를 서버에 요청 (없으면 서버에서 생성하여 반환)
        const targetRoom = await getRoomInfo({
          accessToken,
          resourceType,
          resourceId,
        });

        // 2. 채팅방 활성화 및 과거 메시지 설정
        setActiveRoomId(targetRoom._id);
        setMessages(targetRoom._id, targetRoom.messages || []);

        // 3. 채팅방 목록에 추가
        addRooms(targetRoom, user._id);

        // 4. 소켓 서버에 현재 활성 룸 알림
        if (chatSocket?.connected) {
          chatSocket.emit('setActiveRoomId', targetRoom._id);
        }

        // 5. 생성/조회된 채팅방 ID 반환
        return targetRoom._id;
      } catch (err) {
        if (err instanceof Error) {
          console.error('[useChat] 방 입장 실패:', err.message);
        }
        return null;
      }
    },
    [accessToken, user, setActiveRoomId, setMessages, addRooms, chatSocket]
  );

  // 메시지 전송
  const sendMessage = useCallback(
    async (msg: string) => {
      if (!user || !chatSocket?.connected || !activeRoomId) return;

      // 현재 방의 멤버 중 내가 아닌 상대방 찾기
      const activeRoom = rooms.find((r) => r._id === activeRoomId);
      const partner = activeRoom?.members.find(
        (m) => String(m._id) !== String(user._id)
      );

      chatSocket.emit('message', {
        roomId: activeRoomId,
        targetUserId: partner?._id,
        content: msg,
      });
    },
    [user, chatSocket, activeRoomId, rooms]
  );

  // 채팅방 나가기
  const leaveRoom = useCallback(
    (chatId: number) => {
      if (!chatSocket) return false;

      if (confirm('이 채팅방을 나가시겠습니까? 대화 기록이 삭제됩니다.')) {
        chatSocket.emit('leave', chatId);
        useChatStore.getState().leaveRoom(chatId); // 목록에서 즉시 제거
        return true;
      }
      return false;
    },
    [chatSocket]
  );

  return {
    chatSocket, // 채팅 소켓 객체
    messages: activeRoomId ? messagesByRoom[activeRoomId] || [] : [], // 현재 활성화된 방의 메시지 목록
    rooms, // 전체 채팅방 목록
    activeRoomId, // 현재 활성화된 방의 ID
    setActiveRoomId, // 활성화된 방 ID 설정 함수
    totalUnreadCount, // 모든 방의 읽지 않은 메시지 총합
    enterRoom, // 방 입장 함수
    leaveRoom, // 방 나가기 함수
    sendMessage, // 메시지 전송 함수
  };
}
