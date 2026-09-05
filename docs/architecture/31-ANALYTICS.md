# 31 — ANALYTICS

> Status do documento: **vivo**. Separação entre **Product Analytics** e **Operational Observability** (ver `18-OBSERVABILITY.md`).

---

## 1. Product Analytics

### 1.1 Ferramenta
- **Google Analytics 4** via Firebase Analytics (`getFlowAnalytics`, `trackEvent`, `trackPageView`).
- gtag global no `index.html` (`G-F75DJGFEBX`).

### 1.2 Eventos atuais
- `login`, `sign_up` (AuthPage).
- Página: `trackPageView` (não generalizado em todas as rotas `[PARCIAL]`).

### 1.3 Eventos recomendados
| Evento | Momento |
|---|---|
| `post_created` | `createPost` |
| `post_liked` / `post_unliked` | `toggleLike` |
| `post_commented` | `addComment` |
| `user_followed` | `toggleFollow` |
| `community_joined` | `joinCommunity` |
| `message_sent` | `sendMessage` |
| `story_created` | `createStory` |
| `event_rsvp` | `setRsvp` |
| `search_query` | SearchModule |
| `install_pwa` | usePwaInstall |
| `push_enabled` | enablePush |
| `report_submitted` | submitReport |
| `consent_accepted/declined` | consent |

### 1.4 Métricas
- Ativação, retenção (D1/D7/D30), funnels (registro→post→engajamento), engajamento (sessões, DAU/MAU), conversões.

### 1.5 Gaps
- Séries históricas nos admin/creator dashboards: `[NÃO IMPLEMENTADO]` (admin marca "Fase 8").
- Funnels/retention: `[NÃO IMPLEMENTADO]`.

## 2. Operational Observability

- Métricas backend em memória (`metrics.service`), health, logs estruturados, auditoria.
- Ver `18-OBSERVABILITY.md`.

## 3. Privacidade

- Analytics com consentimento LGPD (gate).
- Não enviar PII nos eventos (hashes quando necessário).
- GA4 config com minimização.

## 4. Roadmap

1. **[IMPLEMENTADO]** GA4 (login/sign_up), admin KPIs reais (contagens), CSV export.
2. **[PLANEJADO] P1** — eventos de produto em todas as ações-chave; dashboards históricos.
3. **[PLANEJADO] P2** — funnels, retenção, experimentação.
4. **[PLANEJADO] P3** — data warehouse (BigQuery) + modelagem avançada.