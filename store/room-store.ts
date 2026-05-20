'use client';

import { create } from 'zustand';
import type { RoomData } from '@/types';

interface RoomState {
  room: RoomData | null;
  isHost: boolean;
  setRoom: (room: RoomData | null) => void;
  setIsHost: (isHost: boolean) => void;
  reset: () => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  room: null,
  isHost: false,
  setRoom: (room) => set({ room }),
  setIsHost: (isHost) => set({ isHost }),
  reset: () => set({ room: null, isHost: false }),
}));
