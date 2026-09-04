import { firebaseAuth, firestore, firebaseStorage } from './firebase/firebase-admin.js';

export { firebaseAuth, firestore, firebaseStorage };

export async function connectDatabases() {

  await prisma.$connect();
  await mongoClient.connect();
  await mongoDb.command({ ping: 1 });
  await Promise.all([
    mongoDb.collection('posts').createIndex({ visibility: 1, createdAt: -1 }),
    mongoDb.collection('posts').createIndex({ authorId: 1, createdAt: -1 }),
    mongoDb.collection('post_likes').createIndex({ postId: 1, userId: 1 }, { unique: true }),
    mongoDb.collection('comments').createIndex({ postId: 1, createdAt: 1 }),
    mongoDb.collection('reports').createIndex({ status: 1, priority: -1, createdAt: -1 }),
    mongoDb.collection('products').createIndex({ storeId: 1, moderationStatus: 1, createdAt: -1 }),
    mongoDb.collection('orders').createIndex({ buyerId: 1, createdAt: -1 }),
  ]);

  await firestore().collection('_health').limit(1).get();
main
}

export async function disconnectDatabases() {
  // Firebase Admin manages its own connections.
}
