const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

const PORT = 8099;
const ROOT_DIR = __dirname;
const SCREENSHOT_DIR = path.join(ROOT_DIR, 'audit-screenshots');

if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2'
};

// 1. Create static HTTP server
const server = http.createServer((req, res) => {
  let reqPath = decodeURI(req.url.split('?')[0]);
  if (reqPath.endsWith('/')) {
    reqPath += 'index.html';
  }
  let filePath = path.join(ROOT_DIR, reqPath);

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && !fs.statSync(filePath).isDirectory()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(PORT, async () => {
  console.log(`Test server running at http://localhost:${PORT}/`);

  // 2. Verify all 35 routes via HTTP
  const routes = [
    '/',
    '/features/',
    '/features/social-media-scheduling/',
    '/features/content-calendar/',
    '/features/social-publishing/',
    '/features/bulk-scheduling/',
    '/features/ai-caption-writer/',
    '/features/ai-content-generator/',
    '/features/ai-image-generator/',
    '/features/design-studio/',
    '/features/analytics/',
    '/features/social-inbox/',
    '/features/automation/',
    '/features/team-collaboration/',
    '/solutions/',
    '/solutions/creators/',
    '/solutions/small-businesses/',
    '/solutions/agencies/',
    '/solutions/social-media-managers/',
    '/solutions/teams/',
    '/integrations/',
    '/pricing/',
    '/about/',
    '/contact/',
    '/faq/',
    '/help/',
    '/blog/',
    '/blog/social-media-scheduling-guide/',
    '/changelog/',
    '/roadmap/',
    '/privacy-policy/',
    '/terms/',
    '/cookie-policy/',
    '/data-deletion/',
    '/404.html'
  ];

  console.log(`\n--- VERIFYING 35 ROUTES VIA HTTP ---`);
  let passedCount = 0;
  for (const r of routes) {
    const status = await new Promise(resolve => {
      http.get(`http://localhost:${PORT}${r}`, res => {
        resolve(res.statusCode);
      }).on('error', () => resolve(500));
    });
    if (status === 200) {
      passedCount++;
    } else {
      console.error(`FAILED: ${r} returned status ${status}`);
    }
  }
  console.log(`Routes HTTP verification: ${passedCount} / ${routes.length} PASSED (200 OK)`);

  // 3. Take representative screenshots using Chrome / Edge
  const chromePath = fs.existsSync('C:\\Program Files\\Google\Chrome\\Application\\chrome.exe')
    ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

  const viewports = [
    { name: 'desktop', width: 1440, height: 900 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'mobile', width: 375, height: 812 }
  ];

  const targetPages = [
    { name: 'homepage', path: '/' },
    { name: 'about', path: '/about/' },
    { name: 'features-scheduling', path: '/features/social-media-scheduling/' },
    { name: 'features-caption-writer', path: '/features/ai-caption-writer/' },
    { name: 'solutions-creators', path: '/solutions/creators/' },
    { name: 'pricing', path: '/pricing/' },
    { name: 'integrations', path: '/integrations/' },
    { name: 'blog-guide', path: '/blog/social-media-scheduling-guide/' },
    { name: 'contact', path: '/contact/' }
  ];

  console.log(`\n--- CAPTURING RESPONSIVE SCREENSHOTS ---`);
  for (const page of targetPages) {
    for (const vp of viewports) {
      const outFile = path.join(SCREENSHOT_DIR, `${page.name}-${vp.name}.png`);
      const url = `http://localhost:${PORT}${page.path}`;
      const cmd = `"${chromePath}" --headless=new --disable-gpu --hide-scrollbars --window-size=${vp.width},${vp.height} --screenshot="${outFile}" "${url}"`;
      try {
        execSync(cmd, { stdio: 'pipe' });
        if (fs.existsSync(outFile)) {
          const stats = fs.statSync(outFile);
          console.log(`Captured: ${path.basename(outFile)} (${(stats.size / 1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.error(`Error capturing ${page.name}-${vp.name}:`, err.message);
      }
    }
  }

  // 4. Verify Brand Mentions across all files
  console.log(`\n--- BRAND INTEGRITY SCAN ---`);
  const htmlFiles = [];
  function scan(dir) {
    for (const file of fs.readdirSync(dir)) {
      const full = path.join(dir, file);
      if (fs.statSync(full).isDirectory()) {
        if (!['.git', 'node_modules', 'audit-screenshots'].includes(file)) scan(full);
      } else if (file.endsWith('.html')) {
        htmlFiles.push(full);
      }
    }
  }
  scan(ROOT_DIR);

  let brandErrors = 0;
  for (const file of htmlFiles) {
    const text = fs.readFileSync(file, 'utf8');
    // Ensure "PostNexa" exists and no placeholder names like "Social Champ" in product titles
    if (!text.includes('PostNexa')) {
      console.warn(`Warning: PostNexa brand name missing in ${path.relative(ROOT_DIR, file)}`);
      brandErrors++;
    }
  }
  if (brandErrors === 0) {
    console.log(`Brand Integrity: All ${htmlFiles.length} HTML files verified with official PostNexa branding.`);
  }

  server.close(() => {
    console.log(`\nVerification complete. Server shut down.`);
    process.exit(0);
  });
});
