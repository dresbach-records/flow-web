import React, { useState } from 'react';
import { FileText, Video, Eye, Radio, MessageSquare, Trash2, CheckCircle2, Search } from 'lucide-react';

interface ContentItem {
  id: string;
  type: 'post' | 'short' | 'story' | 'live';
  author: string;
  title: string;
  reach: string;
  likes: string;
  comments: string;
  status: 'published' | 'review' | 'flagged';
  date: string;
}

const INITIAL_CONTENT: ContentItem[] = [
  { id: '#CNT-82931', type: 'post', author: '@flow.creator', title: 'Lançamento oficial da nova temporada criativa FLOW', reach: '84.2K', likes: '12.8K', comments: '482', status: 'published', date: 'Hoje, 14:10' },
  { id: '#CNT-82930', type: 'short', author: '@maria.flow', title: 'Dicas de produção de conteúdo mobile em 4K', reach: '142.8K', likes: '21.4K', comments: '913', status: 'published', date: 'Hoje, 12:45' },
  { id: '#CNT-82929', type: 'short', author: '@joao.cria', title: 'Bastidores da criação do novo hit musical', reach: '428K', likes: '58.1K', comments: '2.4K', status: 'flagged', date: 'Hoje, 10:20' },
  { id: '#CNT-82928', type: 'story', author: '@lucas.dev', title: 'Novas ferramentas para desenvolvedores no app', reach: '8.2K', likes: '1.2K', comments: '41', status: 'published', date: 'Ontem, 22:15' },
  { id: '#CNT-82927', type: 'live', author: '@ana.digital', title: 'Live Q&A com os fundadores e comunidade', reach: '34.5K', likes: '9.4K', comments: '1.8K', status: 'published', date: 'Ontem, 19:00' },
];

export const AdminContent: React.FC = () => {
  const [items, setItems] = useState<ContentItem[]>(INITIAL_CONTENT);
  const [filterType, setFilterType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = items.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) || item.author.toLowerCase().includes(search.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleRemove = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setToast(`Conteúdo ${id} foi removido por decisão administrativa.`);
    setTimeout(() => setToast(null), 3000);
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
            {['all', 'post', 'short', 'story', 'live'].map((t) => (
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
              <th>Alcance</th>
              <th>Curtidas</th>
              <th>Comentários</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id}>
                <td>
                  <span style={{ fontWeight: 700 }}>{item.id}</span>
                  <div style={{ fontSize: '11px', color: '#64748b', textTransform: 'uppercase' }}>{item.type}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{item.title}</div>
                  <div style={{ fontSize: '11.5px', color: '#6366f1' }}>{item.author}</div>
                </td>
                <td style={{ fontWeight: 600 }}>{item.reach}</td>
                <td>{item.likes}</td>
                <td>{item.comments}</td>
                <td>
                  <span className={`badge-tag ${item.status === 'published' ? 'novo' : item.status === 'flagged' ? 'alta' : 'media'}`}>
                    {item.status === 'published' ? 'Publicado' : item.status === 'flagged' ? 'Sinalizado' : 'Em Análise'}
                  </span>
                </td>
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
