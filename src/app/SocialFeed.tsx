// FLOW — SocialFeed (FASE 1: sem mocks).
// Página orquestradora: monta componentes sociais e conecta dados via hooks.
// Feed e stories 100% Firestore; vazio/erro honestos (REGRA DE CONCLUSÃO FLOW).
import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { usePosts } from '../hooks/usePosts';
import { toggleLike, toggleSaved } from '../services/firebase/social';
import { rankFeed } from '../services/feed/ranking';
import { listBlockedIds } from '../services/firebase/blocks';
import { listDocuments } from '../services/firebase/firestore';
import { listStories } from '../services/firebase/stories';
import CommentsPanel from '../components/social/CommentsPanel';
import FeedTabs from '../components/social/FeedTabs';
import PostCard from '../components/social/PostCard';
import PostComposer from '../components/social/PostComposer';
import StoriesRail from '../components/social/StoriesRail';
import EmptyState from '../components/ui/EmptyState';
import ErrorState from '../components/ui/ErrorState';
import LoadingState from '../components/ui/LoadingState';
import CreatePostModal from './modules/CreatePostModal';
import type { FeedTab, SocialPost, StoryItem } from '../components/social/types';
import './social-feed.css';

export default function SocialFeed({ path = '/app' }: { path?: string }) {
  const { user } = useAppContext();
  const { posts, loading, loadingMore, hasMore, loadMore, error, reload } = usePosts(user?.uid);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [blockedIds, setBlockedIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
  const [order, setOrder] = useState<'relevant' | 'recent'>('relevant');
  const [liked, setLiked] = useState<Set<string>>(new Set());
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [commentsPost, setCommentsPost] = useState<SocialPost | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(path === '/app/criar');

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void listStories()
      .then((items) => {
        if (!cancelled) setStories(items);
      })
      .catch(() => {
        if (!cancelled) setStories([]);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void listDocuments<{ userId?: unknown }>(`users/${user.uid}/following`, { max: 200 })
      .then((rows) => {
        if (cancelled) return;
        setFollowingIds(
          new Set(
            rows
              .map((r) => (typeof r.userId === 'string' ? r.userId : r.id))
              .filter((v): v is string => typeof v === 'string'),
          ),
        );
      })
      .catch(() => {
        if (!cancelled) setFollowingIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const handleLike = (postId: string) => {
    const currentlyLiked = liked.has(postId);
    setLiked((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    // Otimista com reversão real em caso de erro (sem falso sucesso).
    void toggleLike(postId, currentlyLiked).catch(() => {
      setLiked((prev) => {
        const next = new Set(prev);
        if (currentlyLiked) next.add(postId);
        else next.delete(postId);
        return next;
      });
    });
  };

  const handleSave = (postId: string) => {
    const currentlySaved = saved.has(postId);
    setSaved((prev) => {
      const next = new Set(prev);
      if (currentlySaved) next.delete(postId);
      else next.add(postId);
      return next;
    });
    void toggleSaved(postId, currentlySaved).catch(() => {
      setSaved((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.add(postId);
        else next.delete(postId);
        return next;
      });
    });
  };

  const userAvatar = user?.photoURL || '/logo.png';

  useEffect(() => {
    if (!user?.uid) return;
    let cancelled = false;
    void listBlockedIds()
      .then((ids) => {
        if (!cancelled) setBlockedIds(ids);
      })
      .catch(() => {
        if (!cancelled) setBlockedIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  const visiblePosts = posts.filter((p) => {
    const authorId = typeof p.authorId === 'string' ? p.authorId : '';
    if (authorId && blockedIds.has(authorId)) return false;
    if (activeTab === 'following') return authorId !== '' && followingIds.has(authorId);
    return true;
  });
  // Ranking v1 na aba "Para você" (recência + afinidade + engajamento);
  // "Seguindo" permanece cronológico. Ambos reais, alternáveis.
  const orderedPosts =
    activeTab === 'for-you' && order === 'relevant'
      ? rankFeed(visiblePosts, { followingIds, blockedIds })
      : visiblePosts;
  const emptyTitle = activeTab === 'following' ? 'Nenhuma publicação de quem você segue' : 'Nenhuma publicação ainda';
  const emptyDescription =
    activeTab === 'following'
      ? 'Siga pessoas para ver as publicações delas aqui. Nada é simulado: vazio significa vazio no Firestore.'
      : 'As publicações reais da sua rede aparecem aqui assim que forem criadas.';

  return (
    <div className="flow-feed-layout">
      <div className="flow-feed-main-col">
        <StoriesRail stories={stories} />
        <PostComposer userAvatar={userAvatar} onCreate={() => setCreateModalOpen(true)} />
        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Feed Post List */}
        <div className="flow-post-list">
          {loading && <LoadingState message="Carregando publicações…" />}
          {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
          {!loading && !error && visiblePosts.length === 0 && (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}
          {!loading && !error && activeTab === 'for-you' && visiblePosts.length > 0 && (
            <div style={{ display: 'flex', gap: 8, marginBottom: 4 }}>
              {(['relevant', 'recent'] as const).map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setOrder(o)}
                  style={{
                    padding: '6px 14px', borderRadius: 999, fontSize: 12.5, fontWeight: 700, cursor: 'pointer',
                    border: order === o ? '1px solid #2563EB' : '1px solid #E2E8F0',
                    background: order === o ? '#EFF6FF' : '#FFFFFF',
                    color: order === o ? '#2563EB' : '#64748B',
                  }}
                >
                  {o === 'relevant' ? 'Relevantes' : 'Recentes'}
                </button>
              ))}
            </div>
          )}
          {!loading &&
            !error &&
            orderedPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={liked.has(post.id)}
              saved={saved.has(post.id)}
              onLike={() => handleLike(post.id)}
              onSave={() => handleSave(post.id)}
              onComments={() => setCommentsPost(post)}
            />
          ))}
          {!loading && !error && hasMore && (
            <button
              type="button"
              onClick={() => void loadMore()}
              disabled={loadingMore}
              style={{
                width: '100%', padding: 12, borderRadius: 12, border: '1px solid #E2E8F0',
                background: '#FFFFFF', color: '#2563EB', fontWeight: 800, fontSize: 14,
                cursor: loadingMore ? 'wait' : 'pointer', marginTop: 8,
              }}
            >
              {loadingMore ? 'Carregando…' : 'Carregar mais'}
            </button>
          )}
        </div>
      </div>

      {/* Comments Drawer / Modal if open */}
      {commentsPost && <CommentsPanel post={commentsPost} onClose={() => setCommentsPost(null)} />}

      {/* Create Post Modal (real creation + feed refresh) */}
      {createModalOpen && (
        <CreatePostModal isOpen onClose={() => setCreateModalOpen(false)} onCreated={() => reload()} />
      )}
    </div>
  );
}
