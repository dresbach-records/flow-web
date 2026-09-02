# FLOW Commerce & Advertising

Fundação frontend para três capacidades da plataforma:

## Native Ad Posts
`NativeAdPost` normaliza anúncios externos e campanhas próprias para o feed. O frontend deve renderizar publicidade claramente identificada como patrocinada. A integração Google deve ocorrer através de uma camada de provider/adapter, sem credenciais no browser.

## Denúncias
`ReportCase` representa denúncias originadas no feed ou nos pontos públicos de segurança. Categorias e prioridades são centralizadas em `CommerceFoundation.ts`. A API futura deve fornecer protocolo, status, histórico e decisão ao usuário e ao painel administrativo.

## FLOW Shop
`Store` e `Product` são os contratos iniciais para páginas de empresas, catálogo e social commerce. O frontend deve suportar loja, produto, carrinho, checkout e pedidos quando as APIs estiverem disponíveis.

## Rotas planejadas
- `/denuncia`
- `/app/denuncias`
- `/shop`
- `/shop/:store`
- `/shop/produto/:id`
- `/shop/carrinho`
- `/shop/checkout`
- `/shop/pedidos`
- `/admin/anuncios`
- `/admin/denuncias`
- `/admin/lojas`
- `/admin/produtos`
- `/admin/pedidos`

Os contratos são frontend-first e não substituem a implementação de API, pagamentos, moderação ou integração de terceiros.
