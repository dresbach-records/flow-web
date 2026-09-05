# 30 — FEATURE FLAGS

> Status do documento: **vivo**.

---

## 1. Estado atual

- **Registro**: `src/core/modules/ModuleRegistry.ts` — 21 módulos.
- **Estados**: `enabled | maintenance | disabled` em `platform_settings/modules` (admin grava via `ModuleCenter`).
- **Aplicação**: `ModuleGate` (App.tsx) usa `useModuleStates` (fail-open em erro).
- **Escopo atual**: `maintenance` bloqueia rota; `disabled` ainda não bloqueia. `[PARCIAL]`
- Auditoria: `admin_audit` (`MODULE_MAINTENANCE`/`MODULE_ENABLE`).

## 2. Modelo alvo

```
Feature → Flag → Audience → Rollout → Metrics → Rollback
```

| Conceito | Implementação alvo |
|---|---|
| Flag | chave + tipo (boolean/percent/segments) |
| Audience | segmentos (role, locale, userId hash, device) |
| Rollout | ramp % por dia |
| Metrics | eventos de conversão/erro por flag |
| Rollback | desligar instantâneo |

## 3. Tipos de flags

| Tipo | Exemplo | Hoje |
|---|---|---|
| Kill switch | Guardian on/off (`FLOW_GUARDIAN_ENABLED`) | ✔ (env) |
| Module flag | módulo em manutenção | ✔ (Firestore) |
| Percentage rollout | liberar 10% dos usuários p/ novo feed | ✘ |
| Segment | usuários beta | ✘ |

## 4. Recomendação

- Manter `platform_settings/modules` (já funcional e auditável) para **kill switches de módulo**.
- Adicionar **flags de feature** para capacidades novas (repost, menções, novo ranking) com rollout gradual — pode usar serviço dedicado (LaunchDarkly/Unleash) ou Firestore+hash de uid (simples, sem dependência).

## 5. Segurança

- Flags não podem vazar dados sensíveis.
- Flags de funcionalidade crítica exigem aprovação (auditoria `admin_audit`).
- Fail-open apenas para flags de leitura; flags de segurança devem fail-closed.

## 6. Roadmap

1. **[IMPLEMENTADO]** Módulos com estados + persistência + gate de manutenção + auditoria.
2. **[PLANEJADO] P1** — `disabled` efetivo no gate; flags de feature com hash de uid.
3. **[PLANEJADO] P2** — rollout percentual + métricas por flag + SDK.
4. **[PLANEJADO] P3** — experimentação (A/B) integrada ao analytics.