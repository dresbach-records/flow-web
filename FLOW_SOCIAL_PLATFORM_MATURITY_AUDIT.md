# FLOW_SOCIAL_PLATFORM_MATURITY_AUDIT
**Benchmark funcional (conceitos públicos de plataformas maduras; nada copiado) × código real em 05/09/2026.**
**Responde: o que temos? o que falta? o que está incompleto/visual? o que precisa de backend/banco/eventos/admin/segurança?**

Status: `REALIZADO` · `PARCIAL` · `VISUAL_ONLY` · `MOCK` (zero ocorrências) · `STATIC` (só editorial) · `QUEBRADO` (zero) · `AUSENTE`

## 1. GRAFO SOCIAL (entidades × relacionamentos reais)

| Relação | Persistência | Status |
|---|---|---|
| User segue User | `users/{uid}/following` + `followers` reverso | REALIZADO |
| User publica Post | `posts.authorId` | REALIZADO |
| User comenta / responde | `posts/{id}/comments` (+`parentId`) | REALIZADO |
| User reage (like) | `posts/{id}/likes/{uid}` + transação + contador | REALIZADO |
| User compartilha | cópia de link real (repost = Fase 9) | PARCIAL |
| User salva | `users/{uid}/saved` | REALIZADO |
| User pertence Community | `communities/{id}/members` + `users/{uid}/memberships` + contador | REALIZADO |
| User participa Event | `events/{id}/rsvps/{uid}` | REALIZADO |
| User envia Message | `conversations/{id}/messages` + `lastMessage` | REALIZADO |
| User bloqueia User | `users/{uid}/blocks` + filtro no feed/descoberta | REALIZADO |
| User denuncia | `reports` (backend validado + fila admin) | REALIZADO |
| Hashtag | extração real + busca `#tag` | REALIZADO |
| Menção | NÃO IDENTIFICADO como entidade (só texto) | AUSENTE |
| Amizade bidirecional | só follow (modelo seguidor) | AUSENTE (decisão: fora do modelo) |
| Page | `creator_profiles` (diretório público) | PARCIAL |
| MarketplaceListing | políticas puras + testes; sem persistência | AUSENTE |
| Eventos antes deste ciclo | — | agora REALIZADO |

## 2. MATRIZ DE MATURIDADE (módulo × camadas)

| Módulo | Front | Back | DB/Firebase | API | AuthZ | Testes | Status |
|---|---|---|---|---|---|---|---|
| Identidade/conta | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | REALIZADO |
| Perfil (foto/capa/bio) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Feed (cursor, following, bloqueios) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | REALIZADO |
| Publicações (criar/editar/excluir) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟡 | REALIZADO |
| Comentários (responder/excluir) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Stories (criar/expirar/excluir) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | REALIZADO |
| Shorts/vídeo | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Comunidades (criar/entrar/sair) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Eventos (criar/RSVP/cancelar) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | REALIZADO |
| Mensagens (envio/leitura) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Notificações (fan-out like/follow/comment) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Busca (posts/comunidades/criadores/#tag) | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | REALIZADO |
| Bloqueios | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Memorial | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Moderação/admin/auditoria | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| Consentimento | 🟢 | 🟢 | 🟢 | 🟢 | 🟢 | ⚫ | REALIZADO |
| PWA/mobile/desktop | 🟢 | — | — | — | — | 🟢 | REALIZADO |
| Ranking personalizado/ML | ⚫ | ⚫ | ⚫ | ⚫ | — | ⚫ | AUSENTE (arquitetura preparada: feed desacoplado + paginação) |
| Cache/filas/workers/OTel | ⚫ | 🟡 logger | ⚫ | ⚫ | — | ⚫ | PARCIAL (logger real; restante AUSENTE) |
| Push nativo/e-mail | ⚫ | ⚫ | ⚫ | ⚫ | — | ⚫ | AUSENTE |
| Marketplace/rewards/ads | 🟡 | ⚫ | ⚫ | ⚫ | ⚫ | 🟢 regras | AUSENTE (UI PENDENTE honesto) |
| Amizade/menções/repost | ⚫ | ⚫ | ⚫ | ⚫ | — | ⚫ | AUSENTE |

## 3. GAPS PRIORIZADOS (valor × dependência)

- P0: nenhum funcional crítico restante no core social.
- P1: push nativo; repost/compartilhar no grafo; menções; paginação nas demais listas (só feed tem cursor).
- P2: ranking por sinais (base pronta); cache; retries/offline-queue de envio; sync em tempo real (listeners) para mensagens/notificações.
- P3: amizade bidirecional (decisão de produto); marketplace; transcodificação de vídeo; embeddings/busca semântica.

## 4. MATURIDADE

**PRODUTO INTERMEDIÁRIO avançado — Nível 3 completo, Nível 4 parcial.**
Motivo técnico: grafo relacional persistido (follow, like, comment, save, block, membership, RSVP), feed paginado, moderação com auditoria, RBAC em rules+backend, PWA instalável, testes por camada. Falta para "madura": ranking, tempo real, push, observabilidade completa e escala horizontal (Nível 5 fora de escopo atual, arquitetura não impede).

## 5. ARQUITETURA (atual, real)

SPA React + roteador manual + contexts + **services Firebase-direto sob rules** (CRUD social) + **Express** (sistema, moderação, scheduler, contato, Guardian) + Admin SDK. Eventos de domínio hoje = fan-out síncrono best-effort (like/follow/comment → notificações); recomendado: fila/worker quando o volume exigir (documentado, não implementado).

## 6. ROADMAP (fases do benchmark)

- FASE 1 Fundação [✓] auth/rules/testes/CI · FASE 2 Core social [✓] perfil/feed/posts/likes · FASE 3 Comunicação [✓] mensagens/notificações/busca · FASE 4 Comunidades [✓] grupos/criadores · FASE 5 Conteúdo avançado [✓] stories/eventos/shorts · FASE 6 Moderação [✓] denúncias/appeals/auditoria · FASE 7 Administração [✓] 18 áreas + Developer + RH · FASE 8 Analytics [•] contagens reais; séries P2 · FASE 9 Escala [ ] cache/filas/tempo-real/push · FASE 10 Avançados [ ] ranking/ML/marketplace.

## 7. RESPOSTAS DIRETAS

- **O que temos?** Rede social relacional completa no core + admin + PWA + testes.
- **O que falta?** Push, tempo real, ranking, marketplace, menções, repost, séries analíticas.
- **O que está incompleto?** Compartilhar (só link), paginação fora do feed, views de stories.
- **O que está apenas visual?** Nada funcional (só editorial/ilustração).
- **Backend/banco/eventos/admin/segurança?** Ver matriz: tudo do core existe; eventos de domínio são síncronos (fila = P2).
- **Para ser madura?** Ranking + realtime + push + observabilidade + escala (roadmap acima).
