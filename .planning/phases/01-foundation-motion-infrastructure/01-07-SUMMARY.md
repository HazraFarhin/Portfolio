---
phase: 01-foundation-motion-infrastructure
plan: 07
subsystem: motion
tags: [react, gsap, lenis, reduced-motion, accessibility, vitest]

# Dependency graph
requires:
  - phase: 01-foundation-motion-infrastructure (plan 03)
    provides: usePrefersReducedMotion hook + ReducedMotionContext consumed by MotionProvider
provides:
  - MotionProvider's Lenis-instantiation effect now gated on prefersReducedMotion (guard + dependency array), closing the confirmed BLOCKER from 01-VERIFICATION.md Gap 1 / 01-REVIEW.md WR-01
  - FakeMediaQueryList-based test helper in MotionProvider.test.tsx (mirrors usePrefersReducedMotion.test.ts) enabling mid-session matchMedia change simulation
affects: [phase re-verification of Phase 1, any future phase building motion-heavy sections on top of MotionProvider]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Lenis-instantiation effect depends on [prefersReducedMotion] and early-returns before constructing Lenis when true, so the existing cleanup function (gsap.ticker.remove + lenis.destroy) tears down and re-initializes symmetrically on every toggle"
    - "Test-side FakeMediaQueryList class (matches/addEventListener/removeEventListener/triggerChange) as the standard matchMedia mock pattern across this codebase, now used identically in both usePrefersReducedMotion.test.ts and MotionProvider.test.tsx"

key-files:
  created: []
  modified:
    - src/motion/MotionProvider.tsx
    - src/motion/MotionProvider.test.tsx

key-decisions:
  - "Narrow one-line guard (`if (prefersReducedMotion) return;`) plus dependency array change, per the plan's explicit instruction not to touch the Lenis constructor options, cleanup function, or ticker wiring"
  - "Did not mark QUAL-01/QUAL-02 complete in REQUIREMENTS.md -- deferred to the subsequent phase re-verification step per this plan's own success_criteria"
  - "Ran `npm ci` to populate this worktree's node_modules (was empty except Vite cache) before running the full test suite -- @gsap/react and other deps were already pinned in package.json/package-lock.json from prior committed work (01-02), this was not a new package install"

patterns-established: []

requirements-completed: []  # Intentionally empty -- plan's success_criteria explicitly defers QUAL-01/QUAL-02 completion to phase re-verification, not this plan.

coverage:
  - id: D1
    description: "MotionProvider does not instantiate Lenis or register a gsap.ticker callback when prefersReducedMotion is true at mount"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#does not instantiate Lenis or register a gsap.ticker callback when prefersReducedMotion is true at mount"
        status: pass
    human_judgment: false
  - id: D2
    description: "Same gating holds under React StrictMode's mount-unmount-mount cycle, with no leaked ticker/Lenis state and no throw on unmount"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#creates no Lenis instance or ticker callback under StrictMode when prefersReducedMotion is true"
        status: pass
    human_judgment: false
  - id: D3
    description: "Toggling prefers-reduced-motion true->false mid-session tears down the active Lenis instance and re-initializes a fresh one when toggled back, with no leaked ticker callback in either direction"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#tears down Lenis when prefersReducedMotion toggles to true mid-session, and re-initializes it when toggled back to false"
        status: pass
    human_judgment: false
  - id: D4
    description: "All 4 pre-existing MotionProvider tests and the full 31-test-prior suite continue to pass unmodified after the gating change"
    verification:
      - kind: unit
        ref: "npm test (34 passed across 7 files)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Real-browser human verification: keyboard tab order reaches the CTA with a visible focus ring, clicking the CTA scrolls to #hero without jump/desync, and OS-level prefers-reduced-motion now disables Lenis's smooth-scroll easing (not just the GSAP reveal) both when enabling and when disabling the OS setting"
    verification: []
    human_judgment: true
    rationale: "jsdom cannot simulate real scroll physics, OS-level keyboard focus/tab order, or Lenis's actual scroll interception in a real browser. Per workflow.human_verify_mode: end-of-phase, this check is deferred to end-of-phase UAT (e.g. via /gsd-verify-work or phase re-verification) rather than blocking this plan's execution -- it re-scopes and closes 01-06-PLAN.md Task 3's deferred human-check and 01-VERIFICATION.md's Human Verification Required item, now to be run against this fix rather than the pre-fix code."

# Metrics
duration: 20min
completed: 2026-07-24
status: complete
---

# Phase 01 Plan 07: Gate Lenis Instantiation on prefersReducedMotion Summary

**Added a one-line `if (prefersReducedMotion) return;` guard plus a `[prefersReducedMotion]` dependency array to MotionProvider's Lenis-instantiation effect, closing the confirmed BLOCKER where Lenis's JS-driven smooth-scroll easing ran unconditionally regardless of the OS-level reduced-motion setting.**

## Performance

- **Duration:** ~20 min
- **Started:** 2026-07-24T11:25:00Z (approx.)
- **Completed:** 2026-07-24T11:45:08Z
- **Tasks:** 1
- **Files modified:** 2

## Accomplishments
- Gated MotionProvider's Lenis-instantiation `useEffect` on `prefersReducedMotion`: reduced-motion users at mount no longer get a `new Lenis(...)` instance or a `gsap.ticker.add` registration -- Lenis's eased/physics-based scroll interception is now fully skipped.
- Changed the effect's dependency array from `[]` to `[prefersReducedMotion]` so toggling the OS-level setting mid-session correctly tears down the active Lenis instance (via the pre-existing cleanup function) and re-initializes a fresh one when toggled back off, with no leaked ticker callback in either direction.
- Replaced the test file's `mockMatchMedia` stub (which discarded the registered `change` listener, making mid-session toggle tests impossible) with a `FakeMediaQueryList` class mirroring the one already established in `usePrefersReducedMotion.test.ts`, exposing `triggerChange(matches)`.
- Added 3 new tests: mount-time gating (Test A), StrictMode-safe mount-time gating (Test B), and mid-session toggle teardown/re-initialization symmetry (Test C) -- all passing alongside the 4 pre-existing MotionProvider tests.
- Confirmed the full 34-test suite (7 files) and production build remain green after the change.

