export type CommerceAdProvider = 'google_ad_manager' | 'flow_internal';
export type ReportPriority = 'normal' | 'high' | 'urgent' | 'critical';
export type ReportCategory = 'illegal_content' | 'violence' | 'child_safety' | 'sexual_content' | 'harassment' | 'hate' | 'fraud' | 'spam' | 'copyright' | 'privacy' | 'self_harm' | 'prohibited_sale' | 'impersonation' | 'other';

export interface NativeAdPost { id:string; provider:CommerceAdProvider; advertiserName:string; advertiserLogo?:string; headline:string; body?:string; imageUrl?:string; videoUrl?:string; destinationUrl:string; callToAction:string; sponsoredLabel:string; adChoicesUrl?:string; campaignId?:string; placement:string; }
export interface ReportCase { id:string; targetType:'post'|'short'|'story'|'live'|'comment'|'user'|'ad'|'store'|'product'; targetId:string; category:ReportCategory; description?:string; priority:ReportPriority; status:'received'|'reviewing'|'actioned'|'dismissed'; createdAt:string; protocol:string; }
export interface Store { id:string; slug:string; name:string; logoUrl?:string; coverUrl?:string; description?:string; verified:boolean; followers:number; rating:number; }
export interface Product { id:string; storeId:string; slug:string; name:string; description?:string; imageUrl?:string; price:number; compareAtPrice?:number; currency:'BRL'; stock:number; rating:number; reviews:number; }

export const REPORT_CATEGORIES: Array<{id:ReportCategory;label:string}> = [
 {id:'illegal_content',label:'Conteúdo ilegal'},{id:'violence',label:'Violência'},{id:'child_safety',label:'Segurança de crianças e adolescentes'},
 {id:'sexual_content',label:'Nudez ou conteúdo sexual'},{id:'harassment',label:'Assédio'},{id:'hate',label:'Ódio ou discriminação'},
 {id:'fraud',label:'Golpe ou fraude'},{id:'spam',label:'Spam'},{id:'copyright',label:'Direitos autorais'},{id:'privacy',label:'Privacidade'},
 {id:'self_harm',label:'Automutilação ou suicídio'},{id:'prohibited_sale',label:'Venda de produto proibido'},{id:'impersonation',label:'Conta falsa ou impersonação'},{id:'other',label:'Outro'}
];
