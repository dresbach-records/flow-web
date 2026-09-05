# FLOW — Domínio, E-mail e Produção

> Documentação técnica de produção. **Nunca** documentar senhas, tokens ou secrets.
> Última revisão: 2026-09-05 · Status: **vivo**

---

## 1. Domínio oficial

| Item | Valor |
|---|---|
| Domínio principal (canônico) | `https://flowsocial.fun` |
| Frontend | `https://flowsocial.fun` |
| API | `https://api.flowsocial.fun` |
| API versionada | `https://api.flowsocial.fun/v1` |
| Health | `https://api.flowsocial.fun/health` |

### Tratamento de variantes
- `http://flowsocial.fun` → redirecionar para `https://flowsocial.fun` (301, via provedor/Vercel/Cloudflare).
- `www.flowsocial.fun` → decisão: **domínio canônico é `flowsocial.fun`** (sem `www`); redirecionar `www` para o canônico se registrado.
- Não criar redirecionamentos conflitantes entre Vercel e Cloudflare.

## 2. Aliases de e-mail públicos

O site **só** exibe os aliases abaixo. O endereço real que recebe o encaminhamento **nunca** aparece em HTML, JS, metadata, código ou documentação pública.

| Alias | Finalidade |
|---|---|
| `contato@flowsocial.fun` | Contato institucional, comunicação geral, contato externo |
| `suporte@flowsocial.fun` | Suporte, problemas de acesso, dúvidas, atendimento |
| `seguranca@flowsocial.fun` | Vulnerabilidades, incidentes, abuso, segurança |
| `privacidade@flowsocial.fun` | Privacidade, LGPD, dados pessoais |
| `no-reply@flowsocial.fun` | Envios automáticos (confirmação, novidades, transacionais) |

Regras:
- `no-reply@flowsocial.fun` **não** é canal de atendimento.
- Envios automáticos: `From: no-reply@flowsocial.fun`; `Reply-To` conforme o contexto (`contato@`, `suporte@`, `seguranca@`, `privacidade@`).
- O endereço administrativo real **nunca** aparece como `Reply-To`.

## 3. Administração (Firebase Auth + RBAC)

- Admin autentica via **Firebase Authentication**.
- Autorização por **role/custom claims** + **backend** (autoridade final). Nunca `if (email === ...)`.
- Papel principal: `admin` (equivalente a `super_admin` conforme necessidade futura: `super_admin, admin, moderator, support, analyst`).
- Criação do admin via mecanismo seguro (backend `seed-admin` + Firebase console), **nunca** com senha hardcoded no código.
- E-mail administrativo não aparece no frontend nem no Footer.

## 4. Newsletter / Novidades

- Componente existente: `NewsletterForm` → `services/firebase/newsletter.ts` → coleção `newsletter`.
- Fluxo: e-mail → validação → consentimento (LGPD) → persistência → confirmação.
- Remetente automático: `no-reply@flowsocial.fun`.
- Nunca usar localStorage como banco de assinantes.
- Campos conceituais: `id, email, status, consent, consented_at, created_at, updated_at, unsubscribed_at`.

## 5. E-mail transacional

- **Não existe** serviço de e-mail SMTP hoje. (Firebase Auth envia e-mails de verificação/reset pelo provedor Firebase.)
- Abstração alvo (quando implementar): `Application → Mail Service → Mail Provider Interface → Provider Adapter`.
- API keys/SMTP **nunca** no frontend nem no Git; usar environment variables/secrets.
- Templates a preparar: confirmação de inscrição, recuperação de senha, confirmação de cadastro, alerta de segurança, transacionais.
- Identidade visual do Flow em todos os templates.

## 6. Firebase Auth — domínios autorizados

Adicionar na console do Firebase Authentication → Settings → Authorized domains:
- `flowsocial.fun`
- `api.flowsocial.fun` (se callbacks da API forem usados)
- Manter `localhost` para desenvolvimento.

**Não** criar credenciais fictícias. Service account credentials só no backend (secrets).

## 7. Variáveis de ambiente

### Frontend (Vercel)
| Var | Produção | Dev |
|---|---|---|
| `VITE_FIREBASE_*` | valores do projeto | valores locais |
| `VITE_API_BASE_URL` | `https://api.flowsocial.fun/v1` | `http://localhost:8080/api/v1` |
| `VITE_SITE_URL` | `https://flowsocial.fun` | (vazio → fallback) |

### Backend
| Var | Produção |
|---|---|
| `PORT` | `8080` |
| `FIREBASE_PROJECT_ID`, `FIREBASE_STORAGE_BUCKET` | projeto |
| `GOOGLE_APPLICATION_CREDENTIALS` | service account (secret) |
| `CORS_ORIGIN` | `https://flowsocial.fun,http://localhost:3000` |
| `VAPID_PUBLIC` / `VAPID_PRIVATE` | chaves reais (private só no backend) |
| `VAPID_SUBJECT` | `mailto:no-reply@flowsocial.fun` |

## 8. PWA / Push

- Manifest `start_url=/app`, scope `/`, theme `#4F7FFF` — funcionam em `https://flowsocial.fun`.
- Service Worker `flow-shell-v3` network-first; `/api` nunca cacheado.
- Push: VAPID public key via `GET /api/v1/meta`; private key **apenas** no backend.

## 9. SEO

- Canonical: `https://flowsocial.fun/` (index.html + hook `useSeo` por página).
- Open Graph / Twitter: URLs absolutas `https://flowsocial.fun/...`.
- Sitemap e robots: `[PLANEJADO]` — usar somente URLs públicas.

## 10. Deployment

- Frontend: Vercel vinculado ao repositório oficial `flow-social-network/front-end-flow` (futuro), domínio `flowsocial.fun`.
- Backend: implantar a partir de `flow-social-network/beckend-flow` em `api.flowsocial.fun`.
- Infraestrutura: `flow-social-network/servidor-flow`.

## 11. Checklist de produção (externo / operacional)

- [ ] Registrar `flowsocial.fun` no provedor DNS (Cloudflare).
- [ ] Configurar Vercel com domínio `flowsocial.fun` + redirecionamento www→apex.
- [ ] Implantar backend em `api.flowsocial.fun` (ver `dns.md`).
- [ ] Adicionar domínios autorizados no Firebase Auth.
- [ ] Criar aliases de e-mail no provedor (contato/suporte/seguranca/privacidade/no-reply).
- [ ] Configurar SPF/DKIM/DMARC (ver `dns.md`).
- [ ] Criar admin via mecanismo seguro (nunca hardcoded).
- [ ] Configurar envs no Vercel/backend (sem versionar secrets).
- [ ] Habilitar export diário do Firestore (backup).
- [ ] Revisar `firestore.rules`/`firestore.indexes.json` no deploy.