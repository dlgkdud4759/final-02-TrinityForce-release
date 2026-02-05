"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import EmptyState from "@/components/ui/EmptyState"
import { getAxios, handleAxiosError } from "@/utils/axios"
import { useUserStore } from "@/zustand/useUserStore"
import HeaderSub from "@/components/layout/HeaderSub"
import { StarIcon } from "@/app/components/icons/Star"

type Review = {
  _id: number
  user: {
    _id: number
    image?: string
    name: string
  }
  rating: number
  content: string
  createdAt: string
  product?: {  
    _id: number
    image: {
      path: string
      name: string
    }
    name: string
  }
  product_id?: number  
  extra?: {
    title?: string
  }
}

export default function ReviewsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<"received" | "written">("received")
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const user = useUserStore((state) => state.user)

  // 후기 목록 불러오기
  useEffect(() => {
    fetchReviews()
  }, [activeTab, user])

  const fetchReviews = async () => {
    try {
      setIsLoading(true)

      const axios = getAxios()
      let response
      
      if (activeTab === "written") {
        response = await axios.get(`/replies?full_name=true`)
      } else {
        if (!user?._id) {
          setReviews([])
          setIsLoading(false)
          return
        }
        response = await axios.get(`/replies/seller/${user._id}?full_name=true`)
      }

      console.log('후기 목록 응답:', response.data)

      if (response.data.ok) {
        if (activeTab === "received") {
          // 받은 후기: replies에 product 정보 추가
         const allReplies = response.data.item.flatMap((product: { _id: number; product_id: number; name: string; image: { path: string; name: string }; replies?: Review[] }) => {
            const replies = product.replies || []
            return replies.map((reply: Review) => ({
              ...reply,
              product_id: product.product_id,
              product: {
                _id: product._id,
                name: product.name,
                image: product.image
              }
            }))
          })
          setReviews(allReplies.filter((review: Review) => review.user))
        } else {
          setReviews(response.data.item || [])
        }
      }
    } catch (error) {
      console.error('후기 목록 에러:', error)
      handleAxiosError(error)
      setReviews([])
    } finally {
      setIsLoading(false)
    }
  }

  const isEmpty = reviews.length === 0

  if (isLoading) {
    return (
      <>
        <HeaderSub 
          title="후기 목록" 
          backUrl="/user/mypage" 
        />
        <div className="min-h-screen w-full bg-bg-primary flex items-center justify-center pt-15">
          <p className="text-gray-dark">로딩 중...</p>
        </div>
      </>
    )
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title="후기 목록" backUrl="/user/mypage"/>
      <div className="px-4 py-6 max-w-md mx-auto pt-15">
        {/* 탭 */}
        <div className="flex mb-6">
          <button
            onClick={() => setActiveTab("received")}
            className={`flex-1 pb-2 text-base font-medium border-b-2 transition ${
              activeTab === "received"
                ? "border-brown-accent text-font-dark"
                : "border-transparent text-gray-dark"
            }`}
          >
            받은 후기
          </button>
          <button
            onClick={() => setActiveTab("written")}
            className={`flex-1 pb-2 text-base font-medium border-b-2 transition ${
              activeTab === "written"
                ? "border-brown-accent text-font-dark"
                : "border-transparent text-gray-dark"
            }`}
          >
            작성한 후기
          </button>
        </div>

        {/* 빈 상태 */}
        {isEmpty ? (
          <EmptyState
            title={
              activeTab === "received" 
                ? "아직 받은 후기가 없어요." 
                : "아직 작성한 후기가 없어요."
            }
            description={
              activeTab === "received"
                ? "거래가 완료되면 교환자들의 후기를 확인할 수 있어요."
                : "거래가 끝나면 교환자에게 후기를 남길 수 있어요."
            }
          />
        ) : (
          /* 목록 */
          <div>
            {reviews.map((item, index) => (
              <div key={item._id}>
                {/* 목록 아이템 */}
                <div 
                  className="flex gap-4 py-4 cursor-pointer hover:bg-gray-50 transition rounded-lg px-2"
                  onClick={() => {
                    console.log('클릭됨!', item.product?._id);
                    router.push(`/book-detail/${item.product?._id}`);
                  }}
                >
                  {/* 프로필 이미지 또는 이니셜 */}
                  <div className="w-18 h-18 flex-shrink-0 relative pointer-events-none">
                    {activeTab === "received" ? (
                      // 받은 후기: 작성자 정보
                      item.user?.image ? (
                        <Image
                          src={item.user.image.startsWith('http') ? item.user.image : `https://fesp-api.koyeb.app/${item.user.image}`}
                          alt={item.user?.name || '사용자'}
                          width={64}
                          height={64}
                          unoptimized
                          className="w-full h-full object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-full h-full bg-brown-accent rounded-full flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            {item.user?.name?.charAt(0) || '?'}
                          </span>
                        </div>
                      )
                    ) : (
                      // 작성한 후기: 상품 이미지
                      <Image
                        src={item.product?.image?.path || '/favicon.ico'}
                        alt={item.product?.name || '상품'}
                        width={64}
                        height={64}
                        unoptimized
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0 pointer-events-none">
                    <h3 className="text-base font-bold text-font-dark mb-1">
                      {activeTab === "received" 
                        ? item.user?.name || '알 수 없음'
                        : item.product?.name || '상품명 없음'
                      }
                    </h3>
                    <p className="text-xs text-gray-dark mb-2">
                      {item.createdAt}
                    </p>
                    
                    {/* 별 컴포넌트 사용 */}
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                          key={star}
                          className={`w-4 h-4 ${
                            star <= item.rating ? 'text-yellow-primary' : 'text-gray-light'
                          }`}
                        />
                      ))}
                    </div>
                    
                    {/* 선택한 옵션 표시 */}
                    {item.extra?.title && (
                      <p className="text-sm text-font-dark leading-relaxed">
                        {item.extra.title}
                      </p>
                    )}
                  </div>
                </div>

                {/* 구분선 */}
                {index < reviews.length - 1 && (
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