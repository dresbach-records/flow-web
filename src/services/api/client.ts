export type ApiRequest = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

const API_URL =
  ((import.meta.env.VITE_API_BASE_URL as string | undefined)
    ?? (import.meta.env.VITE_API_URL as string | undefined)
    ?? ''
  ).replace(/\/$/, '');

/** Base canônica do backend (`/api/v1`). `VITE_API_URL` é só fallback depreciado. */
export function getApiBaseUrl(): string {
  return API_URL;
}

/** ID token Firebase best-effort (rotas autenticadas do backend). */
async function authHeader(): Promise<Record<string, string>> {
  try {
    const { firebaseAuth } = await import('../firebase/config');
    const token = await firebaseAuth?.currentUser?.getIdToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  } catch {
    return {};
  }
}

/** Single frontend/API boundary. Pages and components never access databases directly. */
export async function apiRequest<T>({ path, method = 'GET', body, signal }: ApiRequest): Promise<T> {
  if (!API_URL) {
    throw new Error('VITE_API_BASE_URL não configurado. Defina a URL absoluta do backend (ex.: http://localhost:8080/api/v1).');
  }
  const response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    signal,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try { const payload = await response.json() as { error?: string }; message = payload.error ?? message; } catch { /* non-json error */ }
    throw new Error(message);
  }
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    throw new Error(
      'API_MISCONFIGURED: resposta não-JSON do backend. Verifique se VITE_API_BASE_URL aponta para o backend (/api/v1) e não para o próprio frontend (o fallback SPA do vercel.json reescreve /api para index.html).',
    );
  }
  return response.json() as Promise<T>;
}
