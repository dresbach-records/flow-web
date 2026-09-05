# ================================================================
# FLOW WEB — PLANO MESTRE DE IMPLEMENTAÇÃO E CONCLUSÃO
# ENGENHARIA FULL STACK — PRODUÇÃO — EXECUÇÃO POR FASES
# ================================================================

PROJETO:
F:\Flow\flow-web

REPOSITÓRIO:
dresbach-records/flow-web

CONTEXTO:
Este projeto é a plataforma FLOW, composta por:

- Site público
- Rede social
- Autenticação
- Cadastro
- Login
- Consentimento/contrato
- Perfil
- Feed
- Publicações
- Comentários
- Curtidas
- Compartilhamentos
- Stories
- Shorts
- Comunidades
- Mensagens
- Notificações
- Explore
- Marketplace
- Rewards
- Events
- Memorial
- Configurações
- Segurança
- 2FA
- SMS
- Painel administrativo
- Painel RH
- APIs
- Backend
- Firebase
- PWA
- Mobile
- Desktop

Este documento passa a ser a REGRA MESTRA para a continuidade da implementação.

===============================================================
# 0. REGRA FUNDAMENTAL — CONTINUAR A PARTIR DO ESTADO ATUAL
===============================================================

NÃO reiniciar o projeto.

NÃO reconstruir a aplicação do zero.

NÃO apagar o que já funciona.

NÃO substituir Firebase por outra solução sem necessidade.

NÃO trocar a arquitetura existente simplesmente por preferência.

NÃO criar uma segunda aplicação paralela.

NÃO criar uma segunda estrutura de componentes.

NÃO criar uma segunda API paralela.

NÃO criar uma segunda autenticação.

Primeiro:

ANALISAR O ESTADO ATUAL.

Depois:

CORRIGIR.

Depois:

INTEGRAR.

Depois:

TESTAR.

Depois:

AVANÇAR PARA A PRÓXIMA FASE.

===============================================================
# 1. ESTADO ATUAL DO PROJETO
===============================================================

O projeto possui atualmente o seguinte plano de execução:

[✓] Adicionar REGRA DE CONCLUSÃO FLOW ao registro de auditoria

[ ] Fase 1:
Eliminar 100% mocks/static
(DEFAULT_STORIES, CANONICAL_POST, RightRail,
INITIAL_*, toggles, FlowWeb.tsx)

[•] Fase 2:
Ligar backend ao frontend
(VITE_API_URL x BASE_URL + proxy /api)

[ ] Fase 3:
Backend real por módulo
(mensagens, notificações, communities, shorts,
explore, marketplace, rewards, events)

[ ] Fase 4:
Corrigir SettingsModule, 2FA e SMS
(fim de simulação)

[ ] Fase 5:
Memorial backend real
(solicitações, homenagens, representantes, moderação)

[ ] Fase 6:
Admin com dados reais
(fim de fixos e alert())

[ ] Fase 7:
Testes reais + CI
(incluir backend/tests/domain.test.ts)

[ ] Fase 8:
Performance
(bundle >500kB, code-splitting)

[ ] Fase 9:
Completar 350 telas somente como concluídas
se estiverem ponta a ponta

[ ] Fase 10:
Fechar PWA e Mobile
sem quebrar Firebase

A execução deve seguir EXATAMENTE essa ordem, salvo quando uma dependência técnica exigir antecipação de uma tarefa.

===============================================================
# 2. REGRA DE CONCLUSÃO FLOW
===============================================================

A REGRA DE CONCLUSÃO FLOW é obrigatória.

Uma funcionalidade NÃO pode ser marcada como concluída simplesmente porque:

- a página abriu;
- o componente apareceu;
- o botão existe;
- o CSS está bonito;
- o mock foi substituído visualmente;
- existe uma rota;
- existe uma chamada falsa;
- existe um JSON;
- existe um estado local;
- existe um console.log.

Uma funcionalidade somente pode receber:

[✓] CONCLUÍDA

quando estiver funcionando ponta a ponta.

Considerar:

Frontend
+
Componentização
+
CSS
+
Estado
+
Validação
+
Rota
+
Service
+
API
+
Backend
+
Regra de negócio
+
Persistência
+
Autorização
+
Autenticação quando aplicável
+
Tratamento de erros
+
Loading
+
Empty State
+
Success State
+
Integração real
+
Testes
+
Responsividade
+
PWA quando aplicável

