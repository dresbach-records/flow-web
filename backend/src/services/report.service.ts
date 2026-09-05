import { firestore } from '../infrastructure/database.js';

function required(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`REPORT_INVALID_${name.toUpperCase()}`);
  }
  return value.trim();
}

export async function createReport(input: { reporterId: string; targetType: string; targetId: string; category: string; description?: string }) {
  const reporterId = required(input?.reporterId, 'reporterId');
  const targetType = required(input?.targetType, 'targetType');
  const targetId = required(input?.targetId, 'targetId');
  const category = required(input?.category, 'category');
  const description = typeof input?.description === 'string' ? input.description.slice(0, 2000) : null;
  const now = new Date();
  const report = { reporterId, targetType, targetId, category, description, status: 'OPEN', createdAt: now, updatedAt: now };
  const ref = await firestore().collection('reports').add(report);
  return { id: ref.id, ...report };
}
