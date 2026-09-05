# ================================================================
# FLOW WEB — EXECUTOR MASTER DA RAIZ
# ENGENHARIA FULL STACK ENTERPRISE — EXECUÇÃO REAL DE PRODUÇÃO
# ================================================================

PROJETO:

F:\Flow\flow-web

VOCÊ ESTÁ AUTORIZADA A ANALISAR, IMPLEMENTAR, CORRIGIR, TESTAR,
INTEGRAR E FINALIZAR O PROJETO.

ESTE PROMPT NÃO É APENAS UMA AUDITORIA.

É UM PLANO DE EXECUÇÃO.

Você deve ler os documentos de especificação existentes na pasta
TODO, na ordem definida abaixo, consolidar as regras e executar
o trabalho diretamente no projeto.

============================================================
# 0. REGRA MÁXIMA
============================================================

O FLOW É UM PRODUTO REAL DE PRODUÇÃO.

NÃO É PROTÓTIPO.

NÃO É DEMONSTRAÇÃO.

NÃO É MOCKUP.

NÃO É SISTEMA ESTÁTICO.

NÃO É UMA COLEÇÃO DE TELAS.

A interface somente será considerada implementada quando a
funcionalidade correspondente estiver funcionando de ponta a ponta.

REGRA:

FRONTEND
+
COMPONENTES
+
CSS
+
ROTAS
+
SERVICES
+
API
+
BACKEND
+
REGRAS DE NEGÓCIO
+
PERSISTÊNCIA
+
FIREBASE
+
AUTENTICAÇÃO
+
AUTORIZAÇÃO
+
ESTADOS
+
TESTES
+
PWA
+
RESPONSIVIDADE

devem estar coerentes.

============================================================
# 1. DOCUMENTAÇÃO OFICIAL DA EXECUÇÃO
============================================================

Antes de alterar qualquer código, localizar a pasta:

F:\Flow\flow-web\TODO

Ler os documentos abaixo na ordem EXATA:

1.
TODO/prompt-todo.md

2.
TODO/FLOW_MEGA_PROMPT_IMPLEMENTACAO_ENTERPRISE.md

3.
TODO/flow_admin_inventario.md

4.
TODO/Painel _do_Desenvolvedor.md

5.
TODO/painel_rh.md

6.
TODO/prompt  FLOW — AUDITORIA FINAL DE PRODUÇÃO.md

7.
TODO/FLOW — FINALIZAÇÃO COMPLETA_DO_SITE_INSTITUCIONAL.MD

IMPORTANTE:

Os documentos acima formam uma especificação conjunta.

Não trate um documento isoladamente.

Consolide todas as regras.

Se houver uma regra repetida em vários documentos, ela continua
sendo obrigatória.

Não simplifique a especificação.

Não pule seções.

Não escolha apenas as partes "mais importantes".

Leia os documentos completos.

============================================================
# 2. APÓS LER OS DOCUMENTOS
============================================================

Antes de modificar o código, produzir mentalmente um mapa do projeto:

FRONTEND
BACKEND
FIREBASE
DATABASE
AUTH
ADMIN
DEVELOPER
RH
SOCIAL
SITE
MOBILE
PWA
TESTES
CSS
COMPONENTES
ROTAS
ASSETS
DOCUMENTAÇÃO

Depois verificar o estado REAL do repositório.

Não assumir que algo está implementado porque existe um arquivo.

Não assumir que algo funciona porque existe uma rota.

Não assumir que algo está integrado porque existe um botão.

Não assumir que algo é real porque possui uma função com nome correto.

VALIDAR.

============================================================
# 3. REGRA ABSOLUTA — ZERO MOCK
============================================================

É PROIBIDO criar ou manter:

mock data
fake data
demo data
dummy data
sample data
static users
static posts
static communities
static messages
static notifications
static metrics
static dashboard data
fake API
fake repository
fake service
fake response
fake authentication
fake backend
fake database
fake success
fake loading
fake operation

Também é proibido:

setTimeout para simular API.

Promise.resolve para simular backend.

console.log como implementação.

alert() como implementação.

Arrays locais como banco.

JSON estático como banco.

