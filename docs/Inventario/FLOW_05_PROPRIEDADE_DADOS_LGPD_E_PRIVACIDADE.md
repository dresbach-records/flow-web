# FLOW — DADOS, LGPD, PRIVACIDADE E GOVERNANÇA DE DADOS

**Documento:** FLOW_05_PROPRIEDADE_DADOS_LGPD_E_PRIVACIDADE.md  
**Versão:** 1.0  
**Status:** Documento-base de governança de dados e privacidade  
**Projeto:** FLOW  
**Estrutura empresarial informada:** DEEVO SOLUÇÕES FINANCEIRAS LTDA / FLOW SERVIÇOS ONLINE LTDA em processo de transição operacional e jurídica  
**CNPJ informado nos documentos fornecidos:** 63.187.175/0001-70  
**Administrador informado:** Marcos Vinicius Dresbach do Amaral

> **IMPORTANTE:** este documento é uma especificação de governança e arquitetura de privacidade. Não substitui Política de Privacidade, Aviso de Cookies, Termos de Uso, contratos, registros de tratamento, relatórios de impacto ou orientação jurídica especializada. A identificação definitiva de controlador, operador, encarregado e demais papéis deve ser formalizada conforme cada operação de tratamento.

---

## 1. Objetivo

Estabelecer regras para coleta, uso, armazenamento, transmissão, proteção, retenção, eliminação e governança dos dados utilizados pelo FLOW.

O objetivo é permitir que a rede social e seus serviços funcionem de forma segura, rastreável e compatível com a legislação aplicável, especialmente a Lei Geral de Proteção de Dados Pessoais — LGPD.

## 2. Princípios

O tratamento deverá observar, conforme aplicabilidade:

- finalidade;
- adequação;
- necessidade;
- livre acesso;
- qualidade dos dados;
- transparência;
- segurança;
- prevenção;
- não discriminação;
- responsabilização e prestação de contas.

## 3. Categorias de dados

O FLOW poderá tratar, conforme funcionalidades efetivamente disponibilizadas:

### Dados cadastrais

- nome;
- e-mail;
- telefone;
- data de nascimento, quando necessária;
- informações fornecidas pelo usuário.

### Dados de autenticação

- identificadores de conta;
- provedor de autenticação;
- identificadores técnicos;
- registros de sessão.

Senhas não deverão ser armazenadas em texto puro.

### Dados de perfil

- foto;
- nome de exibição;
- biografia;
- interesses;
- informações públicas escolhidas pelo usuário;
- configurações.

### Conteúdo

- publicações;
- comentários;
- reações;
- mensagens;
- mídias;
- arquivos;
- comunidades;
- conteúdos enviados pelo usuário.

### Dados técnicos

- IP;
- navegador;
- dispositivo;
- sistema operacional;
- logs;
- identificadores técnicos;
- informações de conectividade.

A coleta deve ser limitada ao necessário para a finalidade definida.

## 4. Dados sensíveis

O FLOW não deverá solicitar ou processar dados pessoais sensíveis sem necessidade e base legal apropriada.

Quando uma funcionalidade exigir tratamento dessa natureza, deverá existir análise específica de:

- finalidade;
- necessidade;
- base legal;
- segurança;
- acesso;
- retenção;
- risco.

## 5. Crianças e adolescentes

Funcionalidades destinadas ou acessíveis a crianças e adolescentes deverão possuir avaliação específica de privacidade e segurança.

O produto deverá aplicar medidas adequadas à faixa etária e à finalidade.

## 6. Cadastro

O cadastro deverá coletar somente informações necessárias para criação e funcionamento da conta.

Fluxo conceitual:

```text
Cadastro
   ↓
Validação
   ↓
Criação de identidade
   ↓
Registro da conta
   ↓
Consentimentos/termos aplicáveis
   ↓
Login
   ↓
Liberação conforme regras
```

## 7. Cadastro por Google ou outro provedor

Quando o usuário utilizar autenticação externa:

- o FLOW deverá receber somente os dados disponibilizados pelo provedor;
- deverá mapear os dados para seu modelo interno;
- deverá registrar o identificador externo necessário;
- não deverá solicitar credenciais do provedor;
- deverá continuar aplicando as regras de termos e consentimentos do FLOW.