Tudo deve estar coerente.

===============================================================
# 3. REGRA ZERO MOCK
===============================================================

É TERMINANTEMENTE PROIBIDO criar ou manter mock como implementação final.

Eliminar:

- DEFAULT_STORIES
- CANONICAL_POST
- INITIAL_*
- arrays fictícios
- objetos fictícios
- usuários fictícios
- posts fictícios
- comunidades fictícias
- notificações fictícias
- mensagens fictícias
- métricas fictícias
- dados estáticos que simulam backend
- respostas falsas
- FakeRepository
- MockRepository
- MockService
- FakeService
- DemoService
- DemoProvider
- dados de demonstração
- toggles utilizados para fingir funcionalidades reais
- setTimeout simulando API
- Promise.resolve simulando backend
- alert() simulando operação
- console.log() simulando processamento

Não substituir um mock por outro mock.

Se uma funcionalidade não possui backend:

IMPLEMENTAR O BACKEND.

===============================================================
# 4. REGRA ZERO STATIC
===============================================================

É proibido implementar funcionalidades de negócio como páginas estáticas.

Página visual sem integração:

NÃO CONCLUÍDA.

Botão sem backend:

NÃO CONCLUÍDO.

Lista fixa:

NÃO CONCLUÍDA.

Dashboard com números fixos:

NÃO CONCLUÍDO.

Feed com posts fixos:

NÃO CONCLUÍDO.

Comunidade fixa:

NÃO CONCLUÍDA.

Notificações fixas:

NÃO CONCLUÍDAS.

Mensagens fixas:

NÃO CONCLUÍDAS.

Apenas o conteúdo institucional/editorial do site público pode ser estático quando isso for apropriado.

Funcionalidades da plataforma NÃO podem ser estáticas.

===============================================================
# 5. REGRA FRONTEND + BACKEND
===============================================================

TUDO que for criado e representar funcionalidade deve possuir implementação correspondente no backend.

Fluxo obrigatório:

USUÁRIO
↓
UI
↓
COMPONENTE
↓
HOOK
↓
SERVICE
↓
API
↓
CONTROLLER
↓
USE CASE
↓
REGRA DE NEGÓCIO
↓
REPOSITORY
↓
BANCO/FIREBASE
↓
RESPOSTA
↓
SERVICE
↓
HOOK
↓
ESTADO
↓
UI

Não interromper esse fluxo criando simulações.

===============================================================
# 6. REGRA DE DEPENDÊNCIAS
===============================================================

Sempre que uma funcionalidade exigir:

- biblioteca;
- pacote NPM;
- SDK;
- plugin;
- integração;
- ferramenta de build;
- biblioteca de PWA;
- biblioteca de validação;
- biblioteca de testes;
- biblioteca de acessibilidade;
- biblioteca de processamento;

instalar a dependência adequada.

Antes:

1. analisar package.json;
2. analisar lockfile;
3. identificar gerenciador;
4. verificar dependências existentes;
5. evitar duplicidade;
6. escolher versão compatível;
7. instalar;
8. configurar;
9. utilizar;
10. testar.

Não instalar dependências desnecessárias.

Não deixar dependência abandonada no package.json.

===============================================================
# 7. COMPONENTIZAÇÃO OBRIGATÓRIA
===============================================================

Não transformar FlowWeb.tsx ou qualquer outro arquivo em uma aplicação inteira.

As páginas devem ser compostas por componentes.

Exemplo conceitual:

Page
├── Layout
├── Header
├── Navigation
├── Content
│   ├── Feature
│   ├── Card
│   ├── List
│   └── Actions
└── Footer

Componentes devem ser reutilizáveis.

Evitar:

- componentes gigantes;
- páginas gigantes;
- arquivos com múltiplas responsabilidades;
- duplicação;
- lógica de negócio dentro da apresentação.

===============================================================
# 8. CSS DOS COMPONENTES
===============================================================

Cada componente deve possuir seu CSS específico junto de sua estrutura, conforme o padrão arquitetural existente.

Exemplo:

components/
└── PostCard/
    ├── PostCard.tsx
    ├── PostCard.css
    ├── PostCard.types.ts
    ├── PostCard.test.tsx
    └── index.ts

