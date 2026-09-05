# FLOW — SEGURANÇA DA PLATAFORMA

**Documento:** FLOW_06_SEGURANCA_DA_PLATAFORMA.md  
**Versão:** 1.0  
**Status:** Documento-base de arquitetura, operação e governança de segurança  
**Projeto:** FLOW  
**Estrutura empresarial informada:** DEEVO SOLUÇÕES FINANCEIRAS LTDA / FLOW SERVIÇOS ONLINE LTDA em processo de transição operacional e jurídica  
**CNPJ informado nos documentos fornecidos:** 63.187.175/0001-70  
**Administrador informado:** Marcos Vinicius Dresbach do Amaral

> **IMPORTANTE:** este documento estabelece requisitos técnicos e organizacionais de segurança. Não substitui análise jurídica, auditoria de segurança, pentest, normas internas ou procedimentos especializados. Configurações efetivas deverão ser validadas antes de produção.

---

## 1. Objetivo

Definir os requisitos de segurança necessários para proteger:

- usuários;
- contas;
- sessões;
- conteúdo;
- mensagens;
- APIs;
- frontend;
- backend;
- banco de dados;
- Firebase;
- infraestrutura;
- painel administrativo;
- PWA;
- dispositivos;
- credenciais;
- código-fonte;
- propriedade intelectual;
- logs;
- backups.

A segurança deverá ser transversal ao FLOW e não uma funcionalidade isolada.

## 2. Princípios

O FLOW deverá adotar:

- Security by Design;
- Security by Default;
- menor privilégio;
- defesa em profundidade;
- segregação de responsabilidades;
- validação no servidor;
- zero trust quando aplicável;
- rastreabilidade;
- fail secure;
- gestão de vulnerabilidades;
- recuperação após incidentes.

## 3. Modelo de ameaças

A equipe deverá considerar, no mínimo:

- roubo de credenciais;
- credential stuffing;
- phishing;
- brute force;
- session hijacking;
- XSS;
- CSRF quando aplicável;
- SQL injection;
- NoSQL injection;
- SSRF;
- IDOR/BOLA;
- privilege escalation;
- abuso de APIs;
- upload malicioso;
- malware;
- spam;
- bots;
- scraping abusivo;
- vazamento de dados;
- configuração incorreta;
- dependência vulnerável;
- insider threat;
- comprometimento de fornecedor.

## 4. Segurança da conta

Toda conta deverá possuir:

- identificador único;
- mecanismo seguro de autenticação;
- controle de sessão;
- recuperação de acesso;
- proteção contra abuso;
- mecanismo de encerramento de sessão.

## 5. Senhas

Quando autenticação por senha existir:

- nunca armazenar senha em texto puro;
- utilizar algoritmo de hashing apropriado;
- nunca registrar senha em logs;
- nunca retornar senha pela API;
- aplicar política adequada;
- permitir recuperação segura.

## 6. Login

O login deverá:

1. validar entrada;
2. autenticar;
3. aplicar controles de abuso;
4. criar sessão segura;
5. verificar status da conta;
6. verificar requisitos obrigatórios;
7. liberar somente recursos autorizados.

## 7. Google Login

Autenticação externa deverá:

- utilizar fluxo oficial do provedor;
- validar tokens;
- não receber senha do Google;
- mapear identidade externa para usuário interno;
- aplicar regras de autorização do FLOW.

## 8. MFA

Contas administrativas deverão utilizar MFA sempre que tecnicamente disponível.

MFA deverá ser especialmente recomendado ou exigido para:

- administradores;
- operações críticas;
- recuperação de conta;
- alterações sensíveis.

## 9. Sessões

Sessões deverão possuir:

- expiração;
- renovação controlada;
- revogação;
- proteção contra fixation;
- identificação segura;
- encerramento global quando necessário.

## 10. Consentimento e sessão

O aceite obrigatório definido no fluxo do FLOW deverá ser validado no backend.

Não confiar apenas em:

