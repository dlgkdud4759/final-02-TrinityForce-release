"use client"

import { useState } from "react"
import Image from "next/image"
import EmptyState from "@/components/ui/EmptyState"

type Review = {
  id: number
  profileImage: string
  nickname: string
  date: string
  content: string
}

export default function ReviewsPage() {
  const [activeTab, setActiveTab] = useState<"received" | "written">("received")

  const receivedReviews: Review[] = [
      {
      id: 1,
      profileImage: "/favicon.ico",
      nickname: "닉네임",
      date: "2024.01.15",
      content: "후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다.",
    },
    {
      id: 2,
      profileImage: "/favicon.ico",
      nickname: "닉네임",
      date: "2024.01.14",
      content: "후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다.",
    },
    {
      id: 3,
      profileImage: "/favicon.ico",
      nickname: "닉네임",
      date: "2024.01.13",
      content: "후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다.",
    },
    
  ]

  const writtenReviews: Review[] = [
    {
    id: 1,
    profileImage: "/favicon.ico",
    nickname: "닉네임",
    date: "2024.01.12",
    content: "후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다.",
  },
  {
    id: 2,
    profileImage: "/favicon.ico",
    nickname: "닉네임",
    date: "2024.01.11",
    content: "후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다. 후기 내용 입니다.",
  },
  ]

  const currentReviews = activeTab === "received" ? receivedReviews : writtenReviews
  const isEmpty = currentReviews.length === 0

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <div className="px-4 py-6 max-w-md mx-auto">
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
            {currentReviews.map((item, index) => (
              <div key={item.id}>
                {/* 목록 아이템 */}
                <div className="flex gap-4 py-4">
                  {/* 프로필 이미지 */}
                  <div className="w-18 h-18 flex-shrink-0">
                    <Image
                      src={item.profileImage}
                      alt={item.nickname}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-font-dark mb-1">
                      {item.nickname}
                    </h3>
                    <p className="text-xs text-gray-dark mb-2">
                      {item.date}
                    </p>
                    <p className="text-sm text-font-dark leading-relaxed">
                      {item.content}
                    </p>
                  </div>
                </div>

                {/* 구분선 */}
                {index < currentReviews.length - 1 && (
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