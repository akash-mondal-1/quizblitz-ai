'use client';

import { useEffect, useState } from 'react';
import { subscribeToRoom } from '@/services/room';
import { useRoomStore } from '@/store/room-store';
import { useAuthStore } from '@/store/auth-store';
import type { RoomData, Player, GameState, QuizQuestion } from '@/types';

interface UseRoomReturn {
  room: RoomData | null;
  isHost: boolean;
  players: Record<string, Player>;
  gameState: GameState | null;
  currentQuestion: QuizQuestion | null;
  loading: boolean;
}

/**
 * Custom hook that subscribes to real-time room data via Firebase RTDB.
 *
 * @param roomId - The room ID to subscribe to (null = no subscription)
 */
export function useRoom(roomId: string | null): UseRoomReturn {
  const { room, isHost, setRoom, setIsHost } = useRoomStore();
  const user = useAuthStore((s) => s.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    if (!roomId) {
      setTimeout(() => {
        if (mounted) {
          setRoom(null);
          setIsHost(false);
          setLoading(false);
        }
      }, 0);
      return () => { mounted = false; };
    }

    setTimeout(() => {
      if (mounted) setLoading(true);
    }, 0);

    const unsubscribe = subscribeToRoom(roomId, (roomData: RoomData | null) => {
      queueMicrotask(() => {
        if (!mounted) return;
        setRoom(roomData);

        if (roomData && user) {
          setIsHost(roomData.hostUid === user.uid);
        } else {
          setIsHost(false);
        }

        setLoading(false);
      });
    });

    return () => {
      unsubscribe();
    };
  }, [roomId, user, setRoom, setIsHost]);

  const players: Record<string, Player> = room?.players || {};

  const currentQuestion: QuizQuestion | null =
    room?.questions && room.currentQuestionIndex < room.questions.length
      ? room.questions[room.currentQuestionIndex]
      : null;

  const gameState: GameState | null = room?.gameState ?? null;

  return {
    room,
    isHost,
    players,
    gameState,
    currentQuestion,
    loading,
  };
}