## 8. Consentimento

Quando determinado tratamento depender de consentimento, o sistema deverá registrar evidência suficiente para demonstrar:

- versão do documento;
- data e hora;
- identificação da conta;
- ação realizada;
- contexto;
- versão aplicável;
- status.

O sistema não deve tratar um simples estado visual no navegador como prova suficiente.

## 9. Contrato/Termos após cadastro

Para o fluxo definido para o FLOW:

```text
Cadastro concluído
       ↓
Login
       ↓
Verificação de aceite obrigatório
       ↓
Contrato apresentado
       ↓
Usuário lê
       ↓
Checkbox de confirmação
       ↓
Aceite
       ↓
Registro no backend
       ↓
Liberação da rede social
```

## 10. Recusa do aceite

Caso o aceite seja requisito obrigatório para acesso:

```text
Usuário recusa
      ↓
Sessão encerrada
      ↓
Mensagem:
"É necessário o aceite para continuar.
Caso não aceite, sua sessão será encerrada."
      ↓
Retorno ao login
```

O backend deve impedir acesso posterior às funcionalidades protegidas enquanto a condição obrigatória permanecer pendente.

## 11. Registro de aceite

A estrutura poderá conter, conforme o modelo de dados:

```text
user_id
document_type
document_version
accepted
accepted_at
ip
user_agent
created_at
```

Os campos efetivos deverão ser definidos de acordo com necessidade, segurança e minimização.

## 12. Revogação

Quando o consentimento for a base legal aplicável e puder ser revogado, o sistema deverá oferecer mecanismo adequado para essa revogação.

A revogação não significa necessariamente apagar todo e qualquer registro cuja retenção seja exigida por outra obrigação legal.

## 13. Bases legais

Cada finalidade de tratamento deverá possuir base legal definida antes de sua implementação em produção.

Não utilizar "consentimento" automaticamente para toda operação.

A base legal deverá ser avaliada de acordo com a finalidade concreta.

## 14. Inventário de tratamento

O FLOW deverá manter inventário das principais operações:

| Processo | Dados | Finalidade | Base legal | Acesso | Retenção |
|---|---|---|---|---|---|
| Cadastro | Identificação | Criar conta | A definir | Sistemas autorizados | Definida por política |
| Login | Autenticação | Acesso | A definir | Auth | Definida por política |
| Feed | Conteúdo | Rede social | A definir | Conforme visibilidade | Definida |
| Mensagens | Conteúdo | Comunicação | A definir | Participantes/autorizados | Definida |
| Moderação | Conteúdo/logs | Segurança | A definir | Moderação | Definida |
| Analytics | Eventos | Métricas | A definir | Analytics autorizado | Definida |

## 15. Controlador e operador

A definição dos papéis de controlador e operador deverá considerar cada operação e relação contratual.

A transição DEEVO/FLOW não deve gerar presunção automática de que uma empresa é controladora de todos os dados.

Os contratos deverão esclarecer:

- quem determina finalidade;
- quem executa tratamento;
- quem possui acesso;
- quem responde por cada atividade;
- quais serviços são terceirizados.

## 16. Compartilhamento

O compartilhamento de dados deverá ocorrer somente quando houver finalidade e fundamento adequados.

Exemplos:

- provedores de autenticação;
- hospedagem;
- armazenamento;
- analytics;
- suporte;
- serviços de comunicação;
- ferramentas de segurança.

Cada terceiro relevante deverá ser avaliado.

## 17. Suboperadores

Fornecedores que processem dados em nome da operação deverão ser inventariados.

Avaliar:

- localização;
- segurança;
- contrato;
- finalidade;
- subcontratação;
- retenção;
- exclusão;
- incidentes.

## 18. Firebase

O uso de Firebase deverá ser tratado como componente de infraestrutura e não como substituto da governança de privacidade.

Devem ser revisados:

- Authentication;
- Firestore;
- Storage;
- regras de segurança;
- logs;
- permissões;
- regiões;
- integrações;
- retenção.

## 19. Banco de dados

