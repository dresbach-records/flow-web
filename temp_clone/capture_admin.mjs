import { chromium } from '@playwright/test';

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await chromium.launch();
    const context = await browser.newContext({
      viewport: { width: 1440, height: 900 }
    });
    
    await context.addInitScript(() => {
      localStorage.setItem('flow.admin.session', '1');
      localStorage.setItem('flow.admin.session_user', JSON.stringify({
        uid: 'admin-super-001',
        email: 'admin@flow.social',
        displayName: 'Carlos Mendes',
        role: 'superadmin',
        photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&h=120&fit=crop&crop=face',
        lastLogin: 'Agora'
      }));
    });

    const page = await context.newPage();
    console.log('Navigating to http://localhost:5174/admin ...');
    await page.goto('http://localhost:5174/admin', { waitUntil: 'networkidle', timeout: 15000 });

    const artifactPath = 'C:\\Users\\supor\\.gemini\\antigravity-ide\\brain\\b2dec4ed-45d1-498f-bd66-1e55e9cb9ecb\\admin_current_screen.png';
    await page.screenshot({ path: artifactPath, fullPage: false });
    console.log('Screenshot saved to:', artifactPath);

    await browser.close();
    console.log('Done!');
  } catch (err) {
    console.error('Error capturing screenshot:', err);
  }
})();
