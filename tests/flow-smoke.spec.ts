// FLOW — smoke E2E real (Fase 7 / auditoria final).
// Home, guarda de autenticação e overflow horizontal em 2 viewports.
import { test, expect } from '@playwright/test';

test('home institucional carrega com título FLOW', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/FLOW/);
});

test('rota /app sem sessão redireciona ao login', async ({ page }) => {
  await page.goto('/app');
  await expect(page).toHaveURL(/\/login/);
});

test('rota desconhecida renderiza 404 (nunca Home como substituto)', async ({ page }) => {
  await page.goto('/rota-que-nao-existe-xyz');
  await expect(page.getByRole('heading', { name: 'Página não encontrada' })).toBeVisible();
});

test('páginas públicas reais carregam conteúdo próprio', async ({ page }) => {
  for (const route of ['/produto', '/recursos', '/comunidades', '/criadores', '/baixar-app', '/ajuda', '/seguranca', '/privacidade', '/termos', '/contato', '/sobre', '/blog', '/carreiras', '/imprensa']) {
    await page.goto(route);
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

test('sem overflow horizontal no mobile (390px)', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test('sem overflow horizontal no desktop (1440px)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});
