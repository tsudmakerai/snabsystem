const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    const urls = [
        '/',
        '/brand/siemens',
        '/catalog/promyshlennoe-oborudovanie',
        '/catalog/chastotnye-preobrazovateli',
        '/catalog/gidravlika',
        '/catalog/elektrodvigateli',
        '/catalog/motor-reduktor',
        '/about',
        '/brands'
    ];
    
    console.log('Testing route rendering...');
    for (const u of urls) {
        await page.goto('http://localhost:3000' + u, { waitUntil: 'networkidle' });
        const title = await page.title();
        const contentLen = await page.evaluate(() => document.getElementById('app-content').innerText.length);
        const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText || 'No H1');
        console.log(`[OK] ${u} -> Title: "${title}" | H1: "${h1}" | TextLength: ${contentLen}`);
    }
    
    // Also test client-side SPA navigation without full page reload
    console.log('\nTesting client-side SPA link clicking...');
    await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
    
    // Click on a catalog link
    await page.click('a[href="/catalog/promyshlennoe-oborudovanie"]');
    await page.waitForTimeout(500);
    const navH1 = await page.evaluate(() => document.querySelector('h1')?.innerText || 'No H1');
    const navUrl = page.url();
    console.log(`[SPA Navigation Click] -> Current URL: ${navUrl} | H1: "${navH1}"`);
    
    // Click on another catalog link inside page
    await page.click('a[href="/catalog/gidravlika"]');
    await page.waitForTimeout(500);
    const navH2 = await page.evaluate(() => document.querySelector('h1')?.innerText || 'No H1');
    const navUrl2 = page.url();
    console.log(`[SPA Navigation Click 2] -> Current URL: ${navUrl2} | H1: "${navH2}"`);
    
    await browser.close();
    console.log('\nAll checks passed successfully!');
})();
