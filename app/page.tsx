import Image from 'next/image';
import { Heart } from 'lucide-react';
import HeaderMain from '@/components/layout/HeaderMain';
import Navigation from '@/components/layout/Navigation';

export default function Home() {
  // 더미 데이터
  const posts = [
    {
      id: 1,
      image: '/images/book1.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 2,
      image: '/images/book2.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 3,
      image: '/images/book3.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 4,
      image: '/images/book4.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 5,
      image: '/images/book5.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 6,
      image: '/images/book6.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 7,
      image: '/images/book7.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
    {
      id: 8,
      image: '/images/book8.jpg',
      category: '제목',
      title: '게시글 내용',
      createdAt: '작성 시간',
    },
  ];

  return (
    <div className="min-h-screen">

      {/* 게시글 목록 */}
      <main className="max-w-6xl mx-auto px-4 py-6 md:px-6 md:py-8 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg overflow-hidden">
              
              {/* 이미지 */}
              <div className="relative aspect-[3/4] bg-gray-100">
                
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform"
                  aria-label="좋아요"
                >
                  <Heart size={18} className="md:w-5 md:h-5 text-font-dark" />
                </button>
              </div>

              {/* 정보 */}
              <div className="p-3 md:p-4">
                <p className="text-m md:text-sm font-semibold text-font-dark mb-1">
                  {post.category}
                </p>
                <p className="text-sm md:text-base font-medium text-font-dark line-clamp-2 mb-2">
                  {post.title}
                </p>
                <p className="text-xs md:text-sm font-regular text-font-dark">
                  {post.createdAt}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}