import React, { useState, useEffect } from 'react';
import './styles/admin.css';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';
import { AdminLogin } from './components/AdminLogin';
import { AdminShell } from './components/AdminShell';
import type { AdminRouteId } from './components/AdminSidebar';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminUsers } from './pages/AdminUsers';
import { AdminModeration } from './pages/AdminModeration';
import { AdminContent } from './pages/AdminContent';
import { AdminSecurity } from './pages/AdminSecurity';
import { AdminAnalytics } from './pages/AdminAnalytics';
import { AdminCommunities } from './pages/AdminCommunities';
import { AdminSettings } from './pages/AdminSettings';
import { AdminLogs } from './pages/AdminLogs';
import { AdminMessages } from './pages/AdminMessages';
import { AdminNotifications } from './pages/AdminNotifications';
import { AdminMemorial } from './pages/AdminMemorial';
import { AdminRH } from './pages/AdminRH';
import { AdminRelatorios } from './pages/AdminRelatorios';
import { AdminSistema } from './pages/AdminSistema';
import { AdminSuporte } from './pages/AdminSuporte';
import { PermissionGuard } from './components/PermissionGuard';
import ModuleCenter from './ModuleCenter';
import SiteEditor from './SiteEditor';

function resolveRoute(p: string): AdminRouteId {
  if (p.includes('/modulos')) return 'modulos';
  if (p.includes('/site')) return 'site';
  if (p.includes('/usuarios')) return 'usuarios';
  if (p.includes('/moderacao') || p.includes('/denuncias')) return 'moderacao';
  if (p.includes('/conteudo') || p.includes('/posts')) return 'conteudo';
  if (p.includes('/analytics')) return 'analytics';
  if (p.includes('/comunidades')) return 'comunidades';
  if (p.includes('/mensagens')) return 'mensagens';
  if (p.includes('/notificacoes')) return 'notificacoes';
  if (p.includes('/memorial')) return 'memorial';
  if (p.includes('/rh') || p.includes('/colaboradores')) return 'rh';
  if (p.includes('/marketplace') || p.includes('/lojas')) return 'marketplace';
  if (p.includes('/eventos')) return 'eventos';
  if (p.includes('/relatorios')) return 'relatorios';
  if (p.includes('/sistema')) return 'sistema';
  if (p.includes('/suporte')) return 'suporte';
  if (p.includes('/configuracoes')) return 'configuracoes';
  if (p.includes('/logs') || p.includes('/auditoria')) return 'logs';
  if (p.includes('/seguranca')) return 'seguranca';
  return 'dashboard';
}

const AdminAppContent: React.FC = () => {
  const { user, loading } = useAdminAuth();
  const [currentRoute, setCurrentRoute] = useState<AdminRouteId>(() => resolveRoute(window.location.pathname));
  const [searchQuery, setSearchQuery] = useState('');

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => setCurrentRoute(resolveRoute(window.location.pathname));
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (route: AdminRouteId) => {
    setCurrentRoute(route);
    const targetPath = route === 'dashboard' ? '/admin' : `/admin/${route}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f8fafc',
          fontFamily: 'sans-serif',
          color: '#6366f1',
          gap: '12px',
        }}
      >
        <div style={{ width: 24, height: 24, border: '3px solid #e2e8f0', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <span style={{ fontWeight: 600, color: '#0f172a' }}>Carregando FLOW Admin...</span>
      </div>
    );
  }

  // Not logged in -> Show Firebase-integrated Admin Login
  if (!user) {
    return <AdminLogin />;
  }

  return (
    <AdminShell
      currentRoute={currentRoute}
      onNavigate={handleNavigate}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      {currentRoute === 'dashboard' && <AdminDashboard onNavigate={handleNavigate} />}
      {currentRoute === 'usuarios' && (
        <PermissionGuard allow={['admin', 'superadmin']}>
          <AdminUsers searchQuery={searchQuery} />
        </PermissionGuard>
      )}
      {currentRoute === 'moderacao' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminModeration />
        </PermissionGuard>
      )}
      {currentRoute === 'conteudo' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminContent />
        </PermissionGuard>
      )}
      {currentRoute === 'seguranca' && <AdminSecurity />}
      {currentRoute === 'analytics' && <AdminAnalytics />}
      {currentRoute === 'comunidades' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminCommunities />
        </PermissionGuard>
      )}
      {currentRoute === 'mensagens' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminMessages />
        </PermissionGuard>
      )}
      {currentRoute === 'notificacoes' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminNotifications />
        </PermissionGuard>
      )}
      {currentRoute === 'memorial' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminMemorial />
        </PermissionGuard>
      )}
      {currentRoute === 'rh' && (
        <PermissionGuard allow={['admin', 'superadmin']}>
          <AdminRH />
        </PermissionGuard>
      )}
      {currentRoute === 'relatorios' && <AdminRelatorios />}
      {currentRoute === 'sistema' && <AdminSistema />}
      {currentRoute === 'suporte' && (
        <PermissionGuard allow={['admin', 'superadmin', 'moderator']}>
          <AdminSuporte />
        </PermissionGuard>
      )}
      {currentRoute === 'configuracoes' && (
        <PermissionGuard allow={['admin', 'superadmin']}>
          <AdminSettings />
        </PermissionGuard>
      )}
      {currentRoute === 'logs' && (
        <PermissionGuard allow={['admin', 'superadmin']}>
          <AdminLogs />
        </PermissionGuard>
      )}
      {currentRoute === 'modulos' && (
        <PermissionGuard allow={['admin', 'superadmin']}>
          <ModuleCenter />
        </PermissionGuard>
      )}
      {currentRoute === 'site' && (
        <PermissionGuard allow={['admin', 'superadmin']}>
          <SiteEditor />
        </PermissionGuard>
      )}

      {/* Rotas sem backend (marketplace, eventos): PENDENTE honesto, sem tela fictícia. */}
      {(currentRoute === 'marketplace' || currentRoute === 'eventos') && (
        <div className="admin-card" style={{ padding: '48px 24px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', textTransform: 'capitalize' }}>
            {currentRoute === 'marketplace' ? 'Marketplace' : 'Eventos'}
          </h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 20px auto', fontSize: '13.5px' }}>
            Módulo pendente: sem backend e sem persistência (Fase 9). Nenhum dado é exibido até a
            implementação ponta a ponta, conforme a REGRA DE CONCLUSÃO FLOW.
          </p>
          <button
            type="button"
            className="admin-submit-btn"
            style={{ width: 'auto', margin: '0 auto' }}
            onClick={() => handleNavigate('dashboard')}
          >
            Retornar ao Dashboard Principal
          </button>
        </div>
      )}
    </AdminShell>
  );
};

export default function AdminApp() {
  return (
    <AdminAuthProvider>
      <AdminAppContent />
    </AdminAuthProvider>
  );
}
