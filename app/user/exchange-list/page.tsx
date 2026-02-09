"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import EmptyState from "@/components/ui/EmptyState"
import HeaderSub from "@/components/layout/HeaderSub"
import { getAxios, handleAxiosError } from "@/utils/axios"

type Order = {
  _id: number
  products: {
    _id: number
    name: string
    image: {
      path: string
      name: string
    }
    extra?: {
      author?: string
      category?: string
    }
    seller?: {
      _id: number
      name: string
      image?: string
    }
  }[]
  state: string
  createdAt: string
  user_id: number
  user?: {
    _id: number
    name: string
    image?: string
  }
}

export default function ExchangeListPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"requested" | "received">("requested")
  const [exchanges, setExchanges] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 교환 목록 불러오기
  useEffect(() => {
    fetchExchanges()
  }, [activeTab])

  const fetchExchanges = async () => {
    try {
      setIsLoading(true)
      const axios = getAxios()
      let response

      if (activeTab === "requested") {
        // 내가 신청한 교환
        response = await axios.get('/orders/')
        console.log('신청한 교환:', response.data)
        
        if (response.data.ok) {
          setExchanges(response.data.item || [])
        }
      } else {
        // 내 책에 신청 온 교환
        response = await axios.get('/seller/orders/')
        console.log('받은 교환:', response.data)
        
        if (response.data.ok) {
          const orders = Array.isArray(response.data.item) 
            ? response.data.item 
            : response.data.item ? [response.data.item] : []
          setExchanges(orders)
        }
      }
    } catch (error) {
      console.error('교환 목록 에러:', error)
      handleAxiosError(error)
      setExchanges([])
    } finally {
      setIsLoading(false)
    }
  }

  const isEmpty = exchanges.length === 0

  if (isLoading) {
    return (
      <>
        <HeaderSub title="교환 목록" backUrl="/user/mypage" />
        <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center pt-15">
          <p className="text-gray-dark">로딩 중...</p>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title="교환 목록" backUrl="/user/mypage" />
      <div className="px-4 py-6 max-w-md mx-auto pt-15">
        {/* 탭 */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("requested")}
            className={`flex-1 pb-2 text-base font-medium border-b-2 transition ${
              activeTab === "requested"
                ? "border-brown-accent text-font-dark"
                : "border-transparent text-gray-dark"
            }`}
          >
            내가 고른 책
          </button>
          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 pb-2 text-base font-medium border-b-2 transition ${
              activeTab === "received"
                ? "border-brown-accent text-font-dark"
                : "border-transparent text-gray-dark"
            }`}
          >
            내가 내놓은 책
          </button>
        </div>

        {/* 빈 상태 */}
        {isEmpty ? (
          <EmptyState
            title={
              activeTab === "requested"
                ? "아직 신청한 교환이 없어요."
                : "아직 받은 교환 신청이 없어요."
            }
            description={
              activeTab === "requested"
                ? "마음에 드는 책을 찾아 교환을 신청해보세요!"
                : "내 책에 관심을 가진 사람들이 곧 나타날 거예요."
            }
          />
        ) : (
          /* 목록 */
          <div>
            {exchanges.map((item, index) => (
              <div key={item._id}>
                {/* 목록 아이템 */}
                <div 
                  className="flex gap-4 py-4 cursor-pointer hover:bg-gray-50 transition rounded-lg px-2"
                  onClick={() => router.push(`/book-detail/${item.products[0]._id}`)}
                >
                  {/* 책 이미지 */}
                  <div className="w-18 h-18 flex-shrink-0">
                    <Image
                      src={item.products[0].image.path || '/favicon.ico'}
                      alt={item.products[0].name}
                      width={64}
                      height={80}
                      unoptimized
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-font-dark mb-1 truncate">
                      {item.products[0].name}
                    </h3>
                    {item.products[0].extra?.author && (
                      <p className="text-sm text-gray-dark mb-2">
                        {item.products[0].extra.author}
                      </p>
                    )}
                    <p className="text-xs text-gray-dark mb-2">
                      {activeTab === "requested" 
                        ? `판매자: ${item.products[0].seller?.name || item.user?.name || '알 수 없음'}`
                        : `신청자: ${item.user?.name || '알 수 없음'}`
                      }
                    </p>
                    <p className="text-xs text-gray-dark">
                      {item.createdAt}
                    </p>
                  </div>
                </div>

                {/* 구분선 */}
                {index < exchanges.length - 1 && (
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