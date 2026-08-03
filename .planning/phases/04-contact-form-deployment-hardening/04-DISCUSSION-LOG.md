# Phase 4: Contact Form & Deployment Hardening - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-08-03
**Phase:** 4-Contact Form & Deployment Hardening
**Areas discussed:** Email delivery approach, Deployment host, Deferred route guarding (DEPL-03), Contact form feedback & spam protection

---

## Email delivery approach

| Option | Description | Selected |
|--------|-------------|----------|
| Yes, use Resend | Wire the form to Resend via a serverless function; matches existing `RESEND_API_KEY` in `.env` | ✓ (via "you decide" — Claude selected based on existing key) |
| No, use Formspree instead | Keeps the site fully static, no serverless function needed | |

**User's choice:** "you decide" on the first question. Claude locked in Resend given the existing provisioned `RESEND_API_KEY`, then continued the area with concrete follow-ups.

| Sender address option | Description | Selected |
|--------|-------------|----------|
| No custom domain yet — use resend.dev default | Ships immediately; recipient restricted to account-owner email (hazrafarhinwork@gmail.com) | ✓ |
| I have a domain to verify in Resend | User supplies domain; plan includes DNS verification step | |

**User's choice:** No custom domain yet — use resend.dev default.

| Email format option | Description | Selected |
|--------|-------------|----------|
| Plain subject + labeled body | Subject like "New brief from {submitter email}", plain-text labeled body | ✓ |
| Styled HTML template | Branded HTML email matching site aesthetic | |

**User's choice:** Plain subject + labeled body.
**Notes:** No spam/rate-limiting service discussed here — that surfaced later under "Contact form feedback & spam protection."

---

## Deployment host

| Option | Description | Selected |
|--------|-------------|----------|
| Vercel | First-party Vite support, `/api/*.ts` functions | ✓ |
| Netlify | Also viable, more config (netlify.toml, netlify/functions/) | |

**User's choice:** Vercel.

| Domain option | Description | Selected |
|--------|-------------|----------|
| Default *.vercel.app subdomain | Zero setup, ships immediately | ✓ |
| I have a custom domain to connect | Plan includes DNS/domain-connection step | |

**User's choice:** Default *.vercel.app subdomain.

| Vercel account option | Description | Selected |
|--------|-------------|----------|
| Not connected yet — include a checkpoint | Plan pauses for manual account creation/connection + env var setup | ✓ |
| Already connected | Skip straight to env var config and deploy verification | |

**User's choice:** Not connected yet — include a checkpoint.

---

## Deferred route guarding (DEPL-03)

| Option | Description | Selected |
|--------|-------------|----------|
| Remove links, keep route reachable | "See more" no longer links the 5 deferred cards; coming-soon route stays registered; excluded from sitemap/robots.txt | ✓ |
| Remove links AND the route entirely | Delete DEFERRED_SLUG_ROUTES outright; stray links hit real 404 | |

**User's choice:** Remove links, keep route reachable.

| "See more" UI option | Description | Selected |
|--------|-------------|----------|
| Hide them entirely | "See more" toggle removed; grid always shows 6 | ✓ |
| Show as non-clickable "coming soon" cards | Grid still expands to 11; deferred 5 render without links | |

**User's choice:** Hide them entirely.
**Notes:** Claude flagged that this conflicts with HOME-04 (already marked Complete in Phase 3's REQUIREMENTS.md, since "see more" now reveals nothing). Follow-up question below.

| Conflict resolution option | Description | Selected |
|--------|-------------|----------|
| Accept it — mark HOME-04 superseded by DEPL-03 | REQUIREMENTS.md gets a note; DEPL-03 wins over HOME-04 for v1 | ✓ |
| Switch to non-clickable cards instead | Reverses prior answer to satisfy both requirements simultaneously | |

**User's choice:** Accept it — mark HOME-04 superseded by DEPL-03.
**Notes:** This is now D-08 in CONTEXT.md — an explicit, user-accepted requirements conflict, not silently dropped. REQUIREMENTS.md update is a required Phase 4 task.

---

## Contact form feedback & spam protection

| Feedback UI option | Description | Selected |
|--------|-------------|----------|
| Inline message replacing the form | Form fields replaced with confirmation on success; inline error with fields preserved on failure | ✓ |
| Toast/banner notification | Requires a new toast component not yet in the codebase | |

**User's choice:** Inline message replacing the form.

| Spam protection option | Description | Selected |
|--------|-------------|----------|
| Honeypot field only | Hidden input; non-empty on submit = silent reject | ✓ |
| No spam protection for v1 | Ship without it | |

**User's choice:** Honeypot field only.

| Validation option | Description | Selected |
|--------|-------------|----------|
| Yes, require all 3 fields | Add `required` to remaining two fields, matching existing Email pattern | ✓ |
| Keep only Email required | Leave other two fields optional | |

**User's choice:** Yes, require all 3 fields.

---

## Claude's Discretion

- Exact copy/wording of inline success and error messages
- Exact serverless function file structure/naming under `/api/`
- Whether to consolidate deferred-slug title data duplicated across `router.tsx`, `coming-soon.tsx`, `content/case-studies/deferred.ts`
- Exact `robots.txt` syntax / whether a sitemap is generated statically or at build time
- Honeypot field implementation details (must stay accessible, not just `display:none`)

## Deferred Ideas

- Custom domain for Vercel deployment (D-05)
- Custom Resend-verified sending domain (D-02)
- Styled HTML email template (D-03)
- CAPTCHA / third-party rate-limiting for the contact form (D-10)
- Full case-study pages for the 5 deferred projects (already tracked as v2 CASE-V2-01, unaffected by this phase)
