# AUDITORIA TÉCNICA ENTERPRISE COMPLETA — FLOW-WEB
**Repositório Oficial:** `dresbach-records/flow-web`  
**Diretório Local:** `F:\Flow\flow-web`  
**Data da Auditoria:** 04 de Setembro de 2026  
**Regra Operacional:** **NENHUM CÓDIGO FONTE FOI ALTERADO, APAGADO, RENOMEADO OU REFATORADO DURANTE ESTA AUDITORIA.**

---

### LEGENDA OFICIAL DE CLASSIFICAÇÃO DOS ITENS AUDITADOS:
- **PASS** — Comprovadamente funcionando conforme o padrão oficial.
- **FAIL** — Comprovadamente quebrado ou impedindo a execução/build.
- **MISSING** — Não existe no código-fonte ou no repositório.
- **PARTIAL** — Existe, mas está incompleto ou sem funcionalidades críticas.
- **DUPLICATED** — Existem implementações concorrentes/duplicadas fazendo a mesma função.
- **ORPHAN** — Existe no repositório, mas não possui qualquer importação ou uso ativo.
- **NEEDS_REFACTOR** — Funciona superficialmente, mas a arquitetura viola as boas práticas (monolítico, acoplado).
- **NOT_VERIFIED** — Não foi possível comprovar tecnicamente sem execução em ambiente de produção.

---

## 1. ESTRUTURA E TAMANHO DOS ARQUIVOS

