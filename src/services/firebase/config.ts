import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Firebase Web configuration.
 *
 * The Firebase Web API key is a public client identifier, not an admin secret.
 * It must nevertheless be the active key belonging to the configured Firebase
 * Web App. A missing/placeholder key must never be sent to Firebase Auth.
 */
const env = import.meta.env;
const apiKey = typeof env.VITE_FIREBASE_API_KEY === 'string' ? env.VITE_FIREBASE_API_KEY.trim() : '';
const isPlaceholderApiKey = !apiKey || apiKey === 'cole_a_api_key_publica_do_app_web_aqui';

const firebaseConfig: FirebaseOptions = {
  apiKey: apiKey || undefined,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN?.trim() || 'flow-social-network-dc313.firebaseapp.com',
  projectId: env.VITE_FIREBASE_PROJECT_ID?.trim() || 'flow-social-network-dc313',
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET?.trim() || 'flow-social-network-dc313.firebasestorage.app',
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || '44664124884',
  appId: env.VITE_FIREBASE_APP_ID?.trim() || '1:44664124884:web:c7d30b5ff0f47a5bcd1241',
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID?.trim() || 'G-3ENP4JSTJC',
};

export const firebaseDiagnostics = {
  apiKeyConfigured: !isPlaceholderApiKey,
  projectIdConfigured: Boolean(firebaseConfig.projectId),
  appIdConfigured: Boolean(firebaseConfig.appId),
};

export const firebaseConfigError: Error | null = isPlaceholderApiKey
  ? new Error('Firebase Web API key não configurada. Defina VITE_FIREBASE_API_KEY no ambiente de execução.')
  : null;

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;
let firebaseInitializationError: Error | null = firebaseConfigError;

if (!firebaseConfigError) {
  try {
    firebaseAppInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuthInstance = getAuth(firebaseAppInstance);
    firestoreInstance = getFirestore(firebaseAppInstance);
    firebaseStorageInstance = getStorage(firebaseAppInstance);
  } catch (error) {
    firebaseInitializationError = error instanceof Error ? error : new Error('Falha ao inicializar o Firebase.');
    firebaseAppInstance = null;
    firebaseAuthInstance = null;
    firestoreInstance = null;
    firebaseStorageInstance = null;
  }
}

export const firebaseApp = firebaseAppInstance;
export const firebaseAuth = firebaseAuthInstance;
export const firestore = firestoreInstance;
export const firebaseStorage = firebaseStorageInstance;
export const getFirebaseInitializationError = (): Error | null => firebaseInitializationError;

export function requireFirebaseAuth(): Auth {
  if (!firebaseAuthInstance) {
    throw new Error(
      firebaseInitializationError?.message ??
      'Firebase Authentication indisponível. Verifique a configuração do Firebase.',
    );
  }
  return firebaseAuthInstance;
}

export function requireFirestore(): Firestore {
  if (!firestoreInstance) {
    throw new Error(
      firebaseInitializationError?.message ??
      'Cloud Firestore indisponível. Verifique a configuração do Firebase.',
    );
  }
  return firestoreInstance;
}

export function requireFirebaseStorage(): FirebaseStorage {
  if (!firebaseStorageInstance) {
    throw new Error(
      firebaseInitializationError?.message ??
      'Firebase Storage indisponível. Verifique a configuração do Firebase.',
    );
  }
  return firebaseStorageInstance;
}

let analyticsInstance: Analytics | null = null;

/** Lazily initialize Analytics only in supported browser environments. */
export async function getFlowAnalytics(): Promise<Analytics | null> {
  if (analyticsInstance || !firebaseAppInstance) return analyticsInstance;
  if (typeof window === 'undefined') return null;
  try {
    if (await isSupported()) analyticsInstance = getAnalytics(firebaseAppInstance);
  } catch {
    analyticsInstance = null;
  }
  return analyticsInstance;
}
