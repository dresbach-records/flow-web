// FLOW — ExploreModule (FASE 1: sem mocks).
// Descoberta sobre posts reais do Firestore; likes com persistência real.
import React, { useCallback, useEffect, useState } from 'react';
import { Search, Flame, Heart, MessageCircle, Share2, Compass } from 'lucide-react';
import { getDocument, listDocuments } from '../../services/firebase/firestore';
import { toggleLike } from '../../services/firebase/social';
import type { RawRecord } from '../../components/social/types';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';

const EXPLORE_TAGS = ['Todos', 'Tendências', 'Tecnologia', 'Música', 'Design', 'Fotografia', 'Estilo', 'Games'];

interface ExploreView {
  id: string;
  title: string;
  author: string;
  handle: string;
  avatar: string;
  img?: string;
  likes: number;
  comments: number;
  tag: string;
}

export default function ExploreModule() {
  const [activeTag, setActiveTag] = useState('Todos');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ExploreView[]>([]);
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const posts = await listDocuments<RawRecord>('posts', {
        orderByField: 'createdAt',
        direction: 'desc',
        max: 24,
      });
      const views = await Promise.all(
        posts.map(async (post): Promise<ExploreView> => {
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
            title: (post.text as string) || (post.caption as string) || 'Publicação',
            author:
              (inlineAuthor?.name as string) ||
              (authorDoc?.displayName as string) ||
              'Usuário',
            handle: (inlineAuthor?.handle as string) || '@usuario',
            avatar:
              (inlineAuthor?.avatarUrl as string) ||
              (authorDoc?.photoURL as string) ||
              '/logo.png',
            img: (post.mediaUrl as string) || (post.imageUrl as string) || undefined,
            likes: (post.likesCount as number) || (post.likes as number) || 0,
            comments: (post.commentsCount as number) || (post.comments as number) || 0,
            tag: hashtags[0]?.replace(/^#/, '') || 'flow',
          };
        }),
      );
      setItems(views);
    } catch {
      setError('Não foi possível carregar a descoberta. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const toggleLikeReal = (id: string) => {
    const isLiked = likedItems.has(id);
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (isLiked) next.delete(id);
      else next.add(id);
      return next;
    });
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item,
      ),
    );
    // Persistência real com reversão (sem falso sucesso).
    void toggleLike(id, isLiked).catch(() => {
      setLikedItems((prev) => {
        const next = new Set(prev);
        if (isLiked) next.add(id);
        else next.delete(id);
        return next;
      });
      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, likes: item.likes + (isLiked ? 1 : -1) } : item,
        ),
      );
    });
  };

  const shareItem = (id: string) => {
    if (navigator.clipboard) {
      void navigator.clipboard
        .writeText(`${window.location.origin}/app`)
        .catch(() => undefined);
    }
    void id;
  };

  const filteredItems = items.filter((item) => {
    const q = query.trim().toLowerCase();
    const matchesTag =
      activeTag === 'Todos' ||
      (activeTag === 'Tendências'
        ? item.tag !== 'flow'
        : item.tag.toLowerCase().includes(activeTag.toLowerCase()) ||
          item.title.toLowerCase().includes(activeTag.toLowerCase()));
    const matchesQuery =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.author.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q);
    return matchesTag && matchesQuery;
  });

  return (
    <div style={{ maxWidth: 1040, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header & Search */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <Compass size={28} color="#2563EB" />
          <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Explorar</h1>
        </div>
        <p style={{ margin: 0, fontSize: 14, color: '#64748B' }}>
          Descubra publicações reais da comunidade FLOW.
        </p>
      </div>

      {/* Search Bar */}
      <div style={{
        position: 'relative',
        marginBottom: 20,
        maxWidth: 580,
      }}>
        <Search size={18} color="#94A3B8" style={{ position: 'absolute', left: 16, top: 13 }} />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por tags, criadores ou temas..."
          style={{
            width: '100%',
            height: 44,
            padding: '0 16px 0 46px',
            borderRadius: 999,
            border: '1px solid #E2E8F0',
            background: '#FFFFFF',
            fontSize: 14,
            color: '#0F172A',
            outline: 'none',
            boxSizing: 'border-box',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}
        />
      </div>

      {/* Tags Carousel */}
      <div style={{
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        paddingBottom: 8,
        marginBottom: 24
      }}>
        {EXPLORE_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveTag(tag)}
            style={{
              padding: '8px 18px',
              borderRadius: 999,
              fontSize: 13,
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTag === tag ? '1px solid #2563EB' : '1px solid #E2E8F0',
              background: activeTag === tag ? '#2563EB' : '#FFFFFF',
              color: activeTag === tag ? '#FFFFFF' : '#475569',
              whiteSpace: 'nowrap',
              boxShadow: activeTag === tag ? '0 2px 8px rgba(37,99,235,0.2)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {tag === 'Tendências' && <Flame size={14} style={{ display: 'inline', marginRight: 4 }} />}
            {tag}
          </button>
        ))}
      </div>

      {loading && <LoadingState message="Carregando descoberta…" />}
      {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
      {!loading && !error && filteredItems.length === 0 && (
        <EmptyState
          title="Nada por aqui ainda"
          description="As publicações reais aparecem aqui assim que a comunidade publicar."
        />
      )}

      {/* Explore Grid */}
      {!loading && !error && filteredItems.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}>
          {filteredItems.map((item) => {
            const isLiked = likedItems.has(item.id);
            return (
              <div
                key={item.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: 16,
                  border: '1px solid #E2E8F0',
                  overflow: 'hidden',
                  boxShadow: '0 1px 4px rgba(15,23,42,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
              >
                {/* Media Thumbnail */}
                {item.img && (
                  <div style={{ position: 'relative', height: 200, width: '100%', overflow: 'hidden' }}>
                    <img
                      src={item.img}
                      alt={item.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <span style={{
                      position: 'absolute',
                      top: 12,
                      left: 12,
                      background: 'rgba(15,23,42,0.7)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: 11,
                      fontWeight: 700
                    }}>
                      #{item.tag}
                    </span>
                  </div>
                )}

                {/* Info */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                  <h3 style={{ margin: '0 0 12px 0', fontSize: 15, fontWeight: 700, color: '#0F172A', lineHeight: 1.4 }}>
                    {item.title}
                  </h3>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                      <img
                        src={item.avatar}
                        alt={item.author}
                        style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 700, color: '#1E293B', display: 'block', lineHeight: 1.2 }}>
                          {item.author}
                        </span>
                        <span style={{ fontSize: 11, color: '#64748B' }}>{item.handle}</span>
                      </div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      borderTop: '1px solid #F1F5F9',
                      paddingTop: 10
                    }}>
                      <button
                        type="button"
                        onClick={() => toggleLikeReal(item.id)}
                        aria-label="Curtir publicação"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: isLiked ? '#DC2626' : '#64748B',
                          fontSize: 12,
                          fontWeight: 600
                        }}
                      >
                        <Heart size={16} fill={isLiked ? '#DC2626' : 'none'} />
                        <span>{item.likes}</span>
                      </button>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#64748B', fontSize: 12 }}>
                        <MessageCircle size={16} />
                        <span>{item.comments}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => shareItem(item.id)}
                        aria-label="Copiar link da publicação"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
                      >
                        <Share2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
