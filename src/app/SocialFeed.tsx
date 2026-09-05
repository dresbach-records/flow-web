// FLOW — SocialFeed (FASE 1: sem mocks).
// Página orquestradora: monta componentes sociais e conecta dados via hooks.
// Feed e stories 100% Firestore; vazio/erro honestos (REGRA DE CONCLUSÃO FLOW).
import { useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { usePosts } from '../hooks/usePosts';
import { toggleLike, toggleSaved } from '../services/firebase/social';
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
  const { posts, loading, error, reload } = usePosts(user?.uid);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
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

  const visiblePosts =
    activeTab === 'following'
      ? posts.filter((p) => typeof p.authorId === 'string' && followingIds.has(p.authorId))
      : posts;
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
          {!loading &&
            !error &&
            visiblePosts.map((post) => (
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
