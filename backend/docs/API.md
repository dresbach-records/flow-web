# FLOW API — Documentação de Endpoints

Base (produção): `https://api.flowsocial.fun` · Base local: `http://localhost:8080`

Todas as respostas são JSON. Erros usam o formato:

```json
{ "error": "CODIGO" }
```

## Health

### `GET /health` — pública
```json
{ "status": "ok", "service": "flow-api", "guardian": "enabled" }
```

### `GET /health/readiness` — pública
Verifica conexão com Firestore (timeout 3s).
```json
{ "status": "ok", "service": "flow-api", "firestore": "connected" }
```

## Metadados

### `GET /api/v1/meta` — pública
Versão, flags, VAPID public, rotas e cache.

## Autenticação

### `POST /api/v1/auth/register` — pública
Body: `{ "email", "password", "username", "displayName", "cpf?" }`
→ `201 { "id", "email", "username", "displayName" }`

### `POST /api/v1/auth/login` — pública
Body: `{ "email", "password" }`
→ `200 { "error": "USE_FIREBASE_CLIENT_AUTH" }` (login é client-side no Firebase).

## Feed

### `GET /api/v1/feed?mode=for-you|following&limit=30&before=ISO` — pública
Paginado via cursor `before` (data ISO do último item).
```json
{ "items": [ { "id": "...", "...": "..." } ], "nextBefore": "ISO|" }
```

## Posts

### `POST /api/v1/posts` — pública
Body: `{ "authorId", "type": "post|short|video", "caption?", "mediaUrl?", "visibility?" }`
→ `201` post criado · `422 CONTENT_BLOCKED_BY_GUARDIAN` · `503 GUARDIAN_UNAVAILABLE`

### `POST /api/v1/posts/:id/like` — pública
Body: `{ "userId" }` → `200 { "liked": true }`

## Denúncias

### `POST /api/v1/reports` — pública
Body: `{ "reporterId", "targetType", "targetId", "category", "description?" }` → `201`

## Contato

### `POST /api/v1/contact` — pública
Body: `{ "name", "email", "subject", "category", "message" }` → `201`

## Contribuidores

### `POST /api/v1/contributors` — pública
Body: `{ "submissionId", "name", "email", "github?", "linkedin?", "areas", "experienceLevel", "portfolio?", "availability", "howToContribute", "message?" }`
→ `201` · `409 CONTRIBUTOR_DUPLICATE`

## Notificações (Bearer)

### `POST /api/v1/notify`
Body: `{ "targetUid", "type": "like|comment|follow|system", "actorName", "actorAvatar?", "text" }`
→ `201 { "id", "push": { "sent", "failed" } }`

## Web Push (Bearer)

### `POST /api/v1/push/subscribe`
Body: `{ "endpoint", "keys": { "p256dh", "auth" } }` → `201 { "id" }`

### `DELETE /api/v1/push/subscribe`
Body: `{ "endpoint" }` → `200 { "ok": true }`

## Métricas (Bearer)

### `GET /api/v1/metrics`
Uso por rota (contadores em memória da instância).

## Admin (Bearer + role `admin`)

### `GET /api/v1/admin/storage-audit`
Auditoria de arquivos órfãos no Storage (sem delete).

## Cron (protegido)

### `GET|POST /api/cron/publish`
Header `Authorization: Bearer <CRON_SECRET>` ou `x-vercel-cron: <CRON_SECRET>`.
Publica conteúdo agendado (personas + posts).
→ `200 { "ok": true, "publishedPersonaPosts": n, "publishedScheduled": n }` · `403 FORBIDDEN`