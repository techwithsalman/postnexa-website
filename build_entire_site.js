const fs = require('fs');
const path = require('path');

const BASE_DIR = __dirname;

function get_rel_prefix(depth) {
  if (depth === 0) return "";
  if (depth === 1) return "../";
  if (depth === 2) return "../../";
  return "";
}

function header_html(rel, active = "") {
  return `  <!-- =========================================================================
       STICKY HEADER & MEGA NAVIGATION
       ========================================================================= -->
  <header class="sc-header" id="scHeader">
    <div class="sc-container-wide sc-header-inner">
      
      <!-- Brand Logo -->
      <a href="${rel}index.html" class="sc-logo-link" aria-label="PostNexa Home">
        <img src="${rel}assets/logos/postnexa-logo.svg" alt="PostNexa by Tech With Salman" class="sc-logo-img">
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
                  
                  <div class="sc-mega-col">
                    <h3 class="sc-mega-lead">Solutions Overview</h3>
                    <p class="sc-mega-desc">PostNexa brings structured content planning and multi-account publishing into one workspace tailored for your role.</p>
                    <a href="${rel}solutions/index.html" class="sc-card-link" style="margin-top: 16px;">View All Solutions ➔</a>
                  </div>

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

                  <div class="sc-mega-col">
                    <div class="sc-mega-demo-card">
                      <div>
                        <h4>Developed by Tech With Salman</h4>
                        <p>Designed as a modern social media management platform for creators and digital teams.</p>
                      </div>
                      <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-yellow sc-btn-pill" target="_blank" rel="noopener">Launch App ➔</a>
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
                  
                  <div class="sc-mega-col">
                    <h3 class="sc-mega-lead">Core Features</h3>
                    <p class="sc-mega-desc">Plan, organize, and publish social media content across official APIs with transparent development status.</p>
                    <a href="${rel}features/index.html" class="sc-card-link" style="margin-top: 16px;">Browse All 12 Features ➔</a>
                  </div>

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

                  <div class="sc-mega-col">
                    <div class="sc-mega-demo-card">
                      <div>
                        <h4>Feature Roadmap</h4>
                        <p>Track live API integrations, beta rollouts, and upcoming capabilities.</p>
                      </div>
                      <a href="${rel}roadmap/index.html" class="sc-btn sc-btn-yellow sc-btn-pill">View Roadmap ➔</a>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </li>

          <!-- Direct Link: Integrations -->
          <li class="sc-nav-item">
            <a href="${rel}integrations/index.html" class="sc-nav-head${active === 'integrations' ? ' is-active' : ''}">Integrations</a>
          </li>

          <!-- Direct Link: Pricing -->
          <li class="sc-nav-item">
            <a href="${rel}pricing/index.html" class="sc-nav-head${active === 'pricing' ? ' is-active' : ''}">Pricing</a>
          </li>

          <!-- Direct Link: About -->
          <li class="sc-nav-item">
            <a href="${rel}about/index.html" class="sc-nav-head${active === 'about' ? ' is-active' : ''}">About</a>
          </li>

          <!-- Direct Link: Blog -->
          <li class="sc-nav-item">
            <a href="${rel}blog/index.html" class="sc-nav-head${active === 'blog' ? ' is-active' : ''}">Blog</a>
          </li>

          <!-- Direct Link: Contact -->
          <li class="sc-nav-item">
            <a href="${rel}contact/index.html" class="sc-nav-head${active === 'contact' ? ' is-active' : ''}">Contact</a>
          </li>

        </ul>
      </nav>

      <!-- Right Header Actions (Login + CTA) -->
      <div class="sc-header-actions">
        <a href="https://app.techwithsalman.online/" class="sc-login-link" target="_blank" rel="noopener">Login</a>
        <a href="https://app.techwithsalman.online/" class="sc-header-cta" target="_blank" rel="noopener">
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
  </header>

  <!-- Mobile Slideout Navigation Menu -->
  <div class="sc-mobile-drawer" id="scMobileDrawer" aria-label="Mobile Navigation">
    <div class="sc-mobile-drawer-header">
      <a href="${rel}index.html" class="sc-logo-link" aria-label="PostNexa Home">
        <img src="${rel}assets/logos/postnexa-logo.svg" alt="PostNexa by Tech With Salman" class="sc-logo-img">
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
          <a href="${rel}features/index.html" class="sc-mobile-sublink">All Features Directory</a>
          <a href="${rel}features/social-media-scheduling/index.html" class="sc-mobile-sublink">Post Scheduling</a>
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
      <li class="sc-mobile-item"><a href="${rel}integrations/index.html" class="sc-mobile-direct-link">Integrations</a></li>
      <li class="sc-mobile-item"><a href="${rel}pricing/index.html" class="sc-mobile-direct-link">Pricing</a></li>
      <li class="sc-mobile-item"><a href="${rel}blog/index.html" class="sc-mobile-direct-link">Blog &amp; Guides</a></li>
      <li class="sc-mobile-item"><a href="${rel}roadmap/index.html" class="sc-mobile-direct-link">Roadmap</a></li>
      <li class="sc-mobile-item"><a href="${rel}changelog/index.html" class="sc-mobile-direct-link">Changelog</a></li>
      <li class="sc-mobile-item"><a href="${rel}about/index.html" class="sc-mobile-direct-link">About PostNexa</a></li>
      <li class="sc-mobile-item"><a href="${rel}contact/index.html" class="sc-mobile-direct-link">Contact Support</a></li>
    </ul>
    <div class="sc-mobile-actions">
      <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-secondary" style="width: 100%; justify-content: center;" target="_blank" rel="noopener">Log In</a>
      <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" style="width: 100%; justify-content: center;" target="_blank" rel="noopener">Get Started ➔</a>
    </div>
  </div>
  `;
}

function footer_html(rel) {
  return `  <!-- =========================================================================
       FOOTER
       ========================================================================= -->
  <footer class="sc-footer">
    <div class="sc-container-wide">
      
      <div class="sc-footer-grid">
        
        <!-- Col 1: Product Features -->
        <div>
          <h4 class="sc-footer-col-title">Product Features</h4>
          <ul class="sc-footer-links">
            <li><a href="${rel}features/social-media-scheduling/index.html" class="sc-footer-link">Social Scheduling</a></li>
            <li><a href="${rel}features/content-calendar/index.html" class="sc-footer-link">Content Calendar</a></li>
            <li><a href="${rel}features/social-publishing/index.html" class="sc-footer-link">Multi-Channel Publishing</a></li>
            <li><a href="${rel}features/ai-caption-writer/index.html" class="sc-footer-link">AI Caption Writer</a></li>
            <li><a href="${rel}features/ai-content-generator/index.html" class="sc-footer-link">AI Content Generator</a></li>
            <li><a href="${rel}features/ai-image-generator/index.html" class="sc-footer-link">AI Image Creator</a></li>
            <li><a href="${rel}features/analytics/index.html" class="sc-footer-link">Analytics &amp; Reports</a></li>
            <li><a href="${rel}features/automation/index.html" class="sc-footer-link">Automation Workflows</a></li>
          </ul>
        </div>

        <!-- Col 2: Solutions -->
        <div>
          <h4 class="sc-footer-col-title">Solutions</h4>
          <ul class="sc-footer-links">
            <li><a href="${rel}solutions/creators/index.html" class="sc-footer-link">For Content Creators</a></li>
            <li><a href="${rel}solutions/small-businesses/index.html" class="sc-footer-link">For Small Businesses</a></li>
            <li><a href="${rel}solutions/agencies/index.html" class="sc-footer-link">For Marketing Agencies</a></li>
            <li><a href="${rel}solutions/social-media-managers/index.html" class="sc-footer-link">For Social Managers</a></li>
            <li><a href="${rel}solutions/teams/index.html" class="sc-footer-link">For Growing Teams</a></li>
            <li><a href="${rel}solutions/index.html" class="sc-footer-link">Solutions Directory</a></li>
          </ul>
        </div>

        <!-- Col 3: Integrations -->
        <div>
          <h4 class="sc-footer-col-title">Integrations</h4>
          <ul class="sc-footer-links">
            <li><a href="${rel}integrations/index.html" class="sc-footer-link">Facebook Publishing</a></li>
            <li><a href="${rel}integrations/index.html" class="sc-footer-link">Instagram Reels</a></li>
            <li><a href="${rel}integrations/index.html" class="sc-footer-link">YouTube Video Uploads</a></li>
            <li><a href="${rel}integrations/index.html" class="sc-footer-link">TikTok Scheduling</a></li>
            <li><a href="${rel}integrations/index.html" class="sc-footer-link">LinkedIn Integration</a></li>
            <li><a href="${rel}integrations/index.html" class="sc-footer-link">Integrations Directory</a></li>
          </ul>
        </div>

        <!-- Col 4: Resources & Blog -->
        <div>
          <h4 class="sc-footer-col-title">Resources</h4>
          <ul class="sc-footer-links">
            <li><a href="${rel}blog/index.html" class="sc-footer-link">Social Media Blog</a></li>
            <li><a href="${rel}changelog/index.html" class="sc-footer-link">Changelog &amp; Releases</a></li>
            <li><a href="${rel}roadmap/index.html" class="sc-footer-link">Product Roadmap</a></li>
            <li><a href="${rel}help/index.html" class="sc-footer-link">Help Center</a></li>
            <li><a href="${rel}faq/index.html" class="sc-footer-link">Frequently Asked Questions</a></li>
          </ul>
        </div>

        <!-- Col 5: Company & Parent -->
        <div>
          <h4 class="sc-footer-col-title">Company</h4>
          <ul class="sc-footer-links">
            <li><a href="${rel}about/index.html" class="sc-footer-link">About PostNexa</a></li>
            <li><a href="https://techwithsalman.online/" class="sc-footer-link" target="_blank" rel="noopener">Tech With Salman</a></li>
            <li><a href="${rel}pricing/index.html" class="sc-footer-link">Pricing Plans</a></li>
            <li><a href="${rel}contact/index.html" class="sc-footer-link">Contact Us</a></li>
            <li><a href="https://app.techwithsalman.online/" class="sc-footer-link" target="_blank" rel="noopener">Application Dashboard</a></li>
          </ul>
        </div>

        <!-- Col 6: Legal & Compliance -->
        <div>
          <h4 class="sc-footer-col-title">Legal</h4>
          <ul class="sc-footer-links">
            <li><a href="${rel}privacy-policy/index.html" class="sc-footer-link">Privacy Policy</a></li>
            <li><a href="${rel}terms/index.html" class="sc-footer-link">Terms of Service</a></li>
            <li><a href="${rel}cookie-policy/index.html" class="sc-footer-link">Cookie Policy</a></li>
            <li><a href="${rel}data-deletion/index.html" class="sc-footer-link">Data Deletion</a></li>
            <li><a href="${rel}sitemap.xml" class="sc-footer-link">Sitemap</a></li>
          </ul>
        </div>

      </div>

      <hr class="sc-footer-divider">

      <!-- Footer Bottom Strip: Social Links + Copyright + Legal -->
      <div class="sc-footer-bottom">
        
        <!-- Social Icon Links -->
        <div class="sc-footer-socials">
          <a href="https://techwithsalman.online/" class="sc-social-icon-btn" aria-label="Tech With Salman" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"></circle></svg></a>
          <a href="https://facebook.com" class="sc-social-icon-btn" aria-label="Facebook" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
          <a href="https://instagram.com" class="sc-social-icon-btn" aria-label="Instagram" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a href="https://youtube.com" class="sc-social-icon-btn" aria-label="YouTube" target="_blank" rel="noopener"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg></a>
        </div>

        <!-- Copyright Note -->
        <div>
          <p>&copy; 2026 PostNexa. Developed by <a href="https://techwithsalman.online/" target="_blank" rel="noopener" style="color: var(--color-primary); font-weight: 700;">Tech With Salman</a>.</p>
        </div>

        <!-- Legal Links -->
        <div class="sc-footer-legal-links">
          <a href="${rel}privacy-policy/index.html">Privacy</a>
          <a href="${rel}terms/index.html">Terms</a>
          <a href="${rel}cookie-policy/index.html">Cookies</a>
          <a href="${rel}data-deletion/index.html">Data Deletion</a>
        </div>

      </div>

    </div>
  </footer>

  <!-- Core Scripts -->
  <script src="${rel}js/config.js"></script>
  <script src="${rel}js/main.js"></script>
`;
}

function make_page(rel_path, depth, active, title, desc, canonical, main_html) {
  const rel = get_rel_prefix(depth);
  const full_html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  
  <!-- Primary SEO Meta Tags -->
  <title>${title} — PostNexa by Tech With Salman</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="https://techwithsalman.online/postnexa/${canonical}">

  <!-- Open Graph / Social Sharing -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title} — PostNexa">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="${rel}assets/images/dashboard-hero.svg">

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">

  <!-- Core Stylesheets -->
  <link rel="stylesheet" href="${rel}css/style.css">
  <link rel="stylesheet" href="${rel}css/responsive.css">

  <!-- Favicon -->
  <link rel="icon" type="image/svg+xml" href="${rel}assets/logos/postnexa-logo.svg">
</head>
<body>

${header_html(rel, active)}

<main id="mainContent">
${main_html}
</main>

${footer_html(rel)}

