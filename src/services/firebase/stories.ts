// FLOW — Stories service (dados reais, FASE 1).
// Lê a coleção `stories`; vazio honesto quando não há backend/dados.
// Regras: `stories` em firestore.rules (leitura autenticada, criação do autor).
import { createDocument, deleteDocument, listDocuments } from './firestore';
import { requireFirebaseAuth } from './config';
import type { StoryItem } from '../../components/social/types';

/** 24h de vida. Expirado = invisível (ciclo de vida real, sem job). */
export const STORY_TTL_MS = 24 * 60 * 60 * 1000;

type StoryRecord = {
  name?: unknown;
  avatar?: unknown;
  avatarUrl?: unknown;
  isOwn?: unknown;
  authorId?: unknown;
  mediaUrl?: unknown;
  expiresAt?: unknown;
  expiresAtMs?: unknown;
};

/** Puro e testável: story visível? Aceita Timestamp, ISO string, epoch ms ou ausente. */
export function isStoryActive(expiresAt: unknown, nowMs = Date.now()): boolean {
  if (expiresAt === null || expiresAt === undefined) return true;
  try {
    if (typeof expiresAt === 'number') return Number.isFinite(expiresAt) && expiresAt > nowMs;
    const ts = expiresAt as { toDate?: () => Date };
    const ms = typeof ts.toDate === 'function' ? ts.toDate().getTime() : new Date(expiresAt as string).getTime();
    return Number.isFinite(ms) && ms > nowMs;
  } catch {
    return false;
  }
}

/** Stories da rede. Nunca retorna mock: lista vazia = estado vazio honesto. */
export async function listStories(max = 12): Promise<StoryItem[]> {
  const docs = await listDocuments<StoryRecord>('stories', {
    orderByField: 'createdAt',
    direction: 'desc',
    max: max * 2,
  });
  const now = Date.now();
  return docs
    .filter((d) => isStoryActive(d.expiresAt ?? d.expiresAtMs, now))
    .slice(0, max)
    .map((d) => ({
      id: d.id,
      authorId: typeof d.authorId === 'string' ? d.authorId : '',
      name: typeof d.name === 'string' && d.name ? d.name : 'Usuário',
      avatar:
        typeof d.avatar === 'string' && d.avatar
          ? d.avatar
          : typeof d.avatarUrl === 'string' && d.avatarUrl
            ? d.avatarUrl
            : typeof d.mediaUrl === 'string' && d.mediaUrl
              ? d.mediaUrl
              : '/logo.png',
      isOwn: d.isOwn === true,
    }));
}

/** Publica story com foto (expira em 24h). */
export async function createStory(input: { mediaUrl: string; name?: string }): Promise<string> {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  if (!input.mediaUrl) throw new Error('Selecione uma foto.');
  return createDocument('stories', {
    authorId: uid,
    name: input.name || auth.currentUser?.displayName || 'Você',
    avatar: auth.currentUser?.photoURL || '/logo.png',
    mediaUrl: input.mediaUrl,
    expiresAtMs: Date.now() + STORY_TTL_MS,
    isOwn: false,
  });
}

/** Remove story próprio. */
export async function deleteStory(storyId: string): Promise<void> {
  await deleteDocument('stories', storyId);
}
