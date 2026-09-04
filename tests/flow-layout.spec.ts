import { test, expect } from '@playwright/test';

test('verify flow desktop light layout', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:5173/app');

  const artifactPath = 'C:/Users/supor/.gemini/antigravity-ide/brain/b2dec4ed-45d1-498f-bd66-1e55e9cb9ecb/flow_desktop_light.png';
  await page.screenshot({ path: artifactPath, fullPage: false });
  console.log('Layout screenshot saved to:', artifactPath);
});
