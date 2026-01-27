'use client';

import { useState } from 'react';
import Image from 'next/image';
import SearchInput from '@/components/common/SearchInput';
import EmptyState from '@/components/ui/EmptyState';

type SearchResult = {
  id: number;
  bookImage: string;
  title: string;
  content: string;
  time: string;
};

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(['책 제목', '책 제목2', '책 제목3', '책 제목4']);
  const [hasSearched, setHasSearched] = useState(true);

  const [searchResults, setSearchResults] = useState<SearchResult[]>([
    {
      id: 1,
      bookImage: "/favicon.ico",
      title: "책 제목",
      content: "게시글 내용 게시글 내용 게시글 내용 게시글 내용...",
      time: "작성 시간"
    },
    {
      id: 2,
      bookImage: "/favicon.ico",
      title: "책 제목",
      content: "게시글 내용 게시글 내용 게시글 내용 게시글 내용...",
      time: "작성 시간"
    },
  ]);

  // 최근 검색어 삭제
  const handleDeleteRecent = (index: number) => {
    console.log('삭제할 검색어 인덱스:', index);
    const newSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(newSearches);
  };

  // 최근 검색어 전체 삭제
  const handleDeleteAllRecent = () => {
    console.log('전체 삭제 클릭');
    setRecentSearches([]);
  };

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <div className="px-4 py-6 max-w-md mx-auto">        
        {/* 검색창 */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="검색어를 입력하세요"
        />

        {/* 조건별 렌더링 */}
{isFocused ? (
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-font-dark">최근 검색</h2>
              <button 
                onMouseDown={handleDeleteAllRecent}
                className="text-sm text-gray-dark"
              >
                전체 삭제
              </button>
            </div>
            {recentSearches.length > 0 ? (
              <ul className="space-y-3">
                {recentSearches.map((search, index) => (
                  <li key={index} className="flex items-center justify-between py-2">
                    <span className="text-font-dark">{search}</span>
                    <button 
                      onMouseDown={() => handleDeleteRecent(index)}
                      className="text-gray-dark"
                    >
                      ✕
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-dark text-center py-4">
                최근 검색어가 없습니다
              </p>
            )}
          </div>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <div className="mt-6">
              {searchResults.map((item, index) => (
                <div key={item.id}>
                  <div className="flex gap-4 py-4">
                    <div className="w-18 h-18 flex-shrink-0">
                      <Image
                        src={item.bookImage}
                        alt={item.title}
                        width={64}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-font-dark mb-1 truncate">
                        {item.title}
                      </h3>
                      <p className="text-sm text-font-dark line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      <p className="text-xs text-gray-dark">
                        {item.time}
                      </p>
                    </div>
                  </div>
                  
                  {index < searchResults.length - 1 && (
                    <div className="border-b border-border-primary" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState 
              title="찾으시는 책이 없어요."
              description="다른 검색어를 입력해보세요."
            />
          )
        ) : null}
      </div>
    </div>
  );
}