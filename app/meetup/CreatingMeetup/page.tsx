'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, X } from 'lucide-react';
import HeaderSub from '@/components/layout/HeaderSub';
import Button from '@/components/ui/Button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

function getStoredUser() {
  if (typeof window === 'undefined') return null;
  const localUser = localStorage.getItem('user');
  const sessionUser = sessionStorage.getItem('user');
  const userData = localUser || sessionUser;
  return userData ? JSON.parse(userData) : null;
}

export default function CreatingMeeting() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    e.target.value = '';
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async () => {
    const storedUser = getStoredUser();
    const accessToken = storedUser?.token?.accessToken;

    if (!accessToken) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    if (!content.trim()) {
      alert('내용을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 이미지 업로드
      let uploadedImage = null;
      if (image) {
        const formData = new FormData();
        formData.append('attach', image);

        const uploadRes = await fetch(`${API_URL}/files`, {
          method: 'POST',
          headers: { 'client-id': CLIENT_ID || '' },
          body: formData,
        });

        if (!uploadRes.ok) throw new Error('이미지 업로드에 실패했습니다.');

        const uploadData = await uploadRes.json();
        if (uploadData.ok && uploadData.item?.[0]) {
          uploadedImage = uploadData.item[0];
        }
      }

      // 게시글 등록
      const postData: Record<string, unknown> = {
        type: 'meetup',
        title,
        content,
      };

      if (uploadedImage) {
        postData.image = uploadedImage;
      }

      const res = await fetch(`${API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'client-id': CLIENT_ID || '',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || '게시글 등록에 실패했습니다.');
      }

      alert('게시글이 등록되었습니다!');
      router.push('/meetup');
    } catch (error) {
      console.error('등록 오류:', error);
      alert(error instanceof Error ? error.message : '게시글 등록에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
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

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImageSelect}
        />

        {imagePreview ? (
          <div className="relative w-53.5 h-53.5 md:w-60 md:h-60 rounded-lg overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imagePreview} alt="미리보기" className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={removeImage}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/50 flex items-center justify-center"
              aria-label="이미지 삭제"
            >
              <X size={16} className="text-white" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="w-53.5 h-53.5 md:w-60 md:h-60 border-2 bg-gray-lighter border-dashed border-gray-medium rounded-lg flex flex-col items-center justify-center gap-2 hover:border-brown-accent transition-colors"
          >
            <ImagePlus size={32} className="md:w-10 md:h-10 text-gray-medium" />
            <span className="text-sm md:text-base text-gray-medium">이미지 등록</span>
          </button>
        )}
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
          <Button
            text={isSubmitting ? '등록 중...' : '등록하기'}
            onClick={isSubmitting ? undefined : handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
