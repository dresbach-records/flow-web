# 35 — DEVELOPER HANDBOOK

> Guia prático para trabalhar na FLOW.

---

## 1. Setup

```bash
# Frontend (root)
pnpm install
pnpm dev            # localhost:3000

# Backend
cd backend
npm install
cp .env.example .env   # preencher Firebase + VAPID
npm run dev             # localhost:8080

# Env do frontend
cp .env.example .env.local   # preencher VITE_FIREBASE_* e VITE_API_BASE_URL
```

- Proxy dev: `/api` → backend via `vite.config.ts`.
- Node 24.x (backend), Vite 8.

## 2. Comandos

| Comando | O que faz |
|---|---|
| `pnpm lint` / `pnpm typecheck` | `tsc -b` |
| `pnpm test` | Vitest (unit) |
| `pnpm build` | Vite build |
| `pnpm exec playwright test` | E2E |
| `cd backend && npm test` | testes de domínio backend |
| `cd backend && npm run build` | build backend |
| `cd backend && npm run seed:admin -- user@email.com` | bootstrap admin |

## 3. Arquitetura em 1 minuto

```
Páginas → Componentes → Hooks/Contextos → Services (Firebase/API) → Backend → Firestore
```

- **Regra de camadas**: services são a única fronteira de integração. Componentes NÃO chamam Firestore.
- **Regra de conclusão**: nada é "done" sem UI + service + persistência + authz + estados + (idealmente) teste.
- **Zero mock / zero static funcional.**

## 4. Onde colocar o quê

| O que | Onde |
|---|---|
| Página nova | `src/app/` ou `src/app/modules/` |
| Componente reutilizável | `src/components/<dominio>/<Component>/` |
| Hook de feature | `src/hooks/` |
| Serviço Firebase | `src/services/firebase/<dominio>.ts` (e exportar no barrel `index.ts`) |
| Regra de negócio pura | `src/app/commerce/*` ou `src/core/*` + teste |
| Rota | `src/App.tsx` (`AppContentResolver` / `resolveSiteRoute`) |
| Admin | `src/admin/pages/` + rota em `AdminApp.tsx` + guard |
| Backend endpoint | `backend/src/main.ts` + service |
| Firestore rules | `firestore.rules` + índices em `firestore.indexes.json` |

## 5. Convenções

- TypeScript strict. React 19. CSS por componente. `lucide-react` para ícones.
- Light UI only (sem dark mode).
- pt-BR na UI.
- Estados assíncronos: `LoadingState` / `EmptyState` / `ErrorState`.
- Sem `console.log` em produção (usar padrão `[FLOW]` em warns).

## 6. Padrão de componente

```
Component/
├── Component.tsx
├── Component.css
├── Component.types.ts
└── index.ts
```

## 7. Alterar esquema de dados

1. Atualizar `firestore.rules`.
2. Adicionar índices em `firestore.indexes.json`.
3. Atualizar/criar service em `src/services/firebase/`.
4. Rodar `pnpm lint && pnpm test && pnpm build`.
5. (se admin) auditoria via `logAdminAction`.

## 8. Adicionar dependência

- Avaliar necessidade; evitar duplicidade (ex.: 3 lockfiles existem — usar pnpm no root).
- Instalar e rodar `pnpm lint && pnpm test && pnpm build`.

## 9. Segurança ao codar

- Nunca colocar segredos no código/env público.
- Nunca confiar no frontend para autorização — sempre rules/backend.
- Usar `requireFirebaseAuth()`/`requireFirestore()` (lançam claro).
- Auditoria em ações administrativas.

## 10. Testes

- Funções puras → Vitest em `src/**/*.test.ts`.
- E2E → `tests/flow-smoke.spec.ts` (Playwright).
- Backend domain → `backend/tests/domain.test.ts`.

## 11. Documentação

- Arquitetura → `docs/architecture/`.
- Mudanças arquiteturais relevantes → ADR em `docs/architecture/adr/`.
- Decisões de produto → `docs/PROGRESSO_FLOW.md` (vivo).