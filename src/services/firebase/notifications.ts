// FLOW — Notifications service (dados reais, FASE 1/3).
// Coleção privada `users/{uid}/notifications`; vazio honesto sem backend.
// Regras: `users/{uid}/notifications` em firestore.rules.
import {
  collection,
  doc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  writeBatch,
} from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';

export type NotificationType = 'like' | 'comment' | 'follow' | 'system';

export interface NotificationRecord {
  id: string;
  type: NotificationType;
  actorName: string;
  actorAvatar: string;
  text: string;
  createdAt?: unknown;
  read: boolean;
}

const VALID_TYPES: NotificationType[] = ['like', 'comment', 'follow', 'system'];

function toRecord(id: string, data: Record<string, unknown>): NotificationRecord {
  const rawType = data.type;
  return {
    id,
    type: VALID_TYPES.includes(rawType as NotificationType) ? (rawType as NotificationType) : 'system',
    actorName: typeof data.actorName === 'string' && data.actorName ? data.actorName : 'FLOW',
    actorAvatar: typeof data.actorAvatar === 'string' && data.actorAvatar ? data.actorAvatar : '/logo.png',
    text: typeof data.text === 'string' ? data.text : '',
    createdAt: data.createdAt,
    read: data.read === true,
  };
}

/** Notificações do usuário logado, mais recentes primeiro. */
export async function listNotifications(max = 50): Promise<NotificationRecord[]> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return [];
  const db = requireFirestore();
  const snapshot = await getDocs(
    query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc'), limit(max)),
  );
  return snapshot.docs.map((d) => toRecord(d.id, d.data() as Record<string, unknown>));
}

/** Marca todas como lidas (persistência real). */
export async function markAllNotificationsAsRead(): Promise<void> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  const db = requireFirestore();
  const snapshot = await getDocs(query(collection(db, 'users', uid, 'notifications')));
  const batch = writeBatch(db);
  snapshot.docs.forEach((d) => {
    if (d.data().read !== true) batch.update(d.ref, { read: true });
  });
  await batch.commit();
}

/** Cria uma notificação para outro usuário (ex.: like/follow reais a wired na Fase 3). */
export async function pushNotification(targetUid: string, data: Omit<NotificationRecord, 'id' | 'read' | 'createdAt'>): Promise<void> {
  const db = requireFirestore();
  const ref = doc(collection(db, 'users', targetUid, 'notifications'));
  await setDoc(ref, { ...data, read: false, createdAt: serverTimestamp() });
}

/** Marca uma notificação como lida. */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) return;
  await updateDoc(doc(requireFirestore(), 'users', uid, 'notifications', notificationId), { read: true });
}

/**
 * Tempo real: assina notificações do usuário (snapshot + deltas).
 * Retorna unsubscribe (cleanup obrigatório no componente).
 */
export function subscribeToNotifications(
  onNotifications: (items: NotificationRecord[]) => void,
  onError?: (error: Error) => void,
  max = 50,
): () => void {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  const db = requireFirestore();
  const q = query(collection(db, 'users', uid, 'notifications'), orderBy('createdAt', 'desc'), limit(max));
  return onSnapshot(
    q,
    (snapshot) => {
      onNotifications(snapshot.docs.map((d) => toRecord(d.id, d.data() as Record<string, unknown>)));
    },
    (error) => onError?.(error),
  );
}
