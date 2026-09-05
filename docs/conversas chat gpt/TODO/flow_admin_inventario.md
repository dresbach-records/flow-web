# ================================================================
# FLOW ADMIN — INVENTÁRIO + ÁRVORE COMPLETA DE PÁGINAS E COMPONENTES
# ESPECIFICAÇÃO DE ENGENHARIA — NÍVEL PRODUÇÃO
# ================================================================

PROJETO:
F:\Flow\flow-web

OBJETIVO:

Construir, organizar e implementar o PAINEL ADMINISTRATIVO COMPLETO
da FLOW, incluindo LOGIN, AUTENTICAÇÃO, DASHBOARD, RH, USUÁRIOS,
MODERAÇÃO, CONTEÚDO, COMUNIDADES, DENÚNCIAS, SEGURANÇA, AUDITORIA,
CONFIGURAÇÕES, MEMORIAL e todos os demais módulos administrativos
necessários ao sistema.

A implementação deve utilizar como referência principal o catálogo:

F:\Flow\flow-web\public\FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT

E também considerar a arquitetura geral da FLOW e a integração com:

F:\Flow\flow-web\public\FLOW_CATALOGO_350_TELAS_DESKTOP_LIGHT

================================================================
# 1. REGRA ABSOLUTA
================================================================

NÃO criar apenas páginas visuais.

NÃO criar páginas estáticas.

NÃO criar mock.

NÃO criar dados fictícios.

NÃO criar botões decorativos.

NÃO criar funcionalidades simuladas.

NÃO criar arrays falsos para preencher tabelas.

NÃO criar dashboards com números inventados.

NÃO criar "em breve" para esconder funcionalidades ausentes.

TODA funcionalidade administrativa deve possuir implementação real.

Quando uma funcionalidade precisar de backend:

FRONTEND
→ COMPONENTE
→ HOOK
→ SERVICE
→ API
→ BACKEND
→ USE CASE
→ REGRA DE NEGÓCIO
→ REPOSITORY
→ FIREBASE/BANCO
→ RESPOSTA
→ FRONTEND

================================================================
# 2. PRIMEIRA ETAPA — ANALISAR O PROJETO
================================================================

ANTES DE CRIAR OU ALTERAR QUALQUER COISA:

Analise:

src/
public/
backend/
docs/
package.json
lockfile
configurações
Firebase
rotas
serviços
hooks
contexts
repositories
components
layouts
styles

Identifique o padrão arquitetural atualmente utilizado.

NÃO destrua código funcional.

NÃO substitua Firebase existente sem necessidade.

NÃO recrie funcionalidades que já existem corretamente.

================================================================
# 3. ANALISAR O CATÁLOGO ADMIN
================================================================

Leia todas as imagens existentes em:

F:\Flow\flow-web\public\FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT

Para cada imagem:

IDENTIFIQUE:

ID da tela
Nome da tela
Módulo
Submódulo
Rota
Objetivo
Componentes
Subcomponentes
Botões
Filtros
Tabelas
Cards
Gráficos
Formulários
Modais
Menus
Ações
Estados
Permissões
Integrações necessárias

NÃO ignore telas aparentemente simples.

Uma tela de confirmação, modal, estado vazio, erro, loading,
detalhamento ou configuração também deve ser catalogada.

================================================================
# 4. CRIAR A ÁRVORE COMPLETA DO ADMIN
================================================================

Antes da implementação final, produzir uma árvore lógica completa.

Estrutura conceitual:

ADMIN
│
├── AUTH
│   ├── Login
│   ├── Recuperar Senha
│   ├── Redefinir Senha
│   ├── Verificação
│   ├── 2FA
│   ├── Sessão Expirada
│   ├── Acesso Negado
│   └── Conta Bloqueada
│
├── DASHBOARD
│   ├── Visão Geral
│   ├── Métricas
│   ├── Atividade
│   ├── Crescimento
│   ├── Conteúdo
│   ├── Usuários
│   ├── Comunidades
│   ├── Moderação
│   └── Alertas
│
├── USUÁRIOS
│   ├── Lista
│   ├── Pesquisa
│   ├── Filtros
│   ├── Detalhes
│   ├── Perfil
│   ├── Editar
│   ├── Sessões
│   ├── Segurança
│   ├── Permissões
│   ├── Roles
│   ├── Bloquear
│   ├── Desbloquear
│   ├── Suspender
│   ├── Reativar
│   ├── Histórico
│   └── Auditoria
│
├── CONTEÚDO
│   ├── Publicações
│   ├── Comentários
│   ├── Curtidas
│   ├── Compartilhamentos
│   ├── Stories
│   ├── Mídia
│   ├── Conteúdo denunciado
│   ├── Conteúdo removido
│   └── Histórico
│
├── MODERAÇÃO
│   ├── Central
│   ├── Denúncias
│   ├── Fila
│   ├── Casos
│   ├── Revisão
│   ├── Ações
│   ├── Penalidades
│   ├── Recursos
│   └── Histórico
│
├── COMUNIDADES
│   ├── Lista
│   ├── Detalhes
│   ├── Membros
│   ├── Administradores
│   ├── Moderadores
│   ├── Conteúdo
│   ├── Denúncias
│   ├── Configurações
│   └── Auditoria
│
├── MENSAGENS
│   ├── Conversas
│   ├── Usuários
│   ├── Denúncias
│   ├── Bloqueios
│   └── Moderação
│
├── NOTIFICAÇÕES
│   ├── Lista
│   ├── Templates
│   ├── Eventos
│   ├── Envio
│   └── Histórico
│
├── RH
│   ├── Dashboard
│   ├── Colaboradores
│   ├── Perfil
│   ├── Recrutamento
│   ├── Candidatos
│   ├── Contratação
│   ├── Desempenho
│   ├── Treinamentos
│   ├── Benefícios
│   ├── Documentos
│   ├── Férias
│   ├── Afastamentos
│   └── Relatórios
│
├── RELATÓRIOS
│   ├── Usuários
│   ├── Conteúdo
│   ├── Comunidades
│   ├── Moderação
│   ├── Segurança
│   ├── RH
│   ├── Auditoria
│   └── Exportações
│
├── SEGURANÇA
│   ├── Dashboard
│   ├── Eventos
│   ├── Sessões
│   ├── Dispositivos
│   ├── IPs
│   ├── Tentativas
│   ├── Alertas
│   ├── Bloqueios
│   └── Auditoria
│
├── AUDITORIA
│   ├── Logs
│   ├── Usuários
│   ├── Administradores
│   ├── Ações
│   ├── Alterações
│   ├── Segurança
│   └── Exportação
│
├── MEMORIAL
│   ├── Usuários falecidos
│   ├── Solicitações
│   ├── Processos
│   ├── Homenagens
│   ├── Conteúdo
│   ├── Configurações
│   └── Auditoria
│
├── CONFIGURAÇÕES
│   ├── Geral
│   ├── Sistema
│   ├── Usuários
│   ├── Segurança
│   ├── Privacidade
│   ├── Notificações
│   ├── Comunidades
│   ├── Moderação
│   ├── Contratos
│   └── Integrações
│
└── SISTEMA
    ├── Status
    ├── Saúde
    ├── Logs
    ├── Jobs
    ├── Filas
    ├── Integrações
    └── Configurações

IMPORTANTE:

Essa árvore é uma BASE ORGANIZACIONAL.

Você deve cruzá-la com o catálogo real e expandi-la conforme as telas
existentes.

NÃO remover funcionalidades existentes apenas porque não aparecem
nessa árvore inicial.

================================================================
# 5. ÁRVORE DE COMPONENTES
================================================================

Criar uma árvore de componentes correspondente.

Exemplo:

