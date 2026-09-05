# 17 — SECURITY ARCHITECTURE

> Status do documento: **vivo**. Regra: **nunca confiar no frontend para autorização.**

---

## 1. Autenticação

- **Firebase Authentication** — e-mail/senha + Google (popup/redirect).
- `requireFirebaseAuth()` — getter seguro; sem config → modo local com aviso.
- **2FA** — códigos de backup de uso único (reais, consumidos ao usar); SMS/TOTP `[PLANEJADO]`.
- Senha: reset por e-mail (`requestPasswordReset`/`confirmPasswordResetWithCode`).
- Verificação de e-mail (`sendEmailVerification`/`resendVerification`).

## 2. Autorização (RBAC)

Roles: `user | creator | seller | moderator | admin` (em `users/{uid}.role`).

| Role | Acesso admin | Permissões típicas |
|---|---|---|
| user | — | uso da rede |
| creator | — | central do criador |
| seller | — | (commerce futuro) |
| moderator | admin parcial | moderação, conteúdo, comunidades, mensagens, notificações, memorial, suporte |
| admin | admin total | usuários, RH, config, logs, módulos, site, sistema, developer |

- `PermissionGuard` (frontend) — apenas UX; proteção real nas **Firestore Rules** e `requireAdmin` (backend).
- `loginAdmin` exige role admin/moderator.
- `AdminAuthContext` normaliza roles e nega sessão para não-admin.
- `superadmin` referenciado em guards mas **inalcançável** na prática (FlowUser não gera) — `[PARCIAL]`.

## 3. Sessão

- Token Firebase de curta duração + ID token no header `Authorization` para API.
- `flow.auth` no localStorage (flag).
- Sessões ativas: apenas a atual verificável no cliente; remoto `[PLANEJADO]`.

## 4. Firestore Rules (proteção real)

Resumo da matriz min-privilege (22 coleções):
- `users`: create self role user; get autenticado; list admin; update owner (role estável) ou admin (status/role/verified); delete false.
- `posts`: read autenticado; create com `authorId==uid`; update autor ou counters; delete autor/admin.
- `posts/{id}/likes|comments`: por uid/autor.
- following/followers/saved/blocks/security: dono.
- notifications: dono/admin; update só `read`.
- conversations/messages: participantes/admin; imutáveis.
- reports/appeals/memorial_requests/tributes: autor + admin (status only).
- communities: leitura pública; admin selo/status; owner edita campos.
- platform_settings/site_pages: admin write; modules read público.
- admin_audit: adminUid==uid no create; admin read.
- newsletter/contact_messages/job_applications/job_posts/push_subscriptions: protegidas.

## 5. Backend security

- `helmet`, `cors` (allowlist), `express-rate-limit` (writes 30/min/IP).
- `requireAuth` (verifica ID token) + `requireAdmin` (consulta role).
- Logs estruturados com `x-request-id`.
- Input validation via `zod`.
- Guardian: timeout, validação de resposta.

## 6. Defesas web

| Controle | Estado |
|---|---|
| CSRF | CORS restrito + token Bearer; `[PARCIAL]` cookie path não usado |
| XSS | React escapa por padrão; evitar `dangerouslySetInnerHTML` (não usado) |
| CORS | allowlist no backend |
| CSP | não configurada explicitamente `[PLANEJADO]` |
| Input validation | client (tamanhos/tipos) + zod (backend) |
| Output encoding | React default |
| Secrets | nunca no frontend; env `VITE_*` públicos |
| Encryption | TLS (Vercel/HTTPS); dados em repouso via Firebase/GCS |
| Rate limiting | backend writes |
| Brute force | Firebase Auth; bloqueio de conta (`/conta/bloqueada`) |
| Account recovery | reset por e-mail + appeal |
| Audit logs | `admin_audit` |

## 7. Vulnerabilidades conhecidas / riscos

| Risco | Severidade | Mitigação/status |
|---|---|---|
| `.env` apontando `VITE_API_BASE_URL` para o frontend (Vercel) quebra `/api` | médio | documentado; verificar env |
| `role: 'admin'` requer bootstrap manual (`seed-admin`) | médio | operacional |
| Contadores derivados podem driftar | médio | recomputação |
| `GET /api/v1/auth/login` sempre 401 (design) | baixo | documentado |
| `superadmin` inalcançável | baixo | alinhar tipos |
| Mídia da persona com URLs assinadas longas | baixo | revisar expiração |
| CSP ausente | médio | implementar |
| Bloqueio de conta não bloqueia sessão ativa imediatamente | médio | `[PLANEJADO]` |

## 8. O que NUNCA fazer

- Autorizar apenas no frontend.
- Expor credenciais admin no cliente.
- Permitir delete destrutivo sem auditoria.
- Confiar em IDs/clients para decisões de segurança.

## 9. Roadmap

1. **[IMPLEMENTADO]** RBAC real, rules min-privilege, 2FA backup codes, requireAdmin, audit.
2. **[PLANEJADO] P1** — CSP, bloqueio de sessão ativa, rate limit por usuário, 2FA TOTP/SMS.
3. **[PLANEJADO] P2** — WAF/CDN, monitoramento de anomalias, pen-test periódico.