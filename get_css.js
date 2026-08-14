const { chromium } = require('playwright');
(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    
    await page.goto('https://snabsystem.ru/brand/akcesoria', { waitUntil: 'networkidle' });
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(l => l.href);
    });
    console.log(links);
    
    await browser.close();
})();
