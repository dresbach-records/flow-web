export type ApiRequest = {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  signal?: AbortSignal;
};

/** Backend/API boundary. No backend implementation belongs in pages/components. */
export async function apiRequest<T>({ path, method = 'GET', body, signal }: ApiRequest): Promise<T> {
  const response = await fetch(path, {
    method,
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json() as Promise<T>;
}
