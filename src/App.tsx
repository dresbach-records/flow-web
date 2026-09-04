import React from 'react';
import { AdminApp, AuthPage, CreatorCenter, MemorialModule, ModuleCenter, PlatformModules, ProfilePage, PublicApp, SiteEditor } from './pages';
import SocialFeed from './app/SocialFeed';
import ScheduleCenter from './app/ScheduleCenter';
import { AppProvider } from './contexts/AppContext';
import { PlayerProvider } from './contexts/PlayerContext';
import { AppLayout } from './layouts';
import { firebaseDiagnostics, getFirebaseInitializationError } from './services/firebase/config';

const AUTH_ROUTES = [
  '/auth/login',
  '/login',
  '/cadastro',
  '/recuperar-senha',
  '/redefinir-senha',
  '/verificar-email',
  '/verificar-conta',
  '/verificar-telefone',
  '/confirmacao',
  '/seguranca/2fa',
  '/seguranca/2fa/metodo',
  '/seguranca/2fa/backup',
  '/seguranca/sessoes',
  '/conta/bloqueada',
  '/conta/desativada',
  '/conta/suspensa',
  '/central-contas',
];

function go(to: string) {
  history.pushState({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo(0, 0);
}

export default function App() {
  const [path, setPath] = React.useState(() => window.location.pathname);
  React.useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const navigate = React.useCallback((next: string) => go(next), []);

  // Auth routes — no layout shell
  if (AUTH_ROUTES.includes(path)) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <AuthPage path={path} go={navigate} />
      </AppProvider>
    );
  }

  // Admin routes — unified modern shell with Firebase Auth
  if (path.startsWith('/admin')) return (
    <AppProvider>
      <AdminApp />
    </AppProvider>
  );

  // Memorial routes (root /memorial and /configuracoes/memorial)
  if (path.startsWith('/memorial') || path === '/configuracoes/memorial') {
    return (
      <AppProvider>
        <PlayerProvider>
          <FirebaseRuntimeNotice />
          <AppLayout path={path} go={navigate}>
            <MemorialModule path={path} go={navigate} />
          </AppLayout>
        </PlayerProvider>
      </AppProvider>
    );
  }

  // Public landing
  if (!path.startsWith('/app')) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <PublicApp />
      </AppProvider>
    );
  }

  // Authenticated /app routes — wrapped in AppLayout + PlayerProvider
  let appContent: React.ReactNode;
  if (path.startsWith('/app/memorial')) appContent = <MemorialModule path={path} go={navigate} />;
  else if (path === '/app/perfil') appContent = <ProfilePage />;
  else if (path.startsWith('/app/perfil/')) appContent = <ProfilePage uid={decodeURIComponent(path.slice('/app/perfil/'.length))} />;
  else if (path === '/app/agendamento' || path === '/app/agendamentos') appContent = <ScheduleCenter />;
  else if (path.startsWith('/app/criador')) appContent = <CreatorCenter />;
  else if (path === '/app/shop' || path === '/app/loja') appContent = <PlatformModules screen={path === '/app/shop' ? 'shop' : 'seller'} />;
  else if (path === '/app/pedidos') appContent = <PlatformModules screen="orders" />;
  else if (path === '/app/rewards') appContent = <PlatformModules screen="rewards" />;
  else if (path === '/app/anunciar' || path === '/app/ads') appContent = <PlatformModules screen="ads" />;
  else if (path === '/app/denunciar') appContent = <PlatformModules screen="report" />;
  else if (path === '/app/seguranca') appContent = <PlatformModules screen="safety" />;
  else appContent = <SocialFeed path={path} />;

  return (
    <AppProvider>
      <PlayerProvider>
        <FirebaseRuntimeNotice />
        <AppLayout path={path} go={navigate}>
          {appContent}
        </AppLayout>
      </PlayerProvider>
    </AppProvider>
  );
}

function FirebaseRuntimeNotice() {
  const error = getFirebaseInitializationError();
  if (!error) return null;

  return (
    <div
      role="alert"
      style={{
        position: 'fixed',
        top: 12,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 99999,
        width: 'min(680px, calc(100vw - 24px))',
        padding: '14px 16px',
        borderRadius: 14,
        border: '1px solid rgba(239,68,68,.28)',
        background: 'rgba(255,247,247,.97)',
        color: '#7f1d1d',
        boxShadow: '0 12px 32px rgba(0,0,0,.14)',
        fontFamily: 'inherit',
      }}
    >
      <strong style={{ display: 'block', marginBottom: 4 }}>Servico de autenticacao indisponivel</strong>
      <span style={{ display: 'block', fontSize: 13, lineHeight: 1.45 }}>
        A interface da Flow continua disponivel, mas o Firebase precisa de uma configuracao valida para login e cadastro.
      </span>
      <span style={{ display: 'block', marginTop: 6, fontSize: 11, opacity: .75 }}>
        Diagnostico: apiKeyConfigured={String(firebaseDiagnostics.apiKeyConfigured)}
      </span>
    </div>
  );
}


