import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  FileText,
  ShieldAlert,
  UsersRound,
  MessageSquare,
  Bell,
  ShoppingBag,
  Calendar,
  BarChart3,
  FileSpreadsheet,
  Settings,
  Lock,
  Sliders,
  Terminal,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  Globe,
} from 'lucide-react';

export type AdminRouteId =
  | 'dashboard'
  | 'usuarios'
  | 'conteudo'
  | 'moderacao'
  | 'comunidades'
  | 'mensagens'
  | 'notificacoes'
  | 'marketplace'
  | 'eventos'
  | 'analytics'
  | 'relatorios'
  | 'configuracoes'
  | 'seguranca'
  | 'sistema'
  | 'logs'
  | 'suporte'
  | 'modulos'
  | 'site';

interface SidebarItem {
  id: AdminRouteId;
  label: string;
  icon: React.ElementType;
  badge?: number | string;
}

interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

const SECTIONS: SidebarSection[] = [
  {
    title: 'VISÃO GERAL',
    items: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
      { id: 'relatorios', label: 'Relatórios', icon: FileSpreadsheet },
    ],
  },
  {
    title: 'MODERAÇÃO & SEGURANÇA',
    items: [
      { id: 'moderacao', label: 'Moderação', icon: ShieldAlert, badge: 12 },
      { id: 'seguranca', label: 'Segurança', icon: Lock },
      { id: 'logs', label: 'Logs de Auditoria', icon: Terminal },
    ],
  },
  {
    title: 'COMUNIDADE & CONTEÚDO',
    items: [
      { id: 'usuarios', label: 'Usuários', icon: Users },
      { id: 'conteudo', label: 'Conteúdo & Mídia', icon: FileText },
      { id: 'comunidades', label: 'Comunidades', icon: UsersRound },
      { id: 'mensagens', label: 'Mensagens', icon: MessageSquare },
      { id: 'notificacoes', label: 'Notificações', icon: Bell },
      { id: 'marketplace', label: 'Marketplace', icon: ShoppingBag },
      { id: 'eventos', label: 'Eventos', icon: Calendar },
    ],
  },
  {
    title: 'SISTEMA & PLATAFORMA',
    items: [
      { id: 'modulos', label: 'Módulos do App', icon: Sliders },
      { id: 'configuracoes', label: 'Configurações', icon: Settings },
      { id: 'site', label: 'Editor do Site', icon: Globe },
      { id: 'suporte', label: 'Suporte', icon: HelpCircle },
    ],
  },
];

interface AdminSidebarProps {
  currentRoute: AdminRouteId;
  onNavigate: (route: AdminRouteId) => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ currentRoute, onNavigate }) => {
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    'COMUNIDADE & CONTEÚDO': false,
    'SISTEMA & PLATAFORMA': false,
  });

  const toggleSection = (title: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <aside className="flow-admin-sidebar">
      {/* Navigation Groups - Colapsáveis por Seção */}
      <nav className="sidebar-nav">
        {SECTIONS.map((sec) => {
          const isCollapsed = Boolean(collapsedSections[sec.title]);
          return (
            <div key={sec.title} className="sidebar-section-group">
              <button
                type="button"
                className="sidebar-section-header"
                onClick={() => toggleSection(sec.title)}
              >
                <span>{sec.title}</span>
                {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
              </button>

              {!isCollapsed && (
                <div className="sidebar-section-items">
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentRoute === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                      >
                        <Icon className="sidebar-nav-icon" />
                        <span className="sidebar-nav-label">{item.label}</span>
                        {item.badge && <span className="sidebar-nav-badge">{item.badge}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
