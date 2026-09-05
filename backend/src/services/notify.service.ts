import { createHash } from 'node:crypto';
import { firestore } from '../infrastructure/database.js';
import { env } from '../config/env.js';

export type NotifyType = 'like' | 'comment' | 'follow' | 'system';

const VALID_TYPES: NotifyType[] = ['like', 'comment', 'follow', 'system'];

export interface NotifyInput {
  targetUid: string;
  type: NotifyType;
  actorName: string;
  actorAvatar?: string;
  text: string;
}

/** Validação pura (testável sem Firebase). Retorna erro ou null. */
export function validateNotifyInput(input: Partial<NotifyInput>): string | null {
  if (!input.targetUid || typeof input.targetUid !== 'string') return 'NOTIFY_INVALID_TARGET';
  if (!VALID_TYPES.includes(input.type as NotifyType)) return 'NOTIFY_INVALID_TYPE';
  if (!input.text || typeof input.text !== 'string' || input.text.trim().length === 0) return 'NOTIFY_INVALID_TEXT';
  if (input.text.length > 300) return 'NOTIFY_TEXT_TOO_LONG';
  return null;
}

export interface PushSubscriptionRecord {
  endpoint: string;
  keys: { p256dh: string; auth: string };
}

/** Validação pura da subscription Web Push. */
export function validateSubscription(input: Partial<PushSubscriptionRecord>): string | null {
  if (!input.endpoint || typeof input.endpoint !== 'string' || !input.endpoint.startsWith('https://')) {
    return 'PUSH_INVALID_ENDPOINT';
  }
  if (!input.keys || typeof input.keys.p256dh !== 'string' || typeof input.keys.auth !== 'string') {
    return 'PUSH_INVALID_KEYS';
  }
  return null;
}

function subscriptionId(endpoint: string): string {
  return createHash('sha256').update(endpoint).digest('hex').slice(0, 32);
}

/** Salva subscription Web Push do usuário (sem segredos além do endpoint). */
export async function savePushSubscription(uid: string, sub: PushSubscriptionRecord): Promise<string> {
  const error = validateSubscription(sub);
  if (error) throw new Error(error);
  const id = subscriptionId(sub.endpoint);
  await firestore().collection('push_subscriptions').doc(uid).collection('targets').doc(id).set({
    endpoint: sub.endpoint,
    keys: sub.keys,
    createdAt: new Date(),
  });
  return id;
}

/** Remove subscription (unsubscribe real). */
export async function deletePushSubscription(uid: string, endpoint: string): Promise<void> {
  const id = subscriptionId(endpoint);
  await firestore().collection('push_subscriptions').doc(uid).collection('targets').doc(id).delete();
}

async function sendWebPush(uid: string, title: string, body: string): Promise<{ sent: number; failed: number }> {
  if (!env.VAPID_PUBLIC || !env.VAPID_PRIVATE) return { sent: 0, failed: 0 };
  const { default: webPush } = await import('web-push');
  webPush.setVapidDetails(env.VAPID_SUBJECT ?? 'mailto:admin@flow.social', env.VAPID_PUBLIC, env.VAPID_PRIVATE);
  const snapshot = await firestore().collection('push_subscriptions').doc(uid).collection('targets').get();
  let sent = 0;
  let failed = 0;
  const payload = JSON.stringify({ title, body });
  await Promise.all(
    snapshot.docs.map(async (docSnap) => {
      const data = docSnap.data() as PushSubscriptionRecord;
      try {
        await webPush.sendNotification({ endpoint: data.endpoint, keys: data.keys } as never, payload);
        sent += 1;
      } catch {
        failed += 1;
        // Endpoint morto (410/404): remove para não acumular lixo.
        await docSnap.ref.delete().catch(() => undefined);
      }
    }),
  );
  return { sent, failed };
}

/**
 * Notificação ponta a ponta pelo backend: persiste in-app (Admin SDK) e
 * dispara Web Push best-effort. Nunca joga fora o erro de persistência.
 */
export async function notifyUser(actorUid: string, input: NotifyInput): Promise<{ id: string; push: { sent: number; failed: number } }> {
  const error = validateNotifyInput(input);
  if (error) throw new Error(error);
  if (actorUid === input.targetUid) throw new Error('NOTIFY_SELF');
  const record = {
    type: input.type,
    actorName: input.actorName || 'Alguém',
    actorAvatar: typeof input.actorAvatar === 'string' && input.actorAvatar ? input.actorAvatar : '/logo.png',
    text: input.text.trim(),
    read: false,
    createdAt: new Date(),
  };
  const ref = await firestore().collection('users').doc(input.targetUid).collection('notifications').add(record);
  const push = await sendWebPush(input.targetUid, 'FLOW', `${record.actorName} ${record.text}`).catch(() => ({ sent: 0, failed: 0 }));
  return { id: ref.id, push };
}
