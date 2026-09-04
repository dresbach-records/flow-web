# FLOW — CONTRATO OBRIGATÓRIO DE IMPLEMENTAÇÃO UI/UX

> Este documento deve ser lido por qualquer IA/agente antes de alterar o projeto. Ele é uma regra de implementação, não um mockup.

## REGRA ZERO

É PROIBIDO entregar páginas estáticas, mockups, telas demonstrativas desconectadas, botões sem ação, links mortos, dados falsos permanentes ou textos dizendo “em breve”, “TODO”, “FIXME”, “não implementado” ou equivalentes na experiência final.

Se uma tela estiver registrada no blueprint, a IA deve saber exatamente o que implementar antes de habilitá-la. Enquanto a função não estiver completa, a entrada permanece `disabled` e não deve ser apresentada como funcional.

Nenhuma funcionalidade existente pode ser removida ou substituída por mock sem motivo técnico documentado.

## COMO A IA DEVE TRABALHAR

1. Auditar a estrutura existente antes de modificar arquivos.
2. Identificar rotas, componentes, serviços, hooks, autenticação, Firebase, APIs, banco, regras e assets existentes.
3. Reutilizar componentes e funcionalidades existentes quando corretos.
4. Corrigir implementação incompleta em vez de criar uma segunda implementação paralela.
5. Para cada página, definir rota, objetivo, ações, estados, permissões, dados, API e persistência.
6. Implementar frontend e backend necessários para a função real.
7. Implementar loading, empty, error, success, disabled, hover, focus e selected.
8. Testar mobile, tablet e desktop.
9. Executar build, testes e auditoria de rotas.
10. Não marcar uma página como pronta enquanto houver botão sem ação, rota quebrada ou dado fake substituindo dado real.

## REGRA DE LAYOUT GLOBAL

A Flow é uma rede social com experiência clara como identidade principal.

Desktop:
- header fixo no topo;
- navegação lateral fixa quando a área exigir sidebar;
- conteúdo central com largura controlada;
- áreas auxiliares somente quando houver espaço real;
- nenhum elemento deve causar overflow horizontal;
- sidebar não deve sobrepor conteúdo;
- conteúdo deve possuir container e espaçamento consistente.

Tablet:
- reduzir a sidebar para modo compacto quando necessário;
- adaptar grids e colunas;
- nunca comprimir texto, botões ou cards até ficarem inutilizáveis.

Mobile:
- header adaptável;
- sidebar vira drawer/menu;
- feed ocupa a largura disponível;
- stories usam rolagem horizontal;
- cards são fluidos;
- modais ocupam a maior parte da tela quando apropriado;
- ações importantes devem ser touch-friendly;
- não permitir scroll horizontal da página.

## ESPAÇAMENTO

Não usar espaçamento aleatório por componente.

Usar os tokens do Design System FLOW. Espaçamento deve seguir uma escala consistente e ser responsivo quando necessário.

Evitar:
- margens negativas para corrigir layout;
- dezenas de valores diferentes para o mesmo contexto;
- padding exagerado;
- áreas vazias sem função;
- elementos colados nas bordas;
- cards com alturas fixas desnecessárias.

## GRADE / GRID

Usar CSS Grid/Flexbox conforme o problema.

Regras:
- grids fluidos;
- `minmax()` quando apropriado;
- `clamp()` para tipografia e espaçamento fluidos;
- `max-width` para leitura e feed;
- `aspect-ratio` para mídia;
- container queries quando trouxerem benefício real.

Nunca criar uma grade que dependa de uma resolução específica.

Não resolver quebra de layout com `overflow:hidden` indiscriminado.

## HEADER

Desktop: logo, pesquisa, navegação prioritária, ações e avatar.

Mobile: logo, pesquisa/ação de busca, ações prioritárias e menu.

Não espremer todos os elementos em uma única linha. Elementos secundários devem desaparecer, recolher ou migrar para menu.

## SIDEBAR

Menu principal:
- Início
- Explorar
- Shorts
- Criar
- Mensagens
- Comunidades
- Perfil
- Salvos
- Configurações
- Agendamentos

“Para você” e “Seguindo” pertencem ao feed, não à sidebar.

Desktop: fixa.
Tablet: compacta quando necessário.
Mobile: drawer.

## FEED

Ordem padrão:
Header → Stories → tabs “Para você/Seguindo” → Composer → Publicações.

Composer deve permitir somente ações realmente implementadas:
- texto;
- foto;
- vídeo;
- enquete;
- sentimento/atividade quando implementado;
- localização quando implementada;
- agendamento quando implementado.

Botão de publicar deve ser proporcional e contextual, não um botão gigante ocupando o composer.

Post deve possuir ações funcionais:
Curtir → comentar → compartilhar → salvar → mais opções.

Mais opções devem respeitar proprietário/permissão e conter somente ações implementadas.

## PERFIL

Perfil real, baseado no usuário autenticado ou perfil consultado.

Deve suportar, conforme o escopo habilitado:
- avatar;
- capa;
- nome;
- username;
- bio;
- informações;
- seguidores;
- seguindo;
- publicações;
- fotos;
- vídeos;
- reels;
- editar perfil;
- seguir/deixar de seguir;
- mensagem;
- bloqueio/silenciamento/denúncia.

Clicar no avatar/nome deve usar roteamento real.

## EXPLORAR

Pesquisa e descoberta reais. Resultados devem possuir ação e destino.

