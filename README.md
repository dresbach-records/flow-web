# FLOW Web

Site institucional e experiência web da rede social FLOW. O projeto é **multi-plataforma via navegador**: funciona em desktop, notebook, tablet e celular, com layout responsivo e adaptação automática de telas, sem exigir instalação de aplicativo e sem depender de PWA.

## Princípio de plataforma

O FLOW Web é uma aplicação web responsiva comum.

- Acesso por navegador em computadores, tablets e smartphones.
- Interface autoajustável para diferentes larguras, densidades e orientações.
- Navegação por mouse, teclado e toque.
- Áreas de toque adequadas para dispositivos móveis.
- Safe-area para aparelhos com notch e barras de navegação.
- Não exige instalação.
- Não apresenta o fluxo como “instale o PWA”.
- Não depende de Service Worker para funcionar.
- O usuário pode simplesmente abrir a URL do FLOW no navegador.
- A mesma base de front-end atende desktop, tablet e mobile.

## Arquitetura de experiência

O projeto mantém três áreas independentes:

1. **Site institucional** — `/`
2. **Rede social** — `/app`
3. **Administração** — `/admin`

O painel administrativo não aparece na navegação pública.

## Site público

- `/` — Home
- `/for-you` — apresentação do For You
- `/explorar` — tendências, hashtags e conteúdos
- `/recursos` — recursos da plataforma
- `/criadores` — creators
- `/comunidades` — comunidades
- `/seguranca` — segurança
- `/empresa`
- `/sobre`
- `/carreiras`
- `/carreiras/vagas`
- `/imprensa`
- `/blog`
- `/blog/:slug`
- `/contato`
- `/parcerias`
- `/marcas`
- `/media-kit`
- `/acessibilidade`

### Ajuda

- `/ajuda`
- `/ajuda/faq`
- `/ajuda/conta`
- `/ajuda/privacidade`
- `/ajuda/seguranca`
- `/ajuda/criadores`
- `/ajuda/comunidades`
- `/ajuda/denuncias`
- `/ajuda/contato`

### Legal

- `/legal/termos`
- `/legal/privacidade`
- `/legal/cookies`
- `/legal/diretrizes`
- `/legal/conteudo`
- `/legal/direitos-autorais`
- `/legal/denuncias`

## Autenticação

- `/auth/login`
- `/login`
- `/cadastro`
- `/recuperar-senha`
- `/redefinir-senha`
- `/verificar-conta`

A implementação atual possui experiência local de demonstração, preparada para posteriormente consumir APIs reais. Nenhuma credencial de demonstração precisa de banco real para o funcionamento visual do front-end.

## Rede social

`/app` abre diretamente no **For You**.

Rotas previstas:

- `/app`
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

A experiência social inclui estados locais para For You/Following, stories, curtidas, comentários, compartilhamento, salvamento, upload de foto/vídeo, Shorts, perfil, mensagens e comunidades.

## Responsividade

O arquivo `src/responsive.css` concentra os ajustes de viewport para:

- desktop amplo;
- notebook;
- tablet;
- smartphone;
- telas estreitas;
- orientação vertical e horizontal;
- navegação touch;
- safe-area do dispositivo;
- redução de movimento quando solicitada pelo sistema.

Os componentes são redimensionados e reorganizados em vez de criar uma segunda aplicação mobile.

## Downloads / lojas

A seção de download utiliza ícones visuais das lojas e o estado **“Em breve”**. Os destinos atuais apontam para as páginas oficiais da App Store e Google Play, sem apresentar falsamente um aplicativo FLOW já publicado.

Quando os aplicativos oficiais FLOW forem publicados, os links podem ser trocados pelos URLs específicos das respectivas páginas do FLOW.

## Administração

A administração permanece em `/admin`, separada da experiência pública, com login e módulos administrativos existentes no projeto.

## Stack

- React
- TypeScript
- Vite
- CSS responsivo
- Lucide Icons
- Local state/mock para desenvolvimento do front-end
- Contratos preparados para integração posterior com APIs

## Build e desenvolvimento

```bash
npm install
npm run build
npm run dev
```

O deploy é compatível com Vercel. O `vercel.json` possui rewrite para SPA, permitindo acesso direto às rotas sem depender de navegação prévia pela home.

## Identidade FLOW

Paleta principal:

- Azul `#2663EB`
- Ciano `#00D2BE`
- Roxo `#7C58FF`
- Rosa `#F24882`
- Fundo `#F6F8FC`
- Texto `#101827`

O site institucional tem identidade própria. A experiência social começa em `/app` e o painel administrativo em `/admin`.

## Regra de produto

**FLOW é uma rede social web multi-plataforma.** O usuário não precisa instalar nada para acessar a experiência. Basta abrir o FLOW no navegador do dispositivo.

© 2026 FLOW. Todos os direitos reservados.
