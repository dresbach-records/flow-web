# FLOW API — Auditoria e Preparação para Vercel

Data: 2026-09-05 · Serviço: `flow-api` · Domínio alvo: `api.flowsocial.fun`

## 1. Arquitetura encontrada

- **Framework HTTP:** Express 5 (ESM, `"type": "module"`).
- **Runtime:** Node.js (tsx em dev, `tsc` + `node` em prod).
- **Banco:** Firebase Admin SDK (Auth + Firestore + Storage).
- **IA:** Google GenAI (Vertex AI / Gemini) para moderação (Guardian), opcional via feature flag.
- **Entrada atual:** `src/main.ts` cria o app Express, conecta Firebase, inicia scheduler e chama `app.listen()` (servidor persistente).
- **Cache:** em memória (`Map`) com TTL.
- **Métricas:** contadores em memória por rota.
- **Rate limit:** `express-rate-limit` (store em memória, por instância).
- **Cron/Jobs:** `startPublicationScheduler()` com `setInterval` de 60s (processo persistente).
- **WebSocket/Realtime:** não há WebSocket no backend; tempo real do frontend é via Firestore (client SDK).
- **Testes:** `tests/domain.test.ts` (puro) — sem cobertura HTTP.

## 2. Rotas existentes

| Método | Rota | Auth | Notas |
|---|---|---|---|
| GET | `/health` | pública | health simples |
| GET | `/api/v1/meta` | pública | versão, rotas, VAPID, flags |
| GET | `/api/v1/metrics` | Bearer | métricas em memória |
| POST | `/api/v1/auth/register` | pública | cria usuário Firebase |
| POST | `/api/v1/auth/login` | pública | retorna `USE_FIREBASE_CLIENT_AUTH` |
| GET | `/api/v1/feed` | pública | paginado via `limit`/`before` |
| POST | `/api/v1/posts` | pública (corpo) | Guardian opcional |
| POST | `/api/v1/posts/:id/like` | pública (corpo) | transação Firestore |
| POST | `/api/v1/reports` | pública (corpo) | grava `reports` |
| POST | `/api/v1/contact` | pública (corpo) | grava `contact_messages` |
| POST | `/api/v1/contributors` | pública (corpo) | idempotente por `submissionId` |
| POST | `/api/v1/notify` | Bearer | notificação + Web Push |
| POST | `/api/v1/push/subscribe` | Bearer | salva subscription |
| DELETE | `/api/v1/push/subscribe` | Bearer | remove subscription |
| GET | `/api/v1/admin/storage-audit` | Bearer + role `admin` | auditoria órfãos |

## 3. Arquitetura proposta (Vercel Serverless)

```
api/index.ts  (Express app exportado — handler Vercel)
      ↓
src/app.ts  (createApp(): middleware + rotas)
      ↓
src/services/*  (casos de uso / lógica real)
      ↓
src/infrastructure/  (firebase-admin, guardian, database)
      ↓
Firebase (Auth / Firestore / Storage)
```

- `src/app.ts` = fábrica do app Express (sem `listen`, sem conexão, sem scheduler).
- `src/main.ts` = entry local persistente (`node dist/src/main.js`) — conecta, agenda, escuta.
- `api/index.ts` = handler Vercel que exporta o app.
- Scheduler `setInterval` → substituído por **Vercel Cron** em `/api/cron/publish` (protegido por `CRON_SECRET`).

## 4. Compatibilidade Vercel

| Aspecto | Antes | Depois | Compatível |
|---|---|---|---|
| Servidor persistente | `app.listen` | handler exportado | ✅ |
| Filesystem efêmero | `secrets/` local | env vars (`FIREBASE_PRIVATE_KEY` etc.) | ✅ |
| Service account | arquivo/ADC | env vars + fallback arquivo/ADC | ✅ |
| Scheduler 60s | `setInterval` | Vercel Cron `* * * * *` | ✅ |
| Cache em memória | `Map` | `Map` (por instância, TTL curto) | ⚠️ per-instance |
| Métricas em memória | `Map` | `Map` (por instância) | ⚠️ per-instance |
| Rate limit | memória | memória (best-effort) | ⚠️ per-instance |
| Firebase Admin | lazy singleton | lazy singleton | ✅ |
| Auth/Storage/Firestore | Admin SDK | Admin SDK | ✅ |

