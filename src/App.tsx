import React, { Suspense } from 'react';
// FASE 8: code-splitting por rota — bundles pesados carregam sob demanda.
const AdminApp = React.lazy(() => import('./admin/AdminApp'));
const AuthPage = React.lazy(() => import('./app/AuthPage'));
const CreatorCenter = React.lazy(() => import('./app/CreatorCenter'));
const MemorialModule = React.lazy(() => import('./app/memorial/MemorialModule'));
const PlatformModules = React.lazy(() => import('./app/PlatformModules'));
const ProfilePage = React.lazy(() => import('./app/ProfilePage'));
const SiteHome = React.lazy(() => import('./app/SiteHome'));
const SocialFeed = React.lazy(() => import('./app/SocialFeed'));
const ScheduleCenter = React.lazy(() => import('./app/ScheduleCenter'));
const ExploreModule = React.lazy(() => import('./app/modules/ExploreModule'));
const ShortsModule = React.lazy(() => import('./app/modules/ShortsModule'));
const MessagesModule = React.lazy(() => import('./app/modules/MessagesModule'));
const NotificationsModule = React.lazy(() => import('./app/modules/NotificationsModule'));
const CommunitiesModule = React.lazy(() => import('./app/modules/CommunitiesModule'));
const SavedModule = React.lazy(() => import('./app/modules/SavedModule'));
const SettingsModule = React.lazy(() => import('./app/modules/SettingsModule'));
const DeveloperApp = React.lazy(() => import('./developer/DeveloperApp'));
import TermsGate from './components/auth/TermsGate';
import LoadingState from './components/ui/LoadingState';
import EmptyState from './components/ui/EmptyState';
import { moduleKeyForPath, useModuleStates } from './hooks/useModuleStates';
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

const ROUTE_TITLES: Array<[RegExp, string]> = [
  [/^\/$/, 'FLOW — Conecte. Compartilhe. Viva.'],
  [/^\/(login|auth\/login)$/, 'FLOW — Login'],
  [/^\/cadastro$/, 'FLOW — Criar conta'],
  [/^\/(recuperar-senha|redefinir-senha|verificar|confirmacao)/, 'FLOW — Acesso'],
  [/^\/seguranca/, 'FLOW — Segurança'],
  [/^\/conta/, 'FLOW — Conta'],
  [/^\/admin/, 'FLOW — Administração'],
  [/^\/developer/, 'FLOW — Desenvolvedor'],
  [/^\/memorial/, 'FLOW — Memorial'],
  [/^\/app\/perfil/, 'FLOW — Perfil'],
  [/^\/app\/comunidades/, 'FLOW — Comunidades'],
  [/^\/app\/mensagens/, 'FLOW — Mensagens'],
  [/^\/app\/notificacoes/, 'FLOW — Notificações'],
  [/^\/app\/configuracoes/, 'FLOW — Configurações'],
  [/^\/app\/explorar/, 'FLOW — Explorar'],
  [/^\/app\/shorts/, 'FLOW — Shorts'],
  [/^\/app\/salvos/, 'FLOW — Salvos'],
  [/^\/app\/criador/, 'FLOW — Criadores'],
  [/^\/app/, 'FLOW — Rede Social'],
];

function titleFor(path: string): string {
  const hit = ROUTE_TITLES.find(([re]) => re.test(path));
  return hit ? hit[1] : 'FLOW — Conecte. Compartilhe. Viva.';
}

export default function App() {
  const [path, setPath] = React.useState(() => window.location.pathname);
  React.useEffect(() => {
    const onPopState = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);
  const navigate = React.useCallback((next: string) => go(next), []);
  React.useEffect(() => {
    document.title = titleFor(path);
  }, [path]);

  // Auth routes — no layout shell
  if (AUTH_ROUTES.includes(path)) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando…" />}>
          <AuthPage path={path} go={navigate} />
        </Suspense>
      </AppProvider>
    );
  }

  // Admin routes — unified modern shell with Firebase Auth
  if (path.startsWith('/admin')) {
    return (
      <AppProvider>
        <Suspense fallback={<LoadingState message="Carregando administração…" />}>
          <AdminApp />
        </Suspense>
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
            <Suspense fallback={<LoadingState message="Carregando memorial…" />}>
              <MemorialModule path={path} go={navigate} />
            </Suspense>
          </AppShellWrapper>
        </PlayerProvider>
      </AppProvider>
    );
  }

  // Developer routes — painel técnico, sessão admin + papel admin
  if (path.startsWith('/developer')) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando painel…" />}>
          <DeveloperApp />
        </Suspense>
      </AppProvider>
    );
  }

  // Public landing — nova HOME institucional componentizada
  if (path === '/') {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando…" />}>
          <SiteHome />
        </Suspense>
      </AppProvider>
    );
  }

  // Rotas públicas fora de /app: home institucional componentizada (FlowWeb legado
  // aposentado na FASE 1 — demo com dados fictícios removida).
  if (!path.startsWith('/app')) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando…" />}>
          <SiteHome />
        </Suspense>
      </AppProvider>
    );
  }

  // Authenticated /app routes — wrapped in AppProvider + PlayerProvider + AppShellWrapper
  return (
    <AppProvider>
      <PlayerProvider>
        <FirebaseRuntimeNotice />
        <AppShellWrapper path={path} navigate={navigate}>
          <Suspense fallback={<LoadingState message="Carregando…" />}>
            <ModuleGate path={path}>
              <AppContentResolver path={path} navigate={navigate} />
            </ModuleGate>
          </Suspense>
        </AppShellWrapper>
      </PlayerProvider>
    </AppProvider>
  );
}

/**
 * ModuleGate: aplica os estados reais de platform_settings/modules.
 * Módulo em manutenção = aviso honesto em vez da tela.
 */
function ModuleGate({ path, children }: { path: string; children: React.ReactNode }) {
  const states = useModuleStates();
  const key = moduleKeyForPath(path);
  if (key && states[key] === 'maintenance') {
    return (
      <EmptyState
        title="Módulo em manutenção"
        description="Esta área está temporariamente indisponível por decisão administrativa. Tente novamente em instantes."
      />
    );
  }
  return <>{children}</>;
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
 * Shell wrapper: exige login para /app* e aplica o consentimento obrigatório
 * (exibido uma única vez até o aceite versionado).
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
  const { user, loading, needsConsent, acceptConsent, declineConsent } = useAppContext();
  const [redirected, setRedirected] = React.useState(false);

  React.useEffect(() => {
    if (!loading && !user && !redirected) {
      setRedirected(true);
      navigate('/login');
    }
  }, [loading, user, redirected, navigate]);

  if (loading || !user) return <LoadingState message="Carregando seu FLOW…" />;

  return (
    <>
      <AppLayout path={path} go={navigate}>
        {children}
      </AppLayout>

      {/* Consentimento obrigatório (exibido uma única vez até o aceite). */}
      {needsConsent && (
        <TermsGate onAccept={acceptConsent} onDecline={declineConsent} />
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
