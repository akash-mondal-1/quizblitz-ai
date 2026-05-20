import {
  ref,
  set,
  get,
  update,
  onValue,
  query,
  orderByChild,
  equalTo,
  onDisconnect,
  type Unsubscribe,
} from 'firebase/database';
import { database } from '@/lib/firebase';
import { nanoid } from 'nanoid';
import type {
  RoomData,
  Player,
  QuizConfig,
  GameState,
  PlayerAnswer,
  QuizQuestion,
} from '@/types';

/**
 * Create a new game room in Firebase Realtime Database.
 */
export async function createRoom(
  hostUid: string,
  hostName: string,
  hostPhoto: string | null,
  config: QuizConfig,
  questions: QuizQuestion[]
): Promise<{ roomId: string; code: string }> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomId = nanoid(12);
  const code = nanoid(6).toUpperCase();

  const hostPlayer: Player = {
    uid: hostUid,
    displayName: hostName,
    photoURL: hostPhoto,
    isHost: true,
    score: 0,
    currentStreak: 0,
    answeredCurrent: false,
    lastAnswerCorrect: null,
    lastAnswerTime: null,
    connected: true,
    warnings: 0,
  };

  const roomData: RoomData = {
    id: roomId,
    code,
    hostUid,
    config,
    gameState: 'lobby',
    currentQuestionIndex: 0,
    timerEnd: null,
    timerDuration: config.timePerQuestion,
    players: { [hostUid]: hostPlayer },
    questions,
    answers: {},
    createdAt: Date.now(),
  };

  const roomRef = ref(database, `rooms/${roomId}`);
  await set(roomRef, roomData);

  return { roomId, code };
}

/**
 * Find a room by its join code.
 */
export async function getRoomByCode(code: string): Promise<RoomData | null> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomsRef = ref(database, 'rooms');
  const roomQuery = query(roomsRef, orderByChild('code'), equalTo(code.toUpperCase()));
  const snapshot = await get(roomQuery);

  if (!snapshot.exists()) return null;

  // snapshot.val() returns { [roomId]: roomData }
  const rooms = snapshot.val() as Record<string, RoomData>;
  const entries = Object.values(rooms);

  // Return the first (and should be only) match
  return entries[0] ?? null;
}

/**
 * Join a room by its code.
 */
export async function joinRoom(
  code: string,
  player: Omit<Player, 'isHost' | 'score' | 'currentStreak' | 'answeredCurrent' | 'lastAnswerCorrect' | 'lastAnswerTime' | 'connected' | 'warnings'>
): Promise<RoomData> {
  const room = await getRoomByCode(code);

  if (!room) throw new Error('Room not found');
  if (room.gameState !== 'lobby') throw new Error('Game already in progress');
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const newPlayer: Player = {
    ...player,
    isHost: false,
    score: 0,
    currentStreak: 0,
    answeredCurrent: false,
    lastAnswerCorrect: null,
    lastAnswerTime: null,
    connected: true,
    warnings: 0,
  };

  const playerRef = ref(database, `rooms/${room.id}/players/${player.uid}`);
  await set(playerRef, newPlayer);

  return { ...room, players: { ...room.players, [player.uid]: newPlayer } };
}

/**
 * Remove a player from a room.
 */
export async function leaveRoom(roomId: string, uid: string): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const playerRef = ref(database, `rooms/${roomId}/players/${uid}`);
  await set(playerRef, null);
}

/**
 * Host kicks a player from the room.
 */
export async function kickPlayer(
  roomId: string,
  hostUid: string,
  targetUid: string
): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  // Verify the requester is the host
  const hostRef = ref(database, `rooms/${roomId}/hostUid`);
  const hostSnapshot = await get(hostRef);

  if (!hostSnapshot.exists() || hostSnapshot.val() !== hostUid) {
    throw new Error('Only the host can kick players');
  }

  const playerRef = ref(database, `rooms/${roomId}/players/${targetUid}`);
  await set(playerRef, null);
}

/**
 * Start the game — sets lobby → starting and establishes universal timer
 */
export async function startGame(roomId: string, countdownSeconds: number = 3): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomRef = ref(database, `rooms/${roomId}`);

  await update(roomRef, { 
    gameState: 'starting' as GameState,
    timerEnd: Date.now() + countdownSeconds * 1000,
    timerDuration: countdownSeconds
  });
}

/**
 * Transition from starting to playing.
 */
export async function transitionToPlaying(roomId: string, questionDuration: number): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomRef = ref(database, `rooms/${roomId}`);
  await update(roomRef, {
    gameState: 'playing' as GameState,
    timerEnd: Date.now() + questionDuration * 1000,
    timerDuration: questionDuration
  });
}

