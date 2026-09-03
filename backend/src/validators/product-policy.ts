const PROHIBITED_TERMS = ['pirataria', 'falsificado', 'falso', 'arma', 'droga', 'pornografia', 'emagrecimento milagroso'];

export type ProductDecision = { status: 'allowed' | 'manual-review' | 'blocked'; reasons: string[] };

export function classifyProduct(input: { name?: unknown; description?: unknown; category?: unknown }): ProductDecision {
  const text = [input.name, input.description, input.category].filter((value): value is string => typeof value === 'string').join(' ').toLocaleLowerCase('pt-BR');
  const reasons = PROHIBITED_TERMS.filter((term) => text.includes(term));
  if (reasons.length) return { status: 'blocked', reasons };
  if (!input.name || typeof input.name !== 'string' || input.name.trim().length < 3) return { status: 'manual-review', reasons: ['Nome do produto inválido ou ausente'] };
  return { status: 'allowed', reasons: [] };
}
