import { defineConfig } from 'vitest/config';

// FASE 7: `pnpm test` = testes unitários do frontend.
// Playwright (`tests/*.spec.ts`) roda no workflow próprio;
// backend usa `npm test` em backend/ (tsx + node:assert).
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    exclude: ['**/node_modules/**', 'tests/**', 'backend/**', 'temp_clone/**', '**/*.spec.ts'],
  },
});
