// FLOW — CommentsPanel (comentários reais: listar, comentar, responder, excluir).
import { useCallback, useEffect, useState } from 'react';
import { Trash2, X } from 'lucide-react';
import { addComment, deleteComment, listComments, type CommentRecord } from '../../../services/firebase/social';
import { requireFirebaseAuth } from '../../../services/firebase/config';
import type { CommentsPanelProps } from './CommentsPanel.types';
import './CommentsPanel.css';

function ownUid(): string {
  try {
    return requireFirebaseAuth().currentUser?.uid ?? '';
  } catch {
    return '';
  }
}

export default function CommentsPanel({ post, onClose }: CommentsPanelProps) {
  const [comments, setComments] = useState<CommentRecord[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [draft, setDraft] = useState('');
  const [replyTo, setReplyTo] = useState<CommentRecord | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uid = ownUid();

  const reload = useCallback(async () => {
    try {
      setComments(await listComments(post.id));
    } catch {
      /* mantém o que há */
    } finally {
      setLoaded(true);
    }
  }, [post.id]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setError(null);
    setDraft('');
    const parent = replyTo;
    setReplyTo(null);
    void addComment(post.id, text, parent?.id)
      .then(() => reload())
      .catch((err: unknown) => setError(err instanceof Error ? err.message : 'Não foi possível comentar.'));
  };

  const remove = (commentId: string) => {
    const previous = comments;
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    void deleteComment(post.id, commentId).catch(() => setComments(previous));
  };

  const roots = comments.filter((c) => !c.parentId);
  const repliesOf = (id: string) => comments.filter((c) => c.parentId === id);

  return (
    <div className="flow-comments-overlay">
      <div className="flow-comments-backdrop" onClick={onClose} />
      <div className="flow-comments-modal">
        <header className="flow-comments-header">
          <strong>Comentários</strong>
          <button onClick={onClose} aria-label="Fechar comentários">
            <X size={20} />
          </button>
        </header>
        <div className="flow-comments-list">
          {loaded && comments.length === 0 && (
            <p style={{ fontSize: 13, color: '#64748B' }}>Seja a primeira pessoa a comentar.</p>
          )}
          {roots.map((c) => (
            <div key={c.id}>
              <div className="flow-comment-item">
                <div style={{ flex: 1 }}>
                  <strong>{c.authorId === uid ? 'Você' : c.authorId.slice(0, 8)}</strong>
                  <p>{c.text}</p>
                  <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() => setReplyTo(c)}
                      style={{ background: 'none', border: 'none', color: '#4F7FFF', fontSize: 12, fontWeight: 700, cursor: 'pointer', padding: 0 }}
                    >
                      Responder
                    </button>
                    {c.authorId === uid && (
                      <button
                        type="button"
                        onClick={() => remove(c.id)}
                        aria-label="Excluir comentário"
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              {repliesOf(c.id).map((r) => (
                <div key={r.id} className="flow-comment-item" style={{ marginLeft: 24 }}>
                  <div style={{ flex: 1 }}>
                    <strong>{r.authorId === uid ? 'Você' : r.authorId.slice(0, 8)}</strong>
                    <p>{r.text}</p>
                    {r.authorId === uid && (
                      <button
                        type="button"
                        onClick={() => remove(r.id)}
                        aria-label="Excluir resposta"
                        style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: 0, display: 'flex' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid #F1F5F9' }}>
          {replyTo && (
            <p style={{ margin: '0 0 8px 0', fontSize: 12, color: '#64748B' }}>
              Respondendo a <strong>{replyTo.authorId === uid ? 'você' : 'comentário'}</strong>
              {' '}<button type="button" onClick={() => setReplyTo(null)} style={{ background: 'none', border: 'none', color: '#4F7FFF', cursor: 'pointer', fontSize: 12 }}>cancelar</button>
            </p>
          )}
          {error && <p role="alert" style={{ margin: '0 0 8px 0', fontSize: 12, color: '#B91C1C' }}>{error}</p>}
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') send(); }}
              placeholder="Escreva um comentário..."
              aria-label="Escreva um comentário"
              style={{ flex: 1, height: 38, padding: '0 12px', borderRadius: 10, border: '1px solid #CBD5E1', fontSize: 13 }}
            />
            <button
              type="button"
              onClick={send}
              style={{ padding: '0 18px', borderRadius: 10, border: 'none', background: '#2563EB', color: '#FFF', fontWeight: 800, fontSize: 13, cursor: 'pointer' }}
            >
              Enviar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
