# 24 — TESTING STRATEGY

> Status do documento: **vivo**.

---

## 1. Estado atual

| Camada | Ferramenta | Cobertura atual |
|---|---|---|
| Unit (domínio) | Vitest | `src/app/commerce/__tests__/` — 18 testes (marketplace, product-policy, shop-policy, social-graph) |
| Backend unit/domain | `tsx tests/domain.test.ts` | domínio do backend (prohibited categories, protection window) |
| E2E | Playwright | `tests/flow-smoke.spec.ts` — 4 testes (home, auth redirect, 404, páginas públicas, sem overflow) |
| Lint/typecheck | `tsc -b` (pnpm lint/typecheck) | todo o src |
| Build | `vite build` | — |

Comandos:
- `pnpm lint` / `pnpm typecheck` → `tsc -b`
- `pnpm test` → `vitest run` (`src/**/*.test.ts`)
- `pnpm build` → `vite build`
- Backend: `cd backend && npm test` / `npm run build`
- E2E: `pnpm exec playwright test`

## 2. Pirâmide de testes

```
        E2E  (poucos, críticos)
       ____
      /    \
     / INTEG \ (services x Firebase local/emulador)
    /__________\
   /    UNIT     \  (puras, vitest) ← base
  /________________\
```

## 3. Gaps

| Camada | Estado |
|---|---|
| Unit de componentes | [NÃO IMPLEMENTADO] |
| Unit de hooks/services | [PARCIAL] |
| Integração com Firebase emulador | [NÃO IMPLEMENTADO] |
| Contract tests (API) | [NÃO IMPLEMENTADO] |
| Security tests | [NÃO IMPLEMENTADO] |
| Load/Stress | [NÃO IMPLEMENTADO] |
| Chaos | [NÃO IMPLEMENTADO] |

## 4. Recomendações

### 4.1 Unit
- Testar funções puras (policies, ranking, extractHashtags, validações) — padrão já usado no commerce.
- Adicionar testes para `services/feed/ranking.ts`, `utils`, `consent`, `scheduling`.

### 4.2 Component
- `@testing-library/react` (adicionar dependência) para componentes com estado (PostCard, CommentsPanel, ScheduleComposer).
- Testar estados loading/empty/error/success.

### 4.3 Integração
- **Emulador Firebase** (`firebase emulators:start` com seed) para services de Firestore.
- Testar regras de segurança (positivo/negativo por role).

### 4.4 Contract
- Validar respostas do backend contra schema (zod) — smoke do contrato.

### 4.5 E2E
- Expandir fluxos críticos: registro→login→post→like→comment→follow→notify.
- Admin: RBAC positivo/negativo.
- Mobile viewports.

### 4.6 Load
- k6 ou artillery para feed/API.
- Metas em `25-PERFORMANCE-ARCHITECTURE.md`.

### 4.7 Security
- Testar Firestore Rules (emulador), CORS, rate limit.

## 5. CI/CD

- `ci.yml`: lint/typecheck → vitest → build; backend test/build.
- `playwright.yml`: E2E + artefato de relatório.
- Ver `29-CI-CD.md`.

## 6. Roadmap

1. **[IMPLEMENTADO]** Unit puro + backend domain + E2E smoke + lint/build.
2. **[PLANEJADO] P1** — emulador Firebase + testes de integração/regras, testing-library para componentes.
3. **[PLANEJADO] P2** — contract tests, testes de carga, testes de segurança.
4. **[PLANEJADO] P3** — chaos/DR drills (ver `28-DISASTER-RECOVERY.md`).