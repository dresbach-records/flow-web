# FLOW — PAINEL RH / ADMIN LTS
# INVENTÁRIO COMPLETO DE TELAS, COMPONENTES, FUNÇÕES, BACKEND E INTEGRAÇÕES

## 1. OBJETIVO

Especificar integralmente o módulo de Recursos Humanos do FLOW Admin/LTS.

O módulo deverá possuir:

- interface Desktop;
- interface Tablet;
- interface Mobile;
- PWA;
- componentização;
- CSS por componente;
- rotas reais;
- autenticação;
- autorização;
- RBAC;
- backend;
- APIs;
- persistência;
- validações;
- auditoria;
- estados de interface;
- notificações;
- relatórios;
- integrações necessárias.

NÃO criar protótipo visual.

NÃO criar funcionalidades mockadas.

NÃO criar páginas estáticas para funcionalidades internas.

Toda funcionalidade deverá funcionar de ponta a ponta.

---

# 2. REGRA ABSOLUTA — ZERO MOCK / ZERO STATIC

É PROIBIDO:

- mock data;
- fake data;
- arrays simulando banco;
- JSON simulando API;
- usuários fictícios;
- colaboradores fictícios;
- indicadores fictícios;
- gráficos fictícios;
- respostas simuladas;
- botões sem ação;
- páginas sem integração;
- `setTimeout` simulando processamento;
- `console.log` substituindo implementação;
- `alert()` substituindo feedback de sistema;
- sucesso falso;
- operações somente em estado React.

Se uma funcionalidade precisar de backend:

FRONTEND
→ SERVICE
→ API
→ BACKEND
→ USE CASE
→ REPOSITORY
→ BANCO/FIREBASE
→ RESPONSE
→ FRONTEND

---

# 3. AUTENTICAÇÃO DO ADMIN/RH

## Tela RH-001 — Login

Componentes:

- Logo FLOW
- título
- descrição
- campo e-mail
- campo senha
- mostrar/ocultar senha
- lembrar sessão
- botão Entrar
- recuperar senha
- mensagens de erro
- loading
- estado de bloqueio

Backend:

- autenticação;
- validação;
- sessão;
- role;
- permissões;
- bloqueio;
- auditoria de login.

---

# 4. SEGURANÇA DO RH

O RH não pode ser acessível simplesmente porque o usuário está autenticado.

Implementar:

- autenticação;
- autorização;
- RBAC;
- permissões por módulo;
- permissões por ação;
- proteção de rotas;
- proteção de API;
- auditoria.

Exemplos:

RH_VIEW
RH_CREATE
RH_UPDATE
RH_DELETE
RH_REPORT
RH_EXPORT
RH_AUDIT
RH_ADMIN

---

# 5. DASHBOARD RH

## Tela RH-002 — Dashboard

Componentes:

- Header
- Breadcrumb
- seletor de período
- cards KPI
- colaboradores ativos
- colaboradores afastados
- admissões
- desligamentos
- aniversariantes
- férias
- pendências
- alertas
- gráficos
- atividades recentes
- ações rápidas

Todos os indicadores devem vir de dados reais.

Filtros devem consultar o backend.

---

# 6. COLABORADORES

## Tela RH-003 — Lista de colaboradores

Componentes:

- busca;
- filtros;
- status;
- departamento;
- cargo;
- unidade;
- ordenação;
- paginação;
- tabela Desktop;
- cards Mobile;
- exportação;
- botão Novo colaborador.

Backend:

GET /employees

Filtros:

- name;
- CPF quando permitido;
- department;
- position;
- status;
- admission_date;
- unit.

---

# 7. CADASTRO DE COLABORADOR

## Tela RH-004 — Novo colaborador

Seções:

### Dados pessoais

- nome;
- nome social;
- CPF;
- data de nascimento;
- sexo quando necessário;
- contato;
- endereço.

### Dados profissionais

- matrícula;
- cargo;
- departamento;
- gestor;
- unidade;
- data de admissão;
- regime;
- jornada;
- status.

### Documentação

- documentos;
- anexos;
- validade;
- histórico.

### Benefícios

- benefícios ativos;
- elegibilidade;
- histórico.

### Segurança

- permissões;
- perfil;
- acesso ao sistema.

Backend:

POST /employees

Persistência real.

Validação real.

Auditoria real.

---

# 8. PERFIL DO COLABORADOR

## Tela RH-005 — Perfil

Componentes:

- avatar;
- informações pessoais;
- informações profissionais;
- documentos;
- contratos;
- benefícios;
- férias;
- afastamentos;
- histórico;
- avaliações;
- treinamentos;
- atividades;
- auditoria.