O banco deverá aplicar:

- menor privilégio;
- autenticação forte;
- segregação;
- backups;
- criptografia quando aplicável;
- logs;
- controle de acesso.

## 20. Ambiente de desenvolvimento

Dados reais de usuários não deverão ser utilizados em desenvolvimento sem necessidade e controles apropriados.

Preferir:

- dados sintéticos;
- anonimização;
- mascaramento;
- ambientes separados.

## 21. Logs

Logs devem registrar informações suficientes para operação e segurança sem armazenar dados pessoais desnecessários.

Evitar colocar em logs:

- senha;
- token;
- segredo;
- dados completos de cartão;
- informações pessoais desnecessárias.

## 22. Monitoramento

O FLOW deverá possuir mecanismos para detectar:

- login anormal;
- abuso;
- tentativa de acesso indevido;
- falhas;
- alterações administrativas;
- incidentes.

## 23. Segurança por padrão

Toda nova funcionalidade deverá responder:

1. Que dados coleta?
2. Por que coleta?
3. Quem acessa?
4. Onde armazena?
5. Por quanto tempo?
6. Como elimina?
7. Como protege?
8. O usuário precisa ser informado?
9. Qual base legal?
10. Existe risco relevante?

## 24. Direitos dos titulares

O sistema e os processos de atendimento deverão permitir tratamento das solicitações cabíveis, incluindo, conforme aplicabilidade:

- confirmação;
- acesso;
- correção;
- anonimização;
- bloqueio;
- eliminação;
- portabilidade;
- informação sobre compartilhamento;
- revogação de consentimento;
- oposição quando aplicável.

A viabilidade e forma de cada solicitação dependerão da base legal e das hipóteses legais de retenção.

## 25. Portal de privacidade

Recomenda-se disponibilizar área específica para:

- consultar dados;
- alterar dados;
- gerenciar privacidade;
- revisar consentimentos;
- solicitar direitos;
- excluir conta quando aplicável.

## 26. Exclusão de conta

A exclusão deverá possuir fluxo controlado.

```text
Solicitação
 ↓
Confirmação
 ↓
Validação
 ↓
Análise de retenções obrigatórias
 ↓
Exclusão/anonimização
 ↓
Revogação de acesso
 ↓
Registro da operação
```

## 27. Retenção

Não manter dados indefinidamente sem finalidade.

A política deverá definir prazos ou critérios para:

- conta ativa;
- conta inativa;
- conteúdo;
- mensagens;
- logs;
- backups;
- registros de segurança;
- consentimentos;
- obrigações legais.

## 28. Backups

A exclusão lógica de dados não significa necessariamente remoção imediata de todos os backups.

A política de backup deverá definir:

- retenção;
- expiração;
- restauração;
- sobrescrita;
- proteção;
- acesso.

## 29. Conteúdo publicado

O FLOW deverá definir, em seus termos e políticas, regras sobre:

- conteúdo público;
- conteúdo privado;
- compartilhamento;
- exclusão;
- denúncias;
- moderação;
- cópias em cache;
- conteúdo de terceiros.

## 30. Mensagens privadas

Mensagens deverão ser tratadas como conteúdo potencialmente privado, com controles de acesso adequados.

A equipe interna não deve possuir acesso indiscriminado.

Acesso administrativo excepcional deverá possuir justificativa e rastreabilidade.

## 31. Moderação

A plataforma deverá possuir mecanismos para:

- denúncia;
- análise;
- bloqueio;
- remoção;
- recurso;
- registro;
- escalonamento.

## 32. Administradores

Administradores devem possuir acesso mínimo necessário.

Recomenda-se:

- MFA;
- RBAC;
- logs;
- sessões controladas;
- revisão periódica de permissões.

## 33. Dados de administração

O painel administrativo não deverá exibir automaticamente todos os dados pessoais.

Cada tela deve mostrar somente aquilo que a função administrativa exige.

## 34. Incidentes de segurança

Em caso de incidente:

```text
Detectar
 ↓
Conter
 ↓
Investigar
 ↓
Avaliar impacto
 ↓
Preservar evidências
 ↓
Corrigir
 ↓
Comunicar conforme obrigação aplicável
 ↓
Documentar
 ↓
Prevenir recorrência
```

