export type AccountKind = 'PERSONAL' | 'CREATOR' | 'BUSINESS';
export type PageStatus = 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED';

export interface FlowPage {
  id: string;
  ownerId: string;
  type: 'BUSINESS' | 'CREATOR' | 'COMMUNITY';
  name: string;
  handle: string;
  description?: string;
  categoryId?: string;
  website?: string;
  avatarUrl?: string;
  coverUrl?: string;
  status: PageStatus;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageMember {
  pageId: string;
  userId: string;
  role: 'OWNER' | 'ADMIN' | 'EDITOR' | 'MODERATOR' | 'ANALYST';
  active: boolean;
  createdAt: Date;
}

export interface AdAccount {
  id: string;
  ownerId: string;
  pageId?: string;
  status: 'PENDING_VERIFICATION' | 'ACTIVE' | 'RESTRICTED' | 'SUSPENDED' | 'BANNED';
  currency: 'BRL';
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdCampaign {
  id: string;
  adAccountId: string;
  name: string;
  objective: string;
  status: 'DRAFT' | 'IN_REVIEW' | 'ACTIVE' | 'PAUSED' | 'REJECTED' | 'COMPLETED';
  dailyBudgetCents?: number;
  lifetimeBudgetCents?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdGroup {
  id: string;
  campaignId: string;
  name: string;
  audience: Record<string, unknown>;
  placements: string[];
  bidCents?: number;
  status: string;
  createdAt: Date;
}

export interface FlowAd {
  id: string;
  adGroupId: string;
  creativeId: string;
  offerId?: string;
  approvedDomainId?: string;
  destinationUrl?: string;
  status: 'DRAFT' | 'SUBMITTED' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'PAUSED' | 'DISABLED';
  policyReviewId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdBillingLedgerEntry {
  id: string;
  adAccountId: string;
  type: 'CREDIT' | 'DEBIT' | 'REFUND' | 'ADJUSTMENT';
  amountCents: number;
  referenceId: string;
  idempotencyKey: string;
  createdAt: Date;
}
