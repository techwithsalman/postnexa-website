/**
 * PostNexa Article Publishing Script
 *
 * Usage:
 *   node scripts/publish_article.js --list
 *   node scripts/publish_article.js <slug>
 *   node scripts/publish_article.js --all
 *
 * Actions performed upon publication:
 * 1. Validates that drafts/<slug>/index.html exists.
 * 2. Promotes drafts/<slug> to blog/<slug>.
 * 3. Updates meta robots from 'noindex, nofollow' to 'index, follow, max-image-preview:large'.
 * 4. Adds entry to sitemap.xml.
 * 5. Adds article card to blog/index.html.
 * 6. Updates publishing-queue.json status to 'published' with timestamp.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const QUEUE_FILE = path.join(ROOT, 'publishing-queue.json');
const SITEMAP_FILE = path.join(ROOT, 'sitemap.xml');
const BLOG_INDEX_FILE = path.join(ROOT, 'blog', 'index.html');
const DRAFTS_DIR = path.join(ROOT, 'drafts');
const BLOG_DIR = path.join(ROOT, 'blog');

function loadQueue() {
  if (!fs.existsSync(QUEUE_FILE)) {
    console.error(`Error: Queue file not found at ${QUEUE_FILE}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(QUEUE_FILE, 'utf8'));
}

function saveQueue(queueData) {
  fs.writeFileSync(QUEUE_FILE, JSON.stringify(queueData, null, 2), 'utf8');
}

function listQueue() {
  const queueData = loadQueue();
  console.log(`\n=== PostNexa Publishing Queue (${queueData.queue.length} articles) ===`);
  console.log(`Cadence: ${queueData.publishingCadence}\n`);
  queueData.queue.forEach((item, idx) => {
    const statusIcon = item.status === 'published' ? '✓ [PUBLISHED]' : '⏳ [PENDING APPROVAL]';
    console.log(`${idx + 1}. [${item.id}] ${item.slug}`);
    console.log(`   Title: ${item.title}`);
    console.log(`   Schedule: ${item.scheduledDate} (Target: ${item.targetDate})`);
    console.log(`   Words: ${item.wordCount} | Queries: ${item.targetQueries.join(', ')}`);
    console.log(`   Status: ${statusIcon}\n`);
  });
}

function publishArticle(slug) {
  const queueData = loadQueue();
  const entry = queueData.queue.find(item => item.slug === slug || item.id === slug);

  if (!entry) {
    console.error(`Error: Article with slug/id '${slug}' not found in publishing-queue.json`);
    process.exit(1);
  }

  if (entry.status === 'published') {
    console.log(`Notice: Article '${entry.slug}' is already marked as published.`);
  }

  const srcDir = path.join(DRAFTS_DIR, entry.slug);
  const destDir = path.join(BLOG_DIR, entry.slug);
  const srcFile = path.join(srcDir, 'index.html');
  const destFile = path.join(destDir, 'index.html');

  if (!fs.existsSync(srcFile)) {
    console.error(`Error: Draft source file not found at ${srcFile}`);
    process.exit(1);
  }

  // 1. Ensure destDir exists
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  // 2. Read draft, update robots tag and breadcrumbs if needed
  let html = fs.readFileSync(srcFile, 'utf8');
  html = html.replace(
    /<meta name="robots" content="noindex, nofollow">.*?(\r?\n)/i,
    '<meta name="robots" content="index, follow, max-image-preview:large">$1'
  );

  // Write to destination
  fs.writeFileSync(destFile, html, 'utf8');
  console.log(`✓ Copied & promoted draft to: blog/${entry.slug}/index.html`);

  // 3. Update sitemap.xml if not already present
  let sitemap = fs.readFileSync(SITEMAP_FILE, 'utf8');
  const sitemapUrl = `https://postnexa.world/blog/${entry.slug}/`;
  if (!sitemap.includes(sitemapUrl)) {
    const today = new Date().toISOString().split('T')[0];
    const sitemapEntry = `  <url>\n    <loc>${sitemapUrl}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.80</priority>\n  </url>\n`;
    
    // Insert after the last blog URL or before </urlset>
    const lastBlogIdx = sitemap.lastIndexOf('https://postnexa.world/blog/');
    if (lastBlogIdx !== -1) {
      const urlCloseIdx = sitemap.indexOf('</url>', lastBlogIdx);
      if (urlCloseIdx !== -1) {
        const insertPos = urlCloseIdx + 7; // after '</url>\n'
        sitemap = sitemap.slice(0, insertPos) + sitemapEntry + sitemap.slice(insertPos);
      } else {
        sitemap = sitemap.replace('</urlset>', `${sitemapEntry}</urlset>`);
      }
    } else {
      sitemap = sitemap.replace('</urlset>', `${sitemapEntry}</urlset>`);
    }
    fs.writeFileSync(SITEMAP_FILE, sitemap, 'utf8');
    console.log(`✓ Added URL to sitemap.xml: ${sitemapUrl}`);
  } else {
    console.log(`ℹ URL already exists in sitemap.xml: ${sitemapUrl}`);
  }

  // 4. Update blog/index.html cards if not already present
  let blogIndex = fs.readFileSync(BLOG_INDEX_FILE, 'utf8');
  if (!blogIndex.includes(`${entry.slug}/index.html`)) {
    const cardHtml = `
          <!-- Article: ${entry.title} -->
          <article class="sc-blog-card" data-category="tools scheduling" data-keywords="${entry.targetQueries.join(' ')}">
            <div class="sc-blog-thumb">
              <img src="../${entry.thumbnail}" alt="${entry.h1}" width="1200" height="675" loading="lazy" decoding="async">
            </div>
            <div class="sc-blog-body">
              <div class="sc-blog-meta">
                <span class="sc-blog-cat">Strategy Guide</span>
                <span>•</span>
                <span>${Math.ceil(entry.wordCount / 180)} min read</span>
              </div>
              <h2 class="sc-blog-title"><a href="${entry.slug}/index.html">${entry.title}</a></h2>
              <p class="sc-blog-excerpt">${entry.metaDescription}</p>
              <div class="sc-card-footer">
                <a href="${entry.slug}/index.html" class="sc-card-link">Read Full Guide ➔</a>
              </div>
            </div>
          </article>
`;
    const gridMatch = '<div class="sc-blog-grid" id="articlesGrid">';
    if (blogIndex.includes(gridMatch)) {
      blogIndex = blogIndex.replace(gridMatch, `${gridMatch}\n${cardHtml}`);
      fs.writeFileSync(BLOG_INDEX_FILE, blogIndex, 'utf8');
      console.log(`✓ Added article card to blog/index.html`);
    } else {
      console.warn(`[WARN] Could not find #articlesGrid in blog/index.html to insert card automatically.`);
    }
  } else {
    console.log(`ℹ Article card already present in blog/index.html`);
  }

  // 5. Update publishing-queue.json entry
  entry.status = 'published';
  entry.publishedAt = new Date().toISOString();
  saveQueue(queueData);
  console.log(`✓ Updated status in publishing-queue.json to 'published'`);
  console.log(`\n🎉 Article '${entry.slug}' successfully published!`);
}

// CLI Routing
const args = process.argv.slice(2);
if (args.length === 0 || args[0] === '--list') {
  listQueue();
} else if (args[0] === '--all') {
  const queueData = loadQueue();
  queueData.queue.forEach(item => {
    publishArticle(item.slug);
  });
} else {
  publishArticle(args[0]);
}
