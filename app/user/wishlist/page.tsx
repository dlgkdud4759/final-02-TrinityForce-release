'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import EmptyState from '@/components/ui/EmptyState';
import HeaderSub from '@/components/layout/HeaderSub';
import { useLikeStore } from '@/zustand/useLikeStore';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
  const router = useRouter();
  const { getLikedBooks, toggleLike, isLiked } = useLikeStore();

  const likedBooks = getLikedBooks();
  const isEmpty = likedBooks.length === 0;

  // 이미지 URL 처리
  const getImageUrl = (imagePath?: string) => {
    if (!imagePath) return '/favicon.ico';
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  };

  // 좋아요 취소 핸들러
  const handleUnlike = (e: React.MouseEvent, book: { _id: number; name: string; image: string; author?: string }) => {
    e.stopPropagation();
    toggleLike(book);
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title="관심 목록" backUrl="/user/mypage" />
      <div className="px-4 py-6 max-w-md mx-auto pt-15">
        {/* 빈 상태 */}
        {isEmpty ? (
          <EmptyState
            title="관심 목록이 비어있어요."
            description="마음에 드는 책에 좋아요를 눌러보세요!"
          />
        ) : (
          /* 목록 */
          <div>
            {likedBooks.map((book, index) => (
              <div key={book._id}>
                {/* 목록 아이템 */}
                <div
                  className="flex gap-4 py-4 cursor-pointer hover:bg-gray-50 transition rounded-lg px-2"
                  onClick={() => router.push(`/book-detail/${book._id}`)}
                >
                  {/* 책 이미지 */}
                  <div className="w-18 h-24 flex-shrink-0">
                    <Image
                      src={getImageUrl(book.image)}
                      alt={book.name}
                      width={72}
                      height={96}
                      unoptimized
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-font-dark mb-1 truncate">
                      {book.name}
                    </h3>
                    {book.author && (
                      <p className="text-sm text-gray-dark mb-2">
                        {book.author}
                      </p>
                    )}
                    <p className="text-xs text-gray-dark">
                      {book.likedAt}
                    </p>
                  </div>

                  {/* 좋아요 버튼 */}
                  <button
                    type="button"
                    onClick={(e) => handleUnlike(e, book)}
                    className="self-center p-2"
                    aria-label="좋아요 취소"
                  >
                    <Heart
                      size={24}
                      className={`transition-colors ${
                        isLiked(book._id)
                          ? 'text-red-like fill-red-like'
                          : 'text-gray-medium'
                      }`}
                    />
                  </button>
                </div>

                {/* 구분선 */}
                {index < likedBooks.length - 1 && (
                  <div className="border-b border-border-primary" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
