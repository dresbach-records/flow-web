export type ProductModerationStatus = 'allowed' | 'blocked' | 'manual_review';
export type ProductCategory = 'health' | 'weight_loss' | 'food_supplement' | 'cosmetic' | 'medicine' | 'general' | 'used_local';

/**
 * FLOW Shop marketplace safety policy.
 *
 * Health, weight-loss, medicine, supplements and other regulated products
 * require regulatory evidence before publication. In particular, products
 * marketed for weight loss or health benefits without the required ANVISA
 * authorization/regularization are BLOCKED and cannot be published.
 */
export interface ProductComplianceInput {
  category: ProductCategory;
  name: string;
  description?: string;
  claims?: string[];
  anvisaRegularized?: boolean;
  regulatoryId?: string;
  evidenceUrl?: string;
}

export interface ProductComplianceResult {
  status: ProductModerationStatus;
  reasons: string[];
  requiresEvidence: boolean;
}

const regulatedCategories: ProductCategory[] = ['health', 'weight_loss', 'food_supplement', 'medicine'];
const suspiciousClaims = [
  'emagrece', 'emagrecimento', 'perde peso', 'queima gordura', 'cura', 'tratamento',
  'medicinal', 'detox', 'milagre', 'reduz diabetes', 'reduz pressão', 'anvisa'
];

export function evaluateProductCompliance(input: ProductComplianceInput): ProductComplianceResult {
  const text = `${input.name} ${input.description ?? ''} ${(input.claims ?? []).join(' ')}`.toLocaleLowerCase('pt-BR');
  const regulated = regulatedCategories.includes(input.category);
  const healthClaim = suspiciousClaims.some(claim => text.includes(claim));

  // FLOW policy: regulated health/weight-loss products without ANVISA evidence are prohibited.
  if ((regulated || healthClaim) && input.anvisaRegularized !== true) {
    return {
      status: 'blocked',
      requiresEvidence: true,
      reasons: ['Produto de saúde/emagrecimento ou com alegação regulada sem comprovação de regularização exigida pela plataforma.']
    };
  }

  if (regulated || healthClaim) {
    return {
      status: 'manual_review',
      requiresEvidence: true,
      reasons: ['Produto regulado: documentação e identificação regulatória devem ser validadas antes da publicação.']
    };
  }

  return { status: 'allowed', requiresEvidence: false, reasons: [] };
}

export function canPublishProduct(input: ProductComplianceInput): boolean {
  return evaluateProductCompliance(input).status === 'allowed';
}
