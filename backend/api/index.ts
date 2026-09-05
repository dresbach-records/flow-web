import { createApp } from '../src/app.js';

// Vercel Serverless: exporta o app Express como handler padrão.
// Todos os requests (rewrite em vercel.json) chegam aqui.
const app = createApp();

export default app;