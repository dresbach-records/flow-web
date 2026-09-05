// FLOW — AdminRH (colaboradores reais + gestão de papéis).
// Diretório a partir de `users` do Firestore; alteração de papel persiste
// (regra: update admin em role) + trilha em `admin_audit`.
// Recrutamento, desempenho, treinamentos e benefícios exigem backend próprio:
// PENDENTES documentados (sem telas fictícias).
import React, { useCallback, useEffect, useState } from 'react';
import { Briefcase, Search, ShieldCheck } from 'lucide-react';
import { listDocuments, updateDocument } from '../../services/firebase/firestore';
import { logAdminAction } from '../../services/firebase/audit';

const MANAGEABLE_ROLES = ['user', 'creator', 'seller', 'moderator', 'admin'] as const;

interface Collaborator {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatar: string;
}

export const AdminRH: React.FC = () => {
  const [rows, setRows] = useState<Collaborator[]>([]);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const docs = await listDocuments<Record<string, unknown>>('users', { max: 200 });
      setRows(
        docs.map((d) => ({
          id: d.id,
          name: (typeof d.displayName === 'string' && d.displayName) || 'Usuário',
          email: (typeof d.email === 'string' && d.email) || '—',
          role: typeof d.role === 'string' ? d.role : 'user',
          status: d.status === 'suspended' ? 'suspended' : 'active',
          avatar: (typeof d.photoURL === 'string' && d.photoURL) || '/logo.png',
        })),
      );
    } catch {
      setLoadError('Não foi possível carregar os colaboradores. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const changeRole = (id: string, name: string, role: string) => {
    const previous = rows;
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, role } : r)));
    void updateDocument('users', id, { role })
      .then(() => {
        showToast(`Papel de ${name} atualizado para ${role}.`);
        void logAdminAction('CHANGE_USER_ROLE', `${name} (${id}) -> ${role}`);
      })
      .catch(() => {
        setRows(previous);
        showToast('Falha ao atualizar papel. Verifique a permissão.');
      });
  };

  const filtered = rows.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  const counts = MANAGEABLE_ROLES.map((role) => ({
    role,
    count: rows.filter((r) => r.role === role).length,
  }));

  return (
    <div>
      <div className="greeting-section">
        <h1 className="greeting-title">
          <Briefcase size={24} color="#6366f1" />
          <span>RH — Colaboradores</span>
        </h1>
        <p className="greeting-subtitle">
          Diretório real de pessoas e gestão de papéis. Recrutamento, desempenho, treinamentos e
          benefícios exigem backend próprio (pendentes — sem telas fictícias).
        </p>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      <div className="admin-metrics-grid" style={{ gridTemplateColumns: 'repeat(5, 1fr)', marginBottom: 20 }}>
        {counts.map((c) => (
          <div className="admin-metric-card" key={c.role}>
            <div className="metric-header">
              <div className="metric-icon-box blue">
                <ShieldCheck size={16} />
              </div>
              <span className="metric-title" style={{ textTransform: 'capitalize' }}>{c.role}</span>
            </div>
            <div className="metric-value">{c.count}</div>
          </div>
        ))}
      </div>

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando colaboradores…</p>}
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
              placeholder="Buscar colaborador..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Colaborador</th>
              <th>Status</th>
              <th>Papel</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filtered.length === 0 && (
              <tr>
                <td colSpan={3} style={{ textAlign: 'center', padding: '32px', color: '#64748b' }}>
                  Nenhum colaborador encontrado.
                </td>
              </tr>
            )}
            {filtered.map((r) => (
              <tr key={r.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={r.avatar} alt={r.name} className="activity-avatar" />
                    <div>
                      <div style={{ fontWeight: 600 }}>{r.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{r.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`badge-tag ${r.status === 'active' ? 'novo' : 'alta'}`}>
                    {r.status === 'active' ? 'Ativo' : 'Suspenso'}
                  </span>
                </td>
                <td>
                  <select
                    className="admin-select"
                    value={MANAGEABLE_ROLES.includes(r.role as (typeof MANAGEABLE_ROLES)[number]) ? r.role : 'user'}
                    onChange={(e) => changeRole(r.id, r.name, e.target.value)}
                  >
                    {MANAGEABLE_ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
