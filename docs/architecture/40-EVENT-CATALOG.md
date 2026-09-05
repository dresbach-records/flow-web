# 40 — EVENT CATALOG

> Catálogo de eventos de domínio. Status: **vivo**. Ver `19-EVENT-DRIVEN-ARCHITECTURE.md`.

---

## 1. Eventos atuais (implicitos/best-effort)

| # | Evento | Producer | Consumer | Persistência/efeito |
|---|---|---|---|---|
| 1 | `user.created` | `auth.registerUser` | — | users doc; analytics (sign_up) |
| 2 | `user.login` | `auth.loginUser` | — | analytics (login) |
| 3 | `post.created` | `social.createPost` | — | posts doc |
| 4 | `post.liked` | `social.toggleLike` | fan-out notify | posts/likes + notify |
| 5 | `post.commented` | `social.addComment` | fan-out notify | comments + notify |
| 6 | `user.followed` | `social.toggleFollow` | fan-out notify | following/followers + notify |
| 7 | `user.blocked` | `blocks.blockUser` | feed/explore | blocks doc |
| 8 | `post.saved` | `social.toggleSaved` | — | saved doc |
| 9 | `community.created` | `communities.createCommunity` | — | communities doc |
| 10 | `community.joined/left` | `communities.join/leave` | memberCount | members + mirror |
| 11 | `message.sent` | `messages.sendMessage` | realtime | messages + conversation |
| 12 | `notification.created` | notify service | — | notifications + push |
| 13 | `report.created` | `ReportDialog`/`PlatformModules` | admin fila | reports doc |
| 14 | `appeal.created` | `submitAccountAppeal` | admin fila | appeals doc |
| 15 | `consent.accepted/declined` | `recordUserConsent` | — | consents doc |
| 16 | `memorial.requested` | `createMemorialRequest` | admin fila | memorial_requests doc |
| 17 | `tribute.created` | `createTribute` | — | tributes doc |
| 18 | `story.created` | `createStory` | — | stories doc |
| 19 | `event.rsvp` | `setRsvp` | — | rsvps doc |
| 20 | `schedule.created/published` | `scheduling` + scheduler | — | scheduled_posts + posts |

## 2. Eventos administrativos (admin_audit)

`SUSPEND_USER, REACTIVATE_USER, VERIFY_USER, UNVERIFY_USER, CHANGE_USER_ROLE, REMOVE_POST, RESOLVE_REPORT, DISMISS_REPORT, VERIFY_COMMUNITY, UNVERIFY_COMMUNITY, ARCHIVE_COMMUNITY, UNARCHIVE_COMMUNITY, APPROVE_MEMORIAL, REJECT_MEMORIAL, RESOLVE_APPEAL, REJECT_APPEAL, PUBLISH_SITE_PAGE, MODULE_MAINTENANCE, MODULE_ENABLE`.

## 3. Eventos do Guardian (backend)

- `content.moderated` → `guardian_moderations` (input + result + reviewedAt).
- Ações: `allow | review | block`.

## 4. Eventos planejados (contrato alvo)

| # | Evento | Payload (sugerido) | Consumers |
|---|---|---|---|
| 21 | `post.created.v2` | postId, authorId, communityId, type | feed fan-out, search, analytics, cache invalidation |
| 22 | `user.followed.v2` | followerId, targetId | feed, notifications |
| 23 | `user.blocked.v2` | blockerId, targetId | feed, cache |
| 24 | `search.index` | entityType, entityId, fields | indexer |
| 25 | `notification.batch` | targetUid, payloads | push worker |
| 26 | `analytics.event` | name, params | warehouse |
| 27 | `media.processed` | path, kind | transcode/thumbnail |

## 5. Formato padrão de evento

```ts
interface FlowEvent<T = unknown> {
  id: string;            // idempotência
  type: string;
  producer: string;      // 'web'|'backend'|'admin'|'scheduler'
  aggregateType: string;
  aggregateId: string;
  actorId?: string;
  occurredAt: string;
  version: number;
  data: T;
}
```

## 6. Priorização de implementação

1. Fila para notificações + feed fan-out (P1).
2. Search index + analytics (P2).
3. Outbox pattern + DLQ (P3).
Ver `45-ROADMAP.md`.