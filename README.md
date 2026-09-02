# FLOW Web

Site institucional + experiência web da rede social FLOW, com identidade própria e separação clara entre site público, aplicação social e administração.

## Estrutura de rotas

### Site público
- `/` — Home
- `/for-you` — apresentação do For You
- `/explorar` — tendências, hashtags e conteúdos
- `/recursos` — recursos da plataforma
- `/criadores` — área para creators
- `/comunidades` — comunidades
- `/seguranca` — segurança
- `/empresa`, `/sobre`, `/carreiras`, `/carreiras/vagas`, `/imprensa`, `/blog`, `/contato`, `/parcerias`, `/marcas`, `/media-kit`
- `/ajuda`, `/ajuda/faq`, `/ajuda/conta`, `/ajuda/privacidade`, `/ajuda/seguranca`, `/ajuda/criadores`, `/ajuda/comunidades`, `/ajuda/denuncias`, `/ajuda/contato`
- `/legal/termos`, `/legal/privacidade`, `/legal/cookies`, `/legal/diretrizes`, `/legal/conteudo`, `/legal/direitos-autorais`, `/legal/denuncias`, `/acessibilidade`

### Autenticação
- `/auth/login` e `/login`
- `/cadastro`
- `/recuperar-senha`
- `/redefinir-senha`
- `/verificar-conta`

A experiência atual usa acesso local de demonstração. Nenhuma informação de credencial é enviada para um serviço externo.

### Aplicação social
- `/app` — abre diretamente em **For You**
- `/app/seguindo`
- `/app/explorar`
- `/app/shorts`
- `/app/criar`
- `/app/criar/post`
- `/app/criar/short`
- `/app/stories`
- `/app/notificacoes`
- `/app/mensagens`
- `/app/comunidades`
- `/app/comunidades/:slug`
- `/app/perfil`
- `/app/perfil/:username`
- `/app/configuracoes`
- `/app/busca`
- `/app/hashtag/:tag`
- `/app/post/:id`

O front-end inclui navegação SPA, For You/Following, stories, curtidas, comentários, compartilhamento, salvamento, upload de foto/vídeo, Shorts, perfil, mensagens e comunidades em modo local.

### Administração
A rota `/admin` continua isolada da navegação pública e mantém o painel administrativo existente.

## Lojas móveis
O site usa os destinos oficiais da Apple App Store e Google Play, com indicação **Em breve**. Quando o FLOW tiver páginas próprias nas lojas, basta substituir os destinos pelos links oficiais do aplicativo.

## Deploy
Vite + React + TypeScript. O `vercel.json` contém rewrite SPA para que as rotas do site e da aplicação funcionem diretamente no Vercel.

Comandos:

```bash
npm install
npm run build
npm run dev
```

## Identidade

Paleta principal: azul `#2663EB`, ciano `#00D2BE`, roxo `#7C58FF`, rosa `#F24882`, fundo claro `#F6F8FC` e texto `#101827`.

O produto evita transformar a home institucional em uma tela da rede social: a apresentação pública é própria, enquanto `/app` é a experiência social.
