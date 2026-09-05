// FLOW — Consentimento versionado (LGPD).
// Fonte única da verdade do contrato obrigatório pós-cadastro.
// O aceite é exibido UMA única vez (guarda em src/App.tsx) e persistido de
// forma auditável: users/{uid}/consents/terms + espelho no perfil.
// O campo legado `acceptedTermsAt` (booleano temporal, sem versão) NÃO é
// suficiente para liberar o acesso — documentado na FASE 6/7.
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { requireFirebaseAuth, requireFirestore } from './config';

export const CONTRACT_VERSION = 'v1.0.0-2026';
export const CONTRACT_TYPE = 'terms' as const;
/** Flag de sessão encerrada por recusa do contrato (consumida no login). */
export const SESSION_ENDED_KEY = 'flow.session.ended';

export type ConsentMethod = 'password' | 'google' | 'unknown';

export interface ConsentRecord {
  userId: string;
  documentType: typeof CONTRACT_TYPE;
  documentVersion: string;
  termsVersion: string;
  status: 'accepted';
  method: ConsentMethod;
  userAgent: string | null;
  acceptedAt: unknown;
  createdAt: unknown;
}

export type ConsentStatus = 'loading' | 'pending' | 'accepted';

function currentMethod(): ConsentMethod {
  try {
    const auth = requireFirebaseAuth();
    const provider = auth.currentUser?.providerData?.[0]?.providerId ?? '';
    if (provider.includes('google')) return 'google';
    if (provider.includes('password')) return 'password';
  } catch {
    /* sem auth — método desconhecido */
  }
  return 'unknown';
}

function consentRef(uid: string) {
  return doc(requireFirestore(), 'users', uid, 'consents', CONTRACT_TYPE);
}

/** Lê o aceite versionado. `false` = deve exibir o TermsGate (uma vez). */
export async function hasAcceptedContract(uid: string): Promise<boolean> {
  const snapshot = await getDoc(consentRef(uid));
  if (!snapshot.exists()) return false;
  const data = snapshot.data() as Partial<ConsentRecord>;
  return data.status === 'accepted' && data.documentVersion === CONTRACT_VERSION;
}

/** Persiste o aceite com versionamento + espelho auditável no perfil. */
export async function acceptContract(): Promise<void> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Autenticação necessária para registrar o aceite.');
  const firestore = requireFirestore();
  const method = currentMethod();
  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : null;
  const record: Omit<ConsentRecord, 'acceptedAt' | 'createdAt'> & {
    acceptedAt: ReturnType<typeof serverTimestamp>;
    createdAt: ReturnType<typeof serverTimestamp>;
  } = {
    userId: uid,
    documentType: CONTRACT_TYPE,
    documentVersion: CONTRACT_VERSION,
    termsVersion: CONTRACT_VERSION,
    status: 'accepted',
    method,
    userAgent,
    acceptedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };
  await setDoc(consentRef(uid), record);
  await setDoc(
    doc(firestore, 'users', uid),
    { termsAcceptedVersion: CONTRACT_VERSION, termsAcceptedAt: serverTimestamp() },
    { merge: true },
  );
}

/** Recusa: encerra a sessão e limpa o estado local de autenticação. */
export async function declineContractAndSignOut(): Promise<void> {
  try {
    await signOut(requireFirebaseAuth());
  } finally {
    try {
      localStorage.removeItem('flow.auth');
    } catch {
      /* armazenamento indisponível */
    }
  }
}
