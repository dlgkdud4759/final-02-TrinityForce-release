'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchInput from '@/components/common/SearchInput';
import { useUserStore } from '@/zustand/useUserStore';
import { useLikeStore } from '@/zustand/useLikeStore';
import { useLocationStore } from '@/zustand/useLocationStore';
import LoginModal from '@/components/modals/LoginModal';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Product {
  _id: number;
  seller_id: number;
  name: string;
  content: string;
  mainImages?: { path: string; name: string }[];
  createdAt: string;
  seller?: {
    _id: number;
    name: string;
    image?: string;
  };
  extra?: {
    isBook?: boolean;
    author?: string;
    condition?: string;
    category?: string;
    location?: string | null;
  };
  bookmarks?: number;
}

export default function HomeClient({
  initialProducts,
}: {
  initialProducts: Product[];
}) {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const locationAddress = useLocationStore((state) => state.address);
  const userAddress = locationAddress || user?.address;
  const { likedBooks, toggleLike, setCurrentUser, loadBookmarksFromServer } =
    useLikeStore();

  // likedBooks Map을 구독해야 상태 변경 시 리렌더링됨
  const isLiked = (bookId: number) => likedBooks.has(bookId);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    if (!userAddress) {
      return products;
    }

    const userGu = userAddress.match(/\S+구/)?.[0];
    if (!userGu) {
      return products;
    }

    return products.filter((item) => {
      const bookLocation = item.extra?.location;
      if (!bookLocation) {
        return false;
      }
      const bookGu = bookLocation.match(/\S+구/)?.[0];
      return bookGu === userGu;
    });
  }, [products, userAddress]);

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      localStorage.setItem('hasVisited', 'true');
      router.push('/splash');
    }
  }, [router]);
  // 로그인 시 서버에서 북마크 목록 로드
  useEffect(() => {
    if (user?._id) {
      setCurrentUser(user._id);
      // 서버에서 최신 북마크 목록 불러오기
      loadBookmarksFromServer();
    }
  }, [user?._id, setCurrentUser, loadBookmarksFromServer]);

  // 좋아요 클릭 핸들러
  const handleLikeClick = async (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // 로그인 체크
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    const wasLiked = isLiked(product._id);

    const success = await toggleLike({
      _id: product._id,
      name: product.name,
      image: product.mainImages?.[0]?.path || '',
      author: product.extra?.author,
    });

    // 좋아요 성공 시 로컬에서 카운트 업데이트
    if (success) {
      setProducts((prev) =>
        prev.map((p) =>
          p._id === product._id
            ? {
                ...p,
                bookmarks: Math.max(
                  0,
                  (p.bookmarks || 0) + (wasLiked ? -1 : 1)
                ),
              }
            : p
        )
      );
    }
  };

  // 날짜 포맷팅
  const formatDate = (dateString: string) => {
    // "2026.01.20 10:00:00" 형식에서 날짜만 추출
    return dateString.split(' ')[0];
  };

  // 이미지 URL 처리
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/images/book1.jpg'; // 기본 이미지
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  const handleSearch = (value: string, category: string) => {
    if (!value.trim()) return;
    const params = new URLSearchParams({ keyword: value.trim() });
    if (category !== '전체') {
      params.set('category', category);
    }
    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* 검색창 */}
      <div className="px-4 pt-4 md:px-6 md:pt-6 max-w-6xl mx-auto">
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          placeholder="도서를 검색하세요."
        />
      </div>

      {/* 도서 목록 */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-font-dark text-lg">
              {filteredProducts.length === 0
                ? '등록된 도서가 없습니다.'
                : '검색 결과가 없습니다.'}
            </p>
            <button
              type="button"
              onClick={() => {
                if (!user) {
                  setIsLoginModalOpen(true);
                } else {
                  router.push('/book-registration');
                }
              }}
              className="mt-4 px-4 py-2 bg-brown-accent text-font-white rounded-lg"
            >
              도서 등록하기
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filteredProducts.map((product, index) => (
              <Link
                key={product._id}
                href={`/book-detail/${product._id}`}
                className="bg-white rounded-lg overflow-hidden block cursor-pointer hover:shadow-md transition-shadow"
              >
                {/* 이미지 */}
                <div className="relative aspect-3/4 bg-gray-100">
                  <Image
                    src={getImageUrl(product.mainImages?.[0]?.path)}
                    alt={product.name}
                    fill
                    priority={index < 4}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  {/* 좋아요 버튼 및 카운트 */}
                  <div className="absolute top-3 right-3 flex flex-col items-center gap-1">
                    {user?._id !== product.seller_id && (
                      <button
                        type="button"
                        className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                        aria-label="좋아요"
                        onClick={(e) => handleLikeClick(e, product)}
                      >
                        <Heart
                          size={18}
                          className={`md:w-5 md:h-5 transition-colors ${
                            isLiked(product._id)
                              ? 'text-red-like fill-red-like'
                              : 'text-font-dark hover:text-red-like hover:fill-red-like'
                          }`}
                        />
                      </button>
                    )}
                    {(product.bookmarks ?? 0) > 0 && (
                      <span className="text-xs text-font-dark bg-white px-1.5 py-0.5 rounded-full">
                        {product.bookmarks}
                      </span>
                    )}
                  </div>
                </div>

                {/* 정보 */}
                <div className="p-3 md:p-4">
                  <p className="text-m md:text-sm font-semibold text-font-dark mb-1">
                    {product.name}
                  </p>
                  <p className="text-sm md:text-base font-medium text-gray-dark line-clamp-2 mb-2">
                    {product.extra?.author || '저자 미상'}
                  </p>
                  <p className="text-xs md:text-sm font-regular text-gray-dark">
                    {formatDate(product.createdAt)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
