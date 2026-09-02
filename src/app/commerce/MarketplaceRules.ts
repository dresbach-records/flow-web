export type ProductModerationStatus = 'pending' | 'approved' | 'restricted' | 'rejected';
export type ProductCondition = 'new' | 'used';
export type OrderStatus = 'paid' | 'shipped' | 'delivered' | 'confirmed' | 'dispute' | 'return_requested' | 'returned' | 'refunded' | 'released';
export type RewardSource = 'task' | 'ad_view' | 'video_engagement' | 'affiliate_sale';

export interface ProductPolicy { prohibited: boolean; requiresReview: boolean; reasons: string[]; }
export interface MarketplaceProduct { id:string; condition:ProductCondition; moderation:ProductModerationStatus; policy:ProductPolicy; sellerId:string; }
export interface ProtectedOrder { id:string; sellerId:string; buyerId:string; total:number; sellerNet:number; platformFee:number; taxes:number; affiliateCommission:number; status:OrderStatus; deliveredAt?:string; protectionEndsAt?:string; payoutEligibleAt?:string; }
export interface AffiliateSale { id:string; orderId:string; influencerId:string; storeId:string; commissionRate:number; commissionAmount:number; status:'pending'|'eligible'|'paid'|'cancelled'; }
export interface RewardTask { id:string; title:string; source:RewardSource; rewardCents:number; minimumSeconds?:number; dailyLimit?:number; active:boolean; }
export interface RewardLedgerEntry { id:string; userId:string; source:RewardSource; amountCents:number; status:'pending'|'available'|'reversed'|'paid'; referenceId:string; createdAt:string; }

export const PROHIBITED_PRODUCT_RULES = [
 'Produtos falsificados ou pirateados',
 'Produtos ilícitos ou contrabandeados',
 'Produtos que violem propriedade intelectual',
 'Medicamentos ou produtos sujeitos a autorização sanitária sem comprovação aplicável',
 'Produtos sem autorização/regulação sanitária quando ela for legalmente exigida',
 'Armas, munições e explosivos',
 'Drogas ilícitas e substâncias proibidas',
 'Produtos de origem ilícita',
 'Conteúdo ou produtos sexualmente ilícitos',
 'Qualquer item proibido pela legislação aplicável ou pelas políticas do FLOW'
];

export function calculateProtectedOrder(total:number, platformFee:number, taxes:number, affiliateCommission:number): ProtectedOrder['sellerNet'] {
 return Math.max(0, total - platformFee - taxes - affiliateCommission);
}

export function getPayoutEligibility(deliveredAt:string):string {
 const date = new Date(deliveredAt); date.setDate(date.getDate()+7); return date.toISOString();
}

export function isRewardEligible(task:RewardTask, watchedSeconds:number, dailyCompleted:number):boolean {
 if (!task.active) return false;
 if (task.minimumSeconds && watchedSeconds < task.minimumSeconds) return false;
 if (task.dailyLimit !== undefined && dailyCompleted >= task.dailyLimit) return false;
 return true;
}
