import { ChatMessage } from '@/app/chat/_types/chat';
import { User } from '@/types/user';
import DOMPurify from 'dompurify';
import Image from 'next/image';

interface MessageBubbleProps {
  message: ChatMessage; // 표시할 메시지 객체
  isMine: boolean; // 본인이 보낸 메시지인지 여부
  sender?: User; // 메시지 발신인 정보 (상대방 메시지인 경우에만 주로 사용)
  currentUser?: User; // 현재 로그인한 사용자 정보 추가
}

export default function Chatting({
  message,
  isMine,
  sender,
}: MessageBubbleProps) {
  // 본인 메시지면 currentUser의 이미지, 상대방 메시지면 sender의 이미지
  const avatarSrc =
    !isMine && sender?.image ? sender.image : '/images/Logo.png';

  const wrapperCls = isMine ? 'flex-row-reverse mr-2' : 'flex';
  const bubbleCls = isMine
    ? 'rounded-tl-xl rounded-b-xl bg-brown-accent text-white'
    : 'rounded-tr-xl rounded-b-xl bg-brown-guide text-white';

  // 읽음/미읽음 상태 판단
  const isRead = isMine
    ? sender && message.readUserIds?.includes(sender._id)
    : true;

  // 시간 포맷팅 함수
  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  // HTML을 안전하게 렌더링하는 함수
  const sanitizeAndRenderHTML = (content: string) => {
    // DOMPurify로 XSS 공격 방지
    const cleanHTML = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: ['img', 'br'], // img와 br만 허용
      ALLOWED_ATTR: ['src', 'alt', 'style'], // src, alt, style 속성만 허용
    });

    return (
      <div
        dangerouslySetInnerHTML={{ __html: cleanHTML }}
        className="message-content"
      />
    );
  };

  return (
    <>
      <article className={`flex ${wrapperCls}`}>
        {!isMine && (
          <Image
            className="w-10 h-10 m-2 bg-border-primary rounded-md"
            alt="사용자 프로필"
            src={avatarSrc}
            width={40}
            height={40}
          />
        )}

        <div className="flex gap-2 items-end">
          {/* 내 메시지면 앞에, 상대 메시지면 뒤에 렌더링 용도 */}
          {isMine ? (
            <div className="flex flex-col pt-1.5 items-end">
              <div className="text-[8px] font-bold text-green-primary">
                {isRead ? '' : '1'}
              </div>
              <div className="text-[8px] font-bold text-gray-dark">
                {formatTime(message.createdAt)}
              </div>
            </div>
          ) : null}

          <div className="flex gap-1 items-center pt-3.5">
            <div className={bubbleCls}>
              <div className="text-sm font-bold mx-2 my-1">
                {sanitizeAndRenderHTML(message.content)}
              </div>
            </div>
          </div>

          {!isMine ? (
            <div className="flex flex-col pt-1.5">
              <div className="text-[8px] font-bold text-green-primary">
                {isRead ? '' : '1'}
              </div>
              <div className="text-[8px] font-bold text-gray-dark">
                {formatTime(message.createdAt)}
              </div>
            </div>
          ) : null}
        </div>
      </article>
    </>
  );
}
