import { create } from 'zustand';
import { getAxios } from '@/utils/axios';

type LikedBook = {
  _id: number;
  bookmarkId: number; // 서버에서 받은 북마크 ID
  name: string;
  image: string;
  author?: string;
  likedAt: string;
};

type LikeStore = {
  likedBooks: Map<number, LikedBook>;
  currentUserId: number | null;
  setCurrentUser: (userId: number | null) => void;
  loadBookmarksFromServer: () => Promise<void>;
  toggleLike: (book: { _id: number; name: string; image: string; author?: string }) => Promise<boolean>;
  isLiked: (bookId: number) => boolean;
  getLikedBooks: () => LikedBook[];
};

const getStorageKey = (userId: number | null) => {
  return userId ? `liked-books-${userId}` : null;
};

const loadLikedBooks = (userId: number | null): Map<number, LikedBook> => {
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

const saveLikedBooks = (userId: number | null, books: Map<number, LikedBook>) => {
  if (typeof window === 'undefined') return;
  const key = getStorageKey(userId);
  if (!key) return;

  localStorage.setItem(key, JSON.stringify(Array.from(books.entries())));
};

export const useLikeStore = create<LikeStore>((set, get) => ({
  likedBooks: new Map(),
  currentUserId: null,

  setCurrentUser: (userId) => {
    const likedBooks = loadLikedBooks(userId);
    set({ currentUserId: userId, likedBooks });
  },

  // 서버에서 내 좋아요 목록 불러오기
  loadBookmarksFromServer: async () => {
    const { currentUserId } = get();
    if (!currentUserId) return;

    try {
      const axios = getAxios();
      // is_like=true 파라미터로 좋아요 목록만 조회
      const response = await axios.get('/bookmarks/product', {
        params: { is_like: true }
      });
      const bookmarks = response.data.item || [];

      const next = new Map<number, LikedBook>();
      for (const bookmark of bookmarks) {
        const product = bookmark.product;
        if (product) {
          next.set(product._id, {
            _id: product._id,
            bookmarkId: bookmark._id,
            name: product.name,
            image: product.mainImages?.[0]?.path || '',
            author: product.extra?.author,
            likedAt: bookmark.createdAt || new Date().toLocaleString('ko-KR'),
          });
        }
      }

      saveLikedBooks(currentUserId, next);
      set({ likedBooks: next });
    } catch (error) {
      console.error('북마크 목록 불러오기 실패:', error);
    }
  },

  toggleLike: async (book) => {
    const { currentUserId, likedBooks } = get();
    const existingBookmark = likedBooks.get(book._id);
    const isCurrentlyLiked = !!existingBookmark;

    try {
      const axios = getAxios();

      if (isCurrentlyLiked && existingBookmark) {
        // 좋아요 취소 - DELETE /bookmarks/{bookmarkId}
        await axios.delete(`/bookmarks/${existingBookmark.bookmarkId}`);

        // 로컬 상태 업데이트
        const next = new Map(likedBooks);
        next.delete(book._id);

        if (currentUserId) {
          saveLikedBooks(currentUserId, next);
        }
        set({ likedBooks: next });
      } else {
        // 좋아요 추가 - POST /bookmarks/product with is_like: true
        const response = await axios.post('/bookmarks/product', {
          target_id: book._id,
          is_like: true,
        });

        const bookmarkId = response.data.item._id;

        // 로컬 상태 업데이트
        const next = new Map(likedBooks);
        next.set(book._id, {
          _id: book._id,
          bookmarkId: bookmarkId,
          name: book.name,
          image: book.image,
          author: book.author,
          likedAt: new Date().toLocaleString('ko-KR'),
        });

        if (currentUserId) {
          saveLikedBooks(currentUserId, next);
        }
        set({ likedBooks: next });
      }

      return true;
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
      return false;
    }
  },

  isLiked: (bookId) => {
    return get().likedBooks.has(bookId);
  },

  getLikedBooks: () => {
    return Array.from(get().likedBooks.values());
  },
}));
