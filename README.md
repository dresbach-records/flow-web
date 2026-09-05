# FLOW — Conecte. Compartilhe. Viva.

A FLOW é uma plataforma de rede social independente, construída do zero, com o objetivo de conectar pessoas, comunidades, criadores e histórias reais.

> **Repositório MASTER integrado** (frontend + backend + infraestrutura) — ambiente de desenvolvimento, integração, testes e validação de ponta a ponta.
> A separação oficial em repositórios (frontend / backend / servidor) está documentada em [`docs/production/repositories.md`](docs/production/repositories.md).

---

## O que é a FLOW

Uma rede social real, com:

- **Feed** com ranking, abas "Para você" / "Seguindo" e paginação por cursor;
- **Perfis** com dados reais, seguir/deixar de seguir e contadores ao vivo;
- **Publicações** com mídia, reações, comentários (com respostas), salvos, denúncias e bloqueios;
- **Comunidades**, **Eventos**, **Stories** (24h), **Shorts**, **Mensagens** em tempo real e **Notificações** (in-app + Web Push);
- **Agendamento de publicações**, **Central do Criador**, **Memorial**, **Busca** e **Exploração**;
- **Painel administrativo** completo com RBAC, auditoria e moderação;
- **PWA** (instalável, offline-first, push) e design responsivo mobile-first;
- **Backend Express** com API versionada, notificações push, moderação por IA (opt-in), agendador e métricas.

### Princípios inegociáveis

1. **Zero mock / zero static funcional** — a UI reflete sempre o estado real; o que não existe é exibido com estados vazios honestos.
2. **Regra de conclusão** — nenhuma funcionalidade é "concluída" sem fluxo ponta-a-ponta (UI → serviço → persistência → autorização → estados → testes).
3. **Autorização real no servidor** — Firestore Rules + backend; nunca confiar apenas no frontend.
4. **Arquitetura evolutiva** — construída para crescer de aplicação a plataforma de grande escala sem reescrita.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 · TypeScript · Vite 8 · CSS por componente · Lucide |
| Persistência | Firebase (Authentication · Cloud Firestore · Storage · Analytics) |
| Backend | Node.js · Express · Firebase Admin SDK · Zod · web-push · Vertex AI (Guardian) |
| Testes | Vitest · Playwright |
| PWA | manifest · Service Worker (`flow-shell-v3`) · push VAPID |
| Deploy | Vercel (frontend) · backend próprio (`api.flowsocial.fun`) |

---

## Começando

Pré-requisitos: **Node.js 20+** e **pnpm**.

```bash
# Frontend (raiz)
pnpm install
pnpm dev            # http://localhost:3000

# Backend
cd backend
npm install
cp .env.example .env   # preencher Firebase + VAPID (nunca commitar)
npm run dev            # http://localhost:8080
```

Variáveis de ambiente: consulte [`.env.example`](.env.example) (frontend) e [`backend/.env.example`](backend/.env.example).

| Variável | Produção | Desenvolvimento |
|---|---|---|
| `VITE_API_BASE_URL` | `https://api.flowsocial.fun/v1` | `http://localhost:8080/api/v1` |
| `VITE_SITE_URL` | `https://flowsocial.fun` | *(vazio → fallback)* |

---

## Áreas do produto

