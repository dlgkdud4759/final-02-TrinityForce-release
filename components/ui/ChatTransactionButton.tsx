import { ChatReviewsIcon } from '@/app/components/icons/ChatReviews';
import { CompleteIcon } from '@/app/components/icons/Complete';

export default function ChatTransactionButton() {
  return (
    <>
      <button className="w-fit rounded border border-border-primary">
        <div className="flex flex-row items-center gap-0.5 text-xs font-bold text-font-dark m-1">
          <CompleteIcon />
          교환 완료하기
        </div>
      </button>

      <button className="w-fit rounded border border-border-primary">
        <div className="flex flex-row items-center gap-0.5 text-xs font-bold text-font-dark m-1">
          <ChatReviewsIcon />
          후기 작성하기
        </div>
      </button>
    </>
  );
}
