import type { Timestamp } from 'firebase-admin/firestore';
export interface Shop { id:string; ownerId:string; name:string; slug:string; status:string; stripeAccountId?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Seller { id:string; userId:string; shopId:string; status:string; stripeAccountId?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Category { id:string; name:string; slug:string; parentId?:string; active:boolean; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Product { id:string; sellerId:string; shopId:string; categoryId:string; title:string; description:string; priceCents:number; currency:string; stock:number; classification:'ALLOWED'|'RESTRICTED'|'PROHIBITED'|'UNDER_REVIEW'; status:string; images:string[]; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Cart { id:string; userId:string; items:Array<{productId:string;quantity:number;unitPriceCents:number}>; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Order { id:string; buyerId:string; sellerId:string; shopId:string; amountCents:number; currency:string; status:string; deliveredAt?:Timestamp; protectionEndsAt?:Timestamp; paymentId?:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface OrderItem { id:string; orderId:string; productId:string; title:string; quantity:number; unitPriceCents:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Payment { id:string; orderId:string; provider:'STRIPE'; providerPaymentId:string; amountCents:number; status:string; idempotencyKey:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Shipment { id:string; orderId:string; carrier?:string; trackingCode?:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Delivery { id:string; orderId:string; deliveredAt?:Timestamp; confirmedByBuyerAt?:Timestamp; evidence?:string[]; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Complaint { id:string; orderId:string; openedBy:string; reason:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface ReturnRequest { id:string; orderId:string; requestedBy:string; reason:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Refund { id:string; orderId:string; paymentId:string; amountCents:number; reason:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Commission { id:string; orderId?:string; sellerId?:string; affiliateId?:string; amountCents:number; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Affiliate { id:string; userId:string; shopId?:string; code:string; commissionRateBps:number; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