Nenhuma tendência, categoria, pessoa, comunidade, página ou conteúdo deve ser um cartão sem comportamento.

## SHORTS / REELS

Experiência vertical e responsiva.

Ações: play/pause, mute, volume, curtir, comentar, compartilhar, salvar, seguir e abrir perfil quando implementadas.

Vídeo precisa ter estados de carregamento, erro e indisponibilidade.

## STORIES

Rolagem horizontal no mobile. Não cortar cards. Não mostrar scrollbar visual quando o design determinar ocultação, mas manter a rolagem funcional.

## MENSAGENS

Lista de conversas → conversa real.

Enviar texto, mídia, emoji, anexos e demais tipos somente se o backend suportar.

Não simular envio alterando apenas estado local como implementação final.

## COMUNIDADES

Descoberta → página → membros → posts → regras → moderação → configurações.

Permissões de membro, moderador e administrador devem ser verificadas no backend.

## CRIAR

Cada opção apresentada precisa possuir ação real ou permanecer desabilitada:
- publicação;
- foto;
- vídeo;
- short/reel;
- story;
- enquete;
- página;
- comunidade;
- evento.

## PÁGINAS E NEGÓCIOS

Criar página deve ser um fluxo real:
Tipo → nome → categoria → informações → foto/capa → username → revisão → publicação.

Depois da publicação:
Feed, Sobre, mídia, seguidores, mensagens, eventos, serviços/produtos, equipe, funções e configurações conforme o módulo habilitado.

## CONFIGURAÇÕES

Categorias devem ser navegáveis e persistir alterações reais:
Conta, Perfil, Privacidade, Segurança, Notificações, Acessibilidade, Preferências, Idioma, Tema, Bloqueios, Silenciados, Sessões, Dispositivos, Dados, Conteúdo, Comunidades, Mensagens, Aplicativo/PWA.

Tema:
- Claro = padrão.
- Escuro = suportado.
- Sistema = segue preferência do dispositivo.

## BOTÕES

Todo botão precisa responder a uma intenção concreta.

Proibido:
- `href="#"` como destino final;
- `javascript:void(0)`;
- botão que apenas fecha sem executar a intenção anunciada;
- botão “Publicar” que não persiste;
- botão “Salvar” que não salva;
- botão “Seguir” que não altera relação;
- botão “Mensagem” que não abre conversa real;
- botão “Editar” sem formulário/persistência;
- ícone decorativo apresentado como ação sem `aria-label`.

Se uma função ainda não existir, o controle deve permanecer desabilitado e explicar o estado somente em contexto apropriado de desenvolvimento, nunca como experiência final de produto.

## TEXTOS

Textos da interface devem explicar a função para o usuário. Não devem revelar arquitetura, código, backend, frontend, implementação pendente ou limitações internas.

Exemplos proibidos em produção:
- “Firebase ainda não implementado”;
- “Backend TODO”;
- “Feature em breve”;
- “Mock data”;
- “API pendente”.

## DADOS

Dados reais devem vir da camada de dados apropriada.

Mocks/fixtures somente para testes, desenvolvimento ou seed explicitamente isolado.

Nunca colocar usuários falsos permanentes na interface para dar aparência de rede social funcionando.

## PERMISSÕES

Princípio do menor privilégio.

Permissões de câmera, microfone, fotos/vídeos, localização, calendário, contatos, publicidade e outras APIs externas somente quando a função correspondente existir.

Solicitar permissão no momento de uso quando possível.

Permissão de dispositivo não substitui autorização de backend.

## BACKEND

Toda operação de escrita precisa ter autenticação e autorização server-side.

Operações críticas devem ter auditoria e, quando exigido pelo risco, step-up MFA.

O frontend nunca deve ser a fonte de verdade para:
- papel;
- permissões;
- propriedade de conteúdo;
- acesso a dados privados;
- cobrança;
- ações administrativas.

## ESTADOS OBRIGATÓRIOS

Cada tela funcional deve prever:
- loading;
- empty;
- error;
- success;
- disabled;
- hover;
- focus;
- active;
- selected;
- permission denied quando aplicável;
- offline/retry quando aplicável.

## ACESSIBILIDADE

Usar HTML semântico, labels, ARIA somente quando necessário, foco visível, teclado, contraste e alt text.

## RESPONSIVIDADE MÍNIMA

Validar pelo menos:
320, 360, 375, 390, 412, 430, 480, 768, 820, 1024, 1280, 1366, 1440, 1600, 1920 e 2560px.

## DESIGN SYSTEM

Nunca espalhar hexadecimal, radius, shadow, spacing ou tipografia arbitrariamente.

Toda nova tela deve usar os tokens e componentes oficiais do FLOW.

## QA OBRIGATÓRIO

Antes de considerar uma página implementada:

- rota funciona;
- navegação funciona;
- build passa;
- TypeScript passa;
- testes passam;
- console sem erros da aplicação;
- claro funciona;
- escuro funciona;
- mobile funciona;
- tablet funciona;
- desktop funciona;
- ações persistem;
- permissões são respeitadas;
- estados existem;
- acessibilidade básica validada.

## REGRA DE LIBERAÇÃO

`disabled` → implementação → testes → revisão → `enabled`.

Nunca:

`disabled` → tela bonita → `enabled`.

O FLOW deve ser tratado como produto real. A aparência é parte da qualidade, mas uma tela somente é considerada pronta quando seu comportamento e contrato de dados também estiverem prontos.
