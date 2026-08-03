---
phase: 04
slug: contact-form-deployment-hardening
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-08-03
---

# Phase 04 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.10 + @testing-library/react 16.3.2 (existing, already configured) |
| **Config file** | `vite.config.ts` (`test` block) — existing, no new config file needed |
| **Quick run command** | `npx vitest run src/components/home/Footer.test.tsx` |
| **Full suite command** | `npm test` (runs `vitest run`) |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run <changed-test-file>`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green; all manual-only rows below must be executed against the **live deployed URL**, not local dev — per ROADMAP.md's explicit "verified end-to-end, not just a 200 response" standard for this phase.
- **Max feedback latency:** ~10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 04-xx-xx | TBD | TBD | CONT-01 | T-04-01 | Form submit calls `/api/contact` with 3 field values when honeypot is empty | unit (mock `global.fetch`) | `npx vitest run src/components/home/Footer.test.tsx` | ❌ W0 | ⬜ pending |
| 04-xx-xx | TBD | TBD | CONT-01 | — | Serverless function delivers a real email end-to-end | manual-only | N/A — verified via `/gsd-verify-work` against live URL | N/A | ⬜ pending |
| 04-xx-xx | TBD | TBD | CONT-02 | T-04-04 | Success state renders in place after 2xx; error banner renders with preserved field values after non-2xx/network failure | unit (mock `global.fetch` resolved/rejected) | `npx vitest run src/components/home/Footer.test.tsx` | ❌ W0 | ⬜ pending |
| 04-xx-xx | TBD | TBD | CONT-02 | T-04-02 | Honeypot non-empty → success block renders, `fetch` NOT called | unit (spy on `global.fetch`) | `npx vitest run src/components/home/Footer.test.tsx` | ❌ W0 | ⬜ pending |
| 04-xx-xx | TBD | TBD | CONT-03 | — | Résumé link downloads a working PDF | manual-only | N/A — verified via `/gsd-verify-work` against live URL | N/A (href/download attr already covered) | ⬜ pending |
| 04-xx-xx | TBD | TBD | DEPL-01 | — | Site is publicly reachable at a `*.vercel.app` URL | manual-only | N/A — verified via `/gsd-verify-work` | N/A | ⬜ pending |
| 04-xx-xx | TBD | TBD | DEPL-02 | — | Direct load/refresh of `/case-study/mashreq` returns app shell, not 404 | manual-only | N/A — verified via `/gsd-verify-work` against live URL | N/A | ⬜ pending |
| 04-xx-xx | TBD | TBD | DEPL-03 | — | Homepage renders no links to the 5 deferred slugs; "see more" toggle is gone | unit | `npx vitest run src/components/home/SelectedWork.test.tsx` | ❌ W0 — rewrite existing assertions | ⬜ pending |
| 04-xx-xx | TBD | TBD | DEPL-03 | T-04-05 | 5 deferred slugs excluded from `sitemap.xml`; disallowed in `robots.txt` | unit | `npx vitest run src/test/seo.test.ts` | ❌ W0 — new file | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs and Plan/Wave columns are TBD — the planner fills these in once PLAN.md files are created.*

---

## Wave 0 Requirements

- [ ] Extend `src/components/home/Footer.test.tsx` — cover CONT-01/CONT-02 submit/success/error/honeypot behavior (mock `global.fetch`)
- [ ] Rewrite `src/components/home/SelectedWork.test.tsx` — remove/replace assertions that currently expect the "see more" toggle and deferred-slug cards to exist (DEPL-03/D-08)
- [ ] New `src/test/seo.test.ts` — assert `public/robots.txt` disallows the 5 deferred slugs and `public/sitemap.xml` omits them (DEPL-03)
- [ ] No new framework/config install needed — Vitest + Testing Library are already fully configured

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|--------------------|
| Serverless function delivers a real email end-to-end | CONT-01 | Requires a live Resend API call + live inbox check against `hazrafarhinwork@gmail.com`; cannot be simulated in Vitest/jsdom without mocking away the exact thing being verified | Submit the deployed form, check `hazrafarhinwork@gmail.com` inbox for the resulting email |
| Résumé link downloads a working PDF | CONT-03 | Verifying an actual PDF file downloads correctly and opens is a human/browser check, not simulable in jsdom | Click the résumé link on the live deployed site, confirm a valid PDF downloads and opens |
| Site is publicly reachable at a `*.vercel.app` URL | DEPL-01 | Deployment reachability is an infrastructure check, not a unit-testable behavior | Load the deployed Vercel URL in a browser |
| Direct load/refresh of `/case-study/mashreq` returns app shell, not a 404 | DEPL-02 | Requires a real HTTP request to the deployed Vercel routing layer; `vercel.json` rewrite behavior cannot be exercised inside Vitest/jsdom | Directly navigate to `/case-study/mashreq` on the live URL and refresh the page |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
