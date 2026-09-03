import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../infrastructure/firebase/firebase-admin.js';

export type Actor = { uid: string; admin?: boolean; permissions?: string[] };

const RESERVED = new Set(['users','admin_users','roles','permissions','audit_logs','wallet_ledger','payments']);

export class FlowModuleService {
  private db = firestore();
  private ref(collection: string) { return this.db.collection(collection); }

  async list(collection: string, limit = 25, cursor?: string) {
    let q: FirebaseFirestore.Query = this.ref(collection).orderBy('createdAt','desc').limit(Math.min(Math.max(limit,1),100));
    if (cursor) { const snap = await this.ref(collection).doc(cursor).get(); if (snap.exists) q = q.startAfter(snap); }
    const result = await q.get();
    return { items: result.docs.map(d => ({ id:d.id, ...d.data() })), nextCursor: result.docs.length ? result.docs[result.docs.length-1].id : null };
  }

  async get(collection:string,id:string) { const d=await this.ref(collection).doc(id).get(); if(!d.exists) return null; return {id:d.id,...d.data()}; }

  async create(collection:string, data:Record<string,unknown>, actor:Actor) {
    const now=FieldValue.serverTimestamp();
    const ref=this.ref(collection).doc();
    await ref.create({ ...data, ownerId:actor.uid, createdAt:now, updatedAt:now });
    return this.get(collection,ref.id);
  }

  async update(collection:string,id:string,data:Record<string,unknown>,actor:Actor) {
    const ref=this.ref(collection).doc(id); const current=await ref.get();
    if(!current.exists) return null;
    const owner=current.get('ownerId');
    if(owner && owner!==actor.uid && !actor.admin) throw new Error('FORBIDDEN');
    delete data.ownerId; delete data.createdAt;
    await ref.update({...data,updatedAt:FieldValue.serverTimestamp()});
    return this.get(collection,id);
  }

  async remove(collection:string,id:string,actor:Actor) {
    const ref=this.ref(collection).doc(id); const current=await ref.get();
    if(!current.exists) return false;
    const owner=current.get('ownerId');
    if(owner && owner!==actor.uid && !actor.admin) throw new Error('FORBIDDEN');
    await ref.delete(); return true;
  }

  async audit(actor:Actor, action:string, resource:string, resourceId:string, metadata:Record<string,unknown>={}) {
    await this.ref('audit_logs').add({ actorId:actor.uid, action, resource, resourceId, metadata, createdAt:FieldValue.serverTimestamp() });
  }
}

export const flowCollections = [
'users','profiles','privacy','accounts','sessions','devices','blocks','security_events',
'pages','page_members','page_roles','page_posts','page_analytics','communities','community_members','community_roles','community_rules','community_posts',
'posts','videos','shorts','stories','lives','comments','likes','shares','saves','follows','hashtags','mentions','notifications',
'conversations','messages','calls','call_participants',
'shops','sellers','categories','products','carts','orders','order_items','payments','shipments','deliveries','protection_periods','complaints','returns','refunds','commissions','affiliates',
'reward_tasks','reward_campaigns','qualified_views','rewards','wallets','wallet_ledger','withdrawals','anti_fraud_events',
'advertisers','ad_accounts','ad_campaigns','ad_groups','ads','creatives','audiences','approved_domains','ad_reviews','ad_impressions','ad_clicks','ad_conversions',
'reports','moderation_cases','moderation_evidence','moderation_actions','appeals','content_policies','product_policies','copyright_cases','piracy_cases',
'admin_users','roles','permissions','admin_sessions','module_settings','platform_settings','analytics_events','audit_logs'
] as const;

export function isReserved(collection:string){ return RESERVED.has(collection); }
