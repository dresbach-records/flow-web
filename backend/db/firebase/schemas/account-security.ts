export type AccountRecoveryStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
export type AccountRestrictionLevel = 'NONE' | 'WARNING' | 'LIMITED' | 'TEMPORARY_RESTRICTION' | 'SUSPENDED' | 'BANNED';

export interface AccountRecoveryRequest {
  id: string;
  userId: string;
  reason: 'HACKED' | 'LOST_ACCESS' | 'IDENTITY_REVIEW';
  status: AccountRecoveryStatus;
  evidence: { rgFrontPath?: string; rgBackPath?: string; authorizedTermPath?: string; biometricStatus: 'NOT_REQUIRED' | 'PENDING' | 'VERIFIED' | 'FAILED' };
  reviewerId?: string;
  decisionReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AccountRestriction {
  id: string;
  userId: string;
  level: AccountRestrictionLevel;
  reasonCode: string;
  expiresAt?: string;
  createdBy: 'SYSTEM' | 'MODERATOR' | 'ADMIN';
  createdById?: string;
  appealAllowed: boolean;
  createdAt: string;
  updatedAt: string;
}
