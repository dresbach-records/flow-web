# 25 — PERFORMANCE ARCHITECTURE

> Status do documento: **vivo**.

---

## 1. Estado atual

| Área | Estado |
|---|---|
| Code-splitting por rota (React.lazy) | [IMPLEMENTADO] — chunks 8–78 kB, vendor ~497 kB |
| Lazy init Firebase/Analytics | [IMPLEMENTADO] |
| Paginação por cursor no feed | [IMPLEMENTADO] |
| Cache backend TTL | [IMPLEMENTADO] |
| SW app-shell | [IMPLEMENTADO] |
| Otimização de imagens | [NÃO IMPLEMENTADO] |
| Transcoding de vídeo | [NÃO IMPLEMENTADO] |
| Realtime generalizado | [PARCIAL] (onSnapshot só mensagens/notificações) |

## 2. Orçamento de performance (alvos)

### 2.1 Web Vitals
| Métrica | Alvo |
|---|---|
| LCP | < 2.5s (p75) |
| INP | < 200ms |
| CLS | < 0.1 |
| FCP | < 1.8s |
| TTFB | < 800ms |

### 2.2 API/Database
| Métrica | Alvo |
|---|---|
| API latência | p95 < 300ms (read), p95 < 600ms (write) |
| Feed latência | p95 < 300ms servidor; < 1s p95 ponta-a-ponta |
| Search latência | p95 < 300ms |
| Message latência | < 500ms p95 entrega |
| Firestore reads/writes | otimizar páginas (batch), evitar N+1 |

## 3. Otimizações recomendadas

| Área | Ação |
|---|---|
| Bundling | revisar vendor size (497kB) — split de libs grandes |
| Imagens | `loading="lazy"` + `srcset`/AVIF via sharp; thumbnails |
| Vídeo | transcoding HLS + poster/thumbnail |
| Realtime | aumentar uso de `onSnapshot` com foco/desfoque |
| API | cache Redis, rate limit, paginação em tudo |
| Firestore | índices corretos, evitar leitura de coleções inteiras no cliente |
| Grafo | evitar N+1 de `users/{authorId}` — batch get |
| Render | memo em listas longas, virtualização futura |

## 4. Monitoramento

- Web Vitals: GA4 + futuramente Core Web Vitals lab.
- API: métricas backend + health.
- Erros: `AppErrorBoundary` + backend logs.
- `[PLANEJADO]` RUM (real user monitoring).

## 5. Roadmap

1. **[IMPLEMENTADO]** Code-splitting, lazy Firebase, paginação de feed, cache.
2. **[PLANEJADO] P1** — otimização de mídia (sharp), lazy images, batch de autores, métricas RUM.
3. **[PLANEJADO] P2** — transcoding de vídeo, virtualização de listas, edge caching.
4. **[PLANEJADO] P3** — orçamento automatizado (Lighthouse CI).