import { ChatMessage } from '@/app/chat/_types/chat';
import { User } from '@/types/user';
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
  currentUser,
}: MessageBubbleProps) {
  // 본인 메시지면 currentUser의 이미지, 상대방 메시지면 sender의 이미지
  const avatarSrc = isMine
    ? currentUser?.image || '/images/Logo.png'
    : sender?.image || '/images/Logo.png';

  const wrapperCls = isMine ? 'flex-row-reverse' : 'flex';
  const bubbleCls = isMine
    ? 'rounded-tl-xl rounded-b-xl bg-brown-accent text-white'
    : 'rounded-tr-xl rounded-b-xl bg-brown-guide text-white';

  // 시간 포맷팅 함수
  const formatTime = (timestamp: Date | string) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? '오후' : '오전';
    const displayHours = hours % 12 || 12;
    return `${period} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <article className={`flex ${wrapperCls}`}>
        <Image
          className="w-10 h-10 m-2 bg-border-primary rounded-md"
          alt="사용자 프로필"
          src={`${avatarSrc}`}
          width={40}
          height={40}
        />

        <div className="flex gap-2 items-end">
          {/* 메타 정보: 내 메시지면 앞에, 상대 메시지면 뒤에 렌더링 용도 */}
          {isMine ? (
            <div className="flex flex-col pt-1.5 items-end">
              <div className="text-[8px] font-bold text-green-primary">1</div>
              <div className="text-[8px] font-bold text-gray-dark">
                {formatTime(message.createdAt)}
              </div>
            </div>
          ) : null}

          <div className="flex gap-1 items-center pt-3.5">
            <div className={bubbleCls}>
              <div className="text-sm font-bold mx-2 my-1">
                {message.content}
              </div>
            </div>
          </div>

          {!isMine ? (
            <div className="flex flex-col pt-1.5">
              <div className="text-[8px] font-bold text-green-primary">1</div>
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
