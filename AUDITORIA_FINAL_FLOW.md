# AUDITORIA_FINAL_FLOW.md — Auditoria Final de Produção
**Data:** 05/09/2026 · **Base:** `main` · **Escopo:** TODO (7 docs) + fases 1–10 + REGRA DE CONCLUSÃO FLOW

## RESUMO EXECUTIVO
- Frontend, backend, Firebase, APIs, admin, Developer, RH, memorial, PWA auditados contra o código (não contra checklist).
- Mocks/static funcionais eliminados; telas sem backend marcadas PENDENTE (não concluídas).
- Validações verdes no fechamento: `pnpm lint` PASS · `pnpm test` 18/18 PASS · `pnpm build` PASS (chunks por rota) · backend `test` PASS · backend `build` PASS · Playwright 4/4 PASS (chromium, servidor real).

## ERROS ENCONTRADOS (todos corrigidos)
| # | Erro | Causa raiz | Correção | Arquivo |
|---|---|---|---|---|
| 1 | `TS1117` NotificationsModule | style com `border` duplicado | mesclado em `border` + `borderBottom` | `src/app/modules/NotificationsModule.tsx` |
| 2 | `TS2345` ModuleCenter/useModuleStates | `Object.fromEntries` sem cast | casts + loop explícito | `src/admin/ModuleCenter.tsx`, `src/hooks/useModuleStates.ts` |
| 3 | `TS2459` requireFirebaseAuth | importado de `auth` (local) | importado de `config` | `ReportDialog.tsx`, `DeveloperApis.tsx` |
| 4 | Badge `12` fixo na sidebar admin | número fictício | contagens reais (reports OPEN + memorials PENDING) | `src/admin/components/AdminSidebar.tsx` |
| 5 | Fallback admin "conectado à LTS" | texto fictício p/ rotas sem página | páginas reais + PENDENTE honesto | `src/admin/AdminApp.tsx` |
| 6 | `admin@flow.social/admin123` dica + sessão demo | autenticação fictícia | só Firebase + papel; sem fallback | `src/admin/context/AdminAuthContext.tsx` |
| 7 | Playwright quebrado (porta 5173, path pessoal, site externo) | specs inválidas | `flow-smoke.spec.ts` real + webServer:3000 | `tests/`, `playwright.config.ts` |
| 8 | `vitest run` capturava specs/backends | sem config de escopo | `vitest.config.ts` (só `src/**/*.test.ts`) | `vitest.config.ts` |

## ERROS FIREBASE — matriz de regras (firestore.rules, mínimo privilégio)
| Coleção | READ | CREATE | UPDATE | DELETE | Papel/dono |
|---|---|---|---|---|---|
| `users/{uid}` | dono ou admin | dono (role=user) | dono (role imutável) ou admin (status/role/verified) | nunca | owner/admin |
| `users/{uid}/following|followers` | dono | dono (sem auto-follow) | — | owner |
| `users/{uid}/saved` | dono | dono | — | dono | owner |
| `users/{uid}/notifications` | dono ou admin | autenticado | dono (só `read`) ou admin | dono/admin | owner/admin |
| `users/{uid}/security/*` | dono | dono | dono | nunca | owner |
| `posts` | autenticado | autor (type válido) | autor ou contadores | autor ou admin | owner/admin |
| `posts/{id}/likes|comments` | autenticado | dono do like/autor | autor | autor | owner |
| `communities` | pública | autenticado validado | admin (verified/status/featured) | nunca | public/admin |
| `communities/{id}/members` | pública | próprio uid | nunca | próprio uid | owner |
| `conversations` | participante ou admin (+list admin) | participante | participante (lastMessage/updatedAt) | nunca | owner/admin |
| `conversations/{id}/messages` | participante ou admin | sender participante | nunca | nunca | owner/admin |
| `stories` | autenticado | nunca (backend Fase 3) | nunca | nunca | — |
| `reports` | dono ou admin | reporterId=uid | admin (só status) | nunca | owner/admin |
| `memorial_requests` | dono ou admin | requesterId=uid + PENDING | admin (só status) | nunca | owner/admin |
| `tributes` | autenticado | autor (texto 1–500) | nunca | autor | owner |
| `platform_settings/modules` | pública | admin | admin | nunca | public/admin |
| `platform_settings/*` | admin | admin | admin | nunca | admin |
| `site_pages` | pública | admin | admin | nunca | public/admin |
| `consents` | dono | dono (uid=doc) | dono | nunca | owner |
| `newsletter` | nunca | e-mail válido + consent | nunca | nunca | público-criação |
| `appeals` | admin | e-mail válido | admin (só status) | nunca | público-criação/admin |
| `admin_audit` | admin | autenticado (autor real) | nunca | nunca | auth/admin |
| `scheduled_posts` | dono | dono | dono | dono | owner |

