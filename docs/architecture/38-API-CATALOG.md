# 38 — API CATALOG

> Catálogo de endpoints. Status: **vivo**. Baseado em `backend/src/main.ts`.

---

## 1. Backend Express (implementado)

| # | Método | Rota | Auth | Descrição | Erros |
|---|---|---|---|---|---|
| 1 | GET | `/health` | — | health check + flag guardian | 500 |
| 2 | GET | `/api/v1/meta` | — | meta, versão, rotas, VAPID, cache stats | — |
| 3 | GET | `/api/v1/metrics` | sim | métricas em memória | 401 |
| 4 | POST | `/api/v1/auth/register` | — | registro (Admin SDK + users doc) | 400/409 |
| 5 | POST | `/api/v1/auth/login` | — | **sempre 401** (client-side auth) | 401 |
| 6 | GET | `/api/v1/feed` | — | feed cronológico (15s cache) | 400 |
| 7 | POST | `/api/v1/posts` | — | criar post + Guardian | 422/503/400 |
| 8 | POST | `/api/v1/posts/:id/like` | — | like (transação) | 404/401 |
| 9 | POST | `/api/v1/reports` | — | criar denúncia | 400 |
| 10 | POST | `/api/v1/contact` | — | mensagem de contato | 400 |
| 11 | POST | `/api/v1/notify` | sim | notificação in-app + push | 401/400/NOTIFY_SELF |
| 12 | POST | `/api/v1/push/subscribe` | sim | registrar inscrição push | 400 |
| 13 | DELETE | `/api/v1/push/subscribe` | sim | remover inscrição push | 400 |
| 14 | GET | `/api/v1/admin/storage-audit` | admin | auditoria de órfãos de storage | 403 |

## 2. Cliente usado pelo frontend (`src/services/api/client.ts`)

`apiRequest({ path, method, body, signal })` — base `VITE_API_BASE_URL` (default `http://localhost:8080/api/v1`), Bearer token, guarda contra HTML fallback.

## 3. Endpoints usados pelo frontend

| Serviço | Endpoint | Finalidade |
|---|---|---|
| `social.fanOut` | `POST /api/v1/notify` | notificação (fallback Firestore) |
| `push` | `GET /api/v1/meta`, `POST/DELETE /api/v1/push/subscribe` | push |
| `SiteContato` | `POST /api/v1/contact` | formulário |
| `ReportDialog` | `POST /api/v1/reports` | denúncia |
| `AdminShell/Dashboard/Sistema` | `GET /health` | status backend |
| `Developer*` | `GET /api/v1/meta`, `GET /health` | painel dev |

## 4. Endpoints planejados

| Endpoint | Status | Necessário para |
|---|---|---|
| `GET /api/v1/feed/me` (ranked) | [PLANEJADO] | ranking server-side |
| `GET /api/v1/search` | [PLANEJADO] | busca indexada |
| `POST /api/v1/media/presign` | [PLANEJADO] | upload grande |
| `GET /api/v1/admin/analytics/series` | [PLANEJADO] | séries históricas |
| Marketplace CRUD | [PLANEJADO] | commerce |
| Messages via API | [PLANEJADO] | fila/offline |
| Webhooks | [PLANEJADO] | developer |

## 5. Convenções

- Envelope atual: corpo direto (sem `data/meta`). Padronizar `[PLANEJADO]`.
- Erros: códigos estáveis + mensagem pt-BR no client.
- Auth: `Authorization: Bearer <ID token>`.
- Rate limit: writes 30/min/IP.

## 6. Matriz método→permissão

| Rota | Role mínima | Nota |
|---|---|---|
| `/health`, `/api/v1/meta` | pública | — |
| `/api/v1/feed`, `/api/v1/posts`, `/api/v1/reports`, `/api/v1/contact` | pública | (posts com token opcional p/ Guardian) |
| `/api/v1/metrics`, `/api/v1/notify`, `/api/v1/push/*` | autenticado | — |
| `/api/v1/admin/*` | admin | `requireAdmin` |