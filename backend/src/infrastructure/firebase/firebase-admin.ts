import { cert, getApps, initializeApp, applicationDefault, getApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

export function firebaseAdmin(): App {
  if (getApps().length) return getApp();
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const storageBucket = process.env.FIREBASE_STORAGE_BUCKET;
  if (projectId && clientEmail && privateKey) {
    return initializeApp({ credential: cert({ projectId, clientEmail, privateKey }), storageBucket });
  }
  return initializeApp({ credential: applicationDefault(), projectId, storageBucket });
}

export const firebaseAuth = () => getAuth(firebaseAdmin());
export const firestore = () => getFirestore(firebaseAdmin());
export const storage = () => getStorage(firebaseAdmin());
