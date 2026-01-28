'use client';

import HeaderSub from '@/components/layout/HeaderSub';
import ChatTransactionButton from '@/components/ui/ChatTransactionButton';
import Image from 'next/image';
import { ChatPictureIcon } from '../../components/icons/ChatPicture';
import { SendIcon } from '../../components/icons/Send';
import { useState } from 'react';
import Chatting from '@/components/ui/Chatting';

export default function ChattingPage() {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // 여기서 메시지 전송 로직 처리
      console.log('메시지 전송:', message);
      setMessage(''); // 전송 후 입력창 초기화
    }
  };

  return (
    <>
      <HeaderSub />

      {/* 게시글 정보 / 후기 작성 */}
      <div className="fixed right-0 left-0 bg-bg-primary border-b border-border-primary py-4 px-2">
        <div className="flex flex-col gap-1 p-2">
          <article className="flex items-center">
            <Image
              className="shrink-0 w-9 h-9 rounded-lg bg-border-primary"
              alt="사용자 프로필"
              src={'/'}
              width={36}
              height={36}
            />
            <div className="flex-1 flex-col gap-0.5 h-9.5 ml-2 min-w-0">
              <h3 className="h-5 text-mg font-semibold text-font-dark">제목</h3>
              <p className="h-4 ml-0.5 text-xs font-medium text-gray-dark truncate">
                게시글 내용입니다. 게시글 내용입니다. 게시글 내용입니다. 게시글
                내용입니다. 게시글 내용입니다. 게시글 내용입니다.
              </p>
            </div>
          </article>
          <ChatTransactionButton />
        </div>
      </div>

      {/* 채팅 내용 */}
      <div className="pt-29.25 pb-12">
        <Chatting isMine={false} />
        <Chatting isMine={false} />
        <Chatting isMine={true} />
        <Chatting isMine={false} />
        <Chatting isMine={false} />
        <Chatting isMine={true} />
        <Chatting isMine={false} />
        <Chatting isMine={true} />
        <Chatting isMine={false} />
        <Chatting isMine={true} />
        <Chatting isMine={false} />
        <Chatting isMine={true} />
        <Chatting isMine={false} />
      </div>

      {/* 채팅 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 right-0 left-0 flex gap-2 items-center bg-white px-2 py-1"
      >
        <button
          type="button"
          aria-label="이미지 첨부"
          className="text-brown-accent cursor-pointer shrink-0"
        >
          <ChatPictureIcon />
        </button>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="메시지를 입력"
          className="flex-1 min-w-0 text-font-dark font-bold rounded-[20px] bg-gray-light outline-none focus:outline-none px-3 py-2"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          aria-label="메시지 전송"
          className={`cursor-pointer shrink-0 ${message.trim() ? 'text-green-primary' : 'text-gray-lighter'}`}
        >
          <SendIcon />
        </button>
      </form>
    </>
  );
}
