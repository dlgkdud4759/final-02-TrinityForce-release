'use client';

import React, { useEffect } from 'react';
import { BackIcon } from '@/app/components/icons/Back';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode; // 모달 안 내용
  className?: string; // 모달 박스 스타일 추가
};

export default function Modal({
  isOpen,
  onClose,
  children,
  className = '',
}: ModalProps) {
  // ESC로 닫기
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6 sm:px-6">
      {/* 배경 어둡게 - 클릭하면 닫힘 */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* 모달 박스 */}
      <div
        className={[
          'relative z-10 w-full max-w-[500px] max-h-[80vh] overflow-y-auto rounded-2xl bg-bg-modal p-6',
          className,
        ].join(' ')}
        // 박스 클릭하면 안 닫히게
        onClick={(e) => e.stopPropagation()}
      >
        {/* 뒤로가기 버튼 */}
        <button
          type="button"
          onClick={onClose}
          className="absolute left-4 top-4"
          aria-label="뒤로가기"
        >
          <BackIcon className="w-6 h-6"></BackIcon>
        </button>
        {/* 실제 내용 */}
        {children}
      </div>
    </div>
  );
}
