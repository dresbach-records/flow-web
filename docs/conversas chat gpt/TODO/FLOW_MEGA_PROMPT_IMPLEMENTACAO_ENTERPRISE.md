# FLOW — MEGA PROMPT DE IMPLEMENTAÇÃO ENTERPRISE
## Site + Rede Social + Painel Administrativo + Mobile + PWA + Backend + Firebase

## 1. REGRA ABSOLUTA — ZERO STATIC E ZERO MOCK

ESTA REGRA É OBRIGATÓRIA E NÃO PODE SER IGNORADA.

É TERMINANTEMENTE PROIBIDO criar, manter ou entregar funcionalidades static, mockadas, fictícias ou simuladas no projeto FLOW.

É proibido:
- mock data;
- arrays fictícios;
- JSON estático como substituto de banco;
- usuários, posts, comunidades, mensagens ou notificações fictícias;
- respostas simuladas;
- setTimeout simulando processamento;
- Promise.resolve simulando API;
- console.log como substituto de implementação;
- alert como substituto de operação;
- botões sem ação;
- rotas fictícias;
- páginas falsas;
- estados de sucesso sem confirmação real;
- TODO como implementação final;
- modo demonstração para esconder funcionalidades incompletas.

Se uma funcionalidade exigir backend, ela deve possuir backend real.
Se exigir persistência, deve possuir persistência real.
Se exigir autenticação, deve possuir autenticação real.
Se exigir autorização, deve possuir autorização real.

## 2. REGRA ABSOLUTA — TUDO QUE FOR CRIADO DEVE SER IMPLEMENTADO NO BACKEND

Nenhuma funcionalidade nova deve ser criada somente no frontend.

Toda funcionalidade que envolva dados, regras de negócio, autenticação, autorização, persistência ou processamento deve possuir implementação correspondente no backend.

Fluxo esperado:

UI
↓
Componente
↓
Hook
↓
Service
↓
API
↓
Controller
↓
Use Case / Application Service
↓
Domain / Regra de Negócio
↓
Repository
↓
Firebase / Banco de Dados
↓
Resposta
↓
Service
↓
Estado da UI

Para cada funcionalidade, identificar ação, componente, estado, hook, service, endpoint, método HTTP, controller, use case, regra de negócio, repository, persistência, autorização, resposta e tratamento de erro.

## 3. REGRA DE DEPENDÊNCIAS — NPM E BIBLIOTECAS

Sempre que uma funcionalidade, componente, integração, PWA, API, backend, autenticação, banco, processamento ou qualquer outro recurso criado exigir uma dependência externa, instale automaticamente os pacotes NPM e bibliotecas necessários.

Antes de instalar:
1. analisar package.json;
2. analisar lockfile;
3. identificar o gerenciador oficial;
4. verificar versões existentes;
5. evitar duplicações e conflitos;
6. utilizar versões estáveis e compatíveis.

Após instalar:
- configurar;
- integrar;
- verificar TypeScript;
- executar build;
- executar testes;
- executar lint;
- corrigir incompatibilidades.

Não deixar dependências sem utilização.

## 4. PROJETO

Trabalhar em:

F:\Flow\flow-web

Antes de modificar:
- analisar frontend;
- backend;
- Firebase;
- rotas;
- componentes;
- CSS;
- services;
- hooks;
- contexts;
- repositories;
- assets;
- PWA;
- configurações;
- testes;
- scripts do package.json.

Não destruir código funcional.

## 5. REFERÊNCIAS VISUAIS

Utilizar:

F:\Flow\flow-web\public\FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT

F:\Flow\flow-web\public\FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT

F:\Flow\flow-web\public\Telas Versao mobili

Ler e analisar as imagens existentes e identificar telas, módulos, navegação, componentes, estados, botões, formulários, cards, tabelas, menus, modais e fluxos.

Não simplesmente reduzir Desktop para Mobile.

## 6. IDENTIDADE VISUAL LIGHT UI

