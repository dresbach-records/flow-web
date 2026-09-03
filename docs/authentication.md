# Autenticação

Usuários e administradores devem possuir fluxos separados. Senhas são protegidas com Argon2id; tokens de acesso são curtos e sessões de refresh devem ser revogáveis e rotacionadas. Segredos ficam apenas no ambiente do backend, nunca em `VITE_*`.
