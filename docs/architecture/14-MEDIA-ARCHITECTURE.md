# 14 — MEDIA ARCHITECTURE

> Status do documento: **vivo**. Referência de maturidade: [Inside Facebook's Video Delivery System (Meta)](https://engineering.fb.com/2024/12/10/video-engineering/inside-facebooks-video-delivery-system/).

---

## 1. Tipos de mídia

| Tipo | Exemplos | Destino (Storage) |
|---|---|---|
| Imagem | foto de post | `users/{uid}/posts` |
| Vídeo | vídeo de post/short | `users/{uid}/posts` |
| Avatar/Capa | perfil | `users/{uid}/profile` |
| Story | imagem de story | `users/{uid}/posts` (via `uploadMedia`) |
| Tribute | homenagem | `users/{uid}/tributes` |
| Memorial doc | comprovante | `users/{uid}/memorial-docs` |
| Persona | imagens da IA Marina | backend Storage |

## 2. Validações atuais

| Mídia | Tipo permitido | Tamanho máx |
|---|---|---|
| Avatar/Capa | `image/*` | 5 MB |
| Post imagem | `image/*` | 10 MB |
| Post vídeo | `video/*` | 100 MB |
| Story | imagem | 10 MB |
| Tribute | imagem/vídeo | via `uploadMedia` |

## 3. Upload (`src/services/firebase/storage.ts`)

- `uploadMedia(folder, file, onProgress)` — upload **resumível** com progresso, nome sanitizado.
- Retorna `UploadResult { url, path }`.
- `deleteMedia(path)`.

## 4. Arquitetura alvo

```mermaid
flowchart LR
  U[Upload] --> P[Processing]
  P --> V[Validation: tipo/tamanho/vírus]
  V --> S[Storage]
  S --> M[Metadata]
  M --> CDN[CDN]
  CDN --> O[Optimization]
  O --> T[Transcoding/Thumbnail]
  T --> MOD[Moderation (Guardian/AV)]
  MOD --> D[Deletion/Retention]
```

## 5. Recomendações por etapa

| Etapa | Hoje | Alvo |
|---|---|---|
| Upload | Firebase Storage (client) | manter; gerar presigned para grandes arquivos |
| Processamento | nenhum | pipeline server-side |
| Validação | client-side (tipo/tamanho) | server-side + AV |
| Storage | Firebase Storage | manter + bucket versionado |
| CDN | Firebase (GCS CDN) | CDN próprio (Cloud CDN) |
| Otimização | nenhuma | redimensionar/compressão (sharp — devDependency já presente) |
| Transcoding | nenhum | transcodificar vídeo (HLS/DASH) |
| Thumbnail | nenhum | gerar thumbnails (sharp) |
| Moderação | Guardian no texto do post | moderar mídia (imagem/vídeo) |
| Deletion | `deleteMedia` | soft-delete + retenção LGPD |
| Retenção | — | política por tipo |

## 6. Regras atuais

- **Nunca armazenar arquivos grandes no banco** — apenas `mediaUrl`/`mediaPath` (regra já cumprida).
- Backend audita órfãos de storage (`GET /api/v1/admin/storage-audit`) — sem auto-delete.
- `sharp` (devDependency) disponível para processamento futuro.

## 7. Privacidade

- Mídia de tributos/memorial: path sob o uid do autor.
- Content-Moderation aplica-se a mídia futuramente.
- URLs de persona são assinadas de longa duração (backend) — `[RISCO]` para exposição; revisar.

## 8. Roadmap

1. **[IMPLEMENTADO]** Upload resumível + validação + Storage + metadata + delete + auditoria de órfãos.
2. **[PLANEJADO] P1** — redimensionamento/compressão de imagem (sharp), thumbnails, validação server-side.
3. **[PLANEJADO] P2** — transcoding de vídeo (HLS), moderação de mídia, CDN.
4. **[PLANEJADO] P3** — presigned URLs curtas, retenção automática, histórico de versões.