A FLOW NÃO utiliza Dark Mode como padrão.

Background: #F8FAFC
Surface: #FFFFFF
Borders: #E2E8F0 / #EDF2F7
Texto principal: #0F172A
Texto secundário: #475569 / #64748B
Azul: #3B82F6 / #4F7FFF
Ciano: #06B6D4 / #20D9D2

Gradiente FLOW:

linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)

Usar gradiente somente em marca, CTAs e destaques.

## 7. COMPONENTIZAÇÃO OBRIGATÓRIA

Não construir páginas gigantes contendo toda a aplicação.

Cada responsabilidade deve ser componentizada.

Exemplo:

Component/
├── Component.tsx
├── Component.css
├── Component.types.ts
├── hooks/
├── services/
└── index.ts

Reutilizar componentes existentes.
Não duplicar componentes.
Não criar versões praticamente iguais com nomes diferentes.

## 8. CSS DOS COMPONENTES

Cada componente deve possuir seu CSS específico junto dele quando a arquitetura utilizar CSS separado.

Exemplo:

FeedPost/
├── FeedPost.tsx
├── FeedPost.css
├── FeedPost.types.ts
└── index.ts

Evitar CSS global gigantesco.

## 9. SITE PÚBLICO

Implementar Home, apresentação, recursos, funcionalidades, cadastro, login, informações institucionais, rodapé, links, redes sociais, identidade visual, responsividade, SEO e PWA quando aplicável.

CTA de login deve levar ao Login real.
CTA de cadastro deve levar ao Cadastro real.

Conteúdo editorial pode ser estático quando apropriado, mas funcionalidades nunca devem ser simuladas.

## 10. AUTENTICAÇÃO

Preservar e implementar:
- Login;
- Cadastro;
- Google Login;
- recuperação de senha;
- redefinição;
- verificação de e-mail;
- sessão;
- logout;
- 2FA quando previsto;
- controle de acesso;
- conta bloqueada;
- conta suspensa;
- conta desativada.

Usar Firebase existente quando aplicável.

## 11. CADASTRO + CONSENTIMENTO

Fluxo obrigatório:

Cadastro
↓
Conta criada
↓
Login
↓
Verificação de consentimento
↓
Contrato obrigatório
↓
Aceite
↓
Persistência no backend
↓
Acesso à rede social

Depois do cadastro, direcionar para Login.

Depois do login, verificar no backend se o usuário possui aceite obrigatório.

Se não possuir, abrir consentimento completo.

Checkbox:
“Li e estou de acordo com o contrato.”

Mensagem:
“Você concorda com o aceite e está ciente de que, caso não aceite, sua sessão será encerrada.”

Botão:
“Eu aceito”

Registrar no backend versão do contrato, data/hora e demais dados necessários.

Se recusar:
“É necessário o aceite. Caso não aceite, sua sessão será encerrada.”

Encerrar sessão e mostrar:
“Sua sessão foi encerrada. Faça login novamente.”

No próximo login, verificar novamente.

O mesmo fluxo deve funcionar para cadastro via Google.

## 12. REDE SOCIAL

Implementar as funcionalidades reais do catálogo, incluindo:
- Feed;
- Para você;
- Seguindo;
- Explorar;
- pesquisa;
- posts;
- comentários;
- curtidas;
- compartilhamentos;
- salvar;
- seguidores;
- seguindo;
- perfil;
- edição de perfil;
- stories;
- criação de conteúdo;
- fotos;
- vídeos;
- GIF;
- enquete;
- sentimento;
- comunidades;
- eventos;
- criadores;
- mensagens;
- conversas;
- notificações;
- configurações;
- privacidade;
- segurança;
- denúncias;
- bloqueios;
- consentimentos;
- memorial;
- demais funcionalidades existentes.

Tudo deve estar ligado ao backend real.

## 13. BOTÕES

Todo botão deve possuir função real.

Proibido:
onClick={() => {}}
console.log("TODO")
alert("Em breve")

