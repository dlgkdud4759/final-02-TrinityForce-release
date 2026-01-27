'use client';

import { useState } from 'react';
import { StarIcon } from '@/app/components/icons/Star';
import { SquareCheckboxIcon } from '@/app/components/icons/SquareCheckbox';

export default function ReviewWritePage() {
  const [rating, setRating] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');

  // 별점 항목
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

  return (
    <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center p-4">
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

        {/* 버튼 (임시) */}
        <div className="space-y-2">
          <button className="w-full py-3 bg-brown-accent text-white rounded-lg font-medium">
            등록
          </button>
          <button className="w-full py-3 bg-white border border-brown-accent text-font-dark rounded-lg font-medium">
            취소
          </button>
        </div>
      </div>
    </div>
  );
}