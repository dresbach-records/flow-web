import React, { useState } from 'react';
import { Users, Search, Filter, ShieldCheck, UserX, CheckCircle, MoreHorizontal, UserPlus } from 'lucide-react';

interface AdminUsersProps {
  searchQuery?: string;
}

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'creator' | 'seller' | 'admin' | 'moderator';
  status: 'active' | 'suspended' | 'pending';
  followers: string;
  joined: string;
  verified: boolean;
  avatar: string;
}

const INITIAL_USERS: UserItem[] = [
  {
    id: 'USR-1024',
    name: 'Flow Creator Oficial',
    email: 'creator@flow.social',
    role: 'creator',
    status: 'active',
    followers: '128.4K',
    joined: '02/08/2026',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'USR-1023',
    name: 'Maria Santos',
    email: 'maria.santos@email.com',
    role: 'user',
    status: 'active',
    followers: '84.2K',
    joined: '01/08/2026',
    verified: true,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'USR-1022',
    name: 'João Silva',
    email: 'joao.silva@tech.io',
    role: 'creator',
    status: 'active',
    followers: '57.8K',
    joined: '31/07/2026',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'USR-1021',
    name: 'Ana Costa',
    email: 'ana.costa@empresa.com',
    role: 'seller',
    status: 'pending',
    followers: '21.1K',
    joined: '29/07/2026',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'USR-1020',
    name: 'Lucas Rocha',
    email: 'lucas.rocha@dev.br',
    role: 'user',
    status: 'active',
    followers: '18.7K',
    joined: '28/07/2026',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face',
  },
  {
    id: 'USR-1019',
    name: 'Beatriz Lima',
    email: 'bia.music@som.art',
    role: 'creator',
    status: 'suspended',
    followers: '9.4K',
    joined: '25/07/2026',
    verified: false,
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face',
  },
];

export const AdminUsers: React.FC<AdminUsersProps> = ({ searchQuery = '' }) => {
  const [users, setUsers] = useState<UserItem[]>(INITIAL_USERS);
  const [localSearch, setLocalSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [toast, setToast] = useState<string | null>(null);

  const query = (searchQuery || localSearch).toLowerCase();

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query) ||
      u.id.toLowerCase().includes(query);
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === 'active' ? 'suspended' : 'active';
          showToast(`Status do usuário ${u.name} alterado para ${nextStatus === 'active' ? 'Ativo' : 'Suspenso'}.`);
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const handleToggleVerify = (id: string) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          showToast(`Selo de verificação ${!u.verified ? 'atribuído a' : 'removido de'} ${u.name}.`);
          return { ...u, verified: !u.verified };
        }
        return u;
      })
    );
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
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
              <th>Seguidores</th>
              <th>Data Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
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
                  <span className={`badge-tag ${u.status === 'active' ? 'novo' : u.status === 'suspended' ? 'alta' : 'media'}`}>
                    {u.status === 'active' ? 'Ativo' : u.status === 'suspended' ? 'Suspenso' : 'Em Análise'}
                  </span>
                </td>

                <td style={{ fontWeight: 600 }}>{u.followers}</td>
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
