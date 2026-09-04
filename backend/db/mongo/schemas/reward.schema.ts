export interface RewardSchema { _id: string; userId: string; taskId: string; source: 'ad_view' | 'video_watch' | 'daily_task' | 'campaign' | 'referral'; amountCents: number; status: 'pending' | 'credited' | 'reversed'; idempotencyKey: string; metadata?: Record<string, string>; createdAt: Date; creditedAt?: Date; }
export const REWARD_COLLECTION = 'rewards' as const;
