import { initializeApp, getApps } from 'firebase/app';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';

if (getApps().length === 0) {
  initializeApp({
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  });
}

let firestoreEmulatorConnected = false;
export function firestore(): Firestore {
  const db = getFirestore();

  if (import.meta.env.DEV && !firestoreEmulatorConnected) {
    connectFirestoreEmulator(db, 'localhost', 8080);
    firestoreEmulatorConnected = true;
  }
  return db;
}
