# Phase 4: Contact Form & Deployment Hardening - Context

**Gathered:** 2026-08-03
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase makes the contact form actually work end-to-end (real email delivery via Resend, clear success/error feedback, basic spam protection), gets the site live on a real public host (Vercel) with correct SPA routing for case-study deep links, and closes out the DEPL-03 gap Phase 3 knowingly left open (the 5 deferred case studies are currently linked via a "coming soon" route). It does not build full case-study pages for the 5 deferred projects (v2), and does not do final visual/motion/performance polish (Phase 5). Résumé download (CONT-03) is already functionally complete from Phase 3 (`public/resume.pdf` exists) — this phase only verifies it works end-to-end, it does not rebuild it.

</domain>

<decisions>
## Implementation Decisions

### Email delivery approach (CONT-01, CONT-02)
- **D-01:** Use Resend (not Formspree) for email delivery, via a serverless function. A `RESEND_API_KEY` already exists in the repo's `.env` (gitignored via `.env*`) — reuse it rather than introduce a second, unused third-party service.
- **D-02:** Send from Resend's default `onboarding@resend.dev` address — no custom domain is verified in Resend yet. This means Resend restricts the recipient to the Resend account owner's own verified email, which is `hazrafarhinwork@gmail.com` — the real inbox this form should reach anyway, so no functional loss for v1.
- **D-03:** Email format is a plain subject line (e.g. `New brief from {submitter email}`) plus a labeled plain-text body listing all 3 form fields — no styled HTML email template. This is a low-volume inbox notification, not a marketing email; skip the template-build cost.

### Deployment host (DEPL-01, DEPL-02)
- **D-04:** Deploy to Vercel, not Netlify. First-party Vite framework detection, serverless functions as `/api/*.ts` files matching this repo's existing TypeScript setup directly.
- **D-05:** Ship on the default `*.vercel.app` subdomain for v1 — no custom domain owned/connected yet. A custom domain is a fast follow-up later, not part of this phase's scope.
- **D-06:** No Vercel account is connected to this repo's GitHub remote yet. The plan MUST include a manual checkpoint step: user creates/connects a Vercel account, imports the GitHub repo, and adds `RESEND_API_KEY` as a Vercel project environment variable — execution then resumes and verifies the live deployment (mirrors the Phase 3 résumé-conversion checkpoint pattern in `03-05-PLAN.md`).

### Deferred route guarding (DEPL-03)
- **D-07:** Remove all links to the 5 deferred case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) from the homepage. The coming-soon route itself (`src/routes/coming-soon.tsx`, wired in `src/router.tsx`) stays reachable by direct URL so a stray/cached link doesn't 404 — but nothing on the site links to it. Exclude these 5 routes from any sitemap and disallow them in `robots.txt` (neither currently exists in the repo — `public/robots.txt` and any sitemap generation are new to this phase).
- **D-08 — Requirements conflict, explicitly flagged and accepted by the user:** The "see more" expansion (HOME-04, marked Complete in Phase 3) is removed/disabled entirely rather than kept as non-clickable "coming soon" cards — there is nothing left to reveal once the 5 deferred entries have no links. This means HOME-04 ("User can reveal the remaining 5 case studies via a 'see more' expansion") is **no longer literally satisfied** by the shipped site. The user explicitly chose this over keeping non-clickable cards. **REQUIREMENTS.md must be updated to mark HOME-04 as superseded by DEPL-03 for v1** (not silently left checked off) — this is a required Phase 4 documentation task, not just a code change. Selected Work's grid should show only the 6 featured case studies going forward.

