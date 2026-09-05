// FLOW — Admin audit service (dados reais, FASE 6).
// Trilha de auditoria das ações administrativas em `admin_audit`.
// Regras: escrita autenticada com autor real; leitura só admin.
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';
import { listDocuments } from './firestore';

export interface AuditEntry {
  id: string;
  adminUid: string;
  adminEmail: string;
  action: string;
  target: string;
  createdAt?: unknown;
}

/** Registra uma ação administrativa com autor real (sem IP fictício). */
export async function logAdminAction(action: string, target: string): Promise<void> {
  const auth = requireFirebaseAuth();
  const user = auth.currentUser;
  if (!user) return;
  const db = requireFirestore();
  const ref = doc(collection(db, 'admin_audit'));
  await setDoc(ref, {
    adminUid: user.uid,
    adminEmail: user.email ?? '',
    action,
    target,
    createdAt: serverTimestamp(),
  });
}

/** Lista a trilha de auditoria (admin apenas, garantido pela regra). */
export async function listAuditEntries(max = 100): Promise<AuditEntry[]> {
  const entries = await listDocuments<Record<string, unknown>>('admin_audit', {
    orderByField: 'createdAt',
    direction: 'desc',
    max,
  });
  return entries.map((e) => ({
    id: e.id,
    adminUid: typeof e.adminUid === 'string' ? e.adminUid : '',
    adminEmail: typeof e.adminEmail === 'string' ? e.adminEmail : '',
    action: typeof e.action === 'string' ? e.action : '',
    target: typeof e.target === 'string' ? e.target : '',
    createdAt: e.createdAt,
  }));
}
