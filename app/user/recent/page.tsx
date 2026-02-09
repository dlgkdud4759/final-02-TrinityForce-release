"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import EmptyState from "@/components/ui/EmptyState"
import HeaderSub from "@/components/layout/HeaderSub"
import { getRecentViews, clearRecentViews } from "@/utils/recentViews"
import { getUser } from "@/utils/user"

type RecentView = {
  id: number
  name: string
  image: string
  content?: string
  author?: string
  viewedAt: string
}

export default function RecentPage() {
  const router = useRouter()
  const currentUser = getUser()
  
  const [recents, setRecents] = useState<RecentView[]>(() => {
    if (typeof window !== 'undefined') {
      return getRecentViews(currentUser?._id)
    }
    return []
  })

  const handleClearAll = () => {
    if (confirm('최근 본 글을 모두 삭제하시겠습니까?')) {
      clearRecentViews(currentUser?._id)
      setRecents([])
    }
  }

  const isEmpty = recents.length === 0

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title="최근 본 글" backUrl="/user/mypage" />
      <div className="px-4 py-6 max-w-md mx-auto pt-15">
        {/* 전체 삭제 버튼 */}
        {!isEmpty && (
          <div className="flex justify-end mb-4">
            <button
              onClick={handleClearAll}
              className="text-sm text-gray-dark hover:text-font-dark"
            >
              전체 삭제
            </button>
          </div>
        )}

        {/* 빈 상태 */}
        {isEmpty ? (
          <EmptyState 
            title="아직 둘러본 책이 없어요."
            description="동네 책장을 구경해보세요!"
          />
        ) : (
          /* 목록 */
          <div>
            {recents.map((item, index) => (
              <div key={item.id}>
                {/* 목록 아이템 */}
                <div 
                  className="flex gap-4 py-4 cursor-pointer hover:bg-gray-50 transition rounded-lg px-2"
                  onClick={() => router.push(`/book-detail/${item.id}`)}
                >
                  {/* 책 이미지 */}
                  <div className="w-18 h-18 flex-shrink-0">
                    <Image
                      src={item.image || '/favicon.ico'}
                      alt={item.name}
                      width={64}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-font-dark mb-1 truncate">
                      {item.name}
                    </h3>
                    {item.author && (
                      <p className="text-sm text-gray-dark mb-2">
                        {item.author}
                      </p>
                    )}
                    {item.content && (
                      <p className="text-sm text-font-dark line-clamp-2 mb-2">
                        {item.content}
                      </p>
                    )}
                    <p className="text-xs text-gray-dark">
                      {item.viewedAt}
                    </p>
                  </div>
                </div>

                {/* 구분선 */}
                {index < recents.length - 1 && (
                  <div className="border-b border-border-primary" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}