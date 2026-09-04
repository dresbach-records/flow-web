# FLOW Database Layer

Esta pasta é a fonte oficial dos contratos de persistência do backend.

## Neon / PostgreSQL

`db/neon/schema.prisma` contém somente a persistência relacional necessária nesta fase para identidade, autenticação, sessões e dados sensíveis de conta. O Prisma Client continua sendo consumido pela infraestrutura/repositories do backend; controllers e módulos de negócio não acessam o banco diretamente.

## MongoDB

`db/mongo/schemas` contém os contratos das coleções sociais e de alta movimentação utilizadas provisoriamente: posts, vídeos, comentários, likes, feed, denúncias, moderação, produtos, pedidos, anúncios, rewards e notificações.

`db/mongo/indexes` centraliza os índices esperados para as coleções.

## Regra arquitetural

Frontend -> API -> Application -> Domain -> Repository -> Infrastructure -> Database.

Nenhum segredo, senha ou dado sensível deve ser persistido em MongoDB. A futura migração para infraestrutura própria deve substituir adapters/repositories sem alterar as regras de domínio.
