'use client';

import { useEffect, useCallback } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthStore } from '@/store/auth-store';
import {
  signInWithGoogle as authSignInWithGoogle,
  signInAsGuest as authSignInAsGuest,
  signOut as authSignOut,
  getUserProfile,
} from '@/services/auth';
import { getUserStats } from '@/services/firestore';
import type { UserProfile } from '@/types';
import { DEFAULT_USER_STATS } from '@/types';

/**
 * Custom hook that manages Firebase auth state and syncs with Zustand store.
 *
 * - Subscribes to onAuthStateChanged
 * - Loads user profile and stats from Firestore
 * - Provides auth action callbacks
 */
export function useAuth() {
  const { user, stats, loading, setUser, setStats, setLoading, setError } =
    useAuthStore();

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: User | null) => {
      try {
        if (firebaseUser) {
          // Try loading existing profile from Firestore
          const profile = await getUserProfile(firebaseUser.uid);

          if (profile) {
            setUser(profile);
          } else {
            // Build a profile from Firebase Auth data
            const fallbackProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName ?? 'Player',
              email: firebaseUser.email ?? null,
              photoURL: firebaseUser.photoURL ?? null,
              isGuest: firebaseUser.isAnonymous,
              createdAt: Date.now(),
            };
            setUser(fallbackProfile);
          }

          // Load stats
          const userStats = await getUserStats(firebaseUser.uid);
          setStats(userStats ?? DEFAULT_USER_STATS);
        } else {
          setUser(null);
          setStats(null);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load user data';
        setError(message);
        console.error('[useAuth] Error:', err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [setUser, setStats, setLoading, setError]);

  const signInWithGoogle = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await authSignInWithGoogle();
      setUser(profile);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign-in failed';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setUser, setLoading, setError]);

  const signInAsGuest = useCallback(
    async (displayName: string) => {
      setLoading(true);
      setError(null);
      try {
        const profile = await authSignInAsGuest(displayName);
        setUser(profile);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Guest sign-in failed';
        setError(message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [setUser, setLoading, setError]
  );

  const signOut = useCallback(async () => {
    try {
      await authSignOut();
      setUser(null);
      setStats(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign-out failed';
      setError(message);
    }
  }, [setUser, setStats, setError]);

  return {
    user,
    stats,
    loading,
    signInWithGoogle,
    signInAsGuest,
    signOut,
  };
}
