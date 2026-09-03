export const FIRESTORE_COLLECTIONS = {
  users: 'users', profiles: 'profiles', creators: 'creators', businesses: 'businesses',
  communities: 'communities', posts: 'posts', videos: 'videos', comments: 'comments',
  likes: 'likes', follows: 'follows', shares: 'shares', stories: 'stories', lives: 'lives',
  messages: 'messages', notifications: 'notifications', reports: 'reports', moderation: 'moderation',
  blockedUsers: 'blocked_users', shops: 'shops', products: 'products', orders: 'orders',
  returns: 'returns', complaints: 'complaints', shipments: 'shipments', ads: 'ads',
  adCampaigns: 'ad_campaigns', adImpressions: 'ad_impressions', adClicks: 'ad_clicks',
  rewards: 'rewards', tasks: 'tasks', rewardTransactions: 'reward_transactions',
  influencers: 'influencers', commissions: 'commissions', payouts: 'payouts', auditLogs: 'audit_logs',
} as const;

export type FirestoreCollection = typeof FIRESTORE_COLLECTIONS[keyof typeof FIRESTORE_COLLECTIONS];
