const { chromium } = require('playwright');
const pixelmatch = require('pixelmatch').default || require('pixelmatch');
const PNG = require('pngjs').PNG;
const fs = require('fs');

const pagesToTest = [
    { url: '/', file: 'home' },
    { url: '/brand/siemens', file: 'siemens' },
    { url: '/catalog/chastotnye-preobrazovateli', file: 'chastotniki' }
];

(async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.setViewportSize({ width: 1280, height: 2000 }); // Large viewport

    for (const p of pagesToTest) {
        console.log(`\nTesting ${p.url}...`);
        
        // 1. Original
        const origUrl = 'https://snabsystem.ru' + p.url;
        await page.goto(origUrl, { waitUntil: 'networkidle' });
        // hide dynamic/third-party stuff if needed
        await page.evaluate(() => {
            const chat = document.querySelector('.jivo-btn');
            if (chat) chat.style.display = 'none';
        });
        const origHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        await page.setViewportSize({ width: 1280, height: origHeight });
        const origBuffer = await page.screenshot({ fullPage: true });
        
        // 2. Clone
        const cloneUrl = 'http://localhost:3000' + p.url;
        try {
            await page.goto(cloneUrl, { waitUntil: 'networkidle' });
            const cloneHeight = await page.evaluate(() => document.documentElement.scrollHeight);
            await page.setViewportSize({ width: 1280, height: cloneHeight });
            const cloneBuffer = await page.screenshot({ fullPage: true });

            // 3. Compare
            const img1 = PNG.sync.read(origBuffer);
            const img2 = PNG.sync.read(cloneBuffer);
            
            const width = Math.min(img1.width, img2.width);
            const height = Math.min(img1.height, img2.height);
            const diff = new PNG({ width, height });

            const numDiffPixels = pixelmatch(
                img1.data, img2.data, diff.data, width, height,
                { threshold: 0.1 }
            );

            const totalPixels = width * height;
            const diffPercent = (numDiffPixels / totalPixels * 100).toFixed(2);
            
            console.log(`- Mismatch: ${numDiffPixels} pixels (${diffPercent}%)`);
            
            // Save diff
            fs.writeFileSync(`screenshots/diff_${p.file}.png`, PNG.sync.write(diff));
            console.log(`- Diff saved to screenshots/diff_${p.file}.png`);
            
            if (Math.abs(origHeight - cloneHeight) > 5) {
                 console.log(`- WARNING: Height mismatch! Orig: ${origHeight}, Clone: ${cloneHeight}`);
            }
        } catch (e) {
            console.error(`- Failed to test clone: ${e.message}`);
        }
    }

    await browser.close();
})();
