// FLOW — Stories service (dados reais, FASE 1).
// Lê a coleção `stories`; vazio honesto quando não há backend/dados.
// Regras: `stories` em firestore.rules (leitura autenticada).
import { listDocuments } from './firestore';
import type { StoryItem } from '../../components/social/types';

type StoryRecord = {
  name?: unknown;
  avatar?: unknown;
  avatarUrl?: unknown;
  isOwn?: unknown;
};

/** Stories da rede. Nunca retorna mock: lista vazia = estado vazio honesto. */
export async function listStories(max = 12): Promise<StoryItem[]> {
  const docs = await listDocuments<StoryRecord>('stories', {
    orderByField: 'createdAt',
    direction: 'desc',
    max,
  });
  return docs.map((d) => ({
    id: d.id,
    name: typeof d.name === 'string' && d.name ? d.name : 'Usuário',
    avatar:
      typeof d.avatar === 'string' && d.avatar
        ? d.avatar
        : typeof d.avatarUrl === 'string' && d.avatarUrl
          ? d.avatarUrl
          : '/logo.png',
    isOwn: d.isOwn === true,
  }));
}
