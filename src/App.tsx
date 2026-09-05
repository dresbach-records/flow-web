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
const SearchModule = React.lazy(() => import('./app/modules/SearchModule'));
const PostPage = React.lazy(() => import('./app/modules/PostPage'));
const CommunityDetail = React.lazy(() => import('./app/modules/CommunityDetail'));
const EventsModule = React.lazy(() => import('./app/modules/EventsModule').then((m) => ({ default: m.EventsModule })));
const EventDetail = React.lazy(() => import('./app/modules/EventsModule').then((m) => ({ default: m.EventDetail })));
const EventCreate = React.lazy(() => import('./app/modules/EventsModule').then((m) => ({ default: m.EventCreate })));
const StoriesPage = React.lazy(() => import('./app/modules/StoriesPage'));
const AparenciaPage = React.lazy(() => import('./app/modules/AparenciaPage'));
const CreateHub = React.lazy(() => import('./app/modules/CreateHub').then((m) => ({ default: m.CreateHub })));
const CreatePostPage = React.lazy(() => import('./app/modules/CreateHub').then((m) => ({ default: m.CreatePostPage })));
const DeveloperApp = React.lazy(() => import('./developer/DeveloperApp'));
const NotFound = React.lazy(() => import('./app/NotFound'));
const ConsentPage = React.lazy(() => import('./app/ConsentPage'));
const SiteProduto = React.lazy(() => import('./app/site/SiteInstitucional').then((m) => ({ default: m.SiteProduto })));
const SiteRecursos = React.lazy(() => import('./app/site/SiteInstitucional').then((m) => ({ default: m.SiteRecursos })));
const SiteSobre = React.lazy(() => import('./app/site/SiteInstitucional').then((m) => ({ default: m.SiteSobre })));
const SiteImprensa = React.lazy(() => import('./app/site/SiteInstitucional').then((m) => ({ default: m.SiteImprensa })));
const SiteComunidades = React.lazy(() => import('./app/site/SiteComunidades').then((m) => ({ default: m.SiteComunidades })));
const SiteComunidadeDetalhe = React.lazy(() => import('./app/site/SiteComunidades').then((m) => ({ default: m.SiteComunidadeDetalhe })));
const SiteCriadores = React.lazy(() => import('./app/site/SiteCriadores').then((m) => ({ default: m.SiteCriadores })));
const SiteCriadorPerfil = React.lazy(() => import('./app/site/SiteCriadores').then((m) => ({ default: m.SiteCriadorPerfil })));
const SiteBaixarApp = React.lazy(() => import('./app/site/SiteBaixarApp').then((m) => ({ default: m.SiteBaixarApp })));
const SiteAjuda = React.lazy(() => import('./app/site/SiteAjuda').then((m) => ({ default: m.SiteAjuda })));
const SiteAjudaArtigo = React.lazy(() => import('./app/site/SiteAjuda').then((m) => ({ default: m.SiteAjudaArtigo })));
const SiteSeguranca = React.lazy(() => import('./app/site/SiteConfianca').then((m) => ({ default: m.SiteSeguranca })));
const SiteSegurancaConta = React.lazy(() => import('./app/site/SiteConfianca').then((m) => ({ default: m.SiteSegurancaConta })));
const SitePrivacidade = React.lazy(() => import('./app/site/SiteConfianca').then((m) => ({ default: m.SitePrivacidade })));
const SitePrivacidadeControles = React.lazy(() => import('./app/site/SiteConfianca').then((m) => ({ default: m.SitePrivacidadeControles })));
const SiteTermos = React.lazy(() => import('./app/site/SiteConfianca').then((m) => ({ default: m.SiteTermos })));
const SiteTermosVersoes = React.lazy(() => import('./app/site/SiteConfianca').then((m) => ({ default: m.SiteTermosVersoes })));
const SiteContato = React.lazy(() => import('./app/site/SiteContato').then((m) => ({ default: m.SiteContato })));
const SiteContribua = React.lazy(() => import('./app/site/SiteContribua'));
const SiteBlog = React.lazy(() => import('./app/site/SiteBlog').then((m) => ({ default: m.SiteBlog })));
const SiteBlogCategoria = React.lazy(() => import('./app/site/SiteBlog').then((m) => ({ default: m.SiteBlogCategoria })));
const SiteBlogBusca = React.lazy(() => import('./app/site/SiteBlog').then((m) => ({ default: m.SiteBlogBusca })));
const SiteBlogArtigo = React.lazy(() => import('./app/site/SiteBlog').then((m) => ({ default: m.SiteBlogArtigo })));
const SiteCarreiras = React.lazy(() => import('./app/site/SiteCarreiras').then((m) => ({ default: m.SiteCarreiras })));
const SiteCarreiraDetalhe = React.lazy(() => import('./app/site/SiteCarreiras').then((m) => ({ default: m.SiteCarreiraDetalhe })));
const SiteCarreiraCandidatura = React.lazy(() => import('./app/site/SiteCarreiras').then((m) => ({ default: m.SiteCarreiraCandidatura })));
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
  [/^\/consentimento/, 'FLOW — Consentimento'],
  [/^\/contribua/, 'Contribua com o Flow | Construa conosco'],
  [/^\/(produto|recursos|sobre|imprensa|comunidades|criadores|baixar-app|ajuda|seguranca|privacidade|termos|contato|blog|carreiras|contribua)/, 'FLOW — Site'],
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

  // Consentimento dedicado (autenticado; decide pelo estado real)
  if (path === '/consentimento') {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando…" />}>
          <ConsentPage />
        </Suspense>
      </AppProvider>
    );
  }

  // Public landing — Home (somente `/`; demais rotas têm página própria ou 404)
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

  // Site público — cada rota com sua página real (nunca Home como substituto)
  const siteRoute = resolveSiteRoute(path);
  if (siteRoute) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando…" />}>
          {siteRoute}
        </Suspense>
      </AppProvider>
    );
  }

  // Rota desconhecida fora de /app → 404 honesto (não Home)
  if (!path.startsWith('/app')) {
    return (
      <AppProvider>
        <FirebaseRuntimeNotice />
        <Suspense fallback={<LoadingState message="Carregando…" />}>
          <NotFound path={path} />
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
 * Site público: rota → página real. Retorna null se não for rota do site.
 * Regra: nenhum link aponta para a Home como substituto de página inexistente.
 */
function resolveSiteRoute(path: string): React.ReactNode {
  const [pathname, search] = path.split('?');
  if (pathname === '/produto') return <SiteProduto />;
  if (pathname === '/recursos') return <SiteRecursos />;
  if (pathname === '/sobre') return <SiteSobre />;
  if (pathname === '/imprensa') return <SiteImprensa />;
  if (pathname === '/comunidades') return <SiteComunidades />;
  if (pathname.startsWith('/comunidades/')) {
    return <SiteComunidadeDetalhe slug={decodeURIComponent(pathname.slice('/comunidades/'.length))} />;
  }
  if (pathname === '/criadores') return <SiteCriadores />;
  if (pathname.startsWith('/criadores/')) {
    return <SiteCriadorPerfil username={decodeURIComponent(pathname.slice('/criadores/'.length))} />;
  }
  if (pathname === '/baixar-app') return <SiteBaixarApp />;
  if (pathname === '/ajuda') return <SiteAjuda />;
  if (pathname.startsWith('/ajuda/')) {
    return <SiteAjudaArtigo slug={decodeURIComponent(pathname.slice('/ajuda/'.length))} />;
  }
  if (pathname === '/seguranca') return <SiteSeguranca />;
  if (pathname === '/seguranca/conta') return <SiteSegurancaConta />;
  if (pathname === '/privacidade') return <SitePrivacidade />;
  if (pathname === '/privacidade/configuracoes') return <SitePrivacidadeControles />;
  if (pathname === '/termos') return <SiteTermos />;
  if (pathname === '/termos/versoes') return <SiteTermosVersoes />;
  if (pathname === '/contato') return <SiteContato />;
  if (pathname === '/contribua') return <SiteContribua />;
  if (pathname === '/blog') return <SiteBlog />;
  if (pathname.startsWith('/blog/categoria/')) {
    return <SiteBlogCategoria slug={decodeURIComponent(pathname.slice('/blog/categoria/'.length))} />;
  }
  if (pathname.startsWith('/blog/busca')) {
    const q = new URLSearchParams(search ?? '').get('q') ?? '';
    return <SiteBlogBusca query={q} />;
  }
  if (pathname.startsWith('/blog/')) {
    return <SiteBlogArtigo slug={decodeURIComponent(pathname.slice('/blog/'.length))} />;
  }
  if (pathname === '/carreiras') return <SiteCarreiras />;
  if (pathname.endsWith('/candidatar') && pathname.startsWith('/carreiras/')) {
    const slug = decodeURIComponent(pathname.slice('/carreiras/'.length, -'/candidatar'.length));
    return <SiteCarreiraCandidatura slug={slug} />;
  }
  if (pathname.startsWith('/carreiras/')) {
    return <SiteCarreiraDetalhe slug={decodeURIComponent(pathname.slice('/carreiras/'.length))} />;
  }
  return null;
}

/**
 * Resolves which authenticated page/module to display based on the URL path.
 */
function AppContentResolver({ path, navigate }: { path: string; navigate: (to: string) => void }) {
  if (path === '/app' || path === '/app/feed') return <SocialFeed path={path} />;
  if (path === '/app/explorar') return <ExploreModule />;
  if (path === '/app/shorts' || path === '/app/reels') return <ShortsModule />;
  if (path === '/app/stories') return <StoriesPage />;
  if (path === '/app/pesquisa' || path.startsWith('/app/busca')) return <SearchModule />;
  if (path.startsWith('/app/post/')) return <PostPage id={decodeURIComponent(path.slice('/app/post/'.length))} />;
  if (path === '/app/mensagens') return <MessagesModule />;
  if (path.startsWith('/app/mensagens/solicitacoes') || path.startsWith('/app/mensagens/arquivadas')) {
    return (
      <EmptyState
        title="Em implementação"
        description="Solicitações e arquivadas chegam com os sinalizadores de conversa (Fase 9)."
      />
    );
  }
  if (path.startsWith('/app/mensagens/')) {
    return <MessagesModule initialConversationId={decodeURIComponent(path.slice('/app/mensagens/'.length))} />;
  }
  if (path === '/app/notificacoes') return <NotificationsModule />;
  if (path === '/app/comunidades') return <CommunitiesModule />;
  if (path.startsWith('/app/comunidades/')) {
    return <CommunityDetail id={decodeURIComponent(path.slice('/app/comunidades/'.length))} />;
  }
  if (path === '/app/eventos') return <EventsModule />;
  if (path === '/app/eventos/criar') return <EventCreate />;
  if (path.startsWith('/app/eventos/')) {
    return <EventDetail id={decodeURIComponent(path.slice('/app/eventos/'.length))} />;
  }
  if (path === '/app/salvos') return <SavedModule />;
  if (path === '/app/configuracoes') return <SettingsModule />;
  if (path === '/app/configuracoes/conta') return <SettingsModule initialTab="profile" />;
  if (path === '/app/configuracoes/privacidade' || path === '/app/configuracoes/dados' || path === '/app/configuracoes/consentimentos') {
    return <SettingsModule initialTab="privacy" />;
  }
  if (path === '/app/configuracoes/seguranca') return <SettingsModule initialTab="security" />;
  if (path === '/app/configuracoes/notificacoes') return <SettingsModule initialTab="notifications" />;
  if (path === '/app/configuracoes/aparencia') return <AparenciaPage />;
  if (path === '/app/configuracoes/sessoes') {
    navigate('/seguranca/sessoes');
    return <LoadingState message="Abrindo sessões…" />;
  }
  if (path === '/app/configuracoes/bloqueados') return <SettingsModule initialTab="privacy" />;
  if (path === '/app/criar') return <CreateHub />;
  if (path === '/app/criar/publicacao' || path === '/app/criar/video' || path === '/app/criar/post') return <CreatePostPage />;
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
