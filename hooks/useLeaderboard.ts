'use client';

import { useState, useEffect, useRef } from 'react';
import type { RoomData, LeaderboardEntry, PlayerAnswer } from '@/types';

export function useLeaderboard(room: RoomData | null): LeaderboardEntry[] {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const previousRanksRef = useRef<Record<string, number>>({});

  useEffect(() => {
    let mounted = true;
    if (!room?.players) {
      setTimeout(() => {
        if (mounted) setLeaderboard([]);
      }, 0);
      return () => { mounted = false; };
    }

    const players = Object.values(room.players);

    const playerStats: Record<string, { correctCount: number; fastestAnswer: number | null }> = {};

    for (const player of players) {
      let correctCount = 0;
      let fastestAnswer: number | null = null;

      if (room.answers) {
        for (const questionAnswers of Object.values(room.answers)) {
          const answer = (questionAnswers as Record<string, PlayerAnswer>)[player.uid];
          if (answer) {
            if (answer.isCorrect) {
              correctCount++;
              if (fastestAnswer === null || answer.timeElapsed < fastestAnswer) {
                fastestAnswer = answer.timeElapsed;
              }
            }
          }
        }
      }
      playerStats[player.uid] = { correctCount, fastestAnswer };
    }

    const entries: LeaderboardEntry[] = players
      .map((player) => {
        const stats = playerStats[player.uid] ?? { correctCount: 0, fastestAnswer: null };
        return {
          uid: player.uid,
          displayName: player.displayName,
          photoURL: player.photoURL,
          score: player.score,
          correctCount: stats.correctCount,
          streak: player.currentStreak,
          rank: 0,
          previousRank: previousRanksRef.current[player.uid] ?? null,
          fastestAnswer: stats.fastestAnswer,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
        const aFastest = a.fastestAnswer ?? Infinity;
        const bFastest = b.fastestAnswer ?? Infinity;
        return aFastest - bFastest;
      });

    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    const newRanks: Record<string, number> = {};
    entries.forEach((entry) => {
      newRanks[entry.uid] = entry.rank;
    });
    previousRanksRef.current = newRanks;

    setTimeout(() => {
      if (mounted) setLeaderboard(entries);
    }, 0);

    return () => { mounted = false; };
  }, [room]);

  return leaderboard;
}
