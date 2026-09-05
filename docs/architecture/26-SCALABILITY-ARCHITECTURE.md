# 26 — SCALABILITY ARCHITECTURE

> Status do documento: **vivo**. Não recomendar microserviços sem justificativa. Cada extração precisa de razão clara (escala, isolamento, ownership, deploy, performance, disponibilidade, segurança).

---

## 1. Níveis de maturidade

| Nível | Nome | Estado atual |
|---|---|---|
| 1 | Single Application | ✔ hoje |
| 2 | Modular Monolith | ✔ hoje (frontend modular + backend Express + Firebase) |
| 3 | Distributed Services | [PLANEJADO] |
| 4 | Event-Driven | [PLANEJADO] |
| 5 | High Scale | [PLANEJADO] |
| 6 | Massive Scale | [PLANEJADO] |

## 2. Estado atual

- **Frontend**: SPA única com code-splitting por rota (já preparada para scale-out estático).
- **Backend**: Express único com scheduler no boot; cache em memória; stateless (escalável horizontalmente exceto cache/scheduler).
- **Firestore**: escalável, mas com padrões que precisam de atenção (N+1, leitura de coleções no cliente, fan-out síncrono).
- **Deploy**: Vercel (frontend), backend ainda sem deploy `[NÃO IMPLEMENTADO]`.

## 3. Gargalos previsíveis

| Gargalo | Sintoma | Mitigação |
|---|---|---|
| Fan-out de notificações síncrono | perda/atraso | fila assíncrona |
| Feed "Seguindo" N+1 | latência/quota Firestore | fan-out em fila + índice/cache |
| Leitura de coleções no cliente (search/explore) | custo de leitura | índice FTS + API |
| Contadores derivados | drift | recomputação/eventos |
| Cache em memória | múltiplas instâncias inconsistentes | Redis |
| Scheduler no processo | job perdido em restart | fila externa/Cloud Tasks |
| Backend login 401 (design) | — | manter client-side (ok) |

## 4. Estratégia por camada

### 4.1 Frontend
- CDN estático (Vercel). Code-splitting. Nenhum estado global pesado. Pronto para escala.

### 4.2 Backend
- **Modular Monolith** → separar por domínio dentro do mesmo deploy antes de microserviços:
  1. Cache (Redis) externo.
  2. Jobs/workers externos (Cloud Tasks, queues).
  3. Scheduler separado do servidor HTTP.
- Só então, se justificado: extrair **feed service**, **notify service**, **search service**.

### 4.3 Dados
- Firestore atende bem ao grafo. Para relatórios/análises pesadas, considerar **Postgres** ou **BigQuery**.
- Índices compostos adequados; evitar varreduras.

### 4.4 Realtime/Eventos
- Filas + outbox para eventos (ver `19-EVENT-DRIVEN-ARCHITECTURE.md`).

## 5. Justificativa para extrair serviços

| Serviço candidato | Justificativa (quando) |
|---|---|
| Feed/ranking | quando fan-out e ranking exigirem CPU dedicada e cache próprio |
| Notifications | quando volume de push exigir workers dedicados |
| Search | quando índice FTS exigir recursos próprios |
| Media/transcode | quando processamento de vídeo precisar de workers longos |
| Analytics | quando agregações pesarem no banco principal |

## 6. Capacidades planejadas por nível

| Nível | Capacidades |
|---|---|
| 2→3 | Redis, fila (Cloud Tasks), workers, cache de feed, indexação de busca |
| 3→4 | Event bus, outbox, DLQ, idempotência |
| 4→5 | Sharding de arestas, réplicas de leitura, data warehouse, feature store |
| 5→6 | Multi-região, replicação, autoscaling agressivo, global edge |

## 7. Roadmap

1. **[IMPLEMENTADO]** Modular monolith + Firebase + code-splitting.
2. **[PLANEJADO] P1** — deploy do backend, Redis, fila de eventos, workers de notificação/feed.
3. **[PLANEJADO] P2** — busca indexada, analytics warehouse, cache distribuído.
4. **[PLANEJADO] P3** — sharding de grafo, multi-região.
Ver `45-ROADMAP.md`.