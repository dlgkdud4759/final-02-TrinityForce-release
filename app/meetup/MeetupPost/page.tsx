'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import HeaderSub from '@/components/layout/HeaderSub';
import Button from '@/components/ui/Button';

export default function MeetupPost() {
  const [commentText, setCommentText] = useState('');

  // 더미 데이터
  const post = {
    id: 1,
    title: '한강 작가 함께 읽기',
    description: '한강 작가의 작품을 함께 읽고 이야기 나누는 모임입니다. 매주 토요일 오후 2시에 모여서 책에 대한 생각을 나눕니다. 함께 책을 읽으며 깊은 대화를 나눠보아요.',
    image: '/images/book1.jpg',
    likes: 24,
    createdAt: '2025.01.28 14:30',
    isMyPost: true,
  };

  const comments = [
    {
      id: 1,
      profileImage: '/images/profile1.jpg',
      nickname: '책벌레',
      content: '저도 참여하고 싶어요! 언제 모임이 있나요?',
      isMyComment: false,
    },
    {
      id: 2,
      profileImage: '/images/profile2.jpg',
      nickname: '나',
      content: '매주 토요일 오후 2시에 진행됩니다!',
      isMyComment: true,
    },
  ];

  const myProfile = {
    profileImage: '/images/profile2.jpg',
    nickname: '나',
  };

  const handleCommentSubmit = () => {
    console.log('댓글 등록:', commentText);
    setCommentText('');
  };

  const handleDeleteComment = (commentId: number) => {
    console.log('댓글 삭제:', commentId);
  };

  const handleDeletePost = () => {
    console.log('글 삭제');
  };

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 헤더 */}
      <HeaderSub title="독서 모임" />

      {/* 게시글 헤더 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-font-dark">{post.title}</h2>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 md:gap-2">
              <Heart size={20} className="md:w-6 md:h-6 text-gray-dark" />
              <span className="text-sm md:text-base text-gray-dark">{post.likes}</span>
            </div>
            <p className="text-[12px] md:text-[14px] text-gray-dark mt-1">{post.createdAt}</p>
          </div>
        </div>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 이미지 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 설명글 */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 max-w-6xl mx-auto">
        <p className="text-sm md:text-base text-font-dark leading-relaxed">{post.description}</p>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 댓글 헤더 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto flex items-center gap-2">
        <span className="text-[22px] md:text-[26px] font-medium text-font-dark">댓글</span>
        <span className="text-[14px] md:text-[16px] font-normal text-gray-dark">{comments.length}</span>
      </div>

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 댓글 목록 */}
      <div className="max-w-6xl mx-auto">
        {comments.map((comment) => (
          <div key={comment.id}>
            <div className="px-4 py-4 md:px-6 md:py-6">
              <div className="flex gap-3 md:gap-4">
                {/* 프로필 이미지 */}
                <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                  <Image
                    src={comment.profileImage}
                    alt={comment.nickname}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* 댓글 내용 */}
                <div className="flex-1">
                  <p className="text-sm md:text-base font-semibold text-font-dark mb-1">
                    {comment.nickname}
                  </p>
                  <p className="text-sm md:text-base text-font-dark">{comment.content}</p>

                  {/* 내 댓글이면 삭제 버튼 */}
                  {comment.isMyComment && (
                    <div className="flex justify-end mt-2">
                      <button
                        type="button"
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-[12px] md:text-[14px] text-gray-dark hover:text-brown-accent transition-colors"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* 구분선 */}
            <div className="border-t border-gray-lighter" />
          </div>
        ))}
      </div>

      {/* 댓글 작성 박스 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="border border-brown-accent rounded-lg p-4 md:p-6">
          {/* 프로필 정보 */}
          <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
            <div className="relative w-8 h-8 md:w-10 md:h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
              <Image
                src={myProfile.profileImage}
                alt={myProfile.nickname}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-sm md:text-base font-semibold text-font-dark">{myProfile.nickname}</span>
          </div>

          {/* 댓글 입력 */}
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="건강한 독서 생활을 위하여 바른말을 사용해주세요."
            className="w-full h-20 md:h-25 text-[15px] md:text-[16px] font-normal text-font-dark placeholder:text-font-dark bg-transparent resize-none focus:outline-none"
          />

          {/* 등록 버튼 */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleCommentSubmit}
              className="px-4 py-2 md:px-5 md:py-2.5 bg-brown-guide text-font-white rounded-lg text-sm md:text-base font-medium transition-colors"
            >
              등록
            </button>
          </div>
        </div>

        {/* 글 삭제 버튼 (내 글일 때만) */}
        {post.isMyPost && (
          <div className="flex justify-center mt-4 md:mt-6">
            <Button text="글 삭제" onClick={handleDeletePost} />
          </div>
        )}
      </div>
    </div>
  );
}
