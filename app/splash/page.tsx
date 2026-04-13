'use client'

import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function SplashScreen() {
  const [stage, setStage] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const t1 = setTimeout(() => setStage(1), 100)
    const t2 = setTimeout(() => setStage(2), 600)
    const t3 = setTimeout(() => setStage(3), 1200)
    const t4 = setTimeout(() => {
      router.push('/')
    }, 2500)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center bg-bg-primary overflow-hidden">
      <div className="flex flex-col items-center gap-6">

        {/* 책 펼쳐지는 효과 */}
        <div className="relative flex items-center justify-center">
          {/* 왼쪽 페이지 */}
          <div
            className="absolute right-1/2 w-16 h-20 md:w-22 md:h-28 bg-brown-accent/20 rounded-l-sm origin-right transition-transform duration-700 ease-in-out"
            style={{
              transform: stage >= 2 ? 'rotateY(-35deg) translateX(-4px)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          />
          {/* 오른쪽 페이지 */}
          <div
            className="absolute left-1/2 w-16 h-20 md:w-22 md:h-28 bg-brown-accent/20 rounded-r-sm origin-left transition-transform duration-700 ease-in-out"
            style={{
              transform: stage >= 2 ? 'rotateY(35deg) translateX(4px)' : 'rotateY(0deg)',
              transformStyle: 'preserve-3d',
            }}
          />

          {/* 로고 */}
          <div
            className="relative z-10 transition-all duration-500 ease-out"
            style={{
              opacity: stage >= 1 ? 1 : 0,
              transform: stage >= 1 ? 'scale(1)' : 'scale(0.5)',
            }}
          >
            <Image
              src="/favicon.ico"
              alt="동네책장 로고"
              width={248}
              height={248}
              className="w-40 h-40 md:w-55 md:h-55"
            />
          </div>
        </div>

        {/* 텍스트 */}
        <div
          className="transition-all duration-700 ease-out"
          style={{
            opacity: stage >= 3 ? 1 : 0,
            transform: stage >= 3 ? 'translateY(0)' : 'translateY(12px)',
          }}
        >
          <p className="text-sm md:text-base text-brown-accent/70">
            동네 사람들의 책이 모이는 곳
          </p>
        </div>

      </div>
    </div>
  )
}