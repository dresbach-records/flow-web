# 32 — DATA GOVERNANCE

> Status do documento: **vivo**.

---

## 1. Princípios

- **Ownership**: cada coleção tem dono funcional (produto/módulo).
- **Classificação**: pública / privada / sensível (ver `16-PRIVACY-ARCHITECTURE.md`).
- **Retenção**: política por tipo de dado.
- **Qualidade**: validação na escrita (rules + zod + client).
- **Lineage**: rastreabilidade de dados (origem → transformação → destino).

## 2. Inventário e owners

Ver `39-DATABASE-CATALOG.md` para o catálogo completo. Resumo de ownership:

| Coleção | Owner | Classificação |
|---|---|---|
| users | Conta | privada/sensível |
| posts, comments, likes | Social | pública (conteúdo do usuário) |
| conversations, messages | Messaging | privada |
| notifications | Notificações | privada |
| communities | Comunidades | pública |
| reports, appeals | Moderação | privada |
| admin_audit | Admin/Compliance | restrita |
| job_posts, job_applications | RH | pública/privada |
| creator_profiles | Criadores | pública |
| memorial_requests, tributes | Memorial | sensível |
| consents | Compliance | sensível |
| push_subscriptions | Notificações | restrita (backend) |
| stats/platform | Analytics | pública |

## 3. Política de retenção (alvo)

| Dado | Retenção sugerida |
|---|---|
| Conta inativa | notificar e purgar após 12 meses (LGPD Art. 15/16) |
| Logs de auditoria | 2 anos |
| Logs de infra | 30–90 dias |
| Analytics | conforme GA4 |
| Memorial | enquanto administrado |
| Mensagens | enquanto conta existir (ou política de exclusão) |

## 4. Qualidade de dados

- Validação na escrita (client-side + zod backend + rules).
- Testes de domínio (policies) garantem regras estáveis.
- Auditoria de órfãos de storage (`storage-audit`).
- Contadores: recomputação periódica recomendada.

## 5. Lineage

- `[NÃO IMPLEMENTADO]` data lineage formal.
- `[PLANEJADO]`: metadados `_meta.producer`, `_meta.origin` (ex.: `PERSONA_SEED`, `schedulerManaged`, `aiManaged` já existem em posts) — padronizar.

## 6. Acesso

- Regras min-privilege (não enumeração).
- Acesso admin auditado (`admin_audit`).
- Nunca expor PII a terceiros.

## 7. Roadmap

1. **[IMPLEMENTADO]** Rules min-privilege, auditoria, classificação, validação.
2. **[PLANEJADO] P1** — política de retenção automatizada, metadados de origem padronizados.
3. **[PLANEJADO] P2** — data lineage, relatórios de governança, DPA.