- localStorage;
- cookies manipuláveis pelo cliente;
- estado React;
- variável JavaScript.

Fluxo:

```text
Login
 ↓
Backend verifica requisitos
 ↓
Consentimento pendente?
 ├─ SIM → tela de consentimento
 │          ↓
 │       aceite?
 │        ├─ SIM → registrar → liberar
 │        └─ NÃO → revogar sessão → login
 └─ NÃO → liberar
```

## 11. Autorização

Autenticação responde:

> Quem é o usuário?

Autorização responde:

> O que esse usuário pode fazer?

As duas responsabilidades devem permanecer separadas.

## 12. RBAC

O painel deverá utilizar controle baseado em papéis quando aplicável.

Exemplos:

- superadmin;
- admin;
- moderador;
- suporte;
- analista;
- financeiro;
- operador;
- usuário.

Os nomes definitivos devem ser definidos pelo produto.

## 13. Permissões granulares

Quando necessário, permissões poderão ser definidas por ação:

```text
users.read
users.update
users.suspend
posts.read
posts.moderate
reports.read
reports.resolve
settings.read
settings.update
audit.read
```

## 14. Backend como autoridade

O frontend nunca deverá ser a autoridade final de autorização.

Ocultar botão não significa bloquear ação.

Toda operação protegida deverá ser validada no backend.

## 15. APIs

APIs deverão aplicar:

- autenticação;
- autorização;
- validação;
- rate limiting;
- tratamento seguro de erros;
- logs;
- versionamento quando necessário.

## 16. Validação de entrada

Toda entrada externa deverá ser considerada não confiável.

Validar:

- tipo;
- formato;
- tamanho;
- faixa;
- enum;
- estrutura;
- conteúdo.

## 17. Respostas de erro

Não retornar informações internas desnecessárias.

Evitar expor:

- stack trace;
- SQL;
- caminhos internos;
- secrets;
- configurações;
- tokens;
- detalhes de infraestrutura.

## 18. Rate limiting

Aplicar limites conforme risco.

Especialmente em:

- login;
- recuperação de senha;
- cadastro;
- envio de mensagens;
- comentários;
- criação de posts;
- upload;
- denúncias;
- endpoints administrativos.

## 19. Antiabuso

A plataforma deverá possuir mecanismos contra:

- spam;
- flood;
- criação automatizada de contas;
- publicação massiva;
- mensagens abusivas;
- scraping excessivo;
- tentativa de exploração.

## 20. CSRF

Operações autenticadas baseadas em cookies deverão possuir proteção contra CSRF quando aplicável.

## 21. XSS

Conteúdo fornecido pelo usuário deverá ser tratado como não confiável.

Aplicar:

- escaping;
- sanitização quando necessário;
- CSP;
- validação;
- renderização segura.

## 22. Conteúdo HTML

HTML fornecido pelo usuário não deverá ser renderizado diretamente sem sanitização adequada.

## 23. Uploads

Uploads deverão possuir:

- limite de tamanho;
- validação de MIME;
- validação de extensão;
- validação do conteúdo;
- nomes seguros;
- armazenamento isolado;
- controle de acesso;
- possibilidade de varredura antimalware.

## 24. Imagens

Imagens enviadas deverão ser processadas com segurança.

Considerar:

- redimensionamento;
- compressão;
- remoção de metadados quando necessário;
- validação;
- limites.

## 25. Arquivos

Downloads deverão validar autorização.

Não confiar em nomes de arquivos fornecidos pelo cliente.

## 26. Banco de dados

O banco deverá possuir:

- usuários com privilégios mínimos;
- credenciais separadas por ambiente;
- backups;
- monitoramento;
- migrations controladas;
- conexão segura.

## 27. Firestore/Firebase

As regras do Firebase deverão ser tratadas como camada crítica.

Nunca utilizar regras permissivas em produção como:

```text
allow read, write: if true;
```

As regras devem validar:

- identidade;
- propriedade;
- papel;
- operação;
- contexto.

## 28. Firebase Storage