localStorage como substituto de persistência real.

============================================================
# 4. REGRA ABSOLUTA — ZERO STATIC FUNCIONAL
============================================================

Nenhuma funcionalidade da aplicação pode ser apenas visual.

Uma página somente visual não é considerada implementada.

Exemplo:

Botão "Curtir"

não significa que o botão está implementado.

É necessário:

Curtir
↓
Service
↓
API
↓
Backend
↓
Autorização
↓
Persistência
↓
Resposta
↓
Atualização da UI

Isso vale para TODAS as funcionalidades.

============================================================
# 5. REGRA ABSOLUTA — TUDO QUE FOR CRIADO VAI PARA O BACKEND
============================================================

Qualquer funcionalidade nova que envolva:

dados
persistência
usuário
permissão
autenticação
regra de negócio
processamento
relacionamentos
configuração
auditoria
segurança
mensagens
notificações
conteúdo
métricas

DEVE possuir implementação correspondente no backend.

Arquitetura:

UI
↓
Component
↓
Hook
↓
Service
↓
API
↓
Controller
↓
Use Case
↓
Domain
↓
Repository
↓
Infrastructure
↓
Firebase / Database
↓
Response
↓
Frontend State
↓
UI

Não colocar regra crítica somente no frontend.

============================================================
# 6. REGRA DE COMPONENTIZAÇÃO
============================================================

Nenhuma tela grande deve concentrar toda a lógica.

Componentizar.

Cada componente deve possuir responsabilidade única.

Quando aplicável:

Component/
├── Component.tsx
├── Component.css
├── Component.types.ts
├── hooks/
├── services/
└── index.ts

Não duplicar componentes.

Não criar três componentes iguais com nomes diferentes.

Pesquisar componentes existentes antes de criar um novo.

============================================================
# 7. REGRA DE CSS
============================================================

Cada componente deve manter seus estilos junto de sua implementação
quando a arquitetura utilizar CSS separado.

Exemplo:

FeedPost/
├── FeedPost.tsx
├── FeedPost.css
├── FeedPost.types.ts
└── index.ts

CSS global deve ser reservado para:

reset
tokens
variáveis
tipografia global
regras realmente globais

Não transformar styles.css em um arquivo gigantesco com estilos de
centenas de componentes.

============================================================
# 8. LIGHT UI
============================================================

O FLOW NÃO utiliza Dark Mode como padrão.

Nunca introduzir:

background preto
sidebar preta
cards pretos
painel preto

Paleta oficial:

#F8FAFC
#FFFFFF
#E2E8F0
#EDF2F7
#0F172A
#475569
#64748B
#3B82F6
#4F7FFF
#06B6D4
#20D9D2

Gradiente oficial:

linear-gradient(
135deg,
#4F7FFF 0%,
#8B5CF6 50%,
#D946EF 100%
)

Utilizar gradiente com moderação.

============================================================
# 9. NÃO DESTRUIR FIREBASE
============================================================

Antes de alterar Firebase:

analisar Authentication
analisar Firestore
analisar Storage
analisar Rules
analisar serviços
analisar hooks
analisar contexts
analisar repositories
analisar configurações

Preservar o que estiver correto.

Corrigir o que estiver incorreto.

Nunca substituir Firebase por mock.

============================================================
# 10. REFERÊNCIAS VISUAIS
============================================================

Analisar:

F:\Flow\flow-web\public\FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT

F:\Flow\flow-web\public\FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT

F:\Flow\flow-web\public\Telas Versao mobili

As imagens são referências oficiais de interface.

Analisar:

layout
cores
espaçamento
componentes
navegação
cards
menus
botões
formulários
modais
estados
hierarquia visual

Não simplesmente diminuir Desktop para Mobile.

============================================================
# 11. EXECUÇÃO DAS FASES
============================================================

Executar as fases abaixo em ordem.

NÃO pular fase.

NÃO marcar fase como concluída sem validação.

============================================================
# FASE 1 — ELIMINAR 100% MOCK / STATIC
============================================================

Objetivo:

Eliminar todas as implementações fictícias.

Auditar:

