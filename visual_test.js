const { chromium } = require('playwright');
const fs = require('fs');
const PNG = require('pngjs').PNG;
const pixelmatch = require('pixelmatch').default || require('pixelmatch');

(async () => {
  // Config
  const width = 1280;
  const height = 1500;
  const originalUrl = 'https://snabsystem.ru/catalog/elektrodvigateli/akcesoria';
  const cloneUrl = 'http://localhost:3000/brand/akcesoria';

  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
  }

  console.log('Launching browser...');
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width, height }
  });

  console.log('Navigating to original...');
  await page.goto(originalUrl, { waitUntil: 'networkidle' });
  // Add some custom CSS to hide elements that are completely different or dynamic (like chat widgets, or animated things)
  // For now, let's just wait a bit to ensure it's rendered
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/original.png', fullPage: true });

  console.log('Navigating to clone...');
  await page.goto(cloneUrl, { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'screenshots/clone.png', fullPage: true });

  await browser.close();
  console.log('Screenshots saved. Comparing...');

  try {
    const img1 = PNG.sync.read(fs.readFileSync('screenshots/original.png'));
    const img2 = PNG.sync.read(fs.readFileSync('screenshots/clone.png'));

    // Align sizes if necessary (they should be identical because of fixed viewport, but fullPage height can differ)
    const maxWidth = Math.max(img1.width, img2.width);
    const maxHeight = Math.max(img1.height, img2.height);

    // Create a diff image of the same size
    const diff = new PNG({ width: maxWidth, height: maxHeight });

    // Ensure images are same dimensions for pixelmatch, if not, create new PNGs and copy data
    // For simplicity, assuming same size or we'll pad with empty pixels.
    let img1Data = img1.data;
    let img2Data = img2.data;

    if (img1.width !== img2.width || img1.height !== img2.height) {
        console.warn(`Dimensions differ! Original: ${img1.width}x${img1.height}, Clone: ${img2.width}x${img2.height}`);
        const padPng = (img, w, h) => {
            const padded = new PNG({ width: w, height: h });
            PNG.bitblt(img, padded, 0, 0, img.width, img.height, 0, 0);
            return padded.data;
        };
        img1Data = padPng(img1, maxWidth, maxHeight);
        img2Data = padPng(img2, maxWidth, maxHeight);
    }

    const numDiffPixels = pixelmatch(img1Data, img2Data, diff.data, maxWidth, maxHeight, {
      threshold: 0.1, // sensitivity
      diffColor: [255, 0, 0] // Red for differences
    });

    fs.writeFileSync('screenshots/diff.png', PNG.sync.write(diff));

    const totalPixels = maxWidth * maxHeight;
    const diffPercent = ((numDiffPixels / totalPixels) * 100).toFixed(2);

    console.log(`Mismatch: ${numDiffPixels} pixels (${diffPercent}%)`);
    console.log('Saved screenshots/diff.png');
  } catch (e) {
      console.error('Error during comparison:', e);
  }

})();
