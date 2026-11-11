/**
 * PostNexa - Unified Global Navigation Component
 * ===============================================
 * Single Source of Truth for Sticky Header & Mobile Drawer.
 * Built directly from index.html (Homepage canonical reference).
 * Supports relative root depth ("/", "../", "../../") and active menu state.
 */

function getHeaderHtml(rel = "", active = "") {
  return `<header class="sc-header" id="scHeader">
    <div class="sc-container-wide sc-header-inner">
      
      <!-- Brand Logo -->
      <a href="${rel}index.html" class="sc-logo-link" aria-label="PostNexa Home">
        <img src="${rel}assets/logos/postnexa-logo.png" alt="PostNexa by Tech With Salman" class="sc-logo-img" width="168" height="36" fetchpriority="high">
      </a>

      <!-- Desktop Navigation Links & Mega Menus -->
      <nav class="sc-nav-desktop" aria-label="Primary Navigation">
        <ul class="sc-nav-list">
          
          <!-- Menu Item: Solutions -->
          <li class="sc-nav-item">
            <button type="button" class="sc-nav-head${active === 'solutions' ? ' is-active' : ''}" aria-expanded="false" aria-haspopup="true">
              Solutions
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="sc-mega-menu">
              <div class="sc-container-wide">
                <div class="sc-mega-grid sc-mega-solutions">
                  
                  <!-- Col 1: Overview -->
                  <div class="sc-mega-col">
                    <h3 class="sc-mega-lead">Solutions Overview</h3>
                    <p class="sc-mega-desc">PostNexa brings structured content planning and multi-account publishing into one workspace tailored for your role.</p>
                    <a href="${rel}solutions/index.html" class="sc-card-link" style="margin-top: 16px;">View All Solutions ➔</a>
                  </div>

                  <!-- Col 2: By Use Case -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">By Role &amp; Team</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}solutions/creators/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">For Content Creators</a></li>
                      <li><a href="${rel}solutions/small-businesses/index.html" class="sc-mega-link"><img src="${rel}assets/icons/heart.svg" class="sc-mega-link-icon" alt="">For Small Businesses</a></li>
                      <li><a href="${rel}solutions/agencies/index.html" class="sc-mega-link"><img src="${rel}assets/icons/analytics.svg" class="sc-mega-link-icon" alt="">For Marketing Agencies</a></li>
                      <li><a href="${rel}solutions/social-media-managers/index.html" class="sc-mega-link"><img src="${rel}assets/icons/engage.svg" class="sc-mega-link-icon" alt="">For Social Media Managers</a></li>
                      <li><a href="${rel}solutions/teams/index.html" class="sc-mega-link"><img src="${rel}assets/icons/support.svg" class="sc-mega-link-icon" alt="">For Growing Teams</a></li>
                    </ul>
                  </div>

                  <!-- Col 3: Core Capabilities -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">Platform Highlights</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}features/social-media-scheduling/index.html" class="sc-mega-link"><span class="sc-badge-status sc-badge-live">Live</span> Multi-Account Scheduling</a></li>
                      <li><a href="${rel}features/content-calendar/index.html" class="sc-mega-link"><span class="sc-badge-status sc-badge-live">Live</span> Visual Content Calendar</a></li>
                      <li><a href="${rel}features/social-publishing/index.html" class="sc-mega-link"><span class="sc-badge-status sc-badge-live">Live</span> Direct Channel Publishing</a></li>
                      <li><a href="${rel}features/ai-caption-writer/index.html" class="sc-mega-link"><span class="sc-badge-status sc-badge-dev">Beta</span> AI Caption Generator</a></li>
                      <li><a href="${rel}features/automation/index.html" class="sc-mega-link"><span class="sc-badge-status sc-badge-soon">Planned</span> Cloud Auto-Queues</a></li>
                    </ul>
                  </div>

                  <!-- Col 4: Parent Attribution Card -->
                  <div class="sc-mega-col">
                    <div class="sc-mega-demo-card">
                      <div>
                        <h4>Developed by Tech With Salman</h4>
                        <p>Designed as a modern social media management platform for creators and digital teams.</p>
                      </div>
                      <a href="https://app.postnexa.world/" class="sc-btn sc-btn-yellow sc-btn-pill" target="_blank" rel="noopener">Launch App ➔</a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </li>

          <!-- Menu Item: Features -->
          <li class="sc-nav-item">
            <button type="button" class="sc-nav-head${active === 'features' ? ' is-active' : ''}" aria-expanded="false" aria-haspopup="true">
              Features
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="sc-mega-menu">
              <div class="sc-container-wide">
                <div class="sc-mega-grid sc-mega-features">
                  
                  <!-- Col 1: Overview -->
                  <div class="sc-mega-col">
                    <h3 class="sc-mega-lead">Core Features</h3>
                    <p class="sc-mega-desc">Plan, organize, and publish social media content across official APIs with transparent development status.</p>
                    <a href="${rel}features/index.html" class="sc-card-link" style="margin-top: 16px;">Browse All 12 Features ➔</a>
                  </div>

                  <!-- Col 2: Feature Links -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">Publishing &amp; Planning</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}features/social-media-scheduling/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Post Scheduling</a></li>
                      <li><a href="${rel}features/content-calendar/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Content Calendar</a></li>
                      <li><a href="${rel}features/social-publishing/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Social Publishing</a></li>
                      <li><a href="${rel}features/bulk-scheduling/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Bulk Scheduling</a></li>
                      <li><a href="${rel}features/ai-caption-writer/index.html" class="sc-mega-link"><img src="${rel}assets/icons/ai-bot.svg" class="sc-mega-link-icon" alt="">AI Caption Writer</a></li>
                    </ul>
                  </div>

                  <!-- Col 3: Advanced & Intelligence -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">Intelligence &amp; Growth</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}features/ai-content-generator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/ai-bot.svg" class="sc-mega-link-icon" alt="">AI Content Generator</a></li>
                      <li><a href="${rel}features/ai-image-generator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/ai-bot.svg" class="sc-mega-link-icon" alt="">AI Image Creator</a></li>
                      <li><a href="${rel}features/design-studio/index.html" class="sc-mega-link"><img src="${rel}assets/icons/star.svg" class="sc-mega-link-icon" alt="">Design Studio</a></li>
                      <li><a href="${rel}features/analytics/index.html" class="sc-mega-link"><img src="${rel}assets/icons/analytics.svg" class="sc-mega-link-icon" alt="">Analytics &amp; Reports</a></li>
                      <li><a href="${rel}features/social-inbox/index.html" class="sc-mega-link"><img src="${rel}assets/icons/engage.svg" class="sc-mega-link-icon" alt="">Social Inbox</a></li>
                      <li><a href="${rel}features/team-collaboration/index.html" class="sc-mega-link"><img src="${rel}assets/icons/support.svg" class="sc-mega-link-icon" alt="">Team Collaboration</a></li>
                    </ul>
                  </div>

                  <!-- Col 4: Integrations Spotlight -->
                  <div class="sc-mega-col">
                    <div class="sc-mega-demo-card">
                      <div>
                        <h4>Connected Platforms</h4>
                        <p>Support for Facebook, Instagram, YouTube, TikTok, LinkedIn, and more.</p>
                      </div>
                      <a href="${rel}integrations/index.html" class="sc-btn sc-btn-yellow sc-btn-pill">View Integrations ➔</a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </li>

          <!-- Menu Item: Tools -->
          <li class="sc-nav-item">
            <button type="button" class="sc-nav-head${active === 'tools' ? ' is-active' : ''}" aria-expanded="false" aria-haspopup="true">
              Tools
              <svg class="chevron-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </button>
            <div class="sc-mega-menu">
              <div class="sc-container-wide">
                <div class="sc-mega-grid sc-mega-solutions">
                  
                  <!-- Col 1: Overview -->
                  <div class="sc-mega-col">
                    <span class="sc-badge-status sc-badge-live">23 Free Tools</span>
                    <h3 class="sc-mega-lead">Free Tools Hub</h3>
                    <p class="sc-mega-desc">100% free in-browser utilities: image optimization, PDF editing, text formatting, calculators, and social media tools.</p>
                    <a href="${rel}tools/index.html" class="sc-card-link" style="margin-top: 16px;">Browse All 23 Free Tools ➔</a>
                  </div>

                  <!-- Col 2: Image & PDF Tools -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">Image &amp; PDF Tools</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}tools/image-compressor/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Image Compressor</a></li>
                      <li><a href="${rel}tools/image-resizer/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Image Resizer</a></li>
                      <li><a href="${rel}tools/images-to-webp/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Images to WebP</a></li>
                      <li><a href="${rel}tools/merge-pdf/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Merge PDF</a></li>
                      <li><a href="${rel}tools/split-pdf/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Split PDF</a></li>
                      <li><a href="${rel}tools/compress-pdf/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Compress PDF</a></li>
                    </ul>
                  </div>

                  <!-- Col 3: Text & Calculators -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">Text &amp; Calculators</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}tools/word-counter/index.html" class="sc-mega-link"><img src="${rel}assets/icons/ai-bot.svg" class="sc-mega-link-icon" alt="">Word Counter</a></li>
                      <li><a href="${rel}tools/character-counter/index.html" class="sc-mega-link"><img src="${rel}assets/icons/ai-bot.svg" class="sc-mega-link-icon" alt="">Character Counter</a></li>
                      <li><a href="${rel}tools/case-converter/index.html" class="sc-mega-link"><img src="${rel}assets/icons/star.svg" class="sc-mega-link-icon" alt="">Case Converter</a></li>
                      <li><a href="${rel}tools/percentage-calculator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/analytics.svg" class="sc-mega-link-icon" alt="">Percentage Calculator</a></li>
                      <li><a href="${rel}tools/age-calculator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Age Calculator</a></li>
                      <li><a href="${rel}tools/discount-calculator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/analytics.svg" class="sc-mega-link-icon" alt="">Discount Calculator</a></li>
                    </ul>
                  </div>

                  <!-- Col 4: Social Media Tools -->
                  <div class="sc-mega-col">
                    <h4 class="sc-mega-col-title">Social Media Tools</h4>
                    <ul class="sc-mega-list">
                      <li><a href="${rel}tools/caption-generator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/ai-bot.svg" class="sc-mega-link-icon" alt="">AI Caption Generator</a></li>
                      <li><a href="${rel}tools/hashtag-generator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/star.svg" class="sc-mega-link-icon" alt="">Hashtag Generator</a></li>
                      <li><a href="${rel}tools/content-calendar-generator/index.html" class="sc-mega-link"><img src="${rel}assets/icons/calendar.svg" class="sc-mega-link-icon" alt="">Content Calendar</a></li>
                      <li><a href="${rel}tools/image-size-checker/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Image Size Checker</a></li>
                      <li><a href="${rel}tools/social-media-downloader/index.html" class="sc-mega-link"><img src="${rel}assets/icons/publish.svg" class="sc-mega-link-icon" alt="">Video Downloader</a></li>
                    </ul>
                    <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid #E2E8F0;">
                      <a href="${rel}tools/index.html" class="sc-card-link" style="font-weight: 700; font-size: 13px;">View All 23 Free Tools ➔</a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </li>

          <!-- Direct Links -->
          <li class="sc-nav-item">
            <a href="${rel}integrations/index.html" class="sc-nav-head${active === 'integrations' ? ' is-active' : ''}">Integrations</a>
          </li>
          <li class="sc-nav-item">
            <a href="${rel}pricing/index.html" class="sc-nav-head${active === 'pricing' ? ' is-active' : ''}">Pricing</a>
          </li>
          <li class="sc-nav-item">
            <a href="${rel}about/index.html" class="sc-nav-head${active === 'about' ? ' is-active' : ''}">About</a>
          </li>
          <li class="sc-nav-item">
            <a href="${rel}blog/index.html" class="sc-nav-head${active === 'blog' ? ' is-active' : ''}">Blog</a>
          </li>
          <li class="sc-nav-item">
            <a href="${rel}contact/index.html" class="sc-nav-head${active === 'contact' ? ' is-active' : ''}">Contact</a>
          </li>

        </ul>
      </nav>

      <!-- Right Header Actions (Login + CTA) -->
      <div class="sc-header-actions">
        <a href="https://app.postnexa.world/login" class="sc-login-link" target="_blank" rel="noopener">Login</a>
        <a href="https://app.postnexa.world/signup" class="sc-header-cta" target="_blank" rel="noopener">
          <span>Get Started</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>

        <!-- Mobile Hamburger Toggle Button -->
        <button type="button" class="sc-hamburger-btn" id="scMobileToggle" aria-label="Toggle navigation menu" aria-expanded="false" aria-controls="scMobileDrawer">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>

    </div>
  </header>`;
}