## 5. Problemas encontrados e correções

1. **`app.listen()` impedia Vercel** → extraído `createApp()` em `src/app.ts`.
2. **Scheduler persistente** → rota cron protegida `/api/cron/publish` + `vercel.json` `crons`.
3. **Service account só por arquivo** → suporte a `FIREBASE_CLIENT_EMAIL` + `FIREBASE_PRIVATE_KEY` (com `replace(/\\n/g, '\n')`) no `loadServiceAccount()`.
4. **Sem erro padronizado/404** → error handler global JSON + 404 JSON + `/health/readiness`.
5. **Sem teste HTTP** → `tests/api.test.ts` (health, meta, 404, cron 403).
6. **tsconfig não compilava `api/`** → `rootDir: "."`, include `src` + `api`, saída em `dist/src`/`dist/api`.
7. **Scripts desatualizados** → `start`/`seed:*` apontam para `dist/src/*`, adicionado `typecheck` e `vercel-build`.

## 6. Firestore

- `users/{uid}`, `posts/{id}`, `post_likes/{postId_userId}`, `reports/{id}`, `contact_messages/{id}`, `contributors/{submissionId}`, `guardian_moderations/{id}`, `push_subscriptions/{uid}/targets/{hash}`, `users/{uid}/notifications/{id}`, `audit_logs/{id}`, `personas/{id}`, `scheduled_posts/{id}`.
- Índices compostos existentes: `firestore.indexes.json` do repo raiz (posts por visibility+createdAt; scheduled por status+scheduledAt).
- Paginação: feed usa `limit`+`before`; scheduler/auditoria usam `limit`.

## 7. Segurança

- Helmet + CORS restrito (`CORS_ORIGIN`) + rate limit em rotas de escrita.
- Auth via Firebase ID Token (Bearer); admin via role no Firestore.
- Cron protegido por `CRON_SECRET`.
- Segredos nunca em código; `secrets/`, `.env*` no `.gitignore`.
- Stack nunca exposta em produção (error handler).

## 8. Variáveis de ambiente

| Variável | Obrigatória | Descrição |
|---|---|---|
| `FIREBASE_PROJECT_ID` | sim | Projeto Firebase |
| `FIREBASE_STORAGE_BUCKET` | sim | Bucket Storage |
| `FIREBASE_CLIENT_EMAIL` | Vercel | Service account (client_email) |
| `FIREBASE_PRIVATE_KEY` | Vercel | Service account (private_key, `\n` reais) |
| `CRON_SECRET` | Vercel | Segredo do Vercel Cron |
| `CORS_ORIGIN` | não | origens permitidas (padrão prod+dev) |
| `VAPID_PUBLIC`/`VAPID_PRIVATE`/`VAPID_SUBJECT` | não | Web Push |
| `FLOW_GUARDIAN_*` | não | Guardian (Gemini) |
| `GOOGLE_*` | não | ADC/local |

## 9. Build local

```
npm install
npm run build       # tsc → dist/
npm run typecheck   # tsc --noEmit
npm test            # domain + api
```

## 10. Riscos e pendências

- **Cache/métricas/rate-limit por instância**: aceitável para este estágio; para escala, migrar para Firestore/Redis.
- **`/api/v1/metrics`** expõe apenas dados por instância (útil por request).
- **Cron publica a cada minuto**: limite de 20 docs por coleção por execução; suficiente para o volume atual.
- **`/api/v1/auth/login`** ainda retorna `USE_FIREBASE_CLIENT_AUTH` (login é client-side) — manter contrato.
- **Deploy**: conectar o projeto na Vercel (função `api/index.ts`, variáveis acima), configurar domínio `api.flowsocial.fun` e o secret do cron.