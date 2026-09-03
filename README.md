# FLOW Web

Site institucional e experiência web da rede social FLOW. Aplicação web responsiva comum para desktop, notebook, tablet e celular; não depende de PWA ou instalação.

## Arquitetura frontend

A estrutura canônica segue a separação apresentada no padrão de referência do projeto:

```text
src/
├── assets/          # arquivos e referências de assets
├── components/      # componentes UI reutilizáveis
├── contexts/        # estado/contextos globais
├── hooks/           # hooks e lógica reutilizável
├── layouts/         # layouts de site, app e administração
├── pages/           # páginas/entrypoints das rotas
├── services/        # comunicação com backend e regras de integração
│   ├── api/         # cliente HTTP/API
│   ├── ads/         # integração de anúncios
│   ├── commerce/    # Flow Shop e operações comerciais
│   ├── identity/    # identidade/KYC
│   ├── moderation/  # denúncias e Trust & Safety
│   └── rewards/     # recompensas e pagamentos
├── store/           # estado global da aplicação
├── styles/          # entrada global de estilos
├── utils/           # funções utilitárias
├── App.tsx          # composição/roteamento principal
└── main.tsx         # bootstrap da aplicação
```

### Regra de dependência

- `pages` compõem telas e casos de uso de apresentação.
- `components` são reutilizáveis e não devem conhecer detalhes de infraestrutura.
- `hooks` encapsulam comportamento reutilizável.
- `contexts` e `store` concentram estado global.
- `services` são a fronteira de integração com backend/API e provedores externos.
- Credenciais, segredos, validações de segurança e operações sensíveis permanecem no backend; nunca no bundle do navegador.
- `styles` é o ponto de entrada dos estilos globais.
- `main.tsx` apenas inicializa a aplicação; a composição fica em `App.tsx`.

## Áreas do produto

1. **Site institucional** — `/`
2. **Rede social** — `/app`
3. **Administração** — `/admin`

O painel administrativo permanece separado da navegação pública.

## Módulos

A plataforma possui registro central de módulos e painel administrativo para manutenção futura. Os módulos previstos incluem Social, For You, Shorts, Stories, Live, Comunidades, Mensagens, Flow Shop, Vendedores, Afiliados, Ads, Rewards, Moderação, Denúncias, Segurança, Antipirataria, Analytics e Auditoria.

Os módulos são projetados para serem habilitados, desabilitados ou colocados em manutenção de forma centralizada, sem acoplar essa decisão às telas.

## Backend/API

O frontend não implementa backend dentro de componentes. A comunicação deverá passar por `src/services/backend` e pelos serviços de domínio em `src/services/*`.

A camada atual fornece contratos de integração e adaptadores iniciais para substituir os mocks/dados locais por APIs reais sem alterar a composição das páginas.

## Site público

- `/`
- `/for-you`
- `/explorar`
- `/recursos`
- `/criadores`
- `/comunidades`
- `/seguranca`
- `/empresa`
- `/sobre`
- `/carreiras`
- `/carreiras/vagas`
- `/imprensa`
- `/blog`
- `/contato`
- `/parcerias`
- `/marcas`
- `/media-kit`
- `/acessibilidade`

### Ajuda

`/ajuda`, `/ajuda/faq`, `/ajuda/conta`, `/ajuda/privacidade`, `/ajuda/seguranca`, `/ajuda/criadores`, `/ajuda/comunidades`, `/ajuda/denuncias`, `/ajuda/contato`.

### Legal

`/legal/termos`, `/legal/privacidade`, `/legal/cookies`, `/legal/diretrizes`, `/legal/conteudo`, `/legal/direitos-autorais`, `/legal/denuncias`.

## Autenticação

`/auth/login`, `/login`, `/cadastro`, `/recuperar-senha`, `/redefinir-senha`, `/verificar-conta`.

A experiência local de demonstração está preparada para ser substituída por autenticação real via API.

## Rede social

`/app` abre no For You. A aplicação também contempla seguindo, explorar, Shorts, criação, Stories, notificações, mensagens, comunidades, perfil, configurações, busca, hashtags e posts.

## Commerce / Flow Shop

A camada de serviços separa as políticas e operações comerciais da UI. O frontend está preparado para integrar catálogo, vendedor, pedidos, entrega, reclamação, troca/devolução, comissionamento e repasses por APIs de backend.

Produtos locais usados permanecem como transações entre usuários conforme as regras de produto; itens proibidos, pirataria e categorias reguladas devem ser bloqueados/revisados por políticas de Trust & Safety no backend.

## Ads / Rewards

A integração de publicidade fica em `src/services/ads`. O frontend representa formatos e estados de revisão, enquanto credenciais, aprovação de campanhas, domínios e integração com provedores devem ser tratados pelo backend.

Rewards fica em `src/services/rewards`, mantendo saldo, regras de elegibilidade e pagamentos fora da camada visual.

## Segurança e moderação

Denúncias e decisões de moderação ficam em `src/services/moderation`. O frontend oferece a experiência; validações antifraude, antipirataria, KYC, análise de conteúdo e cooperação com autoridades são responsabilidades de backend/infraestrutura.

## Responsividade

A aplicação utiliza uma única base frontend para desktop, tablet e mobile, com safe-area, touch targets e adaptação de layout.

## Stack

- React
- TypeScript
- Vite
- CSS responsivo
- Lucide Icons
- APIs via camada de services

## Build

```bash
npm install
npm run build
npm run dev
```

O deploy é compatível com Vercel e utiliza rewrite para SPA.

## Identidade FLOW

Paleta principal: azul `#2663EB`, ciano `#00D2BE`, roxo `#7C58FF`, rosa `#F24882`, fundo `#F6F8FC` e texto `#101827`.

© 2026 FLOW. Todos os direitos reservados.