</body>
</html>
`;
  const abs_path = path.join(BASE_DIR, rel_path);
  fs.mkdirSync(path.dirname(abs_path), { recursive: true });
  fs.writeFileSync(abs_path, full_html, 'utf8');
  console.log(`Generated: ${rel_path}`);
}

// =========================================================================
// 1. FEATURE DETAIL PAGES
// =========================================================================
const features_data = [
  {
    slug: "social-media-scheduling",
    title: "Multi-Account Social Media Scheduling",
    badge_type: "live",
    badge_label: "Live Feature",
    desc: "Automate cross-platform publishing with dedicated time slots, custom queue cadences, and background cloud delivery.",
    preview: "calendar-preview.svg",
    hero_mockup: "dashboard-hero.svg",
    eyebrow: "Core Publishing Architecture",
    capabilities: [
      { icon: "calendar.svg", title: "Precision Time Slotting", desc: "Design custom daily publishing windows per social channel so posts go live during peak engagement hours." },
      { icon: "publish.svg", title: "Cross-Channel Queue Engine", desc: "Queue a single post and let PostNexa tailor formatting and aspect ratios across all selected accounts." },
      { icon: "check.svg", title: "100% Official API Delivery", desc: "Published directly through Meta Graph API and YouTube Data API with zero shadow-ban risks." }
    ],
    deep_dive_1: {
      eyebrow: "Automated Publishing",
      title: "Never Miss an Optimal Audience Window",
      desc: "Stop setting manual phone alarms or jumping between five browser tabs. PostNexa's autonomous cloud workers deliver your scheduled content at the exact designated minute.",
      bullets: ["Set independent schedules for Facebook Pages, Instagram, and YouTube", "Visual countdown until next scheduled deployment", "Automatic token refresh ensures uninterrupted publishing"],
      visual: "calendar-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Fast Post Composer",
      title: "Compose Once, Format for Every Feed",
      desc: "Customize caption lengths, hashtags, and media attachments for individual networks within a single unified composer.",
      bullets: ["Per-network preview simulator before publishing", "Direct aspect ratio validation (1:1, 9:16, 16:9)", "One-click first comment scheduling"],
      visual: "distribution-preview.svg"
    },
    steps: [
      { num: "01", title: "Connect Social Profiles", desc: "Authorize your Facebook Pages, Instagram Professional, and YouTube channels via official OAuth." },
      { num: "02", title: "Set Your Weekly Queues", desc: "Define your preferred publishing days and times, or pick custom dates on the visual calendar." },
      { num: "03", title: "Queue & Relax", desc: "Drop your media and copy into the composer. PostNexa handles verified background delivery." }
    ],
    related: ["content-calendar", "social-publishing", "ai-caption-writer"],
    faqs: [
      { q: "Does my computer need to stay on when posts are scheduled?", a: "No. All scheduled posts are stored securely in our cloud database and published autonomously by background worker services." },
      { q: "Can I edit a scheduled post after adding it to the queue?", a: "Yes. You can edit the text, change media assets, or drag the post to a new date on the visual calendar anytime before publication." },
      { q: "Which platforms support direct video scheduling?", a: "Direct video scheduling is live and verified for Facebook Pages, Instagram Reels, and YouTube channels." }
    ]
  },
  {
    slug: "content-calendar",
    title: "Visual Interactive Content Calendar",
    badge_type: "live",
    badge_label: "Live Feature",
    desc: "Gain total editorial clarity with drag-and-drop month, week, and day views for all your social marketing campaigns.",
    preview: "calendar-preview.svg",
    hero_mockup: "calendar-preview.svg",
    eyebrow: "Editorial Command Center",
    capabilities: [
      { icon: "calendar.svg", title: "Multi-View Grid", desc: "Switch instantly between monthly overview, weekly execution, and daily timeline views." },
      { icon: "publish.svg", title: "Drag-and-Drop Rescheduling", desc: "Move scheduled posts across dates and times with instantaneous database updates." },
      { icon: "engage.svg", title: "Account & Color Filtering", desc: "Filter your calendar by specific brands, social networks, or campaign tags." }
    ],
    deep_dive_1: {
      eyebrow: "Visual Organization",
      title: "Spot Content Gaps Before They Happen",
      desc: "A high-level visual grid ensures your publishing cadence remains steady and balanced across all active social properties.",
      bullets: ["Color-coded channel badges for instant clarity", "Quick-edit modal opens right from the calendar tile", "Filter by Facebook, Instagram, or YouTube with one click"],
      visual: "calendar-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Fluid Scheduling",
      title: "Reschedule in Seconds with Zero Hassle",
      desc: "Need to postpone a campaign launch? Simply drag the post tile to next Tuesday and PostNexa updates the cloud queue automatically.",
      bullets: ["Instant sync with backend cron queues", "Prevents overlapping posts on the same channel", "Preview full captions and media on tile hover"],
      visual: "distribution-preview.svg"
    },
    steps: [
      { num: "01", title: "Open Editorial Calendar", desc: "Access the unified calendar from your PostNexa sidebar dashboard." },
      { num: "02", title: "Drag & Reorganize", desc: "Drop draft posts into empty slots or reorganize existing scheduled campaigns." },
      { num: "03", title: "Publish on Schedule", desc: "Keep your marketing team and clients aligned with a shared visual roadmap." }
    ],
    related: ["social-media-scheduling", "bulk-scheduling", "team-collaboration"],
    faqs: [
      { q: "Can I filter the calendar by a specific brand or client?", a: "Yes. PostNexa allows you to filter the calendar by workspace, specific social channel, or campaign tag." },
      { q: "Can I create a post directly from a calendar date?", a: "Yes. Simply click on any date or time slot in the calendar to open the composer pre-populated with that date." }
    ]
  },
  {
    slug: "social-publishing",
    title: "Direct Social Publishing Engine",
    badge_type: "live",
    badge_label: "Live Feature",
    desc: "Publish high-resolution photos, multi-image carousels, and 4K videos directly through official Meta and YouTube developer APIs.",
    preview: "distribution-preview.svg",
    hero_mockup: "distribution-preview.svg",
    eyebrow: "Direct Cloud Distribution",
    capabilities: [
      { icon: "facebook.svg", title: "Facebook Pages Direct", desc: "Publish photo posts, link previews, and native videos directly to authorized Facebook Business Pages." },
      { icon: "instagram.svg", title: "Instagram Reels & Feed", desc: "Schedule single images, Reels, and carousels through the Meta Business Graph API." },
      { icon: "youtube.svg", title: "YouTube Video Uploads", desc: "Direct video uploading with custom titles, descriptions, tags, and category assignment." }
    ],
    deep_dive_1: {
      eyebrow: "Native Video Processing",
      title: "Full HD & 4K Quality Preserved",
      desc: "Our media processing engine handles encoding and aspect ratio optimization without compressing your original media quality.",
      bullets: ["Optimized for Instagram 9:16 vertical Reels", "Native YouTube video tags and privacy controls", "Automated retry logic for large video uploads"],
      visual: "distribution-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "API Compliance",
      title: "Zero Bot Emulators or Password Storage",
      desc: "PostNexa communicates exclusively through verified developer endpoints, keeping your accounts safe from automated flagging.",
      bullets: ["OAuth 2.0 encrypted token architecture", "No credential scraping or unauthorized access", "Real-time delivery verification receipts"],
      visual: "dashboard-hero.svg"
    },
    steps: [
      { num: "01", title: "Select Target Channels", desc: "Pick any combination of Facebook Pages, Instagram accounts, or YouTube channels." },
      { num: "02", title: "Upload Media & Copy", desc: "Attach high-res media files and write engaging copy with AI suggestions." },
      { num: "03", title: "Deploy Instantly or Queue", desc: "Publish immediately or assign to your scheduled publishing queue." }
    ],
    related: ["social-media-scheduling", "ai-caption-writer", "content-calendar"],
    faqs: [
      { q: "What video formats are supported?", a: "PostNexa supports MP4 and MOV formats up to 4K resolution across YouTube and Meta." },
      { q: "Are personal Instagram profiles supported?", a: "Meta's API requires an Instagram Professional (Business or Creator) account for direct automated publishing." }
    ]
  },
  {
    slug: "bulk-scheduling",
    title: "Bulk CSV & Multi-Post Uploader",
    badge_type: "live",
    badge_label: "Live Feature",
    desc: "Ingest and schedule hundreds of social media posts in minutes using structured CSV spreadsheets or batch composers.",
    preview: "bulk-preview.svg",
    hero_mockup: "bulk-preview.svg",
    eyebrow: "High-Volume Scaling",
    capabilities: [
      { icon: "calendar.svg", title: "CSV Batch Ingestion", desc: "Upload spreadsheets containing captions, timestamps, media URLs, and target channels." },
      { icon: "check.svg", title: "Pre-Flight Syntax Checker", desc: "Detect broken links, character limit overruns, or missing media before queueing." },
      { icon: "publish.svg", title: "One-Click Bulk Mapping", desc: "Assign entire batches to specific social accounts or brand workspaces instantly." }
    ],
    deep_dive_1: {
      eyebrow: "Save Hours Weekly",
      title: "Schedule 30 Days of Content in 10 Minutes",
      desc: "Perfect for agencies onboarding new client campaigns or creators launching monthly marketing blitzes.",
      bullets: ["Download pre-formatted CSV template with one click", "Supports image and video asset URLs", "Visual review screen to inspect and edit before confirmation"],
      visual: "bulk-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Error-Free Ingestion",
      title: "Instant Pre-Flight Error Detection",
      desc: "Our batch parser catches invalid date formats or oversized captions before they can cause publishing failures.",
      bullets: ["Inline editor highlights formatting mistakes", "Bulk delete or adjust timestamps on the fly", "Export batch logs for client sign-offs"],
      visual: "calendar-preview.svg"
    },
    steps: [
      { num: "01", title: "Prepare Your CSV", desc: "Fill in our sample spreadsheet with your captions, dates, and media links." },
      { num: "02", title: "Upload & Verify", desc: "Drop your CSV into PostNexa. Our parser validates each post automatically." },
      { num: "03", title: "Queue & Launch", desc: "Confirm your batch. All posts populate the visual calendar instantly." }
    ],
    related: ["social-media-scheduling", "content-calendar", "team-collaboration"],
    faqs: [
      { q: "Is there a limit on how many posts I can upload via CSV?", a: "Starter and Pro plans support uploading up to 250 scheduled posts per CSV batch." },
      { q: "Where can I find the CSV template?", a: "You can download the sample CSV template directly from the Bulk Scheduling tab in your app dashboard." }
    ]
  },
  {
    slug: "ai-caption-writer",
    title: "Context-Aware AI Caption Generator",
    badge_type: "beta",
    badge_label: "Beta Release",
    desc: "Generate engaging, platform-tailored captions, hooks, and trending hashtag clusters tailored to your distinct brand tone.",
    preview: "caption-preview.svg",
    hero_mockup: "caption-preview.svg",
    eyebrow: "AI Copywriting Studio",
    capabilities: [
      { icon: "ai-bot.svg", title: "Tone of Voice Tuning", desc: "Switch seamlessly between professional, witty, persuasive, and casual copywriting styles." },
      { icon: "star.svg", title: "Smart Hashtag Clustering", desc: "Generate high-relevance hashtags tailored to your niche and target platform." },
      { icon: "publish.svg", title: "Platform Re-Formatting", desc: "Automatically adjusts text length and CTA phrasing for Instagram vs Facebook vs YouTube." }
    ],
    deep_dive_1: {
      eyebrow: "Overcome Writer's Block",
      title: "From a Single Prompt to 3 Engaging Variations",
      desc: "Simply provide a brief campaign theme and let PostNexa's AI copy engine produce structured hooks, body copy, and call-to-actions.",
      bullets: ["Select desired copywriting framework (AIDA, PAS, Hook-Story-Offer)", "Include custom keywords and brand guidelines", "One-click copy directly into the post editor"],
      visual: "caption-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Higher Engagement",
      title: "Optimized Hooks Built for Social Retention",
      desc: "Craft opening lines that stop the scroll on Instagram Reels and YouTube Shorts to maximize viewer retention.",
      bullets: ["Dynamic emoji and spacing formatting", "Real-time character counter per platform", "Hashtag volume suggestions"],
      visual: "ai-suite-preview.svg"
    },
    steps: [
      { num: "01", title: "Enter Topic & Tone", desc: "Type a few words about your post topic and choose your preferred brand voice." },
      { num: "02", title: "Generate Variations", desc: "Review 3 unique caption angles with curated hashtags and call-to-actions." },
      { num: "03", title: "Insert & Schedule", desc: "Select your favorite variation and insert it straight into the post composer." }
    ],
    related: ["ai-content-generator", "ai-image-generator", "social-media-scheduling"],
    faqs: [
      { q: "How many AI captions can I generate?", a: "Starter plan includes 50 AI generations per month; Creator Pro and Agency plans include unlimited generations." },
      { q: "Can I customize the tone of voice?", a: "Yes. You can choose from built-in tones (Professional, Witty, Casual, Urgent) or enter custom tone instructions." }
    ]
  },
  {
    slug: "ai-content-generator",
    title: "AI Campaign & Idea Generator",
    badge_type: "beta",
    badge_label: "Beta Release",
    desc: "Transform long-form articles, YouTube URLs, or broad campaign themes into cohesive multi-week social content calendars.",
    preview: "ai-suite-preview.svg",
    hero_mockup: "ai-suite-preview.svg",
    eyebrow: "Content Repurposing OS",
    capabilities: [
      { icon: "ai-bot.svg", title: "Article-to-Social Multiplier", desc: "Paste a blog URL and extract 5+ bite-sized social posts ready for scheduling." },
      { icon: "calendar.svg", title: "Weekly Content Planner", desc: "Generate 7 days of structured post prompts tailored to your industry niche." },
      { icon: "star.svg", title: "Campaign Angle Generator", desc: "Brainstorm 10 different angles for a single product launch in seconds." }
    ],
    deep_dive_1: {
      eyebrow: "Content Multiplication",
      title: "Turn 1 Article into 10 High-Impact Social Posts",
      desc: "Repurpose existing podcasts, video transcripts, and blog articles to maintain a high-cadence social presence without extra writing.",
      bullets: ["Automatically pulls key quotes and takeaways", "Formats posts for Reels, carousels, and status updates", "Generates corresponding hashtag clusters"],
      visual: "ai-suite-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Never Run Out of Ideas",
      title: "Structured 30-Day Campaign Blueprints",
      desc: "Input your target audience and core offer to receive a complete editorial roadmap of educational, proof, and promotional posts.",
      bullets: ["Balances top-of-funnel and bottom-of-funnel posts", "Prevents content repetition across weeks", "Export full campaign plans to CSV"],
      visual: "calendar-preview.svg"
    },
    steps: [
      { num: "01", title: "Input Source Content", desc: "Paste a website URL, draft notes, or a product theme into the generator." },
      { num: "02", title: "Select Content Output", desc: "Choose whether you need a weekly calendar, single thread, or 5 standalone posts." },
      { num: "03", title: "Batch Schedule", desc: "Review the output and populate your editorial calendar with one click." }
    ],
    related: ["ai-caption-writer", "ai-image-generator", "bulk-scheduling"],
    faqs: [
      { q: "Can I input a blog URL to generate posts?", a: "Yes. Simply paste the public URL and our AI engine extracts key takeaways and drafts social-ready copy." }
    ]
  },
  {
    slug: "ai-image-generator",
    title: "AI Visual & Image Creator",
    badge_type: "dev",
    badge_label: "In Active Development",
    desc: "Generate high-resolution social graphics, background visuals, and marketing imagery directly inside your post composer.",
    preview: "ai-suite-preview.svg",
    hero_mockup: "ai-suite-preview.svg",
    eyebrow: "Creative Asset Studio",
    capabilities: [
      { icon: "star.svg", title: "Text-to-Image Engine", desc: "Generate striking visuals from descriptive text prompts tailored to your post topic." },
      { icon: "publish.svg", title: "Social Aspect Ratios", desc: "Preset sizing for 1:1 Instagram squares, 9:16 Reels/Stories, and 16:9 YouTube thumbnails." },
      { icon: "canva.svg", title: "Direct Composer Bridge", desc: "Attach generated visuals directly to scheduled posts without downloading." }
    ],
    deep_dive_1: {
      eyebrow: "Zero Stock Photos",
      title: "Custom Brand Visuals On Demand",
      desc: "Say goodbye to generic stock photos. Produce unique, high-resolution visuals aligned with your exact campaign aesthetics.",
      bullets: ["Photorealistic, 3D render, and minimalist illustration styles", "Commercial usage rights included", "Direct cropping and editing tools inside PostNexa"],
      visual: "ai-suite-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Faster Workflow",
      title: "Design and Schedule in the Same Tab",
      desc: "Eliminate the friction of switching between external graphic design tools, file downloads, and upload dialogs.",
      bullets: ["Automatic resolution optimization for each platform", "Regenerate alternative visual variations with one click", "Save generated assets to your workspace media library"],
      visual: "distribution-preview.svg"
    },
    steps: [
      { num: "01", title: "Describe Your Visual", desc: "Type a descriptive prompt indicating the scene, lighting, and style." },
      { num: "02", title: "Select Aspect Ratio", desc: "Choose 1:1 for Instagram, 9:16 for vertical video covers, or 16:9 for landscape." },
      { num: "03", title: "Attach to Post", desc: "Select your preferred visual and attach it directly to your scheduled post." }
    ],
    related: ["design-studio", "ai-caption-writer", "social-publishing"],
    faqs: [
      { q: "What is the development status of the AI Image Creator?", a: "This feature is currently in active development and scheduled for rollout in our upcoming platform release." }
    ]
  },
  {
    slug: "design-studio",
    title: "In-App Social Design Studio",
    badge_type: "dev",
    badge_label: "In Active Development",
    desc: "Crop, filter, add text overlays, and style your image assets directly within PostNexa before publishing.",
    preview: "distribution-preview.svg",
    hero_mockup: "distribution-preview.svg",
    eyebrow: "Creative Visual Suite",
    capabilities: [
      { icon: "star.svg", title: "Smart Aspect Ratio Crop", desc: "One-click cropping tailored for Facebook, Instagram, YouTube, and TikTok specs." },
      { icon: "canva.svg", title: "Overlays & Badges", desc: "Add promotional banners, discount stickers, and brand watermarks effortlessly." },
      { icon: "publish.svg", title: "Canva Cloud Bridge", desc: "Import designs directly from your connected Canva workspace." }
    ],
    deep_dive_1: {
      eyebrow: "Quick Tweaks",
      title: "Polish Images Without Heavy Desktop Editors",
      desc: "Make fast brightness adjustments, add brand watermarks, and crop images to exact platform dimensions in seconds.",
      bullets: ["Pre-loaded aspect ratio guides", "Custom brand logo watermark placement", "Non-destructive editing preserves original assets"],
      visual: "distribution-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Connected Workspace",
      title: "Seamless Asset Library Pipeline",
      desc: "Store approved logos, brand templates, and team assets in unified workspace folders for fast retrieval.",
      bullets: ["Shared team media tags", "Direct Canva import integration", "Drag-and-drop file organization"],
      visual: "dashboard-hero.svg"
    },
    steps: [
      { num: "01", title: "Select Asset", desc: "Choose an image from your device or workspace media library." },
      { num: "02", title: "Crop & Style", desc: "Apply aspect ratio presets, add text overlays, or position your logo." },
      { num: "03", title: "Save & Publish", desc: "Save the edited graphic directly to your post composer." }
    ],
    related: ["ai-image-generator", "social-publishing", "content-calendar"],
    faqs: [
      { q: "Does the Design Studio integrate with Canva?", a: "Yes. Our Canva bridge allows you to import designs from your Canva account directly into PostNexa." }
    ]
  },
  {
    slug: "analytics",
    title: "Social Analytics & Reporting",
    badge_type: "dev",
    badge_label: "In Active Development",
    desc: "Track reach, engagement, follower growth, top-performing posts, and UTM campaign traffic across connected profiles.",
    preview: "analytics-preview.svg",
    hero_mockup: "analytics-preview.svg",
    eyebrow: "Growth Intelligence",
    capabilities: [
      { icon: "analytics.svg", title: "Unified Growth Cockpit", desc: "Consolidate impressions, video views, likes, and follower trends across platforms in one clean dashboard." },
      { icon: "star.svg", title: "Top-Performing Content Insights", desc: "Identify which formats, topics, and publishing times generate the highest organic reach." },
      { icon: "publish.svg", title: "Client-Ready PDF Reports", desc: "Generate professional summary decks for monthly client reviews with one click." }
    ],
    deep_dive_1: {
      eyebrow: "Data-Driven Strategy",
      title: "Know Exactly What Drives Follower Growth",
      desc: "Stop guessing what works. Inspect engagement metrics across Reels, carousels, and videos to double down on winning content.",
      bullets: ["Cross-channel engagement rate comparison", "Best time to post recommendations", "Audience demographic breakdown"],
      visual: "analytics-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Agency Reporting",
      title: "Automate Monthly Client Performance Reports",
      desc: "Export beautiful, branded PDF analytics summaries with key performance indicators and growth charts.",
      bullets: ["Custom date range filtering", "White-label client presentation mode", "Automated scheduled email delivery"],
      visual: "dashboard-hero.svg"
    },
    steps: [
      { num: "01", title: "Connect Channels", desc: "Authorize your Facebook, Instagram, and YouTube accounts for read-only analytics." },
      { num: "02", title: "Inspect Growth Dashboards", desc: "Explore aggregated engagement trends, top posts, and traffic attribution." },
      { num: "03", title: "Export Reports", desc: "Download clean PDF decks to share with clients and executive stakeholders." }
    ],
    related: ["social-media-scheduling", "team-collaboration", "solutions/agencies"],
    faqs: [
      { q: "Can I track website traffic from scheduled posts?", a: "Yes. PostNexa automatically attaches UTM tracking parameters to outbound links for Google Analytics (GA4) attribution." }
    ]
  },
  {
    slug: "social-inbox",
    title: "Unified Social Inbox & Engagement",
    badge_type: "dev",
    badge_label: "In Active Development",
    desc: "Manage audience comments, mentions, and community replies across your social channels from a single unified stream.",
    preview: "inbox-preview.svg",
    hero_mockup: "inbox-preview.svg",
    eyebrow: "Community Management",
    capabilities: [
      { icon: "engage.svg", title: "Cross-Account Stream", desc: "Consolidate incoming comments from Facebook Pages, Instagram, and YouTube into one clean feed." },
      { icon: "ai-bot.svg", title: "AI Reply Assistant", desc: "Draft courteous, contextual replies to common customer inquiries in seconds." },
      { icon: "support.svg", title: "Team Assignment", desc: "Assign specific conversations to team members to ensure zero missed inquiries." }
    ],
    deep_dive_1: {
      eyebrow: "Speed Up Response Times",
      title: "Reply to Audience Comments in Half the Time",
      desc: "Never lose track of a prospect inquiry or customer comment buried in native app notification feeds.",
      bullets: ["Mark conversations as Resolved or Pending", "Filter by priority and sentiment", "Save reusable reply snippets for FAQs"],
      visual: "inbox-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Team Community Management",
      title: "Manage Interactions Without Password Sharing",
      desc: "Empower support reps and community managers to engage with followers securely without sharing native account logins.",
      bullets: ["Internal notes on customer profiles", "Audit trail of team replies", "Collision detection prevents duplicate answers"],
      visual: "team-preview.svg"
    },
    steps: [
      { num: "01", title: "Open Unified Inbox", desc: "View all incoming comments and mentions in real time." },
      { num: "02", title: "Draft with AI Assistant", desc: "Generate fast, courteous answers or select pre-saved response snippets." },
      { num: "03", title: "Send & Mark Resolved", desc: "Reply directly through official APIs and maintain zero inbox clutter." }
    ],
    related: ["team-collaboration", "social-publishing", "analytics"],
    faqs: [
      { q: "Which platforms will be supported in the Social Inbox?", a: "Initial rollout will support Facebook Page comments, Instagram post/Reel comments, and YouTube video comments." }
    ]
  },
  {
    slug: "automation",
    title: "Smart Automation & Auto-Queues",
    badge_type: "soon",
    badge_label: "Planned Capability",
    desc: "Build evergreen post recycling loops, automated RSS-to-social publishing, and custom webhook triggers.",
    preview: "distribution-preview.svg",
    hero_mockup: "distribution-preview.svg",
    eyebrow: "Autonomous Operations",
    capabilities: [
      { icon: "calendar.svg", title: "Evergreen Post Recycling", desc: "Automatically re-queue top-performing evergreen posts to reach new audience members continuously." },
      { icon: "publish.svg", title: "RSS Blog Auto-Publishing", desc: "Automatically draft and schedule social posts whenever a new article is published on your blog." },
      { icon: "zapier.svg", title: "Zapier & Webhook Sync", desc: "Trigger scheduled posts from 5,000+ web applications, e-commerce stores, or CRMs." }
    ],
    deep_dive_1: {
      eyebrow: "Hands-Free Presence",
      title: "Keep Channels Active Around the Clock",
      desc: "Set recurring publishing cadences that keep your social properties populated with evergreen educational content.",
      bullets: ["Set expiration dates or maximum cycle limits per post", "Shuffle queue order to maintain variety", "Automatic pause rules during breaking events"],
      visual: "calendar-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Ecosystem Integration",
      title: "Connect Your Entire Tech Stack",
      desc: "Publish social announcements whenever a new product launches in Shopify, a podcast episode drops, or a blog post goes live.",
      bullets: ["Webhook support for custom developer integrations", "Customizable payload templates", "Detailed delivery execution logs"],
      visual: "distribution-preview.svg"
    },
    steps: [
      { num: "01", title: "Create Auto-Queue Rule", desc: "Define your recycling cadence or connect your website's RSS feed." },
      { num: "02", title: "Add Content Assets", desc: "Populate the queue with evergreen tips, testimonials, and core offers." },
      { num: "03", title: "Activate & Monitor", desc: "PostNexa continuously monitors your rules and publishes seamlessly." }
    ],
    related: ["social-media-scheduling", "bulk-scheduling", "content-calendar"],
    faqs: [
      { q: "Can I pause all automations with one click?", a: "Yes. PostNexa features a global 'Pause All Queues' emergency toggle to halt automated posting instantly." }
    ]
  },
  {
    slug: "team-collaboration",
    title: "Multi-Brand Workspaces & Approvals",
    badge_type: "dev",
    badge_label: "In Active Development",
    desc: "Organize client workspaces, invite team members with granular permissions, and enforce review approval gates.",
    preview: "team-preview.svg",
    hero_mockup: "team-preview.svg",
    eyebrow: "Enterprise Collaboration",
    capabilities: [
      { icon: "support.svg", title: "Dedicated Client Workspaces", desc: "Isolate social accounts, media folders, and scheduled queues per brand." },
      { icon: "check.svg", title: "Approval Gateways", desc: "Draft posts require manager or client sign-off before they can be deployed." },
      { icon: "star.svg", title: "Role-Based Access Control", desc: "Assign Admin, Editor, Reviewer, or Viewer roles to team members and contractors." }
    ],
    deep_dive_1: {
      eyebrow: "Agency Architecture",
      title: "Manage 20+ Client Brands Without Account Leaks",
      desc: "Clients never share native account passwords. Team members only access the specific brand workspaces they are assigned to.",
      bullets: ["Switch between workspaces with a single click", "Isolated media libraries per brand", "Custom client approval portals"],
      visual: "team-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Quality Control",
      title: "Eliminate Accidental or Unapproved Posts",
      desc: "Set review gates so content prepared by interns or junior copywriters must be approved by a lead before scheduling.",
      bullets: ["Inline comments and feedback threads on post drafts", "One-click approval or revision requests", "Audit history of edits and approvals"],
      visual: "dashboard-hero.svg"
    },
    steps: [
      { num: "01", title: "Create Workspace", desc: "Set up a dedicated workspace for each client or internal team." },
      { num: "02", title: "Invite Collaborators", desc: "Assign team members with appropriate role permissions (Editor, Reviewer, Admin)." },
      { num: "03", title: "Review & Publish", desc: "Collaborate on drafts, approve pending posts, and execute verified launches." }
    ],
    related: ["bulk-scheduling", "content-calendar", "solutions/agencies"],
    faqs: [
      { q: "Can clients review posts without creating a full account?", a: "Yes. PostNexa provides secure, view-only client review links where clients can approve or comment on scheduled drafts." }
    ]
  }
];

// Write Feature Pages
features_data.forEach(feat => {
  const rel_depth = 2;
  const rel = get_rel_prefix(rel_depth);
  const badge_class = `sc-badge-${feat.badge_type}`;

  // 1. Capabilities Cards
  const cap_html = feat.capabilities.map(c => `
    <div class="sc-feature-item-card">
      <div class="sc-card-icon-wrap">
        <img src="${rel}assets/icons/${c.icon}" alt="">
      </div>
      <h3 class="sc-card-title">${c.title}</h3>
      <p class="sc-card-text">${c.desc}</p>
    </div>
  `).join("");

  // 2. Step Process Flow
  const step_html = feat.steps.map(s => `
    <div class="sc-step-card">
      <div class="sc-step-number">${s.num}</div>
      <h3 class="sc-step-title">${s.title}</h3>
      <p class="sc-step-desc">${s.desc}</p>
    </div>
  `).join("");

  // 3. Related Features
  const related_cards = feat.related.map(r_slug => {
    let title = r_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    let r_url = r_slug.startsWith('solutions/') ? `${rel}${r_slug}/index.html` : `${rel}features/${r_slug}/index.html`;
    return `
      <div class="sc-feature-item-card">
        <div class="sc-card-icon-wrap">
          <img src="${rel}assets/icons/publish.svg" alt="">
        </div>
        <h3 class="sc-card-title">${title}</h3>
        <p class="sc-card-text">Explore how this capability integrates seamlessly with ${feat.title} for maximum publishing speed.</p>
        <div class="sc-card-footer">
          <a href="${r_url}" class="sc-card-link">Explore Feature ➔</a>
        </div>
      </div>
    `;
  }).join("");

  // 4. FAQ Accordions
  const faq_html = feat.faqs.map((f, i) => `
    <div class="sc-faq-item${i === 0 ? ' is-open' : ''}">
      <button type="button" class="sc-faq-trigger" aria-expanded="${i === 0 ? 'true' : 'false'}">
        ${f.q}
        <svg class="sc-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
      </button>
      <div class="sc-faq-content"${i === 0 ? ' style="display: block;"' : ''}>
        <p>${f.a}</p>
      </div>
    </div>
  `).join("");

  const main_html = `
  <!-- Split Hero Section -->
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="${rel}index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <a href="${rel}features/index.html">Features</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>${feat.title}</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status ${badge_class}">${feat.badge_label}</span>
          </div>
          <h1 class="sc-inner-hero-title">${feat.title}</h1>
          <p class="sc-inner-hero-desc">${feat.desc}</p>
          <div class="sc-inner-hero-actions">
            <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">
              Launch in PostNexa ➔
            </a>
            <a href="${rel}pricing/index.html" class="sc-btn sc-btn-outline sc-btn-pill">
              View Plans &amp; Tiers
            </a>
          </div>
          <div class="sc-hero-trust-list">
            <span class="sc-hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> 100% Official APIs</span>
            <span class="sc-hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> Zero Shadow-Ban Risk</span>
            <span class="sc-hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> 14-Day Free Trial</span>
          </div>
        </div>

        <div class="sc-hero-visual-card">
          <img src="${rel}assets/images/${feat.hero_mockup}" alt="${feat.title} Interface Preview">
        </div>
      </div>
    </div>
  </section>

  <!-- Core Capabilities Grid -->
  <section style="padding: 90px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      <div style="text-align: center; max-width: 680px; margin: 0 auto 52px auto;">
        <span class="sc-feat-row-eyebrow">${feat.eyebrow}</span>
        <h2 style="font-size: 34px; font-weight: 900; color: var(--color-text-heading); margin-bottom: 12px;">Engineered for Precision, Scale &amp; Speed</h2>
        <p style="font-size: 16px; color: var(--color-text-muted);">Explore the core architectural capabilities powering this feature in PostNexa.</p>
      </div>

      <div class="sc-card-grid-3">
        ${cap_html}
      </div>
    </div>
  </section>

  <!-- Alternating Feature Deep-Dives -->
  <section style="padding: 90px 0; background-color: var(--color-bg-white);">
    <div class="sc-container">
      
      <!-- Row 1 -->
      <div class="sc-feat-row">
        <div class="sc-feat-row-content">
          <span class="sc-feat-row-eyebrow">${feat.deep_dive_1.eyebrow}</span>
          <h2 class="sc-feat-row-title">${feat.deep_dive_1.title}</h2>
          <p class="sc-feat-row-desc">${feat.deep_dive_1.desc}</p>
          <ul class="sc-feat-bullet-list">
            ${feat.deep_dive_1.bullets.map(b => `<li class="sc-feat-bullet-item"><img src="${rel}assets/icons/check.svg" alt=""> <span>${b}</span></li>`).join("")}
          </ul>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary" target="_blank" rel="noopener">Experience in App ➔</a>
        </div>
        <div class="sc-feat-row-visual">
          <img src="${rel}assets/images/${feat.deep_dive_1.visual}" alt="${feat.deep_dive_1.title}">
        </div>
      </div>

      <!-- Row 2 -->
      <div class="sc-feat-row is-reversed">
        <div class="sc-feat-row-content">
          <span class="sc-feat-row-eyebrow">${feat.deep_dive_2.eyebrow}</span>
          <h2 class="sc-feat-row-title">${feat.deep_dive_2.title}</h2>
          <p class="sc-feat-row-desc">${feat.deep_dive_2.desc}</p>
          <ul class="sc-feat-bullet-list">
            ${feat.deep_dive_2.bullets.map(b => `<li class="sc-feat-bullet-item"><img src="${rel}assets/icons/check.svg" alt=""> <span>${b}</span></li>`).join("")}
          </ul>
          <a href="${rel}integrations/index.html" class="sc-btn sc-btn-outline">View Supported Networks ➔</a>
        </div>
        <div class="sc-feat-row-visual">
          <img src="${rel}assets/images/${feat.deep_dive_2.visual}" alt="${feat.deep_dive_2.title}">
        </div>
      </div>

    </div>
  </section>

  <!-- How It Works 3-Step Process -->
  <section style="padding: 90px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      <div style="text-align: center; max-width: 680px; margin: 0 auto 52px auto;">
        <span class="sc-feat-row-eyebrow">Simplified Workflow</span>
        <h2 style="font-size: 34px; font-weight: 900; color: var(--color-text-heading); margin-bottom: 12px;">Get Started in 3 Simple Steps</h2>
        <p style="font-size: 16px; color: var(--color-text-muted);">From account connection to scheduled publishing, master your social distribution in minutes.</p>
      </div>

      <div class="sc-step-flow-grid">
        ${step_html}
      </div>
    </div>
  </section>

  <!-- Related Capabilities -->
  <section class="sc-related-section">
    <div class="sc-container">
      <div style="text-align: center; max-width: 600px; margin: 0 auto 44px auto;">
        <h2 style="font-size: 28px; font-weight: 900; color: var(--color-text-heading); margin-bottom: 10px;">Related Capabilities</h2>
        <p style="font-size: 15px; color: var(--color-text-muted);">Explore complementary features designed to supercharge your social workflows.</p>
      </div>

      <div class="sc-related-cards-grid">
        ${related_cards}
      </div>
    </div>
  </section>

  <!-- FAQ Accordion -->
  <section style="padding: 90px 0; background-color: var(--color-bg-white);">
    <div class="sc-container" style="max-width: 860px;">
      <div style="text-align: center; margin-bottom: 44px;">
        <span class="sc-feat-row-eyebrow">Common Questions</span>
        <h2 style="font-size: 30px; font-weight: 900; color: var(--color-text-heading);">Frequently Asked Questions</h2>
      </div>

      <div class="sc-faq-accordion">
        ${faq_html}
      </div>
    </div>
  </section>

  <!-- Conversion CTA Banner -->
  <section class="sc-midcta-section">
    <div class="sc-container">
      <div class="sc-midcta-banner">
        <div>
          <h2 class="sc-midcta-title">Ready to Experience ${feat.title}?</h2>
          <p style="font-size: 16px; color: #D1D5DB; margin-top: 6px;">Sign up today on our web application and connect your social accounts in under two minutes.</p>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-yellow sc-btn-pill" target="_blank" rel="noopener">Get Started Free ➔</a>
          <a href="${rel}contact/index.html" class="sc-btn sc-btn-outline" style="color: #FFF; border-color: rgba(255,255,255,0.4);">Contact Us</a>
        </div>
      </div>
    </div>
  </section>
  `;
  make_page(`features/${feat.slug}/index.html`, 2, "features", `${feat.title} | PostNexa Features`, feat.desc, `features/${feat.slug}/`, main_html);
});

// =========================================================================
// 2. FEATURES DIRECTORY INDEX
// =========================================================================
const features_dir_cards = features_data.map(f => {
  const b_class = `sc-badge-${f.badge_type}`;
  let category = "publishing";
  if (f.slug.includes("ai-")) category = "ai";
  if (f.slug.includes("analytics") || f.slug.includes("inbox")) category = "growth";
  if (f.slug.includes("team") || f.slug.includes("design")) category = "management";

  return `
    <div class="sc-feature-item-card" data-category="${category}">
      <div>
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
          <div class="sc-card-icon-wrap" style="margin-bottom: 0;">
            <img src="../assets/icons/${f.capabilities[0].icon}" alt="">
          </div>
          <span class="sc-badge-status ${b_class}">${f.badge_label}</span>
        </div>
        <h3 class="sc-card-title">${f.title}</h3>
        <p class="sc-card-text">${f.desc}</p>
      </div>
      <div class="sc-card-footer">
        <a href="${f.slug}/index.html" class="sc-card-link">Explore Feature ➔</a>
        <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-outline" style="padding: 6px 14px; font-size: 12.5px;" target="_blank" rel="noopener">Try in App</a>
      </div>
    </div>
  `;
}).join("");

const features_index_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Features Directory</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">All 12 Platform Capabilities</span>
          </div>
          <h1 class="sc-inner-hero-title">Powerful Social Media Architecture, Built into One Unified Workspace</h1>
          <p class="sc-inner-hero-desc">Explore PostNexa's complete suite of publishing, AI writing, visual planning, and team collaboration tools — built with complete transparency regarding development status.</p>
          <div class="sc-inner-hero-actions">
            <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">Launch Application ➔</a>
            <a href="../roadmap/index.html" class="sc-btn sc-btn-outline sc-btn-pill">View Roadmap</a>
          </div>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Platform Overview">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      
      <!-- Filter Tabs -->
      <div class="sc-filter-tabs">
        <button type="button" class="sc-filter-tab-btn is-active" data-filter="all">All Features (12)</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="publishing">Publishing &amp; Planning</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="ai">AI Content Studio</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="growth">Growth &amp; Analytics</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="management">Team &amp; Workspaces</button>
      </div>

      <div class="sc-card-grid-3">
        ${features_dir_cards}
      </div>
    </div>
  </section>

  <section class="sc-midcta-section">
    <div class="sc-container">
      <div class="sc-midcta-banner">
        <div>
          <h2 class="sc-midcta-title">Experience the PostNexa Workspace</h2>
          <p style="font-size: 16px; color: #D1D5DB; margin-top: 6px;">Connect your Facebook, Instagram, and YouTube accounts today.</p>
        </div>
        <div>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-yellow sc-btn-pill" target="_blank" rel="noopener">Get Started Free ➔</a>
        </div>
      </div>
    </div>
  </section>
`;
make_page("features/index.html", 1, "features", "Features Directory | All Capabilities", "Explore all 12 PostNexa capabilities including scheduling, visual calendar, AI captions, and multi-channel publishing.", "features/", features_index_html);

