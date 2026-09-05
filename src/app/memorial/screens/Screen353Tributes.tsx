// FLOW — Screen353Tributes (FASE 5: dados reais).
// Mural de homenagens do Firestore; remoção só das próprias.
import { useCallback, useEffect, useState } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import type { MemorialScreenProps } from './types';
import {
  DEFAULT_MEMORIAL_ID,
  deleteTribute,
  listTributes,
  type Tribute,
} from '../../../services/firebase/memorial';
import { requireFirebaseAuth } from '../../../services/firebase/config';

function formatDate(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleDateString('pt-BR');
    }
  } catch {
    /* sem data */
  }
  return '';
}

export default function Screen353Tributes({ onNavigate }: MemorialScreenProps) {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setTributes(await listTributes(DEFAULT_MEMORIAL_ID));
    } catch {
      setError('Não foi possível carregar as homenagens.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const ownUid = (() => {
    try {
      return requireFirebaseAuth().currentUser?.uid ?? '';
    } catch {
      return '';
    }
  })();

  const remove = (id: string) => {
    const previous = tributes;
    setTributes((prev) => prev.filter((t) => t.id !== id));
    void deleteTribute(id).catch(() => setTributes(previous));
  };

  return (
    <div className="m353-wrap">
      <div className="m353-header">
        <div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#0F172A' }}>Homenagens</h2>
          <p style={{ margin: 0, color: '#64748B', fontSize: 14 }}>
            Homenagens reais deixadas pela comunidade.
          </p>
        </div>
        <button className="m-btn-primary" onClick={() => onNavigate(354)}>
          Escrever homenagem
        </button>
      </div>

      {loading && <p style={{ color: '#64748B', fontSize: 14 }}>Carregando homenagens…</p>}
      {!loading && error && (
        <div>
          <p style={{ color: '#B91C1C', fontSize: 14 }}>{error}</p>
          <button className="m-btn-secondary" onClick={() => reload()}>Tentar novamente</button>
        </div>
      )}
      {!loading && !error && tributes.length === 0 && (
        <p style={{ color: '#64748B', fontSize: 14 }}>
          Nenhuma homenagem ainda — seja a primeira pessoa a deixar uma mensagem.
        </p>
      )}

      <div className="m353-list">
        {tributes.map((t) => (
          <div key={t.id} className="m353-card">
            <div className="m353-author-bar">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <img src={t.authorAvatar} alt={t.authorName} style={{ width: 42, height: 42, borderRadius: '50%' }} />
                <div>
                  <strong style={{ fontSize: 15, color: '#0F172A', display: 'block' }}>{t.authorName}</strong>
                  {formatDate(t.createdAt) && <small style={{ color: '#94A3B8' }}>{formatDate(t.createdAt)}</small>}
                </div>
              </div>
              {t.authorId && t.authorId === ownUid ? (
                <button
                  onClick={() => remove(t.id)}
                  title="Remover minha homenagem"
                  style={{
                    border: 'none',
                    background: 'rgba(239, 68, 68, 0.08)',
                    color: '#EF4444',
                    padding: '6px 12px',
                    borderRadius: 9999,
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Trash2 size={14} /> Remover
                </button>
              ) : (
                <span
                  style={{
                    color: '#94A3B8',
                    padding: '6px 12px',
                    fontSize: 13,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Heart size={14} /> Homenagem
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: 15, color: '#334155', lineHeight: 1.6 }}>{t.text}</p>
            {t.mediaUrl && (
              <img src={t.mediaUrl} alt="Anexo da homenagem" style={{ width: '100%', borderRadius: 12, marginTop: 12 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
