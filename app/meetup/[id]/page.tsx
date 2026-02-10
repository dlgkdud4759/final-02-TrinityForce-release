'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { Heart } from 'lucide-react';
import HeaderSub from '@/components/layout/HeaderSub';
import Button from '@/components/ui/Button';
import LoginModal from '@/components/modals/LoginModal';
import useAuthStatus from '@/utils/useAuthStatus';
import { useLikeStore } from '@/zustand/useLikeStore';
import { getAxios, handleAxiosError } from '@/utils/axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;

type MeetupPost = {
  _id: number;
  type?: string;
  title: string;
  content: string;
  image?: { path: string; name?: string; originalname?: string } | string;
  createdAt?: string;
  likes?: number;
  bookmarks?: number;
  user?: { _id: number; name: string; image?: string };
};

const fallbackPost: MeetupPost = {
  _id: 0,
  type: 'meetup',
  title: '한강 작가 함께 읽기',
  content:
    '한강 작가의 작품을 함께 읽고 이야기 나누는 모임입니다. 매주 토요일 오후 2시에 모여서 책에 대한 생각을 나눕니다. 함께 책을 읽으며 깊은 대화를 나눠보아요.',
  image: '/images/book1.jpg',
  createdAt: '2025-01-28',
  likes: 24,
  user: { _id: 1, name: '책벌레' },
};

type Comment = {
  _id: number;
  user?: { _id: number; name: string; image?: string };
  content: string;
  createdAt?: string;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const dateStr = date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const timeStr = date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${dateStr} ${timeStr}`;
};

const getImageUrl = (image?: MeetupPost['image']) => {
  if (!image) return null;
  const path = typeof image === 'string' ? image : image.path;
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}/${path}`;
};

