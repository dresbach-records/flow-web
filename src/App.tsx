import React from 'react';
import { AdminApp, AuthPage, CreatorCenter, MemorialModule, PlatformModules, ProfilePage, PublicApp } from './pages';
import SocialFeed from './app/SocialFeed';
import ScheduleCenter from './app/ScheduleCenter';
import ExploreModule from './app/modules/ExploreModule';
import ShortsModule from './app/modules/ShortsModule';
import MessagesModule from './app/modules/MessagesModule';
import NotificationsModule from './app/modules/NotificationsModule';
import CommunitiesModule from './app/modules/CommunitiesModule';
import SavedModule from './app/modules/SavedModule';
import SettingsModule from './app/modules/SettingsModule';
import MandatoryConsentModal from './components/consent/MandatoryConsentModal';
import { AppProvider, useAppContext } from './contexts/AppContext';
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
  if (path.startsWith('/admin')) {
    return (
      <AppProvider>
        <AdminApp />
      </AppProvider>
    );
  }

  // Memorial routes (root /memorial and /configuracoes/memorial)
  if (path.startsWith('/memorial') || path === '/configuracoes/memorial') {
    return (
      <AppProvider>
        <PlayerProvider>
          <FirebaseRuntimeNotice />
          <AppShellWrapper path={path} navigate={navigate}>
            <MemorialModule path={path} go={navigate} />
          </AppShellWrapper>
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

  // Authenticated /app routes — wrapped in AppProvider + PlayerProvider + AppShellWrapper
  return (
    <AppProvider>
      <PlayerProvider>
        <FirebaseRuntimeNotice />
        <AppShellWrapper path={path} navigate={navigate}>
          <AppContentResolver path={path} navigate={navigate} />
        </AppShellWrapper>
      </PlayerProvider>
    </AppProvider>
  );
}

/**
 * Resolves which authenticated page/module to display based on the URL path.
 */
function AppContentResolver({ path, navigate }: { path: string; navigate: (to: string) => void }) {
  if (path === '/app/explorar') return <ExploreModule />;
  if (path === '/app/shorts') return <ShortsModule />;
  if (path === '/app/mensagens') return <MessagesModule />;
  if (path === '/app/notificacoes') return <NotificationsModule />;
  if (path === '/app/comunidades') return <CommunitiesModule />;
  if (path === '/app/salvos') return <SavedModule />;
  if (path === '/app/configuracoes') return <SettingsModule />;
  if (path.startsWith('/app/memorial')) return <MemorialModule path={path} go={navigate} />;
  if (path === '/app/perfil') return <ProfilePage />;
  if (path.startsWith('/app/perfil/')) return <ProfilePage uid={decodeURIComponent(path.slice('/app/perfil/'.length))} />;
  if (path === '/app/agendamento' || path === '/app/agendamentos') return <ScheduleCenter />;
  if (path.startsWith('/app/criador')) return <CreatorCenter />;
  if (path === '/app/shop' || path === '/app/loja') return <PlatformModules screen={path === '/app/shop' ? 'shop' : 'seller'} />;
  if (path === '/app/pedidos') return <PlatformModules screen="orders" />;
  if (path === '/app/rewards') return <PlatformModules screen="rewards" />;
  if (path === '/app/anunciar' || path === '/app/ads') return <PlatformModules screen="ads" />;
  if (path === '/app/denunciar') return <PlatformModules screen="report" />;
  if (path === '/app/seguranca') return <PlatformModules screen="safety" />;
  return <SocialFeed path={path} />;
}

/**
 * Shell wrapper that enforces mandatory terms & privacy consent gating.
 */
function AppShellWrapper({
  path,
  navigate,
  children,
}: {
  path: string;
  navigate: (to: string) => void;
  children: React.ReactNode;
}) {
  const { user, needsConsent, acceptConsent, declineConsent } = useAppContext();

  return (
    <>
      <AppLayout path={path} go={navigate}>
        {children}
      </AppLayout>

      {/* Mandatory Terms & Privacy Consent Modal (Telas 14 a 17) */}
      {needsConsent && (
        <MandatoryConsentModal
          userId={user?.uid || 'guest'}
          userName={user?.displayName}
          onAccept={acceptConsent}
          onDecline={declineConsent}
        />
      )}
    </>
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
      <strong style={{ display: 'block', marginBottom: 4 }}>Serviço de autenticação em modo local</strong>
      <span style={{ display: 'block', fontSize: 13, lineHeight: 1.45 }}>
        A interface da Flow continua disponível com sincronização Firebase.
      </span>
      <span style={{ display: 'block', marginTop: 6, fontSize: 11, opacity: 0.75 }}>
        Diagnóstico: apiKeyConfigured={String(firebaseDiagnostics.apiKeyConfigured)}
      </span>
    </div>
  );
}
