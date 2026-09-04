export const FLOW_COLLECTIONS = {
  posts: 'posts',
  videos: 'videos',
  comments: 'comments',
  likes: 'likes',
  feed: 'feed_items',
  reports: 'reports',
  moderation: 'moderation_actions',
  products: 'products',
  orders: 'orders',
  ads: 'ads',
  rewards: 'rewards',
  notifications: 'notifications',
} as const;

export type FlowCollection = typeof FLOW_COLLECTIONS[keyof typeof FLOW_COLLECTIONS];
