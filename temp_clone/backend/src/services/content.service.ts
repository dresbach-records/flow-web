import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../infrastructure/database.js';
import { GuardianFeatureFlagService } from '../application/guardian/feature-flag.service.js';
import { ModerateContentUseCase } from '../application/guardian/moderate-content.use-case.js';
import { GeminiGuardianAdapter } from '../infrastructure/ai/vertex-ai/gemini-guardian.adapter.js';
import { FirestoreModerationRepository } from '../infrastructure/guardian/firestore-moderation.repository.js';

const guardian = new ModerateContentUseCase(
  new GuardianFeatureFlagService(),
  new GeminiGuardianAdapter(),
  new FirestoreModerationRepository(),
);

export async function listFeed(userId: string | undefined, mode: 'for-you' | 'following' = 'for-you') {
  const posts = firestore().collection('posts');
  let query = posts.where('visibility', '==', 'public').orderBy('createdAt', 'desc').limit(30);

  if (mode === 'following' && userId) {
    query = posts.where('visibility', '==', 'public').orderBy('createdAt', 'desc').limit(30);
  }

  const snapshot = await query.get();
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

export async function createPost(input: { authorId: string; type: 'post' | 'short' | 'video'; caption?: string; mediaUrl?: string; visibility?: string }) {
  const moderation = await guardian.execute({
    authorId: input.authorId,
    contentType: input.type,
    text: input.caption,
    mediaUrl: input.mediaUrl,
  });

  if (moderation.action === 'block') {
    const error = new Error('CONTENT_BLOCKED_BY_GUARDIAN');
    (error as Error & { moderation?: unknown }).moderation = moderation;
    throw error;
  }

  const now = new Date();
  const post = {
    ...input,
    visibility: moderation.action === 'review' ? 'moderation' : (input.visibility ?? 'public'),
    moderationStatus: moderation.action === 'review' ? 'review' : 'approved',
    ...(moderation.action !== 'disabled' ? {
      moderationCategory: moderation.category,
      moderationConfidence: moderation.confidence,
      moderationModel: moderation.model,
    } : {}),
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const ref = await firestore().collection('posts').add(post);
  return { id: ref.id, ...post };
}

export async function likePost(postId: string, userId: string) {
  const db = firestore();
  const postRef = db.collection('posts').doc(postId);
  const likeRef = db.collection('post_likes').doc(`${postId}_${userId}`);

  await db.runTransaction(async (tx) => {
    const [postSnap, likeSnap] = await Promise.all([tx.get(postRef), tx.get(likeRef)]);
    if (!postSnap.exists) throw new Error('POST_NOT_FOUND');
    if (likeSnap.exists) return;

    tx.create(likeRef, { postId, userId, createdAt: new Date() });
    tx.update(postRef, { likesCount: FieldValue.increment(1), updatedAt: new Date() });
  });

  return { liked: true };
}
