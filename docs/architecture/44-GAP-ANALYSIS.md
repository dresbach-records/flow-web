# 44 — GAP ANALYSIS

> FLOW ATUAL vs ARQUITETURA NECESSÁRIA PARA REDE SOCIAL MADURA. Status: **vivo**.
> Estado: "produto intermediário avançado — Nível 3 completo, Nível 4 parcial".

---

## 1. Tabela de gaps

| Área | Atual | Objetivo | Gap | Risco | Prioridade | Esforço | Dependências |
|---|---|---|---|---|---|---|---|
| Núcleo social (feed, posts, likes, comments, follow, salvar, bloquear) | Nível 3 | Nível 4 | baixo | baixo | P0 | concluído | — |
| Comunidades | Nível 3 | Nível 4 | baixo | baixo | P0 | concluído | — |
| Mensagens (realtime, read) | Nível 3 | Nível 4 | médio (anexos, fila offline, chamadas) | médio | P1 | médio | fila/Storage |
| Notificações | Nível 3 | Nível 4 | médio (fan-out assíncrono, preferências, sistema) | médio | P1 | médio | fila |
| Events | Nível 3 | Nível 4 | baixo | baixo | P1 | baixo | — |
| Stories | Nível 3 | Nível 4 | médio (criação via hub, vídeo) | baixo | P1 | baixo | — |
| Agendamento | Nível 3 | Nível 4 | baixo | baixo | P1 | concluído | — |
| Memorial | Nível 3 | Nível 4 | baixo | baixo | P1 | concluído | — |
| Admin | Nível 3 | Nível 4 | médio (marketplace/eventos/séries) | médio | P1 | médio | backend commerce |
| RBAC/Regras | Nível 4 | Nível 4 | baixo | baixo | P0 | concluído | — |
| Push nativo | Nível 2 | Nível 4 | alto | médio | P1 | médio | backend (parcial) |
| Ranking | Nível 2 (client) | Nível 3–4 | alto | médio | P2 | alto | backend, dados |
| Busca | Nível 2 (client) | Nível 4 | alto | médio | P2 | alto | índice FTS |
| Marketplace/seller/orders | Nível 1 (contratos puros) | Nível 4 | alto | alto | P1–P2 | alto | backend commerce, pagamentos |
| Ads/Rewards | Nível 1 | Nível 4 | alto | médio | P2 | alto | backend |
| Realtime generalizado | Nível 2 (parcial onSnapshot) | Nível 4 | médio | médio | P2 | médio | infra |
| Cache | Nível 2 (memória/SW) | Nível 4 | alto | médio | P1–P2 | médio | Redis |
| Filas/eventos | Nível 1 (síncrono) | Nível 4 | alto | alto | P1–P2 | alto | Cloud Tasks |
| Observabilidade | Nível 2 | Nível 4 | alto | médio | P2 | médio | OTel/Prometheus |
| CI/CD | Nível 3 | Nível 4 | médio | baixo | P1 | médio | — |
| DR/Backup | Nível 1 | Nível 4 | alto | alto | P1 | médio | scheduler GCS |
| PWA | Nível 3 | Nível 4 | baixo | baixo | P1 | concluído | — |
| Analytics produto | Nível 2 | Nível 4 | alto | médio | P2 | alto | eventos |
| 2FA (SMS/TOTP), Apple login | Nível 2 | Nível 4 | médio | médio | P1 | médio | provedor SMS |
| Menções/repost/amizade | Nível 1 | Nível 4 | alto | médio | P2 | médio | grafo |

## 2. Gaps críticos priorizados

**P0 (operacional, bloqueia produção madura):**
1. Env `VITE_API_BASE_URL` correto + backend implantado.
2. Bootstrap `role: admin` + deploy de Firestore rules/índices.
3. Backup/DR (export Firestore).

**P1 (competitividade e risco):**
4. Fan-out assíncrono (filas) para notificações/feed.
5. Push nativo robusto.
6. Marketplace/events admin.
7. Redis/cache distribuído.
8. Deploy backend + CI gates de segurança.
9. Paginação completa (comentários).

**P2 (maturidade):**
10. Ranking server-side.
11. Busca indexada (FTS).
12. Realtime generalizado.
13. Observabilidade (OTel).
14. Analytics de produto.

**P3 (visão longa):**
15. ML/recomendação, embeddings, semântica.
16. Multi-região, sharding, escala massiva.

## 3. Riscos

| Risco | Impacto | Prob. | Mitigação |
|---|---|---|---|
| Fan-out síncrono perde notificações em escala | engajamento | médio | fila |
| Quota Firestore com leituras N+1 | custo/latência | médio | cache + batch + API |
| Contadores drift | métricas erradas | médio | recomputação |
| Backend sem deploy | funcionalidades dependentes inativas | alto | deploy P0 |
| MarketPlace sem backend | não existe (honesto) | — | roadmap |
| Env apontando p/ frontend | API quebrada | médio | CI env check |

## 4. Esforço relativo

Legenda: 🟢 baixo (≤1 semana), 🟡 médio (1–3 sem), 🔴 alto (>3 sem).

- 🟢: paginação, séries simples, segurança de env, backup.
- 🟡: filas, Redis, push, marketplace MVP, deploy backend.
- 🔴: ranking server-side, busca FTS, realtime completo, ML.

## 5. Conclusão

A FLOW não precisa ser reconstruída. Os gaps são **aditivos** (novas capacidades + infra) sobre um núcleo sólido e real. A ordem de implementação está em `45-ROADMAP.md`.