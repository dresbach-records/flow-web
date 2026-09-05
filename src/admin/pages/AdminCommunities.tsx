// FLOW — AdminCommunities (FASE 6: dados reais).
// Gestão sobre `communities` do Firestore. Selo/arquivamento persistem de verdade
// (regra: update admin só em verified/status/featured) + trilha em `admin_audit`.
import React, { useCallback, useEffect, useState } from 'react';
import { UsersRound, Search, ShieldCheck, Archive, CheckCircle } from 'lucide-react';
import { getDocument, updateDocument } from '../../services/firebase/firestore';
import { listCommunities } from '../../services/firebase/communities';
import { logAdminAction } from '../../services/firebase/audit';
import type { Community } from '../../services/firebase/communities';

type CommunityStatus = 'active' | 'archived' | 'review';

interface CommunityRow extends Community {
  verified: boolean;
  status: CommunityStatus;
  featured: boolean;
}

export const AdminCommunities: React.FC = () => {
  const [communities, setCommunities] = useState<CommunityRow[]>([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const items = await listCommunities(100);
      const rows: CommunityRow[] = await Promise.all(
        items.map(async (c) => {
          const full = await getDocument<Record<string, unknown>>('communities', c.id).catch(() => null);
          return {
            ...c,
            verified: full?.verified === true,
            status: ((full?.status as CommunityStatus) || 'active'),
            featured: full?.featured === true,
          };
        }),
      );
      setCommunities(rows);
    } catch {
      setLoadError('Não foi possível carregar as comunidades. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const filtered = communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    (c.description ?? '').toLowerCase().includes(search.toLowerCase())
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const patch = (id: string, data: Partial<Pick<CommunityRow, 'verified' | 'status'>>, action: string, okMsg: string) => {
    const previous = communities;
    setCommunities((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    void updateDocument('communities', id, data)
      .then(() => {
        showToast(okMsg);
        void logAdminAction(action, `Community ${id}`);
      })
      .catch(() => {
        setCommunities(previous);
        showToast('Falha ao atualizar. Verifique a permissão.');
      });
  };

  const toggleArchive = (id: string) => {
    const target = communities.find((c) => c.id === id);
    if (!target) return;
    const next: CommunityStatus = target.status === 'active' ? 'archived' : 'active';
    patch(id, { status: next }, next === 'archived' ? 'ARCHIVE_COMMUNITY' : 'UNARCHIVE_COMMUNITY', 'Status da comunidade atualizado.');
  };

  const toggleVerify = (id: string) => {
    const target = communities.find((id2) => id2.id === id);
    if (!target) return;
    patch(id, { verified: !target.verified }, target.verified ? 'UNVERIFY_COMMUNITY' : 'VERIFY_COMMUNITY', 'Selo de comunidade oficial atualizado.');
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

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando comunidades…</p>}
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
              placeholder="Buscar comunidade..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Comunidade</th>
              <th>Membros</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhuma comunidade encontrada.
                </td>
              </tr>
            )}
            {filtered.map((c) => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <strong>{c.name}</strong>
                    {c.verified && <CheckCircle size={14} color="#6366f1" fill="#e0e7ff" />}
                  </div>
                  <div style={{ fontSize: '11.5px', color: '#64748b' }}>{c.id}</div>
                </td>
                <td style={{ fontWeight: 700 }}>{(c.memberCount ?? 0).toLocaleString('pt-BR')}</td>
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
