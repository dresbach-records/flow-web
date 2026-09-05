// FLOW — AdminUsers (FASE 6: dados reais).
// Lista `users` do Firestore (regra: list só admin). Suspensão/verificação
// persistem de verdade + trilha em `admin_audit`. Sem usuários fictícios.
import React, { useCallback, useEffect, useState } from 'react';
import { Users, Search, Filter, ShieldCheck, UserX, CheckCircle } from 'lucide-react';
import { listDocuments, updateDocument } from '../../services/firebase/firestore';
import { logAdminAction } from '../../services/firebase/audit';

interface AdminUsersProps {
  searchQuery?: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended' | 'pending';
  joined: string;
  verified: boolean;
  avatar: string;
}

function formatDate(createdAt: unknown): string {
  try {
    const ts = createdAt as { toDate?: () => Date };
    if (ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleDateString('pt-BR');
    }
  } catch {
    /* sem data */
  }
  return '—';
}

export const AdminUsers: React.FC<AdminUsersProps> = ({ searchQuery = '' }) => {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [localSearch, setLocalSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const docs = await listDocuments<Record<string, unknown>>('users', { max: 100 });
      setUsers(
        docs.map((d) => ({
          id: d.id,
          name: (typeof d.displayName === 'string' && d.displayName) || 'Usuário',
          email: (typeof d.email === 'string' && d.email) || '—',
          role: typeof d.role === 'string' ? d.role : 'user',
          status: d.status === 'suspended' ? 'suspended' : 'active',
          joined: formatDate(d.createdAt),
          verified: d.verified === true,
          avatar: (typeof d.photoURL === 'string' && d.photoURL) || '/logo.png',
        })),
      );
    } catch {
      setLoadError('Não foi possível carregar os usuários. Conta sem permissão ou sem conexão.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  const query = (searchQuery || localSearch).toLowerCase();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    const nextStatus = target.status === 'active' ? 'suspended' : 'active';
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: nextStatus } : u)));
    void updateDocument('users', id, { status: nextStatus })
      .then(() => {
        showToast(`Status de ${target.name} alterado para ${nextStatus === 'active' ? 'Ativo' : 'Suspenso'}.`);
        void logAdminAction(nextStatus === 'active' ? 'REACTIVATE_USER' : 'SUSPEND_USER', `${target.name} (${id})`);
      })
      .catch(() => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status: target.status } : u)));
        showToast('Falha ao alterar status. Verifique a permissão.');
      });
  };

  const handleToggleVerify = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (!target) return;
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verified: !u.verified } : u)));
    void updateDocument('users', id, { verified: !target.verified })
      .then(() => {
        showToast(`Selo de verificação ${!target.verified ? 'atribuído a' : 'removido de'} ${target.name}.`);
        void logAdminAction(!target.verified ? 'VERIFY_USER' : 'UNVERIFY_USER', `${target.name} (${id})`);
      })
      .catch(() => {
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, verified: target.verified } : u)));
        showToast('Falha ao alterar verificação. Verifique a permissão.');
      });
  };

  return (
    <div>
      <div className="greeting-section" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="greeting-title">
            <Users size={24} color="#6366f1" />
            <span>Gestão de Usuários</span>
          </h1>
          <p className="greeting-subtitle">
            Controle de contas, papéis, verificação e integridade da base de usuários FLOW.
          </p>
        </div>
      </div>

      {toast && (
        <div style={{ padding: '10px 16px', background: '#dcfce7', color: '#15803d', borderRadius: '10px', marginBottom: '16px', fontSize: '13px', fontWeight: 600 }}>
          ✓ {toast}
        </div>
      )}

      {loading && <p style={{ color: '#64748b', fontSize: 13 }}>Carregando usuários…</p>}
      {!loading && loadError && (
        <div style={{ padding: '12px 16px', background: '#fef2f2', color: '#b91c1c', borderRadius: '10px', marginBottom: '16px', fontSize: '13px' }}>
          {loadError} <button type="button" onClick={() => reload()} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}>Tentar novamente</button>
        </div>
      )}

      <div className="admin-table-container">
        <div className="admin-table-toolbar">
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flex: 1, maxWidth: '400px' }}>
            <div className="topbar-search-wrapper" style={{ width: '100%' }}>
              <Search className="topbar-search-icon" />
              <input
                type="text"
                className="topbar-search-input"
                placeholder="Buscar por nome, e-mail ou ID..."
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Filter size={16} color="#64748b" />
            <select
              className="admin-select"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="all">Todos os Papéis</option>
              <option value="user">Usuários</option>
              <option value="creator">Criadores</option>
              <option value="seller">Lojistas</option>
            </select>
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Usuário</th>
              <th>Papel</th>
              <th>Status</th>
              <th>Data Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {!loading && !loadError && filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  <CheckCircle size={32} color="#10b981" style={{ margin: '0 auto 8px auto', display: 'block' }} />
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
            {filteredUsers.map((u) => (
              <tr key={u.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img src={u.avatar} alt={u.name} className="activity-avatar" />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                        <span>{u.name}</span>
                        {u.verified && <CheckCircle size={14} color="#6366f1" fill="#e0e7ff" />}
                      </div>
                      <div style={{ fontSize: '11.5px', color: '#64748b' }}>{u.email} • {u.id}</div>
                    </div>
                  </div>
                </td>

                <td>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      backgroundColor: u.role === 'creator' ? '#faf5ff' : u.role === 'seller' ? '#fff7ed' : '#eff6ff',
                      color: u.role === 'creator' ? '#9333ea' : u.role === 'seller' ? '#ea580c' : '#2563eb',
                    }}
                  >
                    {u.role}
                  </span>
                </td>

                <td>
                  <span className={`badge-tag ${u.status === 'active' ? 'novo' : 'alta'}`}>
                    {u.status === 'active' ? 'Ativo' : 'Suspenso'}
                  </span>
                </td>

                <td style={{ color: '#64748b', fontSize: '12px' }}>{u.joined}</td>

                <td>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      className="admin-action-btn"
                      onClick={() => handleToggleVerify(u.id)}
                      title={u.verified ? 'Remover verificação' : 'Verificar conta'}
                    >
                      <ShieldCheck size={14} />
                    </button>
                    <button
                      type="button"
                      className={`admin-action-btn ${u.status === 'active' ? 'danger' : ''}`}
                      onClick={() => handleToggleStatus(u.id)}
                      title={u.status === 'active' ? 'Suspender usuário' : 'Reativar usuário'}
                    >
                      <UserX size={14} />
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
