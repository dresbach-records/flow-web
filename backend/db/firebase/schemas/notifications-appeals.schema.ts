export interface FlowNotification {
  id: string;
  userId: string;
  type: 'FRIEND_REQUEST' | 'FOLLOW' | 'MESSAGE' | 'COMMENT' | 'LIKE' | 'SHARE' | 'MENTION' | 'BIRTHDAY' | 'SECURITY' | 'MODERATION' | 'SHOP' | 'ORDER' | 'REWARD' | 'AD';
  title: string;
  body: string;
  data?: Record<string, unknown>;
  readAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface AccountRecoveryRequest {
  id: string;
  userId: string;
  reason: 'HACKED_ACCOUNT' | 'COMPROMISED_ACCESS';
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'EXPIRED';
  identityFrontStoragePath: string;
  identityBackStoragePath: string;
  authorizedTermStoragePath: string;
  biometricStatus: 'NOT_IMPLEMENTED' | 'PENDING' | 'VERIFIED' | 'FAILED';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewerId?: string;
}

export interface AccountRestriction {
  id: string;
  userId: string;
  level: 'WARNING' | 'LIMITED' | 'TEMPORARY_RESTRICTION' | 'SUSPENDED' | 'BANNED';
  reasonCode: string;
  restrictedCapabilities: string[];
  startsAt: Date;
  endsAt?: Date;
  active: boolean;
  createdBy: 'SYSTEM' | 'MODERATOR' | 'ADMIN';
}

export interface ModerationAppeal {
  id: string;
  subjectType: 'ACCOUNT' | 'POST' | 'VIDEO' | 'COMMENT' | 'PAGE' | 'AD' | 'PRODUCT';
  subjectId: string;
  appellantId: string;
  reason: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'ACCEPTED' | 'REJECTED';
  decisionReason?: string;
  createdAt: Date;
  resolvedAt?: Date;
}
