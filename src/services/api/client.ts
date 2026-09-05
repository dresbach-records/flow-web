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

/** Single frontend/API boundary. Pages and components never access databases directly. */
export async function apiRequest<T>({ path, method = 'GET', body, signal }: ApiRequest): Promise<T> {
  const response = await fetch(`${API_URL}${path.startsWith('/') ? path : `/${path}`}`, {
    method,
    signal,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) {
    let message = `API request failed: ${response.status}`;
    try { const payload = await response.json() as { error?: string }; message = payload.error ?? message; } catch { /* non-json error */ }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}
