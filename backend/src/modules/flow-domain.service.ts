import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../infrastructure/firebase/firebase-admin.js';
import type { Actor } from './flow-module.service.js';

const db = () => firestore();
const now = () => FieldValue.serverTimestamp();

export type Lifecycle = 'DRAFT'|'SUBMITTED'|'UNDER_REVIEW'|'APPROVED'|'REJECTED'|'ACTIVE'|'PAUSED'|'REMOVED'|'SUSPENDED'|'BANNED'|'CANCELLED';

const transitions: Record<string, string[]> = {
  DRAFT:['SUBMITTED','CANCELLED'], SUBMITTED:['UNDER_REVIEW','REJECTED'], UNDER_REVIEW:['APPROVED','REJECTED'],
  APPROVED:['ACTIVE','PAUSED','REMOVED'], ACTIVE:['PAUSED','REMOVED','SUSPENDED','BANNED'], PAUSED:['ACTIVE','REMOVED'],
  REJECTED:['SUBMITTED'], REMOVED:[], SUSPENDED:['ACTIVE','BANNED'], BANNED:[], CANCELLED:[]
};

export class FlowDomainService {
  private collection(name:string){ return db().collection(name); }

  async createOwned(collection:string, data:Record<string,unknown>, actor:Actor){
    const ref=this.collection(collection).doc();
    await ref.create({...data, ownerId:actor.uid, status:data.status ?? 'DRAFT', createdAt:now(), updatedAt:now()});
    return {id:ref.id,...data,ownerId:actor.uid};
  }

  async transition(collection:string,id:string,status:string,actor:Actor){
    const ref=this.collection(collection).doc(id); const snap=await ref.get();
    if(!snap.exists) throw new Error('NOT_FOUND');
    const current=String(snap.get('status') ?? 'DRAFT');
    if(snap.get('ownerId')!==actor.uid && !actor.admin) throw new Error('FORBIDDEN');
    if(!transitions[current]?.includes(status)) throw new Error('INVALID_TRANSITION');
    await ref.update({status,updatedAt:now()});
    return {id,...(await ref.get()).data()};
  }

  async report(targetType:string,targetId:string,reason:string,actor:Actor,details=''){
    const ref=this.collection('reports').doc();
    await ref.create({targetType,targetId,reason,details,reporterId:actor.uid,status:'OPEN',createdAt:now(),updatedAt:now()});
    await this.collection('moderation_cases').doc(ref.id).create({reportId:ref.id,targetType,targetId,status:'OPEN',priority:'NORMAL',createdAt:now(),updatedAt:now()});
    return {id:ref.id,status:'OPEN'};
  }

  async restrictAccount(userId:string, level:string, reason:string, actor:Actor){
    if(!actor.admin) throw new Error('ADMIN_REQUIRED');
    const ref=this.collection('account_restrictions').doc(userId);
    await ref.set({userId,level,reason,appliedBy:actor.uid,updatedAt:now()},{merge:true});
    await this.collection('audit_logs').add({actorId:actor.uid,action:'ACCOUNT_RESTRICTION',resource:'users',resourceId:userId,metadata:{level,reason},createdAt:now()});
    return {userId,level};
  }

  async recoverAccount(data:{uid:string;frontPath:string;backPath:string;authorizedTermPath:string}, actor:Actor){
    const ref=this.collection('account_recovery_requests').doc();
    await ref.create({uid:data.uid,frontPath:data.frontPath,backPath:data.backPath,authorizedTermPath:data.authorizedTermPath,biometricStatus:'NOT_IMPLEMENTED',status:'SUBMITTED',createdAt:now(),updatedAt:now()});
    return {id:ref.id,status:'SUBMITTED'};
  }

  async submitAd(data:Record<string,unknown>,actor:Actor){
    const ref=this.collection('ads').doc();
    await ref.create({...data,ownerId:actor.uid,status:'UNDER_REVIEW',policyStatus:'PENDING',domainStatus:'PENDING',billingStatus:'READY',createdAt:now(),updatedAt:now()});
    await this.collection('ad_reviews').add({adId:ref.id,reviewType:'AUTOMATED',status:'PENDING',policyVersion:'flow-1',createdAt:now()});
    return {id:ref.id,status:'UNDER_REVIEW'};
  }

  async ledger(collection:string, ownerId:string, type:'CREDIT'|'DEBIT', amount:number, reference:string, actor:Actor){
    if(amount<=0 || !Number.isFinite(amount)) throw new Error('VALIDATION_ERROR');
    if(ownerId!==actor.uid && !actor.admin) throw new Error('FORBIDDEN');
    const ref=this.collection(collection).doc();
    await ref.create({ownerId,type,amount,reference,status:'POSTED',createdAt:now()});
    return {id:ref.id,ownerId,type,amount,reference,status:'POSTED'};
  }

  async notify(userId:string,type:string,title:string,body:string){
    const ref=this.collection('notifications').doc();
    await ref.create({userId,type,title,body,read:false,createdAt:now()});
    return ref.id;
  }
}

export const SOCIAL_ACTIONS=['follow','unfollow','like','unlike','comment','share','save','unsave','block','unblock'] as const;
export const SHOP_STATES=['CREATED','PAYMENT_PENDING','PAID','PROCESSING','SHIPPED','DELIVERED','CUSTOMER_CONFIRMED','PROTECTION_PERIOD','COMPLAINT','RETURN_REQUESTED','RETURNED','REFUND_PENDING','REFUNDED','RELEASED','CANCELLED'] as const;
export const ACCOUNT_LEVELS=['NONE','WARNING','LIMITED','TEMPORARY_RESTRICTION','SUSPENDED','BANNED'] as const;