O componente deve carregar seus próprios estilos.

CSS global deve ficar restrito a:

- reset;
- tokens;
- variáveis;
- tipografia global;
- regras realmente globais.

Não criar um único CSS gigante para toda a aplicação.

===============================================================
# 9. IDENTIDADE VISUAL FLOW
===============================================================

A aplicação é LIGHT UI.

PROIBIDO DARK MODE COMO PADRÃO.

Cores oficiais:

Background:
#F8FAFC

Surface:
#FFFFFF

Borders:
#E2E8F0
#EDF2F7

Texto principal:
#0F172A

Texto secundário:
#475569
#64748B

Azul:
#3B82F6
#4F7FFF

Ciano:
#06B6D4
#20D9D2

Gradiente FLOW:

linear-gradient(
135deg,
#4F7FFF 0%,
#8B5CF6 50%,
#D946EF 100%
)

Usar gradiente somente em:

- marca;
- elementos de destaque;
- CTAs específicos;
- elementos visuais previstos.

Não aplicar gradiente indiscriminadamente.

===============================================================
# 10. FASE 1 — ELIMINAÇÃO TOTAL DE MOCK/STATIC
===============================================================

OBJETIVO:

Eliminar 100% das implementações falsas.

Arquivos e símbolos prioritários:

- DEFAULT_STORIES
- CANONICAL_POST
- RightRail
- INITIAL_*
- toggles
- FlowWeb.tsx

Para cada item:

1. localizar;
2. descobrir quem importa;
3. identificar finalidade;
4. identificar origem correta dos dados;
5. substituir por service/hook/API real;
6. remover dependência do mock;
7. testar;
8. verificar se outra tela depende dele;
9. atualizar auditoria.

NÃO apagar cegamente.

Primeiro mapear dependências.

Critério de conclusão:

Nenhuma funcionalidade de produção depende de mock.

===============================================================
# 11. FASE 2 — BACKEND ↔ FRONTEND
===============================================================

Resolver a integração:

VITE_API_URL
x
BASE_URL
x
proxy /api

Primeiro analisar:

- .env;
- .env.example;
- Vite;
- configuração do servidor;
- backend;
- fetch;
- axios;
- services;
- API clients;
- interceptors;
- CORS;
- proxy.

Definir uma estratégia única.

Evitar:

Frontend chamando URL A
Backend esperando URL B
Proxy apontando para C.

Criar contrato consistente.

Exemplo:

Frontend
→ /api/...

Proxy
→ Backend

ou

Frontend
→ VITE_API_URL

conforme arquitetura existente.

Não duplicar estratégias sem necessidade.

Depois testar:

GET
POST
PUT/PATCH
DELETE

quando aplicável.

===============================================================
# 12. FASE 3 — BACKEND REAL POR MÓDULO
===============================================================

Implementar progressivamente:

## MENSAGENS

Backend real para:

- conversas;
- participantes;
- mensagens;
- envio;
- edição quando aplicável;
- exclusão quando aplicável;
- leitura;
- não lidas;
- anexos;
- bloqueios;
- paginação.

Frontend:

- lista real;
- conversa real;
- envio real;
- loading;
- empty;
- error;
- success.

## NOTIFICAÇÕES

Implementar:

- criação;
- leitura;
- não lidas;
- marcação como lida;
- exclusão quando aplicável;
- paginação;
- filtros.

## COMMUNITIES

Implementar:

- criação;
- edição;
- exclusão;
- entrada;
- saída;
- membros;
- posts;
- permissões;
- administração;
- moderação.

## SHORTS

Implementar:

- upload;
- publicação;
- consulta;
- curtida;
- comentários;
- compartilhamento;
- visualizações;
- remoção.

## EXPLORE

Implementar:

- pesquisa;
- descoberta;
- filtros;
- paginação;
- ranking/relevância conforme domínio.

## MARKETPLACE

Implementar:

- produtos/ofertas;
- vendedores;
- publicação;
- edição;
- remoção;
- pesquisa;
- filtros;
- contato;
- status.

## REWARDS

Implementar:

- saldo;
- pontos;
- transações;
- histórico;
- regras;
- resgate quando aplicável.

## EVENTS

Implementar:

- criação;
- edição;
- inscrição;
- cancelamento;
- participantes;
- informações;
- status.

