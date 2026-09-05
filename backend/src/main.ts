import { env } from './config/env.js';
import { connectDatabases } from './infrastructure/database.js';
import { startPublicationScheduler } from './services/scheduler.service.js';
import { createApp } from './app.js';

// Entry local persistente (Node/Cloud Run). Na Vercel, use api/index.ts.
const app = createApp();

await connectDatabases();
startPublicationScheduler();
app.listen(env.PORT, () => console.log(`FLOW API listening on :${env.PORT}`));