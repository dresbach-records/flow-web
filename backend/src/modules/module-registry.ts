export type ModuleKind = 'user' | 'social' | 'commerce' | 'finance' | 'moderation' | 'admin' | 'communication';
export interface FlowModule { key:string; kind:ModuleKind; collection:string; admin:boolean; routes:string[]; }

/** Canonical module registry. Runtime modules must bind repositories/use-cases to these contracts; no mock implementation is permitted. */
export const FLOW_MODULES: FlowModule[] = [
{key:'account',kind:'user',collection:'accounts',admin:true,routes:['GET /api/v1/account','PATCH /api/v1/account','DELETE /api/v1/account']},
{key:'auth',kind:'user',collection:'auth_sessions',admin:true,routes:['POST /api/v1/auth/register','POST /api/v1/auth/login','POST /api/v1/auth/logout','POST /api/v1/auth/password-reset','GET /api/v1/auth/me']},
{key:'verification',kind:'user',collection:'verifications',admin:true,routes:['POST /api/v1/verification','GET /api/v1/verification/status']},
{key:'account-recovery',kind:'user',collection:'account_recovery_requests',admin:true,routes:['POST /api/v1/account/recovery/hacked','POST /api/v1/account/recovery/evidence','GET /api/v1/account/recovery/:id']},
{key:'security',kind:'user',collection:'security_events',admin:true,routes:['GET /api/v1/security/events','POST /api/v1/security/devices/revoke']},
{key:'blocks',kind:'social',collection:'blocks',admin:true,routes:['POST /api/v1/blocks','DELETE /api/v1/blocks/:id','GET /api/v1/blocks']},
{key:'social',kind:'social',collection:'posts',admin:true,routes:['GET /api/v1/feed','POST /api/v1/posts','GET /api/v1/posts/:id','PATCH /api/v1/posts/:id','DELETE /api/v1/posts/:id']},
{key:'media',kind:'social',collection:'videos',admin:true,routes:['POST /api/v1/videos','POST /api/v1/shorts','POST /api/v1/stories','POST /api/v1/lives']},
{key:'engagement',kind:'social',collection:'likes',admin:true,routes:['POST /api/v1/posts/:id/like','DELETE /api/v1/posts/:id/like','POST /api/v1/posts/:id/share','POST /api/v1/posts/:id/save']},
{key:'comments',kind:'social',collection:'comments',admin:true,routes:['GET /api/v1/posts/:id/comments','POST /api/v1/posts/:id/comments','DELETE /api/v1/comments/:id']},
{key:'connections',kind:'social',collection:'follows',admin:true,routes:['POST /api/v1/users/:id/follow','DELETE /api/v1/users/:id/follow','GET /api/v1/users/:id/followers','GET /api/v1/users/:id/following']},
{key:'pages',kind:'social',collection:'pages',admin:true,routes:['POST /api/v1/pages','GET /api/v1/pages/:id','PATCH /api/v1/pages/:id','DELETE /api/v1/pages/:id','POST /api/v1/pages/:id/members']},
{key:'communities',kind:'social',collection:'communities',admin:true,routes:['POST /api/v1/communities','GET /api/v1/communities/:id','PATCH /api/v1/communities/:id','POST /api/v1/communities/:id/members','POST /api/v1/communities/:id/posts']},
{key:'messaging',kind:'communication',collection:'messages',admin:true,routes:['GET /api/v1/conversations','POST /api/v1/conversations','GET /api/v1/conversations/:id/messages','POST /api/v1/conversations/:id/messages','DELETE /api/v1/messages/:id']},
{key:'calls',kind:'communication',collection:'calls',admin:true,routes:['POST /api/v1/calls','POST /api/v1/calls/:id/end','GET /api/v1/calls/:id']},
{key:'notifications',kind:'communication',collection:'notifications',admin:true,routes:['GET /api/v1/notifications','PATCH /api/v1/notifications/:id/read','POST /api/v1/notifications/read-all','DELETE /api/v1/notifications/:id','DELETE /api/v1/notifications']},
{key:'shop',kind:'commerce',collection:'shops',admin:true,routes:['POST /api/v1/shops','GET /api/v1/shops/:id','PATCH /api/v1/shops/:id']},
{key:'products',kind:'commerce',collection:'products',admin:true,routes:['POST /api/v1/products','GET /api/v1/products','GET /api/v1/products/:id','PATCH /api/v1/products/:id','DELETE /api/v1/products/:id']},
{key:'cart',kind:'commerce',collection:'carts',admin:true,routes:['GET /api/v1/cart','POST /api/v1/cart/items','PATCH /api/v1/cart/items/:id','DELETE /api/v1/cart/items/:id']},
{key:'orders',kind:'commerce',collection:'orders',admin:true,routes:['POST /api/v1/orders','GET /api/v1/orders','GET /api/v1/orders/:id','POST /api/v1/orders/:id/confirm-delivery']},
{key:'returns',kind:'commerce',collection:'returns',admin:true,routes:['POST /api/v1/orders/:id/complaints','POST /api/v1/orders/:id/returns','POST /api/v1/orders/:id/refund']},
{key:'payments',kind:'finance',collection:'payments',admin:true,routes:['POST /api/v1/payments/checkout','GET /api/v1/payments/:id','POST /api/v1/payments/webhook']},
{key:'commissions',kind:'finance',collection:'commissions',admin:true,routes:['GET /api/v1/commissions','GET /api/v1/commissions/:id']},
{key:'affiliates',kind:'finance',collection:'affiliates',admin:true,routes:['POST /api/v1/affiliates','GET /api/v1/affiliates','GET /api/v1/affiliates/:id']},
{key:'rewards',kind:'finance',collection:'rewards',admin:true,routes:['GET /api/v1/rewards/tasks','POST /api/v1/rewards/tasks/:id/complete','GET /api/v1/wallet','GET /api/v1/wallet/ledger','POST /api/v1/wallet/withdrawals']},
{key:'ads',kind:'finance',collection:'ad_campaigns',admin:true,routes:['POST /api/v1/ads/accounts','POST /api/v1/ads/campaigns','GET /api/v1/ads/campaigns','POST /api/v1/ads/:id/submit','POST /api/v1/ads/:id/appeal','GET /api/v1/ads/:id/analytics']},
{key:'ad-billing',kind:'finance',collection:'ad_balance_ledger',admin:true,routes:['POST /api/v1/ads/billing/top-up','GET /api/v1/ads/billing/ledger']},
{key:'moderation',kind:'moderation',collection:'moderation_cases',admin:true,routes:['POST /api/v1/reports','GET /api/v1/moderation/cases/:id','POST /api/v1/moderation/cases/:id/action','POST /api/v1/moderation/cases/:id/appeal']},
{key:'policies',kind:'moderation',collection:'content_policies',admin:true,routes:['GET /api/v1/policies/content','GET /api/v1/policies/products','GET /api/v1/policies/ads']},
{key:'admin',kind:'admin',collection:'admin_users',admin:true,routes:['GET /api/v1/admin/dashboard','GET /api/v1/admin/users','GET /api/v1/admin/reports','GET /api/v1/admin/moderation','GET /api/v1/admin/ads','GET /api/v1/admin/shop','GET /api/v1/admin/analytics']},
{key:'rbac',kind:'admin',collection:'roles',admin:true,routes:['GET /api/v1/admin/roles','POST /api/v1/admin/roles','PATCH /api/v1/admin/roles/:id']},
{key:'audit',kind:'admin',collection:'audit_logs',admin:true,routes:['GET /api/v1/admin/audit','GET /api/v1/admin/logs']},
{key:'analytics',kind:'admin',collection:'analytics_events',admin:true,routes:['POST /api/v1/analytics/events','GET /api/v1/admin/analytics']}
];

export const FLOW_MODULE_KEYS = FLOW_MODULES.map(m => m.key);
