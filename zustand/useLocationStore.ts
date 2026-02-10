import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LocationState = {
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  setLocation: (address: string, lat: number, lng: number) => void;
  clearLocation: () => void;
};

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      address: null,
      latitude: null,
      longitude: null,
      setLocation: (address, latitude, longitude) => {
        set({ address, latitude, longitude });
      },
      clearLocation: () => {
        set({ address: null, latitude: null, longitude: null });
      },
    }),
    {
      name: 'user-location',
    }
  )
);
