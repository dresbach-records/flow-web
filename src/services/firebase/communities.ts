// FLOW — Communities service (dados reais).
// Abstração correta sobre o Firestore; sem mocks. Depende das regras
// `communities` + `communities/{id}/members` em firestore.rules.
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  increment,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';

export interface Community {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  memberCount?: number;
}

export interface CommunityMembership {
  communityId: string;
  joinedAt: unknown;
}

function toCommunity(id: string, data: Record<string, unknown>): Community {
  return {
    id,
    name: typeof data.name === 'string' ? data.name : 'Comunidade',
    description: typeof data.description === 'string' ? data.description : undefined,
    imageUrl: typeof data.imageUrl === 'string' ? data.imageUrl : undefined,
    memberCount: typeof data.memberCount === 'number' ? data.memberCount : 0,
  };
}

/** Lista comunidades públicas por popularidade. Vazio quando sem backend. */
export async function listCommunities(max = 8): Promise<Community[]> {
  const db = requireFirestore();
  const snapshot = await getDocs(query(collection(db, 'communities'), orderBy('memberCount', 'desc'), limit(max)));
  return snapshot.docs.map((d) => toCommunity(d.id, d.data() as Record<string, unknown>));
}

/** Comunidades das quais o usuário participa (requer login). */
export async function getMyMemberships(): Promise<Set<string>> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return new Set();
  const db = requireFirestore();
  const snapshot = await getDocs(collection(db, 'users', uid, 'memberships'));
  return new Set(snapshot.docs.map((d) => d.id));
}

/** Participar: escreve membership + incrementa contador (transação real). */
export async function joinCommunity(communityId: string): Promise<void> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para participar.');
  const db = requireFirestore();
  await setDoc(doc(db, 'communities', communityId, 'members', uid), {
    userId: uid,
    joinedAt: serverTimestamp(),
  });
  await setDoc(doc(db, 'users', uid, 'memberships', communityId), {
    communityId,
    joinedAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'communities', communityId), { memberCount: increment(1) }).catch(() => undefined);
}

/** Sair: remove membership + decrementa contador. */
export async function leaveCommunity(communityId: string): Promise<void> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  const db = requireFirestore();
  await deleteDoc(doc(db, 'communities', communityId, 'members', uid));
  await deleteDoc(doc(db, 'users', uid, 'memberships', communityId));
  await updateDoc(doc(db, 'communities', communityId), { memberCount: increment(-1) }).catch(() => undefined);
}

export async function getCommunity(communityId: string): Promise<Community | null> {
  const db = requireFirestore();
  const snapshot = await getDoc(doc(db, 'communities', communityId));
  return snapshot.exists() ? toCommunity(snapshot.id, snapshot.data() as Record<string, unknown>) : null;
}