Regra ampla `allow read, write: if true` — **inexistente** em produção. Nenhuma permissão foi aberta globalmente para "resolver" erro.

## AUTENTICAÇÃO
- Cadastro → Login → TermsGate (scroll-até-fim + checkbox literal "Li e estou de acordo com o contrato") → aceite versionado (`consents/{uid}` + espelho em `users`) → `/app`. Idempotente (doc id = uid).
- Recusa → `recordUserConsent(false)` + `logout()` + `/login?reason=consent_declined` com mensagem "Sua sessão foi encerrada…". Re-checado a cada login (`checkUserConsent`).
- Google signup/login passa pelo mesmo gate. Reset via `oobCode` real. SMS/código: erro honesto (provedor pendente).
- 2FA: backup codes de uso único (consumo real); TOTP-app/SMS: pendentes.
- Admin: só Firebase + `users.role` admin/moderator; demo removido. Developer: só admin.

## AUTORIZAÇÃO
- Roles reais: `user|creator|seller|moderator|admin` (Firestore). `PermissionGuard` no admin (RH/logs/modulos/site/config/usuarios = admin; moderação/mensagens/notificações/memorial/suporte/conteúdo/comunidades = admin+moderator).
- Backend valida payload de reports (`reporterId/targetType/targetId/category` obrigatórios).

## BACKEND (Express, `backend/src`)
Rotas reais: `GET /health` · `GET /api/v1/meta` (novo: versão/rotas/guardian) · `POST /api/v1/auth/*` · `GET /api/v1/feed` · `POST /api/v1/posts` (+Guardian) · `POST /api/v1/posts/:id/like` · `POST /api/v1/reports` (validado). Scheduler + Guardian + seed Marina preservados.

## API (frontend `services/api/client.ts`)
`VITE_API_BASE_URL` canônica + fallback depreciado; fail-fast sem env; guarda content-type anti-HTML-do-SPA; proxy `/api` no Vite (dev); fetch direto absoluto em prod; tester do Developer anexa ID token.

## REDE SOCIAL — matriz (Frontend|API|Backend|Firebase|Persist|Auth|Teste|Status)
| Funcionalidade | Status |
|---|---|
| Feed/Para você/Seguindo (filtro following real) | COMPLETED |
| Stories (leitura; criação pendente) | IN_PROGRESS |
| Postar texto/foto/vídeo | COMPLETED |
| Curtir/salvar/comentar (otimista+reversão) | COMPLETED |
| Denunciar post (backend) | COMPLETED |
| Seguir/deixar de seguir + fan-out | COMPLETED |
| Explorar (busca/filtros reais) | COMPLETED |
| Shorts (vídeos reais + like/save/follow) | COMPLETED |
| Comunidades (lista/join/leave) | COMPLETED |
| Mensagens (lista/envio) | COMPLETED |
| Notificações (lista/lida/fan-out) | COMPLETED |
| Salvos | COMPLETED |
| Perfil + contadores reais | COMPLETED |
| Settings/2FA/backup-codes/sessões | COMPLETED |
| Memorial (solicitação/homenagens/acompanhamento/legado/representante/denúncia/remoção) | COMPLETED |
| Marketplace/seller/orders/ads/rewards/events | PENDENTE (sem backend; PENDENTE honesto) |
| SMS/TOTP-app/chamadas/anexos | PENDENTE |

