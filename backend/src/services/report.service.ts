import { mongoDb } from '../infrastructure/database.js';

export async function createReport(input: { reporterId: string; targetType: string; targetId: string; category: string; description?: string }) {
  const report = { ...input, status: 'OPEN', createdAt: new Date(), updatedAt: new Date() };
  const result = await mongoDb.collection('reports').insertOne(report);
  return { id: result.insertedId.toString(), ...report };
}