Feed
Stories
RightRail
módulos
Creator
FlowWeb
Platform
Rewards
Explore
Communities
Messages
Notifications
Marketplace
Events
Shorts
Admin
Dashboard
RH
Developer

Para cada mock encontrado:

IDENTIFICAR
↓
RASTREAR DEPENDÊNCIAS
↓
SUBSTITUIR
↓
CONECTAR BACKEND
↓
PERSISTIR
↓
TESTAR

Não simplesmente apagar.

============================================================
# FASE 2 — FRONTEND ↔ BACKEND
============================================================

Auditar:

VITE_API_URL
BASE_URL
proxy /api
services
fetch
axios
repositories
controllers
routes

Garantir:

Frontend
→ API
→ Backend

Sem chamadas quebradas.

Verificar CORS.

Verificar autenticação.

Verificar tratamento de erro.

============================================================
# FASE 3 — BACKEND REAL POR MÓDULO
============================================================

Implementar backend real para:

COMMUNITIES

MESSAGES

NOTIFICATIONS

MEMORIAL

SHORTS

EXPLORE

MARKETPLACE

REWARDS

EVENTS

e qualquer outro módulo identificado na documentação.

Para cada módulo:

routes
controllers
services/use cases
domain
repositories
database/Firebase
validation
authorization
error handling
tests

============================================================
# FASE 4 — SETTINGS + 2FA + SMS
============================================================

Eliminar simulações.

Implementar:

Settings
2FA
SMS

com integrações reais quando necessárias.

Não simular envio.

Não informar "SMS enviado" sem confirmação real.

============================================================
# FASE 5 — MEMORIAL BACKEND REAL
============================================================

Implementar:

solicitações
homenagens
representantes
moderação
permissões
status
aprovações
rejeições
auditoria

Persistência real.

Fluxo real.

Admin real.

Usuário real.

============================================================
# FASE 6 — ADMIN
============================================================

Garantir:

Admin Authentication
RBAC
Roles
Permissions
Dashboard
Users
Content
Communities
Moderation
Reports
Security
RH
Memorial
Audit
Settings

Dados reais.

Operações reais.

Backend real.

Auditoria real.

============================================================
# FASE 7 — TESTES + CI
============================================================

Implementar/ajustar testes reais.

Obrigatoriamente verificar:

backend/tests/domain.test.ts

Criar testes para:

domain
services
repositories
controllers
API
authentication
authorization
memorial
communities
messages
notifications
admin

Executar:

pnpm test

Se houver scripts adicionais:

executar também.

Implementar CI quando previsto na arquitetura/documentação.

============================================================
# FASE 8 — PERFORMANCE
============================================================

Auditar bundle.

Se houver bundle >500kB:

identificar causa.

Aplicar:

code splitting
lazy loading
dynamic imports
tree shaking
otimização de dependências
otimização de imagens

Não fazer otimizações que prejudiquem a arquitetura.

============================================================
# FASE 9 — 350 TELAS
============================================================

As 350 telas só podem ser consideradas concluídas quando forem
funcionais ponta a ponta.

Para cada tela:

ID
Nome
Módulo
Rota
Componente
CSS
Estado
Ações
Backend
API
Persistência
Autenticação
Autorização
Loading
Empty
Success
Error
Responsividade

Uma tela visualmente pronta, mas sem backend:

STATUS = NÃO CONCLUÍDA.

Uma tela com mock:

STATUS = NÃO CONCLUÍDA.

Uma tela com botão sem implementação:

STATUS = NÃO CONCLUÍDA.

Uma rota sem funcionalidade:

STATUS = NÃO CONCLUÍDA.

============================================================
# FASE 10 — PWA + MOBILE
============================================================

Finalizar:

manifest
icons
favicon
Apple Touch Icon
metadata
viewport
safe areas
service worker
installability
responsive layout
offline-aware
mobile navigation

Não quebrar Firebase.

Não cachear dados privados de maneira insegura.

============================================================
# 12. SITE INSTITUCIONAL
============================================================

Finalizar o site conforme documentação e imagens.

Verificar:

Home
Header
Hero
Recursos
Benefícios
CTA
Login
Cadastro
Rodapé
Redes sociais
Links
SEO
Responsividade
PWA

