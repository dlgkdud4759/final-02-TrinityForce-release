## Modal 컴포넌트 사용법

Modal은 **창(틀)만 담당**하는 공통 컴포넌트입니다.  
안에 들어가는 내용(입력폼, 버튼 등)은 `children`으로 넣습니다.

---

## 기본 사용 예시

```tsx
"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

export default function Example() {
  const [open, setOpen] = useState(true); // 테스트용: 처음부터 열기

  return (
    <div>
      <Modal isOpen={open} onClose={() => setOpen(false)}>
        <div className="space-y-4 text-center">
          <h2 className="text-lg font-semibold">모달 테스트</h2>

          <p className="text-sm text-gray-dark">
            모달 안에 들어가는 내용
          </p>

          <button
            onClick={() => setOpen(false)}
            className="w-full h-[56px] rounded-xl bg-brown-accent text-font-white"
          >
            닫기
          </button>
        </div>
      </Modal>
    </div>
  );
}
