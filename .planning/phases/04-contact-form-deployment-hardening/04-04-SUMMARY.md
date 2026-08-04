---
phase: 04-contact-form-deployment-hardening
plan: 04
subsystem: ui
tags: [react, homepage, selected-work, requirements-traceability]

# Dependency graph
requires:
  - phase: 03-homepage-sections
    provides: SelectedWork.tsx with 6 real case studies + 5 deferred case studies behind a "see more" toggle
provides:
  - Selected Work grid rendering only the 6 real case studies, permanently, with no expand/collapse state
  - No homepage link to any of the 5 deferred case-study slugs
  - REQUIREMENTS.md recording HOME-04 as explicitly superseded by DEPL-03
affects: [04-05, homepage-content, requirements-traceability]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Selected Work grid is now a pure map over caseStudies with no local component state"

key-files:
  created: []
  modified:
    - src/components/home/SelectedWork.tsx
    - src/components/home/SelectedWork.test.tsx
    - src/router.tsx
    - .planning/REQUIREMENTS.md

key-decisions:
  - "Removed useState/expanded toggle and deferredCaseStudies import entirely rather than hiding them, per D-07/D-08 (no dead code path that could be silently re-enabled)"
  - "DEFERRED_SLUG_ROUTES in router.tsx stay registered unchanged so any stray/cached link resolves to the coming-soon page instead of a 404 (D-07)"
  - "REQUIREMENTS.md marks HOME-04 as superseded by DEPL-03 rather than silently leaving it checked off unchanged (D-08)"

patterns-established: []

requirements-completed: [DEPL-03]

coverage:
  - id: D1
    description: "Selected Work grid renders exactly the 6 real case studies with no 'see more' toggle, no 'Coming soon' cards, and no links to any of the 5 deferred slugs"
    requirement: "DEPL-03"
    verification:
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#renders exactly 6 real case-study cards, in caseStudies order, on initial render"
        status: pass
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#renders zero 'Coming soon' labels on initial render"
        status: pass
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#renders no 'see more' toggle button of any kind"
        status: pass
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#never renders a link to any of the 5 deferred slugs"
        status: pass
    human_judgment: false
  - id: D2
    description: "REQUIREMENTS.md documents HOME-04 as superseded by DEPL-03 (not silently left checked off) in both the requirement line and Traceability table"
    requirement: "DEPL-03"
    verification:
      - kind: other
        ref: "grep -ic 'superseded by DEPL-03' .planning/REQUIREMENTS.md"
        status: pass
    human_judgment: false

# Metrics
duration: 20min
completed: 2026-08-04
status: complete
---

# Phase 4 Plan 4: Remove "see more" toggle and deferred-slug links from Selected Work Summary

**Selected Work now renders only the 6 shipped case studies with no toggle/expand state and no path to any deferred slug; REQUIREMENTS.md documents HOME-04 as intentionally superseded by DEPL-03.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-08-04T08:24:00Z
- **Completed:** 2026-08-04T08:56:29Z
- **Tasks:** 3
- **Files modified:** 4

## Accomplishments
- Deleted the `useState`-driven "see more" expand/collapse toggle and the `deferredCaseStudies` import from `SelectedWork.tsx`; the grid now permanently renders only the 6 real case studies from `caseStudies`
- Rewrote `SelectedWork.test.tsx` to assert the toggle button, "Coming soon" labels, and links to any of the 5 deferred slugs never render, while keeping the original "renders exactly 6" and "never renders superseded fictional titles" tests intact
- Replaced the stale "Phase 4 MUST delete/guard this whole block" comment in `router.tsx` with an accurate note explaining why `DEFERRED_SLUG_ROUTES` intentionally stays registered (D-07) — comment-only change, no functional code touched
- Updated `REQUIREMENTS.md` to record HOME-04 as superseded by DEPL-03 in both the requirement line (strikethrough + note) and the Traceability table, per D-08's explicit documentation requirement

## Task Commits

Each task was committed atomically:

1. **Task 1: Remove the "see more" toggle and deferred-slug cards from SelectedWork.tsx** - `8e372e4` (feat)
2. **Task 2: Update the stale D-07 comment in router.tsx** - `2bc44a4` (docs)
3. **Task 3: Mark HOME-04 as superseded by DEPL-03 in REQUIREMENTS.md (D-08)** - `e0cf2bc` (docs)

_Note: Task 1 was declared `tdd="true"` in the plan; since it was a subtractive refactor of already-shipped behavior (not new behavior), the RED/GREEN cycle was applied by rewriting the test file's assertions to match the target end state and verifying they pass against the updated component in a single commit, rather than a separate failing-test commit — there was no new feature to isolate a RED phase around._

**Plan metadata:** (this SUMMARY commit, made after this file)

## Files Created/Modified
- `src/components/home/SelectedWork.tsx` - Removed `useState`, `deferredCaseStudies` import, the expand/collapse toggle button, and the conditional deferred-cards block; grid now maps only over `caseStudies`
- `src/components/home/SelectedWork.test.tsx` - Removed the 4 toggle/expand/collapse tests; added 2 new tests asserting no toggle button and no deferred-slug hrefs; kept the 2 original tests unchanged
- `src/router.tsx` - Comment-only update replacing the stale "Phase 4 MUST delete/guard" TODO with an accurate description of the D-07 resolution
- `.planning/REQUIREMENTS.md` - HOME-04 requirement line and Traceability table row both now record it as superseded by DEPL-03

## Decisions Made
- Removed the toggle and deferred-slug rendering path entirely (deletion, not conditional hiding) — matches D-07/D-08's explicit "deleted entirely, not hidden" requirement and leaves no dead code that could silently re-enable deferred links
- Left `src/content/case-studies/deferred.ts` and `src/content/selected-work.ts`'s `seeMoreLabel`/`seeLessLabel` fields untouched — out of this plan's declared `files_modified` scope; `deferred.ts` is still consumed by `src/routes/coming-soon.tsx` for the still-registered `DEFERRED_SLUG_ROUTES`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Ran `npm ci` to install dependencies missing from the worktree's `node_modules`**
- **Found during:** Task 1 verification (`npx vitest run`)
- **Issue:** The worktree's `node_modules` was empty (no packages installed at all), causing `@gsap/react` import resolution to fail during test transform, blocking test execution
- **Fix:** Ran `npm ci` against the existing `package-lock.json` — installs only already-declared/locked dependencies, no new package added or substituted (excluded from the package-manager-install carve-out since no new package name was introduced)
- **Files modified:** none tracked (node_modules is gitignored)
- **Verification:** `npx vitest run` and `npm run build` both succeed afterward
- **Committed in:** N/A (node_modules is gitignored, nothing to commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to run verification at all; no scope creep — no new dependency added, only existing locked dependencies installed.

## Issues Encountered
None beyond the dependency-install deviation above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- DEPL-03's homepage-link gap (flagged in STATE.md as a Phase 4 MUST-DO) is now closed for the Selected Work section
- `DEFERRED_SLUG_ROUTES` in `router.tsx` remain registered and reachable by direct URL only, per D-07 — Plan 04-05's robots.txt/sitemap.xml work independently ensures crawler exclusion
- No blockers for subsequent Phase 4 plans

---
*Phase: 04-contact-form-deployment-hardening*
*Completed: 2026-08-04*

## Self-Check: PASSED

All created/modified files confirmed present on disk; all 4 task/summary commit hashes (8e372e4, 2bc44a4, e0cf2bc, 123d190) confirmed in git log.
