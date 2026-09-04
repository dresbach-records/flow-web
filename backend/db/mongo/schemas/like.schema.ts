export interface LikeSchema { _id: string; userId: string; targetId: string; targetType: 'post' | 'video' | 'comment'; createdAt: Date; }
export const LIKE_COLLECTION = 'likes' as const;