Admin/
│
├── Layout/
│   ├── AdminLayout
│   ├── AdminHeader
│   ├── AdminSidebar
│   ├── AdminBreadcrumb
│   ├── AdminContent
│   └── AdminFooter
│
├── Navigation/
│   ├── NavigationItem
│   ├── NavigationGroup
│   ├── NavigationBadge
│   ├── MobileNavigation
│   └── AdminSearch
│
├── Dashboard/
│   ├── DashboardHeader
│   ├── MetricCard
│   ├── MetricGrid
│   ├── ActivityCard
│   ├── ActivityList
│   ├── ChartCard
│   ├── UserGrowthChart
│   ├── ContentChart
│   ├── CommunityChart
│   ├── AlertCard
│   └── DashboardFilters
│
├── Users/
│   ├── UserTable
│   ├── UserRow
│   ├── UserCard
│   ├── UserSearch
│   ├── UserFilters
│   ├── UserDetails
│   ├── UserProfile
│   ├── UserStatus
│   ├── UserActions
│   ├── UserPermissions
│   ├── UserRoles
│   ├── UserSessions
│   ├── UserSecurity
│   └── UserHistory
│
├── Content/
│   ├── ContentTable
│   ├── ContentCard
│   ├── ContentPreview
│   ├── ContentFilters
│   ├── ContentActions
│   ├── PostDetails
│   ├── CommentDetails
│   ├── MediaPreview
│   └── ContentHistory
│
├── Moderation/
│   ├── ModerationDashboard
│   ├── ReportTable
│   ├── ReportCard
│   ├── ReportDetails
│   ├── ModerationQueue
│   ├── ModerationActions
│   ├── PenaltySelector
│   ├── AppealPanel
│   └── ModerationHistory
│
├── Communities/
│   ├── CommunityTable
│   ├── CommunityCard
│   ├── CommunityDetails
│   ├── MemberList
│   ├── ModeratorList
│   ├── CommunitySettings
│   └── CommunityActions
│
├── Messages/
│   ├── ConversationTable
│   ├── ConversationDetails
│   ├── MessagePreview
│   ├── MessageActions
│   └── MessageModeration
│
├── Notifications/
│   ├── NotificationTable
│   ├── NotificationTemplate
│   ├── NotificationComposer
│   ├── NotificationPreview
│   └── NotificationHistory
│
├── HR/
│   ├── HRDashboard
│   ├── EmployeeTable
│   ├── EmployeeCard
│   ├── EmployeeProfile
│   ├── CandidateTable
│   ├── RecruitmentBoard
│   ├── PerformancePanel
│   ├── TrainingPanel
│   ├── BenefitsPanel
│   └── HRReports
│
├── Security/
│   ├── SecurityDashboard
│   ├── SecurityEventTable
│   ├── SessionTable
│   ├── DeviceTable
│   ├── SecurityAlert
│   └── SecurityActions
│
├── Audit/
│   ├── AuditTable
│   ├── AuditFilters
│   ├── AuditDetails
│   ├── AuditTimeline
│   └── AuditExport
│
├── Memorial/
│   ├── MemorialDashboard
│   ├── MemorialUserTable
│   ├── MemorialDetails
│   ├── MemorialRequest
│   ├── MemorialContent
│   ├── MemorialSettings
│   └── MemorialAudit
│
├── Settings/
│   ├── SettingsLayout
│   ├── GeneralSettings
│   ├── SecuritySettings
│   ├── PrivacySettings
│   ├── NotificationSettings
│   ├── ContractSettings
│   └── IntegrationSettings
│
└── Shared/
    ├── DataTable
    ├── DataGrid
    ├── Pagination
    ├── SearchInput
    ├── FilterPanel
    ├── DateRangePicker
    ├── Select
    ├── MultiSelect
    ├── StatusBadge
    ├── ConfirmDialog
    ├── DeleteDialog
    ├── Drawer
    ├── Modal
    ├── Tabs
    ├── EmptyState
    ├── LoadingState
    ├── ErrorState
    ├── SuccessState
    ├── Skeleton
    ├── Toast
    └── PermissionGuard

EXPANDA ESSA ÁRVORE CONFORME AS TELAS REAIS DO CATÁLOGO.

================================================================
# 6. CSS
================================================================

Cada componente que possuir estilo próprio deve possuir seu CSS
organizado junto ao componente.

Exemplo:

UserTable/
├── UserTable.tsx
├── UserTable.css
├── UserTable.types.ts
├── UserTable.test.tsx
└── index.ts

NÃO criar um único arquivo CSS gigante para todo o Admin.

CSS global somente para:

- reset;
- tokens;
- variáveis;
- tipografia;
- regras globais;
- design system.

================================================================
# 7. LIGHT UI OBRIGATÓRIO
================================================================

O Admin NÃO utiliza Dark Mode.

Paleta:

Background:
#F8FAFC

Surface:
#FFFFFF

Borders:
#E2E8F0
#EDF2F7

Texto:
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

#4F7FFF
#8B5CF6
#D946EF

Usar gradiente somente em elementos de destaque.

NÃO transformar o Admin inteiro em gradiente.

NÃO utilizar fundo preto.

NÃO utilizar sidebar preta.

================================================================
# 8. TODAS AS TELAS DEVEM SER LISTADAS
================================================================

Criar uma tabela completa:

ID
Tela
Módulo
Submódulo
Rota
Componente principal
Componentes secundários
CSS
Hook
Service
API
Backend
Permissão
Estado
Status

Exemplo:

ADM-001
Login Admin
AUTH
Login
/admin/login
AdminLogin
LoginForm, AuthError
AdminLogin.css
useAdminAuth
adminAuthService
POST /admin/auth/login
AdminAuthController
admin.login
IMPLEMENTAR

