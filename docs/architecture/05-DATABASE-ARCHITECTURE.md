# 05 — DATABASE ARCHITECTURE

> Status do documento: **vivo**. Baseado em `firestore.rules`, `firestore.indexes.json`, `storage.rules` e código.

---

## 1. Tecnologia

**Cloud Firestore** (NoSQL, document store) como banco principal, **Firebase Storage** para arquivos, **Firebase Auth** para identidade. Regras versionadas em `firestore.rules` (rules_version 2).

## 2. Modelo de dados

### 2.1 Coleções raiz

| Coleção | Documento | Campos principais | Regras (resumo) |
|---|---|---|---|
| `users` | por uid | name, email, role, accountType, status, verified, displayName, bio, photoURL, coverUrl, privateProfile, phone, birthDate, cpf/cnpj, legalName/tradeName, emailNotifications, pushNotifications, legacy fields | dono lê/escreve; admin lista e edita `status|role|verified`; delete=false |
| `posts` | auto | authorId, text, type, mediaUrl, mediaPath, likesCount, commentsCount, sharesCount, createdAt, visibility, communityId, status, scheduledAt, aiManaged | leitura autenticada; criação com authorId=uid; update autor (ou counters); delete autor/admin |
| `posts/{id}/likes` | por uid | userId, createdAt | só o próprio uid |
| `posts/{id}/comments` | auto | authorId, text, parentId, createdAt | autor edita/exclui |
| `stories` | auto | authorId, mediaUrl, createdAt, expiresAtMs | leitura autenticada; autor/admin deletam |
| `communities` | auto | name, description, imageUrl, ownerId, memberCount, verified, status, featured | leitura pública; criação autenticada; owner edita campos básicos; admin selo/status; contador via fluxos |
| `communities/{id}/members` | por uid | joinedAt | join/leave só do próprio |
| `conversations` | auto | participantIds[], lastMessage, updatedAt, read | participantes+admin leem; criação com auth em participantIds; update só lastMessage/updatedAt/read |
| `conversations/{id}/messages` | auto | senderId, text, createdAt | participantes+admin leem; criação com senderId=uid |
| `notifications` (sub de users) | `users/{uid}/notifications/{nid}` | type, actorName, actorAvatar, text, read, createdAt | dono+admin leem; update só `read` |
| `reports` | auto | reporterId, targetType, targetId, category, status, description, createdAt | autor cria/lê; admin lê/update status |
| `appeals` | auto | ticketId, email, reason, details, status | público cria (email válido); admin decide |
| `consents` | por uid | userId, version, accepted, acceptedAt | só o próprio |
| `creator_profiles` | por uid | handle, handleLower, displayName, avatarUrl, bio, activated | leitura pública; dono edita |
| `scheduled_posts` | auto | ownerId, text, mediaUrl, scheduledAt, timezone, status | dono |
| `events` | auto | ownerId, title, description, location, online, startsAt, status | leitura autenticada; owner/admin editam; delete owner/admin |
| `events/{id}/rsvps` | por uid | status | RSVP próprio |
| `memorial_requests` | auto | requesterId, status(PENDING), name, relationship, ... | autor cria/lê; admin update status |
| `tributes` | auto | memorialId, authorId, text, mediaUrl | leitura autenticada; autor deleta |
| `job_posts` | auto | title, slug, description, status | leitura pública; admin cria/edita |
| `job_applications` | auto | candidateId, jobId, name, email, ... | candidato autenticado cria; admin lê |
| `contact_messages` | auto | name, email, subject, category, message, status | público cria; admin lê |
| `newsletter` | auto | email, consent, source, createdAt | público cria com consent; ninguém lê (backend admin) |
| `platform_settings/global` | `global` | siteName, maintenanceMode, allowSignup, maxUploadMb, autoModSensitivity | admin grava; leitura restrita |
| `platform_settings/modules` | `modules` | states{moduleKey: enabled/maintenance/disabled} | leitura pública; admin grava |
| `site_pages` | por rota (ex.: `home`) | page, blocks[], publishedAt | leitura pública; admin grava |
| `admin_audit` | auto | adminUid, action, target, details, createdAt | autenticado grava com adminUid=uid; admin lê |
| `stats/platform` | `platform` | usersCount, postsCount, communitiesCount, ... | leitura |
| `push_subscriptions` (backend) | `{uid}/targets` | endpoint hash, keys | cliente bloqueado |
| `guardian_moderations` (backend) | auto | input, result, reviewedAt | backend |
| `personas`, `audit_logs` (backend) | — | persona IA | backend |
| `_health` (backend) | — | — | probe |

