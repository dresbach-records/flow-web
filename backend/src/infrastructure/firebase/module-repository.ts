import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from './firestore-repository';

export type FlowCollection =
  | 'users' | 'profiles' | 'privacy' | 'devices' | 'sessions' | 'blocks' | 'security'
  | 'posts' | 'videos' | 'shorts' | 'stories' | 'lives' | 'comments' | 'likes' | 'follows'
  | 'shares' | 'saves' | 'hashtags' | 'mentions' | 'notifications'
  | 'communities' | 'community_members' | 'community_rules' | 'community_posts'
  | 'shops' | 'sellers' | 'products' | 'categories' | 'carts' | 'orders' | 'payments'
  | 'shipments' | 'deliveries' | 'order_confirmations' | 'protection_periods' | 'complaints'
  | 'returns' | 'refunds' | 'commissions' | 'affiliates'
  | 'tasks' | 'campaigns' | 'qualified_views' | 'rewards' | 'wallets' | 'ledger'
  | 'withdrawals' | 'antifraud'
  | 'advertisers' | 'ad_campaigns' | 'ad_creatives' | 'ads' | 'approved_domains'
  | 'ad_impressions' | 'ad_clicks' | 'ad_conversions' | 'ad_reports' | 'ad_reviews'
  | 'reports' | 'evidence' | 'moderation_cases' | 'moderation_actions' | 'appeals'
  | 'prohibited_content' | 'prohibited_products' | 'piracy_cases'
  | 'administrators' | 'permissions' | 'roles' | 'settings' | 'modules' | 'logs' | 'audits' | 'analytics'
  | 'conversations' | 'messages' | 'calls' | 'call_participants';

export class FirestoreModuleRepository<T extends Record<string, unknown>> {
  constructor(private readonly collection: FlowCollection) {}

  async create(data: T): Promise<string> {
    const ref = await firestore.collection(this.collection).add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp(),
    });
    return ref.id;
  }

  async get(id: string): Promise<T | null> {
    const snapshot = await firestore.collection(this.collection).doc(id).get();
    return snapshot.exists ? ({ id: snapshot.id, ...snapshot.data() } as T) : null;
  }

  async update(id: string, data: Partial<T>): Promise<void> {
    await firestore.collection(this.collection).doc(id).update({
      ...data,
      updatedAt: FieldValue.serverTimestamp(),
    });
  }

  async delete(id: string): Promise<void> {
    await firestore.collection(this.collection).doc(id).delete();
  }
}

export const flowRepositories = {
  users: new FirestoreModuleRepository('users'), profiles: new FirestoreModuleRepository('profiles'),
  posts: new FirestoreModuleRepository('posts'), videos: new FirestoreModuleRepository('videos'),
  comments: new FirestoreModuleRepository('comments'), likes: new FirestoreModuleRepository('likes'),
  follows: new FirestoreModuleRepository('follows'), stories: new FirestoreModuleRepository('stories'),
  lives: new FirestoreModuleRepository('lives'), messages: new FirestoreModuleRepository('messages'),
  conversations: new FirestoreModuleRepository('conversations'), calls: new FirestoreModuleRepository('calls'),
  communities: new FirestoreModuleRepository('communities'), shops: new FirestoreModuleRepository('shops'),
  products: new FirestoreModuleRepository('products'), orders: new FirestoreModuleRepository('orders'),
  payments: new FirestoreModuleRepository('payments'), shipments: new FirestoreModuleRepository('shipments'),
  complaints: new FirestoreModuleRepository('complaints'), returns: new FirestoreModuleRepository('returns'),
  refunds: new FirestoreModuleRepository('refunds'), commissions: new FirestoreModuleRepository('commissions'),
  rewards: new FirestoreModuleRepository('rewards'), wallets: new FirestoreModuleRepository('wallets'),
  ledger: new FirestoreModuleRepository('ledger'), withdrawals: new FirestoreModuleRepository('withdrawals'),
  ads: new FirestoreModuleRepository('ads'), adCampaigns: new FirestoreModuleRepository('ad_campaigns'),
  approvedDomains: new FirestoreModuleRepository('approved_domains'), reports: new FirestoreModuleRepository('reports'),
  moderationCases: new FirestoreModuleRepository('moderation_cases'), appeals: new FirestoreModuleRepository('appeals'),
  administrators: new FirestoreModuleRepository('administrators'), permissions: new FirestoreModuleRepository('permissions'),
  roles: new FirestoreModuleRepository('roles'), modules: new FirestoreModuleRepository('modules'),
  settings: new FirestoreModuleRepository('settings'), logs: new FirestoreModuleRepository('logs'),
  audits: new FirestoreModuleRepository('audits'), analytics: new FirestoreModuleRepository('analytics'),
};
