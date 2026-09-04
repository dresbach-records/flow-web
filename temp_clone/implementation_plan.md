# Refatoração Estrutural do Design System e do Layout Global FLOW (Desktop / Light UI)

## Contexto e Diagnóstico

A auditoria visual e técnica comprovou a causa exata das inconsistências observadas na interface:
1. **Navegação duplicada no centro da página**: Componentes de página (`SocialFeed.tsx`, `ProfilePage.tsx`, `ScheduleCenter.tsx` e `CreatorCenter.tsx`) foram inicialmente construídos com cabeçalhos (`flow-social-header`) e sidebars (`flow-social-sidebar`) internos embutidos. Quando envolvidos pelo layout global externo (`AppLayout`), essas páginas passaram a renderizar uma segunda barra de navegação no centro do conteúdo e cabeçalhos sobrepostos.
2. **Presença indevida de Dark Mode**: O `Sidebar.tsx`, `SocialFeed.tsx` e diversos seletores CSS (`[data-theme="dark"]`, `--bg: #070d16;`, classes escuras) continham toggles e variáveis de tema escuro, violando a diretriz explícita da plataforma de que **o FLOW não terá Dark Mode** e deve ser **estritamente Light UI**.
3. **Inconsistências no AppShell**: Falta de uma fonte única e canônica para o grid de layout desktop, proporções da sidebar, altura da topbar e modularização do Right Rail.

Este plano corrige a causa arquitetural na raiz, sem remendos visuais.

---

## User Review Required

> [!IMPORTANT]
> **Light UI Exclusivo**: Todas as referências a Dark Mode (toggles, botões "Modo escuro", classes e tokens escuros) serão permanentemente removidas do código e da interface. O atributo `data-theme` será fixado em `light`.

> [!IMPORTANT]
> **Eliminação de Menus Internos Redundantes**: As barras laterais e cabeçalhos duplicados que estavam aninhados dentro de `SocialFeed.tsx`, `ProfilePage.tsx`, `CreatorCenter.tsx` e `ScheduleCenter.tsx` serão eliminados. A Sidebar e a Topbar serão responsabilidade única e exclusiva do `AppShell`.

---

## Proposed Changes

### 1. Design System & Tokens (Fonte Única da Verdade)

#### [MODIFY] [design-tokens.css](file:///f:/Flow/flow-web/src/styles/design-tokens.css)
- Remover todos os blocos `:root[data-theme="dark"]` e variáveis com cores pretas/escuras.
- Consolidar a paleta oficial Light UI FLOW:
  - Fundo geral: `#F8FAFC` (branco levemente azulado)
  - Superfícies / Cards: `#FFFFFF`
  - Bordas: `#E2E8F0` / `#EDF2F7` (1px suave e sutil)
  - Texto principal: `#0F172A` (azul-marinho profundo)
  - Texto secundário: `#475569` (cinza-azulado) e `#64748B`
  - Azul institucional: `#3B82F6` / `#4F7FFF`
  - Acento e ações: `#06B6D4` / `#20D9D2` (ciano)
  - Gradiente FLOW da marca: `linear-gradient(135deg, #4F7FFF 0%, #8B5CF6 50%, #D946EF 100%)` (aplicado apenas em marcas, CTAs e destaque, sem sobrecarregar a UI)
- Consolidar tokens oficiais de espaçamento:
  - `--flow-space-1: 4px;`
  - `--flow-space-2: 8px;`
  - `--flow-space-3: 12px;`
  - `--flow-space-4: 16px;`
  - `--flow-space-5: 20px;`
  - `--flow-space-6: 24px;`
  - `--flow-space-8: 32px;`
- Padronizar sombras sutis (`0 1px 3px rgba(15,23,42,0.04)`) e raios de borda consistentes (`--flow-radius-sm: 6px;` a `--flow-radius-xl: 18px;`).

#### [MODIFY] [flow-brand.css](file:///f:/Flow/flow-web/src/flow-brand.css)
- Eliminar regras de `[data-theme="dark"]`.
- Alinhar todos os componentes aos tokens canônicos de `design-tokens.css`.

---

### 2. Arquitetura Canônica do AppShell (`src/components/layout/`)

#### [NEW] [AppShell.tsx](file:///f:/Flow/flow-web/src/components/layout/AppShell.tsx)
- Shell unificado para todas as telas autenticadas e de aplicação:
  - Topbar no topo (largura total, alinhada e com altura fixa de 64px)
  - Sidebar à esquerda (largura fixa e proporcional de 240px)
  - Área de conteúdo central (`flex: 1`, com largura máxima e padding controlado)
  - Slot opcional de `RightRail`
  - `BottomNav` tátil para mobile
  - `FloatingPlayer` persistente entre trocas de páginas

