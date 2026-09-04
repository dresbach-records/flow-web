import { addDoc, collection, deleteDoc, doc, getDocs, query, serverTimestamp, updateDoc, where, Timestamp } from 'firebase/firestore';
import { requireFirebaseAuth, requireFirestore } from './config';

export type ScheduleStatus = 'DRAFT' | 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED' | 'CANCELLED';
export type ScheduledPost = {
  id: string;
  ownerId: string;
  profileId: string;
  text: string;
  type: 'text' | 'image' | 'video';
  mediaUrl?: string;
  scheduledAt: Date;
  timezone: string;
  status: ScheduleStatus;
  failureReason?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
};

function uid(): string {
  const auth = requireFirebaseAuth();
  const value = auth.currentUser?.uid;
  if (!value) throw new Error('Faça login para gerenciar agendamentos.');
  return value;
}

function mapSchedule(id: string, data: Record<string, unknown>): ScheduledPost {
  const timestamp = (value: unknown) => (value instanceof Timestamp ? value.toDate() : undefined);
  return {
    id,
    ownerId: String(data.ownerId ?? ''),
    profileId: String(data.profileId ?? ''),
    text: String(data.text ?? ''),
    type: (data.type as ScheduledPost['type']) ?? 'text',
    mediaUrl: typeof data.mediaUrl === 'string' ? data.mediaUrl : undefined,
    scheduledAt: timestamp(data.scheduledAt) ?? new Date(),
    timezone: String(data.timezone ?? 'America/Sao_Paulo'),
    status: (data.status as ScheduleStatus) ?? 'DRAFT',
    failureReason: typeof data.failureReason === 'string' ? data.failureReason : undefined,
    publishedAt: timestamp(data.publishedAt),
    createdAt: timestamp(data.createdAt),
    updatedAt: timestamp(data.updatedAt),
  };
}

export async function listSchedules(): Promise<ScheduledPost[]> {
  const db = requireFirestore();
  const snapshot = await getDocs(query(collection(db, 'scheduled_posts'), where('ownerId', '==', uid())));
  return snapshot.docs.map(item => mapSchedule(item.id, item.data())).sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime());
}

export async function createSchedule(input: Omit<ScheduledPost, 'id' | 'ownerId' | 'status'> & { status?: ScheduleStatus }): Promise<string> {
  const db = requireFirestore();
  const ownerId = uid();
  const postRef = await addDoc(collection(db, 'posts'), {
    authorId: ownerId,
    caption: input.text,
    type: input.type,
    mediaUrl: input.mediaUrl ?? null,
    schedulerManaged: true,
    visibility: 'private',
    status: input.status ?? 'SCHEDULED',
    scheduledAt: Timestamp.fromDate(input.scheduledAt),
    likesCount: 0,
    commentsCount: 0,
    sharesCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  const ref = await addDoc(collection(db, 'scheduled_posts'), {
    ...input,
    ownerId,
    postId: postRef.id,
    status: input.status ?? 'SCHEDULED',
    scheduledAt: Timestamp.fromDate(input.scheduledAt),
    timezone: input.timezone || 'America/Sao_Paulo',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updateSchedule(id: string, input: Partial<Pick<ScheduledPost, 'text' | 'type' | 'mediaUrl' | 'scheduledAt' | 'timezone' | 'profileId' | 'status'>>): Promise<void> {
  const db = requireFirestore();
  uid();
  const data: Record<string, unknown> = {
    ...input,
    updatedAt: serverTimestamp(),
  };
  if (input.scheduledAt) {
    data.scheduledAt = Timestamp.fromDate(input.scheduledAt);
  }
  await updateDoc(doc(db, 'scheduled_posts', id), data);
}

export async function cancelSchedule(id: string): Promise<void> {
  await updateSchedule(id, { status: 'CANCELLED' });
}

export async function deleteSchedule(id: string): Promise<void> {
  const db = requireFirestore();
  uid();
  await deleteDoc(doc(db, 'scheduled_posts', id));
}

export async function publishScheduleNow(id: string): Promise<void> {
  await updateSchedule(id, { status: 'SCHEDULED', scheduledAt: new Date() });
}

export async function duplicateSchedule(schedule: ScheduledPost): Promise<string> {
  const copy = { ...schedule, id: undefined, scheduledAt: new Date(schedule.scheduledAt.getTime() + 60 * 60 * 1000), status: 'DRAFT' as const };
  const { id: _id, ...input } = copy;
  return createSchedule(input);
}
