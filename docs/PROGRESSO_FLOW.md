# FLOW-WEB — Registro de progresso (feito + faltas)

> Atualizado a cada turno. Base: `ad7d438` (merge home + consentimento).
> Scripts oficiais: `pnpm dev/build/preview`, `pnpm lint` (= `tsc -b`), `pnpm typecheck` (= `tsc -b`).
> NÃO existem scripts `test`/`lint:eslint` — sem testes automatizados no repo.

## 0. REGRA DE CONCLUSÃO FLOW (norma de auditoria — vale para as 350 telas)
- Nenhuma funcionalidade, tela, componente, botão, formulário ou módulo poderá ser
  considerado implementado enquanto existir somente no frontend, somente visualmente,
  com dados mockados, dados estáticos, estado local simulando persistência ou resposta fictícia.
- Toda funcionalidade que necessite de processamento, regra de negócio, autenticação,
  autorização, consulta ou persistência deverá possuir implementação correspondente no
  backend e integração ponta a ponta com Firebase/banco de dados.
- A conclusão somente ocorre após validação do fluxo completo:
  UI → componente → service → API → backend → regra de negócio → persistência → resposta → UI.
- Tela sem backend quando necessário = PENDENTE, não concluída. Rota ou visual existente
  não conta como conclusão.

## 1. Estado da base (auditoria)
- Typecheck PASS, build PASS. Rotas: SPA manual (`history.pushState` + `popstate`) em `src/App.tsx`; fallback SPA no `vercel.json`.
- Inventário: 350 telas, 16 módulos, 350 rotas únicas (`docs/INVENTARIO_350_TELAS.{json,md,csv}`).
- Catálogos: social 14 PNGs (25 telas cada) + memorial; admin 350 SVGs; mobile 13 PNGs (`public/Telas Versao mobili`).
- Backend `backend/` (Express, 7 rotas, `tsx tests/domain.test.ts`) **em ligação na FASE 2 (este turno)**:
  antes não ligado (`VITE_API_URL` × `VITE_API_BASE_URL` divergiam; sem proxy `/api`;
  `.env` local apontava para o próprio frontend `flow-web-mu.vercel.app/api/v1`, que o
  fallback SPA do `vercel.json` reescreve para `index.html`).
  Regra FASE 2: `VITE_API_BASE_URL` canônica (absoluta, backend `/api/v1`);
  `VITE_API_URL` só fallback depreciado; proxy `/api` no `vite.config.ts` (dev);
  `apiRequest` com fail-fast + guarda content-type (nunca aceitar HTML como sucesso).
- Firebase: Auth/Firestore/Storage/Analytics via getters seguros; rules cobrem
  users/posts/likes/comments/follows/saved/newsletter/communities/reports/schedules/consents.
- PWA: manifest + `sw.js` (cache v2) + `flow.ico` + `logo.png`; sem PNG 192/512 dedicados.
- Camada de serviços Firebase completa para: auth, posts, likes, comments, follows,
  saved, schedules, communities, newsletter, consentimento, stats.

## 2. Feito (por fase)
- FASE 2 (histórica): build/typecheck verdes; fix `}` em `admin.css`; fonte Inter no entry CSS.
- FASE 2 (ligação backend→frontend, este turno): `VITE_API_BASE_URL` canônica absoluta
  (`client.ts:getApiBaseUrl` + fail-fast + guarda content-type anti-HTML-do-SPA);
  proxy `/api` no `vite.config.ts` (dev); `CORS_ORIGIN` multiorigem (prod + `localhost:3000`);
  `backend/.env.example` criado; em prod o fetch é direto ao backend absoluto —
  sem rewrite `/api` no `vercel.json` (proxy Vercel só faria sentido com backend fixo
  embutido; o fallback SPA permanece só para rotas do frontend).
  Achado: `.env` local apontava para o próprio frontend (`flow-web-mu.vercel.app/api/v1`).
- FASE 3: componentização (layout canônico, social, profile, schedule, creator,
  auth layout/tipos, 15 telas memorial extraídas, hooks, UI states).
- Site público (`/`): 13 componentes `components/site/*`, Light UI, botões reais,
  comunidades/newsletter/stats com estados honestos (sem números falsos).
- Consentimento: TermsGate único (scroll-até-fim), aceite versionado (`consents/{uid}`),
  guarda `/app`, recusa com `?reason=consent_declined`.
- Merge `ad7d438`: módulos remotos + TermsGate no contexto; `components/public` paralelo removido.
- FASE 4 (histórica): memorial em Configurações (aba Legado & Memorial → rota real);
  like/save com persistência Firestore (otimista + reversão); seguir real no perfil;
  títulos dinâmicos por rota; `VITE_API_BASE_URL` no client; remoção de órfãos mock;
  ícones PWA 192/512 gerados do logo oficial.
- AUTOMÁTICO (este turno, REGRA DE CONCLUSÃO FLOW §0):
  FASE 1 fim dos mocks (feed/stories/RightRail/módulos/creator/FlowWeb apagado/
  PlatformModules e Rewards honestos/`CommerceHub`+`ShopOrderCenter` apagados);
  FASE 3 fan-out real de notificações (like/follow) + serviços stories/messages/
  notifications/creator/memorial/audit; FASE 4 settings/2FA (backup codes uso único,
  reset via `oobCode`, SMS/código com erro honesto, appeals com regra);
  FASE 5 memorial (solicitações, homenagens, acompanhamento por protocolo, legado,
  representante, denúncias/remoção); FASE 6 admin real (users, moderação, conteúdo,
  comunidades, logs de auditoria, analytics+CSV, settings, auth só Firebase+papel);
  FASE 7 CI com frontend lint/build + backend test/build; FASE 8 `React.lazy` por rota
  (build confirma chunks por página); FASE 10 SW v3 com bypass de `/api` (Firebase/
  API fora do cache).