Botões devem levar para rotas reais.

============================================================
# 13. AUTENTICAÇÃO
============================================================

Implementar fluxo real:

Cadastro
→ Login
→ Consentimento
→ Aceite
→ Acesso

Google:

Google Signup
→ completar dados
→ Login
→ Consentimento
→ Aceite
→ Acesso

Sem aceite:

Sessão encerrada.

Mensagem:

"Sua sessão foi encerrada. Faça login novamente."

Na tela de consentimento:

"É necessário o aceite. Caso não aceite, sua sessão será encerrada."

============================================================
# 14. CONSENTIMENTO
============================================================

Persistir no backend:

userId
documentType
documentVersion
accepted
acceptedAt

e demais informações necessárias.

Nunca considerar aceite apenas pelo estado React.

============================================================
# 15. ADMIN + DEVELOPER + RH
============================================================

Os três ambientes devem ser tratados como sistemas reais.

Admin:
dados reais.

Developer:
dados técnicos reais.

RH:
dados reais.

Não criar dashboard falso.

Não criar métricas fictícias.

============================================================
# 16. DEPENDÊNCIAS
============================================================

Quando uma funcionalidade exigir:

NPM
biblioteca
plugin
SDK
integração

instalar a dependência necessária.

Antes:

analisar package.json
lockfile
versões
dependências existentes

Evitar:

duplicação
conflitos
bibliotecas incompatíveis

Depois:

configurar
integrar
testar
build
lint

Não instalar biblioteca sem utilização.

============================================================
# 17. ERROS
============================================================

Corrigir erros encontrados.

Incluindo:

TypeScript
Firebase
API
Backend
Routing
CSS
Build
Lint
Tests

Não esconder erro.

Não remover código apenas para silenciar erro.

Não desativar TypeScript para contornar problema.

Não colocar:

@ts-ignore

sem justificativa técnica real.

============================================================
# 18. SEGURANÇA
============================================================

Auditar:

Authentication
Authorization
RBAC
Firebase Rules
API
CORS
Inputs
XSS
CSRF quando aplicável
Secrets
Environment Variables
Sessions
Rate limiting quando necessário
Logs
Auditoria

Nunca colocar secrets no frontend.

Nunca confiar somente no frontend.

============================================================
# 19. PERFORMANCE
============================================================

Auditar:

renders
listeners
subscriptions
memory leaks
images
bundle
imports
lazy loading
listas
paginação
queries
Firestore listeners

Corrigir problemas reais.

============================================================
# 20. ACESSIBILIDADE
============================================================

Verificar:

ARIA
labels
keyboard
focus
contrast
semantic HTML
screen reader
forms
errors

============================================================
# 21. RESPONSIVIDADE
============================================================

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

Não permitir:

overflow
conteúdo cortado
botões fora da tela
modal quebrado
menu quebrado
texto sobreposto

============================================================
# 22. PWA
============================================================

Validar:

manifest
icons
display standalone
theme color
background
start_url
scope
service worker
installability
mobile viewport
Apple support
Android support

============================================================
# 23. GIT
============================================================

Antes de cada grande alteração:

git status

Depois:

git diff

Verificar arquivos modificados.

Nunca incluir:

.env
secrets
credentials
private keys
arquivos temporários

Após concluir cada fase:

registrar alterações.

Quando a fase estiver realmente validada:

commit.

Exemplo:

feat: conclui fase 3 backend real

============================================================
# 24. REGISTRO DE AUDITORIA
============================================================

Criar ou atualizar um registro:

FLOW — REGISTRO DE AUDITORIA E CONCLUSÃO

Registrar:

FASE
STATUS
DATA
ARQUIVOS
ALTERAÇÕES
TESTES
BUILD
LINT
BACKEND
FRONTEND
FIREBASE
RISCOS
PENDÊNCIAS

Status possíveis:

[✓] CONCLUÍDA
[•] EM ANDAMENTO
[ ] PENDENTE
[!] BLOQUEADA

============================================================
# 25. REGRA DE CONCLUSÃO FLOW
============================================================

Uma fase NÃO pode receber:

[✓] CONCLUÍDA