Nenhum desses módulos pode permanecer alimentado por mock.

===============================================================
# 13. FASE 4 — SETTINGS + 2FA + SMS
===============================================================

Eliminar completamente simulações.

Settings deve possuir:

- preferências;
- privacidade;
- segurança;
- notificações;
- sessões;
- conta;
- alterações persistidas.

2FA deve possuir fluxo real.

SMS deve possuir integração real quando o recurso estiver definido pela arquitetura.

Não usar:

- códigos fixos;
- códigos hardcoded;
- setTimeout;
- sucesso artificial;
- "SMS enviado" sem envio real.

Quando houver integração externa necessária:

configurar através de variáveis de ambiente seguras.

Nunca expor secrets no frontend.

===============================================================
# 14. FASE 5 — MEMORIAL BACKEND REAL
===============================================================

Implementar o módulo Memorial ponta a ponta.

Funcionalidades:

- solicitação de memorial;
- análise;
- representante;
- homenagens;
- moderação;
- aprovação;
- rejeição;
- status;
- permissões;
- auditoria;
- notificações;
- encerramento;
- edição quando permitido.

Fluxo:

Usuário
→ solicitação
→ backend
→ validação
→ persistência
→ moderação
→ aprovação
→ memorial publicado.

Não criar memorial apenas visualmente.

Toda decisão administrativa deve ser persistida.

===============================================================
# 15. FASE 6 — ADMIN COM DADOS REAIS
===============================================================

Eliminar:

- números fixos;
- gráficos falsos;
- usuários fixos;
- listas fixas;
- alert();
- confirmações falsas;
- ações sem backend.

Dashboard Admin deve consultar dados reais.

Cada módulo deve possuir:

- API;
- autorização;
- dados reais;
- loading;
- empty;
- error;
- ações;
- auditoria quando aplicável.

Admin não pode confiar apenas na proteção visual do frontend.

===============================================================
# 16. FASE 7 — TESTES REAIS + CI
===============================================================

Criar e executar testes.

Incluir obrigatoriamente:

backend/tests/domain.test.ts

Testar:

- regras de domínio;
- casos válidos;
- casos inválidos;
- permissões;
- estados;
- erros.

Frontend:

- componentes críticos;
- hooks;
- serviços;
- fluxos de autenticação;
- consentimento;
- funcionalidades críticas.

Executar:

pnpm test

pnpm lint

pnpm build

Se houver testes de backend separados:

executá-los também.

Criar CI quando ainda não existir.

CI deve validar:

- instalação;
- lint;
- testes;
- build.

Não remover testes para fazer CI passar.

===============================================================
# 17. FASE 8 — PERFORMANCE
===============================================================

Investigar bundle acima de 500kB.

Identificar:

- dependências pesadas;
- imports desnecessários;
- componentes grandes;
- bibliotecas duplicadas;
- código carregado antecipadamente.

Implementar quando apropriado:

- dynamic import;
- lazy loading;
- code splitting;
- route splitting;
- otimização de assets;
- compressão;
- carregamento sob demanda.

Não aplicar lazy loading indiscriminadamente.

Medir antes/depois.

===============================================================
# 18. FASE 9 — 350 TELAS
===============================================================

Existem 350 telas no catálogo FLOW.

Uma tela só pode ser considerada:

[✓] CONCLUÍDA

se estiver ponta a ponta.

Para cada tela verificar:

ID
Nome
Módulo
Rota
Componente
CSS
Estado
Backend
API
Persistência
Autorização
Interações
Loading
Empty
Error
Success
Responsividade
PWA quando aplicável
Testes

Criar matriz:

| ID | Tela | Rota | UI | Componentes | API | Backend | Persistência | Testes | Status |

Status permitidos:

NOT_STARTED
UI_ONLY
IN_PROGRESS
BACKEND_PENDING
INTEGRATION_PENDING
TEST_PENDING
READY
COMPLETED

Nunca marcar:

COMPLETED

somente porque a imagem visual está pronta.

===============================================================
# 19. FASE 10 — PWA + MOBILE
===============================================================

Finalizar:

- manifest;
- icons;
- favicon;
- Apple touch icon;
- metadata;
- viewport;
- theme-color;
- service worker quando apropriado;
- installability;
- responsive;
- safe areas;
- navegação mobile;
- touch;
- teclado;
- offline-aware.

