'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useLocationStore } from '@/zustand/useLocationStore';

type KakaoLatLng = { getLat: () => number; getLng: () => number };
type KakaoMap = { setCenter: (latlng: KakaoLatLng) => void };
type KakaoMarker = { setMap: (map: KakaoMap | null) => void; setPosition: (latlng: KakaoLatLng) => void };

declare global {
  interface Window {
    kakao: {
      maps: {
        load: (callback: () => void) => void;
        LatLng: new (lat: number, lng: number) => KakaoLatLng;
        Map: new (container: HTMLElement, options: object) => KakaoMap;
        Marker: new (options: object) => KakaoMarker;
      };
    };
  }
}

export default function LocationPage() {
  const router = useRouter();
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markerRef = useRef<KakaoMarker | null>(null);

  const { address: savedAddress, setLocation, clearLocation } = useLocationStore();
  const [currentAddress, setCurrentAddress] = useState<string | null>(savedAddress);
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);

  // 카카오맵 초기화
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current) return;

      // 기본 위치 (서울시청)
      const defaultLat = 37.5665;
      const defaultLng = 126.978;
      const center = new window.kakao.maps.LatLng(defaultLat, defaultLng);

      const map = new window.kakao.maps.Map(mapRef.current, {
        center,
        level: 5,
      });

      mapInstanceRef.current = map;
      setMapLoaded(true);
    };

    // SDK 로드 대기 (polling)
    const checkKakao = setInterval(() => {
      if (window.kakao?.maps) {
        clearInterval(checkKakao);
        window.kakao.maps.load(initMap);
      }
    }, 100);

    return () => {
      clearInterval(checkKakao);
    };
  }, []);

  const handleClose = () => {
    router.back();
  };

  const handleAddLocation = () => {
    if (currentAddress) {
      // 이미 주소가 있으면 저장하고 닫기
      if (currentCoords) {
        setLocation(currentAddress, currentCoords.lat, currentCoords.lng);
      }
      router.back();
      return;
    }

    // 현재 위치 가져오기
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentCoords({ lat: latitude, lng: longitude });

          // 지도 중심 이동 및 마커 표시
          if (mapLoaded && mapInstanceRef.current) {
            const newCenter = new window.kakao.maps.LatLng(latitude, longitude);
            mapInstanceRef.current.setCenter(newCenter);

            if (markerRef.current) {
              markerRef.current.setPosition(newCenter);
            } else {
              const marker = new window.kakao.maps.Marker({
                position: newCenter,
                map: mapInstanceRef.current,
              });
              markerRef.current = marker;
            }
          }

          try {
            // 카카오 API로 주소 변환
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
              const addressName = address.region_3depth_name || address.region_2depth_name;
              setCurrentAddress(addressName);
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
  };

  const handleRemoveLocation = () => {
    setCurrentAddress(null);
    setCurrentCoords(null);
    clearLocation();
    if (markerRef.current) {
      markerRef.current.setMap(null);
      markerRef.current = null;
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <header className="flex items-center h-14 px-4 bg-bg-primary">
        <button
          type="button"
          onClick={handleClose}
          className="p-1 cursor-pointer"
          aria-label="닫기"
        >
          <X size={24} className="text-font-dark" />
        </button>
        <h1 className="ml-2 text-lg font-semibold text-font-dark">내 동네 설정</h1>
      </header>

      {/* 지도 영역 */}
      <div
        ref={mapRef}
        className="w-full h-75 bg-gray-200 flex items-center justify-center"
      >
        {!mapLoaded && <p className="text-gray-medium">지도 로딩 중...</p>}
      </div>

      {/* 안내 문구 */}
      <div className="px-4 py-6">
        <p className="text-center text-[14px] text-gray-dark mb-6">
          설정한 동네를 기준으로 게시글을 볼 수 있어요.
        </p>

        {/* 버튼 영역 */}
        <div className="flex justify-center">
          {currentAddress ? (
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 px-4 py-2 bg-brown-guide rounded-lg">
                <span className="text-font-white font-medium">{currentAddress}</span>
                <button
                  type="button"
                  onClick={handleRemoveLocation}
                  className="p-0.5 cursor-pointer"
                  aria-label="동네 삭제"
                >
                  <X size={16} className="text-font-white" />
                </button>
              </div>
              <Button
                text="이 위치로 설정"
                onClick={handleAddLocation}
                className="w-auto! px-8 py-3 h-auto text-base"
              />
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