somente porque o código foi escrito.

Para receber [✓]:

IMPLEMENTAÇÃO
+
INTEGRAÇÃO
+
BACKEND
+
PERSISTÊNCIA
+
TESTE
+
VALIDAÇÃO

devem estar funcionando.

Se existir pendência real:

usar [•], [ ] ou [!].

Nunca falsificar o status.

============================================================
# 26. REGRA ESPECIAL — NÃO APAGAR SEM ANALISAR
============================================================

Antes de apagar qualquer arquivo:

verificar imports
verificar rotas
verificar dependências
verificar referências
verificar Firebase
verificar backend
verificar testes

Somente remover quando comprovadamente:

órfão
duplicado
obsoleto
substituído

e sem quebrar funcionalidades.

============================================================
# 27. REGRA ESPECIAL — NÃO REESCREVER O PROJETO
============================================================

Não transformar o projeto inteiro em uma implementação nova sem necessidade.

Preservar:

arquitetura funcional
Firebase
serviços corretos
componentes reutilizáveis
configurações
testes
integrações

Refatorar progressivamente.

============================================================
# 28. VERIFICAÇÃO FINAL
============================================================

Executar:

pnpm install

pnpm build

pnpm lint

pnpm test

E todos os demais scripts relevantes definidos no package.json.

Verificar:

rotas
API
backend
Firebase
auth
admin
developer
RH
site
rede social
mobile
PWA

============================================================
# 29. AUDITORIA FINAL
============================================================

Executar uma segunda auditoria após as correções.

Procurar novamente:

mock
fake
static functional
TODO
FIXME
console.log
alert
setTimeout fake
Promise.resolve fake
botões sem ação
rotas quebradas
componentes órfãos
imports quebrados
CSS duplicado
arquivos monolíticos
dados hardcoded

Não assumir que a primeira auditoria estava correta.

Auditar novamente.

============================================================
# 30. CRITÉRIO FINAL DE PRODUÇÃO
============================================================

FLOW somente será considerado FINALIZADO quando:

✓ Site
✓ Login
✓ Cadastro
✓ Google Auth
✓ Consentimento
✓ Rede Social
✓ Admin
✓ RH
✓ Developer
✓ Backend
✓ Firebase
✓ APIs
✓ Database
✓ Componentização
✓ CSS
✓ Responsividade
✓ Mobile
✓ PWA
✓ Segurança
✓ Acessibilidade
✓ Performance
✓ Testes
✓ CI
✓ 350 telas
✓ Documentação
✓ Git

estiverem coerentes.

============================================================
# 31. REGRA ABSOLUTA SOBRE AS 350 TELAS
============================================================

NÃO marcar as 350 telas como concluídas apenas porque existem
350 componentes ou 350 rotas.

Cada tela precisa funcionar.

Cada ação precisa funcionar.

Cada botão precisa funcionar.

Cada formulário precisa funcionar.

Cada operação precisa chegar ao backend quando necessário.

Cada dado persistente precisa ser persistido.

Cada permissão precisa ser validada.

Cada erro precisa ser tratado.

============================================================
# 32. REGRA ABSOLUTA SOBRE BACKEND
============================================================

SE UMA FUNCIONALIDADE EXISTE NO FRONTEND E PRECISA DE BACKEND:

O BACKEND DEVE EXISTIR.

Não aceitar:

"frontend pronto, backend depois".

Não aceitar:

"mock temporário".

Não aceitar:

"API futura".

Não aceitar:

"simulação".

Não aceitar:

"placeholder".

Se a funcionalidade estiver na aplicação, sua infraestrutura necessária
deve ser implementada.

============================================================
# 33. REGRA ABSOLUTA SOBRE DEPENDÊNCIAS
============================================================

Se a implementação exigir biblioteca:

INSTALAR.

Se exigir SDK:

INSTALAR.

Se exigir pacote:

INSTALAR.

Se exigir configuração:

CONFIGURAR.

Se exigir integração:

INTEGRAR.

Se exigir backend:

IMPLEMENTAR.

Se exigir banco:

IMPLEMENTAR.

Depois:

BUILD
+
TEST
+
LINT.