#### [NEW] [Sidebar.tsx](file:///f:/Flow/flow-web/src/components/layout/Sidebar.tsx)
- Sidebar proporcional, moderna e limpa:
  - Logotipo FLOW no topo
  - Botão "+ Criar" em destaque
  - Links de navegação principais (Início, Explorar, Shorts, Música, Mensagens, Notificações, Comunidades, Perfil, Salvos, Segurança, Configurações, Memorial)
  - Estados active e hover padronizados
  - Rodapé com avatar, nome do usuário e botão "Sair"
  - **SEM "Modo escuro", SEM switches de tema escuro**

#### [NEW] [Topbar.tsx](file:///f:/Flow/flow-web/src/components/layout/Topbar.tsx)
- Topbar consistente e sem cortes:
  - Campo de busca espaçoso e com ícone alinhado
  - Ações rápidas (Criar, Mensagens, Notificações com badge)
  - Avatar do usuário
  - Conteúdo alinhado verticalmente

#### [NEW] [RightRail.tsx](file:///f:/Flow/flow-web/src/components/layout/RightRail.tsx)
- Componente desacoplado e reutilizável para a coluna direita opcional (renderizado somente em páginas como Feed social, com Sugestões, Tendências, Quem Seguir e FLOW Guardian).

#### [NEW] [PageContainer.tsx](file:///f:/Flow/flow-web/src/components/layout/PageContainer.tsx)
- Container padrão para páginas, assegurando `max-width`, espaçamento vertical e horizontal padronizados, sem áreas vazias desnecessárias.

#### [MODIFY] [src/layouts/index.ts](file:///f:/Flow/flow-web/src/layouts/index.ts)
- Re-exportar os novos componentes de layout de `src/components/layout/` garantindo total retrocompatibilidade e evitando código duplicado.

---

### 3. Remoção de Menus Duplicados e Limpeza das Páginas

#### [MODIFY] [SocialFeed.tsx](file:///f:/Flow/flow-web/src/app/SocialFeed.tsx)
- **Remover** o `<header className="flow-social-header">` interno.
- **Remover** o `<aside className="flow-social-sidebar">` interno (que causava o menu duplicado no meio da tela e o toggle "Modo escuro").
- Manter o conteúdo real do feed (abas "Para você" / "Seguindo", Composer de postagem, Stories, feed de posts e modais).
- Delegar a coluna lateral direita para o `RightRail`.

#### [MODIFY] [ProfilePage.tsx](file:///f:/Flow/flow-web/src/app/ProfilePage.tsx)
- **Remover** o `<header className="flow-social-header">` interno e a sidebar aninhada.
- Refatorar o CSS para utilizar cores claras oficiais em vez de variáveis pretas hardcoded (`--bg: #070d16;`).

#### [MODIFY] [CreatorCenter.tsx](file:///f:/Flow/flow-web/src/app/CreatorCenter.tsx) e [ScheduleCenter.tsx](file:///f:/Flow/flow-web/src/app/ScheduleCenter.tsx)
- Remover cabeçalhos e barras laterais internas redundantes, integrando seus conteúdos diretamente no `PageContainer` do `AppShell`.

#### [MODIFY] [main.tsx](file:///f:/Flow/flow-web/src/main.tsx) e [App.tsx](file:///f:/Flow/flow-web/src/App.tsx)
- Fixar `document.documentElement.dataset.theme = 'light';` definitivamente no bootstrap.
- Roteamento limpo integrando todas as rotas de `/app/*` e `/memorial/*` ao novo `AppShell`.

---

## Verification Plan

### Testes Automatizados & Integridade
1. `pnpm install --frozen-lockfile` (garantir lockfile estritamente sincronizado).
2. `pnpm build` (`tsc -b && vite build` com 0 erros de tipos e empacotamento).
3. `git diff --check` (garantir ausência de conflitos, whitespaces espúrios ou quebras).
4. `git status` (confirmar que nenhum arquivo fora de `F:\Flow\flow-web` foi tocado).

### Validação Visual e de Rotas
Verificar a resposta HTTP e a renderização das telas-chave:
- `/login`, `/cadastro`, `/recuperar-senha` (Autenticação Light UI)
- `/app` (Feed principal com AppShell limpo, sem sidebar no meio da tela)
- `/app/explorar`, `/app/criar`, `/app/mensagens`, `/app/comunidades`
- `/app/perfil` (Perfil no padrão Light UI)
- `/app/configuracoes` (Configurações sem opção de Dark Mode)
- `/app/memorial` (Memorial do Usuário integrado ao mesmo AppShell)