Tabs:

- Geral
- Dados profissionais
- Documentos
- Benefícios
- Férias
- Afastamentos
- Desempenho
- Treinamentos
- Histórico

---

# 9. EDIÇÃO

## Tela RH-006 — Editar colaborador

Todos os campos editáveis deverão possuir:

- validação;
- permissões;
- feedback;
- loading;
- sucesso;
- erro;
- persistência.

Não atualizar somente o frontend.

---

# 10. DEPARTAMENTOS

## Tela RH-010 — Departamentos

Funções:

- listar;
- criar;
- editar;
- desativar;
- visualizar;
- pesquisar;
- filtrar.

Backend:

CRUD completo.

---

# 11. CARGOS

## Tela RH-020 — Cargos

Funções:

- criar;
- editar;
- desativar;
- associar departamento;
- descrição;
- faixa salarial quando aplicável;
- competências;
- histórico.

---

# 12. ESTRUTURA ORGANIZACIONAL

## Tela RH-030

Componentes:

- organograma;
- departamentos;
- gestores;
- equipes;
- colaboradores.

Interações:

- expandir;
- recolher;
- visualizar;
- pesquisar;
- abrir perfil.

Dados reais.

---

# 13. ADMISSÃO

## Tela RH-040 — Admissões

Funções:

- nova admissão;
- documentos;
- checklist;
- aprovação;
- pendências;
- status;
- histórico.

Estados:

- iniciado;
- documentação pendente;
- em análise;
- aprovado;
- concluído;
- cancelado.

Backend completo.

---

# 14. DESLIGAMENTO

## Tela RH-050

Funções:

- iniciar desligamento;
- motivo;
- data;
- checklist;
- documentos;
- aprovação;
- encerramento;
- auditoria.

---

# 15. FÉRIAS

## Tela RH-060

Funções:

- consultar saldo;
- solicitar;
- aprovar;
- rejeitar;
- cancelar;
- calendário;
- histórico.

Backend deve controlar regras e conflitos.

---

# 16. AFASTAMENTOS

## Tela RH-070

Funções:

- registrar;
- consultar;
- editar;
- anexar documentação;
- acompanhar;
- finalizar.

---

# 17. BENEFÍCIOS

## Tela RH-080

Componentes:

- catálogo;
- elegibilidade;
- benefícios ativos;
- adesão;
- cancelamento;
- histórico.

---

# 18. PONTO / JORNADA

## Tela RH-090

Funções:

- consultar registros;
- entradas;
- saídas;
- atrasos;
- horas;
- banco de horas;
- inconsistências;
- aprovação;
- histórico.

---

# 19. DESEMPENHO

## Tela RH-100

Funções:

- avaliações;
- ciclos;
- metas;
- feedback;
- indicadores;
- histórico;
- resultados.

---

# 20. TREINAMENTOS

## Tela RH-110

Funções:

- cursos;
- treinamentos;
- inscrição;
- presença;
- conclusão;
- certificados;
- histórico.

---

# 21. RECRUTAMENTO

## Tela RH-120

Funções:

- vagas;
- candidatos;
- etapas;
- entrevistas;
- avaliações;
- aprovação;
- contratação.

---

# 22. DOCUMENTOS

## Tela RH-130

Funções:

- visualizar;
- enviar;
- baixar;
- validar;
- expirar;
- solicitar atualização.

Segurança obrigatória.

---

# 23. NOTIFICAÇÕES RH

## Tela RH-140

Notificações reais para:

- documentos;
- férias;
- admissões;
- desligamentos;
- pendências;
- aprovações;
- treinamentos;
- avaliações.

---

# 24. RELATÓRIOS

## Tela RH-150

Relatórios:

- colaboradores;
- admissões;
- desligamentos;
- férias;
- afastamentos;
- benefícios;
- ponto;
- desempenho;
- treinamentos;
- recrutamento.

Filtros reais.

Exportação controlada por permissão.

---

# 25. AUDITORIA

## Tela RH-160

Registrar:

- usuário;
- ação;
- recurso;
- data/hora;
- IP quando aplicável;
- resultado;
- alterações relevantes.

Exemplo:

Usuário A
→ alterou colaborador B
→ campo cargo
→ valor anterior
→ valor novo
→ data/hora.

---

# 26. CONFIGURAÇÕES

## Tela RH-170

Configurações:

- departamentos;
- cargos;
- status;
- benefícios;
- políticas;
- permissões;
- notificações;
- parâmetros.

---

# 27. COMPONENTIZAÇÃO

Nenhuma tela deverá conter toda a lógica.

Criar componentes reutilizáveis.