Curtir deve persistir.
Comentar deve persistir.
Seguir deve persistir.
Publicar deve persistir.
Excluir deve excluir após autorização.
Salvar deve persistir.
Mensagens devem ser reais.
Denúncias devem ser registradas.
Configurações devem ser persistidas.

## 14. UI STATES

Toda operação assíncrona relevante deve possuir:
- Loading;
- Empty;
- Success;
- Error.

Não deixar tela eternamente em loading.
Não mostrar dados falsos enquanto aguarda resposta.

## 15. PAINEL ADMINISTRATIVO

Implementar Admin responsivo com:
- Login Admin;
- Dashboard;
- usuários;
- perfis;
- comunidades;
- publicações;
- comentários;
- moderação;
- denúncias;
- segurança;
- permissões;
- roles;
- RH;
- relatórios;
- métricas;
- auditoria;
- configurações;
- memorial;
- demais módulos do catálogo.

Todas as operações administrativas devem possuir backend e autorização real.

## 16. PAINEL RH

Implementar:
- Dashboard RH;
- colaboradores;
- recrutamento;
- contratação;
- desempenho;
- treinamentos;
- benefícios;
- cultura;
- relatórios;
- ações administrativas.

Dados devem ser reais.

## 17. BACKEND

Toda funcionalidade nova que exigir backend deve ser implementada.

Quando aplicável:

Controller
↓
Application / Use Case
↓
Domain
↓
Repository
↓
Infrastructure
↓
Database / Firebase

Não colocar regra crítica somente no frontend.

## 18. API FIRST

Para novas funcionalidades definir:
- endpoint;
- método HTTP;
- autenticação;
- autorização;
- request;
- response;
- validação;
- erros;
- códigos HTTP;
- paginação;
- filtros;
- ordenação;
- idempotência quando aplicável.

## 19. FIREBASE

NÃO destruir o Firebase existente.

Antes de alterar Authentication, Firestore, Storage, regras, serviços, hooks, contexts ou repositories, analisar a implementação atual.

Reutilizar o que estiver correto.
Corrigir o que estiver incorreto.
Não substituir Firebase por mocks.

## 20. PWA

A aplicação inteira deve funcionar como PWA.

Configurar:
- manifest;
- name;
- short_name;
- description;
- start_url;
- display standalone;
- orientation;
- theme_color;
- background_color;
- scope;
- lang;
- ícones.

Usar o logo original FLOW.

Considerar 192x192, 512x512, maskable, favicon e Apple Touch Icon.

## 21. IOS

Configurar Apple Touch Icon, mobile web app capable, status bar, app title, viewport e safe areas.

## 22. ANDROID

Garantir compatibilidade com Chrome Android e PWA instalada.

Configurar manifest, theme color, ícones, standalone, instalação e atualização.

## 23. SERVICE WORKER

Implementar quando compatível com a arquitetura.

Não quebrar Firebase.

Pode fazer cache de assets, shell e recursos públicos.

Nunca armazenar indevidamente senhas, tokens privados ou dados privados.

## 24. OFFLINE

Quando perder conexão:
“Você está offline.”

Ao recuperar:
“Conexão restaurada.”

Nunca informar sucesso se a operação não foi persistida.

## 25. RESPONSIVIDADE

Suportar:
320px, 360px, 375px, 390px, 414px, 430px, 480px, 768px, 1024px, 1280px, 1440px e 1920px.

Evitar overflow, textos cortados, botões fora da tela, cards quebrados e modais maiores que viewport.

## 26. MOBILE

Mobile não é Desktop reduzido.

Adaptar:
- TopBar;
- Sidebar;
- RightRail;
- Feed;
- cards;
- menus;
- modais;
- formulários;
- tabelas;
- navegação.

Usar drawer, bottom navigation, bottom sheet, action sheet, tabs e swipe quando fizer sentido.

## 27. TECLADO MOBILE

