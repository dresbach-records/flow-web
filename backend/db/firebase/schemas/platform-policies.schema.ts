export type PolicyAction = 'ALLOW' | 'RESTRICT' | 'MANUAL_REVIEW' | 'REMOVE' | 'REJECT' | 'SUSPEND' | 'BAN';
export type PolicyScope = 'CONTENT' | 'PRODUCT' | 'AD' | 'ACCOUNT' | 'PAGE' | 'SHOP';

export interface FlowPolicyRule {
  id: string;
  scope: PolicyScope;
  category: string;
  description: string;
  action: PolicyAction;
  ageRestricted?: boolean;
  requiresManualReview?: boolean;
  active: boolean;
  version: number;
}

export const FLOW_PROHIBITED_CATEGORIES = [
  'CHILD_SEXUAL_EXPLOITATION', 'PORNOGRAPHY', 'SEXUAL_CONTENT_WITH_MINORS',
  'TRAFFICKING', 'TERRORISM', 'ILLEGAL_DRUGS', 'ILLEGAL_WEAPONS',
  'FRAUD', 'PHISHING', 'PYRAMID_SCHEME', 'COUNTERFEIT', 'PIRACY',
  'INTELLECTUAL_PROPERTY_INFRINGEMENT', 'DANGEROUS_ILLEGAL_ACTIVITY',
  'HATE_OR_INCITEMENT', 'SELF_HARM_PROMOTION', 'SPAM', 'IMPERSONATION'
] as const;

export const FLOW_RESTRICTED_PRODUCT_CATEGORIES = [
  'REGULATED_HEALTH', 'WEIGHT_LOSS', 'MEDICAL', 'AGE_RESTRICTED',
  'FINANCIAL_SERVICES', 'ALCOHOL', 'TOBACCO', 'WEAPONS', 'SUPPLEMENTS'
] as const;

export interface AdPolicyReview {
  id: string;
  adId: string;
  advertiserId: string;
  decision: 'PENDING' | 'APPROVED' | 'REJECTED' | 'MANUAL_REVIEW';
  policyVersion: number;
  reasons: string[];
  riskScore?: number;
  aiProvider?: 'GEMINI';
  aiEnabled: boolean;
  reviewerId?: string;
  reviewedAt?: Date;
  createdAt: Date;
}

export interface ApprovedDomain {
  id: string;
  advertiserId: string;
  domain: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  lockedAfterApproval: boolean;
  verifiedAt?: Date;
  createdAt: Date;
}
