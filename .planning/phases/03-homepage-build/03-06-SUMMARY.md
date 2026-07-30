---
phase: 03-homepage-build
plan: 06
subsystem: ui
tags: [react, tailwind, contact-form, footer, resume-download, external-links]

# Dependency graph
requires:
  - phase: 03-homepage-build
    provides: "Plan 03-05's human-confirmed résumé PDF (public/resume.pdf) and confirmed LinkedIn/Behance URLs (Website explicitly omitted)"
provides:
  - "src/content/footer.ts — Brief/Footer copy module (FooterContent interface), elsewhere[] limited to checkpoint-confirmed URLs only"
  - "src/components/home/Footer.tsx — combined Contact/Brief static form + 3-column Footer, ready to mount into home.tsx"
affects: [03-07-home-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Native <label htmlFor> wrapping the Label typography component (span) for accessible form-field association, since TypographyProps doesn't expose htmlFor"

key-files:
  created:
    - src/content/footer.ts
    - src/components/home/Footer.tsx
    - src/components/home/Footer.test.tsx
  modified: []

key-decisions:
  - "elsewhere[] contains only LinkedIn and Behance (both confirmed real in 03-05's checkpoint) — no Website entry at all, per the checkpoint's explicit 'omit' outcome; never a placeholder href"
  - "Legal links (Privacy Policy, Terms) render as plain Label text, never wrapped in <a> — resolves UI-SPEC's previously-unresolved nav/error consideration in favor of the non-interactive-text option"
  - "Footer.test.tsx asserts onSubmit-absence and target=_blank/rel pairing via rendered DOM queries, not source-file reads — this project's tsconfig has no 'node' types/@types/node, so node:fs-based source inspection isn't a supported pattern here; the plan's own grep-based acceptance criteria were run manually via Bash and confirmed passing (onSubmit= count 0, target=_blank count 2 == rel=noopener noreferrer count 2)"

patterns-established: []

requirements-completed: [HOME-08, CONT-04]

coverage:
  - id: D1
    description: "Footer renders a working résumé download link pointing at the real converted /resume.pdf (HOME-08, D-15)"
    requirement: "HOME-08"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#résumé link has href=\"/resume.pdf\" and a download attribute"
        status: pass
    human_judgment: false
  - id: D2
    description: "Footer renders direct email, LinkedIn, and Behance links using only real, human-confirmed URLs from Plan 03-05's checkpoint (CONT-04)"
    requirement: "CONT-04"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#renders elsewhere[] links with the confirmed hrefs, all target=\"_blank\""
        status: pass
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#renders contact email as a mailto: link, phone and location as plain text"
        status: pass
    human_judgment: false
  - id: D3
    description: "Contact/Brief form UI renders all 3 fields plus 'Send the Brief →' submit CTA with zero submission handler wired (D-07)"
    requirement: "HOME-08"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#renders exactly 3 labeled form fields and no onSubmit handler"
        status: pass
      - kind: manual_procedural
        ref: 'grep -c "onSubmit=" src/components/home/Footer.tsx returns 0'
        status: pass
    human_judgment: false
  - id: D4
    description: "Every target=_blank footer/social link pairs with rel=noopener noreferrer (T-03-01)"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#every target=\"_blank\" anchor pairs with rel=\"noopener noreferrer\""
        status: pass
    human_judgment: false
  - id: D5
    description: "Footer legal links render as plain non-interactive text since no destination page exists this phase"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#legal links render as plain text, never an <a>"
        status: pass
    human_judgment: false

# Metrics
duration: 15min
completed: 2026-07-30
status: complete
---

# Phase 3 Plan 06: Contact/Brief + Footer Summary

**Static 3-field Brief contact form (no submit handler, D-07) plus a 3-column Footer wired to a real /resume.pdf download and only checkpoint-confirmed LinkedIn/Behance links — Website omitted entirely, not a placeholder.**

## Performance

- **Duration:** 15 min
- **Started:** 2026-07-30T10:13:00Z
- **Completed:** 2026-07-30T10:28:05Z
- **Tasks:** 1 completed (TDD: RED + GREEN)
- **Files modified:** 3

## Accomplishments
- `src/content/footer.ts` — full `FooterContent` module with verbatim copy from `Homepage Copy V2.md` §11 (Brief) and §12 (Footer); `elsewhere[]` populated only with the LinkedIn and Behance URLs Plan 03-05's checkpoint confirmed as real
- `src/components/home/Footer.tsx` — combined Brief form (3 labeled fields, no `onSubmit`) + résumé CTA (`href="/resume.pdf"`, `download`) + 3-column Footer (Contact / Elsewhere / Legal), all external `target="_blank"` anchors paired with `rel="noopener noreferrer"` (T-03-01)
- `Footer.test.tsx` — 10 passing tests covering section rendering, labeled fields, résumé link attributes, target/rel pairing, elsewhere[] link rendering, legal-as-plain-text, contact/mailto rendering, wordmark/tagline/bottom-line

## Task Commits

Each task was committed atomically (TDD RED → GREEN):

1. **Task 1 (RED): Footer content module + failing test** - `0697b4e` (test)
2. **Task 1 (GREEN): Footer component implementation** - `4352402` (feat)

**Plan metadata:** committed alongside this SUMMARY (worktree mode — orchestrator finalizes STATE.md/ROADMAP.md after wave merge)

## Files Created/Modified
- `src/content/footer.ts` - Brief/Footer copy module; `FooterLink`/`FooterContent` interfaces; `elsewhere[]` limited to checkpoint-confirmed URLs
- `src/components/home/Footer.tsx` - `<section id="contact-footer">` combining the static contact form and the closing footer block
- `src/components/home/Footer.test.tsx` - 10 tests verifying form/CTA/link/security invariants

## Decisions Made
- `elsewhere[]` ships with exactly 2 entries (LinkedIn, Behance) — no Website entry exists at all, matching the checkpoint's "omit" outcome rather than rendering a disabled/placeholder link
- Legal links (`Privacy Policy`, `Terms`) render as plain `Label` text, never an `<a>` — resolves UI-SPEC's previously-unresolved nav/error item in favor of the non-interactive-text branch, since no destination route exists this phase
- Test suite verifies `onSubmit`-absence and `target=_blank`/`rel` pairing via rendered-DOM assertions rather than reading `Footer.tsx`'s source text (`node:fs`) — this repo's `tsconfig.app.json` has no `types: ["node"]`/`@types/node`, so a source-read approach would fail `tsc -b`. The plan's own grep-based acceptance criteria were additionally run directly via Bash and confirmed: `grep -c "onSubmit=" src/components/home/Footer.tsx` → `0`; `target="_blank"` count (`2`) equals `rel="noopener noreferrer"` count (`2`)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed missing node_modules via `npm install`**
- **Found during:** Task 1 (running `Footer.test.tsx` for the first time)
- **Issue:** This worktree's `node_modules/` was empty (only `.vite` cache dirs present) — `@gsap/react` and every other dependency failed to resolve, blocking any test run
- **Fix:** Ran `npm install` (no lockfile changes, no new packages — purely materializes `node_modules/` from the existing `package-lock.json` already committed to the repo)
- **Files modified:** none tracked (node_modules is gitignored)
- **Verification:** `npm run test` (full suite) passes 190/190 after install
- **Committed in:** N/A (node_modules is gitignored, nothing to commit)

**2. [Rule 3 - Blocking] Rewrote test's source-inspection approach to avoid `node:fs`/`node:path`/`node:url`**
- **Found during:** Task 1 (`npx tsc -b` after first test draft)
- **Issue:** Initial `Footer.test.tsx` draft used `readFileSync`/`node:path`/`node:url` to grep the component source for `onSubmit=`/`target="_blank"` counts (mirroring the plan's own acceptance-criteria grep commands) — this project's `tsconfig.app.json` has no `"node"` in `types` and no `@types/node` dependency, so `tsc -b` failed with `TS2591: Cannot find name 'node:fs'` etc.
- **Fix:** Rewrote the two affected tests to assert the same invariants via rendered-DOM queries only (`container.querySelectorAll('a[target="_blank"]')`, presence of labeled fields/submit text) instead of reading the source file; ran the plan's literal grep-based acceptance criteria separately via Bash and confirmed they pass
- **Files modified:** `src/components/home/Footer.test.tsx`
- **Verification:** `npx tsc -b` clean, `npm run test -- src/components/home/Footer.test.tsx` (10/10 pass), `npm run lint` clean (pre-existing unrelated warning only)
- **Committed in:** `4352402` (Task 1 GREEN commit)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking, both required to get the test suite compiling/running in this worktree)
**Impact on plan:** No scope creep — both fixes were mechanical (dependency materialization, test-implementation-detail swap); all of the plan's own acceptance criteria (grep counts, attribute checks) were verified to hold exactly as specified.

## Issues Encountered
None beyond the two auto-fixed blocking issues above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `Footer.tsx` is fully built and tested, ready for Plan 03-07 to mount as the closing `<section id="contact-footer">` sibling in `src/routes/home.tsx`
- Résumé download is real and functional (`/resume.pdf`, served from `public/resume.pdf` per Plan 03-05)
- Website footer link remains intentionally absent — if/when a real Website URL becomes available, it should be appended to `footerContent.elsewhere` in `src/content/footer.ts` (no code change needed elsewhere, since Elsewhere renders via `.map()`)

---
*Phase: 03-homepage-build*
*Completed: 2026-07-30*

## Self-Check: PASSED

- FOUND: src/content/footer.ts
- FOUND: src/components/home/Footer.tsx
- FOUND: src/components/home/Footer.test.tsx
- FOUND: .planning/phases/03-homepage-build/03-06-SUMMARY.md
- FOUND: commit 0697b4e (test — RED)
- FOUND: commit 4352402 (feat — GREEN)
- FOUND: commit d094434 (docs — SUMMARY)