Utilizar como referência:

F:\Flow\flow-web\public\Telas Versao mobili

Não criar uma aplicação Mobile separada.

A mesma aplicação deve funcionar:

Desktop
Tablet
Mobile
PWA.

Não quebrar Firebase.

===============================================================
# 20. FIREBASE
===============================================================

Preservar Firebase existente.

Antes de modificar:

- analisar Authentication;
- Firestore;
- Storage;
- regras;
- services;
- hooks;
- contexts;
- listeners.

Não substituir Firebase por mock.

Não quebrar autenticação.

Não cachear dados privados de maneira insegura.

===============================================================
# 21. AUTENTICAÇÃO
===============================================================

Fluxo real:

Cadastro
→ criação da conta
→ informações
→ login
→ verificação de consentimento
→ acesso.

Google:

Google signup/login
→ criação/identificação da conta
→ informações necessárias
→ login
→ verificação de consentimento
→ acesso.

Contrato:

Se não aceitou:

bloquear aplicação.

Mostrar contrato.

Exigir checkbox.

Registrar aceite real.

Se negar:

encerrar sessão.

Mostrar:

"Sua sessão foi encerrada. Faça login novamente."

No próximo login:

verificar novamente.

===============================================================
# 22. PÁGINA ESTÁTICA VS FUNCIONALIDADE ESTÁTICA
===============================================================

Não confundir:

CONTEÚDO EDITORIAL

com:

DADOS DE APLICAÇÃO.

É permitido:

texto institucional;
descrição da empresa;
FAQ editorial;
informações de marketing;
conteúdo legal.

Não é permitido:

usuários fictícios;
posts fictícios;
métricas fictícias;
comunidades fictícias;
mensagens fictícias;
notificações fictícias;
dados administrativos fictícios.

===============================================================
# 23. RESPONSIVIDADE
===============================================================

Testar:

320
360
375
390
414
430
480
768
1024
1280
1440
1920

Verificar:

- overflow;
- largura;
- altura;
- scroll;
- menus;
- modais;
- tabelas;
- cards;
- formulários;
- imagens;
- botões.

===============================================================
# 24. ACESSIBILIDADE
===============================================================

Implementar:

- semântica HTML;
- labels;
- aria-label;
- aria-describedby;
- foco;
- teclado;
- contraste;
- mensagens de erro;
- leitores de tela.

===============================================================
# 25. SEGURANÇA
===============================================================

Nunca confiar somente no frontend.

Backend deve validar:

- usuário;
- sessão;
- role;
- permissão;
- ownership;
- payload;
- regras de negócio.

Não expor:

- secrets;
- chaves privadas;
- tokens;
- credenciais administrativas.

===============================================================
# 26. REGISTRO DE AUDITORIA
===============================================================

Toda fase deve gerar registro daquilo que foi:

- analisado;
- alterado;
- corrigido;
- implementado;
- testado;
- pendente.

Para cada funcionalidade importante registrar:

- arquivo;
- módulo;
- rota;
- API;
- backend;
- banco;
- teste;
- status.

A REGRA DE CONCLUSÃO FLOW deve estar vinculada ao registro.

===============================================================
# 27. PROTOCOLO DE EXECUÇÃO DE CADA FASE
===============================================================

Para TODA fase:

ETAPA A — INVENTÁRIO

Mapear arquivos e dependências.

ETAPA B — ANÁLISE

Entender implementação atual.

ETAPA C — PLANEJAMENTO

Definir alterações.

ETAPA D — IMPLEMENTAÇÃO

Executar mudanças.

ETAPA E — INTEGRAÇÃO

Conectar frontend/backend.

ETAPA F — TESTES

Executar testes.

ETAPA G — BUILD

Executar build.

ETAPA H — AUDITORIA

Verificar regressões.

ETAPA I — REGISTRO

Atualizar auditoria.

ETAPA J — GIT

Revisar diff.

Commit.

Push.

===============================================================
# 28. NÃO PULAR FASE
===============================================================

Não avançar automaticamente porque:

"parece funcionar".

Uma fase somente termina quando seus critérios forem comprovados.

Se houver problema:

PARAR.

IDENTIFICAR.

CORRIGIR.

TESTAR.

CONTINUAR.

===============================================================
# 29. NÃO APAGAR SEM ANALISAR
===============================================================

