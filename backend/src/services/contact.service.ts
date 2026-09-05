import { firestore } from '../infrastructure/database.js';

function required(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`CONTACT_INVALID_${name.toUpperCase()}`);
  }
  return value.trim();
}

export async function createContactMessage(input: {
  name: string;
  email: string;
  subject: string;
  category: string;
  message: string;
}) {
  const name = required(input?.name, 'name').slice(0, 120);
  const email = required(input?.email, 'email').slice(0, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('CONTACT_INVALID_EMAIL');
  const subject = required(input?.subject, 'subject').slice(0, 160);
  const category = required(input?.category, 'category').slice(0, 80);
  const message = required(input?.message, 'message').slice(0, 5000);
  const now = new Date();
  const record = { name, email, subject, category, message, status: 'OPEN', createdAt: now, updatedAt: now };
  const ref = await firestore().collection('contact_messages').add(record);
  return { id: ref.id, ...record };
}
