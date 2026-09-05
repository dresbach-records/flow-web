# FLOW — TESTES, QUALIDADE E DEFINITION OF DONE

**Documento:** FLOW_09_TESTES_QUALIDADE_E_DEFINITION_OF_DONE.md  
**Versão:** 1.0  
**Status:** Norma de qualidade e validação  
**Projeto:** FLOW — Rede Social / Plataforma Digital

## 1. Objetivo

Definir o padrão oficial de qualidade do FLOW para impedir que funcionalidades sejam consideradas concluídas apenas porque a interface foi criada.

A qualidade deverá abranger código, arquitetura, componentes, CSS, frontend, backend, APIs, Firebase, banco, segurança, acessibilidade, responsividade, PWA, performance, testes, observabilidade e documentação.

## 2. Princípio fundamental

Uma tela visualmente pronta não significa que a funcionalidade esteja pronta.

Quando existir backend ou integração necessária, o fluxo deve funcionar ponta a ponta:

```text
Interface → Componente → Estado → Ação → Service → API → Backend → Persistência → Resposta → Interface
```

## 3. Pirâmide de testes

```text
          E2E
       Integration
      Component
         Unit
```

A maior parte dos testes deve permanecer nos níveis unitário e integração, reservando E2E para jornadas críticas.

## 4. Testes unitários

Cobrir funções, utilitários, validadores, formatadores, regras de negócio, hooks isoláveis, services e transformadores de dados.

## 5. Testes de componentes

Validar renderização, props, interação, eventos, acessibilidade básica, loading, erro, sucesso e empty state.

## 6. Testes de integração

Validar a comunicação entre componentes, hooks, services, APIs, repositories e Firebase quando aplicável.

## 7. Testes E2E

Cobrir principalmente jornadas críticas.

### Cadastro e login

```text
Cadastro → Login → Verificação de consentimento → FLOW
```

### Recusa do contrato

```text
Contrato → Recusa → Sessão encerrada → Mensagem → Login
```

### Aceite

```text
Contrato → Aceite → Registro → Liberação do acesso
```

## 8. Google Login

Validar autenticação, criação do usuário quando necessária, coleta de dados obrigatórios, sessão, consentimento, logout e erros.

## 9. Sessão

Validar sessão válida, expirada, logout, usuário suspenso, token inválido e acesso sem autenticação.

## 10. Autorização

Esconder um botão não é segurança. O backend deve negar diretamente operações não autorizadas.

```text
Usuário comum → endpoint administrativo → 403 Forbidden
```

## 11. Admin

Testar login, permissões, usuários, moderação, denúncias, configurações, auditoria e ações críticas.

## 12. Segurança

Testar exposição de secrets, endpoints sem autorização, validação insuficiente, permissões incorretas, dados privados expostos, uploads inseguros, sessão, CORS e configurações.

## 13. Firebase

Testar Authentication, Firestore, Storage, Rules, tratamento de erros, documentos inexistentes e permissões.

## 14. Firebase Rules

Cobrir cenários permitido/negado, autenticado/não autenticado, próprio recurso/terceiro, admin/não-admin.

## 15. APIs

Cada endpoint crítico deve testar sucesso e erros aplicáveis:

```text
2xx
400
401
403
404
409
422
5xx
```

## 16. Contratos de API

Validar request, response, tipos, campos obrigatórios/opcionais, erros e paginação.

## 17. Banco e persistência

Testar constraints, índices, relacionamentos, migrations, transações e dados inválidos. Uma operação de escrita só é sucesso quando o dado realmente foi persistido.

## 18. Feed

Cobrir criação, edição, exclusão, curtida, remoção de curtida, comentários, compartilhamento, paginação, atualização, loading, empty e erro.

## 19. Perfil

Cobrir visualização, edição, avatar, capa, informações, privacidade, seguidores e seguindo.

## 20. Mensagens

Cobrir conversa, envio, recebimento, estados, mensagens vazias, erros, bloqueios e permissões.

## 21. Notificações

Cobrir leitura, não lida, marcação como lida, atualização e contador.

## 22. Comunidades

Cobrir criação, entrada, saída, membros, posts, permissões, administração e denúncias.

## 23. Marketplace

Quando aplicável, cobrir criação, pesquisa, filtros, visualização, contato, edição, remoção, permissões e denúncias.

## 24. Moderação

```text
Denúncia → Admin → Análise → Ação → Auditoria → Reflexo na rede social
```

## 25. Estados de UI

Toda tela operacional deve considerar:

```text
Initial
Loading
Success
Empty
Error
Unauthorized
Forbidden
Offline quando aplicável
```

## 26. Formulários

Validar obrigatoriedade, formato, limites, caracteres, mensagens, submit, loading, erros de API e sucesso.

## 27. Botões

Todo botão que represente operação real deve possuir ação real:

```text
Click → Validação → Loading → API/ação → Resultado → UI
```

Nenhum botão crítico deve permanecer como `console.log`, ação vazia ou navegação falsa.

## 28. Mocks

Mocks podem existir em testes, stories/demos e desenvolvimento explicitamente identificado. Não podem substituir backend real em produção.

Detectar arrays estáticos, usuários fictícios, posts fictícios, respostas hardcoded e `setTimeout` simulando API.

## 29. Responsividade

