import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { connectDatabases } from './infrastructure/database.js';
import { register, login } from './services/auth.service.js';
import { createPost, likePost, listFeed } from './services/content.service.js';
import { createReport } from './services/report.service.js';
const app = express();
app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'flow-api' }));
app.post('/api/v1/auth/register', async (req, res) => {
    try {
        res.status(201).json(await register(req.body));
    }
    catch {
        res.status(400).json({ error: 'REGISTER_FAILED' });
    }
});
app.post('/api/v1/auth/login', async (req, res) => {
    try {
        res.json(await login(req.body.email, req.body.password));
    }
    catch {
        res.status(401).json({ error: 'INVALID_CREDENTIALS' });
    }
});
app.get('/api/v1/feed', async (req, res) => {
    try {
        res.json(await listFeed(undefined, req.query.mode === 'following' ? 'following' : 'for-you'));
    }
    catch {
        res.status(500).json({ error: 'FEED_UNAVAILABLE' });
    }
});
app.post('/api/v1/posts', async (req, res) => {
    try {
        res.status(201).json(await createPost(req.body));
    }
    catch {
        res.status(400).json({ error: 'POST_CREATE_FAILED' });
    }
});
app.post('/api/v1/posts/:id/like', async (req, res) => {
    try {
        res.json(await likePost(req.params.id, req.body.userId));
    }
    catch {
        res.status(400).json({ error: 'LIKE_FAILED' });
    }
});
app.post('/api/v1/reports', async (req, res) => {
    try {
        res.status(201).json(await createReport(req.body));
    }
    catch {
        res.status(400).json({ error: 'REPORT_FAILED' });
    }
});
await connectDatabases();
app.listen(env.PORT, () => console.log(`FLOW API listening on :${env.PORT}`));
