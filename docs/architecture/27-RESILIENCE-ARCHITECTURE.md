# 27 — RESILIENCE ARCHITECTURE

> Status do documento: **vivo**.

---

## 1. Princípios

- **Graceful degradation**: a FLOW deve funcionar parcialmente quando dependências falham (ex.: Firebase config ausente → modo local com aviso).
- **Honestidade**: nunca fingir que uma operação foi persistida quando não foi.
- **Best-effort para fan-outs**, crítico para writes de dados.

## 2. Padrões atuais

| Padrão | Onde | Estado |
|---|---|---|
| Fallback | `fanOut` (notify API → Firestore); `FirebaseRuntimeNotice` (modo local) | [IMPLEMENTADO] |
| Timeout | `FLOW_GUARDIAN_TIMEOUT_MS`, health 8s no AdminShell | [IMPLEMENTADO] |
| Retry | HTTP client (via network), `retry` não generalizado | [PARCIAL] |
| Circuit breaker | — | [NÃO IMPLEMENTADO] |
| Backoff | — | [NÃO IMPLEMENTADO] |
| Idempotência | like (transação), consent (doc único), push sub (hash endpoint) | [PARCIAL] |
| Dead letter queue | — | [NÃO IMPLEMENTADO] |
| Fallback de UI | EmptyState/ErrorState/LoadingState | [IMPLEMENTADO] |
| Graceful degradation | search/explore client-side; modo local | [IMPLEMENTADO] |
| Health check | `GET /health`, AdminSistema | [IMPLEMENTADO] |
| Disaster recovery | — | ver `28-DISASTER-RECOVERY.md` |

## 3. Estratégias recomendadas

### 3.1 HTTP/API
- Timeout configurável + retry com backoff exponencial e jitter.
- Circuit breaker para dependências externas (Gemini, web-push, Firestore em falha contínua).
- Idempotência em writes (`Idempotency-Key`).

### 3.2 Filas
- Retry com backoff; DLQ; alertas em falhas persistentes.

### 3.3 Offline
- `OfflineNotice` + PWA shell.
- `[PLANEJADO]` fila de operações offline com idempotência e reconciliação.

### 3.4 Dependências externas
- Gemini: timeout + fallback (permitir publicação com revisão se IA indisponível? — decisão de política).
- web-push: best-effort (remover endpoints mortos 410/404).
- Firebase: modo local + aviso quando config ausente.

## 4. Mapa de falhas e resposta

| Falha | Impacto | Resposta atual | Melhoria |
|---|---|---|---|
| Firebase config ausente | auth/dados indisponíveis | modo local + banner | falhar build em placeholder |
| Backend indisponível | notify/push/contato | fallback Firestore / erro honesto | circuit breaker |
| Gemini timeout | moderação | 503 no post | política de fallback |
| Firestore quota | lentidão | erro honesto | cache + batch |
| Push service fora | push | best-effort | retry |
| CDN/Storage | mídia | URL quebrada | fallback placeholder |

## 5. Testes de resiliência

- Testes de falha de API (mock de fetch).
- Playwright: simular offline/online.
- `[PLANEJADO]` chaos drills (derrubar backend/Firebase em staging).

## 6. Roadmap

1. **[IMPLEMENTADO]** Fallbacks, timeouts, health, honestidade, app-shell.
2. **[PLANEJADO] P1** — retry/backoff/circuit breaker no client HTTP, fila offline.
3. **[PLANEJADO] P2** — circuit breaker backend, DLQ, chaos tests.