const getUserImageUrl = (path?: string) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}/${path}`;
};

export default function MeetupPostDetail() {
  const params = useParams<{ id: string }>();
  const postId = params?.id;
  const router = useRouter();
  const isLoggedIn = useAuthStatus();
  const { likedPosts, toggleLike } = useLikeStore();

  const [post, setPost] = useState<MeetupPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchPost = useCallback(async () => {
    if (!postId) return;
    try {
      setIsLoading(true);
      const res = await fetch(`${API_URL}/posts/${postId}`, {
        headers: { 'client-id': CLIENT_ID || '' },
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.message || '모임 게시글을 불러오는데 실패했습니다.');
      }

      if (data.item?.type && data.item.type !== 'meetup') {
        throw new Error('모임 게시글이 아닙니다.');
      }

      setPost(data.item);
      setComments(data.item?.replies || []);
    } catch (err) {
      console.error('모임 게시글 조회 실패:', err);
      setError('모임 게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const localUser = localStorage.getItem('user');
    const sessionUser = sessionStorage.getItem('user');
    const userData = localUser || sessionUser;
    if (!userData) {
      setCurrentUserId(null);
      return;
    }
    try {
      const parsed = JSON.parse(userData);
      setCurrentUserId(parsed?._id ?? null);
    } catch {
      setCurrentUserId(null);
    }
  }, [isLoggedIn]);

  const handleCommentSubmit = async () => {
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!commentText.trim()) {
      alert('댓글 내용을 입력해주세요.');
      return;
    }
    if (!postId) return;

    try {
      const axios = getAxios();
      const response = await axios.post(`/posts/${postId}/replies`, {
        content: commentText.trim(),
      });

      if (response.data?.ok) {
        const newReply = response.data.item;
        if (newReply) {
          setComments((prev) => [...prev, newReply]);
        } else {
          await fetchPost();
        }
        setCommentText('');
        return;
      }
      alert('댓글 등록에 실패했습니다.');
    } catch (error) {
      console.error('댓글 등록 실패:', error);
      handleAxiosError(error);
    }
  };

  const handleDeletePost = async () => {
    if (!post || !post._id) return;
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!confirm('게시글을 삭제할까요?')) return;

    try {
      const axios = getAxios();
      const response = await axios.delete(`/posts/${post._id}`);
      if (response.data?.ok) {
        alert('게시글이 삭제되었습니다.');
        router.push('/meetup');
        return;
      }
      alert('게시글 삭제에 실패했습니다.');
    } catch (error) {
      console.error('게시글 삭제 실패:', error);
      handleAxiosError(error);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!postId) return;
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }
    if (!confirm('댓글을 삭제할까요?')) return;

    try {
      const axios = getAxios();
      const response = await axios.delete(`/posts/${postId}/replies/${commentId}`);
      if (response.data?.ok) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        return;
      }
      alert('댓글 삭제에 실패했습니다.');
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
      handleAxiosError(error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-gray-medium">로딩 중...</p>
      </div>
    );
  }

  const displayPost = post ?? fallbackPost;
  const shouldShowError = !post && error;

  const imageUrl = getImageUrl(displayPost.image);
  const baseLikeCount = displayPost.likes ?? displayPost.bookmarks ?? 0;
  const isLiked = likedPosts.has(displayPost._id);
  const likeCount = isLiked ? baseLikeCount + 1 : baseLikeCount;

  return (
    <div className="min-h-screen bg-bg-primary pb-24">
      {/* 헤더 */}
      <HeaderSub title="독서 모임" backUrl="/meetup" />

      {/* 게시글 헤더 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <h2 className="text-xl md:text-2xl font-bold text-font-dark">
              {displayPost.title}
            </h2>
            <p className="text-sm md:text-base text-gray-dark">
              작성자: {displayPost.user?.name || '알 수 없음'}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 md:gap-2">
              <button
                type="button"
                aria-label="좋아요"
                onClick={() => toggleLike(displayPost._id)}
                className="flex items-center gap-1 cursor-pointer group"
              >
                <Heart
                  size={20}
                  className={`md:w-6 md:h-6 transition-colors ${
                    isLiked
                      ? 'text-red-like fill-red-like'
                      : 'text-gray-dark group-hover:text-red-like group-hover:fill-red-like'
                  }`}
                />
              </button>
              <span className="text-sm md:text-base text-gray-dark">{likeCount}</span>
            </div>
            <p className="text-[12px] md:text-[14px] text-gray-dark mt-1">
              {formatDate(displayPost.createdAt)}
            </p>
          </div>
        </div>
      </div>
      {shouldShowError && (
        <div className="px-4 md:px-6 max-w-6xl mx-auto">
          <p className="text-[12px] text-gray-medium">{error}</p>
        </div>
      )}

      {/* 구분선 */}
      <div className="border-t border-gray-lighter" />

      {/* 이미지 */}
      {imageUrl && (
        <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={imageUrl}
              alt={displayPost.title}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* 설명글 */}
      <div className="px-4 pb-4 md:px-6 md:pb-6 max-w-6xl mx-auto">
        <p className="text-sm md:text-base text-font-dark leading-relaxed">{displayPost.content}</p>
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
        {comments.length === 0 ? (
          <div className="px-4 py-6 text-center text-gray-medium">
            아직 댓글이 없습니다.
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id}>
              <div className="px-4 py-4 md:px-6 md:py-6">
                <div className="flex gap-3 md:gap-4">
                  {/* 프로필 이미지 */}
                  <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gray-200 shrink-0">
                    {comment.user?.image ? (
                      <Image
                        src={getUserImageUrl(comment.user.image) || ''}
                        alt={comment.user?.name || '사용자'}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-lg font-bold">
                        {comment.user?.name?.charAt(0) || '?'}
                      </div>
                    )}
                  </div>

                  {/* 댓글 내용 */}
                  <div className="flex-1">
                    <p className="text-sm md:text-base font-semibold text-font-dark mb-1">
                      {comment.user?.name || '알 수 없음'}
                    </p>
                    <p className="text-sm md:text-base text-font-dark">{comment.content}</p>
                    {comment.user?._id && comment.user._id === currentUserId && (
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-[12px] md:text-[14px] text-gray-dark hover:text-brown-accent transition-colors cursor-pointer"
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
          ))
        )}
      </div>

      {/* 댓글 작성 박스 */}
      <div className="px-4 py-4 md:px-6 md:py-6 max-w-6xl mx-auto">
        <div className="border border-brown-accent rounded-lg p-4 md:p-6">
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
      {post && displayPost.user?._id && displayPost.user._id === currentUserId && (
        <div className="flex justify-center mt-4 md:mt-6">
          <Button text="글 삭제" onClick={handleDeletePost} />
        </div>
      )}
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
}
