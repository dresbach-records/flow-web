// FLOW — Blocks service (grafo social real: bloquear/desbloquear).
// `users/{uid}/blocks/{targetId}` — privado do dono (rules).
import { deleteDoc, doc, getDoc, getDocs, collection, serverTimestamp, setDoc } from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';

function requireUid(): string {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  return uid;
}

/** IDs bloqueados pelo usuário logado. */
export async function listBlockedIds(): Promise<Set<string>> {
  const uid = requireUid();
  const db = requireFirestore();
  const snapshot = await getDocs(collection(db, 'users', uid, 'blocks'));
  return new Set(snapshot.docs.map((d) => d.id));
}

export async function isBlocked(targetUid: string): Promise<boolean> {
  const uid = requireUid();
  const db = requireFirestore();
  return (await getDoc(doc(db, 'users', uid, 'blocks', targetUid))).exists();
}

export async function blockUser(targetUid: string): Promise<void> {
  const uid = requireUid();
  if (uid === targetUid) throw new Error('Você não pode bloquear a si mesmo.');
  const db = requireFirestore();
  await setDoc(doc(db, 'users', uid, 'blocks', targetUid), {
    userId: targetUid,
    createdAt: serverTimestamp(),
  });
}

export async function unblockUser(targetUid: string): Promise<void> {
  const uid = requireUid();
  const db = requireFirestore();
  await deleteDoc(doc(db, 'users', uid, 'blocks', targetUid));
}
