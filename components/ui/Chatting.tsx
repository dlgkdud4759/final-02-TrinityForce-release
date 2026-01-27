import Image from 'next/image';

interface ChattingProps {
  isMine?: boolean;
}

export default function Chatting({ isMine = false }: ChattingProps) {
  const containerClass = isMine ? 'flex-row-reverse' : 'flex';
  const balloonClass = isMine
    ? 'rounded-tl-xl rounded-b-xl bg-brown-accent'
    : 'rounded-tr-xl rounded-b-xl bg-brown-guide';
  const textColorClass = 'text-font-white';
  const timeAlignClass = isMine ? 'text-right' : 'text-left';
  const contentWrapperClass = isMine
    ? 'flex gap-1 items-center pt-3.5'
    : 'flex gap-1 items-center pt-3.5 ';

  return (
    <article className={`flex ${containerClass}`}>
      <Image
        className="w-10 h-10 m-2 bg-border-primary rounded-md"
        alt="사용자 프로필"
        src={'/'}
        width={40}
        height={40}
      />
      <div className={contentWrapperClass}>
        {!isMine && (
          <div className={balloonClass}>
            <div className={`text-sm font-bold ${textColorClass} mx-2 my-1`}>
              내용
            </div>
          </div>
        )}
        <div className={`flex gap-1 items-center ${isMine ? '' : 'pt-0'}`}>
          {isMine && (
            <div className={`flex flex-col pt-1.5 ${timeAlignClass}`}>
              <div className="text-[8px] font-bold text-green-primary">1</div>
              <div className="text-[8px] font-bold text-gray-dark">시간</div>
            </div>
          )}
          {isMine && (
            <div className={balloonClass}>
              <div className={`text-sm font-bold ${textColorClass} mx-2 my-1`}>
                내용
              </div>
            </div>
          )}
          {!isMine && (
            <div className={`flex flex-col pt-1.5 ${timeAlignClass}`}>
              <div className="text-[8px] font-bold text-green-primary">1</div>
              <div className="text-[8px] font-bold text-gray-dark">시간</div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