Antes de remover qualquer:

- componente;
- serviço;
- hook;
- rota;
- arquivo;
- função;
- CSS;
- integração;

verificar:

Quem importa?
Quem utiliza?
Existe dependência indireta?
Existe rota dependente?
Existe Firebase dependente?
Existe backend dependente?

Só remover quando seguro.

===============================================================
# 30. GIT
===============================================================

Antes de qualquer alteração relevante:

git status

Depois:

git diff

Depois:

testes

Depois:

build

Depois:

git status

Somente então:

git add .

git commit

git push

Commit deve explicar claramente o trabalho.

Não adicionar:

.env
secrets
credenciais
tokens
arquivos pessoais
artefatos temporários

===============================================================
# 31. RELATÓRIO OBRIGATÓRIO AO FINAL DE CADA FASE
===============================================================

Responder:

FASE:
X

STATUS:
COMPLETED / IN_PROGRESS / BLOCKED

ARQUIVOS ALTERADOS:
lista.

COMPONENTES:
criados / alterados / removidos.

FRONTEND:
implementado.

BACKEND:
implementado.

API:
implementada.

BANCO/FIREBASE:
implementado.

TESTES:
resultado.

BUILD:
resultado.

LINT:
resultado.

MOCKS REMOVIDOS:
lista.

STATIC REMOVIDO:
lista.

PENDÊNCIAS:
lista.

RISCOS:
lista.

COMMIT:
hash.

PUSH:
PASS/FAIL.

===============================================================
# 32. CRITÉRIO DE PRODUÇÃO
===============================================================

O FLOW não deve ser tratado como protótipo.

Deve ser tratado como sistema de produção.

Portanto:

Código visual bonito sem backend:
NÃO CONCLUÍDO.

Backend sem frontend:
NÃO CONCLUÍDO.

API sem persistência:
NÃO CONCLUÍDO.

Botão sem ação:
NÃO CONCLUÍDO.

Mock:
NÃO CONCLUÍDO.

Static:
NÃO CONCLUÍDO.

Tela sem estados:
NÃO CONCLUÍDO.

Funcionalidade sem autorização:
NÃO CONCLUÍDO.

Funcionalidade sem teste quando aplicável:
NÃO CONCLUÍDO.

===============================================================
# 33. REGRA ESPECIAL PARA IA
===============================================================

Não tentar "agradar" mostrando uma interface funcionando através de dados falsos.

Se uma integração estiver quebrada:

NÃO SIMULAR.

Se o backend estiver ausente:

IMPLEMENTAR.

Se uma API estiver ausente:

CRIAR.

Se o banco estiver ausente:

IMPLEMENTAR A PERSISTÊNCIA ADEQUADA.

Se existir mock:

SUBSTITUIR POR DADO REAL.

Se existir página static:

CONECTAR AO FLUXO REAL.

Se existir botão sem função:

IMPLEMENTAR A FUNÇÃO.

===============================================================
# 34. REGRA DE COMPONENTES
===============================================================

Toda nova tela deve responder:

Quais componentes ela utiliza?

Quais componentes são reutilizáveis?

Qual componente deve ser criado?

Qual CSS pertence ao componente?

Qual lógica pertence ao hook/service?

Qual lógica pertence ao backend?

Não colocar:

UI
+
API
+
regra de negócio
+
persistência

dentro de um único arquivo.

===============================================================
# 35. REGRA DE PASTAS
===============================================================

Antes de criar novos arquivos:

analisar a estrutura atual.

Seguir o padrão arquitetural já adotado.

Não criar estruturas paralelas sem necessidade.

Não duplicar:

components
services
hooks
pages
layouts
api
repositories.

===============================================================
# 36. VALIDAÇÃO FINAL DO PROJETO
===============================================================

Ao terminar todas as fases:

Executar:

pnpm install

pnpm lint

pnpm test

pnpm build

Verificar backend.

Verificar Firebase.

Verificar API.

Verificar autenticação.

Verificar PWA.

Verificar Mobile.

Verificar Desktop.

Verificar Admin.

Verificar 350 telas.

Verificar mocks.

Verificar static.

Verificar componentes.

Verificar CSS.

Verificar imports.

Verificar arquivos órfãos.

Verificar dependências.

===============================================================
# 37. CHECKLIST FINAL
===============================================================

