import { User } from '@/types/user';

export interface ChatMessage {
  _id?: string | number;
  senderId: number;
  readUserIds: number[];
  content: string;
  createdAt: string;
}

export type ChatType = 'ask' | 'answer';

export interface ChatMember extends User {
  leftAt?: string; // 채팅방을 나간 시간(상대방이 대화를 이어서 진행해도 이 시간 이전의 메시지는 보여주지 않음)
}

// api 서버의 응답 채팅방 타입
export interface ChatRoom {
  _id: number;
  resourceType: string;
  resourceId: number;
  roomName: string;
  ownerId: number; // 채팅방을 개설한 사람
  members: ChatMember[];
  messages: ChatMessage[];
  updatedAt: string;
  createdAt: string;
}

// Chat Store에서 관리하는 채팅방 타입
export interface ChatRoomState extends ChatRoom {
  unreadCount: number;
  lastMessage?: ChatMessage;
}
