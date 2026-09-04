import { useEffect, useMemo, useState, useCallback, type ReactElement } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { getDocument, listDocuments, type WithId } from '../services/firebase/firestore';
import { createPost, hasLiked, listComments, toggleFollow, toggleLike, toggleSaved, uploadPostMedia, type CommentRecord } from '../services/firebase/social';
import CreatePostModal from './modules/CreatePostModal';
import {
  Bookmark,
  CheckCircle2,
  ChevronDown,
  Compass,
  Heart,
  Image as ImageIcon,
  MapPin,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Play,
  Share2,
  Smile,
  SlidersHorizontal,
  Users,
  Video,
  BarChart2,
  X
} from 'lucide-react';
import './social-feed.css';

type RawRecord = Record<string, unknown>;
type SocialPost = WithId<RawRecord> & { author?: RawRecord | null };
type SocialStory = WithId<RawRecord> & { author?: RawRecord | null };

type Profile = { uid: string; name: string; handle: string; avatar?: string; cover?: string; bio?: string };

const DEFAULT_STORIES = [
  { id: 'story-0', isOwn: true, name: 'Seu story', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-1', name: 'Ana Clara', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-2', name: 'Lucas', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-3', name: 'Juliana', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-4', name: 'Rafael', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-5', name: 'Beatriz', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-6', name: 'Pedro', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80' },
  { id: 'story-7', name: 'Carla', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80' },
];

const CANONICAL_POST: SocialPost = {
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

export default function SocialFeed({ path = '/app' }: { path?: string }) {
  const { user, loading } = useAppContext();
  const [posts, setPosts] = useState<SocialPost[]>([CANONICAL_POST]);
  const [stories, setStories] = useState<typeof DEFAULT_STORIES>(DEFAULT_STORIES);
  const [activeTab, setActiveTab] = useState<'for-you' | 'following' | 'communities'>('for-you');
  const [liked, setLiked] = useState<Set<string>>(new Set(['canonical-post-1']));
  const [saved, setSaved] = useState<Set<string>>(new Set());
  const [commentsPost, setCommentsPost] = useState<SocialPost | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(path === '/app/criar');

  const fetchPosts = useCallback(async () => {
    try {
      const loadedPosts = await listDocuments<RawRecord>('posts', { orderByField: 'createdAt', direction: 'desc', max: 25 });
      if (loadedPosts.length > 0) {
        const enrich = async (items: WithId<RawRecord>[]) => Promise.all(items.map(async item => {
          const authorId = typeof item.authorId === 'string' ? item.authorId : '';
          const inlineAuthor = item.author && typeof item.author === 'object' ? item.author as RawRecord : null;
          if (inlineAuthor || !authorId) return { ...item, author: inlineAuthor };
          return { ...item, author: await getDocument<RawRecord>('users', authorId).catch(() => null) };
        }));
        const enriched = await enrich(loadedPosts);
        setPosts([CANONICAL_POST, ...enriched]);
      }
    } catch {
      // Fallback to canonical mock
    }
  }, []);

  useEffect(() => {
    if (path === '/app/criar') {
      setCreateModalOpen(true);
    }
  }, [path]);

  useEffect(() => {
    if (!user) return;
    void fetchPosts();
  }, [user, fetchPosts]);

  const handleLike = (postId: string) => {
    const isCurrentlyLiked = liked.has(postId);
    setLiked(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    void toggleLike(postId, !isCurrentlyLiked).catch(() => {});
  };

  const handleSave = (postId: string) => {
    const isCurrentlySaved = saved.has(postId);
    setSaved(prev => {
      const next = new Set(prev);
      if (next.has(postId)) next.delete(postId);
      else next.add(postId);
      return next;
    });
    void toggleSaved(postId, !isCurrentlySaved).catch(() => {});
  };

  const userAvatar = user?.photoURL || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80';

  return (
    <div className="flow-feed-layout">
      <div className="flow-feed-main-col">
        {/* Stories Row */}
        <section className="flow-stories-card">
          <div className="flow-stories-scroll">
            {stories.map(story => (
              <button key={story.id} className="flow-story-item">
                <div className={`flow-story-avatar-wrapper ${story.isOwn ? 'own-story' : ''}`}>
                  <img src={story.avatar} alt={story.name} className="flow-story-img" />
                  {story.isOwn && (
                    <div className="flow-story-plus-badge">
                      <Plus size={12} color="#FFFFFF" strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span className="flow-story-name">{story.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Post Composer Card */}
        <section className="flow-composer-card">
          <div className="flow-composer-top">
            <img src={userAvatar} alt="User" className="flow-composer-avatar" />
            <input
              type="text"
              className="flow-composer-input"
              placeholder="No que você está pensando hoje?"
              onClick={() => setCreateModalOpen(true)}
              readOnly
            />
          </div>
          <div className="flow-composer-bottom">
            <div className="flow-composer-actions">
              <button type="button" className="flow-composer-btn btn-foto" onClick={() => setCreateModalOpen(true)}>
                <ImageIcon size={18} color="#2563EB" />
                <span>Foto</span>
              </button>
              <button type="button" className="flow-composer-btn btn-video" onClick={() => setCreateModalOpen(true)}>
                <Video size={18} color="#EA580C" />
                <span>Vídeo</span>
              </button>
              <button type="button" className="flow-composer-btn btn-enquete" onClick={() => setCreateModalOpen(true)}>
                <BarChart2 size={18} color="#9333EA" />
                <span>Enquete</span>
              </button>
              <button type="button" className="flow-composer-btn btn-sentimento" onClick={() => setCreateModalOpen(true)}>
                <Smile size={18} color="#D97706" />
                <span>Sentimento</span>
              </button>
              <button type="button" className="flow-composer-btn btn-localizacao" onClick={() => setCreateModalOpen(true)}>
                <MapPin size={18} color="#EC4899" />
                <span>Localização</span>
              </button>
              <button type="button" className="flow-composer-btn btn-more" onClick={() => setCreateModalOpen(true)}>
                <MoreHorizontal size={18} color="#64748B" />
              </button>
            </div>
            <button type="button" className="flow-composer-publish-btn" onClick={() => setCreateModalOpen(true)}>
              Publicar
            </button>
          </div>
        </section>

        {/* Feed Navigation Tabs */}
        <div className="flow-feed-tabs-bar">
          <div className="flow-feed-tab-buttons">
            <button
              className={`flow-feed-tab-btn ${activeTab === 'for-you' ? 'active' : ''}`}
              onClick={() => setActiveTab('for-you')}
            >
              Para você
            </button>
            <button
              className={`flow-feed-tab-btn ${activeTab === 'following' ? 'active' : ''}`}
              onClick={() => setActiveTab('following')}
            >
              Seguindo
            </button>
            <button
              className={`flow-feed-tab-btn ${activeTab === 'communities' ? 'active' : ''}`}
              onClick={() => setActiveTab('communities')}
            >
              Comunidades
            </button>
          </div>
          <div className="flow-feed-tabs-right">
            <button className="flow-tab-filter-icon" aria-label="Filtrar">
              <SlidersHorizontal size={18} />
            </button>
            <button className="flow-tab-sort-btn">
              <span>Mais recentes</span>
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Feed Post List */}
        <div className="flow-post-list">
          {posts.map(post => (
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
      {commentsPost && (
        <CommentsPanel post={commentsPost} onClose={() => setCommentsPost(null)} />
      )}

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          if (path === '/app/criar') {
            history.replaceState({}, '', '/app');
          }
        }}
        onCreated={fetchPosts}
      />
    </div>
  );
}

function PostCard({
  post,
  liked,
  saved,
  onLike,
  onSave,
  onComments,
}: {
  post: SocialPost;
  liked: boolean;
  saved: boolean;
  onLike: () => void;
  onSave: () => void;
  onComments: () => void;
}) {
  const authorName = (post.author?.name as string) || 'Camila Torres';
  const authorHandle = (post.author?.handle as string) || '@camilatorres';
  const authorAvatar = (post.author?.avatarUrl as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80';
  const isVerified = post.author?.verified === true || authorHandle === '@camilatorres';
  const caption = (post.caption as string) || (post.text as string) || '';
  const hashtags = (post.hashtags as string[]) || [];
  const imageUrl = (post.imageUrl as string) || (post.mediaUrl as string) || '';
  const likesCount = (post.likes as number) || 0;
  const commentsCount = (post.comments as number) || 0;
  const sharesCount = (post.shares as number) || 0;
  const timeAgo = (post.timeAgo as string) || '2h';
  const commentPreview = post.commentPreview as { authorName: string; authorAvatar: string; text: string; timeAgo: string } | undefined;

  return (
    <article className="flow-post-card">
      {/* Header */}
      <header className="flow-post-header">
        <div className="flow-post-author-box">
          <img src={authorAvatar} alt={authorName} className="flow-post-author-avatar" />
          <div className="flow-post-author-meta">
            <div className="flow-post-author-name-row">
              <strong className="flow-post-author-name">{authorName}</strong>
              {isVerified && (
                <span className="flow-verified-badge" title="Conta verificada">
                  <CheckCircle2 size={16} color="#3B82F6" fill="#3B82F6" stroke="#FFFFFF" />
                </span>
              )}
              <span className="flow-post-handle">{authorHandle}</span>
              <span className="flow-post-dot">•</span>
              <span className="flow-post-time">{timeAgo}</span>
            </div>
          </div>
        </div>
        <button className="flow-post-more-btn" aria-label="Mais opções">
          <MoreHorizontal size={18} />
        </button>
      </header>

      {/* Caption & Hashtags */}
      {caption && <p className="flow-post-caption-text">{caption}</p>}
      {hashtags.length > 0 && (
        <div className="flow-post-hashtags-row">
          {hashtags.map(tag => (
            <span key={tag} className="flow-post-hashtag">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Media Image */}
      {imageUrl && (
        <div className="flow-post-media-box">
          <img src={imageUrl} alt="Publicação" className="flow-post-media-img" />
        </div>
      )}

      {/* Post Action Bar */}
      <footer className="flow-post-action-bar">
        <div className="flow-post-actions-left">
          <button className={`flow-action-btn ${liked ? 'is-liked' : ''}`} onClick={onLike}>
            <Heart size={20} fill={liked ? '#EC4899' : 'none'} color={liked ? '#EC4899' : '#64748B'} />
            <span>{likesCount > 1000 ? `${(likesCount / 1000).toFixed(1)}K` : likesCount}</span>
          </button>
          <button className="flow-action-btn" onClick={onComments}>
            <MessageCircle size={20} color="#64748B" />
            <span>{commentsCount}</span>
          </button>
          <button className="flow-action-btn">
            <Share2 size={20} color="#64748B" />
            <span>{sharesCount}</span>
          </button>
        </div>
        <div className="flow-post-actions-right">
          <button className={`flow-action-btn ${saved ? 'is-saved' : ''}`} onClick={onSave}>
            <Bookmark size={20} fill={saved ? '#2563EB' : 'none'} color={saved ? '#2563EB' : '#64748B'} />
            <span>Salvar</span>
          </button>
        </div>
      </footer>

      {/* Comment Preview Section */}
      {commentPreview && (
        <div className="flow-post-comment-preview">
          <div className="flow-comment-row">
            <img src={commentPreview.authorAvatar} alt={commentPreview.authorName} className="flow-comment-avatar" />
            <div className="flow-comment-body">
              <span className="flow-comment-author-name">{commentPreview.authorName}</span>
              <span className="flow-comment-text">{commentPreview.text}</span>
              <div className="flow-comment-meta">
                <span className="flow-comment-time">{commentPreview.timeAgo}</span>
                <button className="flow-comment-reply-btn">Responder</button>
              </div>
            </div>
          </div>
          <button className="flow-view-more-comments-btn" onClick={onComments}>
            Ver mais 12 comentários
          </button>
        </div>
      )}
    </article>
  );
}

function CommentsPanel({ post, onClose }: { post: SocialPost; onClose: () => void }) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [value, setValue] = useState('');

  useEffect(() => {
    void listComments(post.id).then(setComments).catch(() => {});
  }, [post.id]);

  return (
    <div className="flow-comments-overlay">
      <div className="flow-comments-backdrop" onClick={onClose} />
      <div className="flow-comments-modal">
        <header className="flow-comments-header">
          <strong>Comentários</strong>
          <button onClick={onClose}><X size={20} /></button>
        </header>
        <div className="flow-comments-list">
          {comments.map(c => (
            <div key={c.id} className="flow-comment-item">
              <strong>{c.authorId}</strong>
              <p>{c.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function go(path: string) {
  history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}