================================================================
# 9. TODAS AS AÇÕES DEVEM SER MAPEADAS
================================================================

Para cada botão:

Nome
Componente
Ação
Endpoint
Backend
Permissão
Resposta
Estado de sucesso
Estado de erro

Exemplo:

[BLOQUEAR USUÁRIO]

UserActions
→ blockUser()
→ POST /admin/users/{id}/block
→ UserController
→ BlockUserUseCase
→ UserRepository
→ Firestore/PostgreSQL
→ resposta
→ atualização UserStatus

================================================================
# 10. BACKEND OBRIGATÓRIO
================================================================

Para cada funcionalidade administrativa criada:

CRIAR/LOCALIZAR:

Controller
Use Case
DTO
Validator
Repository
Service
Permission
Audit

quando aplicável.

Não colocar regra de negócio dentro de:

React Component
JSX
CSS
evento onClick

================================================================
# 11. PERMISSÕES
================================================================

Cada módulo deve possuir controle de autorização.

Exemplo:

SUPER_ADMIN
ADMIN
MODERATOR
RH
SUPPORT
ANALYST

Os papéis reais devem ser determinados pela arquitetura existente.

Criar:

PermissionGuard

e validação correspondente no backend.

Frontend não pode ser a única proteção.

================================================================
# 12. AUDITORIA ADMINISTRATIVA
================================================================

Operações sensíveis devem gerar registro de auditoria.

Exemplo:

Administrador
Data/Hora
Ação
Recurso
ID
Antes
Depois
IP quando aplicável
Resultado

Exemplo:

ADMIN
→ BLOQUEOU USUÁRIO
→ USER_ID
→ DATA
→ MOTIVO
→ RESULTADO

================================================================
# 13. ESTADOS
================================================================

Toda tela que trabalha com dados deve implementar:

LOADING
EMPTY
ERROR
SUCCESS

Não usar dados falsos para preencher estado vazio.

================================================================
# 14. TABELAS
================================================================

Tabelas administrativas devem possuir:

- paginação;
- busca;
- filtros;
- ordenação;
- seleção quando necessário;
- ações;
- loading;
- empty;
- error;
- exportação quando especificada;
- responsividade.

No mobile:

tabelas devem possuir estratégia adequada:

cards
ou
scroll horizontal controlado.

================================================================
# 15. DASHBOARD
================================================================

Métricas devem vir de dados reais.

Não utilizar:

1.254 usuários fictícios
87 comunidades fictícias
98% crescimento fictício

Criar endpoints reais para métricas.

Exemplo:

GET /admin/dashboard/overview

GET /admin/dashboard/users

GET /admin/dashboard/content

GET /admin/dashboard/communities

GET /admin/dashboard/moderation

================================================================
# 16. RH
================================================================

Toda funcionalidade criada no RH deve possuir:

Frontend
API
Backend
Persistência
Permissões
Auditoria quando necessário.

Não criar RH apenas visual.

================================================================
# 17. MEMORIAL
================================================================

O módulo Memorial deve ser funcional.

Considerar:

- identificação de conta;
- solicitação;
- análise;
- aprovação;
- alteração de estado;
- controle de acesso;
- conteúdo memorial;
- privacidade;
- auditoria.

Nenhuma alteração deve ocorrer somente no frontend.

================================================================
# 18. RESPONSIVIDADE / PWA
================================================================

O Admin também deve funcionar em:

Desktop
Tablet
Mobile
PWA

Adaptar:

Sidebar
Header
Tabelas
Cards
Filtros
Modais
Formulários
Dashboard
Gráficos

================================================================
# 19. DEPENDÊNCIAS
================================================================

Se uma funcionalidade criada exigir uma biblioteca:

ANALISAR package.json

INSTALAR a dependência NPM necessária.

Utilizar versão compatível.

Depois:

pnpm install
pnpm build
pnpm lint
pnpm test

Não deixar dependência instalada sem uso.

================================================================
# 20. NÃO DESTRUIR FIREBASE
================================================================

Preservar:

Firebase Authentication
Firestore
Storage
configurações
services
hooks
listeners
rules

Antes de alterar qualquer integração, analisar o que já existe.

================================================================
# 21. ÁRVORE FINAL OBRIGATÓRIA
================================================================

Ao terminar a análise, gerar uma árvore real baseada no projeto:

