/**
 * OpportunityX Resume — Ecosystem Authentication Bridge
 *
 * Adapts Firebase Authentication state to the session shape
 * expected by ResumeContext and all consuming components.
 *
 * This is NOT a standalone auth system — it bridges the central
 * OpportunityX Firebase Auth to the Resume app's session model.
 *
 * Resume NEVER writes to central user profiles.
 * Resume NEVER creates entries in the main OpportunityX Firestore.
 */
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import { normalizeProvider } from '../../utils/authProviders';

const WELCOME_CREDITS_PREFIX = 'ox_resume_welcome_credits_';
const SESSION_CACHE_KEY = 'ox_resume_session_cache_v2';

/**
 * Map a Firebase user to the session shape consumed by ResumeContext.
 * Preserves exact backward-compatible shape for all 8+ consumer files.
 *
 * @param {import('firebase/auth').User | null} firebaseUser
 * @returns {Object} Session object
 */
export function mapFirebaseUserToSession(firebaseUser) {
  if (!firebaseUser) {
    return {
      isAuthenticated: false,
      isGuest: true,
      user: null,
      mode: 'Guest Mode',
    };
  }

  const provider = normalizeProvider(firebaseUser);

  return {
    isAuthenticated: true,
    isGuest: false,
    user: {
      id: firebaseUser.uid,
      uid: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      provider,
      avatarUrl: firebaseUser.photoURL || null,
      photoURL: firebaseUser.photoURL || null,
      emailVerified: firebaseUser.emailVerified || false,
    },
    mode: 'Authenticated',
  };
}

/**
 * Get the current session from Firebase Auth (synchronous read).
 * Falls back to guest mode if no user is signed in.
 */
export function getCurrentUserSession() {
  const currentUser = auth.currentUser;
  if (currentUser) {
    return mapFirebaseUserToSession(currentUser);
  }

  // Firebase may not have initialized yet — check localStorage cache
  try {
    const cached = localStorage.getItem(SESSION_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (parsed && parsed.isAuthenticated && parsed.user?.id) {
        return parsed;
      }
    }
  } catch (e) {}

  return {
    isAuthenticated: false,
    isGuest: true,
    user: null,
    mode: 'Guest Mode',
  };
}

/**
 * Cache the current session to localStorage for fast hydration.
 * This is NOT used for auth decisions — Firebase is authoritative.
 */
export function cacheSession(session) {
  try {
    if (session && session.isAuthenticated) {
      localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_CACHE_KEY);
    }
  } catch (e) {}
}

/**
 * Check if a user has already claimed welcome credits.
 * Keyed by Firebase UID to prevent duplicate claims.
 *
 * @param {string} userId - Firebase UID
 * @returns {boolean}
 */
export function hasUserClaimedWelcomeCredits(userId) {
  if (!userId) return false;
  try {
    return localStorage.getItem(`${WELCOME_CREDITS_PREFIX}${userId}`) === 'true';
  } catch (e) {
    return false;
  }
}

/**
 * Mark welcome credits as claimed for a Firebase UID.
 * @param {string} userId - Firebase UID
 */
export function markWelcomeCreditsClaimed(userId) {
  if (!userId) return;
  try {
    localStorage.setItem(`${WELCOME_CREDITS_PREFIX}${userId}`, 'true');
  } catch (e) {}
}

/**
 * Log the user out via Firebase Auth and clear cached session.
 */
export async function logoutUser() {
  try {
    await signOut(auth);
  } catch (e) {
    console.warn('OpportunityX Resume: Logout signOut failed:', e);
  }

  try {
    localStorage.removeItem(SESSION_CACHE_KEY);
  } catch (e) {}

  return getCurrentUserSession();
}
