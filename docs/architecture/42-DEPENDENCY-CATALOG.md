# 42 — DEPENDENCY CATALOG

> Catálogo de dependências. Status: **vivo**.

---

## 1. Frontend (root `package.json`)

### Dependencies
| Pacote | Versão | Uso |
|---|---|---|
| `firebase` | 12.18.0 | Auth/Firestore/Storage/Analytics |
| `lucide-react` | 1.39.0 | ícones |
| `react` | 19.2.8 | UI |
| `react-dom` | 19.2.8 | DOM |

### DevDependencies
| Pacote | Versão | Uso |
|---|---|---|
| `@playwright/test` | ^1.62.1 | E2E |
| `@types/node` | ^26.4.1 | tipos |
| `@types/react` | 19.2.18 | tipos |
| `@types/react-dom` | 19.2.5 | tipos |
| `@vitejs/plugin-react` | 6.1.1 | build |
| `sharp` | ^0.35.4 | processamento de imagem (futuro) |
| `typescript` | 5.9.3 | typecheck |
| `vite` | 8.2.2 | build/dev |
| `vitest` | ^5.0.0 | unit tests |

### Scripts
`dev`, `build` (`vite build`), `lint`/`typecheck` (`tsc -b`), `test` (`vitest run`), `preview`.

## 2. Backend (`backend/package.json`)

| Pacote | Uso |
|---|---|
| `express` | HTTP |
| `firebase-admin` | Admin SDK |
| `firebase` | (cliente — para compat) |
| `@google/genai` | Gemini |
| `web-push` | push VAPID |
| `argon2` | hash |
| `jsonwebtoken` | tokens |
| `zod` | validação |
| `cors`, `helmet`, `express-rate-limit` | segurança |
| `dotenv` | env |
| Dev: `typescript`, `tsx`, `@types/*` | tooling |

## 3. Lockfiles (3 — atenção!)

| Lockfile | Uso |
|---|---|
| `pnpm-lock.yaml` | canônico do frontend (pnpm) |
| `package-lock.json` | root (npm) e `backend/` |
| `bun.lock` | bun (presente na raiz) |

> **[DÍVIDA]** Multiplos lockfiles geram divergência. Recomendado: padronizar pnpm no frontend, npm no backend, remover `bun.lock`/`package-lock.json` da raiz.

## 4. Serviços externos

| Serviço | Env | Uso |
|---|---|---|
| Firebase Auth | `VITE_FIREBASE_*` | auth |
| Firestore | (mesma config) | dados |
| Storage | `VITE_FIREBASE_STORAGE_BUCKET` | mídia |
| Analytics | `VITE_FIREBASE_MEASUREMENT_ID` | analytics |
| Backend Express | `VITE_API_BASE_URL` | API |
| Vertex AI Gemini | `GOOGLE_*`, `FLOW_GUARDIAN_*` | moderação |
| VAPID/web-push | `VAPID_*` | push |
| Vercel | — | deploy frontend |
| GA4 gtag | `G-F75DJGFEBX` (index.html) | analytics |

## 5. Dependências futuras recomendadas (ver `45-ROADMAP.md`)

- Redis/Upstash (cache), Cloud Tasks/pub-sub (filas), Meilisearch/Algolia (busca), `@testing-library/react` (testes de componente), OpenTelemetry SDK, Postgres/BigQuery (analytics), `web-push` (já), sharp (já — ativar).

## 6. Regras

1. Avaliar necessidade antes de instalar.
2. Evitar duplicidade (firebase, react, etc. não devem existir em versões divergentes).
3. Manter lockfiles coerentes.
4. Rodar `pnpm lint && pnpm test && pnpm build` após instalar.