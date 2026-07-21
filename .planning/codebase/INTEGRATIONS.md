# External Integrations

**Analysis Date:** 2026-07-21

## Project Status: No Integrations Exist Yet

This is a static portfolio website project with no application code written yet. There are currently **no APIs, databases, auth providers, or webhooks integrated into the actual project**. The only external references found are inside the two design-reference-only HTML templates (`Templates/Noema/`, `Templates/Axisform/`), which are not part of the built site and should not be treated as chosen integrations.

## APIs & External Services

**None integrated into the project.**

Reference templates load third-party assets via CDN only (no API calls with request/response data):
- Tailwind CSS Play CDN - `https://cdn.tailwindcss.com` (styling engine, both templates)
- GSAP + ScrollTrigger - `https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/` (animation library, both templates)
- Lenis - `https://cdn.jsdelivr.net/npm/lenis@1.1.20/` (smooth scroll, Axisform template only)
- Lucide Icons - `https://unpkg.com/lucide@latest` (icon rendering, both templates)
- Google Fonts - `https://fonts.googleapis.com`, `https://fonts.gstatic.com` (webfont delivery, both templates)

## Data Storage

**Databases:**
- None. No database, ORM, or query client of any kind exists in the repo.

**File Storage:**
- Local filesystem only. Portfolio content currently lives as Markdown files in `Portfolio-Documentation/` (`Homepage Copy V2.md`, `Information Architecture.md`, `Project Page- Template.md`). No cloud storage (S3, Cloudinary, etc.) is configured.

**Caching:**
- None.

## Authentication & Identity

**Auth Provider:**
- None. This is a public-facing static portfolio site with no login, user accounts, or auth flow implied anywhere in the documentation or templates.

## Monitoring & Observability

**Error Tracking:**
- None.

**Analytics (found in reference templates only, not part of the project's chosen stack):**
- Both `Templates/Noema/Noema Artist Portfolio.html` and `Templates/Axisform/Axisform Studio Landing Page.html` include a Google Tag Manager / gtag.js snippet (`https://www.googletagmanager.com/gtag/js?id=G-2M6V79H761`). This is template boilerplate carried over from the design-reference source and is **not** an integration decision for this project — the shared tracking ID (`G-2M6V79H761`) appears in both unrelated templates, confirming it is generic template filler, not a real analytics account for Hazra Farhin's portfolio.

**Logs:**
- None configured.

## CI/CD & Deployment

**Hosting:**
- Not chosen. No hosting/deployment config exists (no Vercel/Netlify config, no GitHub Actions workflow, no Dockerfile).

**CI Pipeline:**
- None. No `.github/workflows/` directory or equivalent CI configuration found for the site itself. (Note: the `.agents`/`.claude`/`.codex`/`.opencode`/`.zcode` directories contain GSD workflow-automation tooling, which is unrelated to site CI/CD.)

## Environment Configuration

**Required env vars:**
- None. No `.env` files exist in the repo.

**Secrets location:**
- Not applicable — no secrets are used anywhere in the project yet.

## Webhooks & Callbacks

**Incoming:**
- None.

**Outgoing:**
- None. If a contact form is added to the site in a future phase, it will likely need a form-submission integration (e.g., a form backend service, email API, or serverless function) — none exists today.

## Recommendation for Future Phases

When integrations are actually chosen (hosting, analytics, contact form backend, CMS, etc.), replace this document with the real, in-use services, their config locations, and required environment variables. Do not carry forward the Google Tag Manager ID found in the reference templates — it belongs to the original template authors, not this project.

---

*Integration audit: 2026-07-21*
</content>