src/
├── app/
├── components/
│   ├── admin/
│   ├── shared/
│   └── ...
├── layouts/
├── hooks/
├── services/
├── repositories/
├── api/
├── types/
├── utils/
├── styles/
└── ...

E dentro de admin:

admin/
├── auth/
├── dashboard/
├── users/
├── content/
├── moderation/
├── communities/
├── messages/
├── notifications/
├── hr/
├── reports/
├── security/
├── audit/
├── memorial/
├── settings/
└── shared/

A árvore deve representar OS ARQUIVOS REAIS existentes após a
implementação.

================================================================
# 22. RESULTADO ESPERADO
================================================================

Ao finalizar, entregar:

1. Árvore completa do Admin.
2. Lista completa das páginas.
3. Lista completa dos componentes.
4. Lista completa dos subcomponentes.
5. CSS correspondente.
6. Hooks.
7. Services.
8. APIs.
9. Controllers.
10. Use Cases.
11. Repositories.
12. Models/Entities.
13. Permissões.
14. Auditoria.
15. Estados.
16. Integrações Firebase.
17. Integrações backend.
18. Rotas.
19. Dependências NPM.
20. Testes.
21. Status de implementação.

================================================================
# 23. CRITÉRIO DE ACEITAÇÃO
================================================================

UMA TELA NÃO É CONSIDERADA IMPLEMENTADA SÓ POR EXISTIR.

Ela somente estará pronta quando:

✓ Tela
✓ Componentes
✓ Subcomponentes
✓ CSS
✓ Rota
✓ Navegação
✓ Estados
✓ Validação
✓ Hook
✓ Service
✓ API
✓ Backend
✓ Persistência
✓ Autorização
✓ Auditoria quando necessária
✓ Responsividade
✓ Acessibilidade
✓ Testes

estiverem implementados conforme a necessidade da funcionalidade.

================================================================
# 24. REGRA FINAL — ZERO MOCK / ZERO STATIC
================================================================

Se não existe backend:

IMPLEMENTE O BACKEND NECESSÁRIO.

Se não existe endpoint:

CRIE O ENDPOINT.

Se não existe repository:

CRIE O REPOSITORY.

Se não existe persistência:

IMPLEMENTE A PERSISTÊNCIA.

Se não existe componente:

CRIE O COMPONENTE.

Se não existe CSS:

CRIE O CSS.

Se não existe teste:

CRIE O TESTE.

NÃO substitua nenhuma dessas etapas por mock.

NÃO substitua nenhuma dessas etapas por página estática.

NÃO considere uma tela concluída apenas porque ela se parece com
a imagem do catálogo.

O catálogo é REFERÊNCIA VISUAL.

O sistema final deve ser FUNCIONAL.

================================================================
# 25. REGRA DE COMPONENTIZAÇÃO
================================================================

NUNCA concentrar dezenas de responsabilidades em uma única página.

Uma página deve orquestrar componentes.

Componentes devem possuir responsabilidades claras.

Serviços devem cuidar da comunicação.

Hooks devem cuidar do estado/composição.

Backend deve cuidar das regras de negócio.

Repositories devem cuidar da persistência.

CSS específico deve acompanhar seu componente.

A arquitetura deve permitir manutenção e evolução sem transformar
o Admin em um monólito de frontend.

================================================================
# 26. FINALIZAÇÃO
================================================================

Depois de implementar:

pnpm install
pnpm build
pnpm lint
pnpm test

Corrigir erros reais.

Depois verificar:

git status
git diff

Garantir que não foram incluídos:

.env
secrets
tokens
credenciais
chaves privadas
arquivos temporários

Depois:

git add .
git commit -m "feat: implementa painel administrativo completo da Flow"
git push

Ao finalizar, apresentar o HASH do commit e o resultado do push.

================================================================
# OBJETIVO FINAL
================================================================

O PAINEL ADMINISTRATIVO FLOW deve ser tratado como um produto
enterprise real.

Não como protótipo.

Não como demonstração.

Não como coleção de telas.

Cada tela deve possuir arquitetura.

Cada componente deve possuir responsabilidade.

Cada ação deve possuir fluxo.

Cada funcionalidade que necessitar backend deve possuir backend.

Cada dado persistente deve possuir persistência real.

Cada operação protegida deve possuir autorização.

Cada operação crítica deve possuir auditoria.

E o resultado visual deve seguir rigorosamente o catálogo
FLOW_ADMIN_CATALOGO_350_TELAS_DESKTOP_LIGHT, mantendo a identidade
LIGHT UI da FLOW.