import React, { useEffect, useState } from 'react';
import { AdminSidebar, type AdminRouteId } from './AdminSidebar';
import { AdminTopbar } from './AdminTopbar';
import { getApiBaseUrl } from '../../services/api/client';

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
  const [backendOk, setBackendOk] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    const base = getApiBaseUrl();
    if (!base) {
      setBackendOk(false);
      return;
    }
    const root = base.replace(/\/api\/v1\/?$/, '');
    void fetch(`${root}/health`, { signal: AbortSignal.timeout(8000) })
      .then((res) => {
        if (!cancelled) setBackendOk(res.ok);
      })
      .catch(() => {
        if (!cancelled) setBackendOk(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
          <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: backendOk ? '#10b981' : '#f59e0b', display: 'inline-block' }} />
          <span>{backendOk === null ? 'Verificando backend…' : backendOk ? 'Backend operacional' : 'Backend inacessível'}</span>
        </div>
      </footer>
    </div>
  );
};
