// FLOW — Post individual real (visualizar, curtir, comentar, salvar, denunciar, excluir).
import React, { useCallback, useEffect, useState } from 'react';
import { navigate } from '../../hooks/useRouter';
import { useAppContext } from '../../contexts/AppContext';
import { deleteDocument, getDocument } from '../../services/firebase/firestore';
import { addComment, listComments, toggleLike, toggleSaved, updatePost, type CommentRecord } from '../../services/firebase/social';
import { blockUser } from '../../services/firebase/blocks';
import { ReportDialog } from '../../components/moderation/ReportDialog';
import type { RawRecord } from '../../components/social/types';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';

export default function PostPage({ id }: { id: string }) {
  const { user } = useAppContext();
  const [post, setPost] = useState<RawRecord & { id: string } | null>(null);
  const [authorName, setAuthorName] = useState('Usuário');
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const doc = await getDocument<RawRecord>('posts', id);
      if (!doc) {
        setError('Publicação não encontrada.');
        return;
      }
      setPost({ ...doc });
      const inlineAuthor = doc.author && typeof doc.author === 'object' ? (doc.author as RawRecord) : null;
      const authorId = typeof doc.authorId === 'string' ? doc.authorId : '';
      if (inlineAuthor?.name) setAuthorName(String(inlineAuthor.name));
      else if (authorId) {
        const authorDoc = await getDocument<RawRecord>('users', authorId).catch(() => null);
        if (authorDoc?.displayName) setAuthorName(String(authorDoc.displayName));
      }
      setComments(await listComments(id).catch(() => []));
    } catch {
      setError('Não foi possível carregar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { void reload(); }, [reload]);

  if (loading) {
    return <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}><LoadingState message="Carregando publicação…" /></div>;
  }
  if (error || !post) {
    return (
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 20px' }}>
        <ErrorState description={error ?? 'Publicação não encontrada.'} onRetry={() => reload()} />
      </div>
    );
  }

  const isOwner = typeof post.authorId === 'string' && post.authorId === user?.uid;
  const likes = (post.likesCount as number) || (post.likes as number) || 0;
  const mediaRaw: unknown = post.mediaUrl ?? post.imageUrl;
  const mediaUrl = typeof mediaRaw === 'string' ? mediaRaw : '';

  const doLike = () => {
    const was = liked;
    setLiked(!was);
    void toggleLike(id, was).catch(() => setLiked(was));
  };

  const doSave = () => {
    const was = saved;
    setSaved(!was);
    void toggleSaved(id, was).catch(() => setSaved(was));
  };

  const sendComment = () => {
    if (!draft.trim()) return;
    const text = draft.trim();
    setDraft('');
    void addComment(id, text)
      .then(() => listComments(id))
      .then(setComments)
      .then(() => reload())
      .catch(() => setNotice('Não foi possível comentar.'));
  };

  const remove = () => {
    void deleteDocument('posts', id)
      .then(() => navigate('/app'))
      .catch(() => setNotice('Não foi possível excluir.'));
  };

  const startEdit = () => {
    setEditText(String(post?.text ?? post?.caption ?? ''));
    setEditing(true);
  };

  const saveEdit = () => {
    setSavingEdit(true);
    void updatePost(id, editText)
      .then(() => {
        setEditing(false);
        return reload();
      })
      .catch((err: unknown) => setNotice(err instanceof Error ? err.message : 'Não foi possível salvar.'))
      .finally(() => setSavingEdit(false));
  };

  const blockAuthor = () => {
    const authorId = typeof post?.authorId === 'string' ? post.authorId : '';
    if (!authorId) return;
    void blockUser(authorId)
      .then(() => navigate('/app'))
      .catch((err: unknown) => setNotice(err instanceof Error ? err.message : 'Não foi possível bloquear.'));
  };

  return (
    <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 20px 60px' }}>
      <button type="button" onClick={() => navigate('/app')} style={{ background: 'none', border: 'none', color: '#4F7FFF', fontWeight: 800, cursor: 'pointer', marginBottom: 12 }}>
        ← Voltar ao feed
      </button>
      <article style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22, marginBottom: 16 }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 800, color: '#0F172A' }}>{authorName}</p>
        {editing ? (
          <div style={{ marginBottom: 12 }}>
            <textarea
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              rows={4}
              aria-label="Editar publicação"
              style={{ width: '100%', border: '1px solid #CBD5E1', borderRadius: 10, padding: 12, fontSize: 15, boxSizing: 'border-box', fontFamily: 'inherit' }}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button type="button" onClick={saveEdit} disabled={savingEdit} style={btnPrimary()}>
                {savingEdit ? 'Salvando…' : 'Salvar'}
              </button>
              <button type="button" onClick={() => setEditing(false)} style={btn()}>Cancelar</button>
            </div>
          </div>
        ) : (
          <p style={{ margin: '0 0 12px 0', fontSize: 15, color: '#1E293B', lineHeight: 1.6 }}>
            {String(post.text ?? post.caption ?? '')}
          </p>
        )}
        {mediaUrl && (
          <img src={mediaUrl} alt="Mídia da publicação" style={{ width: '100%', borderRadius: 12, marginBottom: 12 }} />
        )}
        <p style={{ margin: '0 0 12px 0', fontSize: 13, color: '#64748B' }}>
          {likes} curtidas · {comments.length} comentários
        </p>
        {notice && <p role="alert" style={{ color: '#B91C1C', fontSize: 13 }}>{notice}</p>}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" onClick={doLike} style={btn()}>{liked ? 'Curtido ✓' : 'Curtir'}</button>
          <button type="button" onClick={doSave} style={btn()}>{saved ? 'Salvo ✓' : 'Salvar'}</button>
          <button type="button" onClick={() => setReportOpen(true)} style={btn()}>Denunciar</button>
          {isOwner ? (
            <>
              <button type="button" onClick={startEdit} style={btn()}>Editar</button>
              <button type="button" onClick={remove} style={btnDanger()}>Excluir</button>
            </>
          ) : (
            <button type="button" onClick={blockAuthor} style={btnDanger()}>Bloquear autor</button>
          )}
        </div>
      </article>
      {reportOpen && <ReportDialog targetId={id} onClose={() => setReportOpen(false)} />}

      <section style={{ background: '#FFF', border: '1px solid #E2E8F0', borderRadius: 16, padding: 22 }}>
        <h2 style={{ margin: '0 0 12px 0', fontSize: 16, color: '#0F172A' }}>Comentários ({comments.length})</h2>
        {comments.length === 0 && <EmptyState title="Sem comentários" description="Seja a primeira pessoa a comentar." />}
        {comments.map((c) => (
          <div key={c.id} style={{ padding: '10px 0', borderBottom: '1px solid #F1F5F9', fontSize: 14, color: '#1E293B' }}>
            {c.text}
          </div>
        ))}
        <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
          <input
            type="text" value={draft} onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') sendComment(); }}
            placeholder="Escreva um comentário..." aria-label="Escreva um comentário"
            style={{ flex: 1, height: 42, padding: '0 14px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 14 }}
          />
          <button type="button" onClick={sendComment} style={{ padding: '0 20px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, cursor: 'pointer' }}>
            Enviar
          </button>
        </div>
        <p style={{ margin: '10px 0 0 0', fontSize: 12, color: '#94A3B8' }}>
          Respostas a comentários chegam na Fase 9.
        </p>
      </section>
    </div>
  );
}

function btn(): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 10, border: '1px solid #CBD5E1', background: '#FFF', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' };
}

function btnDanger(): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 10, border: '1px solid #FECACA', background: '#FFF', color: '#B91C1C', fontWeight: 700, fontSize: 13.5, cursor: 'pointer' };
}

function btnPrimary(): React.CSSProperties {
  return { padding: '9px 18px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 13.5, cursor: 'pointer' };
}
