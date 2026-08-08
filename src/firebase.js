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

const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const isConfigured = Boolean(apiKey && apiKey !== 'your_api_key_here' && apiKey.length > 5);

const firebaseConfig = {
  apiKey: isConfigured ? apiKey : 'AIzaSyDummyKeyForSetupOnlyToPreventCrash',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'opportunityx-61efd.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'opportunityx-61efd',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'opportunityx-61efd.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '100000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:100000000000:web:abcdef123456',
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
export const isFirebaseConfigured = isConfigured;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();