Login, cadastro, pesquisa, comentários, mensagens e formulários devem funcionar com teclado virtual sem cobrir campos ou ações.

## 28. METADADOS

Implementar:
- title;
- description;
- viewport;
- theme-color;
- robots;
- canonical quando aplicável;
- Open Graph;
- Twitter/X Cards;
- favicon;
- ícones PWA.

Identidade:
FLOW
Rede Social FLOW
Conecte. Compartilhe. Viva.

## 29. INSTALAÇÃO PWA

Criar componente reutilizável InstallAppPrompt.

Mensagem:
“Instale o FLOW”

“Tenha uma experiência mais rápida e completa no seu celular.”

Botão:
“Instalar FLOW”

Não mostrar de maneira invasiva.

## 30. ACESSIBILIDADE

Implementar HTML semântico, labels, aria-label, foco, navegação por teclado, contraste e mensagens de erro acessíveis.

## 31. SEGURANÇA

Nunca confiar somente no frontend.

Não expor secrets, senhas, tokens privados ou chaves administrativas.

Permissões devem ser verificadas no backend/Firebase Rules.

## 32. PERFORMANCE

Verificar lazy loading, code splitting, imagens, renders, listas, imports, listeners e memória.

## 33. CATÁLOGO DE TELAS

Comparar com:

F:\Flow\flow-web\public\FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT

F:\Flow\flow-web\public\FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT

Para cada tela identificar:
- ID;
- nome;
- módulo;
- rota;
- componente;
- arquivo;
- status;
- estados;
- ações;
- backend;
- dependências;
- responsividade.

Uma imagem existente não significa que a tela está implementada.

## 34. AUDITORIA DE COMPONENTES

Verificar:
- existência;
- reutilização;
- importação;
- CSS;
- estados;
- acessibilidade;
- integração;
- testes.

Identificar componentes duplicados, órfãos e gigantes.

## 35. PÁGINAS MONOLÍTICAS

Detectar arquivos grandes e múltiplas responsabilidades.

Extrair componentes, hooks, services, tipos, lógica e estilos quando necessário, preservando comportamento.

## 36. ROTEAMENTO

Auditar rotas, componentes, duplicidades, redirects, guards, autenticação e autorização.

## 37. DADOS MOCKADOS

Pesquisar por:
- mock;
- fake;
- dummy;
- demo;
- static data;
- sample data;
- hardcoded;
- placeholder.

Eliminar mocks usados como implementação real.

Conteúdo editorial do site pode permanecer estático quando apropriado.

## 38. TESTES

Executar conforme package.json:

pnpm install
pnpm build
pnpm lint
pnpm test

Executar outros scripts relevantes quando apropriado.

Não apagar testes para fazer o build passar.

## 39. GIT

Ao terminar:

git status

Revisar arquivos alterados, removidos, diff, secrets, .env, credenciais e temporários.

Depois:

git add .
git commit -m "feat: completa implementacao FLOW web mobile PWA backend"
git push

Não enviar secrets, credenciais, .env, chaves privadas, dumps ou temporários.

## 40. RELATÓRIO FINAL

Apresentar:

### Frontend
- telas implementadas;
- componentes criados;
- reutilizados;
- refatorados;
- CSS criado;
- CSS reorganizado.

### Backend
- endpoints;
- controllers;
- use cases;
- repositories;
- regras;
- persistência.

### Firebase
- Authentication;
- Firestore;
- Storage;
- regras;
- integrações.

### PWA
- manifest;
- ícones;
- service worker;
- instalação;
- offline;
- metadados.

### Responsividade
- 320;
- 360;
- 375;
- 390;
- 414;
- 430;
- 480;
- 768;
- 1024;
- desktop.

### Qualidade
- build;
- lint;
- testes;
- erros encontrados;
- erros corrigidos.

### Git
- commit;
- hash;
- push;
- status final.

## 41. CRITÉRIO DE ACEITAÇÃO

