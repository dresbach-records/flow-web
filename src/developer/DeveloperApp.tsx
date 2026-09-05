// FLOW — DeveloperApp (Painel do Desenvolvedor, dados reais).
// Áreas com backend/dados: dashboard, APIs+tester, Firebase, logs, ambientes, docs.
// Filas, webhooks, OTel, RabbitMQ, deploys: sem backend — PENDENTE (sem telas fictícias).
import React, { useState } from 'react';
import { Activity, FlaskConical, Flame, ScrollText, Settings2, BookOpen } from 'lucide-react';
import { AdminAuthProvider, useAdminAuth } from '../admin/context/AdminAuthContext';
import { AdminLogin } from '../admin/components/AdminLogin';
import LoadingState from '../components/ui/LoadingState';
import DeveloperDashboard from './pages/DeveloperDashboard';
import DeveloperApis from './pages/DeveloperApis';
import DeveloperSystem from './pages/DeveloperSystem';
import DeveloperLogs from './pages/DeveloperLogs';
import DeveloperDocs from './pages/DeveloperDocs';
import './developer.css';

export type DeveloperRoute = 'dashboard' | 'apis' | 'system' | 'logs' | 'envs' | 'docs';

export function developerRouteForPath(path: string): DeveloperRoute {
  if (path.startsWith('/developer/apis')) return 'apis';
  if (path.startsWith('/developer/firebase') || path.startsWith('/developer/system')) return 'system';
  if (path.startsWith('/developer/logs')) return 'logs';
  if (path.startsWith('/developer/env')) return 'envs';
  if (path.startsWith('/developer/docs')) return 'docs';
  return 'dashboard';
}

const NAV: Array<{ id: DeveloperRoute; label: string; icon: React.ComponentType<{ size?: number }> }> = [
  { id: 'dashboard', label: 'Dashboard', icon: Activity },
  { id: 'apis', label: 'APIs & Tester', icon: FlaskConical },
  { id: 'system', label: 'Firebase & Sistema', icon: Flame },
  { id: 'logs', label: 'Logs & Auditoria', icon: ScrollText },
  { id: 'envs', label: 'Ambientes', icon: Settings2 },
  { id: 'docs', label: 'Documentação', icon: BookOpen },
];

function DeveloperShell() {
  const { user, loading } = useAdminAuth();
  const [route, setRoute] = useState<DeveloperRoute>(() => developerRouteForPath(window.location.pathname));

  const navigate = (next: DeveloperRoute) => {
    setRoute(next);
    const target = next === 'dashboard' ? '/developer' : `/developer/${next}`;
    if (window.location.pathname !== target) window.history.pushState({}, '', target);
    window.scrollTo(0, 0);
  };

  React.useEffect(() => {
    const onPop = () => setRoute(developerRouteForPath(window.location.pathname));
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  if (loading) return <LoadingState message="Carregando painel…" />;
  if (!user) return <AdminLogin />;
  // Autorização real: só papel admin (moderador não entra no Developer).
  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return (
      <div className="dev-shell">
        <div className="dev-main">
          <div className="dev-card">
            <h3>Acesso negado</h3>
            <p className="dev-note">O Painel do Desenvolvedor exige papel administrativo.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dev-shell">
      <aside className="dev-sidebar">
        <div className="dev-brand">
          <img src="/logo.png" alt="FLOW" />
          <div>
            <strong>Developer</strong>
            <small>FLOW Platform</small>
          </div>
        </div>
        <nav className="dev-nav" aria-label="Navegação do desenvolvedor">
          {NAV.map((item) => (
            <button
              key={item.id}
              type="button"
              className={route === item.id ? 'active' : ''}
              onClick={() => navigate(item.id)}
            >
              <item.icon size={17} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="dev-main">
        {route === 'dashboard' && <DeveloperDashboard />}
        {route === 'apis' && <DeveloperApis />}
        {route === 'system' && <DeveloperSystem />}
        {route === 'logs' && <DeveloperLogs />}
        {route === 'envs' && <DeveloperSystem environmentsOnly />}
        {route === 'docs' && <DeveloperDocs />}
      </main>
    </div>
  );
}

export default function DeveloperApp() {
  return (
    <AdminAuthProvider>
      <DeveloperShell />
    </AdminAuthProvider>
  );
}
