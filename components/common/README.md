## Input 컴포넌트 사용 예시 (회원가입 화면)

```tsx
"use client";

import { useState } from "react";
import EmailInput from "@/components/common/EmailInput";
import PasswordInput from "@/components/common/PasswordInput";
import InputWithButton from "@/components/common/InputWithButton";

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
        <p className="text-sm text-font-dark">이메일</p>
        <EmailInput
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      {/* 비밀번호 */}
      <div className="space-y-2">
        <p className="text-sm text-font-dark">비밀번호</p>
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* 닉네임 */}
      <div className="space-y-2">
        <p className="text-sm text-font-dark">닉네임</p>
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








---

# EmptyState 컴포넌트 사용 가이드

## 개요
데이터가 없을 때 표시되는 빈 상태 컴포넌트입니다.
알림, 교환 내역, 찜 목록 등이 비어있을 때 사용합니다.

## Props

| 이름 | 타입 | 필수 | 기본값 | 설명 |
|------|------|------|--------|------|
| title | string | ✅ | - | 굵게 표시되는 메인 문구 |
| description | string | ❌ | - | 작게 표시되는 부가 설명 |
| className | string | ❌ | "" | 추가 스타일링을 위한 클래스 |

## 사용 예시

### 1. 기본 사용 (제목만)
```jsx
import EmptyState from '@/components/common/EmptyState';

<EmptyState title="아직 알림이 없어요." />
```

### 2. 제목 + 설명
```jsx
<EmptyState 
  title="아직 교환 내역이 없어요."
  description="첫 번째 교환을 시작해보세요!"
/>
```

### 3. 커스텀 스타일 추가
```jsx
<EmptyState 
  title="찜한 책이 없어요."
  description="마음에 드는 책을 찜해보세요 💕"
  className="bg-gray-50"
/>
```

## 실제 사용 예시

### 알림 페이지
```jsx
'use client';

import EmptyState from '@/components/common/EmptyState';

export default function NotificationPage() {
  const notifications = []; // API에서 가져온 알림 목록

  if (notifications.length === 0) {
    return (
      <EmptyState 
        title="아직 알림이 없어요."
        description="새로운 소식이 오면 알려드릴게요!"
      />
    );
  }

  return (
    <div>
      {/* 알림 목록 렌더링 */}
    </div>
  );
}
```

### 교환 내역 페이지
```jsx
export default function ExchangePage() {
  const exchanges = [];

  return exchanges.length === 0 ? (
    <EmptyState 
      title="아직 교환 내역이 없어요."
      description="첫 번째 교환을 시작해보세요!"
    />
  ) : (
    <div>{/* 교환 내역 */}</div>
  );
}
```

### 찜 목록 페이지
```jsx
export default function WishlistPage() {
  const wishlist = [];

  if (wishlist.length === 0) {
    return (
      <EmptyState 
        title="찜한 책이 없어요."
        description="마음에 드는 책을 찜해보세요!"
      />
    );
  }

  return <div>{/* 찜 목록 */}</div>;
}
```

### 검색 결과 없음
```jsx
export default function SearchResults({ query, results }) {
  if (results.length === 0) {
    return (
      <EmptyState 
        title={`'${query}'에 대한 검색 결과가 없어요.`}
        description="다른 키워드로 검색해보세요."
      />
    );
  }

  return <div>{/* 검색 결과 */}</div>;
}
```

## 스타일 특징
- 세로 중앙 정렬 (min-h-[60vh])
- 제목: 큰 굵은 글씨 (text-xl font-bold)
- 설명: 작은 회색 글씨 (text-sm)
- 반응형 지원

## 주의사항
- `title`은 필수 props입니다.
- `description`은 선택사항이며, 생략 가능합니다.
- 페이지 중앙에 표시되므로 별도 컨테이너 필요 없습니다.