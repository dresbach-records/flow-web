import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(() => {
    localStorage.setItem('flow.admin.session', '1');
    localStorage.setItem('flow.admin.session_user', JSON.stringify({
      uid: 'admin-super-001',
      email: 'admin@flow.social',
      displayName: 'Carlos Mendes',
      role: 'superadmin'
    }));
  });
  const page = await context.newPage();
  await page.goto('http://localhost:5174/admin', { waitUntil: 'networkidle' });

  const data = await page.evaluate(() => {
    const logo = document.querySelector('.topbar-brand-logo');
    const topbar = document.querySelector('.flow-admin-topbar');
    const main = document.querySelector('.flow-admin-main');
    const hero = document.querySelector('.admin-hero-banner');
    return {
      logoClass: logo ? logo.className : 'null',
      logoStyle: logo ? { width: getComputedStyle(logo).width, height: getComputedStyle(logo).height, display: getComputedStyle(logo).display } : null,
      topbarStyle: topbar ? { position: getComputedStyle(topbar).position, width: getComputedStyle(topbar).width, height: getComputedStyle(topbar).height, display: getComputedStyle(topbar).display } : null,
      mainStyle: main ? { marginLeft: getComputedStyle(main).marginLeft, paddingTop: getComputedStyle(main).paddingTop } : null,
      heroStyle: hero ? { display: getComputedStyle(hero).display, background: getComputedStyle(hero).background } : null,
      htmlClasses: document.documentElement.className,
      bodyClasses: document.body.className
    };
  });
  console.log('EVAL DATA:', JSON.stringify(data, null, 2));
  await browser.close();
})();
