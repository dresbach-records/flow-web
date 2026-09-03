import { PrismaClient } from '@prisma/client';
import { MongoClient } from 'mongodb';
import { env } from '../config/env.js';
export const prisma = new PrismaClient();
export const mongoClient = new MongoClient(env.MONGODB_URI);
export const mongoDb = mongoClient.db(env.MONGODB_DATABASE);
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
}
export async function disconnectDatabases() {
    await prisma.$disconnect();
    await mongoClient.close();
}
