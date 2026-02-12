import { create } from 'zustand';
import { getAxios } from '@/utils/axios';

type LikedPost = {
  _id: number;
  bookmarkId: number;
  likedAt: string;
};

type MeetupLikeStore = {
  likedPosts: Map<number, LikedPost>;
  currentUserId: number | null;
  setCurrentUser: (userId: number | null) => void;
  loadBookmarksFromServer: () => Promise<void>;
  toggleLike: (postId: number) => Promise<boolean | null>;
  isLiked: (postId: number) => boolean;
};

const getStorageKey = (userId: number | null) => {
  return userId ? `meetup-liked-posts-${userId}` : null;
};

const loadLikedPosts = (userId: number | null): Map<number, LikedPost> => {
  if (typeof window === 'undefined') return new Map();
  const key = getStorageKey(userId);
  if (!key) return new Map();

  const stored = localStorage.getItem(key);
  if (!stored) return new Map();

  try {
    const parsed = JSON.parse(stored);
    return new Map(parsed);
  } catch {
    return new Map();
  }
};

const saveLikedPosts = (userId: number | null, posts: Map<number, LikedPost>) => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  if (!key) return;
  localStorage.setItem(key, JSON.stringify(Array.from(posts.entries())));
};

export const useMeetupLikeStore = create<MeetupLikeStore>((set, get) => ({
  likedPosts: new Map(),
  currentUserId: null,

  setCurrentUser: (userId) => {
    const likedPosts = loadLikedPosts(userId);
    set({ currentUserId: userId, likedPosts });
  },

  loadBookmarksFromServer: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    try {
      const axios = getAxios();
      const response = await axios.get('/bookmarks/post');
      const bookmarks = response.data.item || [];

      const next = new Map<number, LikedPost>();
      for (const bookmark of bookmarks) {
        if (bookmark?.target_id) {
          next.set(bookmark.target_id, {
            _id: bookmark.target_id,
            bookmarkId: bookmark._id,
            likedAt: bookmark.createdAt || new Date().toLocaleString('ko-KR'),
          });
        }
      }

      saveLikedPosts(currentUserId, next);
      set({ likedPosts: next });
    } catch (error) {
      console.error('모임 좋아요 목록 불러오기 실패:', error);
    }
  },

  toggleLike: async (postId) => {
    const { currentUserId, likedPosts } = get();
    const existingBookmark = likedPosts.get(postId);
    const isCurrentlyLiked = !!existingBookmark;

    try {
      const axios = getAxios();

      if (isCurrentlyLiked && existingBookmark) {
        await axios.delete(`/bookmarks/${existingBookmark.bookmarkId}`);

        const next = new Map(likedPosts);
        next.delete(postId);
        if (currentUserId) {
          saveLikedPosts(currentUserId, next);
        }
        set({ likedPosts: next });
        return false;
      }

      const response = await axios.post('/bookmarks/post', {
        target_id: postId,
        memo: 'like',
      });

      const bookmarkId = response.data.item?._id;
      if (!bookmarkId) return null;

      const next = new Map(likedPosts);
      next.set(postId, {
        _id: postId,
        bookmarkId,
        likedAt: new Date().toLocaleString('ko-KR'),
      });

      if (currentUserId) {
        saveLikedPosts(currentUserId, next);
      }
      set({ likedPosts: next });
      return true;
    } catch (error) {
      console.error('모임 좋아요 처리 실패:', error);
      return null;
    }
  },

  isLiked: (postId) => get().likedPosts.has(postId),
}));
