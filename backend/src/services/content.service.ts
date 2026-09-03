import { ObjectId } from 'mongodb';
import { mongoDb } from '../infrastructure/database.js';

export async function listFeed(userId: string | undefined, mode: 'for-you' | 'following' = 'for-you') {
  const query = mode === 'following' && userId ? { visibility: 'public', authorId: { $exists: true } } : { visibility: 'public' };
  return mongoDb.collection('posts').find(query).sort({ createdAt: -1 }).limit(30).toArray();
}

export async function createPost(input: { authorId: string; type: 'post' | 'short' | 'video'; caption?: string; mediaUrl?: string; visibility?: string }) {
  const post = { ...input, visibility: input.visibility ?? 'public', likesCount: 0, commentsCount: 0, sharesCount: 0, createdAt: new Date(), updatedAt: new Date() };
  const result = await mongoDb.collection('posts').insertOne(post);
  return { id: result.insertedId.toString(), ...post };
}

export async function likePost(postId: string, userId: string) {
  const post = await mongoDb.collection('posts').findOne({ _id: new ObjectId(postId) });
  if (!post) throw new Error('POST_NOT_FOUND');
  const result = await mongoDb.collection('post_likes').updateOne({ postId, userId }, { $setOnInsert: { postId, userId, createdAt: new Date() } }, { upsert: true });
  if (result.upsertedCount === 1) await mongoDb.collection('posts').updateOne({ _id: new ObjectId(postId) }, { $inc: { likesCount: 1 } });
  return { liked: true, created: result.upsertedCount === 1 };
}
