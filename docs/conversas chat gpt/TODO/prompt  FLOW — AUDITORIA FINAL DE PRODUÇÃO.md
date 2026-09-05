# FLOW — AUDITORIA FINAL DE PRODUÇÃO
# QA + BACKEND + FIREBASE + PERMISSÕES + INTEGRAÇÃO END-TO-END
# NÍVEL ENTERPRISE / PRODUÇÃO

Você está trabalhando no projeto:

F:\Flow\flow-web

Esta etapa acontece SOMENTE DEPOIS que a implementação anterior estiver concluída.

NÃO comece criando novas telas.

NÃO refaça o projeto visualmente.

NÃO substitua a arquitetura existente.

NÃO destrua Firebase.

NÃO transforme funcionalidades reais em mocks.

O objetivo desta etapa é AUDITAR, TESTAR, CORRIGIR E VALIDAR o sistema inteiro.

============================================================
1. OBJETIVO PRINCIPAL
============================================================

Realizar uma auditoria completa da FLOW verificando se:

FRONTEND
+
COMPONENTES
+
CSS
+
ROTAS
+
AUTENTICAÇÃO
+
FIREBASE
+
FIRESTORE
+
STORAGE
+
BACKEND
+
APIs
+
BANCO
+
PWA
+
RESPONSIVIDADE
+
PERMISSÕES
+
SEGURANÇA
+
PERSISTÊNCIA
+
ESTADOS
+
ADMIN
+
REDE SOCIAL

estão realmente integrados.

O sistema NÃO deve apenas compilar.

Ele deve funcionar de ponta a ponta.

============================================================
2. REGRA ZERO — NADA DE MOCK
============================================================

Durante esta auditoria é TERMINANTEMENTE PROIBIDO criar mocks para esconder problemas.

Não criar:

mock
fake
dummy
demo
stub
placeholder
static data
fake API
fake Firebase
fake repository
fake response

para fazer testes passarem.

Se algo estiver quebrado:

IDENTIFIQUE A CAUSA.

CORRIJA A IMPLEMENTAÇÃO REAL.

============================================================
3. ERRO CRÍTICO — FIREBASE
============================================================

Auditar especificamente todos os erros:

"Missing or insufficient permissions."

"FirebaseError: Missing or insufficient permissions."

Esse erro é CRÍTICO.

Não simplesmente capturar o erro e esconder.

Não utilizar:

try/catch

para apenas impedir que apareça.

Não transformar o erro em:

"Operação concluída."

O objetivo é descobrir POR QUE a operação está sendo negada.

============================================================
4. AUDITORIA DO ACEITE DO CONTRATO
============================================================

O fluxo de consentimento é prioritário.

Testar:

Cadastro
↓
Login
↓
Verificação do aceite
↓
Tela de contrato
↓
Checkbox
↓
Aceitar
↓
Firebase/API
↓
Persistência
↓
Confirmação
↓
Liberação da rede social

Verificar exatamente onde ocorre:

"Missing or insufficient permissions."

============================================================
5. FIRESTORE — ACEITE
============================================================

Identificar:

- coleção utilizada;
- documento utilizado;
- subcoleção quando existir;
- campos;
- UID;
- autenticação;
- regras Firestore;
- service responsável;
- repository;
- chamada de escrita;
- chamada de leitura.

Confirmar se o usuário autenticado possui autorização para:

LER seu próprio estado de consentimento.

CRIAR seu próprio aceite.

ATUALIZAR seu próprio aceite quando permitido.

NÃO alterar aceite de outro usuário.

============================================================
6. REGRA DE SEGURANÇA DO ACEITE
============================================================

O usuário autenticado deve somente conseguir registrar o próprio aceite.

Exemplo conceitual:

request.auth.uid == userId

ou equivalente seguro na arquitetura existente.

NÃO utilizar uma regra ampla como:

allow read, write: if true;

NÃO liberar Firestore inteiro para resolver o problema.

NÃO utilizar:

allow write: if request.auth != null;

quando isso permitir escrita indevida em documentos de outros usuários.

Corrigir a regra de maneira específica.

============================================================
7. FIREBASE AUTH
============================================================

Testar:

