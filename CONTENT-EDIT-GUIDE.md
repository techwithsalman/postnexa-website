# PostNexa — Content & Website Editing Guide

Welcome to the **PostNexa** marketing website codebase by **Tech With Salman**.  
This guide explains how to update copy, change brand colors, replace vector illustrations, modify navigation links, and adjust application endpoints without breaking layout or animations.

---

## 1. CENTRAL APPLICATION CONFIGURATION (`js/config.js`)

All global endpoints and brand strings are centralized in `js/config.js`. If you need to update your live application URL or parent website, edit this single file:

```javascript
window.POSTNEXA_CONFIG = {
  brandName: "PostNexa",
  parentCompany: "Tech With Salman",
  parentUrl: "https://techwithsalman.online/",
  appUrl: "https://app.techwithsalman.online/",
  appSignInUrl: "https://app.techwithsalman.online/",
  appSignUpUrl: "https://app.techwithsalman.online/",
  supportEmail: "support@techwithsalman.online"
};
```

---

## 2. COLOR PALETTE & DESIGN TOKENS (`css/style.css`)

All colors, border radii, shadows, and transitions are managed via CSS custom properties at the top of `css/style.css`:

```css
:root {
  /* Brand Colors */
  --color-primary: #F16A21;           /* Signature PostNexa Orange */
  --color-primary-hover: #D95614;     /* Button hover state */
  --color-primary-light: #FFF4EE;     /* Soft badge background */
  --color-secondary-yellow: #FFCE38;  /* Accent Yellow */
  
  /* Text & Surface Colors */
  --color-text-heading: #181E23;
  --color-text-body: #475467;
  --color-text-muted: #667085;
  --color-bg-white: #FFFFFF;
  --color-bg-warm: #FFF9F5;
  --color-bg-light: #F8FAFC;
  --color-border: #E5E7EB;
}
```
*To change the main brand theme, simply update `--color-primary` and `--color-primary-light`.*

---

## 3. UPDATING HOMEPAGE & INNER PAGE SECTIONS

### A. Changing Hero Headings & Subtitles (`index.html`)
Open `index.html` and search for the comment `<!-- 2. HERO SECTION -->`:
- **Heading:** Edit the `<h1>` element inside `.sc-hero-title`.
- **Description:** Edit the paragraph text inside `.sc-hero-desc`.
- **CTA Buttons:** The buttons link to `POSTNEXA_CONFIG.appUrl` or `https://app.techwithsalman.online/`.

### B. Updating Status Badges on Features
Use the standard status badge classes across any page:
- **Live Feature:** `<span class="sc-badge-status sc-badge-live">Live</span>`
- **Beta Testing:** `<span class="sc-badge-status sc-badge-beta">Beta</span>`
- **In Development:** `<span class="sc-badge-status sc-badge-dev">In Development</span>`
- **Planned / Roadmap:** `<span class="sc-badge-status sc-badge-soon">Planned</span>`

---

## 4. ASSETS DIRECTORY STRUCTURE

All media files are organized into semantic folders under `assets/`:

- `assets/logos/`
  - `postnexa-logo.svg` — Brand logo
  - `meta-partner.svg`, `aws-partner.svg`, `tiktok-partner.svg` — Partner badges
  - `app-store.svg`, `google-play.svg`, `chrome-store.svg` — App store badges
- `assets/icons/`
  - Social network icons: `facebook.svg`, `instagram.svg`, `youtube.svg`, `tiktok.svg`, `linkedin.svg`, `x-twitter.svg`, `pinterest.svg`
  - UI icons: `calendar.svg`, `publish.svg`, `ai-bot.svg`, `analytics.svg`, `engage.svg`, `support.svg`, `check.svg`, `star.svg`
- `assets/images/`
  - Vector SaaS UI mockups: `dashboard-hero.svg`, `calendar-preview.svg`, `distribution-preview.svg`, `analytics-preview.svg`, `inbox-preview.svg`, `reputation-preview.svg`, `ai-suite-preview.svg`
  - Avatars: `avatar-guy.svg`, `avatar-ashley.svg`, `avatar-ian.svg`

---

## 5. SITE MAP & DIRECTORY TREE

```
Post Nexa/
├── index.html                           (Homepage)
├── 404.html                             (Custom 404 Page)
├── sitemap.xml                          (Search Engine Sitemap)
├── robots.txt                           (Crawler Directives)
├── _redirects                           (Netlify SPA Rules)
├── POSTNEXA-WEBSITE-AUDIT.md            (Complete Production Audit)
├── CONTENT-EDIT-GUIDE.md                (This Guide)
│
├── features/
│   ├── index.html                       (Features Directory)
│   ├── social-media-scheduling/         (Live)
│   ├── content-calendar/                (Live)
│   ├── social-publishing/               (Live)
│   ├── bulk-scheduling/                 (Live)
│   ├── ai-caption-writer/               (Beta)
│   ├── ai-content-generator/            (Beta)
│   ├── ai-image-generator/              (In Dev)
│   ├── design-studio/                   (In Dev)
│   ├── analytics/                       (In Dev)
│   ├── social-inbox/                    (In Dev)
│   ├── automation/                      (Planned)
│   └── team-collaboration/              (In Dev)
│
├── solutions/
│   ├── index.html                       (Solutions Directory)
│   ├── creators/
│   ├── small-businesses/
│   ├── agencies/
│   ├── social-media-managers/
│   └── teams/
│
├── integrations/index.html              (Direct APIs Directory)
├── pricing/index.html                   (Pricing Tiers & Matrix)
├── about/index.html                     (Product & Parent Story)
├── contact/index.html                   (Support & Inquiries Form)
├── faq/index.html                       (Categorized Accordion)
├── help/index.html                      (Quickstart Guides)
├── blog/
│   ├── index.html                       (Blog Directory)
│   └── social-media-scheduling-guide/   (Masterclass Guide)
├── changelog/index.html                 (Release History)
├── roadmap/index.html                   (Public Kanban Board)
├── privacy-policy/index.html            (Privacy Policy)
├── terms/index.html                     (Terms of Service)
├── cookie-policy/index.html             (Cookie Policy)
└── data-deletion/index.html             (Data Deletion Steps)
```

---

## 6. DEPLOYING TO NETLIFY

1. Drag and drop the `Post Nexa` root folder onto the **Netlify Drop** dashboard (or link via GitHub repository).
2. Set build command to: *(Leave blank)*
3. Set publish directory to: `.` (the root folder).
4. Netlify will automatically detect `_redirects` and serve clean URLs.
