# FLOW-WEB — Registro de progresso (feito + faltas)

> Atualizado a cada turno. Base: `ad7d438` (merge home + consentimento).
> Scripts oficiais: `pnpm dev/build/preview`, `pnpm lint` (= `tsc -b`), `pnpm typecheck` (= `tsc -b`).
> NÃO existem scripts `test`/`lint:eslint` — sem testes automatizados no repo.

## 1. Estado da base (auditoria)
- Typecheck PASS, build PASS. Rotas: SPA manual (`history.pushState` + `popstate`) em `src/App.tsx`; fallback SPA no `vercel.json`.
- Inventário: 350 telas, 16 módulos, 350 rotas únicas (`docs/INVENTARIO_350_TELAS.{json,md,csv}`).
- Catálogos: social 14 PNGs (25 telas cada) + memorial; admin 350 SVGs; mobile 13 PNGs (`public/Telas Versao mobili`).
- Backend `backend/` (Express, 7 rotas, `tsx tests/domain.test.ts`) **não ligado** ao frontend
  (`VITE_API_URL` × `VITE_API_BASE_URL` divergem; sem proxy `/api` no vercel).
- Firebase: Auth/Firestore/Storage/Analytics via getters seguros; rules cobrem
  users/posts/likes/comments/follows/saved/newsletter/communities/reports/schedules/consents.
- PWA: manifest + `sw.js` (cache v2) + `flow.ico` + `logo.png`; sem PNG 192/512 dedicados.
- Camada de serviços Firebase completa para: auth, posts, likes, comments, follows,
  saved, schedules, communities, newsletter, consentimento, stats.

## 2. Feito (por fase)
- FASE 2: build/typecheck verdes; fix `}` em `admin.css`; fonte Inter no entry CSS.
- FASE 3: componentização (layout canônico, social, profile, schedule, creator,
  auth layout/tipos, 15 telas memorial extraídas, hooks, UI states).
- Site público (`/`): 13 componentes `components/site/*`, Light UI, botões reais,
  comunidades/newsletter/stats com estados honestos (sem números falsos).
- Consentimento: TermsGate único (scroll-até-fim), aceite versionado (`consents/{uid}`),
  guarda `/app`, recusa com `?reason=consent_declined`.
- Merge `ad7d438`: módulos remotos + TermsGate no contexto; `components/public` paralelo removido.
- FASE 4 (este turno): memorial em Configurações (aba Legado & Memorial → rota real);
  like/save com persistência Firestore (otimista + reversão); seguir real no perfil;
  títulos dinâmicos por rota; `VITE_API_BASE_URL` no client; remoção de órfãos mock;
  ícones PWA 192/512 gerados do logo oficial.
- Infra: `F:` é exFAT (sem symlinks) — `pnpm install` padrão QUEBRA o `node_modules`;
  usar `pnpm install --node-linker=hoisted`. Não commitar `pnpm-lock.yaml` (remoto usa bun/npm).

## 3. Mapa mock/static (auditoria — arquivo:linha)
| # | Local | Problema | Estado |
|---|---|---|---|
| 1 | `SocialFeed` DEFAULT_STORIES (8) | stories fixos | FALTA (aguarda Stories backend) |
| 2 | `usePosts` CANONICAL_POST | post fallback sempre listado | FALTA (remover quando feed real) |
| 3 | `RightRail` SUGGESTIONS/TRENDS | sugestões fixas | FALTA (serviço de sugestões) |
| 4 | `FlowWeb` pics/posts/pravatar | demo legado (ramos mortos no roteamento) | FALTA (aposentar arquivo) |
| 5 | `localRepositories` + `contracts` | FakeRepository órfão | FEITO (removidos) |
| 6 | `publicCommunitiesService` | joins em localStorage | FEITO (removido; vale `firebase/communities`) |
| 7 | módulos `INITIAL_*` + toggles locais | dados fixos, like/save/join locais | FALTA (firestore por módulo) |
| 8 | `alert()` admin/commerce/modules | sem operação real | FALTA |
| 9 | `PostCard` compartilhar/more | sem handler | FALTA |
| 10 | `AuthPage` SMS/código/2FA-metodo | `setMessage` + timeout, sem backend | FALTA (provedor SMS/2FA real) |
| 11 | `SettingsModule` save local | "salvo" sem persistir | FALTA |
| 12 | memorial telas 351–365 | conteúdo estático local | FALTA (persistência memorial) |
| 13 | admin dados | Produtos/usuários fixos em páginas | FALTA (coleções reais) |
| 14 | `creatorVideos` | demo criador | FALTA (analytics real) |
| 15 | `ProfileHeader` seguir | sem handler | FEITO (toggleFollow real + Seguindo/Seguir) |
| 16 | feed like/save | só locais | FEITO (toggleLike/toggleSaved Firestore, otimista + reversão; exceto fallback canonical) |

## 4. Faltas priorizadas
1. Firestore por módulo (feed já real; mensagens, notificações, communities seed, shorts, saved já lê `saved`?*, explore, marketplace, rewards, events).
2. `SettingsModule.handleSave` real (perfil nome/bio) + 2FA real ( DOE `verify2FACode` retorna `true`!).
3. Aposentar `FlowWeb.tsx` (mover conteúdo institucional vivo para `components/site`).
4. Memorial backend (solicitações, homenagens, representantes, moderação).
5. Admin com dados reais (usuários, moderação, relatórios, analytics).
6. Testes (inexistentes) + lint eslint (inexistente); backend `tests/domain.test.ts` nunca executado em CI.
7. Code-splitting (`React.lazy`) — bundle >500kB; `!important` em CSS legado; `social-reference.css` órfão.
8. 350 telas: cobertura real ≈ módulos app (feed, explorar, shorts, mensagens, notificações,
   comunidades, salvos, configurações, perfil, memorial, auth, admin parcial, site home).
   Restante (marketplace, business, ads, events, páginas, stories, grande parte do admin) PENDENTE.
9. `verify2FACode` simulado; SMS sem provedor; Apple login ausente (botão só no banner).
10. IP do aceite (sem backend p/ capturar); user-agent registrado.

\*: a verificar.