Validar mobile, tablet, desktop e desktop largo, incluindo overflow, menus, cards, modais, formulários, navegação, RightRail e tabelas.

## 30. PWA

Testar manifest, ícones, instalação, standalone, service worker, cache, atualização e abertura após instalação.

## 31. Acessibilidade

Validar teclado, foco, labels, contraste, headings, landmarks, botões, links e formulários.

## 32. Testes visuais

Comparar a implementação com os catálogos oficiais do FLOW, verificando estrutura, espaçamento, alinhamento, tipografia, cores, componentes e estados.

## 33. Light UI

A interface deve manter coerência com:

```text
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
```

Uso excessivo de dark mode ou gradientes deve ser tratado como regressão visual.

## 34. Performance

Avaliar tempo inicial, bundle, requests, imagens, renderização, memória, queries e latência.

## 35. Concorrência e idempotência

Operações sensíveis devem considerar ações simultâneas e repetição. Exemplo: clique duplo em Curtir não deve produzir inconsistência.

## 36. Retry e timeout

Falhas temporárias devem ser tratadas sem duplicidade. Timeouts devem apresentar estado recuperável ao usuário.

## 37. Uploads

Testar tipo, tamanho, extensão, conteúdo, falha, progresso, cancelamento e armazenamento.

## 38. Eventos e observabilidade

Quando houver eventos, validar:

```text
Ação → Evento → Consumer → Efeito
```

Também verificar logs, correlation ID, métricas e traces quando configurados.

## 39. Regressão

Correções de bugs críticos devem ganhar testes de regressão. Alterações em componentes compartilhados devem verificar as telas afetadas.

## 40. Build

Executar, conforme os scripts existentes:

```text
pnpm install
pnpm lint
pnpm test
pnpm build
```

Não inventar scripts que o projeto não possui.

## 41. TypeScript

Erros reais de tipagem devem ser investigados e corrigidos. Não utilizar configurações para simplesmente esconder erros.

## 42. Definition of Ready

Antes da implementação:

```text
[ ] Requisito definido
[ ] Tela identificada
[ ] Rota definida
[ ] Componentes identificados
[ ] Estados definidos
[ ] API identificada
[ ] Backend identificado
[ ] Permissões definidas
[ ] Critérios de aceitação definidos
```

## 43. Definition of Done

Antes de concluir:

```text
[ ] Código implementado
[ ] Componentização adequada
[ ] CSS do componente organizado
[ ] Responsividade
[ ] Loading
[ ] Empty
[ ] Error
[ ] Success
[ ] API real quando aplicável
[ ] Backend real quando aplicável
[ ] Persistência
[ ] Autorização
[ ] Testes
[ ] Acessibilidade
[ ] Performance revisada
[ ] Sem mock indevido
[ ] Sem código morto
[ ] Documentação
[ ] Code Review
[ ] CI aprovado
```

## 44. Definition of Done — Tela

Uma tela só está concluída quando possui rota, página, componentes, CSS, comportamento, estados, integrações, backend quando necessário, persistência quando necessária, autorização, testes, responsividade, acessibilidade e alinhamento visual ao catálogo.

## 45. Definition of Done — Feature

Uma feature está pronta quando seu fluxo completo funciona:

```text
Usuário → Interface → Componente → Hook → Service → API → Backend → Banco/Firebase → Evento → Notificação → Interface
```

Etapas que não sejam aplicáveis devem ser justificadas.

## 46. Quality Gate

Antes do merge:

```text
Build       PASS
Typecheck   PASS
Tests       PASS
Lint        PASS
Security    PASS
Review      PASS
```

Exceções devem ser documentadas.

## 47. Auditoria das 350 telas

Cada tela deverá possuir:

```text
ID
Rota
Page
Componentes
CSS
API
Backend
Estados
Permissões
Testes
Status
```

Status sugeridos:

```text
PLANNED
IN_PROGRESS
IMPLEMENTED
INTEGRATED
TESTED
READY
BLOCKED
```

## 48. Estratégia de cobertura das 350 telas

Não é necessário criar 350 testes E2E independentes quando componentes e fluxos são compartilhados.

```text
Componente compartilhado → teste próprio
Feature → integração
Fluxo crítico → E2E
Tela simples → validação da composição
```

## 49. Regra contra “funciona na minha máquina”

Uma funcionalidade não é validada somente porque funciona localmente. Deve considerar ambiente, configuração, dependências, banco, Firebase, APIs, build e staging/produção.

## 50. Regra contra tela estática

Não considerar implementação real:

```text
HTML estático
Mock permanente
Botão sem ação
Modal sem persistência
Dados fictícios
Navegação falsa
```

quando a funcionalidade real for exigida.

## 51. Regra para IA

Código criado ou alterado por IA passa pelos mesmos Quality Gates. IA não é justificativa para código não testado, mock permanente, botão sem backend, erro ignorado, componente monolítico, CSS espalhado ou destruição do Firebase.

## 52. Critério final

> **O FLOW somente deve ser considerado pronto quando puder ser utilizado como plataforma real: visualmente consistente, responsivo, componentizado, conectado aos serviços reais, seguro, testado, observável e capaz de evoluir sem depender de mocks ou páginas estáticas.**

## Controle de versão

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 2026-09-04 | Criação do padrão de testes, qualidade e Definition of Done |
