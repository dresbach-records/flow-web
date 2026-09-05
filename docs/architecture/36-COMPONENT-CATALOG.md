# 36 — COMPONENT CATALOG

> Catálogo de componentes reutilizáveis em `src/components/`. Status: **vivo**.

---

## 1. Padrões

- **Completo** (`.tsx + .css + .types.ts + index.ts`): AuthLayout*, CreatorMetric, CreatorOverview, CreatorVideoRow, ProfileHeader, ProfilePostCard, ProfileTabs, ScheduleCalendar, ScheduleComposer, ScheduleDetails, ScheduleList, CommentsPanel, FeedTabs, PostCard, PostComposer, StoriesRail (*sem css).
- **Pasta sem types.ts** (tipos inline): todos os layout, todos os site, TermsGate, ui (EmptyState/ErrorState/LoadingState/UserAvatar).
- **Mínimo** (`.tsx + index.ts`): CreatorCreateModal, CreatorFollowers, CreatorIncome, CreatorPosts, CreatorTools, StoriesComposer, InstallAppPrompt, OfflineNotice.
- **Monolítico (single file)**: `moderation/ReportDialog.tsx`, `system/AppErrorBoundary.tsx`.

## 2. auth

| Componente | Finalidade | Dados | CSS |
|---|---|---|---|
| `AuthLayout` | shell 2 colunas de login | presentacional | usa `app/auth.css` |
| `TermsGate` | gate de termos (scroll+checkbox, versionado) | real (consent via props) | próprio |

## 3. creator

| Componente | Finalidade | Dados |
|---|---|---|
| `CreatorCreateModal` | "o que publicar?" (4 opções) | navegação |
| `CreatorFollowers` | contagem de seguidores; charts "em implementação" | real via prop |
| `CreatorIncome` | monetização (honest R$0,00) | estático honesto |
| `CreatorMetric` | card de métrica | presentacional |
| `CreatorOverview` | dashboard (4 métricas + chart) | real via props |
| `CreatorPosts` | painel de posts/performance | real via props |
| `CreatorTools` | grade de ações do criador | estático (menu) |
| `CreatorVideoRow` | linha de vídeo | presentacional |

## 4. layout

| Componente | Finalidade | Dados |
|---|---|---|
| `AppShell` | shell canônico (topbar/sidebar/main/rail/bottomnav/player) | presentacional |
| `PageContainer` | container padrão | presentacional |
| `RightRail` | sugestões (comunidades + trending hashtags) | **real** |
| `Sidebar` | nav esquerda (8 itens) | presentacional |
| `Topbar` | busca, criar, ações, chip do usuário | **real** (user) |

## 5. profile

| Componente | Finalidade | Dados |
|---|---|---|
| `ProfileHeader` | capa, avatar, ações, stats | **real** (follow) |
| `ProfilePostCard` | card de post do perfil | via props |
| `ProfileTabs` | abas Publicações/Mídia/Curtidas | presentacional |

## 6. schedule

| Componente | Finalidade | Dados |
|---|---|---|
| `ScheduleCalendar` | calendário mensal de agendamentos | via props |
| `ScheduleComposer` | criar agendamento | **real** (`createSchedule`) |
| `ScheduleDetails` | detalhe + ações (publicar agora/cancelar/duplicar/excluir) | **real** |
| `ScheduleList` | lista tabular | via props |

## 7. site

| Componente | Finalidade | Dados |
|---|---|---|
| `BenefitsBar` | faixa de benefícios | estático |
| `CTAButton` | botão CTA (variants) | presentacional |
| `CommunitiesSection` | grid de comunidades | **real** |
| `CommunityCard` | card de comunidade | via props |
| `DownloadSection` | instalação PWA | **real** (`usePwaInstall`) |
| `FeatureCard` | card de feature (navegação) | presentacional |
| `FeaturesSection` | 4 feature cards | estático |
| `HeroSection` | hero da landing | estático (ilustração) |
| `InstallAppPrompt` | prompt de instalação PWA | **real** (`beforeinstallprompt`) |
| `NewsletterForm` | newsletter | **real** (`subscribeNewsletter`) |
| `SectionHeading` | título de seção | presentacional |
| `SiteFooter` | footer + newsletter | estático |
| `SiteHeader` | header público | estático |
| `StatsSection` | estatísticas da plataforma | **real** (`getPlatformStats`) |

## 8. social

| Componente | Finalidade | Dados |
|---|---|---|
| `CommentsPanel` | lista + comentar + responder + excluir | **real** |
| `FeedTabs` | abas do feed | presentacional |
| `PostCard` | card de post + ações + denúncia | via props (denúncia real) |
| `PostComposer` | composer (ações delegam) | presentacional |
| `StoriesComposer` | criar story real (upload + 24h) | **real** |
| `StoriesRail` | faixa de stories | via props |

## 9. moderation / system / ui

| Componente | Finalidade | Dados |
|---|---|---|
| `ReportDialog` | denúncia de post | **real** (`POST /api/v1/reports`) |
| `AppErrorBoundary` | error boundary global | infra |
| `LoadingState` | loading | presentacional |
| `EmptyState` | vazio | presentacional |
| `ErrorState` | erro + retry | presentacional |
| `OfflineNotice` | pill offline/online | browser events |
| `UserAvatar` | avatar + fallback inicial | presentacional |

## 10. Estatísticas

- Total: **49 componentes** em `src/components/` (contando cada pasta).
- Com dados reais (parcial/total): ~15.
- Puramente presentacionais/estáticos: ~30.
- Dívidas: `ReportDialog` e `AppErrorBoundary` monolíticos; `AuthLayout` sem css próprio; `StoriesComposer` sem types separado.

## 11. Recomendações

1. Migrar `ReportDialog`/`AppErrorBoundary` para padrão de pasta.
2. Adicionar testes de componente (ver `24-TESTING-STRATEGY.md`).
3. Criar catálogo visual (Storybook) `[PLANEJADO]`.