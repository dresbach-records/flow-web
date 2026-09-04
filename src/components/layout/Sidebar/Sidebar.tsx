import React from 'react';
import {
  Compass,
  FileText,
  HeartHandshake,
  House,
  MessageSquare,
  Radio,
  Settings,
  Shield,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';
import './Sidebar.css';

export interface SidebarProps {
  path?: string;
  go?: (to: string) => void;
}

export default function Sidebar({
  path = window.location.pathname,
  go = (to) => window.location.pathname = to,
}: SidebarProps) {
  const items = [
    { label: 'Início', route: '/app', icon: House, match: (p: string) => p === '/app' },
    { label: 'Explorar', route: '/app/explorar', icon: Compass, match: (p: string) => p.startsWith('/app/explorar') },
    { label: 'Mensagens', route: '/app/mensagens', icon: MessageSquare, match: (p: string) => p.startsWith('/app/mensagens') },
    { label: 'Comunidades', route: '/app/comunidades', icon: Users, match: (p: string) => p.startsWith('/app/comunidades') },
    { label: 'Memorial', route: '/memorial', icon: HeartHandshake, match: (p: string) => p.startsWith('/memorial') },
    { label: 'Creator Center', route: '/app/criador', icon: Sparkles, match: (p: string) => p.startsWith('/app/criador') },
    { label: 'Marketplace', route: '/app/shop', icon: ShoppingBag, match: (p: string) => p.startsWith('/app/shop') },
    { label: 'Configurações', route: '/app/configuracoes', icon: Settings, match: (p: string) => p.startsWith('/app/configuracoes') },
  ];

  return (
    <div className="flow-sidebar">
      <div className="flow-sidebar-brand" onClick={() => go('/app')} style={{ cursor: 'pointer' }}>
        <img src="/flow-logo.svg" alt="FLOW" />
      </div>

      <nav className="flow-sidebar-nav">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = item.match(path);
          return (
            <button
              key={item.route}
              className={`flow-sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => go(item.route)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="flow-sidebar-footer">
        <button
          className="flow-sidebar-item"
          onClick={() => go('/admin')}
          style={{ fontSize: '12px', color: 'var(--flow-text-muted)' }}
        >
          <Shield size={16} />
          <span>Painel Admin</span>
        </button>
      </div>
    </div>
  );
}