function getDrawerHtml(rel = "", active = "") {
  return `<div class="sc-mobile-drawer" id="scMobileDrawer" aria-label="Mobile Navigation">
    <div class="sc-mobile-drawer-header">
      <a href="${rel}index.html" class="sc-logo-link" aria-label="PostNexa Home">
        <img src="${rel}assets/logos/postnexa-logo.png" alt="PostNexa by Tech With Salman" class="sc-logo-img">
      </a>
      <button type="button" class="sc-mobile-close-btn" id="scMobileClose" aria-label="Close navigation menu">&times;</button>
    </div>
    <ul class="sc-mobile-list">
      
      <li class="sc-mobile-item">
        <button type="button" class="sc-mobile-link-head" aria-expanded="false">
          <span>Solutions</span>
          <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="sc-mobile-submenu">
          <a href="${rel}solutions/index.html" class="sc-mobile-sublink">Solutions Overview</a>
          <a href="${rel}solutions/creators/index.html" class="sc-mobile-sublink">For Content Creators</a>
          <a href="${rel}solutions/small-businesses/index.html" class="sc-mobile-sublink">For Small Businesses</a>
          <a href="${rel}solutions/agencies/index.html" class="sc-mobile-sublink">For Marketing Agencies</a>
          <a href="${rel}solutions/social-media-managers/index.html" class="sc-mobile-sublink">For Social Media Managers</a>
          <a href="${rel}solutions/teams/index.html" class="sc-mobile-sublink">For Growing Teams</a>
        </div>
      </li>

      <li class="sc-mobile-item">
        <button type="button" class="sc-mobile-link-head" aria-expanded="false">
          <span>Features</span>
          <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="sc-mobile-submenu">
          <a href="${rel}features/index.html" class="sc-mobile-sublink">All Features</a>
          <a href="${rel}features/social-media-scheduling/index.html" class="sc-mobile-sublink">Social Media Scheduling</a>
          <a href="${rel}features/content-calendar/index.html" class="sc-mobile-sublink">Content Calendar</a>
          <a href="${rel}features/social-publishing/index.html" class="sc-mobile-sublink">Social Publishing</a>
          <a href="${rel}features/bulk-scheduling/index.html" class="sc-mobile-sublink">Bulk CSV Scheduling</a>
          <a href="${rel}features/ai-caption-writer/index.html" class="sc-mobile-sublink">AI Caption Writer</a>
          <a href="${rel}features/ai-content-generator/index.html" class="sc-mobile-sublink">AI Content Generator</a>
          <a href="${rel}features/ai-image-generator/index.html" class="sc-mobile-sublink">AI Image Creator</a>
          <a href="${rel}features/design-studio/index.html" class="sc-mobile-sublink">Design Studio</a>
          <a href="${rel}features/analytics/index.html" class="sc-mobile-sublink">Analytics &amp; Reports</a>
          <a href="${rel}features/social-inbox/index.html" class="sc-mobile-sublink">Social Inbox</a>
          <a href="${rel}features/automation/index.html" class="sc-mobile-sublink">Automation Workflows</a>
          <a href="${rel}features/team-collaboration/index.html" class="sc-mobile-sublink">Team Collaboration</a>
        </div>
      </li>

      <li class="sc-mobile-item">
        <button type="button" class="sc-mobile-link-head" aria-expanded="false">
          <span>Free Tools Hub (23)</span>
          <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>
        <div class="sc-mobile-submenu">
          <a href="${rel}tools/index.html" class="sc-mobile-sublink" style="font-weight: 700; color: var(--color-primary);">★ Browse All 23 Free Tools Hub</a>
          <div style="padding: 8px 12px 3px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8;">Social Media Tools</div>
          <a href="${rel}tools/caption-generator/index.html" class="sc-mobile-sublink">AI Caption Generator</a>
          <a href="${rel}tools/hashtag-generator/index.html" class="sc-mobile-sublink">Viral Hashtag Generator</a>
          <a href="${rel}tools/content-calendar-generator/index.html" class="sc-mobile-sublink">Content Calendar Tool</a>
          <a href="${rel}tools/image-size-checker/index.html" class="sc-mobile-sublink">Image Size Checker</a>
          <a href="${rel}tools/social-media-downloader/index.html" class="sc-mobile-sublink">Social Media Video Downloader</a>
          <div style="padding: 8px 12px 3px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8;">Image &amp; PDF Tools</div>
          <a href="${rel}tools/image-compressor/index.html" class="sc-mobile-sublink">Image Compressor</a>
          <a href="${rel}tools/image-resizer/index.html" class="sc-mobile-sublink">Image Resizer</a>
          <a href="${rel}tools/jpg-to-png/index.html" class="sc-mobile-sublink">JPG to PNG</a>
          <a href="${rel}tools/png-to-jpg/index.html" class="sc-mobile-sublink">PNG to JPG</a>
          <a href="${rel}tools/images-to-webp/index.html" class="sc-mobile-sublink">Images to WebP</a>
          <a href="${rel}tools/merge-pdf/index.html" class="sc-mobile-sublink">Merge PDF</a>
          <a href="${rel}tools/split-pdf/index.html" class="sc-mobile-sublink">Split PDF</a>
          <a href="${rel}tools/compress-pdf/index.html" class="sc-mobile-sublink">Compress PDF</a>
          <a href="${rel}tools/images-to-pdf/index.html" class="sc-mobile-sublink">Images to PDF</a>
          <div style="padding: 8px 12px 3px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; color: #94A3B8;">Text &amp; Calculators</div>
          <a href="${rel}tools/word-counter/index.html" class="sc-mobile-sublink">Word Counter</a>
          <a href="${rel}tools/character-counter/index.html" class="sc-mobile-sublink">Character Counter</a>
          <a href="${rel}tools/case-converter/index.html" class="sc-mobile-sublink">Case Converter</a>
          <a href="${rel}tools/remove-duplicate-lines/index.html" class="sc-mobile-sublink">Remove Duplicate Lines</a>
          <a href="${rel}tools/text-cleaner/index.html" class="sc-mobile-sublink">Text Cleaner</a>
          <a href="${rel}tools/percentage-calculator/index.html" class="sc-mobile-sublink">Percentage Calculator</a>
          <a href="${rel}tools/age-calculator/index.html" class="sc-mobile-sublink">Age Calculator</a>
          <a href="${rel}tools/discount-calculator/index.html" class="sc-mobile-sublink">Discount Calculator</a>
          <a href="${rel}tools/unit-converter/index.html" class="sc-mobile-sublink">Unit Converter</a>
        </div>
      </li>

      <li class="sc-mobile-item">
        <a href="${rel}integrations/index.html" class="sc-mobile-direct-link">Integrations</a>
      </li>
      <li class="sc-mobile-item">
        <a href="${rel}pricing/index.html" class="sc-mobile-direct-link">Pricing</a>
      </li>
      <li class="sc-mobile-item">
        <a href="${rel}about/index.html" class="sc-mobile-direct-link">About PostNexa</a>
      </li>
      <li class="sc-mobile-item">
        <a href="${rel}blog/index.html" class="sc-mobile-direct-link">Blog &amp; Guides</a>
      </li>
      <li class="sc-mobile-item">
        <a href="${rel}changelog/index.html" class="sc-mobile-direct-link">Changelog</a>
      </li>
      <li class="sc-mobile-item">
        <a href="${rel}roadmap/index.html" class="sc-mobile-direct-link">Product Roadmap</a>
      </li>
      <li class="sc-mobile-item">
        <a href="${rel}contact/index.html" class="sc-mobile-direct-link">Contact Support</a>
      </li>

    </ul>

    <div class="sc-mobile-actions">
      <a href="https://app.postnexa.world/login" class="sc-btn sc-btn-secondary" target="_blank" rel="noopener" style="width: 100%; justify-content: center;">Log In</a>
      <a href="https://app.postnexa.world/signup" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener" style="width: 100%; justify-content: center;">Get Started ➔</a>
    </div>
  </div>`;
}

function getFullNavigationHtml(rel = "", active = "") {
  return `${getHeaderHtml(rel, active)}\n\n  <!-- Mobile Slideout Navigation Menu -->\n  ${getDrawerHtml(rel, active)}`;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    getHeaderHtml,
    getDrawerHtml,
    getFullNavigationHtml
  };
}
