/**
 * OpportunityX Resume — Firebase Configuration
 *
 * Connects to the CENTRAL OpportunityX Firebase project for authentication.
 * All config is loaded from environment variables (.env.local).
 *
 * IMPORTANT:
 * - This is the SAME Firebase project used by the main OpportunityX app.
 * - Resume only uses Firebase Authentication from this project.
 * - Resume does NOT read/write the main OpportunityX Firestore database.
 * - Resume business data stays in localStorage (or a future isolated Resume DB).
 */
import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDOMi5ag1Ru0C1OHd_tpDDZVx41-fzPOzA",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "auth.opportunityx.co.in",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "opportunityx-61efd",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "opportunityx-61efd.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "621904213825",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:621904213825:web:2eaf4884cd39f3de4b93c0",
};

let appInstance;
let authInstance;

try {
  appInstance = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
} catch (error) {
  console.warn("Firebase initialization warning (fallback active):", error);
  authInstance = {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      if (typeof callback === 'function') callback(null);
      return () => {};
    },
    getIdToken: async () => null
  };
}

export const auth = authInstance;
export const isFirebaseConfigured = true;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();