- cadastro por e-mail;
- login;
- logout;
- recuperação;
- redefinição;
- Google;
- sessão;
- usuário autenticado;
- usuário não autenticado;
- sessão expirada;
- usuário desativado;
- usuário bloqueado.

Confirmar que:

auth.currentUser

está disponível antes das operações que dependem de UID.

Não executar gravações protegidas antes da autenticação estar confirmada.

============================================================
8. RACE CONDITIONS DE AUTENTICAÇÃO
============================================================

Investigar situações como:

usuário acabou de fazer login
↓
frontend executa Firestore imediatamente
↓
auth ainda não propagou estado
↓
request sem autenticação
↓
Missing or insufficient permissions

Garantir que as operações dependentes da sessão aguardem a autenticação corretamente.

Utilizar o mecanismo apropriado da arquitetura atual.

Não resolver com:

setTimeout()

============================================================
9. FIRESTORE RULES
============================================================

Auditar todas as regras.

Para cada coleção:

- quem pode ler?
- quem pode criar?
- quem pode atualizar?
- quem pode excluir?
- quais campos podem ser alterados?
- quem é proprietário?
- qual role pode acessar?
- qual validação é necessária?

Criar uma matriz:

COLEÇÃO
↓
READ
↓
CREATE
↓
UPDATE
↓
DELETE
↓
ROLE
↓
OWNER
↓
CONDIÇÃO

============================================================
10. SEGURANÇA NÃO PODE SER RESOLVIDA ABRINDO O FIRESTORE
============================================================

É expressamente proibido corrigir erro de permissão simplesmente tornando o banco público.

NÃO usar:

allow read, write: if true;

NÃO liberar todas as coleções para:

request.auth != null

sem análise de ownership e autorização.

A correção deve ser mínima e específica.

============================================================
11. TESTAR TODAS AS OPERAÇÕES
============================================================

Testar operações reais:

CREATE
READ
UPDATE
DELETE

Para:

- usuário;
- perfil;
- post;
- comentário;
- curtida;
- seguidores;
- comunidades;
- mensagens;
- notificações;
- stories;
- denúncias;
- salvos;
- configurações;
- consentimento;
- administração.

============================================================
12. FRONTEND → BACKEND
============================================================

Para cada operação verificar:

Componente
↓
Hook
↓
Service
↓
API
↓
Backend
↓
Firebase/Banco
↓
Resposta
↓
Estado
↓
UI

Não aceitar fluxo interrompido.

============================================================
13. ERROS HTTP
============================================================

Auditar:

400
401
403
404
409
422
429
500
503

Cada erro deve gerar comportamento correto no frontend.

401:
sessão inválida.

403:
sem autorização.

404:
recurso inexistente.

409:
conflito.

422:
validação.

500:
erro interno.

Não transformar todos os erros em:

"Algo deu errado."

============================================================
14. REDE SOCIAL
============================================================

Auditar funcionalidade por funcionalidade.

Feed:

- carregar posts;
- paginação;
- curtida;
- comentário;
- compartilhamento;
- salvar;
- excluir;
- denunciar.

Perfil:

- editar;
- avatar;
- capa;
- bio;
- seguidores;
- seguindo.

Comunidades:

- criar;
- entrar;
- sair;
- publicar;
- moderar.

Mensagens:

- abrir conversa;
- enviar;
- receber;
- marcar lida.

Notificações:

- carregar;
- marcar lida;
- excluir quando aplicável.

============================================================
15. ADMIN
============================================================

Testar:

- login;
- autorização;
- dashboard;
- usuários;
- moderação;
- denúncias;
- comunidades;
- conteúdo;
- RH;
- relatórios;
- auditoria;
- configurações.

Um usuário comum NÃO pode acessar operações administrativas.

============================================================
16. ROLES E PERMISSÕES
============================================================

Identificar todas as roles existentes.

Exemplo:

USER
MODERATOR
ADMIN
SUPER_ADMIN
RH

Não assumir nomes se o projeto já possuir outros.

Documentar as roles reais encontradas.

Testar acesso permitido e negado.

============================================================
17. AUTORIZAÇÃO NO BACKEND
============================================================

NUNCA confiar apenas em:

if (user.role === "admin")

no frontend.

A autorização precisa existir na camada segura correspondente:

