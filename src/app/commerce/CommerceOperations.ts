import { getPayoutEligibility, calculateProtectedOrder, isRewardEligible, RewardTask } from './MarketplaceRules';

export function createProtectedOrder(input:{id:string;sellerId:string;buyerId:string;total:number;platformFee:number;taxes:number;affiliateCommission:number;deliveredAt?:string}) {
 const payoutEligibleAt = input.deliveredAt ? getPayoutEligibility(input.deliveredAt) : undefined;
 return { id:input.id, sellerId:input.sellerId, buyerId:input.buyerId, total:input.total, platformFee:input.platformFee, taxes:input.taxes, affiliateCommission:input.affiliateCommission, sellerNet:calculateProtectedOrder(input.total,input.platformFee,input.taxes,input.affiliateCommission), status:'paid' as const, payoutEligibleAt };
}

export function markDelivered(order:any, deliveredAt:string) {
 return {...order, status:'delivered' as const, deliveredAt, protectionEndsAt:getPayoutEligibility(deliveredAt), payoutEligibleAt:getPayoutEligibility(deliveredAt)};
}

export function confirmReceipt(order:any, confirmedAt:string) {
 return {...order, status:'confirmed' as const, confirmedAt, payoutEligibleAt:getPayoutEligibility(order.deliveredAt ?? confirmedAt)};
}

export function requestReturn(order:any, reason:string) {
 return {...order, status:'return_requested' as const, returnReason:reason};
}

export function requestDispute(order:any, reason:string) {
 return {...order, status:'dispute' as const, disputeReason:reason};
}

export function taskReward(task:RewardTask, watchedSeconds:number, completedToday:number) {
 return isRewardEligible(task, watchedSeconds, completedToday) ? {eligible:true, amountCents:task.rewardCents} : {eligible:false, amountCents:0};
}
