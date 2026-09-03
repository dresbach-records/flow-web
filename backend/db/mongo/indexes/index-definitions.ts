export const MONGO_INDEXES = {
  posts: [
    { key: { authorId: 1, createdAt: -1 } },
    { key: { status: 1, createdAt: -1 } },
    { key: { hashtags: 1, createdAt: -1 } },
  ],
  videos: [
    { key: { authorId: 1, createdAt: -1 } },
    { key: { moderationStatus: 1, createdAt: -1 } },
    { key: { visibility: 1, createdAt: -1 } },
  ],
  comments: [
    { key: { postId: 1, createdAt: 1 } },
    { key: { authorId: 1, createdAt: -1 } },
  ],
  likes: [
    { key: { userId: 1, targetId: 1, targetType: 1 }, options: { unique: true } },
    { key: { targetId: 1, targetType: 1, createdAt: -1 } },
  ],
  feed_items: [
    { key: { userId: 1, score: -1, createdAt: -1 } },
    { key: { expiresAt: 1 }, options: { expireAfterSeconds: 0 } },
  ],
  reports: [
    { key: { status: 1, createdAt: -1 } },
    { key: { targetId: 1, targetType: 1, createdAt: -1 } },
    { key: { reporterId: 1, createdAt: -1 } },
  ],
  moderation_actions: [
    { key: { targetId: 1, targetType: 1, createdAt: -1 } },
    { key: { source: 1, createdAt: -1 } },
  ],
  products: [
    { key: { sellerId: 1, status: 1, createdAt: -1 } },
    { key: { categoryId: 1, status: 1, createdAt: -1 } },
    { key: { policyStatus: 1, createdAt: -1 } },
  ],
  orders: [
    { key: { buyerId: 1, createdAt: -1 } },
    { key: { sellerId: 1, createdAt: -1 } },
    { key: { status: 1, payoutEligibleAt: 1 } },
  ],
  ads: [
    { key: { advertiserId: 1, status: 1, createdAt: -1 } },
    { key: { reviewStatus: 1, createdAt: -1 } },
    { key: { status: 1, startsAt: 1, endsAt: 1 } },
  ],
  rewards: [
    { key: { userId: 1, createdAt: -1 } },
    { key: { idempotencyKey: 1 }, options: { unique: true } },
    { key: { status: 1, createdAt: -1 } },
  ],
  notifications: [
    { key: { userId: 1, readAt: 1, createdAt: -1 } },
  ],
} as const;
