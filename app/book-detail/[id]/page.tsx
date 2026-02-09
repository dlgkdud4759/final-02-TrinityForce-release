'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Star, X } from 'lucide-react';

import HeaderSub from '@/components/layout/HeaderSub';
import LoginModal from '@/components/modals/LoginModal';
import { useUserStore } from '@/zustand/useUserStore';
import { useLikeStore } from '@/zustand/useLikeStore';

import { saveRecentView } from '@/utils/recentViews'
import { getUser } from '@/utils/user'

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

interface ProductData {
  _id: number;
  seller_id: number;
  name: string;
  content: string;
  mainImages?: { path: string; name: string }[];
  createdAt: string;
  updatedAt: string;
  seller?: {
    _id: number;
    name: string;
    image?: string;
  };
  bookmarks?: number;
  extra?: {
    isBook?: boolean;
    author?: string;
    condition?: '최상' | '상' | '중';
    category?: string;
  };
}

export default function BookDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  // 공통 스타일
  const titleCls = 'text-[22px] font-medium text-font-dark';
  const dividerCls = 'border-t border-gray-lighter';

  const { likedPosts, toggleLike } = useLikeStore();
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);

  const handleChatClick = () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    router.push(`/chat`);
  };

  // 데이터 불러오기
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: {
            'client-id': CLIENT_ID || '',
          },
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || '도서 정보를 불러오는데 실패했습니다.');
        }

        setProduct(data.item);

        if (data.item) {
          const currentUser = getUser()
          saveRecentView(data.item, currentUser?._id)
        }
      } catch (err) {
        console.error('도서 조회 실패:', err);
        setError('도서 정보를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // 이미지 URL 처리
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/images/book1.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath}`;
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    return dateString;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-font-dark">로딩 중...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <p className="text-font-dark">{error || '게시글을 찾을 수 없습니다.'}</p>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 rounded-lg bg-brown-accent text-font-white"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 최상단 헤더 */}
      <HeaderSub title="상세 페이지" />

      {/* 우측: 하트 + 좋아요 + 작성일자 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-start justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="좋아요"
                onClick={() => toggleLike(product._id)}
                className="flex items-center cursor-pointer group"
              >
                <Heart
                  size={22}
                  className={`transition-colors ${
                    likedPosts.has(product._id)
                      ? 'text-red-like fill-red-like'
                      : 'text-gray-medium group-hover:text-red-like group-hover:fill-red-like'
                  }`}
                />
              </button>
              <span className="text-[16px] font-medium text-gray-medium">
                {likedPosts.has(product._id) ? (product.bookmarks || 0) + 1 : (product.bookmarks || 0)}
              </span>
            </div>
            <p className="mt-1 text-[14px] font-medium text-gray-dark">
              {formatDate(product.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* 도서명 */}
      <div className="px-4 pb-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>도서명</h3>
        <div className="mt-3">
          <p className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark">
            {product.name}
          </p>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 저자 */}
      {product.extra?.author && (
        <>
          <div className="px-4 py-4 max-w-6xl mx-auto">
            <h3 className={titleCls}>저자</h3>
            <div className="mt-3">
              <p className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark">
                {product.extra.author}
              </p>
            </div>
          </div>

          <div className={dividerCls} />
        </>
      )}

      {/* 도서 사진 */}
      {product.mainImages && product.mainImages.length > 0 && (
        <>
          <div className="px-4 py-4 max-w-6xl mx-auto">
            <h3 className={titleCls}>도서 사진</h3>

            {/* 가로 슬라이드 */}
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {product.mainImages.map((img, idx) => (
                <div key={idx} className="relative shrink-0 w-64 h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-lighter">
                  <Image
                    src={getImageUrl(img.path)}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className={dividerCls} />
        </>
      )}

      {/* 설명 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>설명</h3>
        <div className="mt-3">
          <p className="w-full min-h-[120px] rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark whitespace-pre-wrap">
            {product.content}
          </p>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 도서 상태 + 가이드 모달 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h3 className={titleCls}>도서 상태</h3>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-[14px] font-medium text-brown-accent underline underline-offset-4 hover:text-font-dark transition-colors"
          >
            도서 상태 기준 가이드
          </button>
        </div>

        {/* 상태 버튼 */}
        <div className="mt-3 flex gap-3">
          {(['최상', '상', '중'] as const).map((cond) => (
            <span
              key={cond}
              className={[
                'px-4 py-2 rounded-lg border text-[16px] font-medium',
                product.extra?.condition === cond
                  ? 'text-font-dark border-brown-accent'
                  : 'text-gray-dark border-gray-lighter',
              ].join(' ')}
            >
              {cond}
            </span>
          ))}
        </div>
      </div>

      <div className={dividerCls} />

      {/* 프로필 카드 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>판매자 정보</h3>

        <div className="mt-3 rounded-xl border border-gray-lighter p-4">
          <div className="flex items-start gap-3">
            {/* 프로필 이미지 */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {product.seller?.image ? (
                <Image
                  src={getImageUrl(product.seller.image)}
                  alt={product.seller.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-bold">
                  {product.seller?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>

            {/* 닉네임 + 별점 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[16px] font-semibold text-font-dark">
                  {product.seller?.name || '판매자'}
                </span>

                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[14px] font-medium text-gray-dark">
                    5.0
                  </span>
                </div>
              </div>

              {/* 채팅하기 버튼 */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={handleChatClick}
                  className="px-4 py-2 rounded-lg bg-brown-guide text-font-white text-[14px] font-medium hover:opacity-90 transition-opacity"
                >
                  채팅하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 모달: 로그인 ===== */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {/* ===== 모달: 도서 상태 기준 가이드 ===== */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-bg-primary p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[18px] font-semibold text-font-dark">도서 상태 기준</h4>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                aria-label="닫기"
              >
                <X size={18} className="text-font-dark" />
              </button>
            </div>

            {/* 5x5 표 */}
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-lighter overflow-x-auto">
              <table className="w-full text-[8px] text-font-dark">
                <thead>
                  <tr>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[50px]">구분</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[140px]">헌 상태</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[150px]">표지</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[140px]">책등 / 책배</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-gray-lighter min-w-[160px]">내부 / 제본상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">최상</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">새것에 가까운 책</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 찢어진 흔적 없음\n닳은 흔적 없음, 낙서 없음\n얼룩 없음, 양장본의 겉표지 있음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음\n닳은 흔적 없음, 얼룩 없음`}</td>
                    <td className="p-2 border-b border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음, 변형 없음\n얼룩 없음, 접힌 흔적 없음\n제본 탈착 없음`}</td>
                  </tr>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">상</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">약간의 사용감은 있으나 깨끗한 책</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`희미한 변색이나 작은 얼룩이 있음\n찢어진 흔적 없음\n약간의 모서리 해짐\n낙서 없음, 양장본의 겉표지 있음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`희미한 변색이나 작은 얼룩이 있음\n약간의 닳은 흔적 있음\n낙서 없음`}</td>
                    <td className="p-2 border-b border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음, 변형 없음\n아주 약간의 접힌 흔적 있음\n얼룩 없음, 제본 탈착 없음`}</td>
                  </tr>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">중</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">사용감이 많으며 헌 느낌이 나는 책</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`전체적인 변색, 모서리 해짐 있음\n2cm 이하의 찢어짐, 오염 있음\n낙서 있음, 양장본의 겉표지 없음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`전체적인 변색, 모서리 해짐 있음\n오염 있음, 낙서 있음(이름 포함)`}</td>
                    <td className="p-2 border-b border-gray-lighter align-top whitespace-pre-line">{`변색 있음, 2cm 이하 찢어짐 있음\n5쪽 이하의 필기 및 밑줄 있음\n얼룩 및 오염 있음, 제본 탈착 없음`}</td>
                  </tr>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-r border-gray-lighter text-center font-medium">매입불가</td>
                    <td className="p-2 border-r border-gray-lighter align-top">독서 및 이용에 지장이 있는 책</td>
                    <td className="p-2 border-r border-gray-lighter align-top whitespace-pre-line">{`2cm 초과한 찢어짐 있음\n심한 오염 및 낙서 있음\n물에 젖은 흔적 있음`}</td>
                    <td className="p-2 border-r border-gray-lighter align-top whitespace-pre-line">{`심한 오염 있음, 심한 낙서 있음\n물에 젖은 흔적 있음`}</td>
                    <td className="p-2 border-gray-lighter align-top whitespace-pre-line">{`2cm 초과한 찢어짐, 5쪽 초과 낙서\n심한 오염 이나 젖은 흔적 있음\n낙장 등의 제본불량, 분책 된 경우`}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="mt-3 text-[14px] font-medium text-red-dark">
              그 외 심한 훼손이 있는 책은 교환 불가입니다.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-lighter text-[14px] font-medium text-font-dark hover:border-brown-accent transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
