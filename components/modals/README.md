# LoginModal

비회원 사용자가 로그인이 필요한 기능에 접근할 때 모달 형태로 로그인 화면을 표시하는 컴포넌트입니다.

## 📍 경로
```
components/modals/LoginModal.tsx
```

## 🚀 사용법

### 기본 사용
```tsx
'use client';

import { useState } from 'react';
import LoginModal from '@/components/modals/LoginModal';

export default function ExamplePage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      <button onClick={() => setShowLogin(true)}>
        로그인
      </button>
      
      <LoginModal 
        isOpen={showLogin} 
        onClose={() => setShowLogin(false)} 
      />
    </>
  );
}
```

### 비회원 체크 후 사용
```tsx
const handleLike = () => {
  if (!isLoggedIn) {
    setShowLogin(true);
    return;
  }
  // 좋아요 기능 실행
};

<button onClick={handleLike}>좋아요</button>
<LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
```

## 📦 Props

| Name | Type | Required | Description |
|------|------|----------|-------------|
| `isOpen` | `boolean` | ✅ | 모달 열림/닫힘 상태 |
| `onClose` | `() => void` | ✅ | 모달 닫기 함수 |
