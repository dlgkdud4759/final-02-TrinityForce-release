'use client';

import { MapPin } from 'lucide-react';
import { useLocationModal } from '@/contexts/LocationModalContext';

export default function LocationModal() {
  const { closeModal, allowLocation, denyLocation } = useLocationModal();

  return (
    <>
      {/* 배경 오버레이 */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={closeModal} />

      {/* 모달 */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-xl">

          {/* 아이콘 및 메시지 영역 */}
          <div className="pt-10 pb-8 px-6 text-center">

            {/* 위치 아이콘 */}
            <div className="flex justify-center mb-6">
              <MapPin size={48} className="text-font-dark" strokeWidth={1.5} />
            </div>

            {/* 메시지 */}
            <p className="text-base md:text-lg font-medium text-font-dark leading-relaxed">
              앱에서 내 기기 위치에 액세스
              <br />
              하도록 허용하시겠습니까?
            </p>
          </div>

          {/* 버튼 영역 */}
          <div className="border-t border-gray-medium">
            <button
              type="button"
              onClick={allowLocation}
              className="w-full py-4 text-base font-medium text-font-dark hover:bg-gray-50 transition-colors"
            >
              항상 허용
            </button>
          </div>

          <div className="border-t border-gray-medium">
            <button
              type="button"
              onClick={allowLocation}
              className="w-full py-4 text-base font-medium text-font-dark hover:bg-gray-50 transition-colors"
            >
              앱 사용 중에만 허용
            </button>
          </div>

          <div className="border-t border-gray-medium">
            <button
              type="button"
              onClick={denyLocation}
              className="w-full py-4 text-base font-medium text-font-dark hover:bg-gray-50 transition-colors"
            >
              거부
            </button>
          </div>
        </div>
      </div>
    </>
  );
}