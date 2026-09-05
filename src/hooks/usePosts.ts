// FLOW — usePosts (FASE 3).
// Lógica de carregamento do feed extraída de src/app/SocialFeed.tsx sem
// alterar o comportamento: Firebase continua real, CANONICAL_POST de fallback
// foi preservado integralmente (remoção/substituição fica para FASE 8/9).
import { useEffect, useState } from 'react';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import type { RawRecord, SocialPost } from '../components/social/types';

export const CANONICAL_POST: SocialPost = {
  id: 'canonical-post-1',
  author: {
    name: 'Camila Torres',
    handle: '@camilatorres',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    verified: true,
  },
  caption: 'A vida fica muito mais bonita quando você se permite viver novos lugares. 🌍 Que venha o próximo destino! ✨',
  hashtags: ['#ViagensIncríveis', '#Flow', '#VidaReal'],
  imageUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=1200&q=80',
  likes: 1200,
  comments: 124,
  shares: 56,
  timeAgo: '2h',
  commentPreview: {
    authorName: 'Lucas Mendes',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80',
    text: 'Que vista incrível! 😍',
    timeAgo: '2h',
  },
};

export function usePosts(userUid: string | undefined) {
  const [posts, setPosts] = useState<SocialPost[]>([CANONICAL_POST]);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!userUid) return;
    let cancelled = false;
    const load = async () => {
      try {
        const loadedPosts = await listDocuments<RawRecord>('posts', {
          orderByField: 'createdAt',
          direction: 'desc',
          max: 20,
        });
        if (cancelled) return;
        if (loadedPosts.length > 0) {
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
          if (!cancelled) {
            setPosts([CANONICAL_POST, ...enriched]);
          }
        }
      } catch {
        // Fallback to canonical mock if firestore fails
      }
    };
    void load();
    return () => {
      cancelled = true;
    };
  }, [userUid, reloadKey]);

  return { posts, reload: () => setReloadKey((k) => k + 1) };
}
