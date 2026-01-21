## Input 컴포넌트 사용 예시 (회원가입 화면)

```tsx
"use client";

import { useState } from "react";
import EmailInput from "@/components/EmailInput";
import PasswordInput from "@/components/PasswordInput";
import InputWithButton from "@/components/InputWithButton";

export default function SignupExample() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");

  const handleNicknameCheck = () => {
    // 닉네임 중복확인 API 연결
    alert("닉네임 중복확인");
  };

  return (
    <div className="space-y-5">
      {/* 이메일 */}
      <div className="space-y-2">
        <p className="text-sm text-[#333333]">이메일</p>
        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* 비밀번호 */}
      <div className="space-y-2">
        <p className="text-sm text-[#333333]">비밀번호</p>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* 닉네임 */}
      <div className="space-y-2">
        <p className="text-sm text-[#333333]">닉네임</p>
        <InputWithButton
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="2~10자, 한글/영문/숫자"
          buttonText="중복확인"
          onButtonClick={handleNicknameCheck}
        />
      </div>
    </div>
  );
}
