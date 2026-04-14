'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart, Star, X } from 'lucide-react';

import HeaderSub from '@/components/layout/HeaderSub';
import LoginModal from '@/components/modals/LoginModal';
import { useUserStore } from '@/zustand/useUserStore';
import { useLikeStore } from '@/zustand/useLikeStore';
import useChat from '@/app/chat/_hooks/useChat';
import { ApiError } from '@/app/chat/_api/api';

import { saveRecentView } from '@/utils/recentViews';
import { getUser } from '@/utils/user';
import { showSimpleToast } from '@/utils/simpleToast';

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

export default function BookDetailClient({
  initialProduct,
}: {
  initialProduct: ProductData;
}) {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { toggleLike, setCurrentUser, loadBookmarksFromServer, likedBooks } =
    useLikeStore();
  const isLiked = (bookId: number) => likedBooks.has(bookId);
  const { enterRoom } = useChat();
  const [product, setProduct] = useState<ProductData>(initialProduct);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { isLoggedIn, user } = useUserStore();

  useEffect(() => {
    if (user?._id) {
      setCurrentUser(user._id);
      loadBookmarksFromServer();
    }
  }, [user?._id, setCurrentUser, loadBookmarksFromServer]);

  useEffect(() => {
    if (product) {
      const currentUser = getUser();
      saveRecentView(
        {
          ...product,
          mainImages: product.mainImages?.map(({ path }) => ({ path })) ?? [],
        },
        currentUser?._id
      );
    }
  }, [product]);

  const handleLikeClick = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!product) return;

    const success = await toggleLike({
      _id: product._id,
      name: product.name,
      image: product.mainImages?.[0]?.path || '',
      author: product.extra?.author,
    });

    if (success) {
      try {
        const res = await fetch(`${API_URL}/products/${id}`, {
          headers: {
            'client-id': CLIENT_ID || '',
          },
        });
        const data = await res.json();
        if (res.ok && data.item) {
          setProduct(data.item);
        }
      } catch (error) {
        console.error('도서 조회 실패:', error);
      }
    }
  };

  const handleChatClick = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      const roomId = await enterRoom({
        resourceType: 'product',
        resourceId: product!._id,
      });

      if (roomId) {
        showSimpleToast('채팅방에 입장했습니다.');
        router.push(`/chat/${roomId}`);
      }
    } catch (error) {
      console.error('채팅방 입장 실패:', error);
      if (error instanceof ApiError && error.status === 401) {
        setIsLoginModalOpen(true);
      }
    }
  };

  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/images/book1.jpg';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}/${imagePath}`;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    const dateStr = date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    const timeStr = date.toLocaleTimeString('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return `${dateStr} ${timeStr}`;
  };

  if (!product) {
    return (
      <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center gap-4">
        <p className="text-font-dark">게시글을 찾을 수 없습니다.</p>
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
      <HeaderSub title="상세 페이지" />
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-start justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              {user?._id !== product.seller_id ? (
                <button
                  type="button"
                  aria-label="좋아요"
                  onClick={handleLikeClick}
                  className="flex items-center cursor-pointer group"
                >
                  <Heart
                    size={22}
                    className={`transition-colors ${
                      isLiked(product._id)
                        ? 'text-red-like fill-red-like'
                        : 'text-gray-medium group-hover:text-red-like group-hover:fill-red-like'
                    }`}
                  />
                </button>
              ) : (
                <Heart size={22} className="text-gray-medium" />
              )}
              <span className="text-[16px] font-medium text-gray-medium">
                {product.bookmarks ?? 0}
              </span>
            </div>
            <p className="text-[12px] md:text-[14px] text-gray-dark mt-1">
              {formatDate(product.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-4 pb-4 max-w-6xl mx-auto">
        <h3 className="text-[22px] font-medium text-font-dark">도서명</h3>
        <div className="mt-3">
          <p className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark">
            {product.name}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-lighter" />

      {product.extra?.author && (
        <>
          <div className="px-4 py-4 max-w-6xl mx-auto">
            <h3 className="text-[22px] font-medium text-font-dark">저자</h3>
            <div className="mt-3">
              <p className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark">
                {product.extra.author}
              </p>
            </div>
          </div>

          <div className="border-t border-gray-lighter" />
        </>
      )}

      {product.mainImages && product.mainImages.length > 0 && (
        <>
          <div className="px-4 py-4 max-w-6xl mx-auto">
            <h3 className="text-[22px] font-medium text-font-dark">
              도서 사진
            </h3>
            <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
              {product.mainImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative shrink-0 w-32 aspect-3/4 rounded-lg overflow-hidden bg-gray-100 border border-gray-lighter"
                >
                  <Image
                    src={getImageUrl(img.path)}
                    alt={`${product.name} ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-lighter" />
        </>
      )}

      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className="text-[22px] font-medium text-font-dark">설명</h3>
        <div className="mt-3">
          <p className="w-full min-h-30 rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark whitespace-pre-wrap">
            {product.content}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-lighter" />

      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[22px] font-medium text-font-dark">도서 상태</h3>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-[14px] font-medium text-brown-accent underline underline-offset-4 hover:text-font-dark transition-colors"
          >
            도서 상태 기준 가이드
          </button>
        </div>

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

      <div className="border-t border-gray-lighter" />

      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className="text-[22px] font-medium text-font-dark">판매자 정보</h3>

        <div className="mt-3 rounded-xl border border-gray-lighter p-4">
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
              {product.seller?.image ? (
                <Image
                  src={getImageUrl(product.seller.image)}
                  alt={product.seller.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-bold">
                  {product.seller?.name?.charAt(0) || '?'}
                </div>
              )}
            </div>

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

              {user?._id !== product.seller_id && (
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={handleChatClick}
                    className="px-4 py-2 rounded-lg bg-brown-guide text-font-white text-[14px] font-medium hover:opacity-90 transition-opacity"
                  >
                    채팅하기
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-bg-primary p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[18px] font-semibold text-font-dark">
                도서 상태 기준
              </h4>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                aria-label="닫기"
              >
                <X size={18} className="text-font-dark" />
              </button>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-gray-lighter overflow-x-auto">
              <table className="w-full text-[8px] text-font-dark">
                <thead>
                  <tr>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-12.5">
                      구분
                    </th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-35">
                      헌 상태
                    </th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-37.5">
                      표지
                    </th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-35">
                      책등 / 책배
                    </th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-gray-lighter min-w-40">
                      내부 / 제본상태
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">
                      최상
                    </td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">
                      새것에 가까운 책
                    </td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 찢어진 흔적 없음\n닳은 흔적 없음, 낙서 없음\n얼룩 없음, 양장본의 겉표지 있음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음\n닳은 흔적 없음, 얼룩 없음`}</td>
                    <td className="p-2 border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음, 변형 없음\n얼룩 없음, 접힌 흔적 없음\n제본 탈착 없음`}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
