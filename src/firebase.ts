import { initializeApp, getApps } from 'firebase/app';

if (getApps().length === 0) {
  initializeApp({
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  });
}
