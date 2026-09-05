// FLOW — Web Push real (VAPID + Service Worker + backend).
// Chave pública via /api/v1/meta (pública por design). Subscription persistida
// no backend; envio pelo backend no fan-out.
import { apiRequest } from '../api/client';

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4);
  const raw = window.atob((base64 + padding).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function registration(): Promise<ServiceWorkerRegistration> {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    throw new Error('Push não suportado neste navegador.');
  }
  const reg = await navigator.serviceWorker.ready;
  return reg;
}

/** Push ativo neste dispositivo? (subscription real, não flag local). */
export async function getPushStatus(): Promise<boolean> {
  try {
    const reg = await registration();
    return (await reg.pushManager.getSubscription()) !== null;
  } catch {
    return false;
  }
}

/** Ativa push: permissão + subscribe + registro no backend. */
export async function enablePush(): Promise<void> {
  const permission = await Notification.requestPermission();
  if (permission !== 'granted') throw new Error('Permissão de notificação negada.');
  const meta = await apiRequest<{ vapidPublic: string | null }>({ path: '/api/v1/meta' });
  if (!meta.vapidPublic) throw new Error('Push indisponível no servidor (VAPID ausente).');
  const reg = await registration();
  const existing = await reg.pushManager.getSubscription();
  const sub =
    existing ??
    (await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(meta.vapidPublic).buffer as ArrayBuffer,
    }));
  const json = sub.toJSON();
  await apiRequest({
    path: '/api/v1/push/subscribe',
    method: 'POST',
    body: { endpoint: sub.endpoint, keys: json.keys },
  });
}

/** Desativa push: unsubscribe + remoção no backend. */
export async function disablePush(): Promise<void> {
  const reg = await registration();
  const sub = await reg.pushManager.getSubscription();
  if (!sub) return;
  const endpoint = sub.endpoint;
  await sub.unsubscribe();
  await apiRequest({ path: '/api/v1/push/subscribe', method: 'DELETE', body: { endpoint } }).catch(
    () => undefined,
  );
}
