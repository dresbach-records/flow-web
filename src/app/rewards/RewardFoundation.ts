export type RewardStatus='pending'|'available'|'withdrawal_pending'|'paid'|'reversed'|'expired';
export type SellerPayoutStatus='held'|'eligible'|'paid'|'disputed'|'refunded';
export interface RewardEntry{id:string;userId:string;source:'task'|'eligible_ad'|'engagement';amount:number;currency:'BRL';status:RewardStatus;referenceId:string;createdAt:string;availableAt?:string;}
export interface SellerAccount{id:string;flowUserId:string;stripeConnectedAccountId:string;status:'pending'|'verified'|'restricted';country:'BR';}
export interface SaleSettlement{id:string;orderId:string;sellerId:string;grossAmount:number;platformFee:number;influencerCommission:number;taxesAndCosts:number;netSellerAmount:number;status:SellerPayoutStatus;releaseAt:string;}
export interface RewardPolicy{dailyLimit:number;minWatchSeconds:number;rewardPerEligibleEvent:number;fraudRiskThreshold:number;}
export const DEFAULT_REWARD_POLICY:RewardPolicy={dailyLimit:1, minWatchSeconds:10, rewardPerEligibleEvent:0.01, fraudRiskThreshold:70};
