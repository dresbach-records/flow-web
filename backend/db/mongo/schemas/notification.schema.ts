export interface NotificationSchema { _id: string; userId: string; type: 'system' | 'social' | 'commerce' | 'reward' | 'moderation' | 'security'; title: string; body: string; data?: Record<string, string>; readAt?: Date; createdAt: Date; }
export const NOTIFICATION_COLLECTION = 'notifications' as const;
