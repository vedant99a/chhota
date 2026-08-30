// Firebase is initialised once, here, and nowhere else.
// The config values live in .env (see .env.example). Vite replaces
// import.meta.env.VITE_* at build time, so nothing secret should go in here —
// a Firebase web config is public by design; Firestore rules do the guarding.
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// A missing .env is the most common setup mistake, and it otherwise shows up as
// a blank white page. Say what is wrong on the page itself, then stop.
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  const message =
    'Firebase config is missing. Copy .env.example to .env, fill in the values from the Firebase console, then restart the dev server.';
  document.body.textContent = message;
  throw new Error(message);
}

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