### Contact form feedback & spam protection (CONT-02)
- **D-09:** Success/error feedback is inline, not a toast/banner (no toast component exists in this codebase — don't introduce one for this). On success, the form fields are replaced in place with a confirmation message. On error, an inline error message appears above the form with the user's entered field values preserved (no data loss on failure).
- **D-10:** Spam protection is a honeypot field only — one hidden input real users never see; if it arrives non-empty on submit, silently reject without calling Resend. No CAPTCHA, no third-party rate-limiting service for v1.
- **D-11:** All 3 form fields become required before submit — add `required` to "What are you working on?" and "What needs to become clearer?" (currently only Email has `required`), matching the existing native-validation pattern already on the Email field in `src/components/home/Footer.tsx`.

### Carried forward from Phase 3 (must-fix, not optional)
- **D-12 (from `03-REVIEW.md`):** The footer's `<form>` currently has `type="submit"` with no `onSubmit`/`preventDefault`, so a real click today triggers a native full-page GET reload. Add `e.preventDefault()` in the submit handler as part of wiring the real Resend submission — this is a correctness fix, not new scope.
- **D-13 (from `03-CONTEXT.md` D-15):** `public/resume.pdf` is already the real, converted résumé from Phase 3 — Phase 4's CONT-03 work is verification only (click the link, confirm a working PDF downloads against the live deployed site), not a rebuild.

### Claude's Discretion
- Exact copy/wording of the inline success and error messages (D-09), within the "clear, distinct states" requirement of CONT-02.
- Exact serverless function file structure/naming under `/api/` for the Resend call (D-01/D-04).
- Whether to consolidate the deferred-slug title data currently hand-duplicated across `router.tsx`, `coming-soon.tsx`, and `content/case-studies/deferred.ts` into one source of truth while touching all three files for D-07/D-08 (flagged as non-blocking minor polish in `03-REVIEW.md`) — do it if it doesn't expand scope, skip it if it does.
- Exact `robots.txt` syntax and whether a sitemap.xml is generated statically or at build time (D-07) — as long as the 5 deferred routes are excluded/disallowed.
- Honeypot field name/implementation details (D-10), as long as it's invisible to real users and doesn't trip accessibility tooling (e.g. proper `aria-hidden`/`tabindex="-1"`, not just `display:none` alone if that risks autofill).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/ROADMAP.md` — Phase 4 goal, success criteria, requirement mapping (CONT-01–03, DEPL-01–03)
- `.planning/REQUIREMENTS.md` — CONT-01–03, DEPL-01–03 full text; must be updated per D-08 to mark HOME-04 as superseded by DEPL-03 for v1
- `.planning/PROJECT.md` — "Deployment: Vercel or Netlify" constraint, now resolved to Vercel (D-04); "Active" section calls out email service and deployment as the two open items this phase closes
- `.planning/STATE.md` — Blockers/Concerns section: Formspree-vs-Resend now resolved (D-01); D-11 (Phase 3's cross-phase note) is the origin of this phase's D-07/D-08 work; footer `preventDefault` fix noted (D-12)

### Prior phase context this phase builds on
- `.planning/phases/03-homepage-build/03-CONTEXT.md` — D-07 (contact form shipped as markup-only baseline this phase wires up), D-11 (origin of the DEPL-03 conflict this phase resolves via D-07/D-08), D-15 (résumé already converted to PDF, D-13 here)
- `.planning/phases/03-homepage-build/03-REVIEW.md` — `preventDefault` should-fix (D-12) and the deferred-slug data duplication minor-polish note (Claude's Discretion)

### Code this phase modifies
- `src/router.tsx` — `DEFERRED_SLUG_ROUTES` block already has an inline "Phase 4 MUST delete/guard this whole block" comment; per D-07 the route registrations stay, only homepage links are removed
- `src/routes/coming-soon.tsx` — stays reachable per D-07; links to it (from Selected Work) are removed per D-08
- `src/content/case-studies/deferred.ts` — deferred slug/title data; consolidation candidate per Claude's Discretion
- `src/components/home/Footer.tsx` — the contact form markup; add `onSubmit`/`preventDefault` (D-12), honeypot field (D-10), `required` on remaining fields (D-11), and inline success/error state rendering (D-09)
- `src/content/footer.ts` — form field labels/content, already has `formFields.workingOn`/`emailLabel`/`clarify` and `submitLabel` to reuse
- `public/resume.pdf` — already-real résumé file; D-13 verification target
- `.env` — contains `RESEND_API_KEY` already, confirmed gitignored via `.gitignore`'s `.env*` pattern; must be added as a Vercel project env var (D-06), never committed

### Selected Work component (homepage integration point for D-07/D-08)
- Wherever Phase 3 rendered the "see more" toggle and the 6+5 case-study grid on the homepage (Selected Work section, `src/routes/home.tsx` and its Selected Work sub-component) — the planner must locate the exact file and remove the "see more" expansion and the 5 deferred-slug card links per D-07/D-08

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Button.tsx`, `Typography.tsx` — existing primitives already used in `Footer.tsx`; reuse for any new inline success/error message markup (D-09) rather than introducing new one-off styling
- `footerContent.formFields` / `footerContent.submitLabel` in `src/content/footer.ts` — existing content-as-data-module pattern (established Phase 1–3); add new success/error copy here, not hardcoded inline

### Established Patterns
- Content-as-data-module pattern (`src/content/*.ts`) — copy lives outside JSX; success/error message text and any new labels should follow this, not be hardcoded in `Footer.tsx`
- Checkpoint pattern for external/manual steps requiring human action (Plan `03-05-PLAN.md` did this for the résumé `.docx`→PDF conversion and social URL confirmation) — reuse this pattern for D-06's Vercel account connection

### Integration Points
- `src/components/home/Footer.tsx` — the `<form>` element gains a real `onSubmit` handler calling the new `/api/` serverless function
- New serverless function under `/api/` (Vercel convention) — the actual Resend API call happens server-side; `RESEND_API_KEY` must never reach client-side bundle
- Selected Work grid/toggle component (homepage) — D-07/D-08's link removal and "see more" removal happen here
- `src/router.tsx` — no route deletions per D-07, but the homepage no longer links into `DEFERRED_SLUG_ROUTES`

</code_context>

<specifics>
## Specific Ideas

- Recipient email for the contact form must be exactly `hazrafarhinwork@gmail.com` — matches both Resend's unverified-domain restriction (D-02) and the footer's existing `contactEmail`/`contactEmailHref` values in `src/content/footer.ts`.
- The Vercel checkpoint (D-06) should mirror the Phase 3 résumé-conversion checkpoint's shape: pause execution, give the user explicit manual steps, resume and verify once done — not a vague "make sure this is deployed" instruction.
- DEPL-03 verification must be against the actual live URL, not just local dev — same "verified end-to-end, not just a 200 response" standard the ROADMAP.md success criteria already set for the contact form.

</specifics>

<deferred>
## Deferred Ideas

- **Custom domain for Vercel deployment** — deferred per D-05; default `*.vercel.app` subdomain ships for v1, custom domain is a fast follow-up whenever Hazra owns one.
- **Custom Resend-verified sending domain** — deferred per D-02; would remove the "recipient must be account owner" restriction, only matters once other recipients are needed.
- **Styled HTML email template** — deferred per D-03; plain-text labeled body is sufficient for a low-volume personal inbox notification.
- **CAPTCHA / third-party rate-limiting for the contact form** — deferred per D-10; honeypot-only for v1, revisit only if spam becomes an actual problem.
- **Full case-study pages for the 5 deferred projects** — already tracked as v2 (CASE-V2-01) in REQUIREMENTS.md; unaffected by this phase's D-07/D-08 (guarding the routes, not building their content).

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 4-Contact Form & Deployment Hardening*
*Context gathered: 2026-08-03*
