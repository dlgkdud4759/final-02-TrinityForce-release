'use client';

import { useState} from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LocationPage() {
  const router = useRouter();
  const [currentAddress, setCurrentAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleClose = () => {
    router.push('/');
  };

  const handleAddLocation = () => {
    if (currentAddress) {
      // 이미 주소가 있으면 초기화
      setCurrentAddress(null);
    } else {
      // 현재 위치 가져오기
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              // 카카오 API로 주소 변환 (API 키가 있다면)
              const response = await fetch(
                `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`,
                {
                  headers: {
                    Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}`,
                  },
                }
              );
              const data = await response.json();
              if (data.documents && data.documents.length > 0) {
                const address = data.documents[0].address;
                setCurrentAddress(address.region_3depth_name || address.region_2depth_name);
              } else {
                setCurrentAddress('현재 동네');
              }
            } catch {
              setCurrentAddress('현재 동네');
            }
            setIsLoading(false);
          },
          () => {
            setCurrentAddress('현재 동네');
            setIsLoading(false);
          }
        );
      } else {
        setCurrentAddress('현재 동네');
        setIsLoading(false);
      }
    }
  };

  const handleRemoveLocation = () => {
    setCurrentAddress(null);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <header className="flex items-center h-14 px-4 bg-bg-primary">
        <button
          type="button"
          onClick={handleClose}
          className="p-1"
          aria-label="닫기"
        >
          <X size={24} className="text-font-dark" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-font-dark">내 동네 설정</h1>
      </header>

      {/* 지도 영역 */}
      <div className="w-full h-75 bg-gray-200 flex items-center justify-center">
        <p className="text-gray-medium">지도 영역</p>
      </div>

      {/* 안내 문구 */}
      <div className="px-4 py-6">
        <p className="text-center text-[14px] text-gray-dark mb-6">
          설정한 동네를 기준으로 게시글을 볼 수 있어요.
        </p>

        {/* 버튼 영역 */}
        <div className="flex justify-center">
          {currentAddress ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-brown-guide rounded-lg">
              <span className="text-font-white font-medium">{currentAddress}</span>
              <button
                type="button"
                onClick={handleRemoveLocation}
                className="p-0.5"
                aria-label="동네 삭제"
              >
                <X size={16} className="text-font-white" />
              </button>
            </div>
          ) : (
            <Button
              text={isLoading ? '위치 확인 중...' : '현재 위치로 추가'}
              onClick={handleAddLocation}
              className="w-auto! px-8 py-3 h-auto text-base"
            />
          )}
        </div>
      </div>
    </div>
  );
}
