// FLOW — usePosts (paginação por cursor, sem mocks).
// Feed 100% Firestore com "carregar mais" real (startAfter).
import { useCallback, useEffect, useState } from 'react';
import { getDocument, listDocumentsPage, type WithId } from '../services/firebase/firestore';
import type { RawRecord, SocialPost } from '../components/social/types';

const PAGE_SIZE = 10;

export function usePosts(userUid: string | undefined) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [cursor, setCursor] = useState<unknown>(undefined);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
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
        const page = await listDocumentsPage<RawRecord>('posts', {
          orderByField: 'createdAt',
          direction: 'desc',
          max: PAGE_SIZE,
        });
        if (cancelled) return;
        setPosts(await enrich(page.items));
        setCursor(page.cursor);
        setHasMore(page.items.length === PAGE_SIZE);
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

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || cursor === undefined) return;
    setLoadingMore(true);
    try {
      const page = await listDocumentsPage<RawRecord>('posts', {
        orderByField: 'createdAt',
        direction: 'desc',
        max: PAGE_SIZE,
        cursor,
      });
      const enriched = await enrich(page.items);
      setPosts((prev) => [...prev, ...enriched]);
      setCursor(page.cursor);
      setHasMore(page.items.length === PAGE_SIZE);
    } catch {
      /* mantém o que já carregou; próxima tentativa via botão */
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, cursor]);

  return {
    posts,
    loading,
    loadingMore,
    hasMore,
    loadMore,
    error,
    reload: () => {
      setCursor(undefined);
      setHasMore(true);
      setPosts([]);
      setReloadKey((k) => k + 1);
    },
  };
}

async function enrich(items: WithId<RawRecord>[]): Promise<SocialPost[]> {
  return Promise.all(
    items.map(async (item) => {
      const authorId = typeof item.authorId === 'string' ? item.authorId : '';
      const inlineAuthor = item.author && typeof item.author === 'object' ? (item.author as RawRecord) : null;
      if (inlineAuthor || !authorId) return { ...item, author: inlineAuthor };
      return { ...item, author: await getDocument<RawRecord>('users', authorId).catch(() => null) };
    }),
  );
}
