// FLOW — Events service (backend real: eventos + RSVP).
// `events` + `events/{id}/rsvps/{uid}` (rules). Validação pura exportada p/ testes.
import { createDocument, deleteDocument, getDocument, listDocuments, updateDocument } from './firestore';
import { requireFirebaseAuth } from './config';

export type EventStatus = 'OPEN' | 'CANCELLED';
export type RsvpStatus = 'going' | 'interested';

export interface FlowEvent {
  id: string;
  title: string;
  description: string;
  location: string;
  online: boolean;
  startsAt: string;
  ownerId: string;
  status: EventStatus;
  rsvpCount: number;
}

export interface EventInput {
  title: string;
  description?: string;
  location?: string;
  online?: boolean;
  startsAt: string;
}

/** Validação pura da entrada (testável sem Firebase). Retorna erro ou null. */
export function validateEventInput(input: EventInput, nowMs = Date.now()): string | null {
  if (!input.title.trim()) return 'Informe o título do evento.';
  if (input.title.trim().length > 120) return 'Título com no máximo 120 caracteres.';
  if (!input.startsAt) return 'Informe data e hora.';
  const starts = new Date(input.startsAt).getTime();
  if (Number.isNaN(starts)) return 'Data inválida.';
  if (starts <= nowMs) return 'O evento precisa ser no futuro.';
  if ((input.description ?? '').length > 2000) return 'Descrição com no máximo 2000 caracteres.';
  return null;
}

function requireUid(): string {
  const auth = requireFirebaseAuth();
  const uid = auth.currentUser?.uid;
  if (!uid) throw new Error('Faça login para continuar.');
  return uid;
}

function toEvent(id: string, d: Record<string, unknown>): FlowEvent {
  return {
    id,
    title: typeof d.title === 'string' ? d.title : 'Evento',
    description: typeof d.description === 'string' ? d.description : '',
    location: typeof d.location === 'string' ? d.location : '',
    online: d.online === true,
    startsAt: typeof d.startsAt === 'string' ? d.startsAt : '',
    ownerId: typeof d.ownerId === 'string' ? d.ownerId : '',
    status: d.status === 'CANCELLED' ? 'CANCELLED' : 'OPEN',
    rsvpCount: typeof d.rsvpCount === 'number' ? d.rsvpCount : 0,
  };
}

export async function listEvents(max = 30): Promise<FlowEvent[]> {
  const docs = await listDocuments<Record<string, unknown>>('events', { max: 100 });
  return docs
    .map((d) => toEvent(d.id, d))
    .filter((e) => e.status === 'OPEN')
    .sort((a, b) => a.startsAt.localeCompare(b.startsAt))
    .slice(0, max);
}

export async function getEvent(id: string): Promise<FlowEvent | null> {
  const doc = await getDocument<Record<string, unknown>>('events', id).catch(() => null);
  return doc ? toEvent(doc.id, doc) : null;
}

export async function createEvent(input: EventInput): Promise<string> {
  const uid = requireUid();
  const error = validateEventInput(input);
  if (error) throw new Error(error);
  return createDocument('events', {
    ownerId: uid,
    title: input.title.trim(),
    description: (input.description ?? '').trim(),
    location: (input.location ?? '').trim(),
    online: input.online === true,
    startsAt: new Date(input.startsAt).toISOString(),
    status: 'OPEN',
    rsvpCount: 0,
  });
}

export async function cancelEvent(id: string): Promise<void> {
  await updateDocument('events', id, { status: 'CANCELLED' });
}

export async function setRsvp(eventId: string, status: RsvpStatus): Promise<void> {
  const uid = requireUid();
  const { upsertDocument } = await import('./firestore');
  await upsertDocument(`events/${eventId}/rsvps`, uid, { status });
}

export async function removeRsvp(eventId: string): Promise<void> {
  const uid = requireUid();
  await deleteDocument(`events/${eventId}/rsvps`, uid);
}

export async function getMyRsvp(eventId: string): Promise<RsvpStatus | null> {
  const uid = requireUid();
  const doc = await getDocument<{ status?: unknown }>(`events/${eventId}/rsvps`, uid).catch(() => null);
  return doc?.status === 'going' || doc?.status === 'interested' ? doc.status : null;
}

export async function countRsvps(eventId: string, status?: RsvpStatus): Promise<number> {
  const docs = await listDocuments<Record<string, unknown>>(
    `events/${eventId}/rsvps`,
    status ? { field: 'status', value: status, max: 1000 } : { max: 1000 },
  ).catch(() => []);
  return docs.length;
}