## Task Commits

Each task was committed atomically:

1. **Task 1: Gate Lenis instantiation on prefersReducedMotion + re-scoped human verification** - `ac4e3ca` (fix)

**Plan metadata:** committed separately per state_updates step (see below).

## Files Created/Modified
- `src/motion/MotionProvider.tsx` - Lenis-instantiation effect gains `if (prefersReducedMotion) return;` guard and `[prefersReducedMotion]` dependency array (was `[]`); no other line changed.
- `src/motion/MotionProvider.test.tsx` - `mockMatchMedia` replaced with `FakeMediaQueryList` (adds `triggerChange`); `act` added to the `@testing-library/react` import; 3 new tests added alongside the 4 pre-existing ones (now 7 total).

## Decisions Made
- Kept the fix to exactly the one-line guard plus dependency-array change specified by the plan -- no changes to the Lenis constructor options, the `lenis.on('scroll', ...)` wiring, the `gsap.ticker.add`/`lagSmoothing(0)` calls, or the cleanup function, since the existing cleanup already tears down correctly on effect re-run.
- Did **not** mark QUAL-01/QUAL-02 complete in `REQUIREMENTS.md` and left `requirements-completed: []` in this summary's frontmatter -- per the plan's own `<success_criteria>`, that decision belongs to the subsequent phase re-verification step, not this plan. `state.record-metric` and `state.record-session` were still run per the standard state_updates step, but `requirements.mark-complete` was intentionally skipped.
- Ran `npm ci` in this worktree before running the full test suite, since `node_modules` was effectively empty here (only Vite's cache directories existed) and `@gsap/react` failed to resolve. This installed exactly the versions already pinned in the committed `package.json`/`package-lock.json` from prior phase work (01-02) -- no new package was added, no lockfile change resulted, and `git status` after confirms no `package.json`/`package-lock.json` diff.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Populated worktree's empty node_modules via `npm ci`**
- **Found during:** Task 1, running `npm test` after the code change
- **Issue:** This git worktree's `node_modules` contained only Vite cache directories (no installed packages), causing `src/routes/home.test.tsx` and `src/motion/useScrollReveal.test.ts` to fail with `Failed to resolve import "@gsap/react"`. This is unrelated to this plan's code change -- it's a worktree-isolation artifact, not a missing/renamed dependency.
- **Fix:** Ran `npm ci`, which installed the exact versions already declared in the committed `package.json` and `package-lock.json` (from 01-02's scaffold commit `f430dcf`). No new package was added and no lockfile/package.json diff resulted.
- **Files modified:** None (node_modules is gitignored; package.json/package-lock.json unchanged).
- **Verification:** `npm test` afterward reports 34 passed across 7 files; `npm run build` exits 0.
- **Committed in:** N/A (no trackable file change -- node_modules is gitignored).

---

**Total deviations:** 1 auto-fixed (1 blocking, environment-only -- no code/dependency change).
**Impact on plan:** No scope creep. The fix required to unblock verification was purely a worktree environment sync (`npm ci` against an already-committed, already-legitimate lockfile), not a package addition or substitution.

## Issues Encountered
None beyond the node_modules deviation documented above.

## User Setup Required
None - no external service configuration required.

## Human Verification Deferred (per workflow.human_verify_mode: end-of-phase)

The plan's Task 1 `<verify>` block includes a `<human-check>` requiring a real browser: keyboard tab order to the CTA with a visible focus-visible ring, CTA anchor-scroll to `#hero` without jump/desync, and confirming that OS-level `prefers-reduced-motion: reduce` now disables BOTH the GSAP scroll-reveal AND Lenis's smooth-scroll easing (toggled both on and off). Per project config `workflow.human_verify_mode: end-of-phase`, this was **not** performed as part of this plan's execution and is **not** a blocking checkpoint here -- it is recorded as pending, to be run during end-of-phase UAT (e.g. via `/gsd-verify-work` or the Phase 1 re-verification pass), matching how 01-06-SUMMARY.md's Task 3 human-check was previously deferred (D5 above). All automated verification (`npx vitest run src/motion/MotionProvider.test.tsx`, `npm test`, `npm run build`) passed.

## Next Phase Readiness
- The BLOCKER identified in `01-VERIFICATION.md` (Gap 1) and independently flagged as WR-01 in `01-REVIEW.md` is now closed at the code/unit-test level: Lenis's smooth-scroll is provably gated on `prefersReducedMotion` in all three tested scenarios (mount, StrictMode mount, mid-session toggle).
- Phase 1 re-verification should re-run `01-VERIFICATION.md`'s gap check against this fix and, if satisfied, decide whether to mark QUAL-01/QUAL-02 complete in `REQUIREMENTS.md` (deliberately left undecided by this plan).
- The deferred real-browser human-check (D5) remains the one open item before Phase 1 can be considered fully closed; it should be run against this fixed code, not the pre-fix code.

---
*Phase: 01-foundation-motion-infrastructure*
*Completed: 2026-07-24*

## Self-Check: PASSED

- FOUND: `src/motion/MotionProvider.tsx`
- FOUND: `src/motion/MotionProvider.test.tsx`
- FOUND: `.planning/phases/01-foundation-motion-infrastructure/01-07-SUMMARY.md`
- FOUND: commit `ac4e3ca` in git log