backend
ou
Firebase Rules
ou
ambos.

============================================================
18. PERSISTÊNCIA
============================================================

Para cada operação:

1. executar;
2. confirmar sucesso;
3. recarregar página;
4. verificar novamente;
5. confirmar que os dados continuam existentes.

Exemplo:

Aceitar contrato
↓
logout
↓
login
↓
aceite continua registrado.

============================================================
19. UI STATES
============================================================

Toda operação assíncrona deve ter:

LOADING
EMPTY
SUCCESS
ERROR

Não permitir:

loading infinito.

Não mostrar sucesso antes da confirmação.

============================================================
20. NETWORK FAILURE
============================================================

Simular perda de conexão.

Verificar se a aplicação:

- informa o usuário;
- não perde estado indevidamente;
- não confirma operação inexistente;
- permite tentar novamente;
- não duplica operações.

============================================================
21. DUPLICIDADE
============================================================

Testar duplo clique.

Exemplo:

Usuário clica duas vezes em:

"Eu aceito"

Não deve gerar dois registros indevidos.

Aplicar idempotência quando necessário.

O mesmo vale para:

- publicar;
- curtir;
- seguir;
- enviar mensagem;
- criar comunidade;
- pagamentos quando existirem;
- operações administrativas.

============================================================
22. PERFORMANCE
============================================================

Detectar:

- listeners duplicados;
- subscriptions não removidas;
- useEffect incorreto;
- consultas Firestore excessivas;
- chamadas API duplicadas;
- renders desnecessários;
- downloads gigantes;
- imagens sem otimização.

============================================================
23. FIREBASE LISTENERS
============================================================

Todo:

onSnapshot

ou listener equivalente deve possuir cleanup correto.

Não permitir múltiplos listeners para a mesma tela após navegação.

============================================================
24. PWA
============================================================

Testar:

- instalação;
- manifest;
- ícones;
- service worker;
- cache;
- atualização;
- offline;
- retorno online.

Garantir que o Service Worker NÃO interfira indevidamente com:

- Firebase Auth;
- Firestore;
- APIs;
- endpoints privados.

============================================================
25. RESPONSIVIDADE
============================================================

Testar:

320
360
375
390
414
430
768
1024
1280
1440
1920

Verificar:

- overflow;
- menus;
- modais;
- formulários;
- feed;
- mensagens;
- admin;
- RH.

============================================================
26. CSS
============================================================

Detectar:

- CSS duplicado;
- !important excessivo;
- estilos globais indevidos;
- componentes sem CSS;
- CSS morto;
- conflitos;
- z-index;
- overflow;
- regras desktop quebrando mobile.

Preservar:

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

Sem Dark Mode como padrão.

============================================================
27. TESTE DE ROTAS
============================================================

Testar todas as rotas existentes.

Para cada rota:

- abre?
- autenticação correta?
- autorização correta?
- componente correto?
- dados carregam?
- backend responde?
- loading?
- empty?
- error?
- navegação?
- voltar?
- refresh?

============================================================
28. LINKS E BOTÕES
============================================================

Encontrar:

onClick vazios
href="#"
TODO
FIXME
console.log
alert()
setTimeout simulando API
navigate para rota inexistente

Corrigir tudo que representar implementação incompleta.

============================================================
29. CÓDIGO MORTO
============================================================

Identificar:

- componentes não utilizados;
- services não utilizados;
- hooks não utilizados;
- APIs não utilizadas;
- CSS não utilizado;
- imports mortos;
- arquivos duplicados.

NÃO apagar automaticamente.

Primeiro verificar dependências.

============================================================
30. TESTES AUTOMATIZADOS
============================================================

Executar:

pnpm install
pnpm lint
pnpm test
pnpm build

Se existirem scripts adicionais:

executá-los.

Registrar resultado real.

============================================================
31. VERIFICAÇÃO DO BUILD
============================================================

Não considerar:

"compila"

como:

"funciona".

Build é apenas uma etapa.

O sistema precisa passar também por validação funcional.

============================================================
32. AUDITORIA DE LOGS
============================================================

Pesquisar no projeto por:

Missing or insufficient permissions
FirebaseError
permission-denied
unauthenticated
unauthorized
403
401
500
TODO
FIXME
mock
fake
dummy
static data
setTimeout
alert(
console.log

Classificar cada ocorrência.

============================================================
33. CORREÇÃO AUTOMÁTICA
============================================================

Quando encontrar um problema:

1. descobrir causa raiz;
2. corrigir;
3. testar;
4. verificar regressão;
5. executar novamente os testes.

Não aplicar correções superficiais.

Especialmente para Firebase.

============================================================
34. NÃO ALTERAR REGRAS DE FORMA PERIGOSA
============================================================

Nunca corrigir:

Missing or insufficient permissions

abrindo acesso global.

A regra correta deve ser:

mínimo privilégio
+
ownership
+
autorização
+
autenticação.

============================================================
35. RELATÓRIO FINAL
============================================================

Criar:

AUDITORIA_FINAL_FLOW.md

Contendo:

### RESUMO EXECUTIVO

### ERROS ENCONTRADOS

### ERROS FIREBASE

### FIRESTORE RULES

### AUTENTICAÇÃO

### AUTORIZAÇÃO

### BACKEND

### API

### REDE SOCIAL

### ADMIN

### PWA

### RESPONSIVIDADE

### CSS

### COMPONENTIZAÇÃO

### PERFORMANCE

### SEGURANÇA

### TESTES

### BUILD

### DEPENDÊNCIAS

### MOCKS ENCONTRADOS

### PÁGINAS STATIC ENCONTRADAS

### BOTÕES SEM IMPLEMENTAÇÃO

### ROTAS QUEBRADAS

### COMPONENTES ÓRFÃOS

### CORREÇÕES REALIZADAS

### PENDÊNCIAS REAIS

### RISCO

Classificar:

CRÍTICO
ALTO
MÉDIO
BAIXO

============================================================
36. MATRIZ DE FUNCIONALIDADES
============================================================

Criar uma matriz:

| Funcionalidade | Frontend | API | Backend | Firebase | Persistência | Auth | Permissão | Teste | Status |

Nenhuma funcionalidade deve aparecer como concluída se qualquer camada necessária estiver ausente.

============================================================
37. CRITÉRIO FINAL DE APROVAÇÃO
============================================================

A aplicação somente será considerada APROVADA quando:

BUILD = PASS

TESTS = PASS

LINT = PASS

Firebase = PASS

Auth = PASS

Permissions = PASS

Backend = PASS

API = PASS

Persistence = PASS

PWA = PASS

Responsive = PASS

No critical errors.

No mock.

No fake functionality.

No static application functionality.

No unresolved permission errors.

============================================================
38. GIT
============================================================

Depois de corrigir:

git status

git diff

Revisar todas as alterações.

Executar novamente:

pnpm lint
pnpm test
pnpm build

Somente depois:

git add .

git commit -m "fix: auditoria e correcoes de integracao e permissoes"

git push

NÃO enviar:

.env
secrets
credentials
private keys
tokens
arquivos temporários.

============================================================
39. REGRA FINAL ABSOLUTA
============================================================

NÃO esconda problemas.

NÃO mascare erros.

NÃO crie mocks.

NÃO abra permissões globalmente.

NÃO remova Firebase.

NÃO substitua backend por frontend.

NÃO declare sucesso sem confirmação real.

NÃO considere build como prova de funcionamento.

O objetivo desta etapa é descobrir e corrigir problemas reais.

Se aparecer:

"Missing or insufficient permissions."

a investigação deve continuar até determinar:

QUAL OPERAÇÃO
↓
QUAL USUÁRIO
↓
QUAL UID
↓
QUAL COLEÇÃO
↓
QUAL DOCUMENTO
↓
QUAL REGRA
↓
QUAL CONDIÇÃO
↓
POR QUE FOI NEGADA
↓
QUAL CORREÇÃO
↓
QUAL TESTE COMPROVA A CORREÇÃO

A correção deve preservar o princípio de menor privilégio.

============================================================
40. CONCLUSÃO
============================================================

A FLOW somente estará pronta quando deixar de ser apenas uma interface visual e funcionar como um sistema real de produção de ponta a ponta.

Frontend + Backend + Firebase + Banco + Autenticação + Autorização + Persistência + PWA + Testes devem funcionar como uma única plataforma integrada.