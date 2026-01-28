'use client';

import { useMemo, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function Page() {
  // ---- 공통 스타일 ----
  const titleCls = 'text-7 font-medium text-font-dark';
  const subTitleCls = 'text-5 font-medium text-font-dark';
  const countCls = 'text-4 font-medium text-gray-dark';
  const dividerCls = 'border-t border-gray-lighter';

  // ---- UI 상태(최소) ----
  const [images, setImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');

  const [category, setCategory] = useState<'전체' | string>('전체');

  const [condition, setCondition] = useState<'최상' | '상' | '중' | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const imageCountText = useMemo(() => `(${images.length}/12)`, [images.length]);

  const bookNameCount = `${bookName.length}/40`;
  const authorCount = `${author.length}/40`;

  const openFilePicker = () => fileRef.current?.click();

  const onPickImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    // 최대 12장 제한
    setImages((prev) => prev.concat(files).slice(0, 12));

    // 같은 파일 재선택 가능하도록
    e.target.value = '';
  };

  const removeImage = (idx: number) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 상단: 도서정보 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <h2 className={titleCls}>도서정보</h2>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 도서이미지 + 카운트 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <span className={subTitleCls}>도서이미지</span>
          <span className={countCls}>{imageCountText}</span>
        </div>

        {/* 이미지 등록 칸 (독서모임 게시글 작성 페이지와 동일 컨셉: 업로드 박스 + 프리뷰) */}
        <div className="mt-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onPickImages}
          />

          <div className="flex gap-3 overflow-x-auto pb-2">
            {/* 업로드 버튼 카드 */}
            <button
              type="button"
              onClick={openFilePicker}
              className="shrink-0 w-24 h-24 rounded-lg border border-gray-lighter bg-transparent flex flex-col items-center justify-center hover:border-brown-accent transition-colors"
              aria-label="이미지 등록"
            >
              <Plus size={22} className="text-gray-medium" />
              <span className="mt-1 text-[12px] text-gray-dark">등록</span>
            </button>

            {/* 선택된 이미지 미리보기 */}
            {images.map((file, idx) => {
              const url = URL.createObjectURL(file);
              return (
                <div
                  key={`${file.name}-${idx}`}
                  className="relative shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-lighter bg-gray-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={`선택 이미지 ${idx + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center"
                    aria-label="이미지 삭제"
                  >
                    <X size={14} className="text-white" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 도서명 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>도서명</h3>

        <div className="mt-3 relative">
          <input
            value={bookName}
            onChange={(e) => setBookName(e.target.value.slice(0, 40))}
            placeholder="도서명을 입력해주세요."
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium focus:outline-none focus:border-brown-accent"
          />
          <div className="mt-2 flex justify-end">
            <span className="text-[18px] font-medium text-gray-dark">{bookNameCount}</span>
          </div>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 저자 (도서명과 동일 구조) */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>저자</h3>

        <div className="mt-3 relative">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value.slice(0, 40))}
            placeholder="저자를 입력해주세요."
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium focus:outline-none focus:border-brown-accent"
          />
          <div className="mt-2 flex justify-end">
            <span className="text-[18px] font-medium text-gray-dark">{authorCount}</span>
          </div>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 카테고리 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>카테고리</h3>

        <div className="mt-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark focus:outline-none focus:border-brown-accent"
          >
            <option value="전체">전체</option>
            <option value="과학">과학</option>
            <option value="인문학">인문학</option>
            <option value="사회과학">사회과학</option>
            <option value="예술">예술</option>
            <option value="수험서">수험서</option>
            <option value="자기계발">자기계발</option>
            <option value="소설">소설</option>
            <option value="참고서">참고서</option>
            <option value="어린이">어린이</option>
          </select>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 상태 + 가이드 버튼 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h3 className={titleCls}>상태</h3>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-[14px] font-medium text-brown-accent underline underline-offset-4 hover:text-font-dark transition-colors"
          >
            도서 상태 기준 가이드
          </button>
        </div>

        {/* 상태 선택 버튼들 */}
        <div className="mt-3 flex gap-3">
          {(['최상', '상', '중'] as const).map((key) => {
            const selected = condition === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setCondition(key)}
                className={[
                  'px-4 py-2 rounded-lg border border-gray-lighter transition-colors',
                  'text-[16px] font-medium',
                  selected ? 'text-font-dark border-brown-accent' : 'text-gray-medium',
                  'hover:text-font-dark hover:border-brown-accent',
                ].join(' ')}
              >
                {key}
              </button>
            );
          })}
        </div>
      </div>

      <div className={dividerCls} />

      {/* 설명 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>설명</h3>

        <div className="mt-3">
          <textarea
            placeholder="책 설명을 입력해주세요."
            className="w-full min-h-[140px] rounded-lg border border-brown-accent bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium resize-none focus:outline-none"
          />
        </div>

        {/* 등록하기 버튼 (제일 우측) */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            className="px-5 py-3 rounded-lg bg-brown-guide text-font-white text-[16px] font-medium hover:opacity-90 transition-opacity"
          >
            등록하기
          </button>
        </div>
      </div>

      {/* ====== 모달 ====== */}
      {isGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-2xl bg-bg-primary p-5">
            <div className="flex items-center justify-between">
              <h4 className="text-[18px] font-semibold text-font-dark">도서 상태 기준</h4>
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
                aria-label="닫기"
              >
                <X size={18} className="text-font-dark" />
              </button>
            </div>

            {/* 5x4 표 */}
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-lighter">
              <div className="grid grid-cols-5">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-12 border-b border-r border-gray-lighter last:border-r-0"
                  />
                ))}
              </div>
            </div>

            {/* 하단 문구 */}
            <p className="mt-3 text-[14px] font-medium text-red-dark">
              그 외 심한 훼손이 있는 책은 교환 불가입니다.
            </p>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={() => setIsGuideOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-lighter text-[14px] font-medium text-font-dark hover:border-brown-accent transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
