import React, { useState } from 'react';
import { UsersRound, Search, ShieldCheck, Archive, Star, CheckCircle } from 'lucide-react';

interface CommunityItem {
  id: string;
  name: string;
  slug: string;
  members: string;
  category: string;
  status: 'active' | 'archived' | 'review';
  verified: boolean;
  featured: boolean;
}

const INITIAL_COMMUNITIES: CommunityItem[] = [
  { id: '#COM-101', name: 'Criadores & Tech Brasil', slug: '@comunidade.tech', members: '48.2K', category: 'Tecnologia', status: 'active', verified: true, featured: true },
  { id: '#COM-102', name: 'Música & Batidas Urbanas', slug: '@comunidade.musica', members: '36.8K', category: 'Música & Arte', status: 'active', verified: true, featured: false },
  { id: '#COM-103', name: 'Empreendedorismo Digital', slug: '@comunidade.empreender', members: '24.1K', category: 'Negócios', status: 'active', verified: false, featured: true },
  { id: '#COM-104', name: 'Designers & Motion Makers', slug: '@comunidade.design', members: '18.7K', category: 'Design', status: 'active', verified: true, featured: false },
  { id: '#COM-105', name: 'Games & Transmissões', slug: '@comunidade.games', members: '15.4K', category: 'Games', status: 'review', verified: false, featured: false },
];

export const AdminCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityItem[]>(INITIAL_COMMUNITIES);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.slug.toLowerCase().includes(search.toLowerCase()) ||
    c.category.toLowerCase().includes(search.toLowerCase())
  );

  const toggleArchive = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: c.status === 'active' ? 'archived' : 'active' } : c))
    );
    setToast('Status da comunidade atualizado.');
    setTimeout(() => setToast(null), 3000);
  };

  const toggleVerify = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, verified: !c.verified } : c))
    );
    setToast('Selo de comunidade oficial atualizado.');
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <UsersRound size={24} color="#6366f1" />
          <span>Gestão de Comunidades</span>
        </h1>
        <p className="greeting-subtitle">
          Supervisão de grupos públicos e privados, membros, canais e moderação comunitária.
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
              placeholder="Buscar comunidade ou categoria..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Comunidade</th>
              <th>Categoria</th>
              <th>Membros</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{c.name}</strong>
                    {c.verified && <CheckCircle size={14} color="#6366f1" fill="#e0e7ff" />}
                    {c.featured && <Star size={13} color="#f59e0b" fill="#fef3c7" />}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{c.slug} • {c.id}</div>
                </td>
                <td>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>{c.category}</span>
                </td>
                <td style={{ fontWeight: 700 }}>{c.members}</td>
                <td>
                  <span className={`badge-tag ${c.status === 'active' ? 'novo' : c.status === 'archived' ? 'baixa' : 'media'}`}>
                    {c.status === 'active' ? 'Ativa' : c.status === 'archived' ? 'Arquivada' : 'Sob Análise'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => toggleVerify(c.id)}
                      title="Selo de Verificação"
                    >
                      <ShieldCheck size={14} />
                    </button>
                    <button
                      type="button"
                      className="admin-action-btn danger"
                      onClick={() => toggleArchive(c.id)}
                      title={c.status === 'active' ? 'Arquivar Comunidade' : 'Desarquivar Comunidade'}
                    >
                      <Archive size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
