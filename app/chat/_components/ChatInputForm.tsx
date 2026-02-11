'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { ChatPictureIcon } from '@/app/components/icons/ChatPicture';
import { SendIcon } from '@/app/components/icons/Send';
import { ClosedIcon } from '@/app/components/icons/Closed';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

interface ChatInputFormProps {
  onSendMessage: (message: string) => Promise<void>;
}

export default function ChatInputForm({ onSendMessage }: ChatInputFormProps) {
  const [message, setMessage] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null); // 선택된 이미지 파일 상태
  const [imagePreview, setImagePreview] = useState<string | null>(null); // 이미지 미리보기 URL 상태
  const [isUploading, setIsUploading] = useState(false); // 이미지 업로드 중 상태
  const fileInputRef = useRef<HTMLInputElement>(null); // 파일 input 요소 참조

  /**
   * 선택된 이미지를 제거
   * 이미지 파일, 미리보기, input value를 모두 초기화
   */
  const handleRemoveImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * 이미지 파일을 서버에 업로드하는 함수
   * @param file - 업로드할 이미지 파일
   * @returns 업로드된 이미지의 URL 경로
   */
  const uploadImage = async (file: File): Promise<string> => {
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
      throw new Error('이미지 업로드 실패');
    }

    const data = await res.json();

    // 배열의 첫 번째 요소에서 path 추출
    if (!data.item || !Array.isArray(data.item) || data.item.length === 0) {
      throw new Error('이미지 경로를 받지 못했습니다');
    }

    const imagePath = data.item[0].path;

    return imagePath;
  };

  /**
   * 폼 제출 핸들러
   * 텍스트 메시지 또는 이미지를 서버로 전송
   * 이미지가 있으면 업로드 후 HTML img 태그로 변환하여 전송
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() && !selectedImage) {
      return;
    }

    try {
      setIsUploading(true);
      let finalMessage = message.trim();

      // 이미지가 있으면 먼저 업로드
      if (selectedImage) {
        const imageUrl = await uploadImage(selectedImage);

        // 이미지 URL을 <img> 태그로 변환
        const imgTag = `<img src="${imageUrl}" alt="첨부 이미지" style="max-width:300px; height:auto; border-radius:12px;" />`;

        // 메시지 + 이미지 태그 결합
        finalMessage = message.trim() ? `${message.trim()}\n${imgTag}` : imgTag;
      }

      // 최종 메시지 전송 (HTML 태그 포함)
      await onSendMessage(finalMessage);

      // 초기화
      setMessage('');
      handleRemoveImage();
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      alert('메시지 전송에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  /**
   * 이미지 파일 선택 핸들러
   * 파일 타입과 크기를 검증하고 미리보기를 생성
   */
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('이미지 파일만 선택할 수 있습니다.');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert('이미지 크기는 5MB 이하여야 합니다.');
        return;
      }

      setSelectedImage(file);

      // 이미지 미리보기 생성
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 이미지 첨부 버튼 클릭
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      {/* 이미지 미리보기 영역 */}
      {imagePreview && (
        <div className="fixed bottom-12 right-0 left-0 px-4 py-2 border-t border-b border-gray-lighter flex justify-center bg-white/30 backdrop-blur-md z-10">
          <div className="relative inline-block">
            <Image
              src={imagePreview}
              alt="첨부 이미지 미리보기"
              width={100}
              height={100}
              className="rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              disabled={isUploading}
              className="absolute -top-2 -right-2 bg-red-like rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-dark transition-colors disabled:opacity-50 cursor-pointer"
              aria-label="이미지 제거"
            >
              <ClosedIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* 채팅 입력 폼 */}
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 right-0 left-0 bg-white border-t border-gray-lighter"
      >
        {/* 입력 영역 */}
        <div className="flex gap-2 items-center px-2 py-1">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            disabled={isUploading}
            className="hidden"
          />

          <button
            type="button"
            onClick={handleImageButtonClick}
            disabled={isUploading}
            aria-label="이미지 첨부"
            className="text-brown-accent cursor-pointer shrink-0 hover:opacity-70 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChatPictureIcon />
          </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={isUploading || !!selectedImage}
            placeholder={
              selectedImage
                ? '이미지를 전송하거나 제거하세요'
                : isUploading
                  ? '업로드 중...'
                  : '메시지를 입력'
            }
            className="flex-1 min-w-0 text-font-dark font-bold rounded-[20px] bg-gray-light outline-none focus:outline-none px-3 py-2 disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={(!message.trim() && !selectedImage) || isUploading}
            aria-label="메시지 전송"
            className={`shrink-0 transition-opacity ${
              (message.trim() || selectedImage) && !isUploading
                ? 'text-green-primary hover:opacity-70 cursor-pointer'
                : 'text-gray-lighter cursor-not-allowed'
            }`}
          >
            {isUploading ? '...' : <SendIcon />}
          </button>
        </div>
      </form>
    </>
  );
}
