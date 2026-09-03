export type BaseDocument = {
  id: string;
  createdAt: FirebaseTimestampLike;
  updatedAt: FirebaseTimestampLike;
};

export type FirebaseTimestampLike = { seconds: number; nanoseconds: number };

export type UserDocument = BaseDocument & {
  authUid: string;
  email: string;
  cpf?: string;
  phone?: string;
  displayName: string;
  username: string;
  role: 'USER' | 'CREATOR' | 'SELLER' | 'MODERATOR' | 'ADMIN';
  status: 'ACTIVE' | 'PENDING_VERIFICATION' | 'SUSPENDED' | 'BANNED';
  emailVerified: boolean;
};

export type ContentDocument = BaseDocument & {
  authorId: string;
  visibility: 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
  status: 'ACTIVE' | 'HIDDEN' | 'REMOVED' | 'UNDER_REVIEW';
  text?: string;
  media?: Array<{ storagePath: string; url?: string; type: string }>;
};

export type ProductDocument = BaseDocument & {
  sellerId: string;
  title: string;
  description: string;
  priceCents: number;
  status: 'DRAFT' | 'PENDING_REVIEW' | 'ACTIVE' | 'BLOCKED' | 'REMOVED';
  classification: 'ALLOWED' | 'RESTRICTED' | 'PROHIBITED' | 'UNDER_REVIEW';
};

export type OrderDocument = BaseDocument & {
  buyerId: string;
  sellerId: string;
  productIds: string[];
  amountCents: number;
  status: 'PENDING_PAYMENT' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'PROTECTION_PERIOD' | 'DISPUTED' | 'REFUNDED' | 'RELEASED' | 'CANCELLED';
  deliveredAt?: FirebaseTimestampLike;
  protectionEndsAt?: FirebaseTimestampLike;
};

export type ReportDocument = BaseDocument & {
  reporterId: string;
  targetType: 'POST' | 'VIDEO' | 'COMMENT' | 'USER' | 'PRODUCT' | 'AD' | 'COMMUNITY';
  targetId: string;
  category: string;
  status: 'OPEN' | 'UNDER_REVIEW' | 'ACTION_REQUIRED' | 'RESOLVED' | 'REJECTED' | 'ESCALATED';
};

export type RewardTransactionDocument = BaseDocument & {
  userId: string;
  amountCents: number;
  type: 'EARN' | 'ADJUSTMENT' | 'REVERSAL' | 'WITHDRAWAL';
  source: string;
  idempotencyKey: string;
};
