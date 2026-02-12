'use client';

import { useEffect, useState } from 'react';
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
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

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

export default function HomeClient() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const locationAddress = useLocationStore((state) => state.address);
  const userAddress = locationAddress || user?.address;
  const { isLiked, toggleLike } = useLikeStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // 좋아요 클릭 핸들러
  const handleLikeClick = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();

    // 로그인 체크
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    toggleLike({
      _id: product._id,
      name: product.name,
      image: product.mainImages?.[0]?.path || '',
      author: product.extra?.author,
    });
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products`, {
          headers: {
            'client-id': CLIENT_ID || '',
          },
        });
        const data = await res.json();
        // isBook이 true인 상품만 필터링
        let books = (data.item || []).filter((item: Product) => item.extra?.isBook);

        // 로그인한 사용자의 주소와 같은 지역의 도서만 표시
        if (userAddress) {
          books = books.filter((item: Product) => {
            const bookLocation = item.extra?.location;
            if (!bookLocation) return false;
            // 주소에서 구 정보 추출하여 비교
            const userGu = userAddress.match(/\S+구/)?.[0];
            const bookGu = bookLocation.match(/\S+구/)?.[0];
            return userGu && bookGu && userGu === bookGu;
          });
        }

        setProducts(books);
      } catch (error) {
        console.error('도서 목록 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userAddress]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-font-dark">로딩 중...</p>
      </div>
    );
  }

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
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-font-dark text-lg">
              {products.length === 0 ? '등록된 도서가 없습니다.' : '검색 결과가 없습니다.'}
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
            {products.map((product) => (
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
                    className="object-cover"
                  />
                  {/* 본인 글이 아닐 때만 좋아요 버튼 표시 */}
                  {user?._id !== product.seller_id && (
                    <button
                      type="button"
                      className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
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
