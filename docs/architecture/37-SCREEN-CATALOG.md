# 37 — SCREEN CATALOG

> Catálogo das telas da FLOW. Status: **vivo**.
> Referências: `docs/Inventario/INVENTARIO_350_TELAS.md` (+ CSV/JSON), catálogos visuais em `public/FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT/`, `public/FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT/`, `public/Telas Versao mobili/`.

---

## 1. Inventário das 350 telas (desktop)

- Fonte: `docs/Inventario/INVENTARIO_350_TELAS.csv/json/md` — **350 telas**, 16 módulos.
- Colunas (JSON/CSV): `id, modulo_id, modulo, tela, rota, finalidade, acoes, desktop, tema, estados, dados, observacoes`.
- Colunas (MD): `ID | Módulo | Tela | Rota | Finalidade | Ações`.

### Módulos e contagem

| Módulo | IDs | Qtd |
|---|---|---|
| Autenticação | 1–20 | 20 |
| Feed e publicações | 21–55 | 35 |
| Stories | 56–75 | 20 |
| Shorts | 76–95 | 20 |
| Perfil | 96–116 | 21 |
| Explorar e pesquisa | 117–135 | 19 |
| Mensagens | 136–155 | 20 |
| Notificações | 156–170 | 15 |
| Comunidades e grupos | 171–190 | 20 |
| Salvos e eventos | 191–210 | 20 |
| Marketplace | 211–230 | 20 |
| Páginas | 231–255 | 25 |
| Business Suite | 256–285 | 30 |
| Ads | 286–315 | 30 |
| Configurações | 316–345 | 30 |
| Segurança e moderação | 346–350 | 5 |

### Regras de inventário
- `desktop`: "1440+ responsivo"; `tema`: "Claro + Escuro" (mas produto atual é **Light UI only**); `estados`: loading;vazio;erro;sucesso; `dados`: "API/Firestore reais"; `observacoes`: "Sem ação visual sem destino; validar permissões e persistência."

## 2. Telas implementadas de fato (função ↔ rota)

> A auditoria histórica (`AUDITORIA_FLOW_WEB.md`) contabilizou **0 telas 100% implementadas, 39 parciais, 311 não implementadas** — esse era o estado "antes". O estado atual (após FASE 1–10) é mais maduro; a FASE 9 do TODO exige que cada tela seja funcional ponta-a-ponta. Mapeamento real por rota:

### 2.1 Autenticação (implementadas via `AuthPage` — 15 modos)
`/login`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`, `/verificar-email`, `/verificar-conta`, `/verificar-telefone` (SMS pendente), `/confirmacao`, `/seguranca/2fa`, `/seguranca/2fa/metodo`, `/seguranca/2fa/backup`, `/seguranca/sessoes`, `/conta/bloqueada`, `/conta/desativada`, `/conta/suspensa`, `/central-contas`.

### 2.2 Feed e publicações
`/app` (feed), `/app/post/:id`, `/app/criar`, `/app/criar/publicacao`, `/app/criar/video`, `/app/explorar`.

### 2.3 Stories / Shorts
`/app/stories` (real), `/app/shorts`, `/app/reels` (real). Criação de story: `StoriesComposer` real; criação via `CreateHub` marcada "em implementação".

### 2.4 Perfil / Explorar e pesquisa
`/app/perfil`, `/app/perfil/:uid`, `/app/pesquisa`.

### 2.5 Mensagens / Notificações
`/app/mensagens`, `/app/mensagens/:id`; `/app/notificacoes`. Solicitações/arquivadas: placeholder honesto.

### 2.6 Comunidades / Salvos / Eventos
`/app/comunidades`, `/app/comunidades/:id`; `/app/salvos`; `/app/eventos`, `/app/eventos/criar`, `/app/eventos/:id`.

### 2.7 Marketplace / Business / Ads / Rewards
`/app/shop`, `/app/loja`, `/app/pedidos`, `/app/rewards`, `/app/anunciar` → placeholders honestos (Fase 9), exceto `/app/denunciar` e `/app/seguranca` (reais).

### 2.8 Configurações
`/app/configuracoes` (+ conta/privacidade/seguranca/notificacoes/aparencia/bloqueados/sessoes).

### 2.9 Site público
Home + `/produto`, `/recursos`, `/sobre`, `/imprensa`, `/comunidades(/:slug)`, `/criadores(/:username)`, `/baixar-app`, `/ajuda(/:slug)`, `/seguranca`, `/privacidade`, `/termos`, `/contato`, `/blog*`, `/carreiras*`.

### 2.10 Memorial (telas 351–365)
`/memorial` e sub-rotas — 15 telas (9 reais, 6 estáticas). Ver `04-DOMAIN-ARCHITECTURE.md` §memorial.

### 2.11 Admin (350 telas admin no catálogo)
Painel real com 20 rotas (ver `22-ADMIN-ARCHITECTURE.md`). O catálogo visual `FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT/` contém 350 SVGs de referência — **referência visual**, não telas implementadas.

## 3. Mobile

- `public/Telas Versao mobili/` — 14 mockups PNG (home, login, perfil, mensagens, shorts, explorar, criar, etc.).
- Implementação mobile: mesma SPA responsiva + `BottomNav` (ver `21-PWA-MOBILE-ARCHITECTURE.md`).

## 4. Matriz TELA → COMPONENTE → SERVICE → DATABASE

| Tela (rota) | Componente | Service | Banco |
|---|---|---|---|
| `/app` | SocialFeed + PostCard + StoriesRail | `usePosts`, `social`, `stories`, `feed/ranking` | posts, stories, users/following |
| `/app/post/:id` | PostPage + CommentsPanel + ReportDialog | `social`, `firestore` | posts, comments, reports |
| `/app/comunidades` | CommunitiesModule + CommunityCard | `communities` | communities, members, memberships |
| `/app/mensagens` | MessagesModule | `messages` | conversations, messages |
| `/app/notificacoes` | NotificationsModule | `notifications` | users/{uid}/notifications |
| `/app/perfil/:uid` | ProfilePage + ProfileHeader/Tabs/PostCard | `useProfile`, `social` | users, posts |
| `/app/eventos` | EventsModule | `events` | events, rsvps |
| `/app/agendamentos` | ScheduleCenter + Schedule* | `scheduling` | scheduled_posts |
| `/app/criador` | CreatorCenter + Creator* | `creator` | posts, followers |
| `/app/configuracoes` | SettingsModule | `auth`, `consent`, `push` | users, security, blocks |
| `/admin/*` | AdminApp + pages | firebase CRUD | (ver `22-ADMIN`) |
| `/memorial/*` | MemorialModule + screens | `memorial` | memorial_requests, tributes, reports |

## 5. Conclusão

- O inventário de 350 telas é a **referência canônica de produto**.
- A FASE 9 (funcional ponta-a-ponta) está em andamento: núcleo social completo; marketplace/business/ads/rewards e telas visuais ainda não implementadas.
- **Regra**: tela com apenas mock/visual = **NÃO CONCLUÍDA** (ver `45-ROADMAP.md` FASE 9).