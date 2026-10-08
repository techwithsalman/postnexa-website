const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
let checkedFiles = 0;
let checkedLinks = 0;
let brokenLinks = [];
const allHtmlFiles = [];

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.git' && entry.name !== '_backup_v1') {
        scanDirectory(fullPath);
      }
    } else if (entry.name.endsWith('.html')) {
      allHtmlFiles.push(fullPath);
    }
  }
}

scanDirectory(ROOT);

console.log(`Found ${allHtmlFiles.length} HTML files to audit.`);

allHtmlFiles.forEach(htmlFile => {
  checkedFiles++;
  const content = fs.readFileSync(htmlFile, 'utf8');
  const fileDir = path.dirname(htmlFile);

  // Check title
  if (!content.includes('<title>')) {
    console.warn(`[WARN] No <title> in ${path.relative(ROOT, htmlFile)}`);
  }

  // Check meta description
  if (!content.includes('name="description"')) {
    console.warn(`[WARN] No meta description in ${path.relative(ROOT, htmlFile)}`);
  }

  // Extract hrefs and srcs
  const linkRegex = /(?:href|src)=["']([^"'#?]+)["']/g;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const link = match[1];
    checkedLinks++;

    // Skip external links, anchors, mailto, tel, javascript
    if (link.startsWith('http://') || link.startsWith('https://') || link.startsWith('mailto:') || link.startsWith('tel:') || link.startsWith('javascript:')) {
      continue;
    }

    // Resolve relative path
    const targetPath = path.resolve(fileDir, link);
    if (!fs.existsSync(targetPath)) {
      brokenLinks.push({
        sourceFile: path.relative(ROOT, htmlFile),
        brokenLink: link,
        resolvedPath: path.relative(ROOT, targetPath)
      });
    }
  }
});

console.log(`\n================ AUDIT RESULTS ================`);
console.log(`Total HTML Pages: ${checkedFiles}`);
console.log(`Total Link & Asset References Checked: ${checkedLinks}`);
console.log(`Broken Links: ${brokenLinks.length}`);

if (brokenLinks.length > 0) {
  console.log("\nBroken Links Found:");
  brokenLinks.forEach(b => {
    console.log(`- In ${b.sourceFile}: '${b.brokenLink}' (resolved: ${b.resolvedPath})`);
  });
} else {
  console.log("\nALL INTERNAL LINKS AND ASSETS ARE 100% VALID & RESOLVED!");
}
