'use client';

import { ChatReviewsIcon } from '@/app/components/icons/ChatReviews';
import { CompleteIcon } from '@/app/components/icons/Complete';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getAxios } from '@/utils/axios';
import toast from 'react-hot-toast'

type Props = {
  orderId: number
  productId: number
  isOwner: boolean
}

export default function ChatTransactionButton({ orderId, productId, isOwner }: Props) {
  const [isCompleted, setIsCompleted] = useState(false);
  const router = useRouter();

  // 후기 작성했으면 버튼 숨기기
  const isReviewed = typeof window !== 'undefined'
    ? localStorage.getItem(`review_${orderId}`)
    : null

  const handleComplete = async () => {
  try {
    const axios = getAxios()
    console.log('axios headers:', axios.defaults.headers)
    await axios.post('/orders', {
      products: [
        {
          _id: productId,
          quantity: 1
        }
      ]
    })
    setIsCompleted(true)
    console.log('교환 완료!')
  } catch (error) {
    console.error('교환 완료 에러:', error)
    toast.error('교환 완료 처리에 실패했습니다.')
  }
}

  const handleReview = () => {
    // 후기 작성 페이지로 이동
    router.push(`/reviews/write?orderId=${orderId}&productId=${productId}`);
    console.log('후기 작성하기');
  };

  // 글 올린 사람 > x
  // 신청한 사람 > 교환 완료 후 후기 작성 버튼
  if (isOwner) return null

  // 이미 후기 작성했으면 아무것도 안 보여줌
  if (isReviewed) return null
  


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
  )
}
