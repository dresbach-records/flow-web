# 39 — DATABASE CATALOG

> Catálogo de coleções do Firestore. Status: **vivo**. Baseado em `firestore.rules`, `firestore.indexes.json` e código.

---

## 1. Coleções raiz (28)

| # | Coleção | Descrição | Regra de escrita | Índices |
|---|---|---|---|---|
| 1 | `users` | Perfis | dono (role estável) / admin (status,role,verified) | role+createdAt, displayName |
| 2 | `posts` | Publicações | autor; counters | visibility+createdAt, authorId+createdAt, communityId+createdAt |
| 3 | `stories` | Stories (TTL 24h) | autor | — |
| 4 | `communities` | Comunidades | autenticado cria; owner/admin edita | memberCount, name |
| 5 | `conversations` | Conversas | participantes | participantIds+updatedAt |
| 6 | `notifications` (collectionGroup) | Notificações (sub de users) | dono/admin | createdAt |
| 7 | `reports` | Denúncias | autor cria; admin status | status+createdAt |
| 8 | `appeals` | Recursos de conta | público cria; admin decide | status+createdAt |
| 9 | `consents` | Consentimento LGPD | próprio usuário | — |
| 10 | `creator_profiles` | Diretório público de criadores | dono | — |
| 11 | `scheduled_posts` | Agendamentos | dono | — |
| 12 | `events` | Eventos | organizador/admin | status+startsAt, ownerId+createdAt |
| 13 | `memorial_requests` | Solicitações de memorial | solicitante; admin status | requesterId+status |
| 14 | `tributes` | Homenagens | autor | memorialId+createdAt |
| 15 | `job_posts` | Vagas | admin | status+createdAt |
| 16 | `job_applications` | Candidaturas | candidato autenticado | status |
| 17 | `contact_messages` | Contato | público cria; admin lê | — |
| 18 | `newsletter` | Newsletter | público cria (consent) | — |
| 19 | `platform_settings/global` | Config global | admin | — |
| 20 | `platform_settings/modules` | Feature flags de módulos | admin; leitura pública | — |
| 21 | `site_pages` | Páginas do site editor | admin | publishedAt |
| 22 | `admin_audit` | Trilha de auditoria admin | adminUid==uid; admin lê | — |
| 23 | `stats/platform` | Métricas de plataforma | (leitura) | — |
| 24 | `push_subscriptions` | Push (backend) | cliente bloqueado | — |
| 25 | `guardian_moderations` | Moderação IA (backend) | backend | — |
| 26 | `personas` | Persona IA (backend) | backend | — |
| 27 | `audit_logs` | Auditoria persona (backend) | backend | — |
| 28 | `_health` | Probe (backend) | backend | — |

## 2. Subcoleções (13)

| # | Caminho | Descrição | Regra |
|---|---|---|---|
| 1 | `users/{uid}/security/2fa` | 2FA | dono |
| 2 | `users/{uid}/blocks/{targetId}` | Bloqueios | dono |
| 3 | `users/{uid}/memberships/{cid}` | Espelho de membros | dono |
| 4 | `users/{uid}/notifications/{nid}` | Notificações | dono/admin |
| 5 | `users/{uid}/following/{tid}` | Seguindo | dono |
| 6 | `users/{uid}/followers/{fid}` | Seguidores | dono |
| 7 | `users/{uid}/saved/{postId}` | Salvos | dono |
| 8 | `communities/{id}/members/{uid}` | Membros (autoritativo) | join/leave próprio |
| 9 | `conversations/{id}/messages/{mid}` | Mensagens | participantes/admin |
| 10 | `posts/{id}/likes/{uid}` | Likes | dono |
| 11 | `posts/{id}/comments/{cid}` | Comentários | autor |
| 12 | `events/{id}/rsvps/{uid}` | RSVP | próprio |
| 13 | `push_subscriptions/{uid}/targets/{tid}` | Inscrições push | backend |

## 3. Índices compostos (firestore.indexes.json)

- posts: (visibility, createdAt↓), (authorId, createdAt↓), (communityId, createdAt↓)
- users: (role, createdAt↓), (displayName↑)
- communities: (memberCount↓), (name↑)
- conversations: (participantIds CONTAINS, updatedAt↓)
- messages: (conversationId, createdAt↑) e (conversationId, createdAt↓)
- notifications: (createdAt↓)
- events: (status, startsAt↑), (ownerId, createdAt↓)
- reports: (status, createdAt↓)
- memorial_requests: (requesterId, status) [duplicado ×2]
- tributes: (memorialId, createdAt↓) [duplicado ×2]
- site_pages: (publishedAt↓)
- appeals: (status, createdAt↓) e (status)
- job_posts: (status, createdAt↓)
- job_applications: (status)

> **Dívida**: índices duplicados (memorial_requests ×2, tributes ×2). Limpar.

## 4. Storage paths

- `users/{uid}/posts`, `users/{uid}/profile`, `users/{uid}/tributes`, `users/{uid}/memorial-docs`, persona (backend).

## 5. Entidades de domínio mapeadas

Ver `04-DOMAIN-ARCHITECTURE.md` §1 e `08-SOCIAL-GRAPH.md`.