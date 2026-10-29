const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('CONSOLE', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGEERROR', err.message));
  page.on('requestfailed', req => {
    const failure = req.failure();
    console.log('REQFAIL', req.url(), failure && failure.errorText);
  });
  try {
    await page.goto('http://localhost:4201', { waitUntil: 'networkidle' });
    console.log('PAGE TITLE', await page.title());
    console.log('BODY TEXT', (await page.textContent('body') || '').slice(0,200));
    await page.click('a:has-text("Productos")');
    await page.waitForTimeout(1200);
    console.log('NAV PRODUCTS TEXT', (await page.textContent('body') || '').slice(0,400));
  } catch (e) {
    console.log('ERROR', e.message);
  } finally {
    await browser.close();
  }
})();
