# 11 — SEARCH ARCHITECTURE

> Status do documento: **vivo**. Referência de maturidade: [Graph Search (Meta)](https://engineering.fb.com/2013/03/14/core-infra/under-the-hood-indexing-and-ranking-in-graph-search/) e [Posts Search (Meta)](https://engineering.fb.com/2013/10/24/core-infra/under-the-hood-building-posts-search/).

---

## 1. Estado atual

A busca da FLOW é **client-side** sobre listas reais do Firestore:

| Superfície | Implementação | Dados |
|---|---|---|
| `/app/pesquisa` (`SearchModule`) | `listDocuments('posts')` + `listCommunities(30)` + `listCreators(30)`; filtro client-side | real |
| Busca por hashtag | `#tag` exato (`extractHashtags`) | real |
| Topbar search | redireciona para `/app/busca?q=` | real |
| Explore | `posts` recentes + filtro de hashtags + busca | real |
| Help/Blog | índice estático local (`HELP_ARTICLES`, `BLOG_POSTS`) | **static** (conteúdo editorial) |

### Limitações
- Sem índice de busca (Full-Text Search). Busca carrega listas e filtra no cliente — **não escala**.
- Sem autocomplete.
- Sem relevância (ordenação por `createdAt`).
- Sem busca em mensagens (intencional — privacidade).

## 2. Arquitetura alvo

```mermaid
flowchart LR
  W[Write: post/community/user] --> EV[Evento (PostCreated, ...)]
  EV --> IDX[Indexer]
  IDX --> SI[(Search Index)]
  Q[Query] --> QU[Query Processor]
  QU --> RANK[Ranking/Relevância]
  RANK --> SI
  RANK --> RESP[Response paginada]
```

### Componentes recomendados
| Componente | Tecnologia sugerida | Motivo |
|---|---|---|
| Índice | Algolia / Meilisearch / Typesense | FTS + relevância + facets, hospedado ou self-host |
| Indexer | Cloud Functions / fila | consome eventos de escrita |
| Ranking | relevância + recência + afinidade | — |
| Autocomplete | prefix search do índice | — |

## 3. Escopos de busca

| Entidade | Hoje | Alvo | Prioridade |
|---|---|---|---|
| Usuários | `users` (por nome, client) | index com ranking | P1 |
| Posts | `posts` (client, por texto/hashtag) | index FTS | P1 |
| Comunidades | `listCommunities` client | index | P1 |
| Criadores | `creator_profiles` client | index | P1 |
| Hashtags | exato | prefix + trending | P1 |
| Mensagens | **não** | não buscar por privacidade | — |
| Ajuda/Blog | static | pode indexar editorial | P2 |

## 4. Relevância

Score = `BM25(texto, query)` + recência + afinidade (seguidos) + popularidade (engajamento) − penalidade por bloqueio/moderação.

## 5. Filtros

- Tipo (posts/comunidades/criadores).
- Ordenação (relevância/recência).
- Filtro de hashtag.
- Visibilidade/privacy: conteúdo privado ou de bloqueados jamais indexado.
- Conteúdo moderado/denunciado excluído da busca.

## 6. Privacidade e segurança

- Nunca indexar mensagens, e-mails, dados pessoais sensíveis.
- Indexer deve respeitar `visibility` e bloqueios (checks no write path).
- Custo de queries limitado por rate limiting.
- LGPD: exclusão de documento deve remover do índice (soft-delete sync).

## 7. Roadmap

1. **[IMPLEMENTADO]** Busca client-side + hashtags (escala pequena).
2. **[PLANEJADO] P1** — adotar índice FTS (Meilisearch/Algolia) para posts/comunidades/criadores, com indexação via eventos.
3. **[PLANEJADO] P2** — autocomplete, busca em ajuda/blog, facets.
4. **[PLANEJADO] P3** — embeddings/semântica (ver `10-RANKING-ARCHITECTURE.md`).