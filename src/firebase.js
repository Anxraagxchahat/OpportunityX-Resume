/**
 * OpportunityX Resume — Firebase Configuration
 *
 * Connects to the CENTRAL OpportunityX Firebase project for authentication.
 * All config is loaded exclusively from environment variables (.env / .env.local).
 *
 * Required environment variables:
 * - VITE_FIREBASE_API_KEY
 * - VITE_FIREBASE_AUTH_DOMAIN
 * - VITE_FIREBASE_PROJECT_ID
 * - VITE_FIREBASE_STORAGE_BUCKET
 * - VITE_FIREBASE_MESSAGING_SENDER_ID
 * - VITE_FIREBASE_APP_ID
 *
 * IMPORTANT:
 * - This connects to the Firebase project used by OpportunityX.
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
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let appInstance = null;
let authInstance = null;

if (isFirebaseConfigured) {
  try {
    appInstance = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
    authInstance = getAuth(appInstance);
  } catch (error) {
    console.warn("[Firebase] Initialization warning:", error);
    authInstance = createFallbackAuth();
  }
} else {
  if (import.meta.env.DEV) {
    console.warn(
      "[Firebase Config] Missing required Firebase environment variables in .env / .env.local.\n" +
      "Please configure VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID, and VITE_FIREBASE_APP_ID.\n" +
      "Authentication will run in offline guest mode."
    );
  }
  authInstance = createFallbackAuth();
}

function createFallbackAuth() {
  return {
    currentUser: null,
    onAuthStateChanged: (callback) => {
      if (typeof callback === 'function') callback(null);
      return () => {};
    },
    getIdToken: async () => null
  };
}

export const auth = authInstance;

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

export const githubProvider = new GithubAuthProvider();
