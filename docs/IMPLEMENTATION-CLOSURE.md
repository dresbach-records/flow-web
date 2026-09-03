# FLOW — Critério de Fechamento End-to-End

Este documento define o critério operacional para considerar um módulo do FLOW implementado.

Um módulo somente é considerado concluído quando existe integração real entre:

1. Frontend: rota, página, menu/opções, componentes, estados vazio/loading/erro, validação e ações.
2. API: rota, autenticação/autorização, controller, validação e tratamento de erro.
3. Aplicação: use case/service com regra de negócio real.
4. Persistência: repository/adapter Firebase, coleção, índices e regras Firestore/Storage aplicáveis.
5. Administração: telas administrativas, RBAC, ações de moderação/configuração e auditoria quando aplicável.
6. Testes: domínio, aplicação e integração dos fluxos críticos.
7. Nenhum mock de produção ou saldo/estado fictício.

## Domínios obrigatórios

- Identity/Auth/Account/Security/Recovery
- Social/Feed/Posts/Videos/Shorts/Stories/Live
- Follow/Friends/Comments/Likes/Shares/Saves/Hashtags/Mentions
- Notifications
- Messages/Audio Calls/Video Calls/Presence
- Pages/Business/Creator
- Communities/Members/Roles/Moderation
- Flow Shop/Sellers/Products/Carts/Orders/Payments/Shipping/Delivery/Protection/Returns/Refunds/Commissions/Affiliates
- Rewards/Tasks/Campaigns/Qualified Views/Wallet/Ledger/Withdrawals/Anti-Fraud
- Ads/Advertisers/Ad Accounts/Campaigns/Ad Groups/Creatives/Audiences/Domains/Billing/Reviews/Impressions/Clicks/Conversions
- Moderation/Reports/Evidence/Cases/Actions/Appeals/Policies/Piracy/Audit
- Admin/RBAC/Permissions/Modules/Settings/Logs/Audit/Analytics

## Política de implementação

O FLOW terá implementação própria. Referências a Facebook, Instagram, TikTok e outras plataformas servem somente para orientar capacidades e fluxos; não são cópia de código, algoritmo proprietário ou implementação interna.

## Conta comprometida

O fluxo deve suportar solicitação de recuperação, RG frente e verso, termo de autorização autenticado, revisão, revogação de sessões/dispositivos, recuperação e auditoria. Biometria facial permanece como adapter/contrato preparado para futura implementação e não deve ser simulada.

## Moderação e anúncios

Conteúdo, produto e anúncio possuem políticas independentes. Anúncios passam por política, análise automática, revisão manual quando necessário, domínio aprovado e cobrança real. Alteração de destino exige nova revisão. Gemini é provider de classificação/moderação atrás de adapter configurável; não deve ser usado para inventar decisões ou estados.

## Regra de qualidade

Não marcar uma funcionalidade como pronta por possuir somente schema, endpoint, tela ou documentação. O fechamento exige fluxo completo e verificável ponta a ponta.