// FLOW — SocialFeed (FASE 3).
// Página orquestradora: monta componentes sociais e conecta dados via hooks.
// Antes: 398 linhas com Stories/Composer/Tabs/PostCard/Comments internos.
// Depois: composição de componentes reutilizáveis, mesma UI e mesmo Firebase.
import { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { usePosts } from '../hooks/usePosts';
import { toggleLike, toggleSaved } from '../services/firebase/social';
import CommentsPanel from '../components/social/CommentsPanel';
import FeedTabs from '../components/social/FeedTabs';
import PostCard from '../components/social/PostCard';
import PostComposer from '../components/social/PostComposer';
import StoriesRail from '../components/social/StoriesRail';
import CreatePostModal from './modules/CreatePostModal';
import type { FeedTab, SocialPost, StoryItem } from '../components/social/types';
import './social-feed.css';

const DEFAULT_STORIES: StoryItem[] = [
  { id: 'story-0', isOwn: true, name: 'Seu story', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-1', name: 'Ana Clara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-2', name: 'Lucas', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-3', name: 'Juliana', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-4', name: 'Rafael', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-5', name: 'Beatriz', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-6', name: 'Pedro', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-7', name: 'Carla', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
];

const FALLBACK_AVATAR =
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

export default function SocialFeed({ path = '/app' }: { path?: string }) {
  const { user } = useAppContext();
  const { posts, reload } = usePosts(user?.uid);
  const [activeTab, setActiveTab] = useState<FeedTab>('for-you');
  const [liked, setLiked] = useState<Set<string>>(new Set(['canonical-post-1']));
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [commentsPost, setCommentsPost] = useState<SocialPost | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(path === '/app/criar');

  const handleLike = (postId: string) => {
    const currentlyLiked = liked.has(postId);
    setLiked((prev) => {
      const next = new Set(prev);
      if (currentlyLiked) next.delete(postId);
      else next.add(postId);
      return next;
    });
    // Conteúdo fallback local não possui documento Firestore: mantém só local.
    if (postId === 'canonical-post-1') return;
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
    if (postId === 'canonical-post-1') return;
    void toggleSaved(postId, currentlySaved).catch(() => {
      setSaved((prev) => {
        const next = new Set(prev);
        if (currentlySaved) next.add(postId);
        else next.delete(postId);
        return next;
      });
    });
  };

  const userAvatar = user?.photoURL || FALLBACK_AVATAR;

  return (
    <div className="flow-feed-layout">
      <div className="flow-feed-main-col">
        <StoriesRail stories={DEFAULT_STORIES} />
        <PostComposer userAvatar={userAvatar} onCreate={() => setCreateModalOpen(true)} />
        <FeedTabs activeTab={activeTab} onChange={setActiveTab} />

        {/* Feed Post List */}
        <div className="flow-post-list">
          {posts.map((post) => (
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
