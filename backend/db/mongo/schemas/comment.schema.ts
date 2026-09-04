export interface CommentSchema { _id: string; postId: string; authorId: string; parentId?: string; body: string; status: 'active' | 'hidden' | 'deleted'; likesCount: number; createdAt: Date; updatedAt: Date; }
export const COMMENT_COLLECTION = 'comments' as const;
