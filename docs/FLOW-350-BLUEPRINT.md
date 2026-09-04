# FLOW — Blueprint de 350 páginas/estados funcionais

## Objetivo

Este documento transforma a lista funcional existente do FLOW em um contrato de engenharia. O requisito do projeto usa aproximadamente 350 telas/estados funcionais distribuídos em 19 módulos; não é uma contagem oficial de telas do Facebook. A própria lista do projeto orienta que cada item seja tratado como: Tela → Rota → Componente → API → Firestore → Permissão → Estado vazio → Loading → Erro → Mobile → Tablet → Desktop → Dark/Light → Teste.

Fonte funcional: `lista de pagina s da flow.txt` no repositório.

## Regra de implantação

As 350 entradas ficam registradas no `src/core/flow350Blueprint.ts` e permanecem `disabled`. Registro de blueprint NÃO libera rota, NÃO concede permissão e NÃO substitui autorização no backend.

Uma entrada somente poderá passar para `enabled` depois de existir:

1. UI real e responsiva.
2. Contrato de API versionado.
3. Validação de entrada e saída.
4. Autorização server-side.
5. Persistência e regras de negócio necessárias.
6. Loading, vazio, erro e sucesso.
7. Acessibilidade.
8. Observabilidade e auditoria quando aplicável.
9. Testes unitários, integração e fluxo crítico.
10. Teste de segurança e revisão de permissões.

## Distribuição dos 350 slots

| Código | Módulo | Slots |
|---|---|---:|
| 01 | Conta e autenticação | 16 |
| 02 | Feed | 28 |
| 03 | Stories | 18 |
| 04 | Reels / Shorts | 20 |
| 05 | Perfil | 22 |
| 06 | Pesquisa e Explorar | 16 |
| 07 | Mensagens | 20 |
| 08 | Notificações | 16 |
| 09 | Comunidades / Grupos | 20 |
| 10 | Salvos | 8 |
| 11 | Eventos | 10 |
| 12 | Marketplace | 16 |
| 13 | Páginas | 26 |
| 14 | Business Suite | 20 |
| 15 | Anúncios / Ads | 32 |
| 16 | Configurações | 28 |
| 17 | Segurança e moderação | 12 |
| 18 | Criador / profissional | 10 |
| 19 | Administração | 12 |
| **Total** | | **350** |

Os slots são estados funcionais planejados e não devem ser confundidos com 350 URLs independentes. O catálogo original já deixa claro que telas e estados podem ser gerados dinamicamente conforme conta, permissões e contexto.

## Contrato individual de cada slot

Cada `FLOW-XX-YYY` deve conter, no mínimo:

- Identidade: `id`, módulo, título e rota planejada.
- Status: `disabled` até conclusão do Definition of Done.
- Prioridade: P0/P1/P2/P3.
- Função de negócio.
- Frontend: componente, layout, estados e acessibilidade.
- Backend: endpoint/serviço, autorização, persistência e observabilidade.
- Permissões mínimas necessárias.
- Dependências.
- Testes.

O blueprint atual já materializa esses campos para os 350 slots e valida em runtime que o catálogo possui exatamente 350 entradas.

# 01 — Conta e autenticação — 16

Função: identidade, cadastro, login, recuperação, verificação, sessões e segurança da conta.

Requisitos do produto: Login; Criar conta; Recuperar senha; Verificação de e-mail; Verificação de telefone; Código de confirmação; Autenticação em dois fatores; Sessões/dispositivos conectados; Conta bloqueada; Conta desativada; Central de contas; Preferências da conta.

Implementar: cadastro por e-mail/senha e Google; no Google, importar somente os dados fornecidos pelo provedor e solicitar no primeiro acesso os dados obrigatórios faltantes, como CPF, com tela para completar/editar o perfil; recuperação segura; verificação; 2FA; gestão de sessões; bloqueio/desativação; trilha de auditoria.

# 02 — Feed — 28

