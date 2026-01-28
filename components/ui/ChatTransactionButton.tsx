'use client';

import { ChatReviewsIcon } from '@/app/components/icons/ChatReviews';
import { CompleteIcon } from '@/app/components/icons/Complete';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function ChatTransactionButton() {
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  const handleComplete = () => {
    setIsCompleted(true);
    // 교환 완료 API 호출 등 추가 로직 구현 예정
    console.log('교환 완료!');
  };

  const handleReview = () => {
    // 후기 작성 페이지로 이동
    router.push('/reviews/write');
    console.log('후기 작성하기');
  };
  return (
    <>
      {!isCompleted ? (
        <button
          onClick={handleComplete}
          className="w-fit cursor-pointer rounded border border-border-primary"
        >
          <div className="flex flex-row items-center gap-0.5 text-xs font-bold text-font-dark m-1">
            <CompleteIcon />
            교환 완료하기
          </div>
        </button>
      ) : (
        <button
          onClick={handleReview}
          className="w-fit cursor-pointer rounded border border-border-primary"
        >
          <div className="flex flex-row items-center gap-0.5 text-xs font-bold text-font-dark m-1">
            <ChatReviewsIcon />
            후기 작성하기
          </div>
        </button>
      )}
    </>
  );
}