### 2.2 Subcoleções (índice de arestas)

- `users/{uid}/security/2fa`
- `users/{uid}/blocks/{targetId}`
- `users/{uid}/memberships/{communityId}`
- `users/{uid}/notifications/{notificationId}`
- `users/{uid}/following/{targetId}`
- `users/{uid}/followers/{followerId}`
- `users/{uid}/saved/{postId}`
- `communities/{id}/members/{uid}`
- `conversations/{id}/messages/{messageId}`
- `posts/{postId}/likes/{userId}`
- `posts/{postId}/comments/{commentId}`
- `events/{eventId}/rsvps/{uid}`
- `push_subscriptions/{uid}/targets/{targetId}`

## 3. Índices (`firestore.indexes.json`)

Índices compostos existentes: posts(visibility,createdAt), posts(authorId,createdAt), posts(communityId,createdAt), users(role,createdAt), users(displayName), communities(memberCount), communities(name), conversations(participantIds array, updatedAt), messages(conversationId,createdAt asc/desc), notifications(createdAt), events(status,startsAt), events(ownerId,createdAt), reports(status,createdAt), memorial_requests(requesterId,status), tributes(memorialId,createdAt), site_pages(publishedAt), appeals(status,createdAt), job_posts(status,createdAt), job_applications(status), appeals(status), tributes(memorialId,createdAt) [duplicado].

> **[NOTA]** `firestore.indexes.json` contém duplicatas (memorial_requests e tributes aparecem 2×). A limpeza é `[PLANEJADO]`.

## 4. Storage (`storage.rules` + `storage.ts`)

- Pastas: `users/{uid}/posts`, `users/{uid}/profile`, `users/{uid}/tributes`, `users/{uid}/memorial-docs`, persona (backend).
- Validações client-side: imagem ≤ 10 MB (posts), vídeo ≤ 100 MB, avatar/capa ≤ 5 MB.
- `uploadMedia(folder, file, onProgress)` — upload resumível com progresso e nome sanitizado.
- Backend: `storage-audit.service.ts` (auditoria de órfãos, sem auto-delete).

## 5. Transações

- Like: `runTransaction` (likeRef + counter increment).
- Backend scheduler: reivindicação de job via transação (`SCHEDULED→PROCESSING`).
- Backend like: transação + `FieldValue.increment`.
- Join/leave comunidade: grava membership + mirror + `memberCount` (não transacional — risco de drift `[PARCIAL]`).

## 6. Soft delete / retenção

- **Não há soft delete geral.** Posts podem ser excluídos por autor/admin (`deleteDoc`).
- Contadores: likes/comments/shares via `increment` (podem dessincronizar em caso de delete de comentário — mitigado com `.catch`).
- Retenção de dados pessoais: LGPD (`consents`), documentada em `16-PRIVACY-ARCHITECTURE.md`.

## 7. Paginação

- `listDocumentsPage` (cursor `startAfter`) — usado no feed (`usePosts`, página de 10).
- `listDocuments` com `orderBy` + `limit` — usado em exploração, admin, etc.
- Sem paginação de comentários além de `limit(100)`.

## 8. Estratégia evolutiva (caminho)

| Fase | Banco | Descrição |
|---|---|---|
| **MVP (atual)** | Firestore | Document store + subcoleções; regras; índices |
| **Growth** | Firestore + índices otimizados + cache (Redis) + fila (Firestore queue/Cloud Tasks) | Desacoplar contadores; fan-out via eventos |
| **Scale** | Postgres/SQL opcional p/ relatórios; Firestore p/ grafo quente; colunas p/ mídia | View materializada de métricas |
| **Massive Scale** | Sharding de arestas; cache distribuído; data warehouse | — |

> **Regra:** não criar complexidade prematura. Firestore atende bem ao grafo social na escala atual. Ver `26-SCALABILITY-ARCHITECTURE.md`.

## 9. Boas práticas aplicadas

- Regras min-privilege em 22 coleções (matriz em `AUDITORIA_FINAL_FLOW.md`).
- Sem listar coleções sem filtro para clientes (list: admin).
- PII mascarada (emails nunca exibidos de terceiros; IP de sessão não exibido).
- Push subscriptions inacessíveis ao cliente.