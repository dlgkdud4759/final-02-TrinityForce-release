'use client';

import { useMemo, useRef, useState, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, X } from 'lucide-react';
import { useUserStore } from '@/zustand/useUserStore';
import { useLocationStore } from '@/zustand/useLocationStore';
import useAuthStatus from '@/utils/useAuthStatus';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

// 클라이언트에서만 true를 반환하는 훅
function useHasMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const localUser = localStorage.getItem('user');
  const sessionUser = sessionStorage.getItem('user');
  const userData = localUser || sessionUser;
  return userData ? JSON.parse(userData) : null;
}

export default function Page() {
  const router = useRouter();
  const hasMounted = useHasMounted();
  const { user, initUser } = useUserStore();
  const locationAddress = useLocationStore((state) => state.address);
  const isLoggedIn = useAuthStatus();

  // 컴포넌트 마운트 시 저장된 로그인 정보 확인
  useEffect(() => {
    initUser();
  }, [initUser]);

  // ---- 공통 스타일 ----
  const titleCls = 'text-7 font-medium text-font-dark';
  const subTitleCls = 'text-5 font-medium text-font-dark';
  const countCls = 'text-4 font-medium text-gray-dark';
  const dividerCls = 'border-t border-gray-lighter';

  // ---- UI 상태 ----
  const [images, setImages] = useState<File[]>([]);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [bookName, setBookName] = useState('');
  const [author, setAuthor] = useState('');

  const [category, setCategory] = useState('');

  const [condition, setCondition] = useState<'최상' | '상' | '중' | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 유효성 검사 상태 (필드별 터치 여부)
  const [touched, setTouched] = useState({
    images: false,
    bookName: false,
    author: false,
    category: false,
    condition: false,
    description: false,
  });

  // 모든 필드를 터치 상태로 변경 (제출 시)
  const touchAll = () => {
    setTouched({
      images: true,
      bookName: true,
      author: true,
      category: true,
      condition: true,
      description: true,
    });
  };

  // 개별 필드 터치 핸들러
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // 필수 라벨 스타일
  const requiredCls = 'text-[9px] font-medium text-red-dark ml-1';

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

  // 이미지 업로드 함수
  const uploadImages = async (files: File[]) => {
    const uploadedImages: { path: string; name: string; originalname: string }[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('attach', file);

      const res = await fetch(`${API_URL}/files`, {
        method: 'POST',
        headers: {
          'client-id': CLIENT_ID || '',
        },
        body: formData,
      });

      if (!res.ok) {
        throw new Error('이미지 업로드에 실패했습니다.');
      }

      const data = await res.json();
      if (data.ok && data.item?.[0]) {
        uploadedImages.push({
          path: data.item[0].path,
          name: data.item[0].name,
          originalname: file.name,
        });
      }
    }

    return uploadedImages;
  };

  // 도서 등록 함수
  const handleSubmit = async () => {
    const storedUser = getStoredUser();
    const accessToken = storedUser?.token?.accessToken || user?.token?.accessToken;

    // 로그인 확인
    if (!storedUser || !accessToken) {
      alert('도서를 등록하려면 로그인이 필요합니다.');
      return;
    }

    // 제출 시도 표시 (모든 필드 터치)
    touchAll();

    // 유효성 검사
    if (images.length === 0) {
      alert('도서 이미지를 등록해주세요.');
      return;
    }
    if (!bookName.trim()) {
      alert('도서명을 입력해주세요.');
      return;
    }
    if (!author.trim()) {
      alert('저자를 입력해주세요.');
      return;
    }
    if (!category) {
      alert('카테고리를 선택해주세요.');
      return;
    }
    if (!condition) {
      alert('도서 상태를 선택해주세요.');
      return;
    }
    if (!description.trim()) {
      alert('설명을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 이미지 업로드
      const uploadedImages = await uploadImages(images);

      // 2. 도서 등록 API 호출
      const productData = {
        name: bookName,
        content: description,
        mainImages: uploadedImages,
        price: 0,
        shippingFees: 0,
        quantity: 1,
        extra: {
          isBook: true,
          author,
          condition,
          category,
          location: locationAddress || user?.address || null,
        },
      };

      const res = await fetch(`${API_URL}/seller/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': CLIENT_ID || '',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '도서 등록에 실패했습니다.');
      }

      alert('도서가 성공적으로 등록되었습니다!');
      router.push('/');
    } catch (error) {
      console.error('등록 오류:', error);
      alert(error instanceof Error ? error.message : '도서 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 로그인 상태 안내 - 마운트 후에만 표시 */}
      {hasMounted && !isLoggedIn && (
        <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-200">
          <p className="text-sm text-yellow-800 text-center">
            도서를 등록하려면 먼저 로그인해주세요. 상단의 사람 아이콘을 클릭하여 로그인할 수 있습니다.
          </p>
        </div>
      )}

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
          <span className={requiredCls}>필수</span>
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
          {touched.images && images.length === 0 && (
            <p className="mt-2 text-[10px] text-red-dark">도서 이미지를 등록해야합니다.</p>
          )}
        </div>
      </div>

      <div className={dividerCls} />

      {/* 도서명 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center">
          <h3 className={titleCls}>도서명</h3>
          <span className={requiredCls}>필수</span>
        </div>

        <div className="mt-3 relative">
          <input
            value={bookName}
            onChange={(e) => setBookName(e.target.value.slice(0, 40))}
            onBlur={() => handleBlur('bookName')}
            placeholder="도서명을 입력해주세요."
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium focus:outline-none focus:border-brown-accent"
          />
          <div className="mt-2 flex justify-between items-center">
            {touched.bookName && !bookName.trim() ? (
              <p className="text-[10px] text-red-dark">도서명을 입력해야합니다.</p>
            ) : (
              <span />
            )}
            <span className="text-[18px] font-medium text-gray-dark">{bookNameCount}</span>
          </div>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 저자 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center">
          <h3 className={titleCls}>저자</h3>
          <span className={requiredCls}>필수</span>
        </div>

        <div className="mt-3 relative">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value.slice(0, 40))}
            onBlur={() => handleBlur('author')}
            placeholder="저자를 입력해주세요."
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium focus:outline-none focus:border-brown-accent"
          />
          <div className="mt-2 flex justify-between items-center">
            {touched.author && !author.trim() ? (
              <p className="text-[10px] text-red-dark">저자를 입력해야합니다.</p>
            ) : (
              <span />
            )}
            <span className="text-[18px] font-medium text-gray-dark">{authorCount}</span>
          </div>
        </div>
      </div>

      <div className={dividerCls} />

      {/* 카테고리 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center">
          <h3 className={titleCls}>카테고리</h3>
          <span className={requiredCls}>필수</span>
        </div>

        <div className="mt-3">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            onBlur={() => handleBlur('category')}
            className="w-full rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark focus:outline-none focus:border-brown-accent"
          >
            <option value="">카테고리를 선택해주세요</option>
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
          {touched.category && !category && (
            <p className="mt-2 text-[10px] text-red-dark">카테고리를 선택해야합니다.</p>
          )}
        </div>
      </div>

      <div className={dividerCls} />

      {/* 상태 + 가이드 버튼 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center">
            <h3 className={titleCls}>상태</h3>
            <span className={requiredCls}>필수</span>
          </div>
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
                  'px-4 py-2 rounded-lg border transition-colors',
                  'text-[16px] font-medium',
                  selected
                    ? 'text-font-dark border-brown-accent'
                    : 'text-gray-medium border-gray-lighter hover:text-font-dark hover:border-brown-accent',
                ].join(' ')}
              >
                {key}
              </button>
            );
          })}
        </div>
        {touched.condition && !condition && (
          <p className="mt-2 text-[10px] text-red-dark">상태를 선택해야합니다.</p>
        )}
      </div>

      <div className={dividerCls} />

      {/* 설명 */}
      <div className="px-4 py-4 max-w-6xl mx-auto">
        <div className="flex items-center">
          <h3 className={titleCls}>설명</h3>
          <span className={requiredCls}>필수</span>
        </div>

        <div className="mt-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={() => handleBlur('description')}
            placeholder="책 설명을 입력해주세요."
            className="w-full min-h-[140px] rounded-lg border border-gray-lighter bg-transparent px-4 py-3 text-[16px] text-font-dark placeholder:text-gray-medium resize-none focus:outline-none focus:border-brown-accent"
          />
          {touched.description && !description.trim() && (
            <p className="mt-2 text-[10px] text-red-dark">설명을 입력해야합니다.</p>
          )}
        </div>

        {/* 등록하기 버튼 (제일 우측) */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-5 py-3 rounded-lg bg-brown-guide text-font-white text-[16px] font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
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

            {/* 하단 문구 */}
            <p className="mt-3 text-[12px] font-medium text-red-dark">
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
