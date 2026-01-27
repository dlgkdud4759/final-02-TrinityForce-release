import Image from 'next/image';
import Link from 'next/link';

export default function ChatItem() {
  return (
    <Link href="/">
      <article className="flex items-center mx-4 my-3">
        <Image
          className="shrink-0 w-10.5 h-10.5 rounded-lg bg-border-primary"
          alt="사용자 프로필"
          src={'/'}
          width={42}
          height={42}
        />
        <div className="flex flex-col gap-0.5 h-9.5 ml-2 flex-1 min-w-0">
          <h3 className="h-5 text-mg font-semibold text-font-dark">닉네임</h3>
          <p className="h-4 ml-0.5 text-xs font-medium text-gray-dark truncate">
            채팅 내용입니다. 채팅 내용입니다. 채팅 내용입니다. 채팅 내용입니다.
          </p>
        </div>
      </article>
    </Link>
  );
}
