import { ChatRoom } from './chat';

export interface ChatRoomListRes {
  ok: 1;
  item: ChatRoom[];
}

export interface ChatRoomInfoRes {
  ok: 1;
  item: ChatRoom;
}
