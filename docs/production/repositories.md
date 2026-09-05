# FLOW — Separação de Repositórios (Master → Oficiais)

> Plano de separação do MASTER integrado em repositórios oficiais.
> Última revisão: 2026-09-05 · Status: **vivo** · Não contém secrets.

---

## 1. Objetivo

O MASTER continua sendo o **ambiente integrado** de desenvolvimento, testes e validação. O código final, após validação, é sincronizado para repositórios oficiais.

| Repositório | Destino | Responsabilidade |
|---|---|---|
| Frontend | `flow-social-network/front-end-flow` | UI, PWA, componentes, clientes HTTP |
| Backend | `flow-social-network/beckend-flow` | API, domínio, repositórios, providers, integrações |
| Servidor/Infra | `flow-social-network/servidor-flow` | Docker, deploy, reverse proxy, DNS/SSL, monitoramento |

Domínios: frontend `https://flowsocial.fun` · API `https://api.flowsocial.fun`.

## 2. Auditoria de classificação

### FRONTEND (→ front-end-flow)
```
src/                      # React/TS completo (app, admin, developer, components, hooks, services, styles)
public/                   # assets, PWA (manifest, sw.js), catálogos, logos
index.html, vite.config.ts, vitest.config.ts, playwright.config.ts, tsconfig*.json
package.json (raiz), pnpm-lock.yaml
tests/                    # E2E
vercel.json
```
- `src/services/api/client.ts` — cliente HTTP (usa `VITE_API_BASE_URL`).
- `src/services/firebase/*` — cliente Firebase (config pública via `VITE_FIREBASE_*`).
- **Nunca** incluir credenciais admin/backend.

### BACKEND (→ beckend-flow)
```
backend/
  src/config, src/domain, src/application, src/infrastructure, src/services, src/middleware
  src/main.ts, src/seed-admin.ts, src/seed-marina.ts
  backend/tests/domain.test.ts
  backend/package.json, backend/tsconfig.json, backend/.env.example
```
- Firebase Admin credentials, VAPID private, CORS, Neon `DATABASE_URL` → **somente secrets/env**.
- Migrations (futuro/Neon) pertencem ao backend.

### SERVIDOR / INFRAESTRUTURA (→ servidor-flow)
```
docker/ docker-compose.yml        # (a criar, quando definida a infra)
scripts/deploy/                   # (a criar)
configs reverse-proxy/nginx       # (a criar)
docs de operação, monitoramento, rollback
```
- **Nenhum** código de negócio do backend ou frontend.
- **Nenhum** secret.

### SHARED (contratos)
- Hoje não existe diretório `shared` físico. Contratos entre frontend/backend são duplicados de forma leve (tipos em `src/services` e validação no backend).
- `[RECOMENDADO]` quando houver necessidade: criar `shared/contracts`/`shared/schemas` claramente documentados, evitando acoplamento excessivo.

### DOCUMENTATION / CONFIGURATION / TESTS
- `docs/` → pode ficar no MASTER; trechos operacionais vão para `servidor-flow`.
- `firestore.rules`, `firestore.indexes.json`, `storage.rules` → **backup em backend** (e aplicados ao Firebase).
- `.github/workflows/*` → CI de frontend (raiz) e backend.

## 3. Dependências cruzadas (a tratar)

| Dependência | Frente | Backend | Tratamento |
|---|---|---|---|
| `src/services/api/client.ts` → backend | ✔ | ✔ | env `VITE_API_BASE_URL` |
| `src/services/contributors.ts` → `POST /api/v1/contributors` | ✔ | ✔ | contrato de API documentado |
| `firestore.rules` (frontend e backend usam) | ✔ | ✔ | versionar no backend; deploy via Firebase |
| env `VITE_FIREBASE_*` | ✔ | — | config pública |
| `VAPID_PUBLIC` (backend entrega p/ frontend via `/meta`) | ✔ | ✔ | private só no backend |
| `sharp` (devDependency frontend) p/ mídia | ✔ | — | pode migrar p/ backend (transcode) |

## 4. Fluxo de sincronização (obrigatório)

```text
MASTER
  → IMPLEMENTAÇÃO
  → TESTES (lint, typecheck, vitest, backend tests, E2E)
  → BUILD (frontend + backend)
  → VALIDAÇÃO manual
  → STATUS OK
  → SYNC front-end-flow
  → SYNC beckend-flow
  → SYNC servidor-flow
```

Regras:
- **Nunca** sincronizar código quebrado.
- **Nunca** apagar o master.
- **Nunca** enviar secrets.
- Commits claros: `feat(frontend): sync validated Flow frontend`, `feat(backend): sync validated Flow API`, `chore(infra): update production server configuration`.
- Branch principal: `main`.
- Preservar histórico; sem force push; rollback para commit anterior.

## 5. Status atual da sincronização

| Repositório | Status | Observação |
|---|---|---|
| `flow-social-network/front-end-flow` | ⚠️ **PENDENTE** | Repositório não acessível com o token atual (`Could not resolve`). Sincronizar após validação e acesso. |
| `flow-social-network/beckend-flow` | ⚠️ **PENDENTE** | Idem. |
| `flow-social-network/servidor-flow` | ⚠️ **PENDENTE** | Idem. |

> O conteúdo foi **validado** (lint/typecheck/testes/build) no MASTER. A sincronização para os repositórios oficiais exige acesso de escrita a eles e deve ser executada como etapa deliberada, seguindo o fluxo acima.

## 6. Checklist pré-sync

- [ ] `git status` limpo e revisado.
- [ ] Sem secrets em arquivos versionados (`.env`, service accounts, chaves privadas).
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build` ✓.
- [ ] Backend `npm test`, `npm run build` ✓.
- [ ] `.gitignore` cobre `.env*`, segredos, `dist/`, `node_modules`.
- [ ] URLs centralizadas (env), sem hardcode de `flowsocial.fun` espalhado.
- [ ] Documentação de DNS atualizada (`docs/production/dns.md`).

## 7. Riscos

- Repositórios oficiais ainda não acessíveis → sincronização bloqueada (dependência externa).
- Divergência de código se o MASTER evoluir sem sincronizar → documentar cada sync.
- Copiar credenciais entre repositórios → proibido.
- Env apontando para o frontend em produção → CI deve validar `VITE_API_BASE_URL`.