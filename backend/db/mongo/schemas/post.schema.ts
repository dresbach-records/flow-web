export interface PostSchema { _id: string; authorId: string; type: 'text' | 'image' | 'video'; caption?: string; mediaUrl?: string; visibility: 'public' | 'followers' | 'private'; hashtags: string[]; status: 'active' | 'hidden' | 'deleted'; likesCount: number; commentsCount: number; viewsCount: number; createdAt: Date; updatedAt: Date; }
export const POST_COLLECTION = 'posts' as const;
