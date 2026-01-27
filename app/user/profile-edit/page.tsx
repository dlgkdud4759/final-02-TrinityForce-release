"use client"

import InputWithButton from "@/components/common/InputWithButton"

export default function ProfileEditPage() {
  return (
    <div className="min-h-screen w-full bg-bg-primary">
      {/* 콘텐츠 */}
      <div className="px-4 py-6 max-w-[400px] mx-auto">

        {/* 닉네임 */}
        <div className="mb-4 flex flex-col items-center">
          <label className="w-full text-sm font-medium text-font-dark mb-2">
            닉네임
          </label>
          <InputWithButton
            value=""
            onChange={() => {}}
            placeholder="2~10자, 한글/영문/숫자"
            buttonText="중복확인"
            onButtonClick={() => {}}
          />
        </div>

        {/* 비밀번호 변경 */}
        <div className="mb-6 flex flex-col items-center">
          <button className="w-[353px] bg-white text-font-dark py-3 rounded-xl hover:bg-gray-light transition shadow-sm">
            비밀번호 변경
          </button>
        </div>

        {/* 완료 버튼 - 임시 */}
        <div className="flex justify-center">
          <button className="w-[353px] bg-brown-accent text-white py-3 rounded-xl hover:bg-brown-guide transition font-semibold">
            완료
          </button>
        </div>
      </div>
    </div>
  )
}