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
] as const;

const app = express();
app.use(helmet());
const allowedOrigins = env.CORS_ORIGIN.split(',').map((o) => o.trim()).filter(Boolean);
app.use(cors({ origin: allowedOrigins.length === 1 ? allowedOrigins[0] : allowedOrigins, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(requestLogger);

// Antiabuso real: escrita pública limitada por IP.
const writeLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: { error: 'RATE_LIMITED' },
});
app.use(['/api/v1/auth/', '/api/v1/posts', '/api/v1/reports', '/api/v1/contact'], writeLimiter);

app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'flow-api',
  guardian: env.FLOW_GUARDIAN_ENABLED ? 'enabled' : 'disabled',
}));

// Metadados reais da API (versão, rotas, flags) — consumido pelo Painel Developer.
app.get('/api/v1/meta', (_req, res) => res.json({
  service: 'flow-api',
  version: apiVersion(),
  guardian: env.FLOW_GUARDIAN_ENABLED ? 'enabled' : 'disabled',
  project: env.FIREBASE_PROJECT_ID,
  time: new Date().toISOString(),
  routes: API_ROUTES,
}));

app.post('/api/v1/auth/register', async (req, res) => {
  try { res.status(201).json(await register(req.body)); }
  catch { res.status(400).json({ error: 'REGISTER_FAILED' }); }
});

app.post('/api/v1/auth/login', async (req, res) => {
  try { res.json(await login(req.body.email, req.body.password)); }
  catch { res.status(401).json({ error: 'INVALID_CREDENTIALS' }); }
});

app.get('/api/v1/feed', async (req, res) => {
  try { res.json(await listFeed(undefined, req.query.mode === 'following' ? 'following' : 'for-you')); }
  catch { res.status(500).json({ error: 'FEED_UNAVAILABLE' }); }
});

app.post('/api/v1/posts', async (req, res) => {
  try {
    res.status(201).json(await createPost(req.body));
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

await connectDatabases();
startPublicationScheduler();
app.listen(env.PORT, () => console.log(`FLOW API listening on :${env.PORT}`));
