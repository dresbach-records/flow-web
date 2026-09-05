// FLOW — SavedModule (FASE 1: sem mocks).
// Itens salvos 100% Firestore (`users/{uid}/saved` + docs de `posts`).
import React, { useCallback, useEffect, useState } from 'react';
import { Bookmark, Heart, MessageCircle } from 'lucide-react';
import { useAppContext } from '../../contexts/AppContext';
import { getDocument, type WithId } from '../../services/firebase/firestore';
import { listSavedPostIds, toggleSaved } from '../../services/firebase/social';
import type { RawRecord } from '../../components/social/types';
import EmptyState from '../../components/ui/EmptyState';
import ErrorState from '../../components/ui/ErrorState';
import LoadingState from '../../components/ui/LoadingState';

interface SavedView {
  id: string;
  postId: string;
  title: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  imageUrl?: string;
  likes: number;
  comments: number;
}

export default function SavedModule() {
  const { user } = useAppContext();
  const [items, setItems] = useState<SavedView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user?.uid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const refs = await listSavedPostIds();
      const views = await Promise.all(
        refs.map(async (ref): Promise<SavedView | null> => {
          const post = await getDocument<RawRecord>('posts', ref.postId).catch(() => null);
          if (!post) return null;
          const author = (post.author && typeof post.author === 'object'
            ? (post.author as RawRecord)
            : null) as WithId<RawRecord> | null;
          const authorId = typeof post.authorId === 'string' ? post.authorId : '';
          const authorDoc = !author && authorId
            ? await getDocument<RawRecord>('users', authorId).catch(() => null)
            : null;
          const name =
            (author?.name as string) || (authorDoc?.displayName as string) || 'Usuário';
          return {
            id: ref.id,
            postId: ref.postId,
            title: (post.text as string) || (post.caption as string) || 'Publicação salva',
            authorName: name,
            authorHandle: (author?.handle as string) || '@usuario',
            authorAvatar: (author?.avatarUrl as string) || (authorDoc?.photoURL as string) || '/logo.png',
            imageUrl: (post.mediaUrl as string) || (post.imageUrl as string) || undefined,
            likes: (post.likesCount as number) || (post.likes as number) || 0,
            comments: (post.commentsCount as number) || (post.comments as number) || 0,
          };
        }),
      );
      setItems(views.filter((v): v is SavedView => v !== null));
    } catch {
      setError('Não foi possível carregar os salvos. Verifique sua conexão.');
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const removeItem = (postId: string) => {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.postId !== postId));
    // Remoção real com reversão (sem falso sucesso).
    void toggleSaved(postId, true).catch(() => setItems(previous));
  };

  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '24px 20px 60px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <Bookmark size={26} color="#2563EB" />
        <h1 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: '#0F172A' }}>Itens Salvos</h1>
      </div>
      <p style={{ margin: '0 0 24px 0', fontSize: 14, color: '#64748B' }}>
        Sua coleção pessoal de publicações guardadas para consulta posterior.
      </p>

      {loading && <LoadingState message="Carregando salvos…" />}
      {!loading && error && <ErrorState description={error} onRetry={() => reload()} />}
      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Nenhum item salvo"
          description="Clique no ícone de marcador nas publicações do feed para salvá-las aqui."
        />
      )}

      {!loading && !error && items.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {items.map(item => (
            <div
              key={item.id}
              style={{
                background: '#FFFFFF',
                borderRadius: 16,
                border: '1px solid #E2E8F0',
                padding: 18,
                boxShadow: '0 1px 3px rgba(15,23,42,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              {/* Author */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <img
                    src={item.authorAvatar}
                    alt={item.authorName}
                    style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <strong style={{ fontSize: 14, color: '#0F172A', display: 'block', lineHeight: 1.2 }}>
                      {item.authorName}
                    </strong>
                    <span style={{ fontSize: 12, color: '#64748B' }}>{item.authorHandle}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeItem(item.postId)}
                  title="Remover dos salvos"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#94A3B8',
                    padding: 6,
                    borderRadius: 8
                  }}
                >
                  <Bookmark size={16} />
                </button>
              </div>

              {/* Text */}
              <p style={{ margin: 0, fontSize: 14, color: '#1E293B', lineHeight: 1.5 }}>
                {item.title}
              </p>

              {/* Image preview */}
              {item.imageUrl && (
                <div style={{ borderRadius: 12, overflow: 'hidden', maxHeight: 320 }}>
                  <img src={item.imageUrl} alt="Anexo" style={{ width: '100%', height: 'auto', objectFit: 'cover' }} />
                </div>
              )}

              {/* Bottom stats */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                borderTop: '1px solid #F1F5F9',
                paddingTop: 10,
                fontSize: 12.5,
                color: '#64748B'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Heart size={16} color="#DC2626" fill="#DC2626" />
                  <span>{item.likes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MessageCircle size={16} />
                  <span>{item.comments} comentários</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
