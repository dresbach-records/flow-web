// FLOW — política da loja e mapeamento de módulos (testes reais, FASE 7).
import { describe, expect, it } from 'vitest';
import {
  BUYER_CONFIRMATION_WINDOW_DAYS,
  FLOW_SHOP_POLICY,
  FUNDS_RELEASE_AFTER_CONFIRMATION_DAYS,
  calculateCaseDeadline,
  calculateReleaseDate,
} from '../FlowShopPolicy';
import { moduleKeyForPath } from '../../../hooks/useModuleStates';

describe('shop protection windows', () => {
  it('janela de proteção de 7 dias', () => {
    expect(BUYER_CONFIRMATION_WINDOW_DAYS).toBe(7);
    const deadline = new Date(calculateCaseDeadline('2026-09-02T12:00:00.000Z'));
    const expected = new Date('2026-09-02T12:00:00.000Z');
    expected.setDate(expected.getDate() + 7);
    expect(deadline.toISOString()).toBe(expected.toISOString());
  });

  it('repasse 7 dias após confirmação', () => {
    expect(FUNDS_RELEASE_AFTER_CONFIRMATION_DAYS).toBe(7);
    const release = new Date(calculateReleaseDate('2026-09-10T00:00:00.000Z'));
    const expected = new Date('2026-09-10T00:00:00.000Z');
    expected.setDate(expected.getDate() + 7);
    expect(release.toISOString()).toBe(expected.toISOString());
  });

  it('vendedor responde por produto e envio', () => {
    expect(FLOW_SHOP_POLICY.sellerResponsibleForProduct).toBe(true);
    expect(FLOW_SHOP_POLICY.releaseFundsOnlyAfterBuyerConfirmation).toBe(true);
  });
});

describe('moduleKeyForPath', () => {
  it('mapeia rotas /app para chaves de módulo', () => {
    expect(moduleKeyForPath('/app')).toBe('feed');
    expect(moduleKeyForPath('/app/shorts')).toBe('shorts');
    expect(moduleKeyForPath('/app/comunidades')).toBe('communities');
    expect(moduleKeyForPath('/app/mensagens')).toBe('messaging');
    expect(moduleKeyForPath('/app/shop')).toBe('shop');
    expect(moduleKeyForPath('/app/rewards')).toBe('rewards');
    expect(moduleKeyForPath('/app/denunciar')).toBe('moderation');
  });

  it('retorna null para rotas sem gate de módulo', () => {
    expect(moduleKeyForPath('/app/configuracoes')).toBeNull();
    expect(moduleKeyForPath('/login')).toBeNull();
  });
});
