# Contribuindo com o Flow

Obrigado pelo interesse em contribuir com a FLOW!

Este projeto está em **fase inicial de desenvolvimento** e busca pessoas com interesse genuíno em construir uma plataforma social real.

## Onde começar

- Leia o [`README.md`](README.md) e o [`docs/FLOW_ENGINEERING_MASTER_PLAN.md`](docs/FLOW_ENGINEERING_MASTER_PLAN.md).
- Consulte a arquitetura em [`docs/architecture/`](docs/architecture/).
- Veja o roadmap e os gaps em [`docs/architecture/45-ROADMAP.md`](docs/architecture/45-ROADMAP.md) e [`docs/architecture/44-GAP-ANALYSIS.md`](docs/architecture/44-GAP-ANALYSIS.md).
- Preencha o formulário de interesse em **[/contribua](https://flowsocial.fun/contribua)** para a equipe entrar em contato.

## Como trabalhamos

- Desenvolvimento organizado via **GitHub**: módulos, Issues, Pull Requests, revisão de código e acompanhamento do roadmap.
- Transparência: o que está sendo construído → quem está trabalhando → o que está pronto → o que está bloqueado → o que vem depois.

## Regras de desenvolvimento

1. **Zero mock / zero static funcional.** Se não existe backend/API/persistência, a UI deve mostrar estados vazios honestos — nunca dados falsos.
2. **Regra de conclusão.** Uma funcionalidade só está concluída com fluxo ponta-a-ponta (UI → serviço → persistência → autorização → estados → testes).
3. **Autorização real no servidor.** Nunca confie apenas no frontend (Firestore Rules + backend).
4. **Camadas.** `services/` é a única fronteira de integração. Componentes não chamam Firestore diretamente.
5. **Componentização.** Cada componente com responsabilidade, interface, CSS e exportação próprios (`Component/Component.tsx + .css + .types.ts + index.ts`).
6. **Não quebrar o que funciona.** Não alterar a Home, não remover funcionalidades existentes, não fazer refatorações amplas sem necessidade.
7. **Sem segredos.** Nunca versionar `.env`, service accounts, chaves privadas, tokens ou senhas.
8. **Validação.** Antes de qualquer merge: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`.

## Comandos

```bash
pnpm install
pnpm dev               # frontend em http://localhost:3000
pnpm lint              # tsc -b
pnpm typecheck         # tsc -b
pnpm test              # vitest
pnpm build             # vite build
cd backend && npm install && npm run dev   # API em http://localhost:8080
```

## Transparência

O Flow está em fase de desenvolvimento e **não possui orçamento** para contratação tradicional de equipe. A participação nesta etapa ocorre por iniciativa e interesse do próprio colaborador e **não constitui, por si só**, promessa de emprego, salário, sociedade ou remuneração futura. Caso o projeto alcance viabilidade comercial e sejam criados mecanismos de remuneração ou parceria, as condições serão discutidas individualmente e formalizadas em instrumentos próprios.

Não queremos criar expectativas com promessas informais — queremos construir relações transparentes **desde o primeiro commit**.

© 2026 Flow Serviços Online LTDA. Todos os direitos reservados.