# 33 — COMPLIANCE

> Status do documento: **vivo**. Foco: LGPD (Brasil) e boas práticas de rede social.

---

## 1. LGPD — status

| Requisito | Implementação |
|---|---|
| Base legal / consentimento | ✔ gate versionado (`consents`), aceite/declínio, registro |
| Direitos do titular (acesso/correção/exclusão/portabilidade) | parcial — exportação JSON, edição de perfil, exclusão via admin `[PARCIAL]` |
| Minimização | ✔ dados essenciais |
| Segurança | ✔ rules min-privilege, TLS |
| Notificação de incidente | `[NÃO IMPLEMENTADO]` (runbook em `34-INCIDENT-RESPONSE.md`) |
| DPO/encarregado | `[NÃO IMPLEMENTADO]` (contato via `/contato`) |
| Relatório de impacto (RIPD) | `[NÃO IMPLEMENTADO]` |
| Registro de tratamento | `[PLANEJADO]` (data governance) |

## 2. Termos e políticas

- Páginas públicas: `/termos`, `/termos/versoes`, `/privacidade`, `/privacidade/configuracoes`, `/seguranca`, `/seguranca/conta` (conteúdo estático editorial).
- `TermsGate` exige scroll+checkbox e versionamento (`CURRENT_DOCUMENT_VERSION`).
- Versionamento de documentos: `CURRENT_CONSENT_VERSION`.

## 3. Moderação e conteúdo

- Diretrizes de comunidade (referenciadas nas telas).
- Denúncia e recurso.
- Políticas de marketplace (commerce) — proibição de produtos.
- Responsabilidade intermediária (Marco Civil): canal de denúncia + remoção + recurso `[PARCIAL]`.

## 4. Acessibilidade e ética

- Acessibilidade básica (aria, teclado no player).
- IA (Guardian/persona): `discloseAi:true` nas personas; política de transparência `[PLANEJADO]`.
- Viés algorítmico: mitigar no ranking (diversidade).

## 5. Relatórios de transparência

- `[NÃO IMPLEMENTADO]` relatórios semestrais de remoções.

## 6. Roadmap

1. **[IMPLEMENTADO]** Consentimento LGPD, termos/privacidade, denúncia/recurso, disclosure de IA.
2. **[PLANEJADO] P1** — notificação de incidente, registros de tratamento, DPO.
3. **[PLANEJADO] P2** — relatórios de transparência, RIPD, compliance automatizado.