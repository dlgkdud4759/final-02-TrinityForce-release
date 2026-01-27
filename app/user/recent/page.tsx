import Image from "next/image"
import EmptyState from "@/components/ui/EmptyState"

type Recent = {
  id: number
  bookImage: string
  title: string
  content: string
  time: string
}

export default function RecentPage() {
  const recents: Recent[] = [
    {
      id: 1,
      bookImage: "/favicon.ico",
      title: "책 제목",
      content: "계산을 너무 계산을 너무 계산을 너무 계산을 내용 계산을 내용...",
      time: "작성 시간"
    },
    {
      id: 2,
      bookImage: "/favicon.ico",
      title: "책 제목",
      content: "계산을 너무 계산을 너무 계산을 너무 계산을 내용 계산을 내용...",
      time: "작성 시간"
    },
    {
      id: 3,
      bookImage: "/favicon.ico",
      title: "책 제목",
      content: "계산을 너무 계산을 너무 계산을 너무 계산을 내용 계산을 내용...",
      time: "작성 시간"
    },
    {
      id: 4,
      bookImage: "/favicon.ico",
      title: "책 제목",
      content: "계산을 너무 계산을 너무 계산을 너무 계산을 내용 계산을 내용...",
      time: "작성 시간"
    },
  ]

  const isEmpty = recents.length === 0

  if (isEmpty) {
    return (
      <div className="min-h-screen w-full bg-bg-primary">
        <div className="px-4 py-6">
          <EmptyState 
            title="아직 둘러본 책이 없어요."
            description="동네 책장을 구경해보세요!"
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* 목록 */}
        <div>
          {recents.map((item, index) => (
            <div key={item.id}>
              {/* 목록 아이템 */}
              <div className="flex gap-4 py-4">
                {/* 책 이미지 */}
                <div className="w-18 h-18 flex-shrink-0">
                  <Image
                    src={item.bookImage}
                    alt={item.title}
                    width={64}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* 내용 */}
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

              {/* 구분선 */}
              {index < recents.length - 1 && (
                <div className="border-b border-border-primary" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}