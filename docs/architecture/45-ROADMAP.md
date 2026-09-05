# 45 — ROADMAP

> Roadmap arquitetural da FLOW. Status: **vivo**. Priorizar arquitetura evolutiva; não implementar tudo de uma vez.

---

## FASE 1 — Foundation ✅ (concluída)

- Estrutura modular, componentes, zero mock, Firebase real, shell responsivo.
- FASE 1 do TODO.MD concluída (mocks eliminados).

## FASE 2 — Production ✅ (concluída)

- Frontend↔Backend (client API, proxy dev), contratos, env.
- Backend Express básico (health/meta/notify).

## FASE 3 — Growth (core) ✅ (concluída)

- Backend real por módulo: communities, messages, notifications, memorial, shorts, explore.
- Componentização e design system.

## FASE 4 — Settings + 2FA ✅ (concluída parcial)

- Settings, 2FA (backup codes reais), sessões, consentimento.
- SMS/TOTP pendente (`[PLANEJADO]` P1).

## FASE 5 — Memorial ✅ (concluída)

- 15 telas (351–365), fluxo real (requests, tributes, legado, denúncia, remoção).

## FASE 6 — Admin ✅ (concluída)

- Admin real com RBAC, auditoria, fila de moderação, feature flags, site editor, relatórios.
- Marketplace/eventos admin pendentes.

## FASE 7 — Testes + CI ✅ (concluída)

- Vitest (18 testes de domínio), Playwright smoke, CI frontend+backend, E2E.

## FASE 8 — Performance ✅ (concluída parcial)

- Code-splitting, lazy Firebase, paginação de feed.
- Séries históricas, otimização de mídia pendentes.

## FASE 9 — 350 telas funcionais 🔄 (em andamento)

Regra: cada tela do inventário precisa de fluxo ponta-a-ponta (UI + service + persistência + authz + estados). Estado atual: núcleo social completo; marketplace/business/ads/rewards em placeholder honesto.

**Prioridade dentro da FASE 9:**
1. Marketplace/loja/pedidos (backend commerce + admin).
2. Events admin.
3. Rewards com backend.
4. Ads (backend).

## FASE 10 — PWA + Mobile ✅ (concluída parcial)

- Manifest, SW, install, push, bottom nav, responsividade.
- Safe areas, gestures, device-lab pendentes.

---

## Roadmap arquitetural futuro

### FASE 11 — Operational Excellence (P0/P1)
- [P0] Env correto + deploy do backend + backup Firestore.
- [P1] Filas (Cloud Tasks) para notificações/feed fan-out.
- [P1] Redis (cache distribuído).
- [P1] Push nativo robusto.
- [P1] Marketplace backend + admin.
- [P1] Paginação de comentários.
- [P1] 2FA SMS/TOTP + Apple login.

### FASE 12 — Scale (P2)
- [P2] Ranking server-side.
- [P2] Busca indexada (FTS — Meilisearch/Algolia).
- [P2] Realtime generalizado.
- [P2] Observabilidade (OpenTelemetry/Prometheus).
- [P2] Analytics de produto (eventos, funnels, séries).
- [P2] Menções/repost persistente.
- [P2] CI/CD: security scan, emulador Firebase, deploy backend.

### FASE 13 — High Availability (P2/P3)
- [P3] DR drills, PITR, multi-região.
- [P3] Feature flags com rollout gradual.
- [P3] Chaos tests.

### FASE 14 — Advanced Social Platform (P3)
- [P3] ML/recomendação (embeddings), feature store.
- [P3] Marketplace completo (pagamentos, antifraude).
- [P3] Analytics warehouse (BigQuery).

### FASE 15 — Massive Scale Preparation
- [P3+] Sharding de arestas, réplicas, autoscaling, global edge.

---

## Ordem sugerida de execução imediata

1. **Operacional P0**: env, deploy backend, backup, seed-admin.
2. **Filas**: notificações + feed fan-out (elimina risco de perda).
3. **Redis**: cache de feed/rank.
4. **Marketplace MVP** (backend + telas + admin).
5. **Busca indexada**.
6. **Observabilidade + analytics**.

## Critério de evolução (regras)

- Cada item só entra em "concluído" com fluxo ponta-a-ponta real.
- Extração de serviço exige justificativa (escala/isolamento/ownership/deploy/perf/disponibilidade/segurança).
- Não implementar ML fake; não simular dados.
- Toda mudança arquitetural relevante → ADR.