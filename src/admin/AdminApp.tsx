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
import ModuleCenter from './ModuleCenter';
import SiteEditor from './SiteEditor';

const AdminAppContent: React.FC = () => {
  const { user, loading } = useAdminAuth();
  const [currentRoute, setCurrentRoute] = useState<AdminRouteId>(() => {
    const p = window.location.pathname;
    if (p.includes('/modulos')) return 'modulos';
    if (p.includes('/site')) return 'site';
    if (p.includes('/usuarios')) return 'usuarios';
    if (p.includes('/moderacao') || p.includes('/denuncias')) return 'moderacao';
    if (p.includes('/conteudo') || p.includes('/posts')) return 'conteudo';
    if (p.includes('/analytics')) return 'analytics';
    if (p.includes('/comunidades')) return 'comunidades';
    if (p.includes('/configuracoes')) return 'configuracoes';
    if (p.includes('/logs') || p.includes('/auditoria')) return 'logs';
    if (p.includes('/seguranca')) return 'seguranca';
    return 'dashboard';
  });
  const [searchQuery, setSearchQuery] = useState('');

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname;
      if (p.includes('/modulos')) setCurrentRoute('modulos');
      else if (p.includes('/site')) setCurrentRoute('site');
      else if (p.includes('/usuarios')) setCurrentRoute('usuarios');
      else if (p.includes('/moderacao') || p.includes('/denuncias')) setCurrentRoute('moderacao');
      else if (p.includes('/conteudo') || p.includes('/posts')) setCurrentRoute('conteudo');
      else if (p.includes('/analytics')) setCurrentRoute('analytics');
      else if (p.includes('/comunidades')) setCurrentRoute('comunidades');
      else if (p.includes('/configuracoes')) setCurrentRoute('configuracoes');
      else if (p.includes('/logs') || p.includes('/auditoria')) setCurrentRoute('logs');
      else if (p.includes('/seguranca')) setCurrentRoute('seguranca');
      else setCurrentRoute('dashboard');
    };
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
      {currentRoute === 'usuarios' && <AdminUsers searchQuery={searchQuery} />}
      {currentRoute === 'moderacao' && <AdminModeration />}
      {currentRoute === 'conteudo' && <AdminContent />}
      {currentRoute === 'seguranca' && <AdminSecurity />}
      {currentRoute === 'analytics' && <AdminAnalytics />}
      {currentRoute === 'comunidades' && <AdminCommunities />}
      {currentRoute === 'configuracoes' && <AdminSettings />}
      {currentRoute === 'logs' && <AdminLogs />}
      {currentRoute === 'modulos' && <ModuleCenter />}
      {currentRoute === 'site' && <SiteEditor />}

      {/* Fallback for additional routes */}
      {!['dashboard', 'usuarios', 'moderacao', 'conteudo', 'seguranca', 'analytics', 'comunidades', 'configuracoes', 'logs', 'modulos', 'site'].includes(currentRoute) && (
        <div className="admin-card" style={{ padding: '40px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', textTransform: 'capitalize' }}>
            Módulo: {currentRoute}
          </h2>
          <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 20px auto', fontSize: '13.5px' }}>
            Este painel operacional está conectado à infraestrutura LTS do FLOW Control Center.
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
