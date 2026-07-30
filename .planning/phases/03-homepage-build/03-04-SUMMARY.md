---
phase: 03-homepage-build
plan: 04
subsystem: ui
tags: [react-router, coming-soon, fallback-route, deferred-content]

requires:
  - phase: 02-content-layer-case-study-template
    provides: CaseStudyPage route and its "Case study not found." data-miss fallback pattern (Phase 2)
provides:
  - "src/routes/coming-soon.tsx — ComingSoonRoute component rendering locked coming-soon copy for deferred case-study slugs"
  - "5 literal case-study/<slug> routes in router.tsx wired to ComingSoonRoute, isolated in one labeled Phase-4-deletable block"
affects: [04-deployment-and-launch]

tech-stack:
  added: []
  patterns:
    - "Literal path routes placed ahead of a dynamic :slug sibling in the same children array (React Router ranks by specificity, not array order) to give an exact-match deferred slug its own fallback element"

key-files:
  created:
    - src/routes/coming-soon.tsx
    - src/routes/coming-soon.test.tsx
    - src/router.test.tsx
  modified:
    - src/router.tsx

key-decisions:
  - "Deferred-slug routes isolated in one commented, Phase-4-deletable block in router.tsx (not special-cased inside case-study.tsx) so DEPL-03's later removal/guard work has a single obvious block to touch"

patterns-established:
  - "Fallback routes (not-found.tsx, case-study.tsx's data-miss branch, coming-soon.tsx) share the same centered flex layout classes and 'Body + ghost Button back-link' composition, each with distinct locked copy"

requirements-completed: [HOME-04]

coverage:
  - id: D1
    description: "ComingSoonRoute renders locked 'Coming soon.' / 'This case study hasn't shipped yet...' copy, a ghost Button back to /#selected-work, and an sr-only humanized title heading per deferred slug"
    requirement: "HOME-04"
    verification:
      - kind: unit
        ref: "src/routes/coming-soon.test.tsx"
        status: pass
    human_judgment: false
  - id: D2
    description: "router.tsx wires 5 literal case-study/<deferred-slug> routes to ComingSoonRoute, isolated in one labeled block, without disturbing the existing case-study/:slug or * catch-all routes"
    requirement: "HOME-04"
    verification:
      - kind: unit
        ref: "src/router.test.tsx"
        status: pass
    human_judgment: false

duration: 8min
completed: 2026-07-30
status: complete
---

# Phase 3 Plan 4: Coming-Soon Fallback Route Summary

**Coming-soon fallback route + 5 literal router entries closing the click-through target for Selected Work's deferred "see more" cards (D-10, D-11)**

## Performance

- **Duration:** 8 min
- **Started:** 2026-07-30T15:12:46+05:30
- **Completed:** 2026-07-30T15:16:21+05:30
- **Tasks:** 2 completed
- **Files modified:** 4 (3 created, 1 modified)

## Accomplishments
- `ComingSoonRoute` component renders the exact locked "Coming soon." copy, distinct from both `not-found.tsx`'s "Page not found." and `case-study.tsx`'s "Case study not found." fallbacks
- 5 literal `case-study/<slug>` routes wired into `router.tsx` for the deferred slugs (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus), isolated in one clearly commented, Phase-4-deletable block that outranks the generic `case-study/:slug` route for those exact paths
- `src/router.test.tsx` created as the first test file for `router.tsx` (no prior coverage existed)

## Task Commits

Each task was committed atomically (TDD RED -> GREEN per task):

1. **Task 1: ComingSoonRoute component (D-10)**
   - `06060c6` test(03-04): add failing test for ComingSoonRoute
   - `4214642` feat(03-04): implement ComingSoonRoute component (D-10)
2. **Task 2: Router wiring -- 5 literal deferred-slug routes (D-10, D-11)**
   - `96606b8` test(03-04): add failing test for router deferred-slug routes
   - `16d8069` feat(03-04): wire 5 literal deferred-slug routes into router.tsx (D-10, D-11)

**Plan metadata:** committed separately by the orchestrator after wave completion (worktree mode).

## Files Created/Modified
- `src/routes/coming-soon.tsx` - `ComingSoonRoute({ slug })`, renders locked coming-soon copy + sr-only humanized title heading + ghost back-link
- `src/routes/coming-soon.test.tsx` - 10 tests covering copy, back-link, all 5 humanized titles, and distinctness from other fallback routes
- `src/router.tsx` - adds `DEFERRED_SLUGS`/`DEFERRED_SLUG_ROUTES` block and spreads 5 literal routes into the root route's `children`, ahead of `case-study/:slug`
- `src/router.test.tsx` - 8 tests asserting the 5 literal routes exist plus exactly one `:slug` route and one `*` catch-all remain

## Decisions Made
- Followed the plan's exact isolation strategy: the 5 deferred routes live in one commented block in `router.tsx` rather than being special-cased inside `case-study.tsx`, per D-11's requirement that Phase 4 have a single obvious block to delete/guard for DEPL-03.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Hydrated this worktree's empty `node_modules` via `npm ci`**
- **Found during:** Task 2 (writing the RED test for `src/router.test.tsx`)
- **Issue:** This worktree's `node_modules/` contained only Vite's cache directories (no installed packages), so any test importing `router.tsx` (which transitively imports `MotionProvider`/`useScrollReveal`, which imports `@gsap/react`) failed with a Vite import-resolution error. This was confirmed pre-existing and unrelated to this plan's changes -- `src/routes/home.test.tsx` (an untouched, existing file) failed identically before the fix.
- **Fix:** Ran `npm ci`, which installs deterministically from the already-committed `package-lock.json` (no package.json/lockfile changes, no new package names introduced -- outside the Rule 3 install-exclusion, which is scoped to installing a *new* referenced package name).
- **Files modified:** None tracked (node_modules is gitignored; `git status` confirmed no diff to `package.json`/`package-lock.json` after the install)
- **Verification:** Full suite (`npm run test`) went from failing to 24/24 test files, 143/143 tests passing
- **Committed in:** N/A (no tracked files changed by this fix)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary environment repair only, scoped to hydrating an already-locked dependency tree in this specific worktree checkout. No scope creep, no package.json/lockfile changes.

## Issues Encountered
None beyond the node_modules deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 5 deferred case-study slugs now resolve to a distinct, on-brand coming-soon page instead of a 404 or the generic "not found" fallback -- closes the click-through target for Plan 03-02's Selected Work "see more" cards.
- **Carried-forward blocker for Phase 4 (already logged in STATE.md):** the 5 deferred-slug routes are temporarily publicly reachable/linked (T-03-09, accepted risk per D-11). Phase 4's own DEPL-03 work must delete or guard the single labeled block in `router.tsx` (`DEFERRED_SLUGS`/`DEFERRED_SLUG_ROUTES`) once real content lands.
- `npm run test -- src/routes/coming-soon.test.tsx src/router.test.tsx` both pass; full suite (`npm run test`) passes with no regressions to `src/routes/case-study.test.tsx` or `src/routes/not-found.test.tsx`.

---
*Phase: 03-homepage-build*
*Completed: 2026-07-30*

## Self-Check: PASSED

All created files found on disk (`src/routes/coming-soon.tsx`, `src/routes/coming-soon.test.tsx`, `src/router.test.tsx`, modified `src/router.tsx`, this SUMMARY.md). All 4 task commits (`06060c6`, `4214642`, `96606b8`, `16d8069`) found in git log.
