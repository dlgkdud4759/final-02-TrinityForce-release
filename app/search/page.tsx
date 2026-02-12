'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import SearchInput from '@/components/common/SearchInput';
import EmptyState from '@/components/ui/EmptyState';
import { getAxios, handleAxiosError } from '@/utils/axios';
import { useRouter, useSearchParams } from 'next/navigation';
import HeaderSub from '@/components/layout/HeaderSub';
import { useUserStore } from '@/zustand/useUserStore';
import { useLocationStore } from '@/zustand/useLocationStore';
import toast from 'react-hot-toast'

type SearchResult = {
  _id: number;
  name: string;
  content: string;
  mainImages: { path: string; name: string }[];
  extra?: {
    author?: string;
    category?: string;
    condition?: string;
    location?: string | null;
  };
  createdAt: string;
  seller: {
    name: string;
    image?: string;
    address?: string;
  };
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('recentSearches');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  // 유저 주소 가져오기 (위치 재설정 주소 우선, 없으면 회원가입 주소)
  const user = useUserStore((state) => state.user);
  const locationAddress = useLocationStore((state) => state.address);
  const userAddress = locationAddress || user?.address;

  // 검색 실행
  const handleSearch = useCallback(async (keyword: string, category: string) => {
    if (!keyword.trim()) {
      toast.error('검색어를 입력해주세요.')
      return
    }

    try {
      setIsLoading(true);
      setHasSearched(true);
      setIsFocused(false);

      const axios = getAxios();

      const params: Record<string, string> = {
        keyword: keyword.trim()
      };

      // 카테고리 추가
      if (category !== '전체') {
        params.custom = JSON.stringify({ "extra.category": category });
      }


      const response = await axios.get(`/products`, { params });

      let results = response.data.item || [];

      // 위치 필터링 (도서의 extra.location 기준)
        if (userAddress) {
          results = results.filter((item: SearchResult) => {
            const bookLocation = item.extra?.location;
            if (!bookLocation) return false;
            // 주소에서 구 정보 추출하여 비교
            const userGu = userAddress.match(/\S+구/)?.[0];
            const bookGu = bookLocation.match(/\S+구/)?.[0];
            return userGu && bookGu && userGu === bookGu;
          });
        }

      setSearchResults(results);

      // 최근 검색어
      setRecentSearches(prev => {
        if (!prev.includes(keyword)) {
          const newSearches = [keyword, ...prev.slice(0, 9)];
          localStorage.setItem('recentSearches', JSON.stringify(newSearches));
          return newSearches;
        }
        return prev;
      });
    } catch (error) {
      console.error('검색 에러', error);
      handleAxiosError(error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [userAddress]);

  // URL 파라미터로 전달된 검색어 자동 검색
  useEffect(() => {
    const keyword = searchParams.get('keyword');
    const category = searchParams.get('category') || '전체';
    if (keyword) {
      setSearchQuery(keyword);
      handleSearch(keyword, category);
    }
  }, [searchParams, handleSearch]);

  // 최근 검색어 삭제
  const handleDeleteRecent = (index: number) => {
    const newSearches = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(newSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newSearches));
  };

  // 최근 검색어 전체 삭제
  const handleDeleteAllRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const handleResultClick = (productId: number) => {
    router.push(`/book-detail/${productId}`);
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title='검색'
      backUrl='/'/>
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* 위치 표시 */}
        {userAddress && (
          <div className="mb-4 text-sm text-gray-dark text-center">
            📍 {userAddress} 기준 검색
          </div>
        )}
        
        {/* 검색창 */}
        <SearchInput
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
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
                    {/* 검색어 */}
                    <span 
                      className="flex-1 text-font-dark cursor-pointer"
                      onMouseDown={() => {
                        setSearchQuery(search);
                        handleSearch(search, '전체');
                      }}
                    >
                      {search}
                    </span>
                    <button 
                      onMouseDown={(e) => {
                        e.preventDefault();
                        handleDeleteRecent(index)}}
                      className="text-gray-dark ml-4"
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
        ) : isLoading ? (
          <div className="mt-6 text-center">
            <p className="text-gray-dark">검색 중...</p>
          </div>
        ) : hasSearched ? (
          searchResults.length > 0 ? (
            <div className="mt-6">
              {searchResults.map((item, index) => (
                <div key={item._id}>
                  <div className="flex gap-4 py-4 cursor-pointer hover:bg-gray-light transition rounded-lg px-2"
                  onClick={() => handleResultClick(item._id)}>
                    <div className="w-18 h-18 flex-shrink-0">
                      <Image
                        src={item.mainImages[0]?.path || ''}
                        alt={item.name}
                        width={64}
                        height={80}
                        unoptimized
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-font-dark mb-1 truncate">
                        {item.name}
                      </h3>
                      <p className="text-sm text-font-dark line-clamp-2 mb-2">
                        {item.content}
                      </p>
                      <p className="text-xs text-gray-dark">
                        {item.createdAt}
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