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
}
export async function disconnectDatabases() {
    await prisma.$disconnect();
    await mongoClient.close();
}
