# FLOW — Inventário de DNS

> Documentação de registros DNS necessários. **Nenhum valor é inventado.**
> Valores/targets reais devem ser fornecidos pelo provedor (Vercel/Cloudflare/Firebase) antes do cadastro.
> Última revisão: 2026-09-05 · Status: **vivo**

---

## 1. Registros já definidos

| Domínio | Subdomínio | Finalidade | Provider | Tipo DNS | Target | Proxy | Ambiente | Status | Observações |
|---|---|---|---|---|---|---|---|---|---|
| flowsocial.fun | apex (`@`) | Frontend oficial | Vercel | A / CNAME | *(valor fornecido pela Vercel)* | Proxied (Cloudflare) | Produção | ⚠️ PENDENTE | Ligar domínio ao projeto Vercel |
| flowsocial.fun | www | Redirect → apex | Vercel | CNAME | *(Vercel)* | Proxied | Produção | ⚠️ PENDENTE | Se registrado, redirecionar ao canônico |
| flowsocial.fun | api | Backend/API oficial | *(a definir: Cloud Run/Render/VPS)* | A / CNAME | *(valor do provider)* | Proxied | Produção | ⚠️ PENDENTE | `https://api.flowsocial.fun` + `/v1` + `/health` |

> **Regra:** novos subdomínios (admin/cdn/media/ws/status/storage/uploads) **não** devem ser criados sem necessidade arquitetural concreta. Antes de qualquer registro, documentar neste arquivo.

## 2. E-mail (aliases)

| Tipo | Valor | Finalidade | Status |
|---|---|---|---|
| MX | *(provedor de e-mail)* | Recebimento `@flowsocial.fun` | ⚠️ PENDENTE |
| TXT — SPF | `v=spf1 include:<provedor> ~all` | Autoriza envio | ⚠️ PENDENTE |
| TXT — DKIM | *(selector do provedor)* | Assinatura de envio | ⚠️ PENDENTE |
| TXT — DMARC | `v=DMARC1; p=quarantine; rua=mailto:...` | Política de entrega | ⚠️ PENDENTE |

> SPF deve ter **um único registro** (não duplicar). Valores reais vêm do provedor de e-mail.

## 3. Verificação de domínio (provedores)

| Provider | Tipo | Finalidade | Status |
|---|---|---|---|
| Vercel | TXT | Verificação do domínio no projeto | ⚠️ PENDENTE |
| Firebase (se aplicável) | TXT | Verificação de domínio | ⚠️ PENDENTE |

## 4. Fluxo obrigatório para novo DNS

Sempre que uma funcionalidade exigir novo domínio/subdomínio:

```text
PARAR A IMPLEMENTAÇÃO DA PARTE DEPENDENTE DO DNS
```

1. Identificar a necessidade.
2. Preencher tabela abaixo.
3. Informar:
   - Subdomínio
   - Finalidade
   - Tipo (A/AAAA/CNAME/TXT/MX)
   - Target (valor fornecido pelo serviço — NUNCA inventado)
   - Proxy (Proxied / DNS only)
   - Origem (Vercel/Cloudflare Worker/servidor/Firebase/Neon/etc.)
   - Motivo (justificativa técnica)
4. Não marcar como concluído enquanto o registro externo estiver pendente.

### Registro pendente solicitado nesta iteração

| Campo | Valor |
|---|---|
| Subdomínio | `api.flowsocial.fun` |
| Finalidade | API oficial do Flow (`/v1`, `/health`) |
| Tipo | A / CNAME (conforme provider do backend) |
| Target | **PENDENTE** — fornecido pela infraestrutura de hospedagem do backend |
| Proxy | conforme documentação do provider |
| Origem | hospedagem do backend (Cloud Run/Render/VPS — a definir) |
| Motivo | Domínio oficial da API definido na arquitetura |
| Status | ⚠️ PENDENTE DE CONFIGURAÇÃO |

## 5. Registros planejados (sem decisão ainda)

| Subdomínio | Possível finalidade | Status |
|---|---|---|
| `cdn.*` / `media.*` / `uploads.*` | entrega de mídia | ⚠️ NÃO DECIDIDO (só se houver necessidade) |
| `ws.*` | WebSocket/realtime | ⚠️ NÃO DECIDIDO |
| `status.*` | página de status | ⚠️ NÃO DECIDIDO |
| `admin.*` | painel admin separado | ⚠️ NÃO DECIDIDO (hoje admin é rota do frontend) |

## 6. Não fazer

- Não inventar IP/CNAME/TXT/MX.
- Não criar domínio "porque poderia ser útil".
- Não espalhar URLs hardcoded no código (usar env/centralização).
- Não usar domínio temporário em produção.
- Não colocar secrets nesta documentação.