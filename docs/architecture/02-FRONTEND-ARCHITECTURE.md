# 02 — FRONTEND ARCHITECTURE

> Status do documento: **vivo**. Baseado em `src/`.

---

## 1. Stack

| Camada | Tecnologia | Versão |
|---|---|---|
| UI | React | 19.2.8 |
| Idioma | TypeScript (strict) | 5.9.3 |
| Build | Vite | 8.2.2 |
| Testes unitários | Vitest | 5.x |
| E2E | Playwright | 1.62.x |
| Ícones | lucide-react | 1.39.0 |
| Backend/BaaS | Firebase (Auth, Firestore, Storage, Analytics) | 12.18.0 |
| Gerenciador | pnpm (root) / bun.lock presente / package-lock presente | — |

## 2. Estrutura de diretórios

```
src/
├── main.tsx             # bootstrap
├── App.tsx              # roteador manual + shell dispatcher + ModuleGate
├── admin/               # painel admin (AdminApp, pages, components, context)
├── developer/           # painel developer (DeveloperApp, pages)
├── app/                 # páginas de produto (AuthPage, SocialFeed, ProfilePage, ...)
│   ├── commerce/        #   políticas de marketplace (domínio puro)
│   ├── memorial/        #   módulo memorial (screens 351–365)
│   ├── modules/         #   módulos autenticados (Mensagens, Comunidades, ...)
│   ├── rewards/         #   recompensas (domínio puro + placeholder honesto)
│   └── site/            #   site institucional
├── components/          # biblioteca de componentes (ver 36-COMPONENT-CATALOG)
├── contexts/            # AppContext, PlayerContext
├── core/                # domínio puro (ModuleRegistry)
├── developer/           # painel developer
├── hooks/               # usePosts, useProfile, useComments, useSchedules, ...
├── layouts/             # AppShell (canônico) + BottomNav + FloatingPlayer
├── pages/               # barrel legado
├── services/            # fronteira de integração (Firebase + API + domínio)
├── store/               # estado global mínimo (vestigial)
├── styles/              # design-tokens.css, index.css, app-layout.css
└── utils/               # helpers
```

## 3. Roteamento

**Roteador manual** (sem React Router). `App.tsx`:

- Lê `window.location.pathname` via `useState` + evento `popstate`.
- `go(to)` = `history.pushState` + dispatch `popstate` + `scrollTo(0,0)`.
- Resolve por prefixo: auth routes (sem shell), `/admin`, `/developer`, `/memorial`, `/consentimento`, `/` (Home), site routes (`resolveSiteRoute`), 404 honesto, `/app/*` (`AppContentResolver`).
- `ModuleGate` bloqueia módulos em `maintenance`.

**Code splitting** (FASE 8): todas as páginas via `React.lazy` + `Suspense` com `LoadingState`.

> **[RECOMENDADO]** Para rotas complexas (query params tipados, nested), considerar migração gradual para React Router como roteador de baixo nível, mantendo a resolução de módulos atual. Não é urgente.

## 4. Estado global

| Contexto | Estado | Uso |
|---|---|---|
| `AppContext` | user, loading, adminUser, needsConsent | Auth/consent global |
| `AdminAuthContext` | adminUser (role admin/moderator) | Sessão admin |
| `PlayerContext` | track, playing, volume, muted | Player de áudio flutuante |
| `useModuleStates` | states por módulo | Feature flags de módulos |
| `src/store/index.ts` | `{authenticated, adminAuthenticated}` | Vestigial — não usado de fato |

Regra (em `store/index.ts`): estado global mínimo; estado de feature vive nos hooks/components.

## 5. Camada de serviços (contract boundary)

`src/services/index.ts` re-exporta: `api/client`, `moduleRegistry`, `ads`, `commerce`, `identity`, `moderation`, `rewards`.
`src/services/firebase/index.ts` re-exporta: `config`, `auth`, `firestore`, `storage`, `analytics`, `audit`, `communities`, `consent`, `creators`, `messages`, `memorial`, `newsletter`, `notifications`, `social`, `stats`, `stories`.

Serviços fora do barrel (importados diretamente): `blocks.ts`, `creator.ts`, `events.ts`, `push.ts`, `scheduling.ts`. **[RECOMENDADO]** unificar no barrel.

## 6. Padrão de componentes

Ver `36-COMPONENT-CATALOG.md`. Padrão preferido:

```
Component/
├── Component.tsx
├── Component.css
├── Component.types.ts
└── index.ts
```

- 16 componentes seguem o padrão completo; demais têm tipos inline ou são single-file.
- `moderation/ReportDialog.tsx` e `system/AppErrorBoundary.tsx` são single-file **[DÍVIDA]**.

## 7. UI States

Convenção obrigatória: toda operação assíncrona tem `LOADING / EMPTY / SUCCESS / ERROR` — componentes `LoadingState`, `EmptyState`, `ErrorState` em `src/components/ui/*`.

## 8. Design System

- `src/styles/design-tokens.css` — tokens de cor/espaçamento/sombra/raio.
- `src/flow-brand.css` — identidade FLOW (palette `#2663EB / #00D2BE / #7C58FF / #F24882`).
- `src/responsive.css`, `src/site-fidelity.css` — responividade e fidelidade do site.
- Light UI apenas (decisão de produto): `main.tsx` força `data-theme=light` e remove `flow.theme`.

## 9. Acessibilidade

- Elementos `role="alert"` (`FirebaseRuntimeNotice`, `OfflineNotice`).
- Navegação por teclado no player de áudio (progress bar acessível).
- `aria-hidden` em ilustrações de marketing (HeroSection).

## 10. Componentes de infraestrutura

- `AppErrorBoundary` — captura erros de render, tela de fallback com reload.
- `OfflineNotice` — pill offline/online via eventos do browser.
- `InstallAppPrompt` — instalação PWA (real `beforeinstallprompt`).

## 11. Pontos de atenção / dívida

| Item | Local | Status |
|---|---|---|
| Componentes monolíticos restantes | `AuthPage` (~704 linhas), `SettingsModule` (~584) | `[PARCIAL]` — decompor |
| CSS com `!important` | ~12 ocorrências | `[PARCIAL]` |
| Import direto de Firestore fora de services | `ReportDialog`, `RightRail`, `SiteContato` | `[PARCIAL]` |
| Nav para rotas inexistentes | `/app/musica`, `/app/busca`, `/app/live`, `/app/afiliados`, `/app/criar/post` | `[QUEBRADO]` — destinos caem em `SocialFeed` |
| `superadmin` em guards inalcançável | `AdminUser` permite, `FlowUser.role` não gera | `[PARCIAL]` |
| `src/layouts/*` legado | `LegacyAppLayout`, `LegacySidebar`, `LegacyTopbar` (ORPHAN) | `[PARCIAL]` |
| `flow.consent.{uid}` fallback localStorage | `consent.ts` | `[PARCIAL]` — só em falha |

## 12. Recomendações evolutivas

1. **Completar a decomposição** de `AuthPage` e `SettingsModule` em componentes por tela.
2. **Centralizar** todos os acessos Firebase em `services/firebase` (mover `ReportDialog` etc.).
3. **Tipar contratos** de API (zod no backend + tipos compartilhados).
4. **Migrar roteador** para React Router com manutenção do ModuleGate.
5. **Eliminar** `!important` e CSS morto (ver `43-TECHNICAL-DEBT.md`).