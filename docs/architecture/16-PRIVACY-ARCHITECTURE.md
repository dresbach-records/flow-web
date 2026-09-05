# 16 — PRIVACY ARCHITECTURE (LGPD)

> Status do documento: **vivo**. Referência de maturidade: [How Meta understands data at scale (Meta)](https://engineering.fb.com/2025/04/28/security/how-meta-understands-data-at-scale/).

---

## 1. Princípios

- **Minimização**: só coletar o necessário (dados do cadastro, conteúdo do usuário, analytics).
- **Consentimento**: LGPD versionado e obrigatório antes de usar o app.
- **Controle do usuário**: exportação, bloqueios, desativação, privacidade de perfil.
- **Transparência**: páginas de privacidade e controles públicas.
- **Auditoria**: trilha de acessos administrativos.

## 2. Consentimento (`consent.ts`)

- `CURRENT_CONSENT_VERSION = '1.0.0'`, `CURRENT_DOCUMENT_VERSION = 'v1.0.0-2026'`.
- `consents/{userId}` — doc idempotente (`userId`, `version`, `accepted`, `acceptedAt`).
- Aceite também grava campos no perfil (`acceptedTermsAt`).
- Declínio: registra `declined` e faz logout (`/login?reason=consent_declined`).
- Gate: `TermsGate` (scroll-to-end + checkbox) no `AppShellWrapper`.
- Fallback localStorage `flow.consent.{uid}` apenas em falha de rede.

## 3. Privacy Data Map

| Dado | Quem coleta | Por quê | Onde armazena | Quem acessa | Retenção | Como excluir |
|---|---|---|---|---|---|---|
| Perfil (nome, bio, foto, dados cadastrais CPF/CNPJ/telefone) | Cadastro | Conta e identidade | `users/{uid}` | dono, admin | enquanto a conta existir | exclusão via admin / desativação |
| Credenciais | Firebase Auth | Autenticação | Firebase Auth | Firebase, usuário | conta | exclusão de conta |
| Posts/comentários | Usuário | Conteúdo social | `posts`, comments | autenticados + admin | até remoção | autor/admin removem |
| Mensagens | Usuário | Comunicação privada | `conversations`, `messages` | participantes + admin (auditoria) | até remoção | (sem delete — imutável) |
| Notificações | Sistema | Engajamento | `users/{uid}/notifications` | dono + admin | até remoção | dono deleta |
| Denúncias | Usuário | Moderação | `reports` | autor + admin | conforme política | admin gerencia |
| Logs de auditoria | Admin | Auditoria | `admin_audit` | admin | longo prazo | — |
| Analytics | FLOW/GA4 | Produto | GA4 | time | política GA | GDPR/LGPD controls |
| Push subscriptions | Backend | Notificações | `push_subscriptions` | backend | até opt-out | DELETE endpoint |
| Dados de criador | Criador | Diretório público | `creator_profiles` | público | enquanto ativo | desativar/editar |
| Dados de memorial | Solicitante | Memorial | `memorial_requests`, `tributes` | solicitante + admin | conforme processo | admin/remoção |

## 4. Dados públicos vs privados vs sensíveis

| Classificação | Exemplos | Tratamento |
|---|---|---|
| Público | nome, avatar, bio, comunidades, creator_profiles | visível; `creator_profiles` só campos publicados |
| Privado | perfil (`privateProfile`), mensagens, notificações, salvos | regras de participação/dono |
| Sensível | CPF, CNPJ, data de nascimento, documentos memorial | nunca exibido a terceiros; upload sob path do uid; validação |
| Config | platform_settings, site_pages (públicos), admin_audit (admin) | por regra |

## 5. Controles do usuário

- `SettingsModule` tab **Privacidade & LGPD**:
  - Bloqueados (`listBlockedIds`/`unblockUser`).
  - Consentimento versionado (exibe versões atuais).
  - **Exportação de dados** (JSON real do perfil).
- Perfil privado (`privateProfile`).
- Desativação: telas `/conta/desativada` + recurso.
- Notificações e e-mail: preferências persistidas.

## 6. Auditoria e linhagem

- `admin_audit` — toda ação admin (role change, status, verify, moderation) com `adminUid` real.
- `AdminLogs`/`DeveloperLogs` — leitura da trilha.
- `[PLANEJADO]` linhagem de dados para analytics (data lineage).

## 7. Segurança de dados

- Rules min-privilege (não enumeração: list admin).
- Emails nunca exibidos de terceiros.
- IP de sessão não exibido ("Não exibido por privacidade").
- Segredos nunca no frontend.

## 8. Direitos LGPD

| Direito | Implementação |
|---|---|
| Acesso | exportação JSON + páginas de dados |
| Correção | edição de perfil |
| Exclusão | exclusão via admin (sem delete público destrutivo) |
| Portabilidade | exportação |
| Consentimento | gate versionado + revogação (decline) |
| Oposição | desativação |

## 9. Retenção

- Sem política formal de retenção automatizada. `[PLANEJADO]` definir por tipo (LGPD Art. 15/16).
- Docs do memorial: retenção conforme decisão admin.

## 10. Roadmap

1. **[IMPLEMENTADO]** Consentimento versionado, exportação, bloqueios, perfil privado, auditoria, min-privilege.
2. **[PLANEJADO] P1** — política de retenção automatizada, data lineage, relatório de acessos.
3. **[PLANEJADO] P2** — direito à exclusão assistida self-service, consentimento granular.