const fs = require('fs');
const path = require('path');

console.log('--- COMPREHENSIVE 35-PAGE DOM AUDIT ---');
let htmlFiles = [];
function scan(dir) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      if (!['.git', 'node_modules', 'audit-screenshots', '_backup_v1'].includes(f)) scan(full);
    } else if (f.endsWith('.html')) {
      htmlFiles.push(full);
    }
  }
}
scan('.');

let errors = 0;
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative('.', file);

  // 1. Check for sc-nav-desktop
  if (!content.includes('class="sc-nav-desktop"')) {
    console.error('Missing sc-nav-desktop in ' + rel);
    errors++;
  }

  // 2. Check for sc-mobile-drawer or sc-mobile-menu
  if (!content.includes('id="scMobileDrawer"') && !content.includes('class="sc-mobile-menu"')) {
    console.error('Missing mobile drawer in ' + rel);
    errors++;
  }

  // 3. Check for mobile close button
  if (!content.includes('id="scMobileClose"')) {
    console.error('Missing scMobileClose in ' + rel);
    errors++;
  }

  // 4. Check for legacy name 'Social Media OS' in customer-facing text
  if (content.includes('Social Media OS')) {
    console.error('Unapproved Social Media OS reference in ' + rel);
    errors++;
  }
}

if (errors === 0) {
  console.log('ALL ' + htmlFiles.length + ' HTML PAGES PASSED FULL DOM & NAVIGATION INTEGRITY CHECK!');
  process.exit(0);
} else {
  console.error('Total DOM errors found: ' + errors);
  process.exit(1);
}
