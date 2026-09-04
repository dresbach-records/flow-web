import { getApp, getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';
import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics';

/**
 * Firebase Web configuration.
 * Only VITE_* public Web App identifiers are read by the Vite frontend.
 * Administrative credentials must never be exposed here.
 */
const env = import.meta.env;

const readEnv = (name: string): string => {
  const value = env[name];
  return typeof value === 'string' ? value.trim() : '';
};

const apiKey = readEnv('VITE_FIREBASE_API_KEY');
const authDomain = readEnv('VITE_FIREBASE_AUTH_DOMAIN');
const projectId = readEnv('VITE_FIREBASE_PROJECT_ID');
const storageBucket = readEnv('VITE_FIREBASE_STORAGE_BUCKET');
const messagingSenderId = readEnv('VITE_FIREBASE_MESSAGING_SENDER_ID');
const appId = readEnv('VITE_FIREBASE_APP_ID');
const measurementId = readEnv('VITE_FIREBASE_MEASUREMENT_ID');

const requiredConfig = {
  apiKey,
  authDomain,
  projectId,
  storageBucket,
  messagingSenderId,
  appId,
};

const missingConfigKeys = Object.entries(requiredConfig)
  .filter(([, value]) => !value)
  .map(([key]) => key);

const isPlaceholderApiKey = apiKey === 'cole_a_api_key_publica_do_app_web_aqui';

const firebaseConfig: FirebaseOptions | null =
  missingConfigKeys.length > 0 || isPlaceholderApiKey
    ? null
    : {
        apiKey,
        authDomain,
        projectId,
        storageBucket,
        messagingSenderId,
        appId,
        ...(measurementId ? { measurementId } : {}),
      };

export const firebaseDiagnostics = {
  apiKeyConfigured: Boolean(apiKey && !isPlaceholderApiKey),
  projectIdConfigured: Boolean(projectId),
  appIdConfigured: Boolean(appId),
  missingConfigKeys,
};

export const firebaseConfigError: Error | null = firebaseConfig
  ? null
  : new Error(
      isPlaceholderApiKey
        ? 'Firebase Web API key inválida ou ainda configurada como placeholder.'
        : `Configuração do Firebase incompleta. Variáveis ausentes: ${missingConfigKeys.join(', ') || 'VITE_FIREBASE_API_KEY'}.`,
    );

let firebaseAppInstance: FirebaseApp | null = null;
let firebaseAuthInstance: Auth | null = null;
let firestoreInstance: Firestore | null = null;
let firebaseStorageInstance: FirebaseStorage | null = null;
let firebaseInitializationError: Error | null = firebaseConfigError;

if (firebaseConfig) {
  try {
    firebaseAppInstance = getApps().length ? getApp() : initializeApp(firebaseConfig);
    firebaseAuthInstance = getAuth(firebaseAppInstance);
    firestoreInstance = getFirestore(firebaseAppInstance);
    firebaseStorageInstance = getStorage(firebaseAppInstance);
  } catch (error) {
    firebaseInitializationError = error instanceof Error
      ? error
      : new Error('Falha ao inicializar o Firebase.');
    firebaseAppInstance = null;
    firebaseAuthInstance = null;
    firestoreInstance = null;
    firebaseStorageInstance = null;
    console.error('[FLOW] Firebase não pôde ser inicializado.', {
      code: error instanceof Error ? (error as Error & { code?: string }).code : undefined,
      apiKeyConfigured: firebaseDiagnostics.apiKeyConfigured,
      projectIdConfigured: firebaseDiagnostics.projectIdConfigured,
      appIdConfigured: firebaseDiagnostics.appIdConfigured,
    });
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
