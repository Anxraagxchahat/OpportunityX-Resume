/**
 * OpportunityX Resume — Central Authentication Context
 *
 * Lightweight Firebase AuthProvider that wraps onAuthStateChanged.
 * This is NOT a copy of the main OpportunityX AuthContext.
 * It provides identity-only consumption — no Firestore profile sync,
 * no user profile creation, no community data writes.
 *
 * Resume NEVER writes to the central OpportunityX users collection.
 */
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { normalizeProvider } from '../utils/authProviders';
import { trackAuthEvent } from '../utils/authAnalytics';

const AuthContext = createContext(null);

const AUTH_CACHE_KEY = 'ox_resume_auth_cache_v1';

/**
 * Cache minimal identity to localStorage for fast hydration on reload.
 * This is NOT used for authentication decisions — Firebase Auth is the
 * authoritative source. This only prevents UI flicker on initial load.
 */
function cacheUserIdentity(firebaseUser) {
  try {
    if (firebaseUser) {
      localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: firebaseUser.displayName,
        photoURL: firebaseUser.photoURL,
        emailVerified: firebaseUser.emailVerified,
        provider: normalizeProvider(firebaseUser),
      }));
    } else {
      localStorage.removeItem(AUTH_CACHE_KEY);
    }
  } catch (e) {
    // localStorage failures must never break auth
  }
}

function getCachedIdentity() {
  try {
    const cached = localStorage.getItem(AUTH_CACHE_KEY);
    return cached ? JSON.parse(cached) : null;
  } catch (e) {
    return null;
  }
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const initializedRef = useRef(false);

  useEffect(() => {
    // Safety fallback timer so UI never hangs indefinitely on initial auth check
    const safetyTimer = setTimeout(() => {
      if (!initializedRef.current) {
        initializedRef.current = true;
        setAuthLoading(false);
      }
    }, 2500);

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      clearTimeout(safetyTimer);
      setUser(currentUser);
      cacheUserIdentity(currentUser);

      if (!initializedRef.current) {
        initializedRef.current = true;
        setAuthLoading(false);

        // Track initial auth state
        if (currentUser) {
          trackAuthEvent('session_restored', {
            uid: currentUser.uid,
            provider: normalizeProvider(currentUser),
          });
        } else {
          trackAuthEvent('guest_mode');
        }
      }
    });

    return () => {
      clearTimeout(safetyTimer);
      unsubscribe();
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      trackAuthEvent('logout', { uid: user?.uid });
      await signOut(auth);
    } catch (e) {
      console.warn('OpportunityX Resume: Logout failed:', e);
    }
  }, [user]);

  const isAuthenticated = !!user;
  const isGuest = !user;

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        isAuthenticated,
        isGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook to access authentication state.
 * Must be used within an AuthProvider.
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
