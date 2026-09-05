// FLOW — Creator stats service (dados reais, FASE 1).
// Agrega posts próprios + seguidores do Firestore. Sem views/renda (sem fonte
// honesta) — a UI exibe "—" nesses campos em vez de simular (REGRA DE CONCLUSÃO).
import { listDocuments } from './firestore';

export interface CreatorPostRow {
  id: string;
  title: string;
  likes: number;
  comments: number;
  shares: number;
  img: string;
  date: string;
}

export interface CreatorStats {
  postsCount: number;
  likesTotal: number;
  commentsTotal: number;
  sharesTotal: number;
  followersCount: number;
  posts: CreatorPostRow[];
}

function formatDate(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    }
  } catch {
    /* sem data honesta */
  }
  return '';
}

/** Estatísticas reais do criador logado. */
export async function getCreatorStats(uid: string): Promise<CreatorStats> {
  const [posts, followers] = await Promise.all([
    listDocuments<Record<string, unknown>>('posts', { field: 'authorId', value: uid, max: 100 }),
    listDocuments(`users/${uid}/followers`, { max: 1000 }).catch(() => []),
  ]);
  const rows: CreatorPostRow[] = posts.map((p) => ({
    id: p.id,
    title: (typeof p.text === 'string' && p.text) || (typeof p.caption === 'string' && p.caption) || 'Publicação',
    likes: (p.likesCount as number) || (p.likes as number) || 0,
    comments: (p.commentsCount as number) || (p.comments as number) || 0,
    shares: (p.sharesCount as number) || (p.shares as number) || 0,
    img: (p.mediaUrl as string) || (p.imageUrl as string) || '/logo.png',
    date: formatDate(p.createdAt),
  }));
  return {
    postsCount: rows.length,
    likesTotal: rows.reduce((acc, r) => acc + r.likes, 0),
    commentsTotal: rows.reduce((acc, r) => acc + r.comments, 0),
    sharesTotal: rows.reduce((acc, r) => acc + r.shares, 0),
    followersCount: followers.length,
    posts: rows,
  };
}