Função: publicar e consumir conteúdo social, reagir, comentar, compartilhar, salvar e personalizar o ranking.

Requisitos: Para você; Seguindo; Feed principal; publicação de texto; foto; vídeo; enquete; sentimento/atividade; localização; marcação; público; agendamento; rascunhos; edição; exclusão; ocultar; salvar; curtidas; comentários; compartilhamento; copiar link; denunciar; bloquear; silenciar; ver menos conteúdo; explicação de recomendação.

Implementar: composer multimídia, upload seguro, feed paginado/cursor, ranking, reações, comentários, moderação, preferências, compartilhamento e auditoria.

# 03 — Stories — 18

Função: captura/edição/publicação de conteúdo efêmero e controle de visualização.

Requisitos: Stories; Criar Story; Câmera; Upload de foto; Upload de vídeo; Texto; Música; Figurinhas; Enquete; Perguntas; Localização; Menção; GIF; Edição; Privacidade; Arquivo; Visualizadores.

Implementar: câmera somente quando acionada; seleção de mídia; editor; publicação com expiração; lista de visualizadores; privacidade; arquivo; moderação.

# 04 — Reels / Shorts — 20

Função: vídeos curtos, edição, descoberta, publicação e métricas.

Requisitos: Feed de Reels; Criar Reel; Upload de vídeo; Câmera; Cortar vídeo; Áudio; Volume; Música; Texto; Efeitos; Figurinhas; Capa; Legenda; Hashtags; Público; Agendamento; Rascunhos; Estatísticas do Reel.

Implementar: pipeline de upload/transcodificação, editor, áudio licenciado quando aplicável, publicação, feed vertical, métricas e moderação.

# 05 — Perfil — 22

Função: identidade pública, conteúdo, conexões e personalização.

Requisitos: Meu perfil; Perfil de outro usuário; Editar perfil; Foto do perfil; Capa; Bio; Informações pessoais; Publicações; Fotos; Vídeos; Reels; Stories destacados; Seguidores; Seguindo; Amigos/conexões; Sobre; Atividade; Publicações salvas; Publicações curtidas; Menções; Configurações do perfil.

Implementar: perfil limpo e personalizado; upload/edição de foto e capa; edição dos dados; privacidade por campo quando necessária; seguidores/seguindo; conteúdo e atividade.

# 06 — Pesquisa e Explorar — 16

Função: busca e descoberta de conteúdo, pessoas e espaços do FLOW.

Requisitos: Pesquisa; Resultados gerais; Pessoas; Publicações; Vídeos; Reels; Fotos; Grupos; Páginas; Comunidades; Marketplace; Tendências; Hashtags; Histórico de pesquisa.

Implementar: busca indexada, filtros, paginação, histórico com opção de apagar, ranking e proteção contra abuso.

# 07 — Mensagens — 20

Função: comunicação privada individual e em conversa.

Requisitos: Caixa de entrada; Conversa; Nova conversa; Solicitações; Conversas arquivadas; Mensagens não lidas; Pesquisa de mensagens; Envio de foto; vídeo; arquivo; figurinha; GIF; áudio; reação; resposta; encaminhamento; apagar; silenciar; bloquear; denunciar.

Implementar: threads, estados de leitura, anexos, notificações, solicitações, bloqueio, denúncia e regras de retenção.

# 08 — Notificações — 16

Função: central de eventos e alertas do usuário.

Requisitos: Todas; Curtidas; Comentários; Menções; Novos seguidores; Solicitações; Mensagens; Stories; Reels; Grupos; Páginas; Marketplace; Segurança; Push; Preferências.

Implementar: eventos idempotentes, central persistida, push opt-in, preferências por categoria e marcação de lido.

# 09 — Comunidades / Grupos — 20

Função: espaços comunitários, participação e moderação.

Requisitos: Descobrir grupos; Meus grupos; Criar grupo; Página do grupo; Feed; Membros; Administradores; Solicitações; Convites; Eventos; Arquivos; Perguntas; Regras; Moderação; Denúncias; Banimentos; Configurações.