Arquivos deverão possuir regras de acesso coerentes com:

- proprietário;
- visibilidade;
- grupo;
- comunidade;
- conteúdo público/privado.

## 29. Firebase Authentication

Revisar:

- provedores habilitados;
- domínios autorizados;
- métodos de recuperação;
- sessões;
- MFA;
- contas administrativas;
- configurações de produção.

## 30. Segredos

Nunca armazenar secrets diretamente no frontend.

Separar:

- configuração pública;
- segredo;
- credencial;
- token;
- chave privada.

## 31. Variáveis de ambiente

Cada ambiente deverá possuir configuração própria:

```text
development
test
staging
production
```

Nunca reutilizar indiscriminadamente credenciais de produção.

## 32. Git

Nunca versionar:

- `.env` real;
- tokens;
- passwords;
- certificados privados;
- chaves privadas;
- dumps de produção.

## 33. GitHub

Recomenda-se:

- branch protection;
- revisão obrigatória;
- secret scanning;
- dependabot/alertas;
- MFA;
- menor privilégio;
- revisão de membros.

## 34. Pull Requests

PRs que alterem segurança deverão receber revisão apropriada.

Mudanças críticas não devem ser aprovadas somente pelo autor.

## 35. Dependências

Dependências devem ser:

- inventariadas;
- atualizadas;
- verificadas;
- removidas quando desnecessárias.

Vulnerabilidades críticas deverão ser priorizadas.

## 36. Supply chain

A equipe deverá considerar:

- dependências comprometidas;
- pacotes maliciosos;
- typosquatting;
- scripts de instalação;
- ações de CI/CD;
- extensões de terceiros.

## 37. CI/CD

Pipeline deverá impedir, conforme maturidade do projeto:

- secrets expostos;
- build quebrado;
- testes críticos falhando;
- vulnerabilidades críticas conhecidas;
- deploy não autorizado.

## 38. Deploy

Deploy de produção deverá possuir:

- autenticação;
- autorização;
- rastreabilidade;
- rollback;
- logs.

## 39. PWA

O PWA deverá:

- utilizar HTTPS;
- possuir service worker seguro;
- controlar cache;
- evitar armazenar secrets desnecessários;
- permitir atualização segura;
- invalidar conteúdo sensível quando necessário.

## 40. Cache

Dados privados não devem ser armazenados em cache público.

Revisar:

- HTTP cache;
- service worker;
- IndexedDB;
- localStorage;
- sessionStorage.

## 41. LocalStorage

Não armazenar indiscriminadamente:

- tokens de alto privilégio;
- secrets;
- dados sensíveis.

A estratégia de armazenamento de sessão deverá ser escolhida considerando o modelo de autenticação.

## 42. Headers

Avaliar utilização de:

- Content-Security-Policy;
- Strict-Transport-Security;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy.

## 43. HTTPS

Produção deverá utilizar HTTPS.

Não transmitir credenciais ou dados privados em HTTP não protegido.

## 44. CORS

CORS deverá possuir política explícita.

Evitar liberar origens indiscriminadamente.

## 45. Painel administrativo

O painel admin deverá ser considerado superfície de alto risco.

Aplicar:

- autenticação forte;
- MFA;
- RBAC;
- sessões restritas;
- logs;
- confirmação de operações destrutivas;
- auditoria.

## 46. Operações destrutivas

Operações como:

- excluir usuário;
- banir;
- remover conteúdo;
- apagar dados;
- alterar permissões;
- modificar configurações;

deverão possuir confirmação e autorização apropriadas.

## 47. Audit Log

Registrar operações administrativas relevantes:

```text
actor
action
target
timestamp
result
metadata
```

Evitar registrar dados sensíveis desnecessários.

## 48. Imutabilidade de auditoria

Logs de auditoria devem ser protegidos contra alteração indevida.

## 49. Monitoramento

Monitorar:

- erros;
- autenticação;
- autorização;
- picos;
- abuso;
- indisponibilidade;
- alterações administrativas.

