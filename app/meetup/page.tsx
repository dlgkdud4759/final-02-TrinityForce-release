'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import HeaderSub from '@/components/layout/HeaderSub';
import Button from '@/components/ui/Button';
import SearchInput from '@/components/common/SearchInput';

export default function Meetup() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const groups = [
    {
      id: 1,
      image: '/images/book1.jpg',
      title: '한강 작가 함께 읽기',
      description: '한강 작가의 작품을 함께 읽고 이야기 나누는 모임입니다.',
      likes: 24,
    },
    {
      id: 2,
      image: '/images/book2.jpg',
      title: '주말 독서 클럽',
      description: '매주 주말 오전에 모여 책을 읽고 토론하는 모임입니다.',
      likes: 18,
    },
  ];

  // 검색 결과 필터링
  const filteredGroups = hasSearched
    ? groups.filter(
        (group) =>
          group.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          group.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : groups;

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setHasSearched(true);
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <HeaderSub title="독서 모임" />

      {/* 타이틀 영역 */}
      <div className="flex items-center justify-between px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-font-dark">모임게시판</h2>
        <Link href="/meetup/CreatingMeetup">
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

      {/* 검색 결과 없음 */}
      {hasSearched && filteredGroups.length === 0 ? (
        <main className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] px-4">
          <Search size={48} className="md:w-16 md:h-16 lg:w-20 lg:h-20 text-gray-medium mb-4 md:mb-6" />
          <p className="text-[20px] md:text-[24px] lg:text-[28px] font-bold text-gray-dark mb-2">
            찾으시는 모임이 없어요.
          </p>
          <p className="text-[14px] md:text-[16px] font-medium text-gray-medium">
            다른 검색어를 입력해 보세요.
          </p>
        </main>
      ) : (
        /* 모임 목록 */
        <main className="px-4 pb-24 md:px-6 max-w-6xl mx-auto">
          <div className="flex flex-col gap-4 md:gap-6">
            {filteredGroups.map((group) => (
              <Link
                key={group.id}
                href="/meetup/MeetupPost"
                className="flex gap-4 md:gap-6 p-4 md:p-6 bg-white rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                {/* 이미지 */}
                <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                  <Image
                    src={group.image}
                    alt={group.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 정보 */}
                <div className="flex flex-col flex-1">
                  <h3 className="text-base md:text-lg lg:text-xl font-semibold text-font-dark mb-1 md:mb-2">
                    {group.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-dark mb-2 md:mb-3 line-clamp-2">
                    {group.description}
                  </p>
                  <div className="flex items-center gap-1 md:gap-2 mt-auto">
                    <span className="flex items-center gap-1">
                      <Heart size={16} className="md:w-5 md:h-5 text-gray-medium" />
                    </span>
                    <span className="text-sm md:text-base text-gray-medium">{group.likes}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </main>
      )}
    </div>
  );
}
