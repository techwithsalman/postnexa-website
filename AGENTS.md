# POSTNEXA AGENT OPERATING INSTRUCTIONS

These instructions are permanent operational guidelines for all AI agents (including Google Antigravity) working on the PostNexa marketing website.

---

## 1. BRAND IDENTITY & ARCHITECTURE

- **Official Product Name:** PostNexa
- **Parent Brand / Developer Attribution:** Tech With Salman
- **Parent Website:** https://techwithsalman.online/
- **Live Application Portal:** https://app.techwithsalman.online/
- **GitHub Repository:** https://github.com/techwithsalman/postnexa-website.git
- **Primary Branch:** `main`

---

## 2. REPOSITORY SEPARATION RULE

- **Marketing Website Only:** This repository contains ONLY the frontend static marketing website for PostNexa.
- **Application Separation:** The full Next.js/Prisma Social Media OS application resides in a separate repository and production deployment. Do NOT mix application backend logic, internal database credentials, or private API keys into this static repository.

---

## 3. AUTOMATIC COMMIT & PUSH POLICY (CRITICAL)

**Rule:** Every successfully completed and verified task on this website MUST be automatically committed and pushed to GitHub (`origin/main`) without waiting for manual confirmation.

### Execution Workflow:
1. **Develop / Modify:** Implement the requested changes carefully.
2. **Quality & Regression Check:**
   - Verify that all 35 HTML pages remain functional and well-formed.
   - Run `node audit_site.js` to ensure 0 broken links and correct asset paths.
   - Test responsiveness across mobile, tablet, and desktop viewports.
   - Confirm no sensitive credentials, `.env` files, or private tokens are present.
3. **Stage Changes:** `git add .` (excluding temporary or backup files).
4. **Descriptive Commit:** `git commit -m "feat/fix: <clear description of changes>"`
5. **Push to Remote:** `git push origin main`
6. **Verify & Report:** Confirm the push succeeded, output the commit hash, and report the updated status to the user.

### Safety Safeguards:
- **NEVER use `git push --force` or `--delete`.**
- **NEVER overwrite remote history.**
- If the remote branch has upstream commits, fetch and rebase/merge cleanly before pushing.
- If verification fails or a build error occurs, keep changes local, do NOT push, and fix the issue first.

---

## 4. DESIGN & FUNCTIONALITY PRESERVATION

- **Preserve Approved Layouts:** Do not rewrite or redesign approved pages from scratch.
- **Maintain CSS Tokens & Hierarchy:** Use the established CSS variables in `css/style.css` (`--color-primary: #F16A21`, `--color-secondary-yellow: #FFCE38`, etc.).
- **Zero Heavy Frameworks:** Maintain pure HTML5, CSS3, and Vanilla JavaScript. Do not introduce React, Next.js, Tailwind CSS, or Bootstrap to this static codebase.
- **Netlify Readiness:** Ensure `_redirects`, `sitemap.xml`, and `robots.txt` remain up-to-date and deployable.
