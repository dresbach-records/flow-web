# 06 — FIREBASE ARCHITECTURE

> Status do documento: **vivo**. A FLOW **não destrói Firebase**; ele é a infraestrutura central.

---

## 1. Produtos Firebase utilizados

| Produto | Uso | Config |
|---|---|---|
| Authentication | E-mail/senha + Google (popup/redirect) | `VITE_FIREBASE_*` |
| Cloud Firestore | Banco de dados principal | `firestore.rules` + `firestore.indexes.json` |
| Cloud Storage | Mídia (posts, perfil, tributos, memorial docs) | `storage.rules` |
| Analytics (GA4) | Eventos de produto | `VITE_FIREBASE_MEASUREMENT_ID` |
| (reservado) Cloud Functions / Messaging | Não usados atualmente; push via backend próprio | — |

## 2. Inicialização (`src/services/firebase/config.ts`)

- Lê `VITE_FIREBASE_API_KEY|AUTH_DOMAIN|PROJECT_ID|STORAGE_BUCKET|MESSAGING_SENDER_ID|APP_ID|MEASUREMENT_ID`.
- Se qualquer chave obrigatória faltar ou API key for placeholder (`cole_a_api_key_publica_do_app_web_aqui`), o Firebase **não** inicializa e o app roda em **modo local com aviso** (`FirebaseRuntimeNotice`).
- Getters seguros: `requireFirebaseAuth()`, `requireFirestore()`, `requireFirebaseStorage()` (lançam com mensagem clara).
- `getFlowAnalytics()` — lazy, só em browser suportado.
- `firebaseDiagnostics` — presença de config (exibida em Admin/Developer sem valores).

## 3. Autenticação (`src/services/firebase/auth.ts`)

Fluxos:
- `registerUser` — email/senha + `updateProfile` + doc `users` (role `user`) + email verification + `flow.auth` no localStorage.
- `loginUser` — email/senha → `toFlowUser`.
- `loginWithGoogle` — popup; fallback redirect (`auth/popup-blocked`); cria doc `users` se novo; estado de signup em sessionStorage `flow-google-signup`.
- `completeGoogleSignIn` — resolve redirect.
- `loginAdmin` — login + gate de role (`admin`/`moderator`).
- `logout`, `requestPasswordReset`, `confirmPasswordResetWithCode`, `resendVerification`.
- **2FA** — `configure2FAMethod`, `verify2FACode` (backup codes de uso único reais, consumidos ao usar), `getBackupCodes`, `regenerateBackupCodes`, `disable2FA`. TOTP/SMS `[PLANEJADO]`.
- **Sessões** — `listActiveSessions` retorna só a sessão atual (honesto); `terminateSession` de remota lança "Fase 9".
- **Conta** — `getAccountRestrictionDetails` (textos estáticos, sem leitura Firestore `[PARCIAL]`), `submitAccountAppeal` (grava `appeals` real com ticket `REC-`).
- `toFlowUser` — lê `users/{uid}` e normaliza `FlowUser` (role, accountType).

## 4. Firestore — acesso (`src/services/firebase/firestore.ts`)

Camada genérica CRUD:
- `createDocument(path, data)`, `upsertDocument(path, id, data)`, `updateDocument`, `deleteDocument`, `getDocument`, `listDocuments(path, opts)`, `listDocumentsPage(path, opts)` (cursor `startAfter`).
- Timestamps `createdAt`/`updatedAt` automáticos.
- Usada por várias features (admin, site, schedules, etc.).

## 5. Serviços de domínio Firebase

Ver `03-BACKEND-ARCHITECTURE`/catálogo de services. Resumo por arquivo:

| Arquivo | Coleções | Nota |
|---|---|---|
| `social.ts` | posts, likes, comments, following, followers, saved | transações de like; fan-out notify |
| `communities.ts` | communities, members, memberships | join/leave + memberCount |
| `messages.ts` | conversations, messages | realtime `onSnapshot` |
| `notifications.ts` | users/{uid}/notifications | realtime `onSnapshot` |
| `stories.ts` | stories | TTL 24h |
| `memorial.ts` | memorial_requests, tributes, users | FASE 5 |
| `events.ts` | events, rsvps | FASE — fora do barrel |
| `scheduling.ts` | scheduled_posts, posts | FASE — fora do barrel |
| `push.ts` | push_subscriptions (via API) | FASE — fora do barrel |
| `blocks.ts` | users/{uid}/blocks | FASE — fora do barrel |
| `creator.ts` | posts, followers | FASE — fora do barrel |
| `creators.ts` | creator_profiles | diretório público |
| `audit.ts` | admin_audit | FASE 6 |
| `consent.ts` | consents, users | LGPD versionado |
| `stats.ts` | stats/platform | métricas de plataforma |
| `newsletter.ts` | newsletter | consent obrigatório |
| `storage.ts` | Storage | upload resumível |
| `analytics.ts` | GA4 | trackEvent/trackPageView |

## 6. Segurança (rules)

- `isSignedIn()`, `isOwner(userId)`, `isAdmin()` (lê `users/{uid}.role == 'admin'`).
- **Matriz min-privilege** cobrindo 22 coleções (detalhe em `AUDITORIA_FINAL_FLOW.md` §ERROS FIREBASE).
- Listagens sem filtro restritas a admin (evita enumeração).
- `push_subscriptions` e `newsletter` bloqueados ao cliente (backend/Admin SDK ignora rules).
- Sem `delete` para dados sensíveis (users, conversations, notifications, consents).

## 7. Storage (`storage.rules` + `storage.ts`)

- Regras por path autenticado (uploads sob `users/{uid}/...`).
- Validações client-side de tipo/tamanho.
- Backend audita órfãos (`storage-audit`).

## 8. Listeners em tempo real

- `messages.ts` — `subscribeToMessages` (onSnapshot por conversa).
- `notifications.ts` — `subscribeToNotifications` (onSnapshot).
- Demais features usam leitura pontual (não há realtime generalizado). `[PARCIAL]` — ver roadmap.

## 9. O que fica no Firebase hoje vs futuro

| Funcionalidade | Hoje | Futuro |
|---|---|---|
| Auth | Firebase Auth | pode adicionar provedores (Apple, SMS/TOTP) |
| Banco | Firestore | pode migrar partes p/ Postgres p/ relatórios pesados |
| Armazenamento | Storage | CDN/transcode de vídeo |
| Push | Backend próprio + VAPID | Cloud Messaging/FCM opcional |
| Fila/jobs | Scheduler manual no backend | Cloud Tasks / fila externa |
| Moderação IA | Backend + Vertex AI | pipeline dedicado |

> **Regra:** qualquer migração futura deve ser **incremental** e preservar as regras e índices. A FLOW nunca assume "reenviar tudo".

## 10. Boas práticas e riscos

- Não expor credenciais administrativas no frontend (só `VITE_*` públicos).
- Tratar falha de config com modo local + aviso (não crash).
- Não usar mock para esconder ausência de backend.
- `[RISCO]` Falha de config sem env (modo local) pode enganar em produção — o CI/build não deve passar com placeholders.
- `[RISCO]` `firestore.indexes.json` com duplicatas.
- `[RISCO]` Contadores derivados (memberCount, likesCount) podem driftar; mitigar com recomputação periódica.