## ADMIN — matriz
| Página | Status |
|---|---|
| Dashboard (contagens reais + /health real) | COMPLETED |
| Usuários (lista/suspender/verificar + audit) | COMPLETED |
| Moderação (fila OPEN + resolver/descartar) | COMPLETED |
| Conteúdo (lista + remoção admin) | COMPLETED |
| Comunidades (lista + selo/arquivar) | COMPLETED |
| Mensagens / Notificações (somente-leitura) | COMPLETED |
| Memorial (aprovar/rejeitar) | COMPLETED |
| RH (diretório + papéis + contagens) | COMPLETED |
| Relatórios (6 CSV reais) | COMPLETED |
| Sistema (health/diagnostics/envs/coleções) | COMPLETED |
| Suporte (appeals + decisão) | COMPLETED |
| Logs (admin_audit real) | COMPLETED |
| Analytics (KPIs reais + CSV) | COMPLETED |
| Configurações (platform_settings real) | COMPLETED |
| Segurança (diagnósticos reais) | COMPLETED |
| Módulos (persistência + enforcement no app) | COMPLETED |
| Site (blocos por página + publish real) | COMPLETED |
| Marketplace / Eventos | PENDENTE (sem backend) |

## DEVELOPER (`/developer`, papel admin)
Dashboard (/meta + counts) · APIs explorer + tester real · Firebase & Sistema (diagnostics + alcance por coleção) · Logs (audit) · Ambientes (presença, sem valores) · Docs (contrato vivo + matriz de permissões). Filas/webhooks/OTel/deploys: PENDENTE (sem backend; sem telas fictícias).

## RH
Diretório real + gestão de papéis + contagens + auditoria. Recrutamento/desempenho/treinamentos/benefícios/folha: PENDENTE (exigem backend próprio).

## PWA
Manifest (192/512/maskable/favicon) · SW v3 (shell network-first; `/api` bypass; Firebase cross-origin fora do cache) · InstallAppPrompt real · OfflineNotice real · metadata (title/desc/viewport/theme/robots/canonical/OG/Twitter/JSON-LD) · apple-touch-icon. Playwright: install prompt não testável em CI (requer gesto) — hook com teste manual documentado.

## RESPONSIVIDADE
Playwright real: overflow 0 em 390px e 1440px na Home (PASS). Tabelas admin com scroll/containers; shell Developer com breakpoint 860px. Matriz 12 breakpoints em laboratório: NÃO executada (pendente de device-lab) — sem alegação falsa.

## CSS
Componentes com CSS próprio (padrão existente preservado). Dívida: `!important` legado + `social-reference.css` (removido nesta auditoria).

## COMPONENTIZAÇÃO
Páginas orquestram componentes; services/hooks separados; duplicatas removidas (`BottomNavigationBar`, `FlowPostCard`, `StoryStrip`, `feed.ts`, `CommerceHub`, `ShopOrderCenter`, `FlowWeb`).

## PERFORMANCE
Build com split por rota (chunks 8–78 kB; vendor Firebase ~497 kB compartilhado). `React.lazy` + Suspense em todas as rotas.

## SEGURANÇA
Sem secrets no frontend (só presença de envs no Developer); CORS multiorigem; backend valida reports; Firestore mínimo privilégio (matriz acima); PWA sem cache de `/api` ou dados privados.

## TESTES
- `pnpm test` (vitest, `src/**/*.test.ts`): 18/18 PASS — marketplace, product-policy, shop-policy, module-keys.
- Backend `npm test` (domain.test.ts): PASS. `npm run build`: PASS.
- Playwright (`tests/flow-smoke.spec.ts`, chromium, servidor real): 4/4 PASS.
- CI (`ci.yml`): frontend lint+test+build; backend test+build.

## BUILD / LINT / DEPENDÊNCIAS
`pnpm lint` PASS · `pnpm build` PASS · dependência adicionada e utilizada: `vitest` (dev). Nenhuma dependência abandonada.