## 50. Alertas

Alertas deverão existir para eventos críticos, como:

- múltiplas tentativas de login;
- acesso administrativo anormal;
- alteração de permissões;
- vazamento de segredo;
- falhas em serviços críticos.

## 51. Contas administrativas

Nunca utilizar uma conta administrativa compartilhada.

Cada administrador deverá possuir identidade individual.

## 52. Revogação

Quando um colaborador sair:

```text
Desligamento
 ↓
Revogar acesso
 ↓
Revogar tokens
 ↓
Remover permissões
 ↓
Revisar credenciais
 ↓
Transferir responsabilidades
 ↓
Registrar operação
```

## 53. Gestão de dispositivos

Quando aplicável, equipamentos utilizados para administração deverão possuir:

- bloqueio;
- atualização;
- proteção contra malware;
- criptografia;
- contas individuais.

## 54. Incidente

Processo:

```text
Detectar
 ↓
Classificar
 ↓
Conter
 ↓
Preservar evidências
 ↓
Erradicar
 ↓
Recuperar
 ↓
Validar
 ↓
Documentar
 ↓
Prevenir recorrência
```

## 55. Severidade

Incidentes poderão ser classificados como:

- P0 — crítico;
- P1 — alto;
- P2 — médio;
- P3 — baixo.

Os critérios e tempos de resposta devem ser formalizados operacionalmente.

## 56. Comunicação de incidente

Comunicações externas deverão ser avaliadas conforme:

- impacto;
- obrigações legais;
- contratos;
- natureza dos dados;
- orientação jurídica;
- autoridades competentes quando aplicável.

## 57. Backup

Backups devem possuir:

- periodicidade;
- retenção;
- proteção;
- controle de acesso;
- teste de restauração.

## 58. Disaster Recovery

Definir:

- RPO;
- RTO;
- serviços críticos;
- dependências;
- procedimento de restauração;
- responsáveis.

## 59. Continuidade

A plataforma deve conseguir recuperar suas operações após:

- falha de infraestrutura;
- exclusão acidental;
- comprometimento;
- indisponibilidade de fornecedor.

## 60. Pentest

Antes de lançamento público relevante, recomenda-se avaliação de segurança independente conforme risco e maturidade.

Áreas:

- autenticação;
- autorização;
- APIs;
- upload;
- admin;
- Firebase;
- PWA;
- exposição de dados.

## 61. SAST

Executar análise estática quando possível.

## 62. DAST

Testar aplicação em execução para identificar vulnerabilidades.

## 63. Dependency Scanning

Automatizar verificação de dependências vulneráveis.

## 64. Secret Scanning

Detectar secrets acidentalmente commitados.

## 65. Segurança do código gerado por IA

Código gerado por IA:

- não é automaticamente confiável;
- deve ser revisado;
- deve ser testado;
- deve passar pelos mesmos controles;
- não deve introduzir dependências sem análise.

## 66. Segurança do Firebase durante desenvolvimento

Ambientes de desenvolvimento não devem possuir permissões de produção simplesmente para facilitar testes.

## 67. Dados de teste

Preferir dados sintéticos.

Nunca utilizar dados reais de usuários sem necessidade e controles adequados.

## 68. Segurança de terceiros

Avaliar fornecedores críticos quanto a:

- segurança;
- disponibilidade;
- privacidade;
- localização;
- contratos;
- incidentes.

## 69. Gestão de vulnerabilidades

Toda vulnerabilidade relevante deverá possuir:

- identificação;
- severidade;
- responsável;
- correção;
- validação;
- registro.

## 70. SLA interno

A equipe deverá estabelecer prazos internos conforme severidade.

Exemplo conceitual:

```text
Crítica → prioridade máxima
Alta    → prioridade alta
Média   → planejamento
Baixa   → backlog
```

Os prazos definitivos devem ser definidos pela governança.

## 71. Segurança física

Equipamentos e infraestrutura sob controle direto deverão possuir medidas físicas adequadas.

## 72. Treinamento

