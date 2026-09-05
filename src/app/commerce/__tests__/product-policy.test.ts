// FLOW — política de conformidade de produtos (testes reais, FASE 7).
import { describe, expect, it } from 'vitest';
import { canPublishProduct, evaluateProductCompliance } from '../ProductPolicy';

describe('evaluateProductCompliance', () => {
  it('bloqueia emagrecedor sem regularização', () => {
    const result = evaluateProductCompliance({
      category: 'weight_loss',
      name: 'Chá que emagrece 10kg',
    });
    expect(result.status).toBe('blocked');
    expect(result.requiresEvidence).toBe(true);
  });

  it('exige revisão manual quando há regularização', () => {
    const result = evaluateProductCompliance({
      category: 'weight_loss',
      name: 'Suplemento',
      anvisaRegularized: true,
      regulatoryId: '123',
    });
    expect(result.status).toBe('manual_review');
  });

  it('libera produto geral sem alegações reguladas', () => {
    const result = evaluateProductCompliance({ category: 'general', name: 'Mochila urbana' });
    expect(result.status).toBe('allowed');
    expect(result.requiresEvidence).toBe(false);
  });

  it('detecta alegação de cura mesmo em categoria geral', () => {
    const result = evaluateProductCompliance({ category: 'general', name: 'Pomada que cura tudo' });
    expect(result.status).toBe('blocked');
  });
});

describe('canPublishProduct', () => {
  it('somente permite status allowed', () => {
    expect(canPublishProduct({ category: 'general', name: 'Livro' })).toBe(true);
    expect(canPublishProduct({ category: 'medicine', name: 'Remédio' })).toBe(false);
  });
});
