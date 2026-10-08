---
description: Permanent rules for PostNexa marketing website development and automated GitHub pushing
globs: ["**/*"]
alwaysApply: true
---

# PostNexa Permanent Auto-Push & Development Guidelines

1. **Product & Brand Identity:**
   - Product: **PostNexa**
   - Developer Attribution: **Tech With Salman**
   - Application URL: `https://app.techwithsalman.online/`
   - Parent Website: `https://techwithsalman.online/`
   - Repository: `https://github.com/techwithsalman/postnexa-website.git` (branch: `main`)

2. **Automatic Commit & Push Requirement:**
   - Whenever any website development task is completed and verified, the agent MUST automatically commit and push to `origin/main` without asking or waiting for separate instructions.
   - Run verification checks (e.g. `node audit_site.js`) before pushing.
   - Never use `--force` or destructive Git flags.

3. **Design & Code Standards:**
   - Pure HTML5, CSS3, Vanilla JavaScript (Zero React, Next.js, Tailwind, Bootstrap in this marketing repository).
   - Maintain full mobile and tablet responsiveness (320px to 1920px).
   - Never commit sensitive secrets, API keys, or `.env` files.
   - Ensure Netlify continuous deployment compatibility.
