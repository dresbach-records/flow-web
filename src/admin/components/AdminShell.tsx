import React from 'react';
import { AdminSidebar, type AdminRouteId } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';

interface AdminShellProps {
  currentRoute: AdminRouteId;
  onNavigate: (route: AdminRouteId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  children: React.ReactNode;
}

export const AdminShell: React.FC<AdminShellProps> = ({
  currentRoute,
  onNavigate,
  searchQuery,
  onSearchChange,
  children,
}) => {
  return (
    <div className="flow-admin-root">
      {/* 1. Fixed Full-Width Topbar com Logo oficial FLOW */}
      <AdminTopbar searchQuery={searchQuery} onSearchChange={onSearchChange} />

      {/* 2. Fixed Left Sidebar (inicia abaixo do cabeçalho fixo e corre até o rodapé fino) */}
      <AdminSidebar currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* 3. Main Content Viewport */}
      <div className="flow-admin-main">
        {/* Dynamic Page Content */}
        <main className="flow-admin-content">{children}</main>
      </div>

      {/* 4. Rodapé Fino Fixo no fim da página com nome da rede social e versão */}
      <footer className="admin-slim-footer">
        <div className="slim-footer-left">
          <strong>FLOW Social</strong>
          <span className="slim-footer-dot">•</span>
          <span>Painel de Controle Administrativo</span>
        </div>

        <div className="slim-footer-center">
          <span className="slim-footer-version">LTS v1.0.0</span>
          <span className="slim-footer-dot">•</span>
          <span>Todos os direitos reservados</span>
        </div>

        <div className="slim-footer-right">
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10b981', display: 'inline-block' }} />
          <span>Sistema operacional</span>
        </div>
      </footer>
    </div>
  );
};
