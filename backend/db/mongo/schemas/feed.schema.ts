export interface FeedSchema { _id: string; userId: string; itemId: string; itemType: 'post' | 'video'; score: number; reason: 'following' | 'interest' | 'trending' | 'recommended'; expiresAt?: Date; createdAt: Date; }
export const FEED_COLLECTION = 'feed_items' as const;
