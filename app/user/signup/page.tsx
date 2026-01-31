"use client"

import InputWithButton from "@/components/common/InputWithButton"
import PasswordInput from "@/components/common/PasswordInput"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { getAxios, handleAxiosError } from "@/utils/axios"
import { useUserStore } from "@/zustand/useUserStore"
import LoginModal from "@/components/modals/LoginModal"

export default function SignUpPage() {
  const router = useRouter();
  const setUser = useUserStore((state) => state.setUser);

  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // 이메일 중복 확인
  const handleEmailCheck = async () => {
    const trimmedEmail = email.trim()

    // 빈 값일 때
    if (!trimmedEmail) {
      alert('이메일을 입력해주세요.')
      return
    }

    // 이메일 형식 검증
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(trimmedEmail)) {
      alert('이메일 형식이 올바르지 않습니다.')
      return
    }

    try {
      const axios = getAxios()
      const response = await axios.get(`/users/email?email=${encodeURIComponent(trimmedEmail)}`)

      console.log('이메일 중복 확인 응답:', response.data)

      if (response.data.ok === 1) {
        alert('사용 가능한 이메일입니다.')
      } else {
        alert('이미 사용 중인 이메일입니다.')
      }
    } catch (error) {
      console.error('이메일 중복 확인 에러:', error)
      handleAxiosError(error)
    }
      }
    

  // 닉네임 중복 확인
  const hadleNameCheck = async () => {
    const trimmedName = name.trim()

    // 빈 값일 때
    if (!trimmedName) {
      alert('닉네임을 입력해주세요.')
      return
    }

    // 닉네임 유효성 (2자~10자, 한글/영문/숫자)
    const nameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/
    if (!nameRegex.test(trimmedName)) {
      alert("닉네임은 2~10자, 한글/영문/숫자만 가능합니다.")
      return
    }

    try {
      const axios = getAxios()
      const response = await axios.get(`/users/name?name=${encodeURIComponent(trimmedName)}`);

      console.log('닉네임 중복 확인 응답:', response.data);

      if (response.data.ok === 1) {
        alert('사용 가능한 닉네임입니다.')
      } else {
        alert('이미 사용 중인 닉네임입니다.')
      }
      } catch (error) {
        console.error('닉네임 중복 확인 에러:', error);
        handleAxiosError(error)
      }
    }


  // 회원가입
  const handleSignup = async () => {
    const trimmedEmail = email.trim()
    const trimmedName = name.trim()

    // 1. 빈 값 체크
    if (!trimmedEmail || !trimmedName || !password || !passwordConfirm) {
      alert("모든 항목을 입력해주세요.")
      return
    }

    // 2. 이메일 형식 체크
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    if (!emailRegex.test(trimmedEmail)) {
      alert("이메일 형식이 올바르지 않습니다.")
      return
    }

    // 3. 닉네임 유효성 체크
    const nameRegex = /^[가-힣a-zA-Z0-9]{2,10}$/
    if (!nameRegex.test(trimmedName)) {
      alert("닉네임은 2~10자, 한글/영문/숫자만 가능합니다.")
      return
    }

    // 4. 비밀번호 길이
      if (password.length < 8) {
      alert("비밀번호는 8자 이상이어야 합니다.")
      return
    }

    // 5) 비밀번호 형식 체크
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/
    if (!passwordRegex.test(password)) {
      alert("비밀번호는 영문과 숫자를 포함해야 합니다.")
      return
    }

    // 6) 비밀번호 일치
    if (password !== passwordConfirm) {
      alert("비밀번호가 일치하지 않습니다.")
      return
    }

    try {
      setIsLoading(true)

      const axios = getAxios()
      const response = await axios.post('/users', {
        email: trimmedEmail,
        password,
        name: trimmedName,
        type: 'seller'
      })

      console.log('회원가입 응답:', response.data)

      if (response.data.ok) {
        const userData = response.data.item
        setUser(userData, true) //  바로 로그인

        alert('회원가입 성공!')
        router.push('/')
      } else {
        alert('회원가입에 실패했습니다.')
      }
      } catch (error) {
        console.error('회원가입 에러:', error)
        handleAxiosError(error)
      } finally {
        setIsLoading(false)
      }
    }

    // 로그인 페이지로
    const goToLogin = () => {
      setShowLogin(true)
    }
  
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-bg-primary">
      <div className="w-full max-w-[400px] py-6">
        
        <div className="flex flex-col items-center mb-8">
          <Image
            src="/favicon.ico"
            alt="동네책장 로고"
            width={117}
            height={117}
            className="w-20 h-20 md:w-28 md:h-28 mb-4"
          />
        </div>

        {/* 입력폼 */}
        <div className="space-y-5 w-full max-w-[353px] mx-auto">
          {/* 이메일 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">이메일</p>
            <div className="w-full">
              <InputWithButton
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="example@email.com"
              buttonText="중복확인"
              onButtonClick={handleEmailCheck}
               />
            </div>
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">닉네임</p>
            <div className="w-full">
              <InputWithButton
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="2~10자, 한글/영문/숫자"
                buttonText="중복확인"
                onButtonClick={hadleNameCheck}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">비밀번호</p>
            <div className="w-full">
              <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">비밀번호 확인</p>
            <div className="w-full">
              <PasswordInput
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)} />
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
          type="button"
          onClick={handleSignup}
          disabled={isLoading} 
          className="w-full h-[56px] mt-4 bg-brown-accent text-font-white text-base font-semibold rounded-xl hover:bg-brown-guide transition">
            회원가입
          </button>
        </div>

        {/* 로그인 버튼 */}
        <p className="text-center mt-6 text-sm text-font-dark">
          이미 계정이 있으신가요?{" "}
          <button
          onClick={goToLogin} className="text-brown-accent font-semibold underline">
            로그인
          </button>
        </p>
      </div>

      {/* 로그인 모달  */}
      <LoginModal
      isOpen={showLogin}
      onClose={() => setShowLogin(false)}
      onLoginSuccess={() => router.push('/')} />
    </div>
  )
}