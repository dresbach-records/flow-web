# 41 — PERMISSION CATALOG

> Catálogo de permissões e RBAC. Status: **vivo**.

---

## 1. Roles (Firebase Auth + `users/{uid}.role`)

| Role | Admin? | Descrição |
|---|---|---|
| `user` | não | usuário comum |
| `creator` | não | criador de conteúdo |
| `seller` | não | vendedor (commerce futuro) |
| `moderator` | parcial | moderação e suporte no admin |
| `admin` | sim | acesso total |
| `superadmin` | (inalcançável) | referenciado em guards; não produzido pelo código `[PARCIAL]` |

## 2. Permissões por área (frontend `PermissionGuard` / `AdminApp`)

| Rota admin | Roles permitidos |
|---|---|
| `/admin` dashboard, analytics, relatorios, seguranca, sistema | admin, superadmin, moderator |
| `/admin/usuarios`, rh, configuracoes, logs, modulos, site | admin, superadmin |
| `/admin/moderacao`, conteudo, comunidades, mensagens, notificacoes, memorial, suporte | admin, superadmin, moderator |
| `/admin/marketplace`, eventos | admin (placeholder) |
| `/developer/*` | admin, superadmin (moderator negado) |

## 3. Permissões Firestore (regras) — resumo por padrão

| Padrão | Regra |
|---|---|
| Próprio recurso (owner) | `isOwner(uid)` — read/write |
| Autenticado lê | `request.auth != null` |
| Admin | `isAdmin()` — lê `users/{uid}.role == 'admin'` |
| Admin só edita campos | `diff(...).affectedKeys().hasOnly([...])` (status, role, verified, feature states) |
| Sem delete | `users`, `conversations`, `messages`, `notifications`, `consents`, `newsletter`, `contact_messages`, `job_applications`, `appeals` (delete false) |
| Lista sem filtro | restrita a admin (não enumeração) |

## 4. Permissões por coleção (matriz)

| Coleção | Create | Read | Update | Delete |
|---|---|---|---|---|
| users | dono (role user) | autenticado (get), admin (list) | dono (role estável) / admin (status/role/verified) | ✘ |
| posts | autenticado (authorId=uid, type válido) | autenticado | autor (texto) ou counters | autor / admin |
| posts/likes | dono | autenticado | — | dono |
| posts/comments | autenticado (authorId=uid) | autenticado | autor | autor |
| stories | autenticado (authorId=uid, media) | autenticado | ✘ | autor / admin |
| communities | autenticado (nome válido) | público | owner (name/desc/image) / admin (verified/status/featured) / memberCount | ✘ |
| communities/members | próprio uid | público | ✘ | próprio uid |
| conversations | autenticado (uid in participants) | participantes / admin | lastMessage/updatedAt/read | ✘ |
| messages | participante (senderId=uid) | participantes / admin | ✘ | ✘ |
| notifications | autenticado | dono / admin | dono (read) | dono / admin |
| reports | autenticado (reporterId=uid) | autor / admin | admin (status) | ✘ |
| appeals | público (email válido) | admin | admin (status) | ✘ |
| consents | dono | dono | dono | ✘ |
| creator_profiles | dono | público | dono | dono / admin |
| scheduled_posts | dono | dono | dono | dono |
| events | autenticado (ownerId=uid) | autenticado | owner / admin | owner / admin |
| events/rsvps | próprio uid | autenticado | próprio (status) | próprio |
| memorial_requests | autenticado (status PENDING) | autor / admin | admin (status) | ✘ |
| tributes | autenticado (authorId=uid, 1–500 chars) | autenticado | ✘ | autor |
| job_posts | admin | público | admin | ✘ |
| job_applications | autenticado (candidateId=uid) | admin | ✘ | ✘ |
| contact_messages | público (válido) | admin | ✘ | ✘ |
| newsletter | público (consent) | ✘ (backend) | ✘ | ✘ |
| platform_settings | admin | modules público / global admin | admin | ✘ |
| site_pages | admin | público | admin | ✘ |
| admin_audit | autenticado (adminUid=uid) | admin | ✘ | ✘ |
| push_subscriptions | ✘ cliente (backend) | ✘ cliente | ✘ cliente | ✘ cliente |

## 5. Backend (requireAuth/requireAdmin)

| Middleware | Efeito |
|---|---|
| `requireAuth` | verifica Bearer ID token → `req.uid` |
| `requireAdmin` | verifica `users/{uid}.role == 'admin'` → 403 senão |

## 6. Níveis de autorização (3 camadas)

1. **UX**: `PermissionGuard` (frontend) — esconde menus.
2. **Regras**: Firestore Rules — proteção de dados.
3. **Backend**: `requireAdmin`/`requireAuth` + validação — autorização real de API.

> **Nunca confiar no frontend.** A camada 1 é cosmética; a autorização real está em 2 e 3.

## 7. Roadmap

1. **[IMPLEMENTADO]** RBAC completo + matriz de regras.
2. **[PLANEJADO] P1** — alinhar `superadmin` (tipos), ABAC para conteúdo (visibilidade por audience), permissões por comunidade (owner/mod).
3. **[PLANEJADO] P2** — gestão de permissões via admin UI + auditoria.