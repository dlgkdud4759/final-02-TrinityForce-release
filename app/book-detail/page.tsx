'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { Heart, Star, X } from 'lucide-react';

import HeaderSub from '@/components/layout/HeaderSub';

export default function DetailPage() {
  // 공통 스타일
  const titleCls = 'text-[22px] font-medium text-font-dark';
  const dividerCls = 'border-t border-gray-lighter';

  // 더미 데이터
  const post = {
    likes: 24,
    createdAt: '2025.01.28 14:30',
  };

  const [liked, setLiked] = useState(false);

  const images = [
    '/images/book1.jpg',
    '/images/book2.jpg',
    '/images/book3.jpg',
  ];

  const [isGuideOpen, setIsGuideOpen] = useState(false);

  // 상태 버튼
  const condition: '최상' | '상' | '중' = '최상';

  const likeCount = useMemo(() => {
    // 단순 토글 시 숫자도 바뀌는 느낌만
    return liked ? post.likes + 1 : post.likes;
  }, [liked, post.likes]);

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 최상단 헤더 */}
      <HeaderSub title="상세 페이지" />

      {/* 우측: 하트 + 좋아요 + 작성일자 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-start justify-end">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2">
              <button
                type="button"
                aria-label="좋아요"
                onClick={() => setLiked((v) => !v)}
                className="flex items-center"
              >
                <Heart
                  size={22}
                  className={[
                    'transition-colors',
                    liked ? 'text-red-like' : 'text-gray-medium',
                  ].join(' ')}
                />
              </button>
              <span className="text-[16px] font-medium text-gray-medium">
                {likeCount}
              </span>
            </div>
            <p className="mt-1 text-[14px] font-medium text-gray-dark">
              {post.createdAt}
            </p>
          </div>
        </div>
      </div>

      {/* 도서명 */}
      <div className="px-4 pb-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>도서명</h3>
        <div className="mt-3">
          <input
            placeholder="도서명을 입력해주세요."
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium focus:outline-none focus:border-brown-accent"
          />
        </div>
      </div>

      <div className={dividerCls} />

      {/* 도서 사진 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>도서 사진</h3>

        {/* 가로 슬라이드 */}
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {images.map((src, idx) => (
            <div
              key={`${src}-${idx}`}
              className="relative shrink-0 w-64 h-40 rounded-lg overflow-hidden bg-gray-100 border border-gray-lighter"
            >
              <Image src={src} alt={`도서 사진 ${idx + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      </div>

      <div className={dividerCls} />

      {/* 설명 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>설명</h3>
        <div className="mt-3">
          <textarea
            placeholder="책에 대한 설명을 입력해주세요."
            className="w-full min-h-45 rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium resize-none focus:outline-none focus:border-brown-accent"
          />
        </div>
      </div>

      <div className={dividerCls} />

      {/* 도서 상태 + 가이드 모달 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <h3 className={titleCls}>도서 상태</h3>
          <button
            type="button"
            onClick={() => setIsGuideOpen(true)}
            className="text-[14px] font-medium text-brown-accent underline underline-offset-4 hover:text-font-dark transition-colors"
          >
            도서 상태 기준 가이드
          </button>
        </div>

        {/* 상태 버튼 */}
        <div className="mt-3 flex gap-3">
          <button
            type="button"
            className={[
              'px-4 py-2 rounded-lg border border-gray-lighter text-[16px] font-medium transition-colors',
              condition === '최상' ? 'text-font-dark border-brown-accent' : 'text-gray-dark',
            ].join(' ')}
          >
            최상
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-lighter text-[16px] font-medium text-gray-dark"
          >
            상
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded-lg border border-gray-lighter text-[16px] font-medium text-gray-dark"
          >
            중
          </button>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 프로필 카드 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <h3 className={titleCls}>프로필 카드</h3>

        <div className="mt-3 rounded-xl border border-gray-lighter p-4">
          <div className="flex items-start gap-3">
            {/* 프로필 이미지 */}
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image src="/images/profile1.jpg" alt="작성자 프로필" fill className="object-cover" />
            </div>

            {/* 닉네임 + 별점 */}
            <div className="flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[16px] font-semibold text-font-dark">
                  책벌레
                </span>

                <div className="flex items-center gap-1">
                  <Star size={18} className="text-gray-dark" />
                  <span className="text-[14px] font-medium text-gray-dark">
                    5.0
                  </span>
                  <span className="text-[14px] font-medium text-gray-dark">
                    (100)
                  </span>
                </div>
              </div>

              {/* 채팅하기 버튼 */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-brown-guide text-font-white text-[14px] font-medium hover:opacity-90 transition-opacity"
                >
                  채팅하기
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== 모달: 도서 상태 기준 가이드 ===== */}
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

            {/* 5x5 표 */}
            <div className="mt-4 overflow-hidden rounded-lg border border-gray-lighter overflow-x-auto">
              <table className="w-full text-[8px] text-font-dark">
                <thead>
                  <tr>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[50px]">구분</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[140px]">헌 상태</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[150px]">표지</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter min-w-[140px]">책등 / 책배</th>
                    <th className="bg-brown-accent text-font-white p-2 border-b border-gray-lighter min-w-[160px]">내부 / 제본상태</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">최상</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">새것에 가까운 책</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 찢어진 흔적 없음\n닳은 흔적 없음, 낙서 없음\n얼룩 없음, 양장본의 겉표지 있음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음\n닳은 흔적 없음, 얼룩 없음`}</td>
                    <td className="p-2 border-b border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음, 변형 없음\n얼룩 없음, 접힌 흔적 없음\n제본 탈착 없음`}</td>
                  </tr>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">상</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">약간의 사용감은 있으나 깨끗한 책</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`희미한 변색이나 작은 얼룩이 있음\n찢어진 흔적 없음\n약간의 모서리 해짐\n낙서 없음, 양장본의 겉표지 있음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`희미한 변색이나 작은 얼룩이 있음\n약간의 닳은 흔적 있음\n낙서 없음`}</td>
                    <td className="p-2 border-b border-gray-lighter align-top whitespace-pre-line">{`변색 없음, 낙서 없음, 변형 없음\n아주 약간의 접힌 흔적 있음\n얼룩 없음, 제본 탈착 없음`}</td>
                  </tr>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-b border-r border-gray-lighter text-center font-medium">중</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top">사용감이 많으며 헌 느낌이 나는 책</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`전체적인 변색, 모서리 해짐 있음\n2cm 이하의 찢어짐, 오염 있음\n낙서 있음, 양장본의 겉표지 없음`}</td>
                    <td className="p-2 border-b border-r border-gray-lighter align-top whitespace-pre-line">{`전체적인 변색, 모서리 해짐 있음\n오염 있음, 낙서 있음(이름 포함)`}</td>
                    <td className="p-2 border-b border-gray-lighter align-top whitespace-pre-line">{`변색 있음, 2cm 이하 찢어짐 있음\n5쪽 이하의 필기 및 밑줄 있음\n얼룩 및 오염 있음, 제본 탈착 없음`}</td>
                  </tr>
                  <tr>
                    <td className="bg-brown-accent text-font-white p-2 border-r border-gray-lighter text-center font-medium">매입불가</td>
                    <td className="p-2 border-r border-gray-lighter align-top">독서 및 이용에 지장이 있는 책</td>
                    <td className="p-2 border-r border-gray-lighter align-top whitespace-pre-line">{`2cm 초과한 찢어짐 있음\n심한 오염 및 낙서 있음\n물에 젖은 흔적 있음`}</td>
                    <td className="p-2 border-r border-gray-lighter align-top whitespace-pre-line">{`심한 오염 있음, 심한 낙서 있음\n물에 젖은 흔적 있음`}</td>
                    <td className="p-2 border-gray-lighter align-top whitespace-pre-line">{`2cm 초과한 찢어짐, 5쪽 초과 낙서\n심한 오염 이나 젖은 흔적 있음\n낙장 등의 제본불량, 분책 된 경우`}</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
