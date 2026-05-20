'use client';

import { create } from 'zustand';
import type { UserProfile, UserStats } from '@/types';

interface AuthState {
  user: UserProfile | null;
  stats: UserStats | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserProfile | null) => void;
  setStats: (stats: UserStats | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  stats: null,
  loading: true,
  error: null,
  setUser: (user) => set({ user }),
  setStats: (stats) => set({ stats }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  reset: () => set({ user: null, stats: null, loading: false, error: null }),
}));
