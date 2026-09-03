export const moderationActions = ['allow', 'review', 'block'] as const;
export type ModerationAction = (typeof moderationActions)[number];

export const moderationCategories = [
  'none',
  'harassment',
  'hate',
  'sexual',
  'violence',
  'self_harm',
  'spam',
  'illegal',
  'privacy',
  'other',
] as const;
export type ModerationCategory = (typeof moderationCategories)[number];

export type ModerationResult = {
  action: ModerationAction;
  category: ModerationCategory;
  confidence: number;
  reason: string;
  model: string;
};

export type GuardianInput = {
  authorId: string;
  contentType: 'post' | 'short' | 'video';
  text?: string;
  mediaUrl?: string;
};
