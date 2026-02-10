'use client';

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
import HeaderSub from "@/components/layout/HeaderSub"
import Modal from "@/components/ui/Modal"
import { getUser, setUser as setLocalUser } from '@/utils/user';
import { useState, useRef } from 'react';
import type { UserDetail } from '@/types/user';
import { getAxios } from '@/utils/axios';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/zustand/useUserStore';

export default function MyPage() {
  const router = useRouter();
  const logout = useUserStore((state) => state.logout);
  
  const [user, setUser] = useState<UserDetail | null>(() => {
    if (typeof window !== 'undefined') {
      return getUser();
    }
    return null;
  });
  
  const [showMenu, setShowMenu] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  const [isNotificationOn, setIsNotificationOn] = useState(true);

  const handleEditClick = () => {
    setShowMenu(!showMenu);
  };

  const handleChangeImage = () => {
    setShowMenu(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const axios = getAxios();
      const formData = new FormData();
      formData.append('attach', file);
      
      const uploadResponse = await axios.post('/files/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const imagePath = uploadResponse.data.item[0].path;
      
      await axios.patch(`/users/${user?._id}`, {
        image: imagePath
      });
      
      const updatedUser = { ...user, image: imagePath } as UserDetail;
      setUser(updatedUser);
      setLocalUser(updatedUser);
      
      alert('프로필 사진이 변경되었습니다!');
    } catch (error) {
      console.error('업로드 에러:', error);
      alert('사진 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    setShowMenu(false);
    try {
      const axios = getAxios();
      
      await axios.patch(`/users/${user?._id}`, {
        image: ''
      });
      
      const updatedUser = { ...user, image: '' } as UserDetail;
      setUser(updatedUser);
      setLocalUser(updatedUser);
      
      alert('프로필 사진이 삭제되었습니다!');
    } catch (error) {
      console.error('삭제 에러:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    logout();
    router.push('/');
  };

  // 회원 탈퇴 처리
  const handleWithdrawal = async () => {
  alert('회원 탈퇴 기능은 준비 중입니다.');
  setShowWithdrawalModal(false);
};
  
  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title="내 정보"/>
      <div className="px-4 py-6 max-w-md mx-auto">
        {/* 프로필 카드 */}
        <div className="bg-white rounded-2xl p-6 mb-4 flex flex-col items-center">
          {/* 프로필 이미지 */}
          <div className="relative mb-3">
            <div className="w-20 h-20 bg-brown-accent rounded-full flex items-center justify-center overflow-hidden">
              {user?.image ? (
                <Image 
                  src={user.image} 
                  alt={user.name || '프로필'}
                  width={80}
                  height={80}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-white">
                  {user?.name?.[0] || '?'}
                </span>
              )}
            </div>
            
            {/* 수정 버튼 */}
            <button 
              onClick={handleEditClick}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-7 h-7 bg-gray-light rounded-full border-5 border-white flex items-center justify-center"
            >
              {isUploading ? '...' : <EditIcon className="w-4 h-4" />}
            </button>
            
            {/* 메뉴 */}
            {showMenu && (
              <div className="absolute bottom-10 right-0 bg-white rounded-lg shadow-lg py-2 min-w-[120px] z-10">
                <button
                  onClick={handleChangeImage}
                  className="w-full px-4 py-2 text-left text-sm text-font-dark hover:bg-gray-light"
                >
                  사진 변경
                </button>
                {user?.image && (
                  <button
                    onClick={handleDeleteImage}
                    className="w-full px-4 py-2 text-left text-sm text-red-like hover:bg-gray-light"
                  >
                    사진 삭제
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 파일 탐색기 */}
          <input 
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          {/* 닉네임 */}
          <p className="text-lg font-bold text-font-dark mb-1">
            {user?.name || '닉네임'}
          </p>         
          {/* 이메일 */}
          <p className="text-sm text-gray-dark">
            {user?.email || 'example@gmail.com'}
          </p>
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
            {/* 토글 버튼 */}
            <button 
              onClick={() => setIsNotificationOn(!isNotificationOn)}
              className={`relative w-12 h-6 rounded-full transition ${
                isNotificationOn ? 'bg-brown-accent' : 'bg-gray-light'
              }`}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                isNotificationOn ? 'right-0.5' : 'left-0.5'
              }`}></div>
            </button>
          </div>

          {/* 차단 목록 */}
          <button
            onClick={() => alert('준비 중인 기능입니다.')}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-light transition text-left opacity-50 cursor-not-allowed"
          >
            <BlockIcon className="w-5 h-5 mr-3" />
            <span className="text-font-dark">차단 목록 (준비 중)</span>
          </button>
        </div>

        {/* 로그아웃/탈퇴 목록 */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* 로그아웃 */}
          <button 
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center px-4 py-3 border-b border-border-primary hover:bg-gray-light transition text-left"
          >
            <LogOutIcon className="w-5 h-5 mr-3" />
            <span className="text-font-dark">로그아웃</span>
          </button>

          {/* 회원 탈퇴 */}
          <button 
            onClick={() => setShowWithdrawalModal(true)}
            className="w-full flex items-center px-4 py-3 hover:bg-gray-light transition text-left"
          >
            <WithdrawalIcon className="w-5 h-5 mr-3" />
            <span className="text-font-dark">회원 탈퇴</span>
          </button>
        </div>
      </div>

      {/* 로그아웃 모달 */}
      <Modal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)}>
        <div className="text-center pt-6">
          <h2 className="text-xl font-bold text-font-dark mb-4">로그아웃</h2>
          <p className="text-gray-dark mb-6">정말 로그아웃 하시겠습니까?</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="flex-1 py-3 rounded-lg bg-white text-font-dark"
            >
              취소
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-lg bg-brown-accent text-white"
            >
              로그아웃
            </button>
          </div>
        </div>
      </Modal>

      {/* 회원 탈퇴 모달 */}
      <Modal isOpen={showWithdrawalModal} onClose={() => setShowWithdrawalModal(false)}>
        <div className="text-center pt-6">
          <h2 className="text-xl font-bold text-font-dark mb-4">회원 탈퇴</h2>
          <p className="text-gray-dark mb-2">정말 탈퇴하시겠습니까?</p>
          <p className="text-sm text-red-like mb-6">탈퇴 시 모든 데이터가 삭제됩니다.</p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowWithdrawalModal(false)}
              className="flex-1 py-3 rounded-lg bg-white text-font-dark"
            >
              취소
            </button>
            <button
              onClick={handleWithdrawal}
              className="flex-1 py-3 rounded-lg bg-red-like text-white"
            >
              탈퇴
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}