Exemplo:

components/rh/

├── RHLayout/
├── RHTopBar/
├── RHSidebar/
├── RHDashboard/
├── RHMetricCard/
├── RHEmployeeTable/
├── RHEmployeeCard/
├── RHEmployeeForm/
├── RHEmployeeProfile/
├── RHEmployeeDocuments/
├── RHEmployeeBenefits/
├── RHEmployeeVacation/
├── RHEmployeeLeave/
├── RHDepartment/
├── RHPosition/
├── RHOrganizationChart/
├── RHAdmission/
├── RHTermination/
├── RHVacation/
├── RHLeave/
├── RHBenefits/
├── RHTimeTracking/
├── RHPerformance/
├── RHTraining/
├── RHRecruitment/
├── RHDocumentManager/
├── RHNotificationCenter/
├── RHReports/
├── RHAudit/
├── RHSettings/
├── RHSearch/
├── RHFilters/
├── RHModal/
├── RHDrawer/
├── RHConfirmDialog/
├── RHLoading/
├── RHEmptyState/
└── RHErrorState/

Cada componente deve ser analisado antes de ser criado para evitar duplicação.

---

# 28. CSS

Cada componente deve manter seus estilos junto da própria implementação.

Exemplo:

RHEmployeeCard/
├── RHEmployeeCard.tsx
├── RHEmployeeCard.css
├── RHEmployeeCard.types.ts
└── index.ts

O CSS específico não deve ser espalhado por arquivos globais.

---

# 29. RESPONSIVIDADE

Desktop:

- Sidebar;
- conteúdo;
- tabelas;
- gráficos.

Mobile:

- drawer;
- cards;
- bottom navigation quando aplicável;
- formulários adaptados;
- tabelas transformadas;
- gráficos responsivos.

Nenhuma funcionalidade pode desaparecer simplesmente porque a tela ficou pequena.

---

# 30. PWA

O RH também deve funcionar dentro da PWA.

Implementar:

- manifest;
- ícones;
- viewport;
- safe area;
- instalação;
- responsividade;
- service worker compatível;
- cache seguro.

Nunca armazenar dados sensíveis do RH em cache público.

---

# 31. BACKEND OBRIGATÓRIO

Toda tela deve possuir seu correspondente backend quando houver operação ou dado dinâmico.

Para cada funcionalidade documentar:

- endpoint;
- método;
- request;
- response;
- autenticação;
- autorização;
- validação;
- Use Case;
- Repository;
- persistência;
- erros;
- auditoria.

---

# 32. ESTADOS

Todas as telas assíncronas devem possuir:

LOADING

EMPTY

SUCCESS

ERROR

PERMISSION DENIED

SESSION EXPIRED

VALIDATION ERROR

---

# 33. SEGURANÇA E DADOS SENSÍVEIS

O módulo RH deve tratar dados como potencialmente sensíveis.

Aplicar:

- menor privilégio;
- RBAC;
- validação backend;
- controle de acesso;
- auditoria;
- proteção de documentos;
- proteção de APIs;
- não exposição desnecessária de dados.

---

# 34. DEPENDÊNCIAS

Sempre que uma funcionalidade exigir biblioteca:

- analisar package.json;
- verificar se já existe;
- instalar somente se necessário;
- utilizar versão compatível;
- configurar;
- integrar;
- testar.

Não instalar bibliotecas desnecessárias.

---

# 35. TESTES

Testar:

- autenticação;
- autorização;
- CRUD;
- formulários;
- filtros;
- paginação;
- permissões;
- upload;
- relatórios;
- auditoria;
- responsividade;
- PWA.

Executar:

pnpm build
pnpm lint
pnpm test

---

# 36. CRITÉRIO DE CONCLUSÃO

Uma tela NÃO será considerada concluída apenas porque aparece visualmente.

Será considerada concluída somente quando:

UI
+
componentes
+
CSS
+
responsividade
+
rota
+
estado
+
validação
+
API
+
backend
+
persistência
+
autorização
+
auditoria
+
testes

estiverem funcionando.

---

# 37. REGRA FINAL

O PAINEL RH É UM SISTEMA REAL.

Não construir uma demonstração.

Não criar mock.

Não criar dados fictícios.

Não criar páginas estáticas internas.

Não criar botões decorativos.

Não criar funcionalidades falsas.

Tudo que aparecer na interface deve possuir implementação correspondente.

Tudo que exigir backend deve existir no backend.

Tudo que exigir persistência deve ser persistido.

Tudo que exigir autorização deve ser protegido.

Tudo que exigir auditoria deve ser registrado.

O resultado final deve estar preparado para produção e evolução futura.