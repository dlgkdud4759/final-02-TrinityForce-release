import Image from 'next/image';
import Link from 'next/link';

export default function AlertItem() {
  return (
    <Link href="/">
      <article className="border-b border-border-primary">
        <div className="flex items-center m-4 px-2">
          <Image
            className="shrink-0 w-20 h-20 rounded-lg bg-border-primary"
            alt="사용자 프로필"
            src={'/'}
            width={40}
            height={40}
          />
          <div className="flex flex-col gap-1.5 h-16 ml-2 flex-1 min-w-12">
            <h3 className="h-5 text-mg font-semibold text-font-dark">제목</h3>
            <div className="flex flex-col gap-0.5">
              <p className="h-5 text-mg font-semibold text-font-dark truncate">
                OO 님이 대화를 요청했어요.
              </p>
              <p className="h-4 ml-0.5 text-xs font-medium text-gray-dark truncate">
                채팅 내용입니다. 채팅 내용입니다. 채팅 내용입니다. 채팅
                내용입니다.
              </p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