[ ] Zero mock de produção
[ ] Zero dados fictícios de aplicação
[ ] Zero botões falsos
[ ] Zero funcionalidades simuladas
[ ] Zero páginas de negócio static
[ ] Backend conectado
[ ] APIs conectadas
[ ] Persistência real
[ ] Firebase preservado
[ ] Autenticação real
[ ] Consentimento real
[ ] Admin real
[ ] Memorial real
[ ] Mensagens reais
[ ] Notificações reais
[ ] Communities reais
[ ] Shorts reais
[ ] Explore real
[ ] Marketplace real
[ ] Rewards real
[ ] Events real
[ ] Settings real
[ ] 2FA real
[ ] SMS real quando aplicável
[ ] Testes
[ ] CI
[ ] Performance
[ ] PWA
[ ] Mobile
[ ] Desktop
[ ] Acessibilidade
[ ] Segurança
[ ] 350 telas auditadas
[ ] 350 telas somente concluídas quando ponta a ponta
[ ] Documentação atualizada
[ ] Git commit
[ ] Git push

===============================================================
# 38. REGRA FINAL ABSOLUTA
===============================================================

A PARTIR DESTE DOCUMENTO, NÃO CONSIDERE UMA FUNCIONALIDADE CONCLUÍDA APENAS POR ESTAR VISUALMENTE PRONTA.

O FLOW DEVE FUNCIONAR DE PONTA A PONTA.

TUDO QUE FOR CRIADO NO FRONTEND E REPRESENTAR UMA FUNCIONALIDADE DEVE TER SUA IMPLEMENTAÇÃO CORRESPONDENTE NO BACKEND.

TUDO QUE PRECISAR DE PERSISTÊNCIA DEVE SER PERSISTIDO.

TUDO QUE PRECISAR DE AUTORIZAÇÃO DEVE SER PROTEGIDO.

TUDO QUE PRECISAR DE AUTENTICAÇÃO DEVE SER AUTENTICADO.

TUDO QUE PRECISAR DE API DEVE TER API.

TUDO QUE PRECISAR DE BANCO DEVE TER PERSISTÊNCIA.

TUDO QUE FOR CRIADO DEVE SER COMPONENTIZADO.

TODA FUNCIONALIDADE DEVE POSSUIR ESTADOS.

TODO COMPONENTE DEVE POSSUIR SEU CSS ESPECÍFICO QUANDO APLICÁVEL.

NENHUM MOCK PODE SER UTILIZADO COMO IMPLEMENTAÇÃO FINAL.

NENHUMA FUNCIONALIDADE DE NEGÓCIO PODE SER STATIC.

NENHUM BOTÃO PODE SER DECORATIVO.

NENHUMA TELA PODE SER MARCADA COMO CONCLUÍDA SEM ESTAR PONTA A PONTA.

A INTERFACE DEVE SER BONITA, MAS A FUNCIONALIDADE REAL É O CRITÉRIO DE CONCLUSÃO.

===============================================================
# 39. INÍCIO DA EXECUÇÃO
===============================================================

COMECE EXATAMENTE DO ESTADO ATUAL DO REPOSITÓRIO.

NÃO REINICIE.

PRIMEIRO EXECUTE UMA AUDITORIA DO ESTADO ATUAL.

IDENTIFIQUE EM QUAL FASE O PROJETO REALMENTE ESTÁ.

NÃO CONFIE SOMENTE NA CHECKLIST.

CONFIRME PELO CÓDIGO.

Depois execute a próxima fase pendente.

Não marque fases como concluídas sem evidência.

Ao finalizar cada fase:

- testar;
- documentar;
- registrar auditoria;
- revisar diff;
- commit;
- push.

Somente então avançar.

O OBJETIVO FINAL É:

FLOW WEB
=
SITE
+
REDE SOCIAL
+
ADMIN
+
BACKEND
+
FIREBASE
+
API
+
PWA
+
MOBILE
+
DESKTOP
+
350 TELAS
+
COMPONENTIZAÇÃO
+
CSS
+
SEGURANÇA
+
TESTES
+
PRODUÇÃO

TUDO INTEGRADO.

TUDO REAL.

ZERO MOCK.

ZERO STATIC PARA FUNCIONALIDADES.

ZERO IMPLEMENTAÇÃO FICTÍCIA.