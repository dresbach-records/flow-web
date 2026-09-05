import assert from 'node:assert/strict';

process.env.FIREBASE_PROJECT_ID = 'flow-test';
process.env.FIREBASE_STORAGE_BUCKET = 'flow-test.appspot.com';
process.env.NODE_ENV = 'test';

const { createApp } = await import('../src/app.js');

const server = createApp().listen(0);
const address = server.address();
assert.ok(address && typeof address !== 'string', 'server deve escutar em porta efêmera');
const baseUrl = `http://127.0.0.1:${(address as { port: number }).port}`;

const health = await fetch(`${baseUrl}/health`);
assert.equal(health.status, 200, 'GET /health deve retornar 200');
const healthBody = await health.json() as { status: string; service: string };
assert.equal(healthBody.status, 'ok', 'health.status = ok');
assert.equal(healthBody.service, 'flow-api', 'health.service = flow-api');

const meta = await fetch(`${baseUrl}/api/v1/meta`);
assert.equal(meta.status, 200, 'GET /api/v1/meta deve retornar 200');
const metaBody = await meta.json() as { service: string; routes: unknown[] };
assert.equal(metaBody.service, 'flow-api');
assert.ok(Array.isArray(metaBody.routes) && metaBody.routes.length > 0, 'meta.routes deve listar rotas');

const notFound = await fetch(`${baseUrl}/rota/inexistente`);
assert.equal(notFound.status, 404, 'rota inexistente deve retornar 404');
assert.equal((await notFound.json() as { error: string }).error, 'NOT_FOUND');

const cron = await fetch(`${baseUrl}/api/cron/publish`);
assert.equal(cron.status, 403, 'cron sem segredo deve retornar 403');

server.close();

console.log('FLOW backend API tests: PASS');