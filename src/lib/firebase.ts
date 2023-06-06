import { initializeApp, getApps } from 'firebase/app';
import { Auth, getAuth, onAuthStateChanged, type User } from 'firebase/auth';
import { Firestore, connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import { connectStorageEmulator, type FirebaseStorage, getStorage } from 'firebase/storage';
import { onCleanup } from 'solid-js';

if (getApps().length === 0) {
  initializeApp({
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
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

let storageEmulatorConnected = false;
export function storage(): FirebaseStorage {
  const storage = getStorage();

  if (import.meta.env.DEV && !storageEmulatorConnected) {
    connectStorageEmulator(storage, 'localhost', 9199);
    storageEmulatorConnected = true;
  }
  return storage;
}

export function auth(): Auth {
  return getAuth();
}

export function onAuthChange(fn: (user: User | null) => void) {
  const auth = getAuth();
  const unsub = onAuthStateChanged(auth, user => {
    fn(user);
  });

  onCleanup(unsub);
}
