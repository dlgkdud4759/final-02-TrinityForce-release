import { create } from 'zustand';

type LikedBook = {
  _id: number;
  name: string;
  image: string;
  author?: string;
  likedAt: string;
};

type LikeStore = {
  likedBooks: Map<number, LikedBook>;
  currentUserId: number | null;
  setCurrentUser: (userId: number | null) => void;
  toggleLike: (book: { _id: number; name: string; image: string; author?: string }) => void;
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

  toggleLike: (book) => {
    const { currentUserId, likedBooks } = get();
    if (currentUserId === null) return;

    const next = new Map(likedBooks);

    if (next.has(book._id)) {
      next.delete(book._id);
    } else {
      next.set(book._id, {
        _id: book._id,
        name: book.name,
        image: book.image,
        author: book.author,
        likedAt: new Date().toLocaleString('ko-KR'),
      });
    }

    saveLikedBooks(currentUserId, next);
    set({ likedBooks: next });
  },

  isLiked: (bookId) => {
    return get().likedBooks.has(bookId);
  },

  getLikedBooks: () => {
    return Array.from(get().likedBooks.values());
  },
}));