============================================================
# 34. ENTREGA FINAL
============================================================

Ao finalizar todo o trabalho, apresentar um relatório objetivo contendo:

FASE 1 — STATUS
FASE 2 — STATUS
FASE 3 — STATUS
FASE 4 — STATUS
FASE 5 — STATUS
FASE 6 — STATUS
FASE 7 — STATUS
FASE 8 — STATUS
FASE 9 — STATUS
FASE 10 — STATUS

Depois:

TOTAL DE TELAS:
TOTAL CONCLUÍDAS:
TOTAL PENDENTES:
TOTAL BLOQUEADAS:

TOTAL DE COMPONENTES:
TOTAL DE COMPONENTES REUTILIZADOS:
TOTAL DE COMPONENTES CRIADOS:

MOCKS RESTANTES:
STATIC FUNCIONAL RESTANTE:
BOTÕES SEM IMPLEMENTAÇÃO:
ROTAS QUEBRADAS:
ERROS TYPESCRIPT:
ERROS FIREBASE:
ERROS BACKEND:

BUILD:
TEST:
LINT:

PWA:
MOBILE:
DESKTOP:

FIREBASE:

BACKEND:

GIT:

Commit:
Hash:

Push:
PASS/FAIL

============================================================
# 35. REGRA FINAL — EXECUTAR, NÃO APENAS PLANEJAR
============================================================

NÃO responder simplesmente com:

"Analisei."

"Encontrei."

"Recomendo."

"Seria necessário."

"Podemos implementar."

"Falta fazer."

VOCÊ DEVE EXECUTAR.

Quando encontrar um problema:

IDENTIFICAR
→ CORRIGIR
→ INTEGRAR
→ TESTAR
→ VALIDAR.

Quando encontrar uma funcionalidade incompleta:

IMPLEMENTAR.

Quando encontrar mock:

SUBSTITUIR POR IMPLEMENTAÇÃO REAL.

Quando encontrar página estática funcional:

TRANSFORMAR EM FUNCIONALIDADE REAL.

Quando encontrar botão sem backend:

IMPLEMENTAR BACKEND.

Quando encontrar dependência ausente:

INSTALAR E CONFIGURAR.

Quando encontrar erro:

CORRIGIR E TESTAR.

Quando encontrar componente monolítico:

COMPONENTIZAR.

Quando encontrar CSS espalhado:

ORGANIZAR.

Quando encontrar integração Firebase quebrada:

CORRIGIR SEM DESTRUIR A INFRAESTRUTURA.

============================================================
# 36. INÍCIO DA EXECUÇÃO
============================================================

COMECE AGORA.

PASSO 1:
Ler TODOS os documentos da pasta TODO na ordem definida.

PASSO 2:
Auditar o estado atual do projeto.

PASSO 3:
Comparar documentação + código + catálogo visual.

PASSO 4:
Executar as fases em ordem.

PASSO 5:
Testar cada fase.

PASSO 6:
Registrar cada resultado.

PASSO 7:
Executar auditoria final.

PASSO 8:
Executar build/test/lint.

PASSO 9:
Revisar git diff.

PASSO 10:
Commitar as alterações.

PASSO 11:
Enviar ao repositório.

NÃO considere a tarefa concluída até executar todas as validações
possíveis e registrar claramente qualquer pendência que realmente
não possa ser resolvida no ambiente atual.

============================================================
# REGRA DE CONCLUSÃO FLOW — REGISTRO DE AUDITORIA
============================================================

ADICIONE AO REGISTRO DE AUDITORIA:

"Uma funcionalidade FLOW somente poderá ser marcada como CONCLUÍDA
quando estiver implementada ponta a ponta, incluindo interface,
componentes, CSS, navegação, estado, validação, autenticação,
autorização, API, backend, regra de negócio, persistência,
tratamento de erros e testes quando aplicáveis.

A existência de uma tela visual, componente, rota ou botão não
constitui implementação.

Mock, static funcional, fake data, placeholder ou simulação não
constitui implementação.

Tudo que for criado e depender de backend deverá possuir sua
implementação real correspondente.

O FLOW somente considera concluído aquilo que funciona de verdade."