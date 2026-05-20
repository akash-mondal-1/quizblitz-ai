import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { UserStats } from '@/types';

/**
 * Save complete user stats to Firestore.
 * Path: users/{uid}/stats/current
 */
export async function saveUserStats(uid: string, stats: UserStats): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized');

  const statsRef = doc(db, 'users', uid, 'stats', 'current');
  await setDoc(statsRef, stats);
}

/**
 * Get user stats from Firestore.
 * Returns null if no stats document exists.
 */
export async function getUserStats(uid: string): Promise<UserStats | null> {
  if (!db) return null;

  const statsRef = doc(db, 'users', uid, 'stats', 'current');
  const snapshot = await getDoc(statsRef);

  if (!snapshot.exists()) return null;

  return snapshot.data() as UserStats;
}

/**
 * Merge-update specific fields in user stats.
 */
export async function updateUserStats(
  uid: string,
  partialStats: Partial<UserStats>
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized');

  const statsRef = doc(db, 'users', uid, 'stats', 'current');
  const snapshot = await getDoc(statsRef);

  if (snapshot.exists()) {
    await updateDoc(statsRef, partialStats);
  } else {
    // If the stats doc doesn't exist yet, create it with defaults merged
    await setDoc(statsRef, partialStats);
  }
}

/**
 * Save a game result to the user's games subcollection.
 * Path: users/{uid}/games/{auto-id}
 */
export interface GameResultData {
  roomId: string;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  rank: number;
  totalPlayers: number;
  category: string;
  difficulty: string;
  playedAt: number;
}

export async function saveGameResult(
  uid: string,
  gameData: GameResultData
): Promise<string> {
  if (!db) throw new Error('Firestore is not initialized');

  const gamesCollection = collection(db, 'users', uid, 'games');
  const docRef = await addDoc(gamesCollection, {
    ...gameData,
    playedAt: gameData.playedAt ?? Date.now(),
  });

  return docRef.id;
}
