import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { readFileSync } from 'node:fs';
import { env } from './config/env.js';
import { connectDatabases } from './infrastructure/database.js';
import { requestLogger } from './middleware/request-logger.js';
import { register, login } from './services/auth.service.js';
import { createPost, likePost, listFeed } from './services/content.service.js';
import { createReport } from './services/report.service.js';
import { createContactMessage } from './services/contact.service.js';
import { createContributor } from './services/contributors.service.js';
import { notifyUser, savePushSubscription, deletePushSubscription, validateNotifyInput } from './services/notify.service.js';
import { metricsSnapshot, recordRequest } from './services/metrics.service.js';
import { cacheGet, cacheInvalidate, cacheSet, cacheStats } from './services/cache.service.js';
import { auditStorageOrphans } from './services/storage-audit.service.js';
import { requireAdmin, requireAuth, type AuthedRequest } from './middleware/require-auth.js';
import { startPublicationScheduler } from './services/scheduler.service.js';

function apiVersion(): string {
  try {
    const pkg = JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf-8')) as { version?: unknown };
    return typeof pkg.version === 'string' ? pkg.version : '0.0.0';
  } catch {
    return '0.0.0';
  }
}

const API_ROUTES = [
  { method: 'GET', path: '/health' },
  { method: 'GET', path: '/api/v1/meta' },
  { method: 'POST', path: '/api/v1/auth/register' },
  { method: 'POST', path: '/api/v1/auth/login' },
  { method: 'GET', path: '/api/v1/feed' },
  { method: 'POST', path: '/api/v1/posts' },
  { method: 'POST', path: '/api/v1/posts/:id/like' },
  { method: 'POST', path: '/api/v1/reports' },
  { method: 'POST', path: '/api/v1/contact' },
  { method: 'POST', path: '/api/v1/contributors' },
  { method: 'GET', path: '/api/v1/metrics' },
  { method: 'POST', path: '/api/v1/notify' },
  { method: 'POST', path: '/api/v1/push/subscribe' },
  { method: 'DELETE', path: '/api/v1/push/subscribe' },
  { method: 'GET', path: '/api/v1/admin/storage-audit' },
] as const;

const app = express();
app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(requestLogger);

// Métricas reais por rota (observabilidade mínima, sem dependências).
app.use('/api', (req, res, next) => {
  const started = Date.now();
  res.on('finish', () => recordRequest(`${req.method} ${req.path}`, res.statusCode, Date.now() - started));
  next();
});

// Antiabuso real: escrita pública limitada por IP.
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED' },
});
app.use(['/api/v1/auth/', '/api/v1/posts', '/api/v1/reports', '/api/v1/contact', '/api/v1/contributors', '/api/v1/notify', '/api/v1/push/'], writeLimiter);

app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'flow-api',
  guardian: env.FLOW_GUARDIAN_ENABLED ? 'enabled' : 'disabled',
}));

// Metadados reais da API (versão, rotas, flags) — consumido pelo Painel Developer.
app.get('/api/v1/meta', (_req, res) => {
  const cached = cacheGet<Record<string, unknown>>('meta');
  if (cached) {
    res.setHeader('x-cache', 'HIT');
    res.json(cached);
    return;
  }
  const payload = {
    service: 'flow-api',
    version: apiVersion(),
    guardian: env.FLOW_GUARDIAN_ENABLED ? 'enabled' : 'disabled',
    project: env.FIREBASE_PROJECT_ID,
    vapidPublic: env.VAPID_PUBLIC ?? null,
    cache: cacheStats(),
    time: new Date().toISOString(),
    routes: API_ROUTES,
  };
  cacheSet('meta', payload, 60_000);
  res.setHeader('x-cache', 'MISS');
  res.json(payload);
});

// Métricas reais (autenticado: expõe uso da API).
app.get('/api/v1/metrics', requireAuth, (_req, res) => {
  res.json({ ...metricsSnapshot(), cache: cacheStats() });
});

app.post('/api/v1/auth/register', async (req, res) => {
  try { res.status(201).json(await register(req.body)); }
  catch { res.status(400).json({ error: 'REGISTER_FAILED' }); }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try { res.json(await login(req.body.email, req.body.password)); }
  catch { res.status(401).json({ error: 'INVALID_CREDENTIALS' }); }
});

