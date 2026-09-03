import React from 'react';
import { AdminApp, AuthPage, CreatorCenter, ModuleCenter, PlatformModules, PublicApp, SiteEditor } from './pages';
import SocialFeed from './app/SocialFeed';
import { AppProvider } from './contexts/AppContext';

const AUTH_ROUTES = ['/auth/login', '/login', '/cadastro', '/recuperar-senha', '/redefinir-senha', '/verificar-conta'];
const SOCIAL_ROUTES = new Set(['/app', '/app/', '/app/for-you', '/app/seguindo', '/app/explorar', '/app/shorts', '/app/criar', '/app/mensagens', '/app/notificacoes', '/app/comunidades', '/app/perfil', '/app/salvos', '/app/configuracoes']);

export default function App() {
  const [path, setPath] = React.useState(() => window.location.pathname);

  React.useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const go = React.useCallback((next: string) => {
    history.pushState({}, '', next);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  }, []);

  let content: React.ReactNode;
  if (path === '/admin/modulos') content = <AdminAppShell><ModuleCenter /></AdminAppShell>;
  else if (path === '/admin/site') content = <AdminAppShell><SiteEditor /></AdminAppShell>;
  else if (path.startsWith('/admin')) content = <AdminApp />;
  else if (AUTH_ROUTES.includes(path)) content = <AuthPage path={path} go={go} />;
  else if (SOCIAL_ROUTES.has(path)) content = <SocialFeed />;
  else if (path.startsWith('/app/criador')) content = <CreatorCenter />;
  else if (path === '/app/shop' || path === '/app/loja') content = <PlatformModules screen={path === '/app/shop' ? 'shop' : 'seller'} />;
  else if (path === '/app/pedidos') content = <PlatformModules screen="orders" />;
  else if (path === '/app/rewards') content = <PlatformModules screen="rewards" />;
  else if (path === '/app/anunciar' || path === '/app/ads') content = <PlatformModules screen="ads" />;
  else if (path === '/app/denunciar') content = <PlatformModules screen="report" />;
  else if (path === '/app/seguranca') content = <PlatformModules screen="safety" />;
  else content = <PublicApp />;

  return <AppProvider>{content}</AppProvider>;
}

function AdminAppShell({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = React.useState(() => localStorage.getItem('flow.admin.session') === '1');
  const [email, setEmail] = React.useState('');
  const [pass, setPass] = React.useState('');

  if (!auth) {
    return <div className="admin-login"><div className="admin-login-card">
      <div className="admin-login-brand"><img src="/flow-logo.svg" alt="FLOW" /><span className="admin-badge">ADMIN</span></div>
      <h1>Acesso administrativo</h1><p>Área exclusiva do FLOW Control Center.</p>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="E-mail administrativo" type="email" />
      <input value={pass} onChange={e => setPass(e.target.value)} placeholder="Senha" type="password" />
      <button className="admin-btn primary" onClick={() => { if (email && pass) { localStorage.setItem('flow.admin.session', '1'); setAuth(true); } }}>Entrar no painel</button>
    </div></div>;
  }
  return <>{children}</>;
}
