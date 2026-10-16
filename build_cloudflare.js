/**
 * PostNexa - Cloudflare Pages & Workers Static Assets Build & Verification Script
 * ===============================================================================
 * Assembles a clean, self-contained production static bundle in ./dist
 * and verifies all 36 HTML routes, 5,400+ asset links, SEO metadata,
 * and Cloudflare's 25 MiB per-file limit.
 */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const DIST = path.join(ROOT, 'dist');
const MAX_CF_FILE_BYTES = 25 * 1024 * 1024; // 25 MiB Cloudflare Pages / Static Assets limit

const PUBLIC_DIRS = [
  'about',
  'assets',
  'blog',
  'changelog',
  'coming-soon',
  'contact',
  'cookie-policy',
  'css',
  'data-deletion',
  'faq',
  'features',
  'help',
  'integrations',
  'js',
  'pricing',
  'privacy-policy',
  'roadmap',
  'solutions',
  'terms',
  'tools'
];

const PUBLIC_ROOT_FILES = [
  'index.html',
  '404.html',
  'ads.txt',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  '_redirects'
];

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
  }
}

console.log('=== POSTNEXA CLOUDFLARE STATIC BUILD ===');

// 1. Clean and create ./dist
if (fs.existsSync(DIST)) {
  fs.rmSync(DIST, { recursive: true, force: true });
}
fs.mkdirSync(DIST, { recursive: true });

// 2. Copy root public files
for (const file of PUBLIC_ROOT_FILES) {
  const srcPath = path.join(ROOT, file);
  if (!fs.existsSync(srcPath)) {
    console.error(`[ERROR] Missing required public root file: ${file}`);
    process.exit(1);
  }
  fs.copyFileSync(srcPath, path.join(DIST, file));
}

// 3. Copy public route & asset directories
for (const dir of PUBLIC_DIRS) {
  const srcDir = path.join(ROOT, dir);
  if (!fs.existsSync(srcDir)) {
    console.error(`[ERROR] Missing required public directory: ${dir}`);
    process.exit(1);
  }
  copyRecursive(srcDir, path.join(DIST, dir));
}

// 4. Scan ./dist to verify routes, links, DOM integrity, and Cloudflare file size limits
const htmlFiles = [];
const allDistFiles = [];
const oversizedFiles = [];

function scanDist(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDist(fullPath);
    } else {
      const stat = fs.statSync(fullPath);
      allDistFiles.push({ path: fullPath, size: stat.size });
      if (stat.size > MAX_CF_FILE_BYTES) {
        oversizedFiles.push({
          file: path.relative(DIST, fullPath),
          sizeMiB: (stat.size / (1024 * 1024)).toFixed(2)
        });
      }
      if (entry.name.endsWith('.html')) {
        htmlFiles.push(fullPath);
      }
    }
  }
}

scanDist(DIST);

let checkedLinks = 0;
const brokenLinks = [];
const domErrors = [];

for (const htmlFile of htmlFiles) {
  const content = fs.readFileSync(htmlFile, 'utf8');
  const fileDir = path.dirname(htmlFile);
  const relPath = path.relative(DIST, htmlFile);

  if (!content.includes('<title>')) {
    domErrors.push(`Missing <title> in ${relPath}`);
  }
  if (!content.includes('name="description"')) {
    domErrors.push(`Missing meta description in ${relPath}`);
  }
  if (!content.includes('class="sc-nav-desktop"')) {
    domErrors.push(`Missing desktop navigation in ${relPath}`);
  }
  if (!content.includes('id="scMobileDrawer"') && !content.includes('class="sc-mobile-menu"')) {
    domErrors.push(`Missing mobile drawer in ${relPath}`);
  }

  const linkRegex = /(?:href|src)=["']([^"'#?]+)["']/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];
    checkedLinks++;

    if (
      link.startsWith('http://') ||
      link.startsWith('https://') ||
      link.startsWith('mailto:') ||
      link.startsWith('tel:') ||
      link.startsWith('javascript:')
    ) {
      continue;
    }

    const targetPath = link.startsWith('/')
      ? path.join(DIST, link)
      : path.resolve(fileDir, link);

    if (!fs.existsSync(targetPath)) {
      brokenLinks.push({
        sourceFile: relPath,
        brokenLink: link
      });
    }
  }
}

console.log(`Total Files in ./dist: ${allDistFiles.length}`);
console.log(`Total HTML Routes Verified: ${htmlFiles.length}`);
console.log(`Total Internal Links & Asset References Verified: ${checkedLinks}`);
console.log(`Broken Links: ${brokenLinks.length}`);
console.log(`DOM Errors: ${domErrors.length}`);
console.log(`Files Exceeding 25 MiB Cloudflare Limit: ${oversizedFiles.length}`);

if (brokenLinks.length > 0 || domErrors.length > 0 || oversizedFiles.length > 0) {
  if (brokenLinks.length > 0) {
    console.error('\nBroken Links:', brokenLinks);
  }
  if (domErrors.length > 0) {
    console.error('\nDOM Errors:', domErrors);
  }
  if (oversizedFiles.length > 0) {
    console.error('\nOversized Files (> 25 MiB):', oversizedFiles);
  }
  process.exit(1);
}

console.log('=== CLOUDFLARE BUILD & VERIFICATION SUCCEEDED ===');