| Área | Rotas |
|---|---|
| Site institucional | `/`, `/produto`, `/sobre`, `/recursos`, `/imprensa`, `/comunidades`, `/criadores`, `/baixar-app`, `/ajuda`, `/seguranca`, `/privacidade`, `/termos`, `/contato`, `/contribua`, `/blog`, `/carreiras` |
| Autenticação | `/login`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`, `/verificar-email`, `/seguranca/2fa*`, `/conta/*`, `/central-contas` |
| Rede social | `/app` (feed), `/app/explorar`, `/app/shorts`, `/app/stories`, `/app/pesquisa`, `/app/post/:id`, `/app/mensagens`, `/app/notificacoes`, `/app/comunidades`, `/app/eventos`, `/app/salvos`, `/app/perfil`, `/app/criador`, `/app/agendamento`, `/app/criar`, `/app/configuracoes` |
| Memorial | `/memorial*`, `/configuracoes/memorial` |
| Administração | `/admin/*` (RBAC) |
| Desenvolvedor | `/developer/*` (admin) |

---

## Arquitetura

```
src/
├── app/            # páginas e módulos de produto
│   ├── commerce/   # políticas de marketplace (domínio puro)
│   ├── memorial/   # módulo memorial (telas 351–365)
│   ├── modules/    # módulos autenticados
│   ├── rewards/    # recompensas (domínio puro)
│   └── site/       # site institucional
├── admin/          # painel administrativo
├── developer/      # painel de desenvolvedor
├── components/     # biblioteca de componentes reutilizáveis
├── contexts/       # AppContext (auth/consent), PlayerContext
├── hooks/          # usePosts, useProfile, useSeo, ...
├── core/           # domínio puro (ModuleRegistry)
├── layouts/        # AppShell, BottomNav, FloatingPlayer
├── services/       # FRONTEIRA DE INTEGRAÇÃO (Firebase + API)
│   ├── api/        #   cliente HTTP
│   ├── firebase/   #   serviços de dados
│   └── ...
└── styles/         # design tokens + css global
```

Regra de camadas:

```
Páginas → Componentes → Hooks/Contextos → Services → (Firebase/API) → Backend → Firestore
```

- **`services/`** é a única fronteira de integração com Firebase/API. Componentes **não** chamam Firestore diretamente.
- Regras de negócio complexas vivem em funções puras testadas (`commerce`, `core`, validações de formulário).
- Backend segue **Presentation → Application → Domain → Infrastructure** (em `backend/src`).

---

## Backend / API

Documentação: [`docs/architecture/07-API-ARCHITECTURE.md`](docs/architecture/07-API-ARCHITECTURE.md) e [`docs/architecture/38-API-CATALOG.md`](docs/architecture/38-API-CATALOG.md).

Rotas principais (`backend/src/main.ts`):

- `GET /health`, `GET /api/v1/meta`, `GET /api/v1/metrics`
- `POST /api/v1/auth/register` (login é client-side via Firebase)
- `GET /api/v1/feed`
- `POST /api/v1/posts`, `POST /api/v1/posts/:id/like`
- `POST /api/v1/reports`, `POST /api/v1/contact`, `POST /api/v1/contributors`
- `POST /api/v1/notify`, `POST/DELETE /api/v1/push/subscribe`
- `GET /api/v1/admin/storage-audit`

---

## Comandos

```bash
pnpm lint / pnpm typecheck   # tsc -b
pnpm test                    # Vitest (unit)
pnpm build                   # Vite build
pnpm exec playwright test    # E2E
cd backend && npm test       # testes de domínio do backend
cd backend && npm run build  # build do backend
```

---

## Contribua com o Flow

A FLOW é um projeto em fase inicial e busca pessoas interessadas em contribuir com tecnologia, produto, design, infraestrutura e inovação.

- Página institucional: **[/contribua](https://flowsocial.fun/contribua)** (formulário de interesse real).
- Transparência desde o primeiro commit: a participação nesta etapa é voluntária e não constitui promessa de emprego, salário, sociedade ou remuneração futura. Condições futuras, se houver, serão formalizadas individualmente.
- Veja [`CONTRIBUTING.md`](CONTRIBUTING.md) para mais detalhes.

---

## Licença

**Todos os direitos reservados.** © 2026 Flow Serviços Online LTDA.

Este repositório é **privado**. Não é permitido copiar, distribuir, sublicenciar ou utilizar o código, os assets, o design ou o conteúdo para qualquer finalidade sem autorização prévia e expressa. Consulte [`LICENSE`](LICENSE).

---

## Documentação

- **Mestre de engenharia:** [`docs/FLOW_ENGINEERING_MASTER_PLAN.md`](docs/FLOW_ENGINEERING_MASTER_PLAN.md)
- **Arquitetura:** [`docs/architecture/`](docs/architecture/) (46 documentos + ADRs)
- **Produção (domínio/DNS/e-mail):** [`docs/production/`](docs/production/)
- **Inventário de telas:** [`docs/Inventario/`](docs/Inventario/) (350 telas)

© 2026 Flow Serviços Online LTDA. Todos os direitos reservados.