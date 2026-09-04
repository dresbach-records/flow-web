# Plano de Implementação Master — FLOW Platform

## Protocolo de Continuidade e Status

**WORKSPACE**: `F:\Flow\flow-web`  
**FASE**: FASE 2 — Dependências e Sincronização do Lockfile (PNPM)  
**STATUS**: EM EXECUÇÃO  
**DATA**: 2026-09-04  
**ÚLTIMA OPERAÇÃO**: Criação de `.npmrc` com `node-linker=hoisted` para compatibilidade com sistema de arquivos exFAT da unidade `F:`, resolvendo o erro `ERR_PNPM_EISDIR` (ausência de suporte a symlinks no exFAT).  
**ARQUIVOS ALTERADOS**:
- `F:\Flow\flow-web\.npmrc` (novo: `node-linker=hoisted`)
- `F:\Flow\flow-web\implementation_plan.md` (novo: registro oficial no workspace do projeto)
**FUNCIONALIDADES IMPLEMENTADAS**: FASE 1 (Auditoria integral do repositório, configuração Firebase, regras Firestore/Storage, scripts e inventário oficial das 350 telas) concluída.  
**BUILD**: Pendente de validação pós-instalação das dependências (`pnpm build`).  
**TESTES**: Pendente.  
**FIREBASE**:
- VITE_FIREBASE_API_KEY: PRESENTE
- VITE_FIREBASE_AUTH_DOMAIN: PRESENTE
- VITE_FIREBASE_PROJECT_ID: PRESENTE
- VITE_FIREBASE_STORAGE_BUCKET: PRESENTE
- VITE_FIREBASE_MESSAGING_SENDER_ID: PRESENTE
- VITE_FIREBASE_APP_ID: PRESENTE
- Diagnóstico do Erro `auth/invalid-api-key`: FASE 3 tratará da injeção segura e resiliente das variáveis de ambiente no frontend.  
**PNPM**: `pnpm@10.32.1` configurado com `node-linker=hoisted` para unidade exFAT `F:`.  
**PRÓXIMA TAREFA**: Executar `pnpm install`, atualizar e congelar lockfile, validar `pnpm install --frozen-lockfile` e validar `pnpm build`.  
**PENDÊNCIAS**:
1. Concluir FASE 2 (Lockfile sincronizado e build limpo).
2. FASE 3: Correção e validação do Firebase Auth sem mascarar erros e sem expor credenciais.
3. FASE 4: Módulo de Autenticação completo (Google Login + Email/Senha com fluxos 2FA e recuperação).
4. FASE 5: Design System oficial FLOW (tokens HSL/CSS variables, modo claro nativo, responsividade total).
5. FASE 6: Layout Global da plataforma (Sidebar, Topbar, Bottombar móvel, Player de áudio).
6. FASES 7 a 10: Implementação das 350 telas do inventário oficial (`docs/INVENTARIO_350_TELAS.json`).
