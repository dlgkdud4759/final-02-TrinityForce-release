'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Search } from 'lucide-react';
import HeaderSub from '@/components/layout/HeaderSub';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/common/SearchInput';
import LoginModal from '@/components/modals/LoginModal';
import useAuthStatus from '@/utils/useAuthStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

interface MeetupPost {
  _id: number;
  title: string;
  content: string;
  image?: { path: string; name: string; originalname: string };
  likes: number;
  user: { _id: number; name: string; image: string };
  createdAt: string;
}

const fallbackPost: MeetupPost = {
  _id: 0,
  title: '한강 작가 함께 읽기',
  content:
    '한강 작가의 작품을 함께 읽고 이야기 나누는 모임입니다. 매주 토요일 오후 2시에 모여서 책에 대한 생각을 나눕니다.',
  image: { path: '/images/book1.jpg', name: 'book1.jpg', originalname: 'book1.jpg' },
  likes: 24,
  user: { _id: 1, name: '책벌레', image: '' },
  createdAt: '2025-01-28',
};

export default function Meetup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [posts, setPosts] = useState<MeetupPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isLoggedIn = useAuthStatus();
  const router = useRouter();

  // API에서 모임 게시글 목록 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${API_URL}/posts?type=meetup`, {
          headers: { 'client-id': CLIENT_ID || '' },
        });
        const data = await res.json();
        if (data.ok) {
          setPosts(data.item);
        }
      } catch (error) {
        console.error('게시글 목록 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // 검색 결과 필터링
  const sourcePosts =
    !hasSearched && posts.length === 0 ? [fallbackPost] : posts;

  const filteredPosts = hasSearched
    ? sourcePosts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          post.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : sourcePosts;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setHasSearched(true);
  };

  const handleRequireLogin = (e: React.MouseEvent, target: string) => {
    if (isLoggedIn) {
      router.push(target);
      return;
    }
    e.preventDefault();
    setIsLoginModalOpen(true);
  };

  const getImageUrl = (post: MeetupPost) => {
    if (post.image?.path) {
      if (post.image.path.startsWith('http') || post.image.path.startsWith('/')) {
        return post.image.path;
      }
      return `${API_URL}/${post.image.path}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <HeaderSub title="독서 모임" />

      {/* 타이틀 영역 */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-font-dark">모임게시판</h2>
        <Link href="/meetup/CreatingMeetup" onClick={(e) => handleRequireLogin(e, '/meetup/CreatingMeetup')}>
          <Button text="모임생성" />
        </Link>
      </div>

      {/* 검색창 */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 max-w-6xl mx-auto">
        <SearchInput
          placeholder="모임을 검색하세요."
          onSearch={handleSearch}
        />
      </div>

      {/* 로딩 */}
      {isLoading ? (
        <main className="flex items-center justify-center min-h-[50vh]">
          <p className="text-gray-medium">로딩 중...</p>
        </main>
      ) : hasSearched && filteredPosts.length === 0 ? (
        /* 검색 결과 없음 */
        <main className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] px-4">
          <Search size={48} className="md:w-16 md:h-16 lg:w-20 lg:h-20 text-gray-medium mb-4 md:mb-6" />
          <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-gray-dark mb-2">
            찾으시는 모임이 없어요.
          </p>
          <p className="text-[14px] md:text-[16px] font-medium text-gray-medium">
            다른 검색어를 입력해 보세요.
          </p>
        </main>
      ) : filteredPosts.length === 0 ? (
        /* 게시글 없음 */
        <main className="flex flex-col items-center justify-center min-h-[50vh] px-4">
          <p className="text-[16px] md:text-[18px] text-gray-dark">
            아직 등록된 모임이 없습니다.
          </p>
          <p className="text-[14px] md:text-[16px] text-gray-medium mt-2">
            첫 번째 모임을 만들어보세요!
          </p>
        </main>
      ) : (
        /* 모임 목록 */
        <main className="px-4 pb-24 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:gap-6">
            {filteredPosts.map((post) => {
              const imageUrl = getImageUrl(post);
              return (
                <Link
                  key={post._id}
                  href={`/meetup/${post._id}`}
                  onClick={(e) => handleRequireLogin(e, `/meetup/${post._id}`)}
                  className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  {/* 이미지 */}
                  {imageUrl && (
                    <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      <Image
                        src={imageUrl}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  {/* 정보 */}
                  <div className="flex flex-col flex-1">
                    <h3 className="text-base md:text-lg lg:text-xl font-semibold text-font-dark mb-1 md:mb-2">
                      {post.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-dark mb-2 md:mb-3 line-clamp-2">
                      {post.content}
                    </p>
                    <div className="flex items-center gap-1 md:gap-2 mt-auto">
                      <span className="flex items-center gap-1">
                        <Heart size={16} className="md:w-5 md:h-5 text-gray-medium" />
                      </span>
                      <span className="text-sm md:text-base text-gray-medium">{post.likes}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </main>
      )}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
