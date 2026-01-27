"use client"


import InputWithButton from "@/components/common/InputWithButton"
import PasswordInput from "@/components/common/PasswordInput"
import Image from "next/image"

export default function SignUpPage() {
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
              value=""
              onChange={() => {}}
              type="email"
              placeholder="example@email.com"
              buttonText="중복확인"
              onButtonClick={() => {}}
               />
            </div>
          </div>

          {/* 닉네임 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">닉네임</p>
            <div className="w-full">
              <InputWithButton
                value=""
                onChange={() => {}}
                placeholder="2~10자, 한글/영문/숫자"
                buttonText="중복확인"
                onButtonClick={() => {}}
              />
            </div>
          </div>

          {/* 비밀번호 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">비밀번호</p>
            <div className="w-full">
              <PasswordInput
              value=""
              onChange={() => {}} />
            </div>
          </div>

          {/* 비밀번호 확인 */}
          <div className="space-y-2">
            <p className="text-sm text-font-dark">비밀번호 확인</p>
            <div className="w-full">
              <PasswordInput
              value=""
              onChange={() => {}} />
            </div>
          </div>

          {/* 회원가입 버튼 - 컴포넌트 사용 예정 */}
          <button className="w-full h-[56px] mt-4 bg-brown-accent text-font-white text-base font-semibold rounded-xl hover:bg-brown-guide transition">
            회원가입
          </button>
        </div>

        {/* 로그인 버튼 */}
        <p className="text-center mt-6 text-sm text-font-dark">
          이미 계정이 있으신가요?{" "}
          <button className="text-brown-accent font-semibold underline">
            로그인
          </button>
        </p>
      </div>
    </div>
  )
}