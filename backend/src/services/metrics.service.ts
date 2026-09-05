/** Métricas reais em memória (contadores + latência). Sem dependências. */
interface RouteStats {
  count: number;
  errors: number;
  totalMs: number;
  maxMs: number;
}

const routes = new Map<string, RouteStats>();
const startedAt = Date.now();

export function recordRequest(route: string, status: number, ms: number): void {
  const current = routes.get(route) ?? { count: 0, errors: 0, totalMs: 0, maxMs: 0 };
  current.count += 1;
  if (status >= 400) current.errors += 1;
  current.totalMs += ms;
  if (ms > current.maxMs) current.maxMs = ms;
  routes.set(route, current);
}

export function metricsSnapshot(): {
  uptimeSec: number;
  requests: number;
  errors: number;
  routes: Record<string, { count: number; errors: number; avgMs: number; maxMs: number }>;
} {
  let requests = 0;
  let errors = 0;
  const out: Record<string, { count: number; errors: number; avgMs: number; maxMs: number }> = {};
  for (const [route, stats] of routes) {
    requests += stats.count;
    errors += stats.errors;
    out[route] = {
      count: stats.count,
      errors: stats.errors,
      avgMs: stats.count > 0 ? Math.round(stats.totalMs / stats.count) : 0,
      maxMs: stats.maxMs,
    };
  }
  return { uptimeSec: Math.round((Date.now() - startedAt) / 1000), requests, errors, routes: out };
}