### Inventário Geral do Workspace:
- **Total de Arquivos em `src/`:** 92 arquivos
- **Total de Linhas em `src/`:** 11.240 linhas de código (TypeScript e CSS)
- **Total de Arquivos em `public/`:** 771 arquivos
- **Total de Arquivos em `backend/`:** 21 arquivos (5.932 linhas, incluindo lockfile)
- **Total de Telas no Inventário Oficial:** 350 telas ([docs/INVENTARIO_350_TELAS.json](file:///F:/Flow/flow-web/docs/INVENTARIO_350_TELAS.json))

### Classificação Arquitetural por Linhas de Código:
| FAIXA DE LINHAS | CLASSIFICAÇÃO | QUANTIDADE | STATUS |
|---|---|---|---|
| **Até 300 linhas** | Normal / Aceitável | 85 arquivos | **PASS** |
| **301 a 600 linhas** | Verificar / Alerta | 4 arquivos | **NEEDS_REFACTOR** |
| **601 a 1000 linhas** | Provável Decomposição | 2 arquivos | **NEEDS_REFACTOR** |
| **1001 a 1500 linhas** | Forte Candidato a Refatoração | 1 arquivo | **FAIL** (Problema Arquitetural) |
| **Acima de 1500 linhas** | Problema Crítico de Arquitetura | 0 arquivos | **PASS** |

### Os 15 Maiores Arquivos do Repositório:
1. `src/app/memorial/MemorialModule.tsx` — **1.071 linhas** (45.1 KB) → **NEEDS_REFACTOR** / **FAIL**
2. `src/app/AuthPage.tsx` — **846 linhas** (34.6 KB) → **NEEDS_REFACTOR** / **FAIL**
3. `src/app/memorial/memorial.css` — **742 linhas** (14.0 KB) → **NEEDS_REFACTOR**
4. `src/app/social-feed.css` — **580 linhas** (11.1 KB) → **NEEDS_REFACTOR**
5. `src/styles/app-layout.css` — **475 linhas** (8.8 KB) → **NEEDS_REFACTOR**
6. `src/services/firebase/auth.ts` — **431 linhas** (13.7 KB) → **NEEDS_REFACTOR**
7. `src/app/SocialFeed.tsx` — **404 linhas** (15.8 KB) → **FAIL** (Quebra por TS2304)
8. `src/layouts/Sidebar.tsx` — **274 linhas** (7.8 KB) → **DUPLICATED**
9. `src/flow-brand.css` — **233 linhas** (12.5 KB) → **NEEDS_REFACTOR**
10. `src/app/schedule-center.css` — **197 linhas** (10.1 KB) → **PASS**
11. `src/components/layout/Sidebar.tsx` — **189 linhas** (6.1 KB) → **DUPLICATED**
12. `src/layouts/FloatingPlayer.tsx` — **170 linhas** (4.7 KB) → **PASS**
13. `src/App.tsx` — **164 linhas** (6.1 KB) → **NEEDS_REFACTOR**
14. `src/app/social-reference.css` — **158 linhas** (15.3 KB) → **ORPHAN**
15. `src/services/firebase/config.ts` — **148 linhas** (5.1 KB) → **PASS**

---

## 2. ARQUITETURA E DEPENDÊNCIAS

### Diagnóstico de Camadas:
- **PAGE -> LAYOUT -> COMPONENTES -> COMPONENTES MENORES -> SERVICES/HOOKS/DATA**: **FAIL**
- **Realidade Encontrada:** A aplicação atua em modo híbrido e fragmentado. `App.tsx` atua como roteador monolítico caseiro, instanciando páginas monolíticas (`SocialFeed`, `AuthPage`, `MemorialModule`, `AdminApp`) que realizam chamadas diretas aos SDKs do Firebase ou a arrays locais, sem divisão clara entre casca, containers e componentes de apresentação.
- **Regra de Encapsulamento de Componentes:** **FAIL**
  - O projeto atualmente concentra CSS em arquivos globais ou de página (`social-feed.css`, `app-layout.css`, `memorial.css`), em vez de encapsular cada componente em sua pasta com seu próprio CSS (`Component/Component.tsx` + `Component/Component.css`).

---

## 3. AUDITORIA DE COMPONENTIZAÇÃO

Cruzamento com os 42 domínios e a biblioteca oficial requerida:

| DOMÍNIO | COMPONENTES ESPERADOS | ENCONTRADOS ISOLADOS | STATUS | AVALIAÇÃO TÉCNICA |
|---|---|---|---|---|
| **1. Design System / Fundação** | FlowLogo, FlowCard, FlowModal, FlowButton, FlowSkeleton, etc. | 0 componentes isolados | **MISSING** | Elementos HTML genéricos (`<button>`, `<div>`) usados com CSS inline ou classes dispersas. |
| **2. Layout Principal** | AppShell, TopBar, Sidebar, RightRail, MainContent, PageContainer | 5 arquivos em `components/layout/` e 4 em `layouts/` | **DUPLICATED** / **FAIL** | Conflito entre `AppShell` e `AppLayout`; classes inexistentes no CSS. |
| **3. TopBar** | TopBarContainer, GlobalSearch, TopBarActions, TopBarAvatar, AccountMenu | Apenas JSX interno em `Topbar.tsx` | **PARTIAL** | Não há subcomponentes reutilizáveis. |
| **4. Navegação** | NavItem, NavigationGroup, MoreMenu, HomeNav, ExploreNav, etc. | 0 componentes isolados | **MISSING** | Itens renderizados em loop de arrays fixos dentro da Sidebar. |
| **5. Autenticação** | LoginForm, RegisterForm, TwoFactor, SessionList | 0 componentes isolados | **NEEDS_REFACTOR** | Tudo acumulado dentro de `AuthPage.tsx` (846 linhas). |
| **6. Contrato / Aceite** | TermsGate, TermsModal, TermsDocument, TermsAcceptanceReceipt | 0 componentes isolados | **MISSING** | Apenas um checkbox booleano simples no formulário de cadastro. |
| **7. Feed** | FeedComposer, PostList, PostCard, PostHeader, CommentList | PostCard interno em `SocialFeed.tsx`; FlowPostCard órfão | **DUPLICATED** / **PARTIAL** | Não há Composer, CommentList ou PostHeader componentizados. |
| **8. Stories** | StoryRail, StoryCard, StoryViewer, StoryComposer | 0 componentes isolados | **MISSING** | Apenas uma faixa estática com array fixo `DEFAULT_STORIES`. |
| **9. Explorar / Descoberta** | ExplorePage, ExploreCategoryGrid, ExploreContentGrid | 0 componentes | **MISSING** | Rota redireciona para SocialFeed genérico. |
| **10. Busca** | SearchPage, SearchFilters, SearchResults | 0 componentes | **MISSING** | Inexistente. |
| **11. Perfil** | ProfileHeader, ProfileCover, ProfileStats, ProfileTabs | Apenas `ProfilePage.tsx` (72 linhas) | **PARTIAL** | Sem subcomponentes isolados. |
| **12. Mensagens / Chat** | ChatLayout, ConversationList, MessageBubble, ChatComposer | 0 componentes | **MISSING** | Rota redireciona para SocialFeed genérico. |
| **13. Comunidades** | CommunityCard, CommunityHeader, CommunityFeed, CommunityMembers | 0 componentes | **MISSING** | Rota redireciona para SocialFeed genérico. |
| **14. Vídeos / Shorts** | ShortsFeed, ShortVideoPlayer, VideoEditor | 0 componentes | **MISSING** | Inexistente. |
| **15. Marketplace** | ProductGrid, ProductCard, ProductDetails, ListingForm | Apenas aviso em `PlatformModules` | **PARTIAL** / **MISSING** | Inexistente como componente real. |
| **16. Memorial** | MemorialProfile, MemorialTimeline, TributeComposer | Acumulado em `MemorialModule.tsx` | **NEEDS_REFACTOR** | 1.071 linhas monolíticas sem componentes atômicos. |
| **17. Modais Globais** | ConfirmModal, DeleteModal, ReportModal, ShareModal | Apenas `ReportDialog.tsx` (órfão) | **ORPHAN** / **MISSING** | Inexistente biblioteca de modais. |
| **18. Formulários** | TextInput, Select, Checkbox, Switch, DatePicker | 0 componentes UI isolados | **MISSING** | Tags HTML puras sem validação consistente ou acessibilidade. |
| **19. Estados Globais** | PageLoading, PageError, PageEmpty, OfflineState | Apenas `AppErrorBoundary.tsx` | **PARTIAL** | Sem estados visuais padronizados por tela. |
| **20. Admin** | AdminLayout, AdminSidebar, MetricCard, DataTable, FilterBar | Acumulado em `AdminApp.tsx` (123 lin) | **NEEDS_REFACTOR** | Não reutiliza o Design System da rede social. |

---

## 4. DETECÇÃO DE PÁGINAS MONOLÍTICAS

| ARQUIVO | LINHAS | PROBLEMA DIAGNOSTICADO | COMPONENTES QUE DEVEM SER EXTRAÍDOS | PRIORIDADE |
|---|---|---|---|---|
| [MemorialModule.tsx](file:///F:/Flow/flow-web/src/app/memorial/MemorialModule.tsx) | 1.071 | Acúmulo de abas, player multimídia, formulários de homenagem e biografia | `MemorialHeader`, `MemorialPlayer`, `TributeList`, `TributeComposer`, `BiographyCard` | **ALTA** |
| [AuthPage.tsx](file:///F:/Flow/flow-web/src/app/AuthPage.tsx) | 846 | 15 modos de tela em um único switch condicional, 25 estados de formulário | `LoginForm`, `RegisterForm`, `PasswordRecoveryForm`, `TwoFactorCard`, `SessionManager`, `TermsGate` | **CRÍTICA** |
| [SocialFeed.tsx](file:///F:/Flow/flow-web/src/app/SocialFeed.tsx) | 404 | Feed, stories, composer, comentários e chamada indevida a RightRail | `StoriesRail`, `PostCard`, `PostComposer`, `CommentsModal` | **CRÍTICA** |
| [AdminApp.tsx](file:///F:/Flow/flow-web/src/admin/AdminApp.tsx) | 123 (27.9 KB) | 19 telas administrativas comprimidas sem componentização | `AdminLayout`, `AdminSidebar`, `AdminTopbar`, `DataTable`, `MetricCard` | **ALTA** |

---

## 5. AUDITORIA DO ROTEAMENTO

- **Roteador:** Manual via `window.location.pathname` e `popstate` no `src/App.tsx`.
- **Status:** **FAIL** (Roteamento improvisado, frágil e com fallback cego).

### Tabela de Resolução de Rotas:
| ROTA | COMPONENTE | ARQUIVO | STATUS |
|---|---|---|---|
| `/login`, `/cadastro`, `/recuperar-senha` (17 rotas) | `AuthPage` | `src/app/AuthPage.tsx` | **PARTIAL** |
| `/admin/modulos` | `ModuleCenter` | `src/pages/index.ts` | **PARTIAL** |
| `/admin/site` | `SiteEditor` | `src/pages/index.ts` | **PARTIAL** |
| `/admin*` (19 rotas internas) | `AdminApp` | `src/admin/AdminApp.tsx` | **PARTIAL** |
| `/memorial*` | `MemorialModule` | `src/app/memorial/MemorialModule.tsx` | **PARTIAL** |
| `/app` | `SocialFeed` | `src/app/SocialFeed.tsx` | **FAIL** (Erro TS2304 / Layout quebrado) |
| `/app/perfil*` | `ProfilePage` | `src/app/ProfilePage.tsx` | **PARTIAL** |
| `/app/agendamento*` | `ScheduleCenter` | `src/app/ScheduleCenter.tsx` | **PARTIAL** |
| `/app/criador` | `CreatorCenter` | `src/app/CreatorCenter.tsx` | **PARTIAL** (Placeholder estático) |
| `/app/shop`, `/app/pedidos`, `/app/rewards`, `/app/anunciar`, `/app/denunciar`, `/app/seguranca` | `PlatformModules` | `src/pages/index.ts` | **PARTIAL** (Cards de aviso) |
| `/app/explorar`, `/app/comunidades`, `/app/mensagens`, `/app/notificacoes`, `/app/salvos` | Fallback -> `SocialFeed` | `src/app/SocialFeed.tsx` | **FAIL** (Navegação quebrada / Redireciona para Feed) |
| **311 rotas restantes do catálogo oficial** | — | — | **MISSING** |

---

## 6. CRUZAMENTO DAS 350 TELAS DO CATÁLOGO OFICIAL

- **Fonte da Verdade:** [docs/INVENTARIO_350_TELAS.json](file:///F:/Flow/flow-web/docs/INVENTARIO_350_TELAS.json) e catálogo visual [public/FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT/](file:///F:/Flow/flow-web/public/FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT/).
- **Telas 100% Implementadas:** **0 telas** (Nenhuma tela atende os critérios completos de componentização, dados reais e estados de UI).
- **Telas Parciais:** **39 telas**
- **Telas Placeholders:** **7 telas**
- **Telas Não Implementadas / Sem Rota:** **311 telas**

*(A tabela completa de 001 a 350 com todos os cruzamentos está consolidada na Seção 23 desta auditoria).*

---

## 7. AUDITORIA VISUAL — LIGHT UI

- **Paleta Oficial Light UI:**
  - Fundo geral: `#F8FAFC` → **PARTIAL** (encontrado em `app-layout.css`, mas com `#F3F5F9` em `social-feed.css`).
  - Cards/Superfícies: `#FFFFFF` → **PASS**.
  - Bordas: `#E2E8F0` e `#EDF2F7` → **PASS**.
  - Texto: `#0F172A` (primário) e `#475569` / `#64748B` (secundário) → **PASS**.
  - Azul institucional: `#3B82F6` / `#4F7FFF` → **PASS**.
  - Gradiente FLOW: `linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)` → **PASS** (usado em botões e marca).
- **Resíduos de Dark Mode:** **FAIL**
  - Foram detectadas **23 ocorrências** de seletores escuros ou tokens pretos (`#000000`, `rgba(0,0,0,...`, `dark`) em `memorial.css`, `admin.css`, `creator.css` e `social-reference.css`.

---

## 8. AUDITORIA DO LAYOUT DESKTOP

- **Estrutura Obrigatória:** `TOPBAR` + `SIDEBAR (260px)` + `FEED/CONTENT (1fr)` + `RIGHT RAIL (320px)`.
- **Status do Layout:** **FAIL**
- **Causas Técnicas Comprovadas:**
  1. `Sidebar` possui `position: fixed`, mas o container irmão não possui margem de compensação em `AppShell.tsx`, causando sobreposição do feed.
  2. `app-layout.css:440` define `width: calc(100% - var(--sidebar-w) - var(--right-rail-w))` dentro de um elemento que já é filho de coluna de Grid, esmagando o feed para uma faixa de largura quase nula.
  3. O RightRail não é injetado por padrão no `AppShell.tsx`, deixando a coluna direita vazia no desktop, enquanto o `SocialFeed.tsx` tenta recriar o RightRail por dentro da página, quebrando o build por TS2304.

---

## 9. AUDITORIA DE CSS

- **Total de Arquivos CSS:** 21 arquivos (2.730 linhas de CSS).
- **Total de Declarações `!important`:** 19 instâncias (especialmente em `profile-page.css`, `responsive.css`, `site-fidelity.css` e `flow-brand.css`) → **NEEDS_REFACTOR**.
- **Conflitos de Classes:**
  - `AppShell.tsx` referencia `.flow-app-shell-canonical`, `.flow-app-body-canonical` e `.flow-main-content-area`. **Nenhuma dessas classes existe em nenhum arquivo CSS** → **FAIL**.
  - `app-layout.css` referencia `.flow-app-shell`, `.flow-app-content` e `.flow-right-rail-clone` → **DUPLICATED** / **FAIL**.

---

## 10. AUDITORIA DE FIREBASE

- **Configuração e Inicialização:** `src/services/firebase/config.ts` implementa checagem de variáveis de ambiente com feedback visual (`FirebaseRuntimeNotice`) → **PASS**.
- **Getters com Validação de Nulo:** `requireFirestore()`, `requireFirebaseAuth()` e `requireFirebaseStorage()` estão implementados em `config.ts` e evitam erros `TS18047` e chamadas diretas a instâncias nulas → **PASS**.
- **Persistência de Sessão:** A autenticação grava uma flag simples no `localStorage.setItem('flow.auth', '1')` → **NEEDS_REFACTOR** (frágil para controle de sessão enterprise).
- **Ausência de Data Converters:** Chamadas ao Firestore não utilizam `FirestoreDataConverter` para validação de tipos em tempo de execução → **PARTIAL**.

---

## 11. AUDITORIA DE AUTENTICAÇÃO E CONTRATO

- **Rotas de Auth:** Mapeadas em `AuthPage.tsx` (`/login`, `/cadastro`, `/recuperar-senha`, `/seguranca/2fa`, etc.) → **PARTIAL**.
- **Fluxo do Contrato Obrigatório:** **FAIL**
  - A regra exige: `Cadastro -> Login -> TermsGate (leitura) -> Checkbox -> Aceite -> Registro (usuário, versão, timestamp, IP) -> Liberação da Rede`.
  - **Realidade no Código:** `AuthPage.tsx:175, 193` possui apenas um checkbox `acceptedTerms` no formulário de cadastro e executa `go('/app')` imediatamente.
  - Não há verificação no roteador (`TermsGuard`) que bloqueie usuários que ainda não aceitaram a versão atual do contrato.

---

## 12. AUDITORIA DE ESTADOS DE UI

- **Estados Obrigatórios:** `LOADING`, `EMPTY`, `ERROR`, `SUCCESS`.
- **Status:** **FAIL**
  - `SocialFeed.tsx`: Se a lista de posts estiver vazia, renderiza uma lista em branco sem componente de `EmptyState`. Se ocorrer falha no Firestore, não há tela de `ErrorState` estruturada com botão de retry.
  - `ProfilePage.tsx`: Não há skeletons durante o carregamento de fotos ou dados do perfil.
  - `AdminApp.tsx`: Não possui estados de loading; consome arrays estáticos em memória.

---

## 13. AUDITORIA DE DADOS MOCKADOS

- **Mocks Utilizados como Dados Reais:** **FAIL**
  - `src/app/SocialFeed.tsx` (linhas 33-42): `DEFAULT_STORIES` com 8 stories fixos do Unsplash.
  - `src/components/layout/RightRail.tsx` (linhas 8-20): `SUGGESTIONS` e `TRENDS` fixos.
  - `src/components/layout/Sidebar.tsx` (linhas 33-39): `COMMUNITIES` fixo.
  - `src/admin/AdminApp.tsx` (linhas 16-37): `users`, `content`, `reports`, `creators` com dados estáticos hardcoded.
  - `src/app/memorial/MemorialModule.tsx`: Músicas, homenagens e legados mockados.

---

## 14. AUDITORIA DE ACESSIBILIDADE

- **Status:** **NEEDS_REFACTOR**
  - Diversos botões no `Sidebar.tsx` e `AdminApp.tsx` são renderizados sem `aria-label` descritivo em ícones isolados.
  - Modais não implementam captura de foco (`FocusTrap`) nem fechamento universal via tecla `ESC`.
  - Não há links de salto para conteúdo (`SkipToContent`).

---

## 15. AUDITORIA DE PERFORMANCE

- **Status:** **NEEDS_REFACTOR**
  - Ausência de `React.lazy` e `Suspense` no roteamento principal de `App.tsx`: todos os módulos pesados (`MemorialModule`, `AdminApp`, `AuthPage`, `SocialFeed`) são importados no mesmo bundle inicial.
  - Listas de feed e tabelas admin não implementam virtualização (`VirtualList`).

---

## 16. AUDITORIA DE BUILD / TEST / LINT

Comandos executados no terminal oficial:
- **`pnpm install --frozen-lockfile`**: **PASS** (resolvido em 4.8s sem inconsistências no lockfile pnpm).
- **`pnpm build`** (`tsc -b && vite build`): **FAIL**
  - **Erro Fatal:** `src/app/SocialFeed.tsx(240,10): error TS2304: Cannot find name 'RightRail'`.
- **`npx tsc --noEmit`**: **FAIL** (mesmo erro TS2304).
- **`pnpm test`**: **FAIL** (Comando `test` não configurado no `package.json`).
- **`pnpm lint`**: **FAIL** (Comando `lint` não configurado no `package.json`).

---

## 17. AUDITORIA DE DEPENDÊNCIAS E LOCKFILES

- **Gerenciador Oficial Declarado:** `pnpm@10.32.1` no `package.json` → **PASS**.
- **Lockfile Oficial:** `pnpm-lock.yaml` (50 KB) → **PASS**.
- **Lockfile Conflitante / Obsoleto:** `package-lock.json` (149 KB) presente na raiz → **DUPLICATED** / **ORPHAN**.

---

## 18. AUDITORIA DO BACKEND

- **Estrutura:** `backend/` contém aplicação Node.js / Express com arquitetura limpa (21 arquivos) → **PASS**.
- **Serviços Implementados:** Auth, Content, Persona, Scheduler, e adaptador Vertex AI / Gemini Guardian para moderação de conteúdo → **PASS**.
- **Integração com o Frontend:** **FAIL** (O frontend da rede social ignora a API do backend e tenta chamar o Firebase diretamente, deixando as rotas `/api/v1/...` e o Guardian AI desconectados da UI).

---

## 19. AUDITORIA DE ASSETS E SVG

- **Total de Assets em `public/`:** 771 arquivos.
- **Total de SVGs em `public/`:** 706 arquivos (todos possuem tags válidas e tamanho > 0 bytes) → **PASS**.
- **SVG Vazio Corrompido:** **FAIL**
  - **Arquivo:** `flow-assets-svg/brand/light/flow-logo.svg` (na pasta órfã da raiz) possui **0 bytes**.

---

## 20. AUDITORIA DE IMPORTS

- **Imports Quebrados em Tempo de Compilação:** **FAIL**
  - `src/app/SocialFeed.tsx:240` tenta utilizar `<RightRail go={go} />` sem importar `RightRail` nem declarar `go`.
- **Re-exportações Conflitantes:**
  - `src/layouts/index.ts` reexporta `AppShell` sob o nome de `AppLayout`, gerando colisão com o arquivo físico `src/layouts/AppLayout.tsx`.

---

## 21. AUDITORIA DE ARQUIVOS ÓRFÃOS

Arquivos existentes no código que não possuem importador ativo no fluxo da aplicação:
1. `src/app/commerce/CommerceHub.tsx` (17 lin) → **ORPHAN**
2. `src/app/commerce/ShopOrderCenter.tsx` (10 lin) → **ORPHAN**
3. `src/app/social-reference.css` (158 lin) → **ORPHAN**
4. `src/components/moderation/ReportDialog.tsx` (5 lin) → **ORPHAN**
5. `src/components/navigation/BottomNavigationBar.tsx` (4 lin) → **ORPHAN**
6. `src/components/social/FlowPostCard.tsx` (22 lin) → **ORPHAN**
7. `src/components/social/StoryStrip.tsx` (3 lin) → **ORPHAN**
8. `src/layouts/AppLayout.tsx` (65 lin) → **ORPHAN** (substituído por AppShell no barrel)
9. `src/services/api/feed.ts` (4 lin) → **ORPHAN**

---

## 22. AUDITORIA DO ADMIN

- **Arquivo:** `src/admin/AdminApp.tsx` (123 lin compactadas, 27.9 KB).
- **Status:** **NEEDS_REFACTOR**
- **Diagnóstico:** As 19 telas administrativas estão compactadas em uma única função. A autenticação depende de `localStorage.getItem('flow.admin.session') === '1'`. Os dados são puramente mockados. Não há desacoplamento nem componentização própria.

---

## 23. MATRIZES OFICIAIS

### A. Matriz dos Componentes Nucleares:
| COMPONENTE | EXISTE | É REUTILIZÁVEL | ESTÁ SENDO USADO | DUPLICADO | PRECISA REFACTOR | LOCALIZAÇÃO/DETALHES |
|---|---|---|---|---|---|---|
| **AppLayout** | SIM | SIM | SIM | NÃO | NÃO | src/layouts/AppLayout.tsx |
| **Sidebar** | SIM | SIM | SIM | SIM | SIM | src/components/layout/Sidebar.tsx, src/layouts/Sidebar.tsx |
| **Topbar** | SIM | SIM | SIM | SIM | SIM | src/components/layout/Topbar.tsx, src/layouts/Topbar.tsx |
| **RightRail** | SIM | SIM | SIM | NÃO | NÃO | src/components/layout/RightRail.tsx |
| **MainContent** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **PageContainer** | SIM | NÃO | NÃO | NÃO | SIM | src/components/layout/PageContainer.tsx |
| **SidebarItem** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **NavigationGroup** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Breadcrumb** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **MobileNavigation** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Feed** | SIM | SIM | NÃO | NÃO | SIM | src/services/api/feed.ts |
| **FeedTabs** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **PostCard** | SIM | NÃO | NÃO | NÃO | SIM | src/app/SocialFeed.tsx |
| **PostHeader** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **PostContent** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **PostActions** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Comment** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CommentList** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Composer** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **StoryCard** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **StoriesStrip** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProfileCard** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **UserCard** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CommunityCard** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CommunityHeader** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **FollowButton** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Input** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Textarea** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Select** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Checkbox** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Switch** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Button** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **FormField** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Modal** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Dialog** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Dropdown** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Loading** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **EmptyState** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ErrorState** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Skeleton** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Toast** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ConfirmationDialog** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProfileHeader** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProfileStats** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProfileTabs** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProfilePostGrid** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ConversationList** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ConversationItem** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ChatHeader** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **MessageList** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **MessageBubble** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **MessageComposer** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **NotificationList** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **NotificationItem** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CommunityList** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CommunityMembers** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CommunityPosts** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProductCard** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProductGrid** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ProductDetails** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **CategoryTabs** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **Cart** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **SettingsLayout** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **SettingsSidebar** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **SettingsSection** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **SettingsItem** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **AdminLayout** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **AdminSidebar** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **AdminTopbar** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **MetricCard** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **DataTable** | SIM | NÃO | NÃO | NÃO | SIM | src/admin/AdminApp.tsx |
| **FilterBar** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **AdminModal** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **AuditLog** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |
| **ModerationPanel** | NÃO | NÃO | NÃO | NÃO | SIM | Ausente |


### B. Matriz Completa das 350 Telas:
| ID | Tela | Rota | Arquivo | Componente | Status | Interação | Firebase | Observação |
|---|---|---|---|---|---|---|---|---|
| 001 | Login | `/login` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 002 | Criar conta | `/cadastro` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 003 | Recuperar senha | `/recuperar-senha` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 004 | Redefinir senha | `/redefinir-senha` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 005 | Verificar e-mail | `/verificar-email` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 006 | Verificar telefone | `/verificar-telefone` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 007 | Código de confirmação | `/confirmacao` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 008 | Autenticação 2FA | `/seguranca/2fa` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 009 | Escolher método 2FA | `/seguranca/2fa/metodo` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 010 | Códigos de backup | `/seguranca/2fa/backup` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 011 | Sessões e dispositivos | `/seguranca/sessoes` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 012 | Conta bloqueada | `/conta/bloqueada` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 013 | Conta desativada | `/conta/desativada` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 014 | Conta suspensa | `/conta/suspensa` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 015 | Central de Contas | `/central-contas` | src/app/AuthPage.tsx | AuthPage | **PARCIAL** | Parcial (formulário / feedback visual) | Sim (auth.ts / Firebase Auth) | Monolítico dentro de AuthPage.tsx (846 linhas). Falta contrato obrigatório com registro de IP e versão. |
| 016 | Preferências da conta | `/configuracoes/conta` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 017 | Confirmação de identidade | `/seguranca/identidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 018 | Termos e privacidade | `/legal/termos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 019 | Consentimentos | `/legal/consentimentos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 020 | Preferências de cookies | `/configuracoes/cookies` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 021 | Feed — Para você | `/app?feed=for-you` | src/app/SocialFeed.tsx | SocialFeed | **PARCIAL** | Parcial (like, save, comment panel local) | Sim (social.ts / firestore.ts) | Build quebra TS2304 (RightRail); conflito de CSS de layout entre AppShell e social-feed.css. |
| 022 | Feed — Seguindo | `/app?feed=following` | src/app/SocialFeed.tsx | SocialFeed | **PARCIAL** | Parcial (like, save, comment panel local) | Sim (social.ts / firestore.ts) | Build quebra TS2304 (RightRail); conflito de CSS de layout entre AppShell e social-feed.css. |
| 023 | Feed principal | `/app` | src/app/SocialFeed.tsx | SocialFeed | **PARCIAL** | Parcial (like, save, comment panel local) | Sim (social.ts / firestore.ts) | Build quebra TS2304 (RightRail); conflito de CSS de layout entre AppShell e social-feed.css. |
| 024 | Criar publicação | `/app/criar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 025 | Publicação de texto | `/app/criar/texto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 026 | Publicação com foto | `/app/criar/foto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 027 | Publicação com vídeo | `/app/criar/video` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 028 | Enquete | `/app/criar/enquete` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 029 | Sentimento e atividade | `/app/criar/sentimento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 030 | Adicionar localização | `/app/criar/localizacao` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 031 | Marcar pessoas | `/app/criar/marcar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 032 | Selecionar público | `/app/criar/publico` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 033 | Agendar publicação | `/app/criar/agendar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 034 | Rascunhos | `/app/rascunhos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 035 | Editar publicação | `/app/publicacao/:id/editar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 036 | Excluir publicação | `/app/publicacao/:id/excluir` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 037 | Ocultar publicação | `/app/publicacao/:id/ocultar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 038 | Salvar publicação | `/app/publicacao/:id/salvar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 039 | Publicações salvas | `/app/salvos/publicacoes` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 040 | Compartilhar publicação | `/app/publicacao/:id/compartilhar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 041 | Copiar link | `/app/publicacao/:id/link` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 042 | Denunciar conteúdo | `/app/publicacao/:id/denunciar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 043 | Bloquear usuário | `/app/usuario/:id/bloquear` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 044 | Silenciar usuário | `/app/usuario/:id/silenciar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 045 | Ver menos conteúdo | `/app/publicacao/:id/preferencias` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 046 | Por que estou vendo isso? | `/app/publicacao/:id/contexto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 047 | Comentários da publicação | `/app/publicacao/:id/comentarios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 048 | Respostas de comentário | `/app/comentario/:id` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 049 | Curtidas da publicação | `/app/publicacao/:id/curtidas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 050 | Compartilhamento da publicação | `/app/publicacao/:id/compartilhamentos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 051 | Visualizador de mídia | `/app/midia/:id` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 052 | Galeria de mídia | `/app/midia` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 053 | Editar foto | `/app/editor/foto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 054 | Editor de vídeo | `/app/editor/video` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 055 | Prévia da publicação | `/app/criar/preview` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 056 | Stories | `/app/stories` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 057 | Criar Story | `/app/stories/criar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 058 | Câmera do Story | `/app/stories/camera` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 059 | Upload de foto para Story | `/app/stories/foto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 060 | Upload de vídeo para Story | `/app/stories/video` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 061 | Story com texto | `/app/stories/texto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 062 | Story com música | `/app/stories/musica` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 063 | Story com figurinha | `/app/stories/figurinha` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 064 | Story com enquete | `/app/stories/enquete` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 065 | Story com perguntas | `/app/stories/perguntas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 066 | Story com localização | `/app/stories/localizacao` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 067 | Story com menção | `/app/stories/mencao` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 068 | Story com GIF | `/app/stories/gif` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 069 | Editor de Story | `/app/stories/editor` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 070 | Privacidade do Story | `/app/stories/privacidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 071 | Arquivo de Stories | `/app/stories/arquivo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 072 | Visualizadores do Story | `/app/stories/:id/visualizadores` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 073 | Story destacado | `/app/stories/destaque/:id` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 074 | Criar destaque | `/app/stories/destaques/criar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 075 | Editar destaque | `/app/stories/destaques/:id/editar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 076 | Shorts | `/app/shorts` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 077 | Criar Short | `/app/shorts/criar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 078 | Upload de vídeo Short | `/app/shorts/criar/upload` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 079 | Câmera do Short | `/app/shorts/criar/camera` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 080 | Cortar vídeo | `/app/shorts/editor/corte` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 081 | Áudio do vídeo | `/app/shorts/editor/audio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 082 | Controle de volume | `/app/shorts/editor/volume` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 083 | Adicionar música | `/app/shorts/editor/musica` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 084 | Adicionar texto | `/app/shorts/editor/texto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 085 | Efeitos | `/app/shorts/editor/efeitos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 086 | Figurinhas | `/app/shorts/editor/figurinhas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 087 | Selecionar capa | `/app/shorts/editor/capa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 088 | Editar legenda | `/app/shorts/editor/legenda` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 089 | Adicionar hashtags | `/app/shorts/editor/hashtags` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 090 | Selecionar público do Short | `/app/shorts/editor/publico` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 091 | Agendar Short | `/app/shorts/agendar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 092 | Rascunhos de Shorts | `/app/shorts/rascunhos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 093 | Estatísticas do Short | `/app/shorts/:id/insights` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 094 | Comentários do Short | `/app/shorts/:id/comentarios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 095 | Compartilhamento do Short | `/app/shorts/:id/compartilhar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 096 | Meu perfil | `/app/perfil` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 097 | Perfil de outro usuário | `/app/perfil/:id` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 098 | Editar perfil | `/app/perfil/editar` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 099 | Editar foto do perfil | `/app/perfil/editar/foto` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 100 | Editar capa | `/app/perfil/editar/capa` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 101 | Editar bio | `/app/perfil/editar/bio` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 102 | Informações pessoais | `/app/perfil/informacoes` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 103 | Publicações do perfil | `/app/perfil/publicacoes` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 104 | Fotos do perfil | `/app/perfil/fotos` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 105 | Vídeos do perfil | `/app/perfil/videos` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 106 | Reels do perfil | `/app/perfil/reels` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 107 | Stories destacados do perfil | `/app/perfil/destaques` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 108 | Seguidores | `/app/perfil/seguidores` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 109 | Seguindo | `/app/perfil/seguindo` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 110 | Amigos e conexões | `/app/perfil/amigos` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 111 | Sobre | `/app/perfil/sobre` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 112 | Atividade do perfil | `/app/perfil/atividade` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 113 | Menções | `/app/perfil/mencoes` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 114 | Curtidas | `/app/perfil/curtidas` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 115 | Itens salvos | `/app/perfil/salvos` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 116 | Configurações do perfil | `/app/perfil/configuracoes` | src/app/ProfilePage.tsx | ProfilePage | **PARCIAL** | Básica (leitura de perfil e abas) | Sim (firestore.ts) | Página resumida (72 linhas) com sub-abas não componentizadas. |
| 117 | Explorar | `/app/explorar/explorar` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 118 | Pesquisa geral | `/app/explorar/pesquisa-geral` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 119 | Resultados de pessoas | `/app/explorar/resultados-de-pessoas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 120 | Resultados de publicações | `/app/explorar/resultados-de-publicações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 121 | Resultados de vídeos | `/app/explorar/resultados-de-vídeos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 122 | Resultados de Shorts | `/app/explorar/resultados-de-shorts` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 123 | Resultados de fotos | `/app/explorar/resultados-de-fotos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 124 | Resultados de grupos | `/app/explorar/resultados-de-grupos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 125 | Resultados de Páginas | `/app/explorar/resultados-de-páginas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 126 | Resultados de comunidades | `/app/explorar/resultados-de-comunidades` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 127 | Resultados do Marketplace | `/app/explorar/resultados-do-marketplace` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 128 | Tendências | `/app/explorar/tendências` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 129 | Hashtag | `/app/explorar/hashtag` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 130 | Página de hashtag | `/app/explorar/página-de-hashtag` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 131 | Histórico de pesquisa | `/app/explorar/histórico-de-pesquisa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 132 | Sugestões de pesquisa | `/app/explorar/sugestões-de-pesquisa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 133 | Busca avançada | `/app/explorar/busca-avançada` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 134 | Resultados recentes | `/app/explorar/resultados-recentes` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 135 | Conteúdo recomendado | `/app/explorar/conteúdo-recomendado` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 136 | Caixa de entrada | `/app/mensagens/caixa-de-entrada` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 137 | Conversa aberta | `/app/mensagens/conversa-aberta` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 138 | Nova conversa | `/app/mensagens/nova-conversa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 139 | Solicitações de mensagem | `/app/mensagens/solicitações-de-mensagem` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 140 | Conversas arquivadas | `/app/mensagens/conversas-arquivadas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 141 | Mensagens não lidas | `/app/mensagens/mensagens-não-lidas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 142 | Pesquisar mensagens | `/app/mensagens/pesquisar-mensagens` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 143 | Enviar foto | `/app/mensagens/enviar-foto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 144 | Enviar vídeo | `/app/mensagens/enviar-vídeo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 145 | Enviar arquivo | `/app/mensagens/enviar-arquivo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 146 | Enviar figurinha | `/app/mensagens/enviar-figurinha` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 147 | Enviar GIF | `/app/mensagens/enviar-gif` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 148 | Enviar áudio | `/app/mensagens/enviar-áudio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 149 | Reagir à mensagem | `/app/mensagens/reagir-à-mensagem` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 150 | Responder mensagem | `/app/mensagens/responder-mensagem` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 151 | Encaminhar mensagem | `/app/mensagens/encaminhar-mensagem` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 152 | Apagar mensagem | `/app/mensagens/apagar-mensagem` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 153 | Silenciar conversa | `/app/mensagens/silenciar-conversa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 154 | Bloquear conversa | `/app/mensagens/bloquear-conversa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 155 | Denunciar conversa | `/app/mensagens/denunciar-conversa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 156 | Notificações | `/app/notificacoes` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 157 | Curtidas | `/app/notificacoes/curtidas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 158 | Comentários | `/app/notificacoes/comentários` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 159 | Menções | `/app/notificacoes/menções` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 160 | Novos seguidores | `/app/notificacoes/novos-seguidores` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 161 | Solicitações de amizade | `/app/notificacoes/solicitações-de-amizade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 162 | Mensagens | `/app/notificacoes/mensagens` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 163 | Stories | `/app/notificacoes/stories` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 164 | Shorts | `/app/notificacoes/shorts` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 165 | Grupos | `/app/notificacoes/grupos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 166 | Páginas | `/app/notificacoes/páginas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 167 | Marketplace | `/app/notificacoes/marketplace` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 168 | Segurança | `/app/notificacoes/segurança` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 169 | Notificações push | `/app/notificacoes/notificações-push` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 170 | Preferências de notificações | `/app/notificacoes/preferências-de-notificações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 171 | Comunidades | `/app/comunidades/comunidades` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 172 | Descobrir comunidades | `/app/comunidades/descobrir-comunidades` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 173 | Minhas comunidades | `/app/comunidades/minhas-comunidades` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 174 | Criar comunidade | `/app/comunidades/criar-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 175 | Página da comunidade | `/app/comunidades/página-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 176 | Feed da comunidade | `/app/comunidades/feed-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 177 | Membros | `/app/comunidades/membros` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 178 | Administradores | `/app/comunidades/administradores` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 179 | Solicitações | `/app/comunidades/solicitações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 180 | Convites | `/app/comunidades/convites` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 181 | Eventos da comunidade | `/app/comunidades/eventos-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 182 | Arquivos da comunidade | `/app/comunidades/arquivos-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 183 | Perguntas | `/app/comunidades/perguntas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 184 | Regras | `/app/comunidades/regras` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 185 | Moderação | `/app/comunidades/moderação` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 186 | Denúncias da comunidade | `/app/comunidades/denúncias-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 187 | Banimentos | `/app/comunidades/banimentos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 188 | Configurações da comunidade | `/app/comunidades/configurações-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 189 | Editar comunidade | `/app/comunidades/editar-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 190 | Insights da comunidade | `/app/comunidades/insights-da-comunidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 191 | Salvos | `/app/salvos/salvos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 192 | Publicações salvas | `/app/salvos/publicações-salvas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 193 | Vídeos salvos | `/app/salvos/vídeos-salvos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 194 | Shorts salvos | `/app/salvos/shorts-salvos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 195 | Links salvos | `/app/salvos/links-salvos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 196 | Coleções | `/app/salvos/coleções` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 197 | Criar coleção | `/app/salvos/criar-coleção` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 198 | Editar coleção | `/app/salvos/editar-coleção` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 199 | Excluir coleção | `/app/salvos/excluir-coleção` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 200 | Eventos | `/app/salvos/eventos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 201 | Descobrir eventos | `/app/salvos/descobrir-eventos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 202 | Meus eventos | `/app/salvos/meus-eventos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 203 | Criar evento | `/app/salvos/criar-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 204 | Página do evento | `/app/salvos/página-do-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 205 | Participantes | `/app/salvos/participantes` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 206 | Convites do evento | `/app/salvos/convites-do-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 207 | Agenda do evento | `/app/salvos/agenda-do-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 208 | Localização do evento | `/app/salvos/localização-do-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 209 | Editar evento | `/app/salvos/editar-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 210 | Configurações do evento | `/app/salvos/configurações-do-evento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 211 | Marketplace | `/app/marketplace` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 212 | Pesquisa do Marketplace | `/app/marketplace/pesquisa-do-marketplace` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 213 | Categorias | `/app/marketplace/categorias` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 214 | Detalhes do produto | `/app/marketplace/detalhes-do-produto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 215 | Criar anúncio | `/app/marketplace/criar-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 216 | Editar anúncio | `/app/marketplace/editar-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 217 | Fotos do produto | `/app/marketplace/fotos-do-produto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 218 | Preço do produto | `/app/marketplace/preço-do-produto` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 219 | Localização do anúncio | `/app/marketplace/localização-do-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 220 | Mensagens do comprador | `/app/marketplace/mensagens-do-comprador` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 221 | Meus anúncios | `/app/marketplace/meus-anúncios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 222 | Anúncios vendidos | `/app/marketplace/anúncios-vendidos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 223 | Itens salvos | `/app/marketplace/itens-salvos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 224 | Compras | `/app/marketplace/compras` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 225 | Avaliações | `/app/marketplace/avaliações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 226 | Entrega | `/app/marketplace/entrega` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 227 | Pagamento | `/app/marketplace/pagamento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 228 | Relatório de anúncio | `/app/marketplace/relatório-de-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 229 | Denunciar anúncio | `/app/marketplace/denunciar-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 230 | Configurações do Marketplace | `/app/marketplace/configurações-do-marketplace` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 231 | Criar Página | `/app/paginas/criar-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 232 | Escolher tipo de Página | `/app/paginas/escolher-tipo-de-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 233 | Informações da Página | `/app/paginas/informações-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 234 | Categoria da Página | `/app/paginas/categoria-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 235 | Descrição da Página | `/app/paginas/descrição-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 236 | Site da Página | `/app/paginas/site-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 237 | Telefone da Página | `/app/paginas/telefone-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 238 | E-mail da Página | `/app/paginas/e-mail-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 239 | Endereço da Página | `/app/paginas/endereço-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 240 | Foto da Página | `/app/paginas/foto-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 241 | Capa da Página | `/app/paginas/capa-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 242 | Nome de usuário da Página | `/app/paginas/nome-de-usuário-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 243 | Página publicada | `/app/paginas/página-publicada` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 244 | Feed da Página | `/app/paginas/feed-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 245 | Sobre da Página | `/app/paginas/sobre-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 246 | Fotos da Página | `/app/paginas/fotos-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 247 | Vídeos da Página | `/app/paginas/vídeos-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 248 | Shorts da Página | `/app/paginas/shorts-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 249 | Stories da Página | `/app/paginas/stories-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 250 | Eventos da Página | `/app/paginas/eventos-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 251 | Serviços da Página | `/app/paginas/serviços-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 252 | Produtos da Página | `/app/paginas/produtos-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 253 | Avaliações da Página | `/app/paginas/avaliações-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 254 | Seguidores da Página | `/app/paginas/seguidores-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 255 | Caixa de entrada da Página | `/app/paginas/caixa-de-entrada-da-página` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 256 | Business Suite — Visão geral | `/app/business/business-suite---visão-geral` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 257 | Business Suite — Início | `/app/business/business-suite---início` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 258 | Calendário | `/app/business/calendário` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 259 | Planejador de conteúdo | `/app/business/planejador-de-conteúdo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 260 | Publicações | `/app/business/publicações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 261 | Stories publicados | `/app/business/stories-publicados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 262 | Shorts publicados | `/app/business/shorts-publicados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 263 | Rascunhos | `/app/business/rascunhos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 264 | Agendados | `/app/business/agendados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 265 | Publicados | `/app/business/publicados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 266 | Caixa de entrada | `/app/business/caixa-de-entrada` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 267 | Comentários | `/app/business/comentários` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 268 | Mensagens | `/app/business/mensagens` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 269 | Leads | `/app/business/leads` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 270 | Notificações | `/app/business/notificações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 271 | Insights | `/app/business/insights` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 272 | Visão diária | `/app/business/visão-diária` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 273 | Visão semanal | `/app/business/visão-semanal` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 274 | Visão mensal | `/app/business/visão-mensal` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 275 | Alcance | `/app/business/alcance` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 276 | Engajamento | `/app/business/engajamento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 277 | Seguidores | `/app/business/seguidores` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 278 | Crescimento | `/app/business/crescimento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 279 | Conteúdo com melhor desempenho | `/app/business/conteúdo-com-melhor-desempenho` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 280 | Público | `/app/business/público` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 281 | Monetização | `/app/business/monetização` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 282 | Configurações comerciais | `/app/business/configurações-comerciais` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 283 | Biblioteca de conteúdo | `/app/business/biblioteca-de-conteúdo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 284 | Tarefas | `/app/business/tarefas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 285 | Colaboradores | `/app/business/colaboradores` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 286 | Gerenciador de Anúncios | `/app/ads/gerenciador-de-anúncios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 287 | Campanhas | `/app/ads/campanhas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 288 | Conjuntos de anúncios | `/app/ads/conjuntos-de-anúncios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 289 | Anúncios | `/app/ads/anúncios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 290 | Criar campanha | `/app/ads/criar-campanha` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 291 | Objetivo da campanha | `/app/ads/objetivo-da-campanha` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 292 | Orçamento | `/app/ads/orçamento` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 293 | Programação | `/app/ads/programação` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 294 | Público | `/app/ads/público` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 295 | Localização | `/app/ads/localização` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 296 | Idade e gênero | `/app/ads/idade-e-gênero` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 297 | Segmentação detalhada | `/app/ads/segmentação-detalhada` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 298 | Posicionamentos | `/app/ads/posicionamentos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 299 | Criativo | `/app/ads/criativo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 300 | Texto do anúncio | `/app/ads/texto-do-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 301 | Título do anúncio | `/app/ads/título-do-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 302 | CTA | `/app/ads/cta` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 303 | URL de destino | `/app/ads/url-de-destino` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 304 | Prévia do anúncio | `/app/ads/prévia-do-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 305 | Publicar anúncio | `/app/ads/publicar-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 306 | Revisão do anúncio | `/app/ads/revisão-do-anúncio` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 307 | Anúncio aprovado | `/app/ads/anúncio-aprovado` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 308 | Anúncio rejeitado | `/app/ads/anúncio-rejeitado` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 309 | Relatórios | `/app/ads/relatórios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 310 | Métricas | `/app/ads/métricas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 311 | Colunas personalizadas | `/app/ads/colunas-personalizadas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 312 | Filtros | `/app/ads/filtros` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 313 | Comparação | `/app/ads/comparação` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 314 | Exportação | `/app/ads/exportação` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 315 | Biblioteca de anúncios | `/app/ads/biblioteca-de-anúncios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 316 | Configurações gerais | `/app/configuracoes/configurações-gerais` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 317 | Conta | `/app/configuracoes/conta` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 318 | Perfil | `/app/configuracoes/perfil` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 319 | Privacidade | `/app/configuracoes/privacidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 320 | Segurança | `/app/configuracoes/segurança` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 321 | Senha | `/app/configuracoes/senha` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 322 | Login | `/app/configuracoes/login` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 323 | Autenticação 2FA | `/app/configuracoes/autenticação-2fa` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 324 | Dispositivos conectados | `/app/configuracoes/dispositivos-conectados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 325 | Bloqueios | `/app/configuracoes/bloqueios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 326 | Silenciamentos | `/app/configuracoes/silenciamentos` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 327 | Preferências do Feed | `/app/configuracoes/preferências-do-feed` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 328 | Preferências de conteúdo | `/app/configuracoes/preferências-de-conteúdo` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 329 | Idioma | `/app/configuracoes/idioma` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 330 | Acessibilidade | `/app/configuracoes/acessibilidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 331 | Tema claro | `/app/configuracoes/tema-claro` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 332 | Tema escuro | `/app/configuracoes/tema-escuro` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 333 | Notificações | `/app/configuracoes/notificações` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 334 | E-mail | `/app/configuracoes/e-mail` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 335 | SMS | `/app/configuracoes/sms` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 336 | Push | `/app/configuracoes/push` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 337 | Dados pessoais | `/app/configuracoes/dados-pessoais` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 338 | Baixar seus dados | `/app/configuracoes/baixar-seus-dados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 339 | Transferência de dados | `/app/configuracoes/transferência-de-dados` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 340 | Excluir conta | `/app/configuracoes/excluir-conta` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 341 | Desativar conta | `/app/configuracoes/desativar-conta` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 342 | Publicidade | `/app/configuracoes/publicidade` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 343 | Preferências de anúncios | `/app/configuracoes/preferências-de-anúncios` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 344 | Atividade fora da plataforma | `/app/configuracoes/atividade-fora-da-plataforma` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 345 | Cookies | `/app/configuracoes/cookies` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 346 | Central de segurança | `/app/seguranca/central-de-segurança` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 347 | Denúncias | `/app/seguranca/denúncias` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 348 | Conteúdo denunciado | `/app/seguranca/conteúdo-denunciado` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 349 | Contas bloqueadas | `/app/seguranca/contas-bloqueadas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |
| 350 | Palavras ocultas | `/app/seguranca/palavras-ocultas` | — | — | **NÃO IMPLEMENTADA** | Nenhuma | Não | Sem rota no router e sem componente dedicado. |


---

## 24. DIAGNÓSTICO DO PROBLEMA VISUAL (LAYOUT E TELA BRANCA)

| PROBLEMA | CAUSA RAIZ EXATA | ARQUIVO E LINHA | STATUS | RECOMENDAÇÃO TÉCNICA |
|---|---|---|---|---|
| **Tela Branca / Build Quebrado** | Uso de componente não importado `<RightRail />` | `src/app/SocialFeed.tsx:240` | **FAIL** | Remover RightRail de dentro da página e mantê-lo exclusivamente no layout shell. |
| **Sidebar cobrindo o feed** | Sidebar com `position: fixed` sem margem compensatória no elemento pai | `src/components/layout/AppShell.tsx:25` | **FAIL** | Utilizar CSS Grid de 3 colunas canônicas (`260px 1fr 320px`) no `AppShell`. |
| **Feed esmagado horizontalmente** | `width: calc(100% - var(--sidebar-w) - var(--right-rail-w))` aplicado em elemento de grid | `src/styles/app-layout.css:440` | **FAIL** | Deixar o container central preencher naturalmente a coluna `1fr` com `max-width: 720px; margin: 0 auto;`. |
| **RightRail ausente no Desktop** | `AppShell.tsx` exige prop opcional `rightRail` que `App.tsx` nunca enviava | `src/components/layout/AppShell.tsx:37` | **FAIL** | Tornar o RightRail parte integrante estrutural do DesktopShell. |
| **Classes CSS fantasmas** | `.flow-app-shell-canonical` e correlatas sem nenhuma declaração CSS | `src/components/layout/AppShell.tsx:22` | **FAIL** | Conectar os componentes do shell às variáveis oficiais do design system. |

---

## 25. RELATÓRIO FINAL E PRÓXIMOS PASSOS

### Resumo Quantitativo dos Status Auditados:
- **PASS:** 8 itens (Configurações Firebase, 85 arquivos dentro do tamanho normal, 706 SVGs válidos em public, pnpm install).
- **FAIL:** 11 itens (Build quebrando por TS2304, Layout desorganizado, classes CSS inexistentes, ausência de testes/lint, tela de contrato sem gatekeeper, SVG zerado na raiz, roteamento com fallback indevido).
- **PARTIAL:** 39 telas e 6 módulos (Auth básico, Feed básico, Perfil básico, ScheduleCenter, Admin mockado).
- **MISSING:** 311 telas e 67 componentes da biblioteca enterprise.
- **DUPLICATED:** 4 pares de componentes estruturais (`Sidebar`, `Topbar`, `AppLayout/AppShell`, `PostCard`) e 1 lockfile (`package-lock.json`).
- **ORPHAN:** 9 arquivos de código em `src/` e a pasta `flow-assets-svg/` na raiz.
- **NEEDS_REFACTOR:** 7 arquivos monolíticos e a camada de estilos desestruturada.

---
*Relatório de Auditoria Técnica concluído. Nenhum arquivo de código foi alterado, aguardando aprovação para execução da Fase 1.*
