import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type MeetupLikeStore = {
  likedPosts: Set<number>;
  toggleLike: (postId: number) => void;
  isLiked: (postId: number) => boolean;
};

export const useMeetupLikeStore = create<MeetupLikeStore>()(
  persist(
    (set, get) => ({
      likedPosts: new Set(),
      toggleLike: (postId) => {
        set((state) => {
          const next = new Set(state.likedPosts);
          if (next.has(postId)) {
            next.delete(postId);
          } else {
            next.add(postId);
          }
          return { likedPosts: next };
        });
      },
      isLiked: (postId) => get().likedPosts.has(postId),
    }),
    {
      name: 'meetup-liked-posts',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const data = JSON.parse(str);
          return {
            ...data,
            state: {
              ...data.state,
              likedPosts: new Set(data.state.likedPosts),
            },
          };
        },
        setItem: (name, value) => {
          const data = {
            ...value,
            state: {
              ...value.state,
              likedPosts: Array.from(value.state.likedPosts),
            },
          };
          localStorage.setItem(name, JSON.stringify(data));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
