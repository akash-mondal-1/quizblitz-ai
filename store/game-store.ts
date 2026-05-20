'use client';

import { create } from 'zustand';
import type { BadgeId, EmojiReaction } from '@/types';

interface GameState {
  selectedAnswer: number | null;
  timeRemaining: number;
  showExplanation: boolean;
  explanation: string;
  newBadges: BadgeId[];
  reactions: EmojiReaction[];
  setSelectedAnswer: (index: number | null) => void;
  setTimeRemaining: (time: number) => void;
  setShowExplanation: (show: boolean) => void;
  setExplanation: (text: string) => void;
  addReaction: (reaction: EmojiReaction) => void;
  clearReactions: () => void;
  setNewBadges: (badges: BadgeId[]) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  selectedAnswer: null,
  timeRemaining: 0,
  showExplanation: false,
  explanation: '',
  newBadges: [],
  reactions: [],
  setSelectedAnswer: (index) => set({ selectedAnswer: index }),
  setTimeRemaining: (time) => set({ timeRemaining: time }),
  setShowExplanation: (show) => set({ showExplanation: show }),
  setExplanation: (text) => set({ explanation: text }),
  addReaction: (reaction) =>
    set((state) => ({ reactions: [...state.reactions, reaction] })),
  clearReactions: () => set({ reactions: [] }),
  setNewBadges: (badges) => set({ newBadges: badges }),
  reset: () =>
    set({
      selectedAnswer: null,
      timeRemaining: 0,
      showExplanation: false,
      explanation: '',
      newBadges: [],
      reactions: [],
    }),
}));
