// FLOW — ShortsModule (FASE 1: sem mocks).
// Player sobre vídeos reais do Firestore (`posts` com `type === 'video'`).
import React, { useCallback, useEffect, useState } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music, Volume2, VolumeX, ChevronUp, ChevronDown } from 'lucide-react';
import { getDocument, listDocuments } from '../../services/firebase/firestore';
import { toggleFollow, toggleLike, toggleSaved } from '../../services/firebase/social';
import { useAppContext } from '../../contexts/AppContext';
import type { RawRecord } from '../../components/social/types';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';

interface ShortView {
  id: string;
  authorId: string;
  creator: string;
  handle: string;
  avatar: string;
  caption: string;
  songName: string;
  videoUrl: string;
  posterUrl?: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function ShortsModule() {
  const { user } = useAppContext();
  const [shorts, setShorts] = useState<ShortView[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [savedMap, setSavedMap] = useState<Record<string, boolean>>({});
  const [followingMap, setFollowingMap] = useState<Record<string, boolean>>({});
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const posts = await listDocuments<RawRecord>('posts', {
        orderByField: 'createdAt',
        direction: 'desc',
        max: 30,
      });
      const videos = posts.filter(
        (p) => p.type === 'video' && typeof (p.mediaUrl ?? p.videoUrl) === 'string',
      );
      const views = await Promise.all(
        videos.map(async (post): Promise<ShortView> => {
          const authorId = typeof post.authorId === 'string' ? post.authorId : '';
          const inlineAuthor =
            post.author && typeof post.author === 'object' ? (post.author as RawRecord) : null;
          const authorDoc =
            !inlineAuthor && authorId
              ? await getDocument<RawRecord>('users', authorId).catch(() => null)
              : null;
          const hashtags = Array.isArray(post.hashtags)
            ? (post.hashtags as unknown[]).filter((t): t is string => typeof t === 'string')
            : [];
          return {
            id: post.id,
            authorId,
            creator:
              (inlineAuthor?.name as string) ||
              (authorDoc?.displayName as string) ||
              'Usuário',
            handle: (inlineAuthor?.handle as string) || '@usuario',
            avatar:
              (inlineAuthor?.avatarUrl as string) ||
              (authorDoc?.photoURL as string) ||
              '/logo.png',
            caption: (post.text as string) || (post.caption as string) || '',
            songName: hashtags.length > 0 ? hashtags.join(' ') : 'Som original',
            videoUrl: ((post.mediaUrl ?? post.videoUrl) as string) || '',
            posterUrl: (post.posterUrl as string) || (post.imageUrl as string) || undefined,
            likes: (post.likesCount as number) || (post.likes as number) || 0,
            comments: (post.commentsCount as number) || (post.comments as number) || 0,
            shares: (post.sharesCount as number) || (post.shares as number) || 0,
          };
        }),
      );
      setShorts(views.filter((v) => v.videoUrl));
      setCurrentIndex(0);
    } catch {
      setError('Não foi possível carregar os shorts. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  useEffect(() => {
    if (!user?.uid) return;
    void listDocuments(`users/${user.uid}/following`, { max: 200 })
      .then((rows) => {
        const map: Record<string, boolean> = {};
        rows.forEach((r) => {
          const target = (r as { userId?: unknown }).userId;
          if (typeof target === 'string') map[target] = true;
          else map[r.id] = true;
        });
        setFollowingMap(map);
      })
      .catch(() => undefined);
  }, [user?.uid]);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <LoadingState message="Carregando shorts…" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <ErrorState description={error} onRetry={() => reload()} />
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 20px' }}>
        <EmptyState
          title="Nenhum short ainda"
          description="Os vídeos reais publicados como short aparecem aqui."
        />
      </div>
    );
  }

  const current = shorts[currentIndex];
  const isLiked = Boolean(likedMap[current.id]);
  const isSaved = Boolean(savedMap[current.id]);
  const isFollowing = Boolean(followingMap[current.authorId]);

  const handleNext = () => {
    if (currentIndex < shorts.length - 1) setCurrentIndex(c => c + 1);
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(c => c - 1);
  };

  const handleLike = () => {
    setLikedMap(prev => ({ ...prev, [current.id]: !prev[current.id] }));
    void toggleLike(current.id, isLiked).catch(() =>
      setLikedMap(prev => ({ ...prev, [current.id]: isLiked })),
    );
  };

  const handleSave = () => {
    setSavedMap(prev => ({ ...prev, [current.id]: !prev[current.id] }));
    void toggleSaved(current.id, isSaved).catch(() =>
      setSavedMap(prev => ({ ...prev, [current.id]: isSaved })),
    );
  };

  const handleFollow = () => {
    if (!current.authorId) return;
    setFollowingMap(prev => ({ ...prev, [current.authorId]: !prev[current.authorId] }));
    void toggleFollow(current.authorId, isFollowing).catch(() =>
      setFollowingMap(prev => ({ ...prev, [current.authorId]: isFollowing })),
    );
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      void navigator.clipboard.writeText(window.location.href).catch(() => undefined);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px 20px',
      minHeight: 'calc(100vh - 64px)',
      boxSizing: 'border-box'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        maxWidth: 580,
        width: '100%',
        justifyContent: 'center'
      }}>
        {/* Main Reel Card (9:16 Aspect Ratio) */}
        <div style={{
          position: 'relative',
          width: 360,
          height: 640,
          borderRadius: 20,
          overflow: 'hidden',
          backgroundColor: '#0F172A',
          boxShadow: '0 20px 40px rgba(0,0,0,0.25)',
          flexShrink: 0
        }}>
          {/* Video element */}
          <video
            key={current.videoUrl}
            src={current.videoUrl}
            poster={current.posterUrl}
            autoPlay={isPlaying}
            loop
            muted={isMuted}
            playsInline
            ref={(el) => {
              if (!el) return;
              if (isPlaying) void el.play().catch(() => undefined);
              else el.pause();
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onClick={() => setIsPlaying(!isPlaying)}
          />

          {/* Top Controls Overlay */}
          <div style={{
            position: 'absolute',
            top: 16,
            right: 16,
            display: 'flex',
            gap: 10,
            zIndex: 10
          }}>
            <button
              type="button"
              onClick={() => setIsMuted(!isMuted)}
              aria-label={isMuted ? 'Ativar som' : 'Silenciar'}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.5)',
                backdropFilter: 'blur(4px)',
                border: 'none',
                color: '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>

          {/* Bottom Info Overlay */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '40px 16px 20px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
            color: '#FFFFFF',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <img
                src={current.avatar}
                alt={current.creator}
                style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid #FFFFFF', objectFit: 'cover' }}
              />
              <div>
                <strong style={{ fontSize: 14, fontWeight: 700, display: 'block', lineHeight: 1.2 }}>
                  {current.creator}
                </strong>
                <span style={{ fontSize: 12, opacity: 0.8 }}>{current.handle}</span>
              </div>
              {current.authorId && current.authorId !== user?.uid && (
                <button
                  type="button"
                  onClick={handleFollow}
                  style={{
                    marginLeft: 'auto',
                    background: isFollowing ? 'rgba(255,255,255,0.2)' : '#FFFFFF',
                    color: isFollowing ? '#FFFFFF' : '#0F172A',
                    border: 'none',
                    borderRadius: 999,
                    padding: '5px 14px',
                    fontSize: 12,
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {isFollowing ? 'Seguindo' : 'Seguir'}
                </button>
              )}
            </div>

            <p style={{ margin: '0 0 10px 0', fontSize: 13.5, lineHeight: 1.4 }}>
              {current.caption}
            </p>

            {/* Song title with animated icon */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, opacity: 0.9 }}>
              <Music size={14} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {current.songName}
              </span>
            </div>
          </div>
        </div>

        {/* Action Column on Right Side of Reel */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}>
          {/* Navigation Prev */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            title="Vídeo anterior"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: currentIndex === 0 ? '#CBD5E1' : '#0F172A',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <ChevronUp size={22} />
          </button>

          {/* Like */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleLike}
              aria-label="Curtir short"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isLiked ? '#FEE2E2' : '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: isLiked ? '#DC2626' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Heart size={20} fill={isLiked ? '#DC2626' : 'none'} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              {current.likes + (isLiked ? 1 : 0)}
            </span>
          </div>

          {/* Comments (contagem real) */}
          <div style={{ textAlign: 'center' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <MessageCircle size={20} />
            </div>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              {current.comments}
            </span>
          </div>

          {/* Save */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleSave}
              aria-label="Salvar short"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: isSaved ? '#EFF6FF' : '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: isSaved ? '#2563EB' : '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Bookmark size={20} fill={isSaved ? '#2563EB' : 'none'} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              Salvar
            </span>
          </div>

          {/* Share */}
          <div style={{ textAlign: 'center' }}>
            <button
              type="button"
              onClick={handleShare}
              aria-label="Copiar link do short"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
                color: '#64748B',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
              }}
            >
              <Share2 size={20} />
            </button>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#64748B', marginTop: 4, display: 'block' }}>
              {current.shares}
            </span>
          </div>

          {/* Navigation Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex === shorts.length - 1}
            title="Próximo vídeo"
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              color: currentIndex === shorts.length - 1 ? '#CBD5E1' : '#0F172A',
              cursor: currentIndex === shorts.length - 1 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 6px rgba(0,0,0,0.06)'
            }}
          >
            <ChevronDown size={22} />
          </button>
        </div>
      </div>
    </div>
  );
}
