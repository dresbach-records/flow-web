import { Router } from 'express';
import { z } from 'zod';

export const FLOW_MODULES = [
  'account','auth','security','social','communities','shop','rewards','ads','moderation','admin','communications','analytics'
] as const;

export type FlowModule = typeof FLOW_MODULES[number];

const id = z.string().min(1);
const page = z.coerce.number().int().min(1).default(1);
const limit = z.coerce.number().int().min(1).max(100).default(20);

export const commonQuerySchema = z.object({ page, limit, cursor: z.string().optional() });

export const endpointCatalog: Record<FlowModule, string[]> = {
  account: [
    'GET /api/v1/account/me','PATCH /api/v1/account/me','DELETE /api/v1/account/me',
    'GET /api/v1/account/:userId','POST /api/v1/account/verify','POST /api/v1/account/recovery/request',
    'POST /api/v1/account/recovery/reset','GET /api/v1/account/sessions','DELETE /api/v1/account/sessions/:sessionId',
    'GET /api/v1/account/devices','DELETE /api/v1/account/devices/:deviceId','POST /api/v1/account/blocks/:userId','DELETE /api/v1/account/blocks/:userId'
  ],
  auth: [
    'POST /api/v1/auth/register','POST /api/v1/auth/login','POST /api/v1/auth/logout','POST /api/v1/auth/refresh',
    'POST /api/v1/auth/forgot-password','POST /api/v1/auth/reset-password','POST /api/v1/auth/verify-email'
  ],
  security: [
    'GET /api/v1/security/status','POST /api/v1/security/2fa','DELETE /api/v1/security/2fa','GET /api/v1/security/events'
  ],
  social: [
    'GET /api/v1/feed','GET /api/v1/feed/following','GET /api/v1/posts/:id','POST /api/v1/posts','PATCH /api/v1/posts/:id','DELETE /api/v1/posts/:id',
    'POST /api/v1/posts/:id/like','DELETE /api/v1/posts/:id/like','POST /api/v1/posts/:id/share','POST /api/v1/posts/:id/save','DELETE /api/v1/posts/:id/save',
    'GET /api/v1/videos','POST /api/v1/videos','GET /api/v1/shorts','POST /api/v1/shorts','GET /api/v1/stories','POST /api/v1/stories',
    'GET /api/v1/lives','POST /api/v1/lives','POST /api/v1/lives/:id/end','GET /api/v1/posts/:id/comments','POST /api/v1/posts/:id/comments',
    'DELETE /api/v1/comments/:id','POST /api/v1/users/:userId/follow','DELETE /api/v1/users/:userId/follow','GET /api/v1/hashtags/:tag',
    'GET /api/v1/search','GET /api/v1/notifications'
  ],
  communications: [
    'GET /api/v1/conversations','POST /api/v1/conversations','GET /api/v1/conversations/:id/messages','POST /api/v1/conversations/:id/messages',
    'PATCH /api/v1/messages/:id/read','DELETE /api/v1/messages/:id','POST /api/v1/calls','POST /api/v1/calls/:id/answer',
    'POST /api/v1/calls/:id/decline','POST /api/v1/calls/:id/end','GET /api/v1/calls/:id'
  ],
  communities: [
    'GET /api/v1/communities','POST /api/v1/communities','GET /api/v1/communities/:slug','PATCH /api/v1/communities/:slug',
    'POST /api/v1/communities/:slug/members','DELETE /api/v1/communities/:slug/members/:userId','POST /api/v1/communities/:slug/moderators',
    'GET /api/v1/communities/:slug/rules','POST /api/v1/communities/:slug/posts','POST /api/v1/communities/:slug/reports'
  ],
  shop: [
    'GET /api/v1/shops','POST /api/v1/shops','GET /api/v1/shops/:id','PATCH /api/v1/shops/:id','GET /api/v1/products','POST /api/v1/products',
    'PATCH /api/v1/products/:id','DELETE /api/v1/products/:id','GET /api/v1/categories','GET /api/v1/cart','POST /api/v1/cart/items',
    'DELETE /api/v1/cart/items/:id','POST /api/v1/orders','GET /api/v1/orders','GET /api/v1/orders/:id','POST /api/v1/orders/:id/payment',
    'POST /api/v1/orders/:id/shipment','POST /api/v1/orders/:id/delivery/confirm','POST /api/v1/orders/:id/complaints',
    'POST /api/v1/orders/:id/returns','POST /api/v1/orders/:id/refund','GET /api/v1/orders/:id/protection','GET /api/v1/affiliates','GET /api/v1/commissions'
  ],
  rewards: [
    'GET /api/v1/rewards/tasks','POST /api/v1/rewards/tasks/:id/complete','GET /api/v1/rewards/campaigns','GET /api/v1/rewards/wallet',
    'GET /api/v1/rewards/ledger','POST /api/v1/rewards/withdrawals','GET /api/v1/rewards/withdrawals','POST /api/v1/rewards/impressions/qualify'
  ],
  ads: [
    'GET /api/v1/ads/advertisers','POST /api/v1/ads/advertisers','GET /api/v1/ads/campaigns','POST /api/v1/ads/campaigns',
    'PATCH /api/v1/ads/campaigns/:id','POST /api/v1/ads/creatives','POST /api/v1/ads/domains','GET /api/v1/ads/domains',
    'POST /api/v1/ads/events/impression','POST /api/v1/ads/events/click','POST /api/v1/ads/events/conversion','POST /api/v1/ads/reports'
  ],
  moderation: [
    'POST /api/v1/reports','GET /api/v1/reports/:id','POST /api/v1/reports/:id/evidence','POST /api/v1/moderation/cases',
    'POST /api/v1/moderation/cases/:id/actions','POST /api/v1/moderation/cases/:id/appeal','GET /api/v1/moderation/policies',
    'POST /api/v1/moderation/content/check','POST /api/v1/moderation/products/check','POST /api/v1/moderation/copyright/check'
  ],
  admin: [
    'POST /api/v1/admin/auth/login','POST /api/v1/admin/auth/logout','GET /api/v1/admin/dashboard','GET /api/v1/admin/users',
    'GET /api/v1/admin/content','GET /api/v1/admin/posts','GET /api/v1/admin/shorts','GET /api/v1/admin/stories','GET /api/v1/admin/lives',
    'GET /api/v1/admin/comments','GET /api/v1/admin/reports','GET /api/v1/admin/moderators','GET /api/v1/admin/creators',
    'GET /api/v1/admin/communities','GET /api/v1/admin/security','GET /api/v1/admin/analytics','GET /api/v1/admin/reports',
    'GET /api/v1/admin/settings','GET /api/v1/admin/audit','GET /api/v1/admin/logs','GET /api/v1/admin/modules'
  ],
  analytics: [
    'GET /api/v1/analytics/profile','GET /api/v1/analytics/content','GET /api/v1/analytics/shop','GET /api/v1/analytics/ads','GET /api/v1/analytics/rewards'
  ]
};

export function createModuleRouter(module: FlowModule): Router {
  const router = Router();
  router.get('/_catalog', (_req, res) => res.json({ module, endpoints: endpointCatalog[module] }));
  return router;
}

export function assertResourceId(value: unknown): string { return id.parse(value); }
