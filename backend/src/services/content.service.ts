import { FieldValue } from 'firebase-admin/firestore';
import { firestore } from '../infrastructure/database.js';

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
  const now = new Date();
  const post = {
    ...input,
    visibility: input.visibility ?? 'public',
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
