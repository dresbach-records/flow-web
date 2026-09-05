// FLOW — Messages service (dados reais, FASE 1/3).
// `conversations` com `participantIds: string[]`; mensagens em subcoleção.
// Regras: `conversations` em firestore.rules (só participantes).
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';

export interface Conversation {
  id: string;
  participantIds: string[];
  name: string;
  handle: string;
  avatar: string;
  online: boolean;
  lastMessage: string;
  updatedAt?: unknown;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  createdAt?: unknown;
}

function toConversation(id: string, data: Record<string, unknown>): Conversation {
  const participantIds = Array.isArray(data.participantIds)
    ? data.participantIds.filter((v): v is string => typeof v === 'string')
    : [];
  return {
    id,
    participantIds,
    name: typeof data.name === 'string' && data.name ? data.name : 'Conversa',
    handle: typeof data.handle === 'string' ? data.handle : '',
    avatar: typeof data.avatar === 'string' && data.avatar ? data.avatar : '/logo.png',
    online: data.online === true,
    lastMessage: typeof data.lastMessage === 'string' ? data.lastMessage : '',
  };
}

function requireUid(): string {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  return uid;
}

/** Conversas das quais o usuário participa. Vazio honesto sem backend/dados. */
export async function listConversations(max = 30): Promise<Conversation[]> {
  const uid = requireUid();
  const db = requireFirestore();
  const snapshot = await getDocs(
    query(
      collection(db, 'conversations'),
      where('participantIds', 'array-contains', uid),
      orderBy('updatedAt', 'desc'),
      limit(max),
    ),
  );
  return snapshot.docs.map((d) => toConversation(d.id, d.data() as Record<string, unknown>));
}

/** Mensagens de uma conversa (participantes apenas, garantido pela regra). */
export async function listMessages(conversationId: string, max = 100): Promise<ChatMessage[]> {
  requireUid();
  const db = requireFirestore();
  const snapshot = await getDocs(
    query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc'),
      limit(max),
    ),
  );
  return snapshot.docs.map((d) => {
    const data = d.data() as Record<string, unknown>;
    return {
      id: d.id,
      senderId: typeof data.senderId === 'string' ? data.senderId : '',
      text: typeof data.text === 'string' ? data.text : '',
      createdAt: data.createdAt,
    };
  });
}

/** Envia mensagem com persistência real (sem simulação local). */
export async function sendMessage(conversationId: string, text: string): Promise<string> {
  const uid = requireUid();
  const value = text.trim();
  if (!value) throw new Error('Escreva uma mensagem.');
  const db = requireFirestore();
  const ref = await addDoc(collection(db, 'conversations', conversationId, 'messages'), {
    senderId: uid,
    text: value,
    createdAt: serverTimestamp(),
  });
  await updateDoc(doc(db, 'conversations', conversationId), {
    lastMessage: value,
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}