app.get('/api/v1/feed', async (req, res) => {
  try {
    const limit = typeof req.query.limit === 'string' ? Number.parseInt(req.query.limit, 10) : 30;
    const before = typeof req.query.before === 'string' ? req.query.before : undefined;
    const cacheKey = `feed:${req.query.mode === 'following' ? 'following' : 'for-you'}:${limit}:${before ?? 'head'}`;
    const cached = cacheGet(cacheKey);
    if (cached) {
      res.setHeader('x-cache', 'HIT');
      res.json(cached);
      return;
    }
    const page = await listFeed(
      undefined,
      req.query.mode === 'following' ? 'following' : 'for-you',
      { limit: Number.isNaN(limit) ? 30 : limit, before },
    );
    cacheSet(cacheKey, page, 15_000);
    res.setHeader('x-cache', 'MISS');
    res.json(page);
  } catch { res.status(500).json({ error: 'FEED_UNAVAILABLE' }); }
});

app.post('/api/v1/posts', async (req, res) => {
  try {
    const created = await createPost(req.body);
    cacheInvalidate('feed:');
    res.status(201).json(created);
  } catch (error) {
    if (error instanceof Error && error.message === 'CONTENT_BLOCKED_BY_GUARDIAN') {
      res.status(422).json({ error: 'CONTENT_BLOCKED_BY_GUARDIAN' });
      return;
    }
    if (error instanceof Error && error.message === 'GUARDIAN_TIMEOUT') {
      res.status(503).json({ error: 'GUARDIAN_UNAVAILABLE' });
      return;
    }
    res.status(400).json({ error: 'POST_CREATE_FAILED' });
  }
});

app.post('/api/v1/posts/:id/like', async (req, res) => {
  try { res.json(await likePost(req.params.id, req.body.userId)); }
  catch { res.status(400).json({ error: 'LIKE_FAILED' }); }
});

app.post('/api/v1/reports', async (req, res) => {
  try { res.status(201).json(await createReport(req.body)); }
  catch { res.status(400).json({ error: 'REPORT_FAILED' }); }
});

app.post('/api/v1/contact', async (req, res) => {
  try { res.status(201).json(await createContactMessage(req.body)); }
  catch { res.status(400).json({ error: 'CONTACT_FAILED' }); }
});

app.post('/api/v1/contributors', async (req, res) => {
  try { res.status(201).json(await createContributor(req.body)); }
  catch (error) {
    if (error instanceof Error && error.message === 'CONTRIBUTOR_DUPLICATE') {
      res.status(409).json({ error: 'CONTRIBUTOR_DUPLICATE' });
      return;
    }
    res.status(400).json({ error: 'CONTRIBUTOR_FAILED' });
  }
});

// Notificação ponta a ponta (autenticada): persiste in-app + Web Push best-effort.
app.post('/api/v1/notify', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const error = validateNotifyInput(req.body);
    if (error) {
      res.status(422).json({ error });
      return;
    }
    res.status(201).json(await notifyUser(req.uid as string, req.body));
  } catch { res.status(400).json({ error: 'NOTIFY_FAILED' }); }
});

// Web Push: inscrever/remover este dispositivo (autenticado).
app.post('/api/v1/push/subscribe', requireAuth, async (req: AuthedRequest, res) => {
  try {
    res.status(201).json({ id: await savePushSubscription(req.uid as string, req.body) });
  } catch { res.status(400).json({ error: 'PUSH_SUBSCRIBE_FAILED' }); }
});

app.delete('/api/v1/push/subscribe', requireAuth, async (req: AuthedRequest, res) => {
  try {
    const endpoint = typeof req.body?.endpoint === 'string' ? req.body.endpoint : '';
    if (!endpoint) {
      res.status(422).json({ error: 'PUSH_INVALID_ENDPOINT' });
      return;
    }
    await deletePushSubscription(req.uid as string, endpoint);
    res.json({ ok: true });
  } catch { res.status(400).json({ error: 'PUSH_UNSUBSCRIBE_FAILED' }); }
});

// Auditoria de Storage órfão (somente admin, sem auto-delete).
app.get('/api/v1/admin/storage-audit', requireAdmin, async (_req, res) => {
  try { res.json(await auditStorageOrphans()); }
  catch { res.status(500).json({ error: 'STORAGE_AUDIT_FAILED' }); }
});

await connectDatabases();
startPublicationScheduler();
app.listen(env.PORT, () => console.log(`FLOW API listening on :${env.PORT}`));
