// FLOW — AdminContent (FASE 6: dados reais).
// Catálogo de `posts` do Firestore. Remoção administrativa persiste de verdade
// (regra: delete próprio ou admin) + trilha em `admin_audit`. Sem alcance fictício.
import React, { useCallback, useEffect, useState } from 'react';
import { FileText, Trash2, CheckCircle2, Search } from 'lucide-react';
import { deleteDocument, listDocuments } from '../../services/firebase/firestore';
import { logAdminAction } from '../../services/firebase/audit';

interface ContentItem {
  id: string;
  type: string;
  authorId: string;
  title: string;
  likes: number;
  comments: number;
  createdAt: unknown;
}

function formatDate(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString('pt-BR');
    }
  } catch {
    /* sem data */
  }
  return '—';
}

export const AdminContent: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const docs = await listDocuments<Record<string, unknown>>('posts', {
        orderByField: 'createdAt',
        direction: 'desc',
        max: 100,
      });
      setItems(
        docs.map((d) => ({
          id: d.id,
          type: typeof d.type === 'string' ? d.type : 'post',
          authorId: typeof d.authorId === 'string' ? d.authorId : '—',
          title: (typeof d.text === 'string' && d.text) || (typeof d.caption === 'string' && d.caption) || '(sem texto)',
          likes: (d.likesCount as number) || (d.likes as number) || 0,
          comments: (d.commentsCount as number) || (d.comments as number) || 0,
          createdAt: d.createdAt,
        })),
      );
    } catch {
      setLoadError('Não foi possível carregar o conteúdo. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const q = search.toLowerCase();
    const matchesSearch = item.title.toLowerCase().includes(q) || item.authorId.toLowerCase().includes(q);
    return matchesType && matchesSearch;
  });

  const handleRemove = (id: string) => {
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== id));
    void deleteDocument('posts', id)
      .then(() => {
        setToast(`Conteúdo ${id} removido por decisão administrativa.`);
        setTimeout(() => setToast(null), 3000);
        void logAdminAction('REMOVE_POST', `Post ${id}`);
      })
      .catch(() => {
        setItems(previous);
        setToast('Falha ao remover. Verifique a permissão.');
        setTimeout(() => setToast(null), 3000);
      });
  };

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <FileText size={24} color="#6366f1" />
          <span>Catálogo e Moderação de Conteúdo</span>
        </h1>
        <p className="greeting-subtitle">
          Supervisão de publicações, vídeos shorts, stories e transmissões ao vivo da rede.
        </p>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando conteúdo…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div className="topbar-search-wrapper" style={{ width: '360px' }}>
            <Search className="topbar-search-icon" />
            <input
              type="text"
              className="topbar-search-input"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', 'text', 'image', 'video'].map((t) => (
              <button
                key={t}
                type="button"
                className={`admin-action-btn ${filterType === t ? 'active' : ''}`}
                style={{
                  backgroundColor: filterType === t ? '#6366f1' : '#ffffff',
                  color: filterType === t ? '#ffffff' : '#475569',
                  borderColor: filterType === t ? '#6366f1' : '#e2e8f0',
                }}
                onClick={() => setFilterType(t)}
              >
                {t === 'all' ? 'Todos' : t.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>ID & Tipo</th>
              <th>Título & Autor</th>
              <th>Curtidas</th>
              <th>Comentários</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <CheckCircle2 size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhum conteúdo encontrado.
                </td>
              </tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{ fontWeight: 700 }}>{item.id}</span>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{item.type}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                  <div style={{ fontSize: '11.5px', color: '#6366f1' }}>{item.authorId}</div>
                </td>
                <td>{item.likes}</td>
                <td>{item.comments}</td>
                <td style={{ fontSize: '12px', color: '#64748b' }}>{formatDate(item.createdAt)}</td>
                <td>
                  <button
                    type="button"
                    className="admin-action-btn danger"
                    onClick={() => handleRemove(item.id)}
                    title="Remover Conteúdo"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
