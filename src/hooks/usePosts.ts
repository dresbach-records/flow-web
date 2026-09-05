// FLOW — usePosts (FASE 1: sem mocks).
// Feed 100% Firestore; sem CANONICAL_POST, sem fallback fictício.
// Vazio/erro são estados honestos tratados pela página (REGRA DE CONCLUSÃO FLOW).
import { useEffect, useState } from 'react';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import type { RawRecord, SocialPost } from '../components/social/types';

export function usePosts(userUid: string | undefined) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userUid) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    setError(null);
    const load = async () => {
      try {
        const loadedPosts = await listDocuments<RawRecord>('posts', {
          orderByField: 'createdAt',
          direction: 'desc',
          max: 20,
        });
        if (cancelled) return;
        const enrich = async (items: WithId<RawRecord>[]) =>
          Promise.all(
            items.map(async (item) => {
              const authorId = typeof item.authorId === 'string' ? item.authorId : '';
              const inlineAuthor = item.author && typeof item.author === 'object' ? (item.author as RawRecord) : null;
              if (inlineAuthor || !authorId) return { ...item, author: inlineAuthor };
              return { ...item, author: await getDocument<RawRecord>('users', authorId).catch(() => null) };
            }),
          );
        const enriched = await enrich(loadedPosts);
        if (!cancelled) setPosts(enriched);
      } catch {
        if (!cancelled) setError('Não foi possível carregar o feed. Verifique sua conexão.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [userUid, reloadKey]);

  return { posts, loading, error, reload: () => setReloadKey((k) => k + 1) };
}
