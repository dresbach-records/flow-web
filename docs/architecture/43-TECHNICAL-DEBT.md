# 43 — TECHNICAL DEBT

> Registro de dívida técnica. Status: **vivo**. Fonte: auditorias (`AUDITORIA_FINAL_FLOW.md`, `INVENTARIO_TECNICO_MASTER_FLOW.md`) + inspeção atual.

---

## 1. Dívidas de código

| # | Dívida | Local | Severidade | Ação |
|---|---|---|---|---|
| 1 | Componentes monolíticos | `AuthPage` (~704 linhas), `SettingsModule` (~584), `MemorialModule` (histórico 1071, já decomposto) | média | decompor em componentes por tela |
| 2 | Import direto de Firestore fora de services | `ReportDialog`, `RightRail`, `SiteContato` | média | centralizar em services |
| 3 | CSS com `!important` | ~12 ocorrências | baixa | limpar e consolidar |
| 4 | Nav para rotas inexistentes | `/app/musica`, `/app/busca`, `/app/live`, `/app/afiliados`, `/app/criar/post` | média | ajustar destinos ou 404 |
| 5 | `superadmin` inalcançável | guards/tipos | baixa | alinhar tipos de role |
| 6 | Layouts legado ORPHAN | `src/layouts/*` (Legacy*) | baixa | remover após FASE 4 |
| 7 | Single-file components | `ReportDialog.tsx`, `AppErrorBoundary.tsx` | baixa | padrão de pasta |
| 8 | `src/store/index.ts` vestigial | store | baixa | usar ou remover |
| 9 | `src/pages/index.ts` barrel legado | pages | baixa | limpar |

## 2. Dívidas de dados/infra

| # | Dívida | Local | Severidade | Ação |
|---|---|---|---|---|
| 10 | Índices duplicados | `firestore.indexes.json` (memorial_requests ×2, tributes ×2) | baixa | limpar |
| 11 | Contadores derivados (memberCount, likesCount) podem driftar | communities, posts | média | recomputação/eventos |
| 12 | Cache em memória (perde em restart/multi-instância) | backend `cache.service` | média | Redis |
| 13 | Métricas em memória | backend `metrics.service` | média | persistir/Prometheus |
| 14 | Scheduler no processo HTTP | backend | média | worker/fila externa |
| 15 | Carga de credenciais Firebase só por JSON file | `firebase-admin.ts` | baixa | suportar env vars |
| 16 | Múltiplos lockfiles | raiz (bun/package) | baixa | padronizar pnpm |
| 17 | `temp_clone/` versionado | repo raiz | média | remover do git (bloat) |
| 18 | Fallback localStorage de consentimento | `consent.ts` | baixa | reavaliar |

## 3. Dívidas de produto/funcional (ver também `44-GAP-ANALYSIS.md`)

| # | Área | Status |
|---|---|---|
| 19 | Marketplace/seller/orders/ads/rewards | [NÃO IMPLEMENTADO] (Fase 9) |
| 20 | SMS/TOTP 2FA + Apple login | [NÃO IMPLEMENTADO] |
| 21 | Story creation via CreateHub | [PARCIAL] |
| 22 | Séries históricas de analytics | [NÃO IMPLEMENTADO] |
| 23 | Push massivo (admin) | [NÃO IMPLEMENTADO] |
| 24 | Repost persistente, menções | [NÃO IMPLEMENTADO] |
| 25 | Paginação de comentários | [PARCIAL] |
| 26 | CSS de layout consolidado (`app-layout.css`, `site-fidelity.css`) | [PARCIAL] |

## 4. Dívidas de processo

| # | Dívida |
|---|---|
| 27 | Env `VITE_API_BASE_URL` pode apontar para o frontend (Vercel) em produção |
| 28 | Bootstrap manual de `role: 'admin'` |
| 29 | Backend sem deploy de produção |
| 30 | Testes de componentes/regras ausentes |
| 31 | Documentação de arquitetura (este catálogo) era inexistente |

## 5. Priorização sugerida

**P0 (agora):** 27, 28 (operacional), 29 (deploy backend).
**P1:** 2, 4, 11, 12, 19 (gaps de produto), 24.
**P2:** 1, 3, 6, 8, 10, 16, 17, 22.
**P3:** 5, 7, 9, 13, 14, 15, 18, 20, 21, 23, 25, 26, 30.