"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import InputWithButton from "@/components/common/InputWithButton"
import PasswordInput from "@/components/common/PasswordInput"
import Modal from "@/components/ui/Modal"
import HeaderSub from "@/components/layout/HeaderSub"
import { getUser, setUser as setLocalUser } from "@/utils/user"
import { getAxios, handleAxiosError } from "@/utils/axios"
import type { UserDetail } from "@/types/user"

export default function ProfileEditPage() {
  const router = useRouter()
  const currentUser = getUser()
  

  const [nickname, setNickname] = useState(currentUser?.name || '')
  const [isNicknameChecked, setIsNicknameChecked] = useState(false)
  const [isNicknameAvailable, setIsNicknameAvailable] = useState(false)
  
 
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  // 닉네임 중복 확인
  const handleCheckNickname = async () => {
    if (!nickname.trim()) {
      alert('닉네임을 입력해주세요.')
      return
    }
    
    if (nickname.length < 2 || nickname.length > 10) {
      alert('닉네임은 2~10자로 입력해주세요.')
      return
    }
    
    if (nickname === currentUser?.name) {
      alert('현재 닉네임과 동일합니다.')
      return
    }
    
    try {
      const axios = getAxios()
      const response = await axios.get(`/users?name=${nickname}`)
      
      if (response.data.item.length > 0) {
        alert('이미 사용 중인 닉네임입니다.')
        setIsNicknameAvailable(false)
      } else {
        alert('사용 가능한 닉네임입니다.')
        setIsNicknameChecked(true)
        setIsNicknameAvailable(true)
      }
    } catch (error) {
      console.error('중복 확인 에러:', error)
      handleAxiosError(error)
    }
  }
  
  // 닉네임 변경 시 중복 확인 초기화
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNickname(e.target.value)
    setIsNicknameChecked(false)
    setIsNicknameAvailable(false)
  }
  
  // 닉네임 변경 완료
  const handleSubmit = async () => {
    if (nickname === currentUser?.name) {
      alert('변경사항이 없습니다.')
      return
    }
    
    if (!isNicknameChecked || !isNicknameAvailable) {
      alert('닉네임 중복 확인을 해주세요.')
      return
    }
    
    try {
      const axios = getAxios()
      await axios.patch(`/users/${currentUser?._id}`, {
        name: nickname
      })
      
      // 업데이트
      const updatedUser = { ...currentUser, name: nickname } as UserDetail
      setLocalUser(updatedUser)
      
      alert('닉네임이 변경되었습니다!')
      router.push('/user/mypage')
    } catch (error) {
      console.error('닉네임 변경 에러:', error)
      handleAxiosError(error)
    }
  }
  
  // 비밀번호 변경
  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert('모든 항목을 입력해주세요.')
      return
    }
    
    if (newPassword.length < 8) {
      alert('새 비밀번호는 8자 이상이어야 합니다.')
      return
    }
    
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(newPassword)) {
      alert("비밀번호는 영문과 숫자를 포함해야 합니다.")
      return
    }

    if (newPassword !== confirmPassword) {
      alert('새 비밀번호가 일치하지 않습니다.')
      return
    }
    
    try {
      const axios = getAxios()
      await axios.patch(`/users/${currentUser?._id}`, {
        password: newPassword,
        currentPassword: currentPassword
      })
      
      alert('비밀번호가 변경되었습니다!')
      setShowPasswordModal(false)
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('비밀번호 변경 에러:', error)
      alert('비밀번호 변경에 실패했습니다. 현재 비밀번호를 확인해주세요.')
    }
  }

  return (
    <div className="min-h-screen w-full bg-bg-primary">
      <HeaderSub title="프로필 수정" backUrl="/user/mypage" />
      
      {/* 콘텐츠 */}
      <div className="px-4 py-6 max-w-[400px] mx-auto">
        {/* 닉네임 */}
        <div className="mb-4 flex flex-col items-center">
          <label className="w-full text-sm font-medium text-font-dark mb-2">
            닉네임
          </label>
          <InputWithButton
            value={nickname}
            onChange={handleNicknameChange}
            placeholder="2~10자, 한글/영문/숫자"
            buttonText="중복확인"
            onButtonClick={handleCheckNickname}
          />
        </div>

        {/* 비밀번호 변경 */}
        <div className="mb-6 flex flex-col items-center">
          <button 
            onClick={() => setShowPasswordModal(true)}
            className="w-[353px] bg-white text-font-dark py-3 rounded-xl hover:bg-gray-light transition shadow-sm"
          >
            비밀번호 변경
          </button>
        </div>

        {/* 완료 버튼 */}
        <div className="flex justify-center">
          <button 
            onClick={handleSubmit}
            className="w-[353px] bg-brown-accent text-white py-3 rounded-xl hover:bg-brown-guide transition font-semibold"
          >
            완료
          </button>
        </div>
      </div>

      {/* 비밀번호 변경 모달 */}
      <Modal isOpen={showPasswordModal} onClose={() => setShowPasswordModal(false)}>
        <div className="pt-6">
          <h2 className="text-xl font-bold text-font-dark mb-6 text-center">비밀번호 변경</h2>
          
          <div className="space-y-4 flex flex-col items-center">
            {/* 현재 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-font-dark mb-2">
                현재 비밀번호
              </label>
              <PasswordInput 
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>

            {/* 새 비밀번호 */}
            <div>
              <label className="block text-sm font-medium text-font-dark mb-2">
                새 비밀번호
              </label>
              <PasswordInput 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            {/* 새 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-medium text-font-dark mb-2">
                새 비밀번호 확인
              </label>
              <PasswordInput 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowPasswordModal(false)}
              className="flex-1 py-3 rounded-lg bg-white text-font-dark"
            >
              취소
            </button>
            <button
              onClick={handleChangePassword}
              className="flex-1 py-3 rounded-lg bg-brown-accent text-white"
            >
              변경하기
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}