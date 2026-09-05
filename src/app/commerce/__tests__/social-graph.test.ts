// FLOW — grafo social e ciclo de vida (testes reais).
import { describe, expect, it } from 'vitest';
import { extractHashtags } from '../../../services/firebase/social';
import { isStoryActive, STORY_TTL_MS } from '../../../services/firebase/stories';
import { validateEventInput } from '../../../services/firebase/events';

describe('extractHashtags', () => {
  it('extrai tags únicas com #', () => {
    expect(extractHashtags('Amo #Flow e #flow! #Viagens_2026')).toEqual(['#Flow', '#flow', '#Viagens_2026']);
  });
  it('texto sem tag retorna vazio', () => {
    expect(extractHashtags('sem tags aqui')).toEqual([]);
  });
});

describe('isStoryActive', () => {
  const now = 1_700_000_000_000;
  it('sem expiração = visível', () => {
    expect(isStoryActive(null, now)).toBe(true);
    expect(isStoryActive(undefined, now)).toBe(true);
  });
  it('epoch ms futuro/passado', () => {
    expect(isStoryActive(now + 1000, now)).toBe(true);
    expect(isStoryActive(now - 1000, now)).toBe(false);
  });
  it('TTL de 24h', () => {
    expect(STORY_TTL_MS).toBe(24 * 60 * 60 * 1000);
  });
});

describe('validateEventInput', () => {
  const now = new Date('2026-09-05T12:00:00Z').getTime();
  const future = new Date('2026-10-01T18:00:00Z').toISOString();
  it('aceita entrada válida', () => {
    expect(validateEventInput({ title: 'Encontro', startsAt: future }, now)).toBeNull();
  });
  it('rejeita título vazio e data passada', () => {
    expect(validateEventInput({ title: '  ', startsAt: future }, now)).toBe('Informe o título do evento.');
    expect(validateEventInput({ title: 'X', startsAt: '2026-01-01T00:00:00Z' }, now)).toBe('O evento precisa ser no futuro.');
    expect(validateEventInput({ title: 'X', startsAt: 'invalida' }, now)).toBe('Data inválida.');
  });
});
