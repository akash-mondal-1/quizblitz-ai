import {
  signInWithPopup,
  signInAnonymously,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db, googleProvider } from '@/lib/firebase';
import type { UserProfile, UserStats } from '@/types';
import { DEFAULT_USER_STATS } from '@/types';

/**
 * Create or update a user profile document in Firestore.
 */
async function upsertUserProfile(profile: UserProfile): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized');

  const userRef = doc(db, 'users', profile.uid);
  const snapshot = await getDoc(userRef);

  if (snapshot.exists()) {
    // Update existing profile but preserve createdAt
    await updateDoc(userRef, {
      displayName: profile.displayName,
      email: profile.email,
      photoURL: profile.photoURL,
      isGuest: profile.isGuest,
    });
  } else {
    // Create new profile with stats
    await setDoc(userRef, {
      ...profile,
      createdAt: profile.createdAt,
    });
    // Initialize default stats
    await setDoc(doc(db, 'users', profile.uid, 'stats', 'current'), DEFAULT_USER_STATS);
  }
}

/**
 * Sign in with Google popup and create/update user profile.
 */
export async function signInWithGoogle(): Promise<UserProfile> {
  if (!auth || !googleProvider) {
    throw new Error('Firebase Auth is not initialized');
  }

  const result = await signInWithPopup(auth, googleProvider);
  const { uid, displayName, email, photoURL } = result.user;

  const profile: UserProfile = {
    uid,
    displayName: displayName ?? 'Player',
    email: email ?? null,
    photoURL: photoURL ?? null,
    isGuest: false,
    createdAt: Date.now(),
  };

  await upsertUserProfile(profile);
  return profile;
}

/**
 * Sign in anonymously as a guest with a custom display name.
 */
export async function signInAsGuest(displayName: string): Promise<UserProfile> {
  if (!auth) throw new Error('Firebase Auth is not initialized');

  const result = await signInAnonymously(auth);

  // Set display name on the anonymous user
  await updateProfile(result.user, { displayName });

  const profile: UserProfile = {
    uid: result.user.uid,
    displayName,
    email: null,
    photoURL: null,
    isGuest: true,
    createdAt: Date.now(),
  };

  await upsertUserProfile(profile);
  return profile;
}

/**
 * Sign out the current user.
 */
export async function signOut(): Promise<void> {
  if (!auth) throw new Error('Firebase Auth is not initialized');
  await firebaseSignOut(auth);
}

/**
 * Get a user profile from Firestore.
 */
export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;

  const userRef = doc(db, 'users', uid);
  const snapshot = await getDoc(userRef);

  if (!snapshot.exists()) return null;

  return snapshot.data() as UserProfile;
}

/**
 * Update specific fields on a user profile.
 */
export async function updateUserProfile(
  uid: string,
  data: Partial<Omit<UserProfile, 'uid' | 'createdAt'>>
): Promise<void> {
  if (!db) throw new Error('Firestore is not initialized');

  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}
