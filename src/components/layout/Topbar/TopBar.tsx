import React, { useState } from 'react';
import { Bell, Bookmark, House, Mail, MessageSquare, Plus, Search, User } from 'lucide-react';
import { useAppContext } from '../../../contexts/AppContext';
import './TopBar.css';

export interface TopBarProps {
  go?: (to: string) => void;
  onMenuClick?: () => void;
}

export default function TopBar({ go = (to) => window.location.pathname = to }: TopBarProps) {
  const { user } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      go(`/app/busca?q=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  return (
    <div className="flow-topbar">
      <div className="flow-topbar-left">
        <form className="flow-topbar-search-form" onSubmit={handleSearch}>
          <Search size={18} className="flow-topbar-search-icon" />
          <input
            type="search"
            className="flow-topbar-search-input"
            placeholder="Pesquisar no Flow..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <div className="flow-topbar-right">
        <button
          className="flow-topbar-create-btn"
          onClick={() => go('/app/criar')}
          aria-label="Criar publicação"
        >
          <Plus size={18} />
          <span>Criar</span>
        </button>

        <button
          className="flow-topbar-icon-btn"
          onClick={() => go('/app/mensagens')}
          aria-label="Mensagens"
        >
          <MessageSquare size={20} />
        </button>

        <button
          className="flow-topbar-icon-btn"
          onClick={() => go('/app/notificacoes')}
          aria-label="Notificações"
        >
          <Bell size={20} />
          <span className="flow-topbar-badge-dot" />
        </button>

        <button
          className="flow-topbar-icon-btn"
          onClick={() => go('/app/salvos')}
          aria-label="Itens salvos"
        >
          <Bookmark size={20} />
        </button>

        <div
          className="flow-topbar-user-chip"
          onClick={() => go('/app/perfil')}
          role="button"
          tabIndex={0}
        >
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'Usuário'} className="flow-topbar-avatar" />
          ) : (
            <div className="flow-topbar-avatar" style={{ background: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={16} color="#64748B" />
            </div>
          )}
          <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--flow-text)' }}>
            {user?.displayName ? user.displayName.split(' ')[0] : 'Perfil'}
          </span>
        </div>
      </div>
    </div>
  );
}
