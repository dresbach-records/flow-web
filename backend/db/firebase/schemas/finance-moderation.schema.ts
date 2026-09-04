import type { Timestamp } from 'firebase-admin/firestore';
export interface Task { id:string; title:string; description:string; rewardCents:number; status:string; rules:Record<string,unknown>; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Reward { id:string; userId:string; taskId?:string; campaignId?:string; amountCents:number; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Wallet { id:string; userId:string; availableCents:number; pendingCents:number; currency:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface LedgerEntry { id:string; userId:string; type:string; amountCents:number; referenceId:string; idempotencyKey:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Withdrawal { id:string; userId:string; amountCents:number; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface AntifraudCase { id:string; userId?:string; referenceId:string; score:number; decision:'ALLOW'|'REVIEW'|'BLOCK'; signals:string[]; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Advertiser { id:string; ownerId:string; businessId?:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface AdCampaign { id:string; advertiserId:string; name:string; budgetCents:number; startsAt:Timestamp; endsAt:Timestamp; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface AdCreative { id:string; advertiserId:string; type:'POST'|'VIDEO'|'IMAGE'; mediaPath?:string; destinationUrl?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Ad { id:string; campaignId:string; creativeId:string; placement:string; status:string; approvedDomainId?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ApprovedDomain { id:string; advertiserId:string; domain:string; status:string; domainVersion:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface AdEvent { id:string; adId:string; userId?:string; event:'IMPRESSION'|'CLICK'|'CONVERSION'; idempotencyKey:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface AdReview { id:string; adId:string; reviewerId?:string; decision:string; reason?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Report { id:string; reporterId:string; targetType:string; targetId:string; category:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ReportEvidence { id:string; reportId:string; storagePath:string; type:string; hash?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ModerationCase { id:string; reportId?:string; targetId:string; category:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ModerationAction { id:string; caseId:string; moderatorId:string; action:string; reason:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Appeal { id:string; caseId:string; userId:string; reason:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ProhibitedContent { id:string; category:string; pattern:string; action:'BLOCK'|'REVIEW'; active:boolean; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ProhibitedProduct { id:string; category:string; keywords:string[]; regulatoryReason?:string; active:boolean; createdAt:Timestamp; updatedAt:Timestamp; }
export interface PiracyCase { id:string; targetId:string; targetType:string; evidenceIds:string[]; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
