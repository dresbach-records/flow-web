import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Firebase web configuration.
 *
 * These values are public client identifiers (not secrets): the Firebase web
 * apiKey identifies the project and access is enforced by Firebase Security
 * Rules, not by keeping this string hidden. We embed the public defaults so the
 * app runs out of the box, while still allowing overrides via VITE_ env vars.
 */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyB-flow-social-network-public-web-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'flow-social-network-dc313.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'flow-social-network-dc313',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'flow-social-network-dc313.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '44664124884',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:44664124884:web:c7d30b5ff0f47a5bcd1241',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID ?? 'G-3ENP4JSTJC',
};

export const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const firebaseStorage = getStorage(firebaseApp);

let analyticsInstance: Analytics | null = null;

/** Lazily initialize Analytics only in supported browser environments. */
export async function getFlowAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance) return analyticsInstance;
  if (typeof window === 'undefined') return null;
  try {
    if (await isSupported()) analyticsInstance = getAnalytics(firebaseApp);
  } catch {
    analyticsInstance = null;
  }
  return analyticsInstance;
}
