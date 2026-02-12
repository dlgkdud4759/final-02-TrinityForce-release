'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { StarIcon } from '@/app/components/icons/Star';
import { SquareCheckboxIcon } from '@/app/components/icons/SquareCheckbox';
import { getAxios, handleAxiosError } from '@/utils/axios';
import HeaderSub from '@/components/layout/HeaderSub';

export default function ReviewWritePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에서 orderId, productId 받아오기
  const orderId = searchParams.get('orderId');
  const productId = searchParams.get('productId');
  
  const [rating, setRating] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // 이미 작성한 후기인지 확인
   useEffect(() => {
    if (orderId) {
      const written = localStorage.getItem(`review_${orderId}`)
      if (written) {
        alert('이미 작성한 후기입니다.')
        router.push('/user/reviews')
      }
    }
  }, [orderId, router])

  // 별점에 따른 옵션 목록
  const getOptions = () => {
    if (rating <= 2 && rating > 0) {
      return [
        '다음엔 다른 분과 교환하고 싶어요.',
        '응대가 불친절했어요.',
        '약속 시간에 많이 늦었어요.',
        '책 상태가 설명과 달라요.',
      ];
    } else if (rating === 3) {
      return [
        '책 상태가 괜찮았어요.',
        '추천해요.',
        '만족스러웠어요.',
        '좋은 경험이었어요.',
      ];
    } else if (rating >= 4) {
      return [
        '최고예요! 또 교환하고 싶어요.',
        '책 상태 완벽하고 친절해요.',
        '시간 약속도 잘 지키고 좋아요.',
        '응답이 빨라요.',
      ];
    }
    return [];
  };

  const options = getOptions();

  // 후기 등록
  const handleSubmit = async () => {
    // 유효성 검사
    if (!orderId || !productId) {
      alert('잘못된 접근입니다.');
      return;
    }
    if (rating === 0) {
      alert('별점을 선택해주세요.');
      return;
    }
    if (!selectedOption) {
      alert('후기를 선택해주세요.');
      return;
    }

    try {
      setIsLoading(true);

      const axios = getAxios();
      
      const response = await axios.post('/replies', {
        order_id: Number(orderId),
        product_id: Number(productId),
        rating: rating,
        content: selectedOption,
        extra: {
          title: selectedOption,
        },
      });

      console.log('후기 등록 응답:', response.data);

      if (response.data.ok) {
        localStorage.setItem(`review_${orderId}`, 'true')
        alert('후기가 등록되었습니다!');
        router.push('/user/reviews'); // 후기 목록으로 이동
      } else {
        alert('후기 등록에 실패했습니다.');
      }
    } catch (error) {
      console.error('후기 등록 에러:', error);
      handleAxiosError(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 취소
  const handleCancel = () => {
    router.back();
  };

  return (
    <>
      <HeaderSub title="후기 작성" />
      <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center p-4 pt-[60px]">
        <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-6">
          {/* 제목 */}
          <h1 className="text-center text-[22px] font-semibold text-font-dark">
            별점을 눌러 평가해주세요!
          </h1>

          {/* 별점 */}
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => setRating(star)}
                type="button"
              >
                <StarIcon 
                  className={`w-12 h-12 ${
                    star <= rating ? 'text-yellow-primary' : 'text-gray-light'
                  }`}
                />
              </button>
            ))}
          </div>

          {/* 선택 항목 */}
          {rating > 0 && (
            <div className="space-y-3">
              {options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedOption(option)}
                  type="button"
                  className="w-full flex items-center gap-3 text-left"
                >
                  <SquareCheckboxIcon 
                    className={`w-7 h-7 flex-shrink-0 ${
                      selectedOption === option ? 'text-brown-accent' : 'text-gray-light'
                    }`}
                  />
                  <span className="text-sm text-font-dark">{option}</span>
                </button>
              ))}
            </div>
          )}

          {/* 버튼 */}
          <div className="space-y-2">
            <button 
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 bg-brown-accent text-white rounded-lg font-medium disabled:opacity-50"
            >
              {isLoading ? '등록 중...' : '등록'}
            </button>
            <button 
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full py-3 bg-white border border-brown-accent text-font-dark rounded-lg font-medium"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </>
  );
}