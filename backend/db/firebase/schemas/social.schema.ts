import type { Timestamp } from 'firebase-admin/firestore';
export interface Post { id:string; authorId:string; text?:string; media?:string[]; visibility:string; status:string; likeCount:number; commentCount:number; shareCount:number; saveCount:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Video extends Post { durationMs:number; storagePath:string; thumbnailPath?:string; processingStatus:string; }
export interface Short extends Video { algorithmScore?:number; }
export interface Story { id:string; authorId:string; mediaPath:string; expiresAt:Timestamp; viewersCount:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Live { id:string; hostId:string; title:string; status:string; startedAt?:Timestamp; endedAt?:Timestamp; viewerCount:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Comment { id:string; authorId:string; targetId:string; targetType:string; parentId?:string; text:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Like { id:string; userId:string; targetId:string; targetType:string; idempotencyKey:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Follow { id:string; followerId:string; followingId:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Share { id:string; userId:string; targetId:string; targetType:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Save { id:string; userId:string; targetId:string; targetType:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Hashtag { id:string; tag:string; normalized:string; usageCount:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Mention { id:string; sourceId:string; mentionedUserId:string; sourceType:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Notification { id:string; userId:string; type:string; actorId?:string; entityId?:string; readAt?:Timestamp; payload?:Record<string,unknown>; createdAt:Timestamp; updatedAt:Timestamp; }
export interface Community { id:string; ownerId:string; name:string; slug:string; description?:string; visibility:string; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface CommunityMember { id:string; communityId:string; userId:string; role:'MEMBER'|'ADMIN'|'MODERATOR'; status:string; createdAt:Timestamp; updatedAt:Timestamp; }
export interface CommunityRule { id:string; communityId:string; title:string; description:string; order:number; createdAt:Timestamp; updatedAt:Timestamp; }
export interface CommunityPost extends Post { communityId:string; }