Colaboradores deverão receber orientação sobre:

- phishing;
- secrets;
- credenciais;
- LGPD;
- engenharia social;
- incidentes;
- uso seguro de IA.

## 73. Princípio do menor privilégio

Permissões devem ser concedidas somente quando necessárias.

Revisões periódicas deverão remover acessos que perderam finalidade.

## 74. Separação de ambientes

Devem existir fronteiras entre:

```text
DEV
 ↓
TEST
 ↓
STAGING
 ↓
PRODUCTION
```

## 75. Produção

Acesso direto à produção deverá ser restrito.

Mudanças devem preferencialmente passar por pipeline controlado.

## 76. Rollback

Toda mudança crítica deverá possuir estratégia de rollback.

## 77. Feature Flags

Mudanças de alto risco poderão utilizar feature flags para:

- ativação gradual;
- desligamento rápido;
- testes;
- rollback funcional.

## 78. Segurança de mensagens

Mensagens deverão validar:

- remetente;
- destinatário;
- autorização;
- conteúdo;
- limites;
- abuso.

## 79. Segurança de comunidades

Operações administrativas em comunidades deverão validar:

- membro;
- moderador;
- administrador;
- proprietário;
- permissão.

## 80. Segurança do marketplace

Caso exista marketplace:

- validar vendedor;
- produto;
- autorização;
- conteúdo;
- transações;
- acesso a dados.

## 81. Segurança de notificações

Notificações não devem revelar dados privados em contexto inadequado.

## 82. Segurança de busca

Busca deverá respeitar visibilidade e autorização.

O fato de um registro existir não significa que ele possa aparecer nos resultados.

## 83. Segurança do perfil

Perfil público/privado deverá ser aplicado no backend.

## 84. Segurança do feed

O feed deverá respeitar:

- visibilidade;
- bloqueios;
- privacidade;
- moderação;
- permissões.

## 85. Bloqueios

Se usuário A bloquear usuário B, APIs relevantes deverão impedir acesso incompatível com essa relação.

Não depender somente da interface.

## 86. Denúncias

Denúncias deverão possuir:

- autorização;
- rate limiting;
- armazenamento protegido;
- acesso restrito;
- trilha de auditoria.

## 87. Recuperação de conta

O fluxo deverá proteger contra:

- enumeração de usuários;
- takeover;
- abuso;
- reset indevido.

## 88. User enumeration

Mensagens de login/recuperação deverão evitar revelar informações desnecessárias sobre existência de contas.

## 89. Sessão encerrada

Quando o usuário for expulso por requisito obrigatório, a sessão deverá ser invalidada no mecanismo de autenticação apropriado, não somente removida da interface.

## 90. Checklist pré-produção

Antes do lançamento:

```text
[ ] HTTPS
[ ] Auth
[ ] MFA admin
[ ] RBAC
[ ] Firebase Rules
[ ] Storage Rules
[ ] API validation
[ ] Rate limiting
[ ] CORS
[ ] CSP
[ ] Secrets
[ ] Backup
[ ] Restore test
[ ] Logs
[ ] Audit log
[ ] Error handling
[ ] Dependency scan
[ ] Secret scan
[ ] SAST
[ ] DAST
[ ] Upload security
[ ] Admin security
[ ] PWA security
[ ] LGPD review
[ ] Incident plan
```

## 91. Regra de produção

Nenhuma funcionalidade deverá ser considerada pronta somente porque "funciona".

A definição de pronto deverá incluir:

```text
Funciona
+
Está autorizada
+
Está validada
+
Está protegida
+
Está testada
+
Está observável
+
Pode ser recuperada
```

## 92. Regra final

> **No FLOW, segurança não será adicionada depois do produto pronto. Segurança fará parte da arquitetura desde o componente, passando pelo frontend e backend, até Firebase, banco, PWA, painel administrativo, infraestrutura e processos empresariais.**

---

## Controle de versão

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 2026-09-04 | Criação do documento de segurança da plataforma |