- EXECUTOR MASTER TODO (este turno, docs `conversas chat gpt/TODO` 1–7 lidos):
  consentimento textual da especificação; `OfflineNotice` + `InstallAppPrompt` reais;
  metadata/SEO (robots, canonical, OG/Twitter/JSON-LD já existentes); `ModuleCenter`
  com persistência + enforcement (`ModuleGate`); `SiteEditor` com `site_pages` real;
  admin real: Messages, Notifications, Memorial, RH, Relatórios, Sistema, Suporte +
  `PermissionGuard` + badge real + footer com /health real + fallback fictício removido;
  Developer `/developer` real (dashboard, APIs+tester, Firebase, logs, envs, docs);
  backend `GET /api/v1/meta` + validação de reports; `ReportDialog` no PostCard;
  órfãos removidos; vitest + 18 testes + `pnpm test`; Playwright real 4/4;
  `AUDITORIA_FINAL_FLOW.md` criado. Ver relatório §34 do TODO na resposta final.
- Infra: `F:` é exFAT (sem symlinks) — `pnpm install` padrão QUEBRA o `node_modules`;
  usar `pnpm install --node-linker=hoisted`. Não commitar `pnpm-lock.yaml` (remoto usa bun/npm).

## 3. Mapa mock/static (auditoria — arquivo:linha)
| # | Local | Problema | Estado |
|---|---|---|---|
| 1 | `SocialFeed` DEFAULT_STORIES (8) | stories fixos | FEITO (removidos; `stories.ts` real + vazio honesto) |
| 2 | `usePosts` CANONICAL_POST | post fallback sempre listado | FEITO (removido; loading/erro/vazio honestos) |
| 3 | `RightRail` SUGGESTIONS/TRENDS | sugestões fixas | FEITO (comunidades reais + hashtags reais; some quando vazio) |
| 4 | `FlowWeb` pics/posts/pravatar | demo legado (ramos mortos no roteamento) | FEITO (arquivo apagado; rotas → `SiteHome`) |
| 5 | `localRepositories` + `contracts` | FakeRepository órfão | FEITO (removidos) |
| 6 | `publicCommunitiesService` | joins em localStorage | FEITO (removido; vale `firebase/communities`) |
| 7 | módulos `INITIAL_*` + toggles locais | dados fixos, like/save/join locais | FEITO (Firestore por módulo: messages, notifications, communities, saved, explore, shorts) |
| 8 | `alert()` admin/commerce/modules | sem operação real | FEITO (todos removidos: CSV/export reais, clipboard real ou disabled honesto) |
| 9 | `PostCard` compartilhar/more | sem handler | FEITO (share → clipboard real; fallbacks honestos; contagem real) |
| 10 | `AuthPage` SMS/código | `setMessage` + timeout, sem backend | FEITO parcial (SMS/código: erro honesto, sem simulação; reset via `oobCode` real; 2FA via backup codes reais; SMS/TOTP-app: PENDENTE provedor) |
| 11 | `SettingsModule` save local | "salvo" sem persistir | FEITO (perfil/prefs/2FA/backup-codes reais) |
| 12 | memorial telas 351–365 | conteúdo estático local | FEITO parcial (solicitações, homenagens, acompanhamento, legado, representante, denúncias/remoção reais; persona do catálogo mantida como contexto) |
| 13 | admin dados | Produtos/usuários fixos em páginas | FEITO (users, reports, posts, communities, audit, settings, analytics reais; auth admin só Firebase+papel) |
| 14 | `creatorVideos` | demo criador | FEITO (removidos; métricas reais posts/seguidores/curtidas; views "—") |
| 15 | `ProfileHeader` seguir | sem handler | FEITO (toggleFollow real + Seguindo/Seguir) |
| 16 | feed like/save | só locais | FEITO (toggleLike/toggleSaved Firestore, otimista + reversão) |
| 17 | `CommerceHub`/`ShopOrderCenter` demo | páginas mortas com dados fictícios | FEITO (arquivos apagados; políticas puras mantidas) |
| 18 | `AdminAuthContext` demo | sessão admin local sem Firebase | FEITO (só Firebase + papel admin/moderator; sem fallback) |
| 19 | `verify2FACode`/`terminateSession`/`submitAccountAppeal` | stubs/sucesso fictício | FEITO (backup-codes uso único; sessões só atual real; appeals com regra + erro honesto) |

## 4. Faltas priorizadas (restantes honestas)
1. Marketplace/seller/orders/ads/rewards/events: sem backend → telas em estado PENDENTE honesto (Fase 9).
2. Provedor SMS + TOTP por app autenticador + Apple login: PENDENTES (2FA hoje = backup codes reais).
3. Séries históricas/analytics (views, retenção, dispositivos) e distribuição demográfica: PENDENTES (Fase 8 fez split por rota; contagens reais no admin).
4. Stories: coleção + regras prontas (`stories.ts`); criação de story: PENDENTE.
5. Amizades no filtro de privacidade de homenagens; chamadas de voz/vídeo; anexos de mensagens: PENDENTES (botões desabilitados honestos).
6. `!important` em CSS legado; `social-reference.css` órfão: PENDENTES (dívida técnica).
7. 350 telas: concluída só com fluxo ponta a ponta (REGRA §0). Cobertura real: feed, explorar, shorts, mensagens, notificações, comunidades, salvos, configurações, perfil, memorial, auth, admin, site home. Restante (marketplace, business, ads, events, páginas, stories-criação, parte do admin) PENDENTE.
8. IP do aceite (sem backend p/ capturar); user-agent registrado.
9. Bootstrap admin: conceder `role: 'admin'` em `users/{uid}` no Firestore (login admin exige papel real).
