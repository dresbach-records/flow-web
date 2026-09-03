import { firestore } from '../infrastructure/database.js';

export async function createReport(input: { reporterId: string; targetType: string; targetId: string; category: string; description?: string }) {
  const now = new Date();
  const report = { ...input, status: 'OPEN', createdAt: now, updatedAt: now };
  const ref = await firestore().collection('reports').add(report);
  return { id: ref.id, ...report };
}
