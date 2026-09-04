import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { connectDatabases } from './infrastructure/database.js';
import { register, login } from './services/auth.service.js';
import { createPost, likePost, listFeed } from './services/content.service.js';
import { createReport } from './services/report.service.js';
 v0/flow-db-structure
import { errorHandler, rateLimit, requestContext } from './middleware/security.js';

import { startPublicationScheduler } from './services/scheduler.service.js';
 main

const app = express();
app.disable('x-powered-by');
app.use(requestContext);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(rateLimit());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => res.json({
  status: 'ok',
  service: 'flow-api',
  guardian: env.FLOW_GUARDIAN_ENABLED ? 'enabled' : 'disabled',
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

app.use(errorHandler);

await connectDatabases();
startPublicationScheduler();
app.listen(env.PORT, () => console.log(`FLOW API listening on :${env.PORT}`));
