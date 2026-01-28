'use client';

import { useState } from 'react';
import { ImagePlus } from 'lucide-react';
import HeaderSub from '@/components/layout/HeaderSub';
import Button from '@/components/ui/Button';

export default function CreatingMeeting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = () => {
    // 등록 로직
    console.log({ title, content });
  };

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* 헤더 */}
      <HeaderSub title="독서 모임" />

      {/* 페이지 제목 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-font-dark">모임 게시글 작성</h2>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 사진 섹션 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <p className="text-base md:text-lg font-medium text-font-dark mb-4">사진</p>

        {/* 이미지 등록 박스 */}
        <button
          type="button"
          className="w-53.5 h-53.5 md:w-60 md:h-60 border-2 bg-gray-lighter border-dashed border-gray-medium rounded-lg flex flex-col items-center justify-center gap-2 hover:border-brown-accent transition-colors"
        >
          <ImagePlus size={32} className="md:w-10 md:h-10 text-gray-medium" />
          <span className="text-sm md:text-base text-gray-medium">이미지 등록</span>
        </button>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 제목 섹션 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <p className="text-base md:text-lg font-medium text-font-dark mb-4">제목</p>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="게시글 제목을 입력해주세요."
          className="w-full px-4 py-3 md:px-5 md:py-4 border border-brown-accent rounded-lg text-sm md:text-base text-font-dark placeholder:text-gray-medium focus:outline-none focus:border-brown-accent"
        />
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 내용 섹션 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <p className="text-base md:text-lg font-medium text-font-dark mb-4">내용</p>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`게시글 내용을 입력해주세요.\n건강한 독서 생활을 위하여 바른말을 사용해주세요.`}
          className="w-full h-50 md:h-70 px-4 py-3 md:px-5 md:py-4 border border-brown-accent rounded-lg text-sm md:text-base text-font-dark placeholder:text-gray-medium resize-none focus:outline-none focus:border-brown-accent"
        />

        {/* 등록 버튼 */}
        <div className="flex justify-end mt-4 md:mt-6 pb-24">
          <Button text="등록하기" onClick={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
