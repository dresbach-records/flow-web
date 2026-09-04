/**
 * FLOW — Topbar
 * Cabeçalho em largura total com logo oficial à esquerda.
 *
 * Layout:
 *   ┌──────────────────────────────────────────────────────┐
 *   │ [   LOGO   ] │  🔍 Busca          [+][✉][🔔][avatar] │
 *   └──────────────────────────────────────────────────────┘
 *     ↑ alinhado    ↑ resto do cabeçalho
 *     à sidebar
 */
import { Bell, Mail, Menu, Plus, Search, UserRound } from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';

interface TopbarProps {
  onMenuClick: () => void;
  go: (to: string) => void;
  collapsed?: boolean;
}

export default function Topbar({ onMenuClick, go, collapsed }: TopbarProps) {
  const { user } = useAppContext();

  return (
    <header className="flow-topbar" role="banner">

      {/* ── Slot do logo — mesma largura da sidebar ── */}
      <div className="flow-topbar-logo">
        <button
          className="flow-topbar-logo-btn"
          onClick={() => go('/app')}
          aria-label="FLOW — Início"
        >
          <img
            src="/logo.png"
            alt="Flow — Conecte, Compartilhe, Viva"
          />
        </button>
      </div>

      {/* ── Centro: busca + ações ── */}
      <div className="flow-topbar-center">

        {/* Mobile: botão hambúrguer */}
        <button
          className="flow-topbar-btn flow-topbar-menu-btn"
          aria-label="Abrir menu"
          onClick={onMenuClick}
          id="topbar-menu-btn"
        >
          <Menu size={22} />
        </button>

        {/* Busca global */}
        <label className="flow-topbar-search" aria-label="Pesquisar no FLOW">
          <Search size={16} aria-hidden="true" />
          <input
            type="search"
            placeholder="Pesquisar no FLOW…"
            id="topbar-search-input"
            aria-label="Campo de busca"
          />
        </label>

        <span className="flow-topbar-spacer" />

        {/* Ações */}
        <div className="flow-topbar-actions">
          <button
            className="flow-topbar-btn"
            aria-label="Criar publicação"
            onClick={() => go('/app/criar')}
            id="topbar-create-btn"
            title="Criar"
          >
            <Plus size={20} />
          </button>

          <button
            className="flow-topbar-btn"
            aria-label="Mensagens"
            onClick={() => go('/app/mensagens')}
            id="topbar-messages-btn"
            title="Mensagens"
          >
            <Mail size={20} />
          </button>

          <button
            className="flow-topbar-btn"
            aria-label="Notificações"
            onClick={() => go('/app/notificacoes')}
            id="topbar-notifications-btn"
            title="Notificações"
          >
            <Bell size={20} />
            <span className="flow-topbar-badge" aria-label="3 notificações">3</span>
          </button>

          <button
            className="flow-topbar-avatar"
            aria-label="Meu perfil"
            onClick={() => go('/app/perfil')}
            id="topbar-avatar-btn"
            title={user?.displayName ?? 'Perfil'}
          >
            {user?.photoURL
              ? <img src={user.photoURL} alt={user.displayName ?? 'Avatar'} />
              : (user?.displayName?.[0]?.toUpperCase() ?? <UserRound size={18} />)}
          </button>
        </div>
      </div>
    </header>
  );
}
