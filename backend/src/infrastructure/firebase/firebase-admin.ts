import { applicationDefault, cert, getApps, initializeApp, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { env } from '../../config/env.js';

type ServiceAccount = {
  project_id: string;
  client_email: string;
  private_key: string;
};

function loadServiceAccount(): ServiceAccount | undefined {
  // Vercel/Serverless: credenciais via variáveis de ambiente (sem arquivo em disco).
  if (env.FIREBASE_CLIENT_EMAIL && env.FIREBASE_PRIVATE_KEY) {
    return {
      project_id: env.FIREBASE_PROJECT_ID,
      client_email: env.FIREBASE_CLIENT_EMAIL,
      private_key: env.FIREBASE_PRIVATE_KEY,
    };
  }

  const configuredPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  const candidates = configuredPath ? [resolve(configuredPath)] : [];
  const secretsDir = resolve(process.cwd(), 'secrets');

  if (existsSync(secretsDir)) {
    for (const file of readdirSync(secretsDir)) {
      if (file.endsWith('.json')) candidates.push(resolve(secretsDir, file));
    }
  }

  for (const filePath of candidates) {
    if (!existsSync(filePath)) continue;
    try {
      const parsed = JSON.parse(readFileSync(filePath, 'utf8')) as Partial<ServiceAccount>;
      if (parsed.project_id && parsed.client_email && parsed.private_key) return parsed as ServiceAccount;
    } catch {
      // Try the next credential source.
    }
  }

  return undefined;
}

export function getFirebaseApp(): App {
  const existing = getApps()[0];
  if (existing) return existing;

  const serviceAccount = loadServiceAccount();
  if (serviceAccount) {
    return initializeApp({
      credential: cert({
        projectId: serviceAccount.project_id,
        clientEmail: serviceAccount.client_email,
        privateKey: serviceAccount.private_key.replace(/\\n/g, '\n'),
      }),
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
    });
  }

  // Cloud Run and other Google environments should use Application Default Credentials.
  return initializeApp({
    credential: applicationDefault(),
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
  });
}

export const firebaseAuth = () => getAuth(getFirebaseApp());
export const firestore = () => getFirestore(getFirebaseApp());
export const firebaseStorage = () => getStorage(getFirebaseApp());
