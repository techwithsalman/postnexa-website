/**
 * PostNexa - Global Navigation Synchronization Engine
 * ====================================================
 * Automatically applies the unified, canonical navigation from js/shared-navigation.js
 * to all internal HTML pages across the website.
 *
 * Source of truth: index.html (Homepage remains unchanged).
 */

const fs = require('fs');
const path = require('path');
const { getHeaderHtml, getDrawerHtml } = require('../js/shared-navigation.js');

const ROOT_DIR = path.resolve(__dirname, '..');

function scanHtmlFiles(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!['node_modules', '.git', '_backup_v1', 'dist', '.wrangler', 'audit-screenshots', 'functions', 'server'].includes(entry.name)) {
        results = results.concat(scanHtmlFiles(fullPath));
      }
    } else if (entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

function syncFile(filePath) {
  const relPath = path.relative(ROOT_DIR, filePath).replace(/\\/g, '/');
  
  // Rule: Do NOT modify index.html (source of truth)
  if (relPath === 'index.html') {
    return { status: 'skipped', reason: 'Homepage source of truth' };
  }

  const content = fs.readFileSync(filePath, 'utf8');

  // 1. Locate header
  const hStart = content.indexOf('<header');
  if (hStart === -1) {
    throw new Error(`Missing <header> in ${relPath}`);
  }

  // 2. Locate mobile drawer start
  let dStart = content.indexOf('class="sc-mobile-drawer"');
  if (dStart === -1) {
    dStart = content.indexOf('class="sc-mobile-menu"');
  }
  if (dStart === -1) {
    throw new Error(`Missing mobile drawer in ${relPath}`);
  }
  const drawerTagStart = content.lastIndexOf('<div', dStart);

  // 3. Balance <div> tags to locate exact mobile drawer end
  let pos = drawerTagStart;
  let depth = 0;
  let drawerEnd = -1;
  while (pos < content.length) {
    if (content.startsWith('<div', pos)) {
      depth++;
      pos += 4;
    } else if (content.startsWith('</div>', pos)) {
      depth--;
      pos += 6;
      if (depth === 0) {
        drawerEnd = pos;
        break;
      }
    } else {
      pos++;
    }
  }

  if (drawerEnd === -1) {
    throw new Error(`Failed to balance drawer div tags in ${relPath}`);
  }

  // 4. Determine relative path prefix by depth
  const pathParts = relPath.split('/');
  const fileDepth = pathParts.length - 1;
  let rel = "";
  if (fileDepth === 1) rel = "../";
  if (fileDepth === 2) rel = "../../";

  // 5. Determine active section
  let active = "";
  if (relPath.startsWith('solutions/')) active = 'solutions';
  else if (relPath.startsWith('features/')) active = 'features';
  else if (relPath.startsWith('tools/')) active = 'tools';
  else if (relPath.startsWith('integrations/')) active = 'integrations';
  else if (relPath.startsWith('pricing/')) active = 'pricing';
  else if (relPath.startsWith('about/')) active = 'about';
  else if (relPath.startsWith('blog/')) active = 'blog';
  else if (relPath.startsWith('contact/')) active = 'contact';

  const newHeader = getHeaderHtml(rel, active);
  const newDrawer = getDrawerHtml(rel, active);

  const beforeHeader = content.substring(0, hStart);
  const afterDrawer = content.substring(drawerEnd);

  // Safety check: ensure afterDrawer contains <main
  if (!afterDrawer.includes('<main')) {
    throw new Error(`Safety check failed: <main> tag not found after drawer in ${relPath}`);
  }

  const updatedContent = `${beforeHeader}${newHeader}\n\n  <!-- Mobile Slideout Navigation Menu -->\n  ${newDrawer}${afterDrawer}`;

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  return { status: 'updated', relPath, rel, active };
}

console.log('=== STARTING GLOBAL NAVIGATION SYNC ===');
const allHtml = scanHtmlFiles(ROOT_DIR);
console.log(`Found ${allHtml.length} HTML files.`);

let updatedCount = 0;
let skippedCount = 0;

for (const file of allHtml) {
  try {
    const res = syncFile(file);
    if (res.status === 'updated') {
      updatedCount++;
    } else {
      skippedCount++;
    }
  } catch (err) {
    console.error(`ERROR processing ${file}:`, err.message);
    process.exit(1);
  }
}

console.log(`\nSync Summary: ${updatedCount} files updated, ${skippedCount} file(s) skipped.`);
console.log('=== GLOBAL NAVIGATION SYNC COMPLETED SUCCESSFULLY ===');