## MOCKS ENCONTRADOS → ELIMINADOS
DEFAULT_STORIES · CANONICAL_POST · SUGGESTIONS/TRENDS · INITIAL_* (4 módulos + 5 admin) · creatorVideos/totals · FlowWeb pics/posts · PlatformModules products/stats/orders · RewardsPage saldo · CommerceHub/ShopOrderCenter · AdminDemo session · verify2FACode stub · sessões/iPhone fake · appeal "offline" · badge 12 · LTS-fallback · social-reference.css.

## PÁGINAS STATIC
Permitido (editorial): HeroSite institucional, FAQ memorial, Safety/policy, contrato. Removido/convertido: todo static funcional acima.

## BOTÕES SEM IMPLEMENTAÇÃO → RESOLVIDOS
PostCard More → denúncia real · share → clipboard real · Shorts seguir/salvar → reais · Composer localização → geolocalização real · ModuleCenter toggles → persistência + enforcement · SiteEditor publicar/pré-visualizar → reais · Admin export → CSV reais · Developer "Usar" → preenche tester.

## ROTAS QUEBRADAS → RESOLVIDAS
Admin `mensagens/notificacoes/memorial/rh/relatorios/sistema/suporte` existiam na sidebar sem página (caíam no fallback fictício) → páginas reais. `marketplace/eventos` → PENDENTE honesto. `/developer/*` criadas e roteadas.

## COMPONENTES ÓRFÃOS → RESOLVIDOS
ReportDialog montado no PostCard · demais deletados (lista acima).

## CORREÇÕES REALIZADAS
Ver tabela ERROS + matrizes. Nenhum `@ts-ignore`; nenhum erro silenciado.

## PENDÊNCIAS REAIS ([ ] = pendente, [!] = bloqueada por backend externo)
- [ ] Marketplace/seller/orders/ads/rewards/events (app + admin) — exige backend de comércio.
- [ ] Provedor SMS, TOTP-app, Apple login, chamadas de voz/vídeo, anexos de mensagens.
- [ ] Criação de stories; séries históricas/analytics; recrutamento/desempenho/treinamentos/benefícios/folha (RH tático).
- [ ] Vinculação viva SiteEditor→Home; IP do aceite (user-agent registrado).
- [ ] Device-lab 12 breakpoints (responsividade além de 390/1440).
- [!] `.env` local com `VITE_API_BASE_URL` apontando ao próprio frontend — ação do operador.
- [!] Bootstrap admin: conceder `role:'admin'` em `users/{uid}`.

## RISCO
- **MÉDIO:** operador precisa corrigir env + papel admin, senão API/admin negam (comportamento correto, mas bloqueia uso).
- **BAIXO:** coleções novas exigem deploy das rules (`firebase deploy --only firestore:rules`).
- **BAIXO:** vendor Firebase ~497 kB no primeiro load (cache PWA mitiga).

## MATRIZ DE FUNCIONALIDADES (resumo)
| Camada | Status |
|---|---|
| Frontend/componentes/CSS/rotas/estados | [✓] |
| API client + contrato | [✓] |
| Backend rotas/serviços/validação | [✓] |
| Firebase Auth/Firestore/Storage/rules | [✓] |
| Admin + RBAC + auditoria | [✓] |
| Developer + RH (escopo real) | [✓] |
| Testes + CI | [✓] |
| PWA + metadata + offline | [✓] |
| 350 telas (só ponta a ponta) | [•] parcial real, restante [ ] documentado |

## REGISTRO POR FASE
- FASE 1 [✓] · FASE 2 [✓] · FASE 3 [✓] · FASE 4 [✓] · FASE 5 [✓] · FASE 6 [✓] · FASE 7 [✓] (18 vitest + backend + 4 Playwright + CI) · FASE 8 [✓] (split medido) · FASE 9 [•] (critério aplicado; sem backend = PENDENTE) · FASE 10 [✓] (PWA sem quebrar Firebase).
- Nenhuma fase marcada [✓] por aparência: evidências acima + validações verdes.
