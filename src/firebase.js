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

// Central OpportunityX Firebase client configuration (Source of Truth from OpportunityX-Main)
const CENTRAL_FIREBASE_CONFIG = {
  apiKey: "AIzaSyDOMi5ag1Ru0C1OHd_tpDDZVx41-fzPOzA",
  authDomain: "auth.opportunityx.co.in",
  projectId: "opportunityx-61efd",
  storageBucket: "opportunityx-61efd.firebasestorage.app",
  messagingSenderId: "621904213825",
  appId: "1:621904213825:web:2eaf4884cd39f3de4b93c0"
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || CENTRAL_FIREBASE_CONFIG.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || CENTRAL_FIREBASE_CONFIG.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || CENTRAL_FIREBASE_CONFIG.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || CENTRAL_FIREBASE_CONFIG.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || CENTRAL_FIREBASE_CONFIG.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || CENTRAL_FIREBASE_CONFIG.appId,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId
);

let appInstance = null;
let authInstance = null;

try {
  appInstance = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  authInstance = getAuth(appInstance);
} catch (error) {
  console.warn("[Firebase] Primary initialization failed, retrying with direct config:", error);
  try {
    appInstance = initializeApp(CENTRAL_FIREBASE_CONFIG, "OpportunityX-Resume-Central");
    authInstance = getAuth(appInstance);
  } catch (fallbackError) {
    console.error("[Firebase] Fatal auth initialization failure:", fallbackError);
  }
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