## 35. Plano de resposta

Deverão existir procedimentos para:

- credencial comprometida;
- vazamento;
- ransomware;
- exclusão acidental;
- acesso indevido;
- indisponibilidade;
- exposição de dados;
- falha de fornecedor.

## 36. Criptografia

Informações sensíveis deverão possuir proteção adequada em trânsito e, quando necessário, em repouso.

Não implementar criptografia própria sem necessidade quando soluções consolidadas estiverem disponíveis.

## 37. Segredos

Segredos não devem ser armazenados em:

- Git;
- frontend;
- screenshots;
- documentação pública;
- tickets públicos;
- mensagens sem proteção.

## 38. Cookies

Cookies e tecnologias similares deverão ser documentados de acordo com suas finalidades.

Separar, quando aplicável:

- necessários;
- preferências;
- analytics;
- marketing.

## 39. Analytics

Eventos devem ser minimizados.

Não enviar dados pessoais para analytics sem necessidade e fundamento adequado.

## 40. Publicidade

Recursos publicitários deverão possuir avaliação específica de:

- dados utilizados;
- perfilamento;
- consentimento quando aplicável;
- terceiros;
- cookies;
- transparência.

## 41. IA

Dados enviados a serviços de IA devem obedecer:

- finalidade;
- minimização;
- segurança;
- contratos;
- políticas;
- restrições de fornecedor.

Dados pessoais não devem ser enviados simplesmente porque uma ferramenta facilita o desenvolvimento.

## 42. Desenvolvimento com IA

Durante desenvolvimento:

- utilizar dados sintéticos;
- remover PII de exemplos;
- não colocar secrets em prompts;
- revisar código;
- verificar dependências.

## 43. Privacidade desde a concepção

Toda nova feature deverá incorporar privacidade desde o desenho.

Exemplo:

```text
Feature
 ↓
Dados necessários
 ↓
Finalidade
 ↓
Base legal
 ↓
Acesso
 ↓
Segurança
 ↓
Retenção
 ↓
UX de privacidade
 ↓
Implementação
```

## 44. Privacy by Default

As configurações padrão deverão priorizar proteção adequada do usuário.

Quando uma escolha pública ou de compartilhamento for opcional, não assumir exposição máxima sem justificativa.

## 45. Privacy by Design

Produto, engenharia, design, segurança e jurídico deverão considerar privacidade antes de funcionalidades de alto risco serem disponibilizadas.

## 46. Avaliação de impacto

Funcionalidades com risco elevado deverão ser avaliadas antes do lançamento.

Exemplos:

- perfilamento;
- reconhecimento;
- grandes volumes de dados;
- localização;
- dados sensíveis;
- monitoramento;
- automação de decisões relevantes.

## 47. Transferência internacional

Quando fornecedores ou infraestrutura envolverem transferência internacional de dados, a operação deverá ser analisada e documentada conforme a legislação aplicável.

## 48. Auditoria

Periodicamente revisar:

- permissões;
- dados coletados;
- integrações;
- fornecedores;
- logs;
- retenção;
- consentimentos;
- políticas;
- segurança.

## 49. Documentos relacionados

Este documento deverá ser complementado por:

- Política de Privacidade;
- Política de Cookies;
- Termos de Uso;
- Política de Segurança;
- Política de Retenção;
- Procedimento de Direitos dos Titulares;
- Plano de Resposta a Incidentes;
- contratos com operadores;
- registros de tratamento.

## 50. Regra final

> **O FLOW deve coletar e tratar somente os dados necessários para operar suas funcionalidades, proteger esses dados durante todo o ciclo de vida e permitir que a governança acompanhe a evolução da plataforma.**

A conformidade não será tratada como uma página isolada do site. Ela deverá estar incorporada ao frontend, backend, banco, infraestrutura, painel administrativo, processos internos e atendimento.

---

## Controle de versão

| Versão | Data | Alteração |
|---|---|---|
| 1.0 | 2026-09-04 | Criação do documento de dados, LGPD e privacidade |
