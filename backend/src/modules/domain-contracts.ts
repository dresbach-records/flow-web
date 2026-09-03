export const ACCOUNT_STATES = ['ACTIVE','WARNING','LIMITED','TEMPORARY_RESTRICTION','SUSPENDED','BANNED','DELETED'] as const;
export const RECOVERY_STATES = ['PENDING','UNDER_REVIEW','APPROVED','REJECTED','EXPIRED','CANCELLED'] as const;
export const CONTENT_STATES = ['DRAFT','PUBLISHED','REVIEW','RESTRICTED','REMOVED','BANNED','APPEALED','RESTORED'] as const;
export const AD_STATES = ['DRAFT','SUBMITTED','UNDER_REVIEW','APPROVED','REJECTED','PAUSED','DISABLED'] as const;
export const ORDER_STATES = ['CREATED','PAYMENT_PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CUSTOMER_CONFIRMED','PROTECTION_PERIOD','COMPLAINT','RETURN_REQUESTED','RETURNED','REFUND_PENDING','REFUNDED','RELEASED','CANCELLED'] as const;
export const REVIEW_DECISIONS = ['APPROVE','REJECT','MANUAL_REVIEW','RESTRICT','REMOVE'] as const;
export const PRODUCT_POLICY_STATES = ['ALLOWED','RESTRICTED','AGE_RESTRICTED','MANUAL_REVIEW','PROHIBITED'] as const;

export type AccountState = typeof ACCOUNT_STATES[number];
export type RecoveryState = typeof RECOVERY_STATES[number];
export type ContentState = typeof CONTENT_STATES[number];
export type AdState = typeof AD_STATES[number];
export type OrderState = typeof ORDER_STATES[number];

const transitions: Record<string, readonly string[]> = {
  ACTIVE:['WARNING','LIMITED','SUSPENDED','BANNED','DELETED'],
  WARNING:['ACTIVE','LIMITED','SUSPENDED'],
  LIMITED:['ACTIVE','TEMPORARY_RESTRICTION','SUSPENDED','BANNED'],
  TEMPORARY_RESTRICTION:['ACTIVE','SUSPENDED','BANNED'],
  SUSPENDED:['ACTIVE','BANNED'],
  DRAFT:['SUBMITTED','PUBLISHED','REVIEW'],
  SUBMITTED:['UNDER_REVIEW'],
  UNDER_REVIEW:['APPROVED','REJECTED'],
  APPROVED:['PAUSED','DISABLED','UNDER_REVIEW'],
  PAUSED:['APPROVED','DISABLED'],
  CREATED:['PAYMENT_PENDING','CANCELLED'],
  PAYMENT_PENDING:['PAID','CANCELLED'],
  PAID:['PROCESSING','CANCELLED'],
  PROCESSING:['SHIPPED','CANCELLED'],
  SHIPPED:['DELIVERED'],
  DELIVERED:['CUSTOMER_CONFIRMED','COMPLAINT','RETURN_REQUESTED'],
  CUSTOMER_CONFIRMED:['PROTECTION_PERIOD','COMPLAINT','RETURN_REQUESTED'],
  PROTECTION_PERIOD:['RELEASED','COMPLAINT','RETURN_REQUESTED'],
  COMPLAINT:['RETURN_REQUESTED','RELEASED'],
  RETURN_REQUESTED:['RETURNED','RELEASED'],
  RETURNED:['REFUND_PENDING'],
  REFUND_PENDING:['REFUNDED','RELEASED'],
};

export function canTransition(from:string,to:string):boolean {
  return (transitions[from] ?? []).includes(to);
}

export function assertTransition(from:string,to:string):void {
  if (!canTransition(from,to)) throw new Error(`Invalid FLOW state transition: ${from} -> ${to}`);
}

export interface AccountRecoveryEvidence {
  frontDocumentPath:string;
  backDocumentPath:string;
  authorizedTermPath:string;
  biometricStatus:'NOT_IMPLEMENTED'|'PENDING'|'VERIFIED'|'FAILED';
}

export interface AdSubmission {
  advertiserId:string;
  campaignId:string;
  creativeId:string;
  destinationDomain:string;
  declaredCategory:string;
  claims:string[];
}

export interface OrderProtection {
  confirmedAt:Date;
  protectionEndsAt:Date;
  complaintOpen:boolean;
}
