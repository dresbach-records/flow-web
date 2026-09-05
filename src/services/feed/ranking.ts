// FLOW — Ranking do feed v1 (puro e testável).
// Sinais: recência (decaimento 48h), afinidade (seguindo), engajamento
// (curtidas + 2× comentários, escala log), diversidade (penalidade por autor
// repetido). Arquitetura extensível para ranking server-side (Fase 9).
import type { RawRecord, SocialPost } from '../../components/social/types';

export interface RankContext {
  followingIds: Set<string>;
  blockedIds?: Set<string>;
  nowMs?: number;
}

const HALF_LIFE_MS = 48 * 60 * 60 * 1000;

function numberField(post: SocialPost, keys: string[]): number {
  for (const key of keys) {
    const value = (post as unknown as Record<string, unknown>)[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
  }
  return 0;
}

function createdMs(post: SocialPost, nowMs: number): number {
  const raw = post as unknown as Record<string, unknown>;
  const createdAt = raw.createdAt as { toDate?: () => Date; toMillis?: () => number } | undefined;
  try {
    if (createdAt && typeof createdAt.toMillis === 'function') return createdAt.toMillis();
    if (createdAt && typeof createdAt.toDate === 'function') return createdAt.toDate().getTime();
    if (typeof createdAt === 'string' || typeof createdAt === 'number') {
      const ms = new Date(createdAt).getTime();
      if (Number.isFinite(ms)) return ms;
    }
  } catch {
    /* sem data: trata como antigo */
  }
  return 0;
}

/** Pontuação real de um post (maior = mais relevante). */
export function scorePost(post: SocialPost, ctx: RankContext, authorRank: number): number {
  const nowMs = ctx.nowMs ?? Date.now();
  const ageMs = Math.max(0, nowMs - createdMs(post, nowMs));
  const recency = Math.exp(-ageMs / HALF_LIFE_MS) * 10;
  const authorId = typeof post.authorId === 'string' ? post.authorId : '';
  const affinity = authorId !== '' && ctx.followingIds.has(authorId) ? 3 : 0;
  const likes = numberField(post, ['likesCount', 'likes']);
  const comments = numberField(post, ['commentsCount', 'comments']);
  const engagement = Math.log1p(Math.max(0, likes + 2 * comments));
  const diversity = authorRank > 0 ? -1.5 * authorRank : 0;
  return recency + affinity + engagement + diversity;
}

/** Ordena por relevância (estável; bloqueados removidos). */
export function rankFeed(posts: SocialPost[], ctx: RankContext): SocialPost[] {
  const blocked = ctx.blockedIds ?? new Set<string>();
  const seen = new Map<string, number>();
  return posts
    .filter((p) => {
      const authorId = typeof p.authorId === 'string' ? p.authorId : '';
      return authorId === '' || !blocked.has(authorId);
    })
    .map((post) => {
      const authorId = typeof post.authorId === 'string' ? post.authorId : '__unknown__';
      const authorRank = seen.get(authorId) ?? 0;
      seen.set(authorId, authorRank + 1);
      return { post, score: scorePost(post, ctx, authorRank) };
    })
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post);
}

export type { RawRecord };
