// app/user/mypage/page.tsx
import Link from "next/link"
import Image from "next/image"
import { AlertIcon } from "@/app/components/icons/Alert"
import { BlockIcon } from "@/app/components/icons/Block"
import { EditIcon } from "@/app/components/icons/Edit"
import { ExchangeIcon } from "@/app/components/icons/Exchange"
import { HeartFilledIcon } from "@/app/components/icons/HeartFilled"
import { LogOutIcon } from "@/app/components/icons/LogOut"
import { PostIcon } from "@/app/components/icons/Post"
import { ProfileIcon } from "@/app/components/icons/Profile"
import { ReviewsIcon } from "@/app/components/icons/Reviews"
import { WithdrawalIcon } from "@/app/components/icons/Withdrawal"

export default function MyPage() {
  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center">
          {/* 프로필 이미지 */}
          <div className="relative mb-3">
            <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center overflow-hidden">
              <span className="text-4xl">👤</span>
            </div>
            {/* 수정 버튼 */}
            <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-light rounded-full border-5 border-white flex items-center justify-center">
              <EditIcon className="w-4 h-4" />
            </button>
          </div>          
          {/* 닉네임 */}
          <p className="text-lg font-bold text-font-dark mb-1">닉네임</p>         
          {/* 이메일 */}
          <p className="text-sm text-gray-dark">example@gmail.com</p>
        </div>


        {/* 프로필 수정 */}
<div className="bg-white rounded-2xl mb-4 overflow-hidden">
  <Link 
    href="/user/profile-edit" 
    className="flex items-center px-4 py-3 hover:bg-gray-light transition"
  >
    <ProfileIcon className="w-5 h-5 mr-3" />
    <span className="text-font-dark">프로필 수정</span>
  </Link>
</div>


      {/* 목록 그룹 */}
      <div className="bg-white rounded-2xl mb-4 overflow-hidden">
        {/* 교환 목록 */}
        <Link 
          href="/user/exchange-list" 
          className="flex items-center px-4 py-3 border-b border-border-primary hover:bg-gray-light transition"
        >
          <ExchangeIcon className="w-5 h-5 mr-3" />
          <span className="text-font-dark">교환 목록</span>
        </Link>

        {/* 관심 목록 */}
        <Link 
          href="/user/wishlist" 
          className="flex items-center px-4 py-3 border-b border-border-primary hover:bg-gray-light transition"
        >
          <HeartFilledIcon className="w-5 h-5 mr-3" />
          <span className="text-font-dark">관심 목록</span>
        </Link>

        {/* 최근 본 글 */}
        <Link 
          href="/user/recent" 
          className="flex items-center px-4 py-3 border-b border-border-primary hover:bg-gray-light transition"
        >
          <PostIcon className="w-5 h-5 mr-3" />
          <span className="text-font-dark">최근 본 글</span>
        </Link>

        {/* 후기 목록 */}
        <Link 
          href="/user/reviews" 
          className="flex items-center px-4 py-3 hover:bg-gray-light transition"
        >
          <ReviewsIcon className="w-5 h-5 mr-3" />
          <span className="text-font-dark">후기 목록</span>
        </Link>
      </div>




        {/* 설정 그룹 */}
        <div className="bg-white rounded-2xl mb-4 overflow-hidden">
          {/* 알림 토글 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border-primary">
            <div className="flex items-center">
              <AlertIcon className="w-5 h-5 mr-3" />
              <span className="text-font-dark">알림</span>
            </div>
            {/* 토글 버튼 - 마크업만 */}
            <button className="relative w-12 h-6 bg-brown-accent rounded-full">
              <div className="absolute right-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform"></div>
            </button>
          </div>

          {/* 차단 목록 */}
          <Link 
            href="/user/blocked" 
            className="flex items-center px-4 py-3 hover:bg-gray-light transition"
          >
            <BlockIcon className="w-5 h-5 mr-3" />
            <span className="text-font-dark">차단 목록</span>
          </Link>
        </div>



        {/* 로그아웃/탈퇴 목록 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* 로그아웃 */}
          <button className="w-full flex items-center px-4 py-3 border-b border-border-primary hover:bg-gray-light transition text-left">
            <LogOutIcon className="w-5 h-5 mr-3" />
            <span className="text-font-dark">로그아웃</span>
          </button>

          {/* 회원 탈퇴 */}
          <button className="w-full flex items-center px-4 py-3 hover:bg-gray-light transition text-left">
            <WithdrawalIcon className="w-5 h-5 mr-3" />
            <span className="text-font-dark">회원 탈퇴</span>
          </button>
        </div>
      </div>
    </div>
  )
}