import { create } from 'zustand';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

interface AppState {
  ready: boolean;
  setReady: (ready: boolean) => void;
  tier: 'full' | 'poster';
  setTier: (tier: 'full' | 'poster') => void;
  reducedMotion: boolean;
  setReducedMotion: (reduced: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  ready: false,
  setReady: (ready) => set({ ready }),
  tier: 'full', // Default to full, updated by useDeviceTier
  setTier: (tier) => set({ tier }),
  reducedMotion: prefersReducedMotion(),
  setReducedMotion: (reducedMotion) => set({ reducedMotion }),
}));
