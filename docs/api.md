# API

A API usa prefixo `/api/v1` e JSON. Endpoints atuais incluem `auth/register`, `auth/login`, `feed`, `posts`, `posts/:id/like` e `reports`. Respostas de erro incluem códigos estáveis; requisições recebem `x-request-id`.

O cliente web usa `VITE_API_URL` e cookies com `credentials: include`.
