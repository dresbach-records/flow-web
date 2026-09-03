export type Visibility = 'PUBLIC' | 'FOLLOWERS' | 'PRIVATE';
export type ContentStatus = 'DRAFT' | 'ACTIVE' | 'UNDER_REVIEW' | 'HIDDEN' | 'REMOVED';

export interface PostSchema { id: string; authorId: string; text?: string; media?: { storagePath: string; mimeType: string; width?: number; height?: number; durationMs?: number }[]; visibility: Visibility; status: ContentStatus; hashtags?: string[]; mentions?: string[]; likesCount: number; commentsCount: number; sharesCount: number; viewsCount: number; createdAt: unknown; updatedAt: unknown; }
export interface VideoSchema extends PostSchema { videoStoragePath: string; thumbnailStoragePath?: string; durationMs: number; processingStatus: 'PENDING' | 'PROCESSING' | 'READY' | 'FAILED'; }
export interface StorySchema { id: string; authorId: string; mediaStoragePath: string; mimeType: string; visibility: Visibility; expiresAt: unknown; viewsCount: number; createdAt: unknown; }
export interface LiveSchema { id: string; hostId: string; title: string; status: 'SCHEDULED' | 'LIVE' | 'ENDED' | 'CANCELLED'; startedAt?: unknown; endedAt?: unknown; viewerCount: number; createdAt: unknown; updatedAt: unknown; }
export interface CommentSchema { id: string; targetId: string; targetType: 'POST' | 'VIDEO' | 'LIVE'; authorId: string; text: string; parentId?: string; status: ContentStatus; likesCount: number; createdAt: unknown; updatedAt: unknown; }
export interface FollowSchema { id: string; followerId: string; followingId: string; createdAt: unknown; }
export interface LikeSchema { id: string; userId: string; targetType: 'POST' | 'VIDEO' | 'COMMENT'; targetId: string; createdAt: unknown; }
export interface NotificationSchema { id: string; userId: string; actorId?: string; type: string; entityId?: string; read: boolean; createdAt: unknown; }
