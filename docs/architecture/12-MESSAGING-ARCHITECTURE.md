# 12 — MESSAGING ARCHITECTURE

> Status do documento: **vivo**. Referência de maturidade: infraestrutura de mensageria da Meta (pública), Threads infra.

---

## 1. Entidades

| Entidade | Firestore | Campos |
|---|---|---|
| Conversation | `conversations/{id}` | `participantIds[]`, `lastMessage`, `updatedAt`, `read{}` |
| Message | `conversations/{id}/messages/{mid}` | `senderId`, `text`, `createdAt` |
| (futuro) Attachment | message.attachmentUrl | `[PLANEJADO]` |
| (futuro) Reaction | message reactions | `[PLANEJADO]` |

## 2. Estados de mensagem

| Estado | Hoje | Nota |
|---|---|---|
| `sent` | [IMPLEMENTADO] | criada com `senderId` |
| `delivered` | implícito | leitura autenticada |
| `read` | `conversation.read.{uid}` | marca leitura da conversa |
| `failed` | erro honesto | sem envio simulado |

## 3. Fluxo atual (`src/services/firebase/messages.ts`)

- `listConversations(uid)` — `where participantIds array-contains uid`, `orderBy updatedAt desc`.
- `listMessages(convId)` — `orderBy createdAt`.
- `sendMessage(convId, text)` — grava message + atualiza `lastMessage`/`updatedAt`.
- `markConversationRead(convId)` — atualiza `read.{uid}`.
- `subscribeToMessages(convId)` — **realtime** via `onSnapshot`.

### UI
- `MessagesModule` (`/app/mensagens`): lista de conversas + painel de chat.
- `onSnapshot` para realtime.
- Voz/vídeo/anexos/emoji desabilitados ("Fase 3"). `[PARCIAL]`

## 4. Regras e segurança

- `firestore.rules`: participantes (`auth.uid in participantIds`) e admin leem; criação exige `senderId == uid` e participação; **update/delete de mensagem proibidos** (imutabilidade).
- Conversas: update restrito a `lastMessage`/`updatedAt`/`read`.
- `AdminMessages`: admin lista/lê (auditoria) — sem envio/remoção por admin.

## 5. Arquitetura evolutiva

```mermaid
flowchart LR
  A[Usuário A] -->|send| API[Backend /api/v1/messages]
  API --> Q[Fila]
  Q --> W[Worker]
  W --> FS[(Firestore)]
  FS --> RT[Realtime (onSnapshot / FCM)]
  RT --> B[Usuário B]
```

### Recomendações por requisito

| Requisito | Hoje | Alvo |
|---|---|---|
| Realtime | `onSnapshot` | manter + push (FCM) |
| Offline | via PWA cache (frágil) | fila de envio offline com idempotência |
| Retry | — | fila com backoff |
| Idempotência | — | `clientMessageId` |
| Ordenação | `createdAt` | `createdAt` + seq para conflito |
| Paginação | `listMessages` sem cursor | cursor |
| Presença | — | `onlineAt` por usuário |
| Typing | — | evento de digitação |
| Notificações | push via `/api/v1/notify` | push + in-app |
| Anexos | — | Storage + validação + thumbnail |
| Reações | — | subcoleção `messages/{id}/reactions` |

## 6. Privacidade

- Mensagens são privadas por padrão (rules de participação).
- Admin audita apenas (leitura), sem conteúdo exposto na UI pública.
- Criptografia E2E `[PLANEJADO]` (avaliar trade-off com moderação/auditoria).

## 7. Roadmap

1. **[IMPLEMENTADO]** Conversas + mensagens + realtime + read receipts + admin read.
2. **[PLANEJADO] P1** — anexos, paginação por cursor, idempotência, typing.
3. **[PLANEJADO] P2** — fila de envio offline, presença, reações.
4. **[PLANEJADO] P3** — chamadas de voz/vídeo (WebRTC), E2E (decisão de produto).