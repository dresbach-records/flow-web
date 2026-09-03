# Arquitetura

O FLOW possui frontend Vite/React em `src/` e API Node/Express em `backend/`. O frontend acessa dados exclusivamente por `src/services/api`; a API separa identidade relacional no PostgreSQL/Prisma de conteúdo operacional no MongoDB.

Módulos são descritos pelo `ModuleRegistry` e podem evoluir para configuração persistida. Domínios financeiros devem usar eventos e ledgers imutáveis.