/**
 * Record a player's answer for the current question.
 */
export async function submitAnswer(
  roomId: string,
  questionId: string,
  uid: string,
  optionIndex: number,
  timeElapsed: number,
  isCorrect: boolean,
  score: number
): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const answer: PlayerAnswer = {
    optionIndex,
    timestamp: Date.now(),
    isCorrect,
    score,
    timeElapsed,
  };

  const updates: Record<string, unknown> = {};
  updates[`rooms/${roomId}/answers/${questionId}/${uid}`] = answer;
  updates[`rooms/${roomId}/players/${uid}/answeredCurrent`] = true;
  updates[`rooms/${roomId}/players/${uid}/lastAnswerCorrect`] = isCorrect;
  updates[`rooms/${roomId}/players/${uid}/lastAnswerTime`] = timeElapsed;

  if (isCorrect) {
    // Increment score and streak
    const playerRef = ref(database, `rooms/${roomId}/players/${uid}`);
    const playerSnapshot = await get(playerRef);

    if (playerSnapshot.exists()) {
      const playerData = playerSnapshot.val() as Player;
      updates[`rooms/${roomId}/players/${uid}/score`] = playerData.score + score;
      updates[`rooms/${roomId}/players/${uid}/currentStreak`] = playerData.currentStreak + 1;
    }
  } else {
    updates[`rooms/${roomId}/players/${uid}/currentStreak`] = 0;
  }

  const rootRef = ref(database);
  await update(rootRef, updates);
}

/**
 * Advance to the next question.
 */
export async function nextQuestion(roomId: string): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomRef = ref(database, `rooms/${roomId}`);
  const roomSnapshot = await get(roomRef);

  if (!roomSnapshot.exists()) throw new Error('Room not found');

  const room = roomSnapshot.val() as RoomData;
  const nextIndex = room.currentQuestionIndex + 1;

  // Reset all players' answeredCurrent flag
  const updates: Record<string, unknown> = {
    currentQuestionIndex: nextIndex,
    gameState: 'playing' as GameState,
  };

  const players = room.players;
  for (const uid of Object.keys(players)) {
    updates[`players/${uid}/answeredCurrent`] = false;
    updates[`players/${uid}/lastAnswerCorrect`] = null;
    updates[`players/${uid}/lastAnswerTime`] = null;
  }

  await update(roomRef, updates);
}

/**
 * End the game.
 */
export async function endGame(roomId: string): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomRef = ref(database, `rooms/${roomId}`);
  await update(roomRef, { gameState: 'finished' as GameState });
}

/**
 * Update the timer for the current question.
 */
export async function updateTimer(
  roomId: string,
  timerEnd: number,
  duration: number
): Promise<void> {
  if (!database) throw new Error('Firebase Realtime Database is not initialized');

  const roomRef = ref(database, `rooms/${roomId}`);
  await update(roomRef, { timerEnd, timerDuration: duration });
}

/**
 * Subscribe to real-time room data changes.
 * Returns an unsubscribe function.
 */
export function subscribeToRoom(
  roomId: string,
  callback: (room: RoomData | null) => void
): Unsubscribe {
  if (!database) {
    console.warn('[Room] Firebase Realtime Database is not initialized');
    callback(null);
    return () => {};
  }

  const roomRef = ref(database, `rooms/${roomId}`);
  return onValue(roomRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val() as RoomData);
    } else {
      callback(null);
    }
  });
}

/**
 * Setup presence management for a player.
 * Uses Firebase .info/connected and onDisconnect to track online/offline status.
 */
export function setupPresence(roomId: string, uid: string): Unsubscribe {
  if (!database) {
    console.warn('[Room] Firebase Realtime Database is not initialized');
    return () => {};
  }

  const connectedRef = ref(database, '.info/connected');
  const playerConnectedRef = ref(database, `rooms/${roomId}/players/${uid}/connected`);

  const unsubscribe = onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      console.log(`[Presence] Connected. Setting up onDisconnect for ${uid}`);
      onDisconnect(playerConnectedRef)
        .set(false)
        .then(() => {
          // Only set to true after onDisconnect is successfully queued
          set(playerConnectedRef, true);
        })
        .catch((err) => {
          console.error('[Presence] Error setting onDisconnect:', err);
        });
    } else {
      console.log(`[Presence] Disconnected state for ${uid}`);
    }
  });

  return () => {
    console.log(`[Presence] Cleaning up presence for ${uid}`);
    unsubscribe();
    onDisconnect(playerConnectedRef).cancel();
    set(playerConnectedRef, false);
  };
}
