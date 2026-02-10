import { ChatRoomInfoRes, ChatRoomListRes } from '../_types/api';
import { apiCall } from './api';

/**
 * 내 채팅방 목록 조회
 */
export async function getMyRooms(accessToken: string) {
  return apiCall<ChatRoomListRes>(`/chats`, { accessToken });
}

/**
 * 채팅방 상세 조회(없을 경우 생성)
 */
export async function getRoomInfo({
  accessToken,
  resourceType,
  resourceId,
}: {
  accessToken: string;
  resourceType: string;
  resourceId: number;
}) {
  return apiCall<ChatRoomInfoRes>(`/chats/${resourceType}/${resourceId}`, {
    accessToken,
  });
}

// 서버 검증 에러 타입
export interface ServerValidationError {
  type: string;
  value: string;
  msg: string;
  location: string;
}

// 에러 타입
export interface ErrorRes {
  ok: 0;
  message: string;
  errors?: {
    [fieldName: string]: ServerValidationError;
  };
}
