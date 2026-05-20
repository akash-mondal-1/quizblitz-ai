'use client';

import { useCallback, useEffect, useRef } from 'react';
import { soundManager, SoundManager } from '@/utils/sounds';

interface UseSoundReturn {
  playCorrect: () => void;
  playWrong: () => void;
  playTick: () => void;
  playCountdown: () => void;
  playButtonClick: () => void;
  playGameStart: () => void;
  playGameEnd: () => void;
  playAchievement: () => void;
}

/**
 * Custom hook that provides sound effect callbacks.
 * Initializes the AudioContext on first user interaction (click/keydown).
 */
export function useSound(): UseSoundReturn {
  const managerRef = useRef<SoundManager>(soundManager);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (initializedRef.current) return;

    const initAudio = () => {
      if (!initializedRef.current) {
        managerRef.current.init();
        initializedRef.current = true;
      }
    };

    // AudioContext requires a user gesture to start
    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('keydown', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    return () => {
      document.removeEventListener('click', initAudio);
      document.removeEventListener('keydown', initAudio);
      document.removeEventListener('touchstart', initAudio);
    };
  }, []);

  const playCorrect = useCallback(() => managerRef.current.playCorrect(), []);
  const playWrong = useCallback(() => managerRef.current.playWrong(), []);
  const playTick = useCallback(() => managerRef.current.playTick(), []);
  const playCountdown = useCallback(() => managerRef.current.playCountdown(), []);
  const playButtonClick = useCallback(() => managerRef.current.playButtonClick(), []);
  const playGameStart = useCallback(() => managerRef.current.playGameStart(), []);
  const playGameEnd = useCallback(() => managerRef.current.playGameEnd(), []);
  const playAchievement = useCallback(() => managerRef.current.playAchievement(), []);

  return {
    playCorrect,
    playWrong,
    playTick,
    playCountdown,
    playButtonClick,
    playGameStart,
    playGameEnd,
    playAchievement,
  };
}