// =========================================================================
// 3. SOLUTIONS DETAIL & DIRECTORY PAGES
// =========================================================================
const solutions_data = [
  {
    slug: "creators",
    title: "PostNexa for Content Creators",
    role: "Creators & Influencers",
    desc: "Maintain a consistent publishing cadence across Instagram Reels, YouTube Shorts, and Facebook without burning out.",
    hero_mockup: "dashboard-hero.svg",
    hero_points: ["Multi-channel publishing in one unified click", "AI caption & hashtag generation tailored to your niche", "Visual calendar to plan weekly drops"],
    workflow: [
      { title: "Connect Your Creator Profiles", desc: "Securely authenticate your Instagram Professional and YouTube channels via official OAuth." },
      { title: "Batch Plan Your Week", desc: "Drop video reels and photos into the visual calendar across optimal high-traffic time slots." },
      { title: "Auto-Publish While You Create", desc: "PostNexa handles background delivery while you focus on producing your next piece of content." }
    ],
    deep_dive_1: {
      eyebrow: "Reel & Short Scheduler",
      title: "Direct Video Publishing for Short-Form Creators",
      desc: "Schedule vertical video Reels and YouTube Shorts ahead of time with zero push-notification alarms required.",
      bullets: ["Full HD video quality preserved", "Custom thumbnail selection", "Automated hashtag clustering"],
      visual: "distribution-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "AI Caption Studio",
      title: "Write Engaging Hooks in Seconds",
      desc: "Generate scroll-stopping hooks and engaging call-to-actions tailored to your niche without robotic phrasing.",
      bullets: ["Select casual, witty, or persuasive tone", "Dynamic emoji placement", "Pre-built call-to-action presets"],
      visual: "caption-preview.svg"
    }
  },
  {
    slug: "small-businesses",
    title: "PostNexa for Small Businesses",
    role: "Small Business Owners",
    desc: "Drive local customer engagement and brand loyalty with automated, set-and-forget social media marketing.",
    hero_mockup: "calendar-preview.svg",
    hero_points: ["Set and forget monthly promotional queues", "AI copy generator tailored for sales & specials", "Zero complex setup or heavy agency retainers"],
    workflow: [
      { title: "Map Out Monthly Offers", desc: "Schedule weekly specials, announcements, and product highlights in advance." },
      { title: "Craft Converting Captions", desc: "Use AI caption presets to produce engaging hooks and call-to-actions in seconds." },
      { title: "Stay Active Consistently", desc: "Ensure your business profiles remain active and responsive to potential customers." }
    ],
    deep_dive_1: {
      eyebrow: "Automated Cadence",
      title: "Maintain a Steady Presence with Zero Daily Effort",
      desc: "Keep your local Facebook Pages and Instagram accounts active with promotional offers and updates without taking time away from running your shop.",
      bullets: ["Schedule an entire month of posts in one sitting", "Automated holiday and promotion queues", "Clean visual calendar for total clarity"],
      visual: "calendar-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Cost Efficiency",
      title: "Enterprise Social Power at a Small Business Price",
      desc: "Get the scheduling and multi-account capabilities of high-end social suites without paying hundreds of dollars a month.",
      bullets: ["Generous free tier to start", "Transparent low monthly pricing", "No credit card required for 14-day trial"],
      visual: "dashboard-hero.svg"
    }
  },
  {
    slug: "agencies",
    title: "PostNexa for Marketing Agencies",
    role: "Marketing & Creative Agencies",
    desc: "Scale multi-brand client management with dedicated workspaces, bulk CSV scheduling, and review approval gates.",
    hero_mockup: "team-preview.svg",
    hero_points: ["Isolated workspaces for each brand client", "Bulk CSV schedule uploader for fast campaign launches", "Direct Meta & YouTube API integration"],
    workflow: [
      { title: "Structure Client Workspaces", desc: "Create dedicated workspaces for each client with separated assets and social tokens." },
      { title: "Bulk Upload Content Calendars", desc: "Upload 50+ posts per brand simultaneously using our structured CSV bulk tool." },
      { title: "Deliver Consistent Client Growth", desc: "Execute multi-channel client campaigns without operational friction or password sharing." }
    ],
    deep_dive_1: {
      eyebrow: "Multi-Brand Cockpit",
      title: "Isolate Client Credentials and Assets Securely",
      desc: "Keep every client's social tokens, media files, and queues completely separated with dedicated brand workspaces.",
      bullets: ["Zero password sharing with contractors", "Role-based permissions (Editor, Reviewer, Admin)", "Switch between client brands in one click"],
      visual: "team-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "High-Volume Batching",
      title: "Deploy 50+ Client Posts in One CSV Upload",
      desc: "Ingest monthly client content calendars in seconds using our pre-flight validated CSV uploader.",
      bullets: ["Detects formatting errors before scheduling", "Batch time mapping across time zones", "Export client-ready PDF calendars"],
      visual: "bulk-preview.svg"
    }
  },
  {
    slug: "social-media-managers",
    title: "PostNexa for Social Media Managers",
    role: "Freelance SMMs & Specialists",
    desc: "The ultimate high-speed cockpit for managing multiple client accounts, queues, and publishing deadlines.",
    hero_mockup: "dashboard-hero.svg",
    hero_points: ["Switch between account sets instantly", "Custom queue time slots per social channel", "Drag-and-drop calendar for quick schedule adjustments"],
    workflow: [
      { title: "Centralize Your Accounts", desc: "Eliminate tab-switching by consolidating all managed accounts in one dashboard." },
      { title: "Draft & Polish Fast", desc: "Write, refine with AI suggestions, preview mockups, and schedule in minutes." },
      { title: "Monitor & Optimize", desc: "Keep track of scheduled queues and published posts from a clean overview." }
    ],
    deep_dive_1: {
      eyebrow: "High-Speed Composer",
      title: "Eliminate Browser Tab Fatigue Once and for All",
      desc: "Manage multiple Instagram accounts, Facebook Pages, and YouTube channels from a single, blazing-fast dashboard.",
      bullets: ["Instant channel selector pills", "Pre-simulated feed preview cards", "First comment scheduler included"],
      visual: "distribution-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Fluid Calendar",
      title: "Adjust Dates on the Fly with Drag-and-Drop",
      desc: "Need to shift campaign launch dates? Move post tiles across the calendar grid with instantaneous cloud queue sync.",
      bullets: ["Monthly, weekly, and daily timeline views", "Filter by specific client account", "Color-coded post status tags"],
      visual: "calendar-preview.svg"
    }
  },
  {
    slug: "teams",
    title: "PostNexa for Growing Teams",
    role: "Cross-Functional Marketing Teams",
    desc: "Empower marketing, design, and growth teams to collaborate seamlessly on company social presence.",
    hero_mockup: "team-preview.svg",
    hero_points: ["Shared team media libraries and templates", "Clear visibility into upcoming company announcements", "Multi-user workspace management"],
    workflow: [
      { title: "Invite Team Members", desc: "Add copywriters, designers, and managers into unified workspace environments." },
      { title: "Collaborate on Editorial Calendars", desc: "Review planned launch dates and align product marketing with social output." },
      { title: "Automate Cross-Network Publishing", desc: "Deploy major product launches simultaneously across all official company profiles." }
    ],
    deep_dive_1: {
      eyebrow: "Approval Gates",
      title: "Ensure Every Scheduled Post Meets Brand Guidelines",
      desc: "Set review gates so content prepared by team members requires manager approval before publishing.",
      bullets: ["Inline feedback threads on draft tiles", "One-click approval or edit requests", "Full audit log of post modifications"],
      visual: "team-preview.svg"
    },
    deep_dive_2: {
      eyebrow: "Shared Asset Library",
      title: "Centralized Media Assets for the Entire Team",
      desc: "Store approved logos, brand templates, and high-res video assets in unified workspace folders.",
      bullets: ["Shared brand tag organization", "Canva cloud import bridge", "Instant asset insertion into post composer"],
      visual: "dashboard-hero.svg"
    }
  }
];