Uma tela somente será considerada FINALIZADA quando possuir:
- layout;
- componentes;
- CSS;
- responsividade;
- navegação;
- estados;
- validações;
- acessibilidade;
- integração;
- API;
- backend;
- persistência;
- autorização;
- autenticação quando necessária;
- Firebase/banco quando aplicável;
- tratamento de erros;
- testes quando aplicáveis.

Visual bonito sem funcionalidade real = NÃO IMPLEMENTADO.

Frontend sem backend quando backend for necessário = NÃO IMPLEMENTADO.

Backend sem integração = NÃO IMPLEMENTADO.

API sem persistência quando necessária = NÃO IMPLEMENTADO.

Mock = NÃO IMPLEMENTADO.

Static como substituto de funcionalidade = NÃO IMPLEMENTADO.

Botão sem função = NÃO IMPLEMENTADO.

## 42. REGRA DEFINITIVA DE COMPONENTIZAÇÃO

A aplicação não pode ser construída como uma única página contendo toda a aplicação.

Cada tela deve ser composta por componentes reutilizáveis.

Cada componente deve manter sua própria responsabilidade.

Cada componente deve manter seu CSS específico junto de sua implementação quando esse for o padrão arquitetural utilizado.

Ao importar o componente, sua estrutura e seus estilos devem acompanhar a implementação.

Não duplicar código entre telas.

Não concentrar toda a lógica em páginas.

Não criar componentes gigantes com múltiplas responsabilidades.

## 43. REGRA DEFINITIVA DE FUNCIONALIDADE

Se uma funcionalidade ainda não estiver implementada:

NÃO SIMULAR.
NÃO FAZER MOCK.
NÃO CRIAR STATIC.
NÃO INVENTAR DADOS.
NÃO CRIAR BOTÃO FALSO.
NÃO ESCONDER O PROBLEMA.

Implementar o fluxo real necessário ou identificar claramente a dependência técnica que precisa ser criada.

## 44. REGRA FINAL — FLOW É PRODUTO REAL

O FLOW deve ser tratado como sistema real de produção, não como protótipo visual.

Tudo que for criado deve funcionar de verdade.

Tudo que precisar de backend deve ser implementado no backend.
Tudo que precisar de persistência deve ser persistido.
Tudo que precisar de autorização deve ser protegido.
Tudo que precisar de autenticação deve ser autenticado.
Tudo que precisar de auditoria deve ser auditado.
Toda nova dependência necessária deve ser instalada e integrada corretamente.

A aplicação deve ser Desktop, Tablet, Mobile e PWA, responsiva, componentizada, integrada, segura, acessível, testável e escalável.

A versão Mobile/PWA NÃO deve ser uma aplicação separada.

FLOW
├── Desktop
├── Tablet
├── Mobile
└── PWA

Todos compartilhando regras de negócio, autenticação, backend, Firebase, APIs, serviços, dados e componentes reutilizáveis quando apropriado.

## 45. CRITÉRIO FINAL

Uma tela só será considerada FINALIZADA quando sua interface, componentes, CSS, responsividade/PWA, navegação, estados, validações, integrações, persistência, permissões e chamadas ao backend estiverem conectados ao fluxo real.

Visual bonito sem funcionalidade real é considerado NÃO IMPLEMENTADO.

Frontend, API, backend e persistência devem funcionar de ponta a ponta.

## 46. FLUXO DEFINITIVO

USUÁRIO
→ INTERFACE
→ COMPONENTE
→ HOOK
→ SERVICE
→ API
→ BACKEND
→ REGRA DE NEGÓCIO
→ REPOSITORY
→ FIREBASE / BANCO
→ PERSISTÊNCIA
→ RESPOSTA
→ INTERFACE ATUALIZADA

Sem mocks.
Sem funcionalidades fictícias.
Sem páginas falsas.
Sem botões decorativos.
Sem backend ausente para funcionalidades que dependem dele.
Sem destruir o Firebase existente.

O objetivo é entregar a FLOW como produto real de produção.
