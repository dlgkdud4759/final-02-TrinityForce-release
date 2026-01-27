'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import EmailInput from '@/components/common/EmailInput';
import PasswordInput from '@/components/common/PasswordInput';
import { RoundCheckboxIcon } from '@/app/components/icons/RoundCheckbox';
import { KakaoIcon } from '@/app/components/icons/Kakao';
import { GoogleIcon } from '@/app/components/icons/Google';

type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

  const handleLogin = () => {
    console.log('로그인 클릭:', { email, password, keepLoggedIn });

  };

  const handleSignup = () => {
    onClose();
    router.push('/user/signup'); // 회원가입 페이지
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="flex flex-col items-center pt-8">
        {/* 제목 */}
        <h1 className="text-2xl font-bold text-font-dark mb-8">로그인</h1>

        {/* 이메일 입력 */}
        <div className="w-full flex flex-col items-center mb-6">
          <label className="w-[353px] text-sm text-font-dark mb-2">이메일</label>
          <EmailInput
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* 비밀번호 입력 */}
        <div className="w-full flex flex-col items-center mb-4">
          <label className="w-[353px] text-sm text-font-dark mb-2">비밀번호</label>
          <PasswordInput
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* 로그인 유지, 비밀번호 찾기 */}
        <div className="w-[353px] flex items-center justify-between mb-6">
          <button
            onClick={() => setKeepLoggedIn(!keepLoggedIn)}
            className="flex items-center gap-2"
          >
            <RoundCheckboxIcon
              className={`w-5 h-5 ${
                keepLoggedIn ? 'text-brown-accent' : 'text-gray-medium'
              }`}
            />
            <span className="text-sm text-font-dark">로그인 유지</span>
          </button>
          <a href="#" className="text-sm text-gray-dark">
            비밀번호를 잊으셨나요?
          </a>
        </div>

        {/* 로그인 버튼 */}
        <button
          onClick={handleLogin}
          className="w-[353px] py-3 bg-brown-accent text-white rounded-lg font-medium mb-4"
        >
          로그인
        </button>

        {/* 또는 */}
        <div className="text-sm text-gray-dark mb-4">또는</div>

        {/* 소셜 로그인 */}
        <div className="flex gap-4 mb-6">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
            <GoogleIcon className="w-6 h-6" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow">
            <KakaoIcon className="w-6 h-6" />
          </button>
        </div>

        {/* 회원가입 */}
        <div className="text-sm text-font-dark">
          계정이 없으신가요?{' '}
          <button onClick={handleSignup} className="underline font-medium text-brown-accent">
            회원가입
          </button>
        </div>
      </div>
    </Modal>
  );
}