Implementar: papéis e permissões, entrada/saída, convite, feed, arquivos, regras, moderação e auditoria.

# 10 — Salvos — 8

Função: organização pessoal de conteúdo salvo.

Requisitos: Todos os salvos; Publicações; Vídeos; Reels; Links; Coleções; Criar coleção; Editar coleção; Excluir coleção.

Implementar: persistência por usuário, coleções, ordenação, remoção e regras de privacidade.

# 11 — Eventos — 10

Função: descoberta, criação e participação em eventos.

Requisitos: Eventos; Descobrir eventos; Meus eventos; Criar evento; Página do evento; Participantes; Convites; Agenda; Localização; Configurações.

Implementar: CRUD de evento, convites, RSVP/participação, agenda, localização opcional e controles de privacidade.

# 12 — Marketplace — 16

Função: descoberta, venda, compra e comunicação entre usuários.

Requisitos: Marketplace; Pesquisa; Categorias; Produto; Criar anúncio; Editar anúncio; Fotos; Preço; Localização; Mensagens do comprador; Meus anúncios; Vendidos; Salvos; Compras; Avaliações.

Implementar: catálogo, anúncio, mídia, preço, localização opcional, chat contextual, estados de venda e avaliações com antifraude/moderação.

# 13 — Páginas — 26

Função: presença pública e administração de páginas.

Requisitos: Criar Página; Escolher tipo; Informações; Categoria; Descrição; Foto; Capa; Nome de usuário; Página publicada; Feed; Sobre; Fotos; Vídeos; Reels; Stories; Eventos; Serviços; Produtos; Avaliações; Seguidores; Caixa de entrada; Notificações; Comentários; Moderação; Pessoas com acesso; Funções; Permissões; Configurações.

Implementar: entidade Page, membros e papéis, conteúdo, caixa de entrada, moderação, serviços/produtos e autorização por função.

# 14 — Business Suite — 20

Função: operação profissional de conteúdo, mensagens, leads e métricas.

Requisitos: Visão geral; Página inicial; Calendário; Planejador; Publicações; Stories; Reels; Rascunhos; Agendados; Publicados; Caixa de entrada; Comentários; Mensagens; Leads; Notificações; Insights; Visão diária; semanal; mensal; Alcance; Engajamento; Seguidores; Crescimento; Melhor desempenho; Público; Monetização; Configurações comerciais.

Implementar: calendário unificado, agendamento, inbox, leads, dashboards e permissões comerciais. Integrações externas devem ser opt-in e possuir contratos próprios.

# 15 — Anúncios / Ads — 32

Função: publicidade e mensuração dentro das capacidades efetivamente implementadas pelo FLOW.

Requisitos: Gerenciador; Campanhas; Conjuntos; Anúncios; Criar campanha; Objetivo; Orçamento; Programação; Público; Localização; Idade; Gênero; Segmentação; Posicionamentos; Criativo; Texto; Título; CTA; URL; Prévia; Publicação; Revisão; Relatórios; Métricas; Colunas; Filtros; Comparação; Exportação; Biblioteca de anúncios.

Implementar: entidades Campaign/AdSet/Ad, orçamento, targeting permitido, validação, revisão, publicação, métricas, exportação e auditoria. Não solicitar identificador de publicidade, APIs de publicidade ou outras permissões do dispositivo apenas para satisfazer uma tela; a permissão só entra quando uma funcionalidade real depender dela.

# 16 — Configurações — 28

Função: controle central da conta, privacidade, segurança, dados, notificações e publicidade.

Requisitos: Gerais; Conta; Perfil; Privacidade; Segurança; Senha; Login; 2FA; Dispositivos; Bloqueios; Silenciamento; Preferências do Feed; Conteúdo; Idioma; Acessibilidade; Tema claro; Tema escuro; Notificações; E-mail; SMS; Push; Dados pessoais; Download; Transferência; Exclusão; Desativação; Publicidade; Preferências de anúncios; Atividade fora da plataforma; Cookies; Central de privacidade.

Implementar: configurações persistidas, consentimento explícito, exportação/exclusão, gerenciamento de sessão, privacidade e preferências. Tema deve respeitar o design system do FLOW.

# 17 — Segurança e moderação — 12

Função: proteção da comunidade e tratamento de violações.

Requisitos: Central de segurança; Denúncias; Conteúdo denunciado; Contas bloqueadas; Palavras ocultas; Comentários ocultos; Moderação automática; Controle de conteúdo; Violações; Recursos/apelações; Status da conta; Histórico de ações.

Implementar: pipeline de denúncia, fila de moderação, decisões auditáveis, bloqueios, recursos e status da conta.

# 18 — Criador / profissional — 10

Função: ferramentas profissionais para criadores.

Requisitos: Painel profissional; Visão geral; Conteúdo; Insights; Público; Monetização; Ferramentas profissionais; Parcerias; Conteúdo de marca; Colaborações; Biblioteca de conteúdo; Agendamento; Desempenho.

Implementar: dashboard, biblioteca, métricas, agenda e controles de colaboração. Monetização deve ficar desabilitada até existir integração e regras reais.

# 19 — Administração — 12

Função: administração operacional e empresarial do FLOW.

Requisitos: Administradores; Equipes; Permissões; Contas vinculadas; Páginas vinculadas; Contas de anúncios; Métodos de pagamento; Faturamento; Histórico financeiro; Integrações; APIs; Webhooks; Aplicativos; Segurança empresarial.

Implementar: RBAC/ABAC server-side, auditoria, gestão de integrações, webhooks idempotentes, credenciais protegidas e logs de segurança. Nunca usar o blueprint como mecanismo de autorização.

# Permissões de dispositivo e integrações

As permissões devem seguir o princípio de menor privilégio. O catálogo funcional não justifica automaticamente acesso a contatos, calendário, localização, microfone, câmera, armazenamento, identificador de publicidade ou APIs externas.

Quando uma função real exigir uma permissão:

- explicar ao usuário por que ela é necessária;
- solicitar somente no momento de uso;
- permitir recusa quando tecnicamente possível;
- persistir consentimento/preferência de forma adequada;
- implementar a função correspondente no backend quando houver processamento server-side;
- cobrir o fluxo com testes.

Para calendário, por exemplo, a funcionalidade precisa existir de fato no FLOW antes de pedir leitura/escrita de agenda. Para publicidade, identificadores e APIs de ads só devem ser usados quando o produto tiver uma integração de publicidade que dependa deles.

# Definition of Done dos 350

Um slot deixa `disabled` somente quando o fluxo estiver funcional ponta a ponta. A habilitação deve ocorrer por módulo/feature flag controlada, com autorização backend independente.

Checklist obrigatório:

- [ ] rota e navegação;
- [ ] UI real, sem texto de implementação exposto ao usuário;
- [ ] estados loading/empty/error/success;
- [ ] responsivo mobile/tablet/desktop;
- [ ] acessibilidade;
- [ ] API/serviço real;
- [ ] persistência real;
- [ ] autorização server-side;
- [ ] validação e tratamento de erros;
- [ ] logs/telemetria;
- [ ] auditoria para ações sensíveis;
- [ ] testes automatizados;
- [ ] revisão de segurança/permissões;
- [ ] documentação atualizada;
- [ ] feature flag habilitada somente após aprovação.

## Referência de código

- Blueprint: `src/core/flow350Blueprint.ts`
- Fonte funcional: `lista de pagina s da flow.txt`
- Aplicação atual: `src/App.tsx`

O build atual do projeto já conclui TypeScript + Vite; o blueprint foi desenhado para não alterar as rotas públicas existentes enquanto as 350 entradas permanecem desabilitadas.
