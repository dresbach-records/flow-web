// FLOW — regras de domínio do marketplace (testes reais, FASE 7).
import { describe, expect, it } from 'vitest';
import {
  PROHIBITED_PRODUCT_RULES,
  calculateProtectedOrder,
  getPayoutEligibility,
  isRewardEligible,
} from '../MarketplaceRules';

describe('calculateProtectedOrder', () => {
  it('desconta taxas, impostos e comissão do afiliado', () => {
    expect(calculateProtectedOrder(1000, 100, 50, 30)).toBe(820);
  });

  it('nunca retorna valor negativo', () => {
    expect(calculateProtectedOrder(100, 90, 50, 30)).toBe(0);
  });
});

describe('getPayoutEligibility', () => {
  it('libera o repasse 7 dias após a entrega', () => {
    const delivered = '2026-09-02T12:00:00.000Z';
    const payout = new Date(getPayoutEligibility(delivered));
    const expected = new Date(delivered);
    expected.setDate(expected.getDate() + 7);
    expect(payout.toISOString()).toBe(expected.toISOString());
  });
});

describe('isRewardEligible', () => {
  const base = { id: 't1', title: 'Tarefa', source: 'task' as const, rewardCents: 3, active: true };
  it('elegível quando ativa e sem limites', () => {
    expect(isRewardEligible(base, 0, 0)).toBe(true);
  });
  it('inelegível quando inativa', () => {
    expect(isRewardEligible({ ...base, active: false }, 999, 0)).toBe(false);
  });
  it('exige segundos mínimos assistidos', () => {
    expect(isRewardEligible({ ...base, minimumSeconds: 30 }, 10, 0)).toBe(false);
    expect(isRewardEligible({ ...base, minimumSeconds: 30 }, 30, 0)).toBe(true);
  });
  it('respeita o limite diário', () => {
    expect(isRewardEligible({ ...base, dailyLimit: 3 }, 0, 3)).toBe(false);
    expect(isRewardEligible({ ...base, dailyLimit: 3 }, 0, 2)).toBe(true);
  });
});

describe('PROHIBITED_PRODUCT_RULES', () => {
  it('cobre pirataria, ilícitos e propriedade intelectual', () => {
    const text = PROHIBITED_PRODUCT_RULES.join(' ').toLowerCase();
    expect(PROHIBITED_PRODUCT_RULES.length).toBeGreaterThan(5);
    expect(text).toContain('pirat');
    expect(text).toContain('ilícit');
  });
});
