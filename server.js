/**
 * SNABSYSTEM.RU Local Standalone Server
 * Zero-dependency pure Node.js HTTP server with SPA routing, static file serving and asset fallbacks.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const IMAGES_DIR = path.join(PUBLIC_DIR, 'assets', 'images');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://localhost:${PORT}`);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // API endpoints
  if (pathname === '/api/callback' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('Received callback request:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Заявка на обратный звонок принята' }));
    });
    return;
  }

  if (pathname === '/api/order' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      console.log('Received order/quote request:', body);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Запрос на КП успешно оформлен' }));
    });
    return;
  }

  // Resolve static file path
  let filePath = path.join(PUBLIC_DIR, pathname);

  // Prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (!err && stats.isFile()) {
      serveFile(filePath, res);
    } else {
      const ext = path.extname(pathname).toLowerCase();
      
      // Image fallback: check if asset exists in public/assets/images/<basename>
      if (['.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico'].includes(ext)) {
        const baseName = path.basename(pathname);
        const fallbackImgPath = path.join(IMAGES_DIR, baseName);
        if (fs.existsSync(fallbackImgPath)) {
          serveFile(fallbackImgPath, res);
          return;
        }
      }

      // Check if SPA HTML route
      if (!ext || ext === '.html') {
        const spaFallback = path.join(PUBLIC_DIR, 'index.html');
        serveFile(spaFallback, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      }
    }
  });
});

function serveFile(filePath, res) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(data);
  });
}

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  Сайт snabsystem.ru успешно запущен локально!`);
  console.log(`  URL: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
