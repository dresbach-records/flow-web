export type OrderStatus='pending_payment'|'paid'|'seller_processing'|'shipped'|'delivered'|'delivery_confirmed'|'claim_open'|'return_requested'|'returned'|'refund_pending'|'refunded'|'released'|'cancelled';
export type CaseType='complaint'|'exchange'|'return'|'refund';
export type CaseStatus='open'|'seller_response'|'under_review'|'approved'|'rejected'|'resolved';
export type ListingType='new'|'used_local';

export interface ShopOrder { id:string; buyerId:string; sellerId:string; productId:string; amount:number; currency:'BRL'; status:OrderStatus; deliveredAt?:string; buyerConfirmedAt?:string; fundsReleaseAt?:string; }
export interface ShopProtectionCase { id:string; orderId:string; type:CaseType; reason:string; status:CaseStatus; createdAt:string; deadlineAt:string; evidenceUrls:string[]; }
export interface SellerShipment { orderId:string; sellerId:string; carrier?:string; trackingCode?:string; shippedAt?:string; deliveredAt?:string; }
export interface ListingModerationResult { listingId:string; status:'approved'|'review'|'blocked'; reasons:string[]; signals:string[]; }

export const BUYER_CONFIRMATION_WINDOW_DAYS=7;
export const FUNDS_RELEASE_AFTER_CONFIRMATION_DAYS=7;
export const FLOW_SHOP_POLICY={
 sellerResponsibleForProduct:true,
 sellerResponsibleForShipping:true,
 buyerCanOpenCaseWithinDays:7,
 releaseFundsOnlyAfterBuyerConfirmation:true,
 releaseFundsAfterConfirmationDays:7,
 usedLocalMarketplaceIsPeerToPeer:true,
 flowIntermediatesUsedLocalTransactions:false,
 prohibitedCounterfeit:true,
 prohibitedPiracy:true,
 prohibitedIllegalGoods:true,
 } as const;

export function calculateReleaseDate(buyerConfirmedAt:string){const d=new Date(buyerConfirmedAt);d.setDate(d.getDate()+FUNDS_RELEASE_AFTER_CONFIRMATION_DAYS);return d.toISOString();}
export function calculateCaseDeadline(deliveredAt:string){const d=new Date(deliveredAt);d.setDate(d.getDate()+BUYER_CONFIRMATION_WINDOW_DAYS);return d.toISOString();}