// Write Solution Pages
solutions_data.forEach(s => {
  const rel_depth = 2;
  const rel = get_rel_prefix(rel_depth);

  const workflow_html = s.workflow.map((step, i) => `
    <div class="sc-step-card">
      <div class="sc-step-number">0${i + 1}</div>
      <h3 class="sc-step-title">${step.title}</h3>
      <p class="sc-step-desc">${step.desc}</p>
    </div>
  `).join("");

  const points_html = s.hero_points.map(p => `
    <span class="sc-hero-trust-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg> ${p}</span>
  `).join("");

  const main_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="${rel}index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <a href="${rel}solutions/index.html">Solutions</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>${s.title}</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Tailored Solution for ${s.role}</span>
          </div>
          <h1 class="sc-inner-hero-title">${s.title}</h1>
          <p class="sc-inner-hero-desc">${s.desc}</p>
          <div class="sc-inner-hero-actions">
            <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">
              Start Free Trial ➔
            </a>
            <a href="${rel}pricing/index.html" class="sc-btn sc-btn-outline sc-btn-pill">
              View Pricing Tiers
            </a>
          </div>
          <div class="sc-hero-trust-list">
            ${points_html}
          </div>
        </div>

        <div class="sc-hero-visual-card">
          <img src="${rel}assets/images/${s.hero_mockup}" alt="${s.title} Workspace">
        </div>
      </div>
    </div>
  </section>

  <!-- How It Works -->
  <section style="padding: 90px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      <div style="text-align: center; max-width: 680px; margin: 0 auto 52px auto;">
        <span class="sc-feat-row-eyebrow">Proven Workflow</span>
        <h2 style="font-size: 34px; font-weight: 900; color: var(--color-text-heading); margin-bottom: 12px;">How ${s.role} Scale with PostNexa</h2>
        <p style="font-size: 16px; color: var(--color-text-muted);">From content ideation to multi-channel execution, simplify every phase of your publishing process.</p>
      </div>

      <div class="sc-step-flow-grid">
        ${workflow_html}
      </div>
    </div>
  </section>

  <!-- Alternating Feature Deep-Dives -->
  <section style="padding: 90px 0; background-color: var(--color-bg-white);">
    <div class="sc-container">
      
      <!-- Row 1 -->
      <div class="sc-feat-row">
        <div class="sc-feat-row-content">
          <span class="sc-feat-row-eyebrow">${s.deep_dive_1.eyebrow}</span>
          <h2 class="sc-feat-row-title">${s.deep_dive_1.title}</h2>
          <p class="sc-feat-row-desc">${s.deep_dive_1.desc}</p>
          <ul class="sc-feat-bullet-list">
            ${s.deep_dive_1.bullets.map(b => `<li class="sc-feat-bullet-item"><img src="${rel}assets/icons/check.svg" alt=""> <span>${b}</span></li>`).join("")}
          </ul>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary" target="_blank" rel="noopener">Launch Application ➔</a>
        </div>
        <div class="sc-feat-row-visual">
          <img src="${rel}assets/images/${s.deep_dive_1.visual}" alt="${s.deep_dive_1.title}">
        </div>
      </div>

      <!-- Row 2 -->
      <div class="sc-feat-row is-reversed">
        <div class="sc-feat-row-content">
          <span class="sc-feat-row-eyebrow">${s.deep_dive_2.eyebrow}</span>
          <h2 class="sc-feat-row-title">${s.deep_dive_2.title}</h2>
          <p class="sc-feat-row-desc">${s.deep_dive_2.desc}</p>
          <ul class="sc-feat-bullet-list">
            ${s.deep_dive_2.bullets.map(b => `<li class="sc-feat-bullet-item"><img src="${rel}assets/icons/check.svg" alt=""> <span>${b}</span></li>`).join("")}
          </ul>
          <a href="${rel}pricing/index.html" class="sc-btn sc-btn-outline">Explore Plans ➔</a>
        </div>
        <div class="sc-feat-row-visual">
          <img src="${rel}assets/images/${s.deep_dive_2.visual}" alt="${s.deep_dive_2.title}">
        </div>
      </div>

    </div>
  </section>

  <!-- Mid CTA -->
  <section class="sc-midcta-section">
    <div class="sc-container">
      <div class="sc-midcta-banner">
        <div>
          <h2 class="sc-midcta-title">Upgrade Your Social Publishing Architecture</h2>
          <p style="font-size: 16px; color: #D1D5DB; margin-top: 6px;">Join digital professionals building their social media presence with PostNexa.</p>
        </div>
        <div style="display: flex; gap: 14px; flex-wrap: wrap;">
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-yellow sc-btn-pill" target="_blank" rel="noopener">Launch Application ➔</a>
          <a href="${rel}solutions/index.html" class="sc-btn sc-btn-outline" style="color: #FFF; border-color: rgba(255,255,255,0.4);">All Solutions</a>
        </div>
      </div>
    </div>
  </section>
  `;
  make_page(`solutions/${s.slug}/index.html`, 2, "solutions", `${s.title} | PostNexa Solutions`, s.desc, `solutions/${s.slug}/`, main_html);
});

// Solutions Index Page
const solutions_dir_cards = solutions_data.map(s => `
  <div class="sc-feature-item-card">
    <div>
      <div class="sc-card-icon-wrap">
        <img src="../assets/icons/support.svg" alt="">
      </div>
      <h3 class="sc-card-title">${s.title}</h3>
      <p class="sc-card-text">${s.desc}</p>
    </div>
    <div class="sc-card-footer">
      <a href="${s.slug}/index.html" class="sc-card-link">View Solution Details ➔</a>
      <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-outline" style="padding: 6px 14px; font-size: 12.5px;" target="_blank" rel="noopener">Try Free</a>
    </div>
  </div>
`).join("");

const solutions_index_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Solutions Directory</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Role-Based Solutions</span>
          </div>
          <h1 class="sc-inner-hero-title">Tailored Social Workspaces for Every Role &amp; Business Model</h1>
          <p class="sc-inner-hero-desc">Whether you are a solo content creator, marketing agency, or fast-growing digital team, PostNexa adapts to your publishing volume and collaboration needs.</p>
          <div class="sc-inner-hero-actions">
            <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">Start Free Trial ➔</a>
            <a href="../pricing/index.html" class="sc-btn sc-btn-outline sc-btn-pill">View Pricing</a>
          </div>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Solutions Cockpit">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      <div class="sc-card-grid-3">
        ${solutions_dir_cards}
      </div>
    </div>
  </section>
`;
make_page("solutions/index.html", 1, "solutions", "Solutions Directory | By Role & Business", "Discover tailored PostNexa solutions for creators, agencies, small businesses, and marketing teams.", "solutions/", solutions_index_html);

// =========================================================================
// 4. INTEGRATIONS DIRECTORY
// =========================================================================
const integrations_data = [
  { name: "Facebook Pages", category: "social", icon: "facebook.svg", status: "live", status_txt: "Live & Verified", desc: "Direct publishing to managed Facebook Pages with photo, link, and video support via Meta Graph API." },
  { name: "Instagram Professional", category: "social", icon: "instagram.svg", status: "live", status_txt: "Live & Verified", desc: "Schedule Reels and feed posts directly to Instagram Business & Creator accounts." },
  { name: "YouTube", category: "video", icon: "youtube.svg", status: "live", status_txt: "Live & Verified", desc: "Direct video uploads with custom titles, tags, and category management via YouTube Data API v3." },
  { name: "TikTok", category: "video", icon: "tiktok.svg", status: "beta", status_txt: "Beta Testing", desc: "Direct video publishing and draft creator sync under official ByteDance developer review." },
  { name: "LinkedIn Pages & Profiles", category: "social", icon: "linkedin.svg", status: "dev", status_txt: "In Development", desc: "Schedule company updates, PDF carousels, and thought-leadership posts via LinkedIn v2 API." },
  { name: "X (formerly Twitter)", category: "social", icon: "x-twitter.svg", status: "dev", status_txt: "In Development", desc: "Scheduled tweet and thread distribution via official X Developer API." },
  { name: "Pinterest", category: "social", icon: "pinterest.svg", status: "soon", status_txt: "Planned", desc: "Direct Pin scheduling with destination links and board selectors." },
  { name: "Google Business Profile", category: "social", icon: "google-business.svg", status: "soon", status_txt: "Planned", desc: "Publish local business offers, announcements, and photos directly to Google Maps & Search." },
  { name: "Canva Integration", category: "design", icon: "canva.svg", status: "dev", status_txt: "In Development", desc: "Import graphics and templates directly from your Canva account without manual downloads." },
  { name: "Cloud Storage (Google Drive / Dropbox)", category: "cloud", icon: "google-drive.svg", status: "dev", status_txt: "In Development", desc: "Import bulk video and photo assets directly from connected cloud storage drives." },
  { name: "Bitly Link Shortening", category: "automation", icon: "bitly.svg", status: "soon", status_txt: "Planned", desc: "Automatically shorten and track click performance for all outbound links." },
  { name: "Zapier & Webhooks", category: "automation", icon: "automation", icon: "zapier.svg", status: "soon", status_txt: "Planned", desc: "Trigger scheduled posts automatically from 5,000+ business applications." }
];

const integrations_cards = integrations_data.map(item => `
  <div class="sc-feature-item-card" data-category="${item.category}">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 18px;">
      <div class="sc-card-icon-wrap" style="margin-bottom: 0;">
        <img src="../assets/icons/${item.icon}" alt="${item.name}">
      </div>
      <span class="sc-badge-status sc-badge-${item.status}">${item.status_txt}</span>
    </div>
    <h3 class="sc-card-title">${item.name}</h3>
    <p class="sc-card-text">${item.desc}</p>
    <div class="sc-card-footer">
      <span style="font-size: 12.5px; font-weight: 700; color: var(--color-text-muted);">OAuth 2.0 Protocol</span>
      <a href="https://app.techwithsalman.online/" class="sc-card-link" target="_blank" rel="noopener">Connect ➔</a>
    </div>
  </div>
`).join("");

const integrations_index_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Integrations Directory</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Official API Partner Protocols</span>
          </div>
          <h1 class="sc-inner-hero-title">Connect Your Favorite Social Networks &amp; Digital Tools</h1>
          <p class="sc-inner-hero-desc">PostNexa integrates through official public developer APIs and OAuth standards to ensure your account security and uninterrupted publishing.</p>
          <div class="sc-inner-hero-actions">
            <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">Connect Accounts in App ➔</a>
            <a href="../help/index.html" class="sc-btn sc-btn-outline sc-btn-pill">Integration Guides</a>
          </div>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/distribution-preview.svg" alt="PostNexa Direct Integrations">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      
      <!-- Filter Tabs -->
      <div class="sc-filter-tabs">
        <button type="button" class="sc-filter-tab-btn is-active" data-filter="all">All Integrations (12)</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="social">Social Networks</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="video">Video Channels</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="design">Design &amp; Cloud</button>
        <button type="button" class="sc-filter-tab-btn" data-filter="automation">Automation &amp; Sync</button>
      </div>

      <div class="sc-card-grid-3">
        ${integrations_cards}
      </div>

      <div class="sc-legal-notice-box" style="margin-top: 48px; text-align: center;">
        <p style="margin: 0; color: var(--color-text-muted); font-size: 13.5px;"><strong>API Compliance Notice:</strong> PostNexa operates independently using official public developer APIs and OAuth 2.0 protocols. PostNexa is not endorsed, sponsored, or affiliated with Meta Platforms, Inc., Google LLC, ByteDance Ltd., or X Corp.</p>
      </div>
    </div>
  </section>
`;
make_page("integrations/index.html", 1, "integrations", "Integrations Directory | Supported Social Networks", "Official API integrations for Facebook, Instagram, YouTube, TikTok, LinkedIn, and cloud storage tools.", "integrations/", integrations_index_html);

// =========================================================================
// 5. PRICING PAGE
// =========================================================================
const pricing_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Pricing Plans</span>
      </nav>
      
      <div class="sc-pricing-header">
        <div style="margin-bottom: 14px;">
          <span class="sc-badge-status sc-badge-live">14-Day Free Trial • No Credit Card Required</span>
        </div>
        <h1 class="sc-inner-hero-title">Simple, Transparent Pricing for Every Growth Stage</h1>
        <p class="sc-inner-hero-desc">Choose the plan that fits your publishing volume. Start with our generous free tier and upgrade as your social channels expand.</p>
        
        <div class="sc-pricing-toggle-wrap">
          <button type="button" class="sc-pricing-toggle-btn is-active" id="billingMonthly">Monthly Billing</button>
          <button type="button" class="sc-pricing-toggle-btn" id="billingAnnual">Annual Billing <span class="sc-pricing-discount-tag">Save 20%</span></button>
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      
      <div class="sc-pricing-grid">
        
        <!-- Free Tier -->
        <div class="sc-pricing-card">
          <div>
            <h3 class="sc-plan-name">Free Starter</h3>
            <p class="sc-plan-desc">Perfect for testing the platform and getting started with scheduling.</p>
            <div class="sc-plan-price-wrap">
              <span class="sc-plan-price">$0</span>
              <span class="sc-plan-period">/ forever</span>
            </div>
            <div class="sc-plan-features">
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Up to 2 Social Accounts</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> 15 Scheduled Posts in Queue</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Visual Content Calendar</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Community Support</div>
            </div>
          </div>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-outline" style="width: 100%; justify-content: center;" target="_blank" rel="noopener">Get Started Free</a>
        </div>

        <!-- Starter Tier -->
        <div class="sc-pricing-card">
          <div>
            <h3 class="sc-plan-name">Starter</h3>
            <p class="sc-plan-desc">Ideal for solo creators and small businesses building consistency.</p>
            <div class="sc-plan-price-wrap">
              <span class="sc-plan-price" data-monthly="$19" data-annual="$15">$19</span>
              <span class="sc-plan-period">/ month</span>
            </div>
            <div class="sc-plan-features">
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Up to 5 Social Accounts</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited Scheduled Posts</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> 50 AI Captions / month</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Bulk CSV Uploader</div>
            </div>
          </div>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary" style="width: 100%; justify-content: center;" target="_blank" rel="noopener">Start 14-Day Trial</a>
        </div>

        <!-- Creator / Pro Tier (Popular) -->
        <div class="sc-pricing-card is-popular">
          <span class="sc-popular-badge">Most Popular</span>
          <div>
            <h3 class="sc-plan-name">Creator Pro</h3>
            <p class="sc-plan-desc">For active creators, influencers, and growing social brands.</p>
            <div class="sc-plan-price-wrap">
              <span class="sc-plan-price" data-monthly="$39" data-annual="$29">$39</span>
              <span class="sc-plan-period">/ month</span>
            </div>
            <div class="sc-plan-features">
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Up to 15 Social Accounts</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited Posts &amp; Queues</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited AI Captions &amp; Hooks</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Priority Cloud Publishing</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Priority Support</div>
            </div>
          </div>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" style="width: 100%; justify-content: center;" target="_blank" rel="noopener">Start Free Trial ➔</a>
        </div>

        <!-- Agency Tier -->
        <div class="sc-pricing-card">
          <div>
            <h3 class="sc-plan-name">Agency &amp; Team</h3>
            <p class="sc-plan-desc">For digital marketing agencies managing multi-client rosters.</p>
            <div class="sc-plan-price-wrap">
              <span class="sc-plan-price" data-monthly="$99" data-annual="$79">$99</span>
              <span class="sc-plan-period">/ month</span>
            </div>
            <div class="sc-plan-features">
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> 50+ Social Accounts</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Unlimited Brand Workspaces</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Multi-User Permissions</div>
              <div class="sc-plan-feature-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Dedicated Account Specialist</div>
            </div>
          </div>
          <a href="../contact/index.html" class="sc-btn sc-btn-outline" style="width: 100%; justify-content: center;">Contact Sales</a>
        </div>

      </div>

      <!-- Comparison Matrix -->
      <div style="margin-top: 60px;">
        <h2 style="font-size: 28px; font-weight: 900; text-align: center; margin-bottom: 24px;">Full Feature Comparison</h2>
        
        <div class="sc-table-container">
          <table class="sc-compare-table">
            <thead>
              <tr>
                <th>Feature / Capability</th>
                <th>Free Starter</th>
                <th>Starter</th>
                <th>Creator Pro</th>
                <th>Agency &amp; Team</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Social Accounts Connected</strong></td>
                <td>2</td>
                <td>5</td>
                <td>15</td>
                <td>50+</td>
              </tr>
              <tr>
                <td><strong>Direct Meta &amp; YouTube Publishing</strong></td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td><strong>Visual Drag-and-Drop Calendar</strong></td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td><strong>Bulk CSV Scheduler</strong></td>
                <td>—</td>
                <td>✓</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
              <tr>
                <td><strong>AI Caption Generator</strong></td>
                <td>5 / mo</td>
                <td>50 / mo</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td><strong>Brand Workspaces</strong></td>
                <td>1</td>
                <td>1</td>
                <td>3</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td><strong>Customer Support</strong></td>
                <td>Community</td>
                <td>Email (48h)</td>
                <td>Priority (12h)</td>
                <td>Dedicated Account Rep</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  </section>
`;
make_page("pricing/index.html", 1, "pricing", "Pricing Plans & Tier Matrix", "Transparent pricing plans for creators, agencies, and teams. Start free with zero credit card required.", "pricing/", pricing_html);

// =========================================================================
// 6. ABOUT PAGE
// =========================================================================
const about_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>About PostNexa</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Company Story &amp; Origin</span>
          </div>
          <h1 class="sc-inner-hero-title">Building the Operating System for Modern Social Publishing</h1>
          <p class="sc-inner-hero-desc">PostNexa is engineered by <strong>Tech With Salman</strong> to bring clean architecture, honest API compliance, and intuitive automation to creators and growing digital teams.</p>
          <div class="sc-inner-hero-actions">
            <a href="https://techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">Visit Parent Brand ➔</a>
            <a href="../roadmap/index.html" class="sc-btn sc-btn-outline sc-btn-pill">View Public Roadmap</a>
          </div>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Engineering Mission">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 90px 0; background-color: var(--color-bg-white);">
    <div class="sc-container">
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center;">
        <div>
          <span class="sc-feat-row-eyebrow">Our Origin</span>
          <h2 style="font-size: 32px; font-weight: 900; margin: 12px 0 20px 0;">From Advanced Automation Architecture to Full-Scale SaaS</h2>
          <p style="font-size: 16px; color: var(--color-text-body); line-height: 1.7; margin-bottom: 16px;">What began as an advanced social automation architecture engineered by Tech With Salman has evolved into PostNexa — a comprehensive, customer-centric AI-powered SaaS platform.</p>
          <p style="font-size: 16px; color: var(--color-text-body); line-height: 1.7;">Our mission is simple: eliminate repetitive manual posting, maintain strict adherence to official platform developer guidelines, and provide creators and agencies with an intuitive cockpit for multi-account management.</p>
        </div>
        <div style="background-color: var(--color-bg-warm); border: 1px solid var(--color-border); border-radius: var(--border-radius-xl); padding: 40px;">
          <h3 style="font-size: 20px; font-weight: 800; margin-bottom: 16px;">Our Core Engineering Principles</h3>
          <ul style="display: flex; flex-direction: column; gap: 14px; list-style: none; padding: 0;">
            <li style="display: flex; gap: 10px; font-size: 15px;"><strong>01.</strong> 100% Official API Compliance (Zero Unofficial Scrapers)</li>
            <li style="display: flex; gap: 10px; font-size: 15px;"><strong>02.</strong> Lightning-Fast, Clutter-Free User Interface</li>
            <li style="display: flex; gap: 10px; font-size: 15px;"><strong>03.</strong> Transparent Feature Statuses &amp; Honest Communication</li>
            <li style="display: flex; gap: 10px; font-size: 15px;"><strong>04.</strong> Strict Data Privacy &amp; Token Encryption Standards</li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      <div style="text-align: center; max-width: 600px; margin: 0 auto 48px auto;">
        <h2 style="font-size: 32px; font-weight: 900;">Parent Brand Attribution</h2>
        <p style="font-size: 16px; color: var(--color-text-muted);">PostNexa is proudly designed, engineered, and maintained under the Tech With Salman product family.</p>
      </div>
      
      <div class="sc-contact-card" style="max-width: 700px; margin: 0 auto; text-align: center;">
        <h3 style="font-size: 24px; font-weight: 900; margin-bottom: 8px;">Tech With Salman</h3>
        <p style="color: var(--color-text-muted); margin-bottom: 20px;">Digital Solutions, Software Engineering &amp; Modern Cloud Applications</p>
        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
          <a href="https://techwithsalman.online/" class="sc-btn sc-btn-primary" target="_blank" rel="noopener">Visit Parent Website ➔</a>
          <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-outline" target="_blank" rel="noopener">Open App Portal</a>
        </div>
      </div>
    </div>
  </section>
`;
make_page("about/index.html", 1, "resources", "About PostNexa | Product & Parent Brand Story", "Learn about the mission, engineering philosophy, and Tech With Salman origin behind PostNexa.", "about/", about_html);

// =========================================================================
// 7. CONTACT PAGE
// =========================================================================
const contact_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Contact Us</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Support &amp; Inquiries</span>
          </div>
          <h1 class="sc-inner-hero-title">Get in Touch with the PostNexa Team</h1>
          <p class="sc-inner-hero-desc">Have questions about integrations, account connections, enterprise plans, or API capabilities? Send us a direct message.</p>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/inbox-preview.svg" alt="PostNexa Direct Support">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-white);">
    <div class="sc-container">
      
      <div class="sc-contact-grid">
        
        <!-- Contact Information -->
        <div>
          <h2 style="font-size: 28px; font-weight: 900; margin-bottom: 16px;">We're Here to Help</h2>
          <p style="font-size: 15.5px; color: var(--color-text-body); line-height: 1.65; margin-bottom: 32px;">Our engineering and support team is dedicated to helping creators, agencies, and businesses build seamless publishing workflows.</p>
          
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="sc-proof-card">
              <div class="sc-card-icon-wrap" style="margin: 0;">
                <img src="../assets/icons/support.svg" alt="">
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 800;">Direct Support Email</h4>
                <p style="font-size: 14px; color: var(--color-text-muted); margin: 0;">support@techwithsalman.online</p>
              </div>
            </div>

            <div class="sc-proof-card">
              <div class="sc-card-icon-wrap" style="margin: 0;">
                <img src="../assets/icons/publish.svg" alt="">
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 800;">Parent Company Portal</h4>
                <p style="font-size: 14px; color: var(--color-text-muted); margin: 0;">https://techwithsalman.online/</p>
              </div>
            </div>

            <div class="sc-proof-card">
              <div class="sc-card-icon-wrap" style="margin: 0;">
                <img src="../assets/icons/engage.svg" alt="">
              </div>
              <div>
                <h4 style="font-size: 16px; font-weight: 800;">Web Application</h4>
                <p style="font-size: 14px; color: var(--color-text-muted); margin: 0;">https://app.techwithsalman.online/</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Form -->
        <div class="sc-contact-card">
          <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 8px;">Send a Direct Inquiry</h3>
          <p style="font-size: 14px; color: var(--color-text-muted); margin-bottom: 24px;">Fill out the form below and we will get back to you within 24–48 hours.</p>
          
          <form id="contactForm" onsubmit="event.preventDefault(); alert('Thank you for reaching out! Your inquiry has been submitted to the PostNexa support team.'); this.reset();">
            <div class="sc-form-group">
              <label class="sc-form-label" for="contactName">Full Name *</label>
              <input type="text" id="contactName" class="sc-form-input" placeholder="e.g. Alex Morgan" required>
            </div>

            <div class="sc-form-group">
              <label class="sc-form-label" for="contactEmail">Work Email Address *</label>
              <input type="email" id="contactEmail" class="sc-form-input" placeholder="alex@company.com" required>
            </div>

            <div class="sc-form-group">
              <label class="sc-form-label" for="contactTopic">Inquiry Topic</label>
              <select id="contactTopic" class="sc-form-select">
                <option value="general">General Platform Inquiry</option>
                <option value="integration">OAuth &amp; API Integration Question</option>
                <option value="agency">Agency / Enterprise Plan</option>
                <option value="bug">Report an Issue / Bug</option>
              </select>
            </div>

            <div class="sc-form-group">
              <label class="sc-form-label" for="contactMessage">Message *</label>
              <textarea id="contactMessage" class="sc-form-textarea" placeholder="Tell us about your requirements or question..." required></textarea>
            </div>

            <button type="submit" class="sc-btn sc-btn-primary" style="width: 100%; justify-content: center;">Send Inquiry ➔</button>
          </form>
        </div>

      </div>

    </div>
  </section>
`;
make_page("contact/index.html", 1, "resources", "Contact Us | Support & Enterprise Inquiries", "Reach out to the PostNexa engineering and support team by Tech With Salman.", "contact/", contact_html);

// =========================================================================
// 8. FAQ PAGE
// =========================================================================
const faq_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Frequently Asked Questions</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Help &amp; Knowledge Center</span>
          </div>
          <h1 class="sc-inner-hero-title">Frequently Asked Questions</h1>
          <p class="sc-inner-hero-desc">Everything you need to know about PostNexa, account connections, API verification, and scheduled publishing.</p>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Help Center">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-white);">
    <div class="sc-container" style="max-width: 860px;">
      
      <div class="sc-faq-accordion">
        
        <div class="sc-faq-item is-open">
          <button type="button" class="sc-faq-trigger" aria-expanded="true">
            What is PostNexa and who develops it?
            <svg class="sc-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="sc-faq-content" style="display: block;">
            <p>PostNexa is an AI-powered social media management and publishing platform developed by <strong>Tech With Salman</strong>. It provides unified content scheduling, calendar visualization, and multi-network publishing through official social platform APIs.</p>
          </div>
        </div>

        <div class="sc-faq-item">
          <button type="button" class="sc-faq-trigger" aria-expanded="false">
            Which social networks are currently live and operational?
            <svg class="sc-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="sc-faq-content">
            <p>Direct publishing is live and verified for Facebook Pages, Instagram Professional (Feed &amp; Reels), and YouTube video uploads. TikTok integration is currently in Beta review, while LinkedIn, X, and Pinterest are in active development.</p>
          </div>
        </div>

        <div class="sc-faq-item">
          <button type="button" class="sc-faq-trigger" aria-expanded="false">
            Does PostNexa store my social account passwords?
            <svg class="sc-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="sc-faq-content">
            <p>No. PostNexa never sees or stores your social network passwords. All connections occur via standard OAuth 2.0 authorization prompts provided directly by Meta, Google, and ByteDance. We securely store only encrypted, scoped access tokens.</p>
          </div>
        </div>

        <div class="sc-faq-item">
          <button type="button" class="sc-faq-trigger" aria-expanded="false">
            Do I need to keep my computer or browser open when a post is scheduled?
            <svg class="sc-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="sc-faq-content">
            <p>No. All scheduled posts are stored in our secure database and published by autonomous cloud worker jobs at your exact scheduled minute, even when your computer is shut down.</p>
          </div>
        </div>

        <div class="sc-faq-item">
          <button type="button" class="sc-faq-trigger" aria-expanded="false">
            Can I request data deletion or disconnect my accounts at any time?
            <svg class="sc-faq-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <div class="sc-faq-content">
            <p>Yes. You can disconnect connected social channels instantly from your Account Settings tab. To permanently delete your entire user profile and all stored data, follow our <a href="../data-deletion/index.html" style="color: var(--color-primary); text-decoration: underline;">Data Deletion Guide</a>.</p>
          </div>
        </div>

      </div>

    </div>
  </section>
`;
make_page("faq/index.html", 1, "resources", "Frequently Asked Questions (FAQ) | PostNexa", "Common questions about PostNexa social media management, OAuth security, and scheduling.", "faq/", faq_html);

// =========================================================================
// 9. HELP CENTER
// =========================================================================
const help_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Help Center</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Knowledge Base &amp; Guides</span>
          </div>
          <h1 class="sc-inner-hero-title">Help Center &amp; Quickstart Documentation</h1>
          <p class="sc-inner-hero-desc">Learn how to connect social accounts, troubleshoot publishing errors, and maximize your social media workflows.</p>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/calendar-preview.svg" alt="PostNexa Help Center Guides">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      <div class="sc-card-grid-3">
        
        <div class="sc-feature-item-card">
          <div class="sc-card-icon-wrap"><img src="../assets/icons/facebook.svg" alt=""></div>
          <h3 class="sc-card-title">Connecting Facebook Pages</h3>
          <p class="sc-card-text">Step-by-step guide to authorizing your Facebook Business Pages via Meta OAuth and managing permissions.</p>
          <div class="sc-card-footer"><a href="../contact/index.html" class="sc-card-link">Read Guide ➔</a></div>
        </div>

        <div class="sc-feature-item-card">
          <div class="sc-card-icon-wrap"><img src="../assets/icons/instagram.svg" alt=""></div>
          <h3 class="sc-card-title">Instagram Professional Setup</h3>
          <p class="sc-card-text">How to convert personal profiles to Creator/Business accounts and enable direct Reel publishing.</p>
          <div class="sc-card-footer"><a href="../contact/index.html" class="sc-card-link">Read Guide ➔</a></div>
        </div>

        <div class="sc-feature-item-card">
          <div class="sc-card-icon-wrap"><img src="../assets/icons/youtube.svg" alt=""></div>
          <h3 class="sc-card-title">YouTube OAuth Authorization</h3>
          <p class="sc-card-text">Best practices for video formats, upload quotas, title parameters, and YouTube channel tokens.</p>
          <div class="sc-card-footer"><a href="../contact/index.html" class="sc-card-link">Read Guide ➔</a></div>
        </div>

        <div class="sc-feature-item-card">
          <div class="sc-card-icon-wrap"><img src="../assets/icons/calendar.svg" alt=""></div>
          <h3 class="sc-card-title">Managing the Content Calendar</h3>
          <p class="sc-card-text">Master drag-and-drop rescheduling, color coding, and daily queue inspection.</p>
          <div class="sc-card-footer"><a href="../contact/index.html" class="sc-card-link">Read Guide ➔</a></div>
        </div>

        <div class="sc-feature-item-card">
          <div class="sc-card-icon-wrap"><img src="../assets/icons/ai-bot.svg" alt=""></div>
          <h3 class="sc-card-title">Using the AI Caption Writer</h3>
          <p class="sc-card-text">Tips for getting the best hashtag clusters and persuasive hooks from prompt parameters.</p>
          <div class="sc-card-footer"><a href="../contact/index.html" class="sc-card-link">Read Guide ➔</a></div>
        </div>

        <div class="sc-feature-item-card">
          <div class="sc-card-icon-wrap"><img src="../assets/icons/support.svg" alt=""></div>
          <h3 class="sc-card-title">Troubleshooting Token Refreshes</h3>
          <p class="sc-card-text">What to do if an expired OAuth token causes a scheduled post to fail delivery.</p>
          <div class="sc-card-footer"><a href="../contact/index.html" class="sc-card-link">Read Guide ➔</a></div>
        </div>

      </div>
    </div>
  </section>
`;
make_page("help/index.html", 1, "resources", "Help Center & Quickstart Documentation | PostNexa", "Step-by-step guides for connecting social profiles and resolving publishing issues.", "help/", help_html);

// =========================================================================
// 10. BLOG & MASTERCLASS ARTICLE
// =========================================================================
const blog_index_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Marketing &amp; Strategy Blog</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Strategy &amp; Growth Insights</span>
          </div>
          <h1 class="sc-inner-hero-title">Social Media Growth, Automation &amp; SaaS Strategy</h1>
          <p class="sc-inner-hero-desc">Expert articles, algorithm updates, and tactical workflow tutorials curated by Tech With Salman.</p>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Strategy Blog">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      
      <div class="sc-blog-search-bar">
        <input type="text" class="sc-blog-search-input" placeholder="Search strategy articles, guides, and tips...">
      </div>

      <div class="sc-card-grid-3">
        
        <article class="sc-blog-card">
          <div class="sc-blog-thumb">
            <img src="../assets/icons/calendar.svg" style="width: 64px; height: 64px;" alt="">
          </div>
          <div class="sc-blog-body">
            <div class="sc-blog-meta">
              <span class="sc-blog-cat">Strategy Guide</span>
              <span>•</span>
              <span>8 min read</span>
            </div>
            <h2 class="sc-blog-title"><a href="social-media-scheduling-guide/index.html">The Ultimate 2026 Guide to Cross-Platform Social Media Scheduling</a></h2>
            <p class="sc-blog-excerpt">Discover how modern creators and agencies eliminate tab fatigue and achieve consistent organic reach across Facebook, Instagram, and YouTube.</p>
            <div class="sc-card-footer">
              <a href="social-media-scheduling-guide/index.html" class="sc-card-link">Read Full Guide ➔</a>
            </div>
          </div>
        </article>

        <article class="sc-blog-card">
          <div class="sc-blog-thumb">
            <img src="../assets/icons/instagram.svg" style="width: 64px; height: 64px;" alt="">
          </div>
          <div class="sc-blog-body">
            <div class="sc-blog-meta">
              <span class="sc-blog-cat">Meta Ecosystem</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
            <h2 class="sc-blog-title"><a href="social-media-scheduling-guide/index.html">Demystifying Instagram Reels Auto-Publishing Rules</a></h2>
            <p class="sc-blog-excerpt">Understanding aspect ratios, video bitrates, and API restrictions when scheduling Reels via the Meta Graph API.</p>
            <div class="sc-card-footer">
              <a href="social-media-scheduling-guide/index.html" class="sc-card-link">Read Article ➔</a>
            </div>
          </div>
        </article>

        <article class="sc-blog-card">
          <div class="sc-blog-thumb">
            <img src="../assets/icons/ai-bot.svg" style="width: 64px; height: 64px;" alt="">
          </div>
          <div class="sc-blog-body">
            <div class="sc-blog-meta">
              <span class="sc-blog-cat">AI &amp; Copywriting</span>
              <span>•</span>
              <span>6 min read</span>
            </div>
            <h2 class="sc-blog-title"><a href="social-media-scheduling-guide/index.html">How to Use AI Captions Without Sounding Like a Robot</a></h2>
            <p class="sc-blog-excerpt">Best practices for infusing distinct brand voice and authentic tone into AI-generated captions and hashtag clusters.</p>
            <div class="sc-card-footer">
              <a href="social-media-scheduling-guide/index.html" class="sc-card-link">Read Article ➔</a>
            </div>
          </div>
        </article>

      </div>

    </div>
  </section>
`;
make_page("blog/index.html", 1, "resources", "Social Media Marketing Blog & Guides", "Insights on social media automation, content scheduling, and API publishing by Tech With Salman.", "blog/", blog_index_html);

const article_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <a href="../index.html">Blog</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Scheduling Guide</span>
      </nav>
      
      <div class="sc-inner-hero-content" style="max-width: 800px; margin: 0 auto; text-align: center;">
        <div style="margin-bottom: 16px;">
          <span class="sc-badge-status sc-badge-live">Comprehensive Masterclass</span>
        </div>
        <h1 class="sc-inner-hero-title">The Ultimate 2026 Guide to Cross-Platform Social Media Scheduling</h1>
        <p class="sc-inner-hero-desc">How modern digital teams combine structured editorial calendars, official platform APIs, and AI copywriting to scale social distribution.</p>
      </div>
    </div>
  </section>

  <section class="sc-article-container">
    <div class="sc-article-body">
      <p>Managing social media across multiple channels in 2026 requires more than just opening five browser tabs and setting phone alarms. As algorithms favor consistent publishing and high video retention, manual workflows quickly lead to creator burnout and operational bottlenecks.</p>

      <h2>1. The Problem with Fragmented Native Scheduling</h2>
      <p>Every platform offers its own native scheduling suite — Meta Business Suite for Facebook and Instagram, YouTube Studio for videos, and TikTok Creator Center. While functional for single accounts, managing three or more brands across these isolated portals requires constant credential switching, manual copy-pasting, and disjointed analytics.</p>
      
      <div class="sc-article-callout">
        <h4 style="font-weight: 800; margin-bottom: 6px; color: var(--color-primary);">Key Takeaway:</h4>
        <p style="margin: 0; font-size: 14.5px;">Consolidating your workflow into a unified social media management platform like PostNexa saves an average of 8+ hours per week per manager while drastically reducing accidental publishing errors.</p>
      </div>

      <h2>2. Adhering to Official Developer APIs</h2>
      <p>A critical consideration when selecting a management platform is API legitimacy. Tools that use unofficial browser automation or screen scraping risk account flags and shadow-banning. PostNexa connects exclusively through audited developer APIs provided by Meta, Google, and ByteDance, ensuring your accounts remain in good standing.</p>

      <h2>3. The Power of Visual Drag-and-Drop Calendars</h2>
      <p>Visual planning provides immediate clarity over your publishing cadence. By visualizing scheduled posts across a monthly grid, teams can instantly identify content gaps, balance promotional posts with educational material, and reschedule assets with intuitive drag-and-drop actions.</p>

      <h2>Conclusion</h2>
      <p>Consistency is the single biggest predictor of organic social reach. By leveraging automated cloud workers, context-aware AI copy assistants, and structured bulk scheduling, you can focus on what truly matters: creating compelling content and engaging with your audience.</p>

      <div style="margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--color-border); text-align: center;">
        <a href="https://app.techwithsalman.online/" class="sc-btn sc-btn-primary sc-btn-pill" target="_blank" rel="noopener">Experience PostNexa Free ➔</a>
      </div>
    </div>
  </section>
`;
make_page("blog/social-media-scheduling-guide/index.html", 2, "resources", "The Ultimate 2026 Guide to Social Media Scheduling | PostNexa", "In-depth guide on cross-platform scheduling, official API compliance, and visual calendar strategies.", "blog/social-media-scheduling-guide/", article_html);

// =========================================================================
// 11. CHANGELOG & ROADMAP
// =========================================================================
const changelog_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Product Changelog</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Release History &amp; Updates</span>
          </div>
          <h1 class="sc-inner-hero-title">Continuous Improvement &amp; Version History</h1>
          <p class="sc-inner-hero-desc">Track updates, new feature rollouts, API enhancements, and performance optimizations across PostNexa.</p>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Releases">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-white);">
    <div class="sc-container" style="max-width: 840px;">
      
      <div class="sc-roadmap-card" style="margin-bottom: 32px; padding: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="sc-badge-status sc-badge-live">Version 1.4.0 — March 2026</span>
          <span style="font-size: 13px; color: var(--color-text-muted);">Current Release</span>
        </div>
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 12px;">Commercial Platform Launch &amp; AI Caption Integration</h3>
        <ul style="padding-left: 20px; font-size: 14.5px; color: var(--color-text-body); line-height: 1.7;">
          <li>Official commercial release of PostNexa by Tech With Salman.</li>
          <li>Integrated Context-Aware AI Caption Generator (Beta) with tone tuning and hashtag clustering.</li>
          <li>Upgraded Next.js application core and enhanced database token refresh resilience.</li>
        </ul>
      </div>

      <div class="sc-roadmap-card" style="margin-bottom: 32px; padding: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="sc-badge-status sc-badge-live">Version 1.3.0 — January 2026</span>
        </div>
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 12px;">YouTube Data API v3 &amp; Video Scheduler</h3>
        <ul style="padding-left: 20px; font-size: 14.5px; color: var(--color-text-body); line-height: 1.7;">
          <li>Direct video uploads to authorized YouTube channels.</li>
          <li>Custom video title, description, tags, and category assignment within the composer.</li>
          <li>Background cloud queue monitoring for large video transcoding.</li>
        </ul>
      </div>

      <div class="sc-roadmap-card" style="margin-bottom: 32px; padding: 28px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <span class="sc-badge-status sc-badge-live">Version 1.2.0 — November 2025</span>
        </div>
        <h3 style="font-size: 22px; font-weight: 800; margin-bottom: 12px;">Instagram Reels Direct Publishing</h3>
        <ul style="padding-left: 20px; font-size: 14.5px; color: var(--color-text-body); line-height: 1.7;">
          <li>Implemented direct Reel scheduling via Meta Business Graph API.</li>
          <li>Automatic 9:16 aspect ratio detection and validation warnings.</li>
        </ul>
      </div>

    </div>
  </section>
`;
make_page("changelog/index.html", 1, "resources", "Product Changelog & Release Notes | PostNexa", "Stay updated on recent feature rollouts, API updates, and platform optimizations.", "changelog/", changelog_html);

const roadmap_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Public Roadmap</span>
      </nav>
      
      <div class="sc-inner-hero-split">
        <div class="sc-inner-hero-content">
          <div style="margin-bottom: 14px;">
            <span class="sc-badge-status sc-badge-live">Product Pipeline &amp; Rollout</span>
          </div>
          <h1 class="sc-inner-hero-title">PostNexa Public Product Roadmap</h1>
          <p class="sc-inner-hero-desc">Explore what features are live, what is currently in active beta, and what our engineering team is building next.</p>
        </div>

        <div class="sc-hero-visual-card">
          <img src="../assets/images/dashboard-hero.svg" alt="PostNexa Public Roadmap">
        </div>
      </div>
    </div>
  </section>

  <section style="padding: 80px 0; background-color: var(--color-bg-light);">
    <div class="sc-container">
      
      <div class="sc-roadmap-board">
        
        <div class="sc-roadmap-col">
          <div class="sc-roadmap-col-head">
            <h3 style="font-size: 18px; font-weight: 800; margin: 0;">Live &amp; Verified</h3>
            <span class="sc-badge-status sc-badge-live">Operational</span>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Facebook Page Publishing</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Direct status, link, and photo scheduling.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Instagram Reels &amp; Posts</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Direct publishing via Meta Business Graph API.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">YouTube Video Scheduler</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Direct video upload with title and tags support.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Drag-and-Drop Calendar</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Visual monthly and weekly editorial planning.</p>
          </div>
        </div>

        <div class="sc-roadmap-col">
          <div class="sc-roadmap-col-head">
            <h3 style="font-size: 18px; font-weight: 800; margin: 0;">In Active Beta</h3>
            <span class="sc-badge-status sc-badge-beta">Beta &amp; Dev</span>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">TikTok API Publishing</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Under ByteDance developer app approval workflow.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">AI Caption &amp; Hashtag Generator</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Contextual caption writer inside the post composer.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">LinkedIn v2 API Support</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Company Page and personal profile scheduling.</p>
          </div>
        </div>

        <div class="sc-roadmap-col">
          <div class="sc-roadmap-col-head">
            <h3 style="font-size: 18px; font-weight: 800; margin: 0;">Upcoming Pipeline</h3>
            <span class="sc-badge-status sc-badge-soon">Planned</span>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Unified Social Inbox</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Centralized comment and mention engagement stream.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Canva &amp; Drive Integration</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Direct import from cloud media libraries.</p>
          </div>

          <div class="sc-roadmap-card">
            <h4 style="font-size: 16px; font-weight: 800; margin-bottom: 6px;">Automated RSS-to-Social</h4>
            <p style="font-size: 13.5px; color: var(--color-text-muted); margin: 0;">Auto-queue blog posts upon new RSS publications.</p>
          </div>
        </div>

      </div>

    </div>
  </section>
`;
make_page("roadmap/index.html", 1, "resources", "Public Product Roadmap | PostNexa", "Transparent visibility into live features, active beta testing, and upcoming platform capabilities.", "roadmap/", roadmap_html);

// =========================================================================
// 12. LEGAL & COMPLIANCE PAGES
// =========================================================================
const privacy_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Privacy Policy</span>
      </nav>
      <div class="sc-inner-hero-content">
        <h1 class="sc-inner-hero-title">Privacy Policy</h1>
        <p class="sc-inner-hero-desc">Last updated: March 2026 • PostNexa by Tech With Salman</p>
      </div>
    </div>
  </section>

  <section class="sc-legal-wrapper">
    <div class="sc-legal-content">
      <p>This Privacy Policy describes how PostNexa ("we", "us", or "our"), operated by Tech With Salman, collects, uses, and safeguards information when you use our website and web application located at <a href="https://app.techwithsalman.online/">app.techwithsalman.online</a>.</p>

      <h2>1. Information We Collect</h2>
      <p>We collect information necessary to provide, maintain, and secure our social media management services:</p>
      <ul>
        <li><strong>Account Information:</strong> Your name, email address, password hash, and profile details provided during registration.</li>
        <li><strong>Connected Social Account Data:</strong> Account identifiers, profile names, and scoped OAuth access tokens retrieved through official authorization flows (e.g., Meta Graph API, YouTube Data API).</li>
        <li><strong>Content &amp; Scheduled Media:</strong> Post captions, uploaded photos, video files, and scheduled timestamps you create.</li>
      </ul>

      <h2>2. How We Use Information</h2>
      <p>Your information is used strictly to execute requested services, including:</p>
      <ul>
        <li>Authenticating your account and maintaining active user sessions.</li>
        <li>Transmitting scheduled content to authorized social platforms via official APIs at specified times.</li>
        <li>Refreshing expiring OAuth tokens to prevent publishing interruptions.</li>
        <li>Responding to customer support inquiries and communicating platform updates.</li>
      </ul>

      <h2>3. Third-Party Platform Data Compliance</h2>
      <p>PostNexa adheres strictly to the developer policies of our integrated platforms:</p>
      <ul>
        <li><strong>Meta Platforms (Facebook &amp; Instagram):</strong> We request only approved permissions (e.g., <code>pages_manage_posts</code>, <code>instagram_basic</code>, <code>instagram_content_publish</code>). We do not share, sell, or monetize user data.</li>
        <li><strong>Google &amp; YouTube:</strong> Use of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener">Google API Services User Data Policy</a>, including Limited Use requirements.</li>
      </ul>

      <h2>4. Data Retention and Deletion</h2>
      <p>You may disconnect social accounts or permanently delete your account at any time. Upon account deletion, all stored tokens and queued posts are permanently purged from our databases. See our <a href="../data-deletion/index.html">Data Deletion Instructions</a> for full details.</p>

      <h2>5. Contact Information</h2>
      <p>For privacy inquiries, contact: <strong>support@techwithsalman.online</strong></p>
    </div>
  </section>
`;
make_page("privacy-policy/index.html", 1, "resources", "Privacy Policy | PostNexa", "Learn how PostNexa protects your data, credentials, and OAuth tokens.", "privacy-policy/", privacy_html);

const terms_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Terms of Service</span>
      </nav>
      <div class="sc-inner-hero-content">
        <h1 class="sc-inner-hero-title">Terms of Service</h1>
        <p class="sc-inner-hero-desc">Last updated: March 2026 • PostNexa by Tech With Salman</p>
      </div>
    </div>
  </section>

  <section class="sc-legal-wrapper">
    <div class="sc-legal-content">
      <p>By accessing or using PostNexa, you agree to be bound by these Terms of Service. If you do not agree, please do not use our services.</p>

      <h2>1. Permitted Use</h2>
      <p>You agree to use PostNexa only for lawful social media publishing. You must not upload or publish spam, unauthorized copyright material, hate speech, or content violating third-party platform terms.</p>

      <h2>2. Account Security</h2>
      <p>You are responsible for maintaining the confidentiality of your account credentials. Notify us immediately of any unauthorized account access.</p>

      <h2>3. Limitation of Liability</h2>
      <p>PostNexa is provided "as is". While we endeavor to maintain 99.9% publishing uptime, we are not liable for third-party platform API outages, network disruptions, or account sanctions resulting from prohibited user behavior.</p>

      <h2>4. Governing Law</h2>
      <p>These terms are governed by the applicable laws governing Tech With Salman operations.</p>
    </div>
  </section>
`;
make_page("terms/index.html", 1, "resources", "Terms of Service | PostNexa", "Terms of service and usage conditions for PostNexa.", "terms/", terms_html);

const cookie_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Cookie Policy</span>
      </nav>
      <div class="sc-inner-hero-content">
        <h1 class="sc-inner-hero-title">Cookie Policy</h1>
        <p class="sc-inner-hero-desc">Last updated: March 2026 • PostNexa by Tech With Salman</p>
      </div>
    </div>
  </section>

  <section class="sc-legal-wrapper">
    <div class="sc-legal-content">
      <p>PostNexa uses cookies and local storage technologies to provide essential application functionality, maintain authenticated sessions, and understand how visitors interact with our marketing site.</p>

      <h2>1. Essential Cookies</h2>
      <p>These cookies are required for user authentication, security verification (CSRF tokens), and session management. The application cannot function without them.</p>

      <h2>2. Analytical &amp; Performance Cookies</h2>
      <p>We use anonymous performance cookies to monitor site reliability, page load speeds, and error rates to continually improve our platform.</p>

      <h2>3. Managing Cookie Preferences</h2>
      <p>You can adjust cookie settings in your browser at any time. Disabling essential cookies may prevent logging in to the PostNexa application.</p>
    </div>
  </section>
`;
make_page("cookie-policy/index.html", 1, "resources", "Cookie Policy | PostNexa", "How PostNexa uses cookies and local storage technologies.", "cookie-policy/", cookie_html);

const data_deletion_html = `
  <section class="sc-inner-hero">
    <div class="sc-container">
      <nav class="sc-breadcrumb" aria-label="Breadcrumb">
        <a href="../index.html">Home</a>
        <span class="sc-breadcrumb-sep">/</span>
        <span>Data Deletion Instructions</span>
      </nav>
      <div class="sc-inner-hero-content">
        <h1 class="sc-inner-hero-title">User Data Deletion Instructions</h1>
        <p class="sc-inner-hero-desc">In compliance with Meta Platform Terms, GDPR, and Google API Guidelines.</p>
      </div>
    </div>
  </section>

  <section class="sc-legal-wrapper">
    <div class="sc-legal-content">
      <p>PostNexa provides straightforward options for removing your personal information, connected social accounts, and media files from our servers.</p>

      <h2>Option 1: Disconnect a Specific Social Account</h2>
      <ol>
        <li>Log in to your dashboard at <a href="https://app.techwithsalman.online/" target="_blank" rel="noopener">app.techwithsalman.online</a>.</li>
        <li>Navigate to <strong>Settings &gt; Connected Accounts</strong>.</li>
        <li>Locate the social account you wish to remove and click <strong>Disconnect</strong>.</li>
        <li>All associated access tokens and pending queues for that profile are immediately deleted.</li>
      </ol>

      <h2>Option 2: Delete Entire User Account &amp; All Stored Data</h2>
      <ol>
        <li>Inside your PostNexa dashboard, navigate to <strong>Settings &gt; Profile &gt; Delete Account</strong>.</li>
        <li>Confirm your account password to verify ownership.</li>
        <li>Upon confirmation, your profile, workspaces, connected tokens, media uploads, and post histories are permanently erased from our databases within 24 hours.</li>
      </ol>

      <h2>Option 3: Manual Request via Support</h2>
      <p>If you cannot access your account, email <strong>support@techwithsalman.online</strong> with the subject <em>"Data Deletion Request"</em> from your registered email address. We will process your request within 48 hours and send confirmation.</p>
    </div>
  </section>
`;
make_page("data-deletion/index.html", 1, "resources", "User Data Deletion Instructions | PostNexa", "Step-by-step instructions for disconnecting social accounts and permanently deleting your PostNexa data.", "data-deletion/", data_deletion_html);

// =========================================================================
// 13. 404 PAGE
// =========================================================================
const page_404_html = `
  <section class="sc-inner-hero" style="padding: 120px 0; text-align: center;">
    <div class="sc-container">
      <div style="font-size: 72px; font-weight: 900; color: var(--color-primary); line-height: 1; margin-bottom: 16px;">404</div>
      <h1 class="sc-inner-hero-title">Page Not Found</h1>
      <p class="sc-inner-hero-desc" style="margin: 0 auto 32px auto;">The page you are looking for might have been moved, renamed, or is temporarily unavailable.</p>
      <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
        <a href="index.html" class="sc-btn sc-btn-primary sc-btn-pill">Return to Homepage ➔</a>
        <a href="features/index.html" class="sc-btn sc-btn-outline sc-btn-pill">Explore Features</a>
      </div>
    </div>
  </section>
`;
make_page("404.html", 0, "", "404 Not Found | PostNexa", "The requested page could not be found.", "404.html", page_404_html);

console.log("REGENERATING ALL 35 PAGES WITH PREMIUM COMPOSITIONS & RESPONSIVE POLISH COMPLETED!");
