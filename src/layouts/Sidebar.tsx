/**
 * FLOW — Sidebar
 * Navegação lateral persistente (Desktop).
 * Colapsável entre 260px (expandida) e 72px (ícones).
 */
import React from 'react';
import {
  Bookmark,
  Bell,
  ChevronLeft,
  Compass,
  House,
  LogOut,
  Mail,
  Moon,
  Music2,
  Plus,
  Settings,
  Shield,
  Sun,
  UserRound,
  Users,
  Video,
  HeartHandshake,
} from 'lucide-react';
import { useAppContext } from '../contexts/AppContext';
import { logout } from '../services/firebase/auth';

interface SidebarProps {
  path: string;
  go: (to: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
  mobileOpen?: boolean;
}

interface NavItem {
  icon: React.ReactNode;
  label: string;
  route?: string;
  action?: () => void;
  match?: (path: string) => boolean;
  dividerBefore?: boolean;
}


export default function Sidebar({
  path,
  go,
  collapsed,
  onToggleCollapse,
  onCloseMobile,
  mobileOpen,
}: SidebarProps) {
  const { user } = useAppContext();



  const navItems: NavItem[] = [
    {
      icon: <House size={20} />,
      label: 'Início',
      route: '/app',
      match: (p) => p === '/app' || p === '/app/for-you' || p === '/app/seguindo',
    },
    {
      icon: <Compass size={20} />,
      label: 'Explorar',
      route: '/app/explorar',
      match: (p) => p.startsWith('/app/explorar'),
    },
    {
      icon: <Video size={20} />,
      label: 'Shorts',
      route: '/app/shorts',
      match: (p) => p.startsWith('/app/shorts'),
    },
    {
      icon: <Music2 size={20} />,
      label: 'Música',
      route: '/app/musica',
      match: (p) => p.startsWith('/app/musica'),
    },
    {
      icon: <Mail size={20} />,
      label: 'Mensagens',
      route: '/app/mensagens',
      match: (p) => p.startsWith('/app/mensagens'),
    },
    {
      icon: <Bell size={20} />,
      label: 'Notificações',
      route: '/app/notificacoes',
      match: (p) => p.startsWith('/app/notificacoes'),
    },
    {
      icon: <Users size={20} />,
      label: 'Comunidades',
      route: '/app/comunidades',
      match: (p) => p.startsWith('/app/comunidades'),
    },
    {
      icon: <UserRound size={20} />,
      label: 'Perfil',
      route: '/app/perfil',
      match: (p) => p.startsWith('/app/perfil'),
      dividerBefore: true,
    },
    {
      icon: <Bookmark size={20} />,
      label: 'Salvos',
      route: '/app/salvos',
      match: (p) => p.startsWith('/app/salvos'),
    },
    {
      icon: <Shield size={20} />,
      label: 'Segurança',
      route: '/app/seguranca',
      match: (p) => p.startsWith('/app/seguranca'),
    },
    {
      icon: <Settings size={20} />,
      label: 'Configurações',
      route: '/app/configuracoes',
      match: (p) => p.startsWith('/app/configuracoes'),
    },
    {
      icon: <HeartHandshake size={20} />,
      label: 'Memorial',
      route: '/memorial',
      match: (p) => p.includes('memorial'),
    },
  ];

  const navigate = (to: string) => {
    go(to);
    onCloseMobile?.();
  };

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          className="flow-mobile-overlay"
          aria-label="Fechar menu"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={[
          'flow-sidebar',
          collapsed ? 'is-collapsed' : '',
          mobileOpen ? 'is-mobile-open' : '',
        ].join(' ')}
        role="navigation"
        aria-label="Menu principal"
      >
        {/* Brand */}
        <button
          className="flow-sidebar-brand"
          style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
          onClick={() => navigate('/app')}
          aria-label="FLOW — Início"
        >
          <img
            src={collapsed ? "/flow-assets-svg/brand/flow-logo-symbol.svg" : "/flow-assets-svg/brand/flow-logo.svg"}
            alt="FLOW"
            style={{ height: 36, width: collapsed ? 36 : 'auto', maxHeight: 36, objectFit: 'contain' }}
          />
        </button>

        {/* Create button */}
        <div style={{ padding: 'var(--flow-space-3) var(--flow-space-2)', borderBottom: '1px solid var(--flow-color-border-subtle)' }}>
          <button
            className="flow-sidebar-item"
            style={{ background: 'var(--flow-gradient-brand)', color: '#fff', borderRadius: 'var(--flow-radius-md)', justifyContent: collapsed ? 'center' : 'flex-start' }}
            onClick={() => navigate('/app/criar')}
          >
            <Plus size={20} />
            <span className="label" style={{ fontWeight: 700 }}>Criar</span>
          </button>
        </div>

        {/* Nav */}
        <nav className="flow-sidebar-nav" aria-label="Navegação">
          {navItems.map((item) => {
            if (!item.route && !item.action) return null;
            const isActive = item.match ? item.match(path) : path === item.route;
            return (
              <React.Fragment key={item.label}>
                {item.dividerBefore && <div className="flow-sidebar-divider" />}
                <button
                  className={`flow-sidebar-item ${isActive ? 'active' : ''}`}
                  onClick={() => item.route ? navigate(item.route) : item.action?.()}
                  aria-current={isActive ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  {item.icon}
                  <span className="label">{item.label}</span>
                </button>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="flow-sidebar-footer">
          {/* Status dot */}
          <div className="flow-sidebar-status">
            <span className="flow-status-dot" />
            <span>Online</span>
          </div>



          {/* Logout */}
          <button
            className="flow-sidebar-item"
            onClick={() => void logout()}
            title={collapsed ? 'Sair' : undefined}
          >
            <LogOut size={20} />
            <span className="label">Sair</span>
          </button>

          {/* User chip */}
          {user && !collapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--flow-space-2)',
              padding: 'var(--flow-space-3)',
              borderRadius: 'var(--flow-radius-md)',
              background: 'var(--flow-color-bg)',
              marginTop: 'var(--flow-space-1)',
            }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'var(--flow-gradient-brand)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0, overflow: 'hidden',
              }}>
                {user.photoURL
                  ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : (user.displayName?.[0]?.toUpperCase() ?? <UserRound size={16} />)}
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--flow-color-text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.displayName ?? 'Usuário'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--flow-color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.email}
                </div>
              </div>
            </div>
          )}

          {/* Collapse toggle — desktop only */}
          <button
            className="flow-sidebar-collapse-btn"
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expandir menu' : 'Colapsar menu'}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      </aside>
    </>
  );
}
