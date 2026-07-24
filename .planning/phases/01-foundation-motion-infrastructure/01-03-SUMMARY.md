---
phase: 01-foundation-motion-infrastructure
plan: 03
subsystem: infra
tags: [gsap, lenis, scrolltrigger, react-context, reduced-motion, vitest]

requires:
  - phase: 01-foundation-motion-infrastructure (01-02)
    provides: Vite+React+TS scaffold, Tailwind v4 tokens, Vitest+jsdom test harness
provides:
  - "usePrefersReducedMotion() hook -- matchMedia read at mount + live 'change' subscription"
  - "MotionProvider -- owns Lenis init, GSAP/ScrollTrigger plugin registration, single ticker-driven scroll loop, and the reduced-motion Context every future motion hook reads from"
  - "usePrefersReducedMotionContext() -- public accessor for consumers"
affects: [01-04, 01-05, 01-06]

tech-stack:
  added: []
  patterns:
    - "Single app-wide MotionProvider (D-10) as the sole matchMedia subscription and Lenis/GSAP bootstrap point -- no per-component reduced-motion checks"
    - "Lenis driven by gsap.ticker (autoRaf: false) instead of its own internal rAF loop, avoiding dual-loop scroll desync"
    - "gsap.registerPlugin(ScrollTrigger) at module scope (not component body/effect) so it only runs once per module load"

key-files:
  created:
    - src/motion/usePrefersReducedMotion.ts
    - src/motion/usePrefersReducedMotion.test.ts
    - src/motion/MotionProvider.tsx
    - src/motion/MotionProvider.test.tsx
  modified:
    - src/test/setup.ts

key-decisions:
  - "Added a default window.matchMedia stub to the global Vitest setup file (src/test/setup.ts) -- jsdom does not implement matchMedia, and GSAP's ScrollTrigger plugin calls it at module-scope registration time, before any per-test mock can be installed."
  - "StrictMode cleanup test verifies gsap.ticker's actual internal listener-list length (gsap.ticker._listeners) rather than raw add()/remove() call counts, because gsap's own ticker.add() implementation calls remove() internally as a dedup step -- making naive call-count symmetry a false signal."

patterns-established:
  - "Motion-hook tests mock window.matchMedia per-test via vi.stubGlobal, and mock the 'lenis' module's default export as a vi.fn().mockImplementation(function () {...}) constructor (arrow functions cannot be invoked via `new`)."

requirements-completed: [QUAL-01, QUAL-02]

coverage:
  - id: D1
    description: "usePrefersReducedMotion reads matchMedia synchronously at mount and reflects the OS reduced-motion setting on first render"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "src/motion/usePrefersReducedMotion.test.ts#returns true on first render when matchMedia.matches is true at mount"
        status: pass
      - kind: unit
        ref: "src/motion/usePrefersReducedMotion.test.ts#returns false on first render when matchMedia.matches is false at mount"
        status: pass
    human_judgment: false
  - id: D2
    description: "usePrefersReducedMotion updates live on a matchMedia 'change' event without requiring a remount, and cleans up its listener on unmount"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "src/motion/usePrefersReducedMotion.test.ts#updates to true after a change event fires with matches: true, without remount"
        status: pass
      - kind: unit
        ref: "src/motion/usePrefersReducedMotion.test.ts#removes the change listener from the MediaQueryList on unmount"
        status: pass
    human_judgment: false
  - id: D3
    description: "MotionProvider mounts cleanly around zero motion consumers with no ScrollTrigger instances created just by mounting"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#mounts with zero consumers without throwing and registers no ScrollTrigger instances"
        status: pass
    human_judgment: false
  - id: D4
    description: "MotionProvider sources its reduced-motion Context value from usePrefersReducedMotion (no duplicate matchMedia read)"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#sources its context value from usePrefersReducedMotion (no duplicate matchMedia read)"
        status: pass
    human_judgment: false
  - id: D5
    description: "MotionProvider instantiates Lenis with autoRaf: false and drives it via a single gsap.ticker.add callback"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#instantiates Lenis with autoRaf: false and drives it via gsap.ticker.add"
        status: pass
    human_judgment: false
  - id: D6
    description: "MotionProvider cleans up symmetrically under React StrictMode's phantom mount-unmount-mount cycle, leaving no leaked ticker callback or un-destroyed Lenis instance"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/motion/MotionProvider.test.tsx#cleans up symmetrically under StrictMode phantom mount-unmount-mount, leaving no leaked ticker/Lenis state"
        status: pass
    human_judgment: false
  - id: D7
    description: "Native scroll/keyboard/anchor-link behavior is preserved with Lenis mounted (Lenis wraps rather than replaces native scroll)"
    requirement: "QUAL-01"
    verification: []
    human_judgment: true
    rationale: "jsdom cannot simulate real scroll physics, keyboard scroll, or OS-level scroll behavior -- this requires a manual pass in a real browser once a scrollable route exists (flagged in 01-RESEARCH.md Validation Architecture as manual-only). No animated route/section exists yet in this plan to exercise; deferred to whichever later plan (01-05/01-06) first mounts MotionProvider around real scrollable content."

duration: 24min
completed: 2026-07-24
status: complete
---

# Phase 01 Plan 03: Motion Foundation (usePrefersReducedMotion + MotionProvider) Summary

**Single app-wide MotionProvider driving Lenis off gsap.ticker (autoRaf: false) with a centralized, live-updating prefers-reduced-motion Context, verified StrictMode-safe with zero orphaned ScrollTrigger/Lenis state.**

## Performance

- **Duration:** 24 min
- **Started:** 2026-07-24T04:47:49Z
- **Completed:** 2026-07-24T05:12:00Z
- **Tasks:** 2 completed
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments
- `usePrefersReducedMotion()` reads `matchMedia` synchronously at mount (no flash of wrong state) and stays live via a `'change'` subscription, cleaned up on unmount
- `MotionProvider` registers `ScrollTrigger` once at module scope, initializes Lenis with `autoRaf: false`, and drives it from `gsap.ticker.add` (single rAF loop, avoiding the Lenis/GSAP dual-loop desync pitfall documented in 01-RESEARCH.md)
- `MotionProvider` sources its reduced-motion Context value directly from `usePrefersReducedMotion` -- exactly one `matchMedia` subscription exists in the whole app, satisfying D-09/D-10
- Verified via test that React StrictMode's dev-only phantom mount-unmount-mount cycle leaves zero leaked `gsap.ticker` listeners and always calls `lenis.destroy()`

## Task Commits

Each task was committed atomically (TDD RED -> GREEN):

1. **Task 1: usePrefersReducedMotion hook**
   - `1b0e96f` - test(01-03): add failing test for usePrefersReducedMotion hook
   - `d860a37` - feat(01-03): implement usePrefersReducedMotion hook
2. **Task 2: MotionProvider (Lenis + GSAP/ScrollTrigger bootstrap + reduced-motion Context)**
   - `b31c042` - test(01-03): add failing test for MotionProvider
   - `15e5bd5` - feat(01-03): implement MotionProvider (Lenis + GSAP/ScrollTrigger bootstrap)

**Plan metadata:** committed separately per worktree parallel-execution protocol (STATE.md/ROADMAP.md updates owned by the orchestrator).

## Files Created/Modified
- `src/motion/usePrefersReducedMotion.ts` - matchMedia-backed hook, mount-time read + live `'change'` subscription
- `src/motion/usePrefersReducedMotion.test.ts` - 4 unit tests (initial true/false, live update, unmount cleanup)
- `src/motion/MotionProvider.tsx` - Lenis/GSAP/ScrollTrigger bootstrap provider + `usePrefersReducedMotionContext()`
- `src/motion/MotionProvider.test.tsx` - 4 unit/integration tests (empty mount, context sourcing, ticker wiring, StrictMode cleanup)
- `src/test/setup.ts` - added a default `window.matchMedia` stub (jsdom doesn't implement it; needed at module-load time for `ScrollTrigger.registerPlugin`)

## Decisions Made
- Reduced-motion detection lives in exactly one place (`usePrefersReducedMotion`, consumed internally by `MotionProvider`) per D-09/D-10 -- no future motion hook should re-implement its own `matchMedia` check.
- Global test-setup fix: added a default `matchMedia` stub in `src/test/setup.ts` rather than mocking it per-file, since GSAP's `ScrollTrigger` plugin reads `window.matchMedia` at module-scope registration time (i.e., at import time, before any test body or `beforeEach` runs). Per-test mocks (`vi.stubGlobal`) still override this default when a test needs specific `matches` values.
- StrictMode cleanup verification asserts on `gsap.ticker`'s actual internal listener-list length rather than raw `add`/`remove` call counts, because GSAP's own `ticker.add()` implementation calls `remove()` internally as a dedup safety step -- naive call-count symmetry would be a false leak signal.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Added default `window.matchMedia` stub to global test setup**
- **Found during:** Task 2 (MotionProvider test execution)
- **Issue:** `jsdom` does not implement `window.matchMedia`. `gsap.registerPlugin(ScrollTrigger)` at module scope calls `matchMedia` during its own registration (for its internal media-query-driven config), which runs at import time -- before any per-test `vi.stubGlobal('matchMedia', ...)` mock could be installed. Without a global default, importing `MotionProvider.tsx` in any test threw `TypeError: _win.matchMedia is not a function` before the test body even ran.
- **Fix:** Added a default `window.matchMedia` stub (returns `matches: false` with no-op listener methods) to `src/test/setup.ts`, guarded by `if (!window.matchMedia)` so it never overrides a real implementation. Individual tests continue to override it via `vi.stubGlobal` for specific `matches` values.
- **Files modified:** `src/test/setup.ts`
- **Verification:** `npx vitest run` -- both motion test files pass, full suite green.
- **Committed in:** `15e5bd5` (Task 2 GREEN commit)

**2. [Rule 1 - Bug] Fixed Lenis mock constructor and StrictMode leak assertion in test file**
- **Found during:** Task 2 (MotionProvider test execution)
- **Issue:** (a) The `vi.mock('lenis', ...)` factory initially used an arrow function for the mocked `Lenis` constructor -- arrow functions cannot be invoked via `new`, causing `TypeError: ... is not a constructor`. (b) The StrictMode cleanup test initially asserted `addSpy` and `removeSpy` call counts were equal, but GSAP's real `gsap.ticker.add()` implementation internally calls `this.remove(callback)` once as a dedup step before pushing -- so raw call counts are never 1:1 even in a correctly-cleaned-up component, making the original assertion a false positive/negative risk.
- **Fix:** (a) Changed the mock factory to use a named regular function (`function LenisMockImpl() {...}`) so `vi.fn().mockImplementation(...)` produces a valid constructor. (b) Rewrote the StrictMode assertion to snapshot `gsap.ticker._listeners.length` before mount and after unmount, asserting they're equal -- this directly verifies "no leaked listener remains" regardless of GSAP's internal dedup-remove implementation detail.
- **Files modified:** `src/motion/MotionProvider.test.tsx`
- **Verification:** `npx vitest run src/motion/MotionProvider.test.tsx` -- all 4 tests pass; `npx tsc -b --noEmit` clean.
- **Committed in:** `15e5bd5` (Task 2 GREEN commit, folded in as test-authoring fixes discovered during the same RED->GREEN cycle)

---

**Total deviations:** 2 auto-fixed (1 blocking test-infra gap, 1 bug in test authoring)
**Impact on plan:** Both fixes were necessary to get the plan's own specified tests passing correctly; no scope creep, no changes to the plan's required deliverables or their public API.

## Issues Encountered
- TypeScript flagged `tickerCallback(1, 0, 0, false)` in the ticker-wiring test -- GSAP's `TickerCallback` type signature is `(time, deltaTime, frame, elapsed: number)`, not a boolean 4th argument. Fixed by passing `0` instead of `false`; no production code affected.
- `oxlint` emits a non-blocking `warn`-level `react/only-export-components` notice on `MotionProvider.tsx` (the file exports both the `MotionProvider` component and the `usePrefersReducedMotionContext` hook/`ReducedMotionContext`). This is expected and intentional per 01-RESEARCH.md's recommended project structure (Context + Provider co-located in one file) and the project's `.oxlintrc.json` already sets this rule to `warn` (not `error`), so it does not fail lint or block the build.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `useScrollReveal()` (01-05-PLAN.md) can now be built directly on top of `usePrefersReducedMotionContext()` -- no additional `matchMedia` plumbing needed.
- `MotionProvider` is ready to wrap the app root once `main.tsx`/`router.tsx` exist (depends on whichever plan in this wave/next wave scaffolds routing) -- D7's manual scroll/keyboard/anchor UAT should be executed once a real scrollable route mounts `MotionProvider` around actual content, not before.
- No blockers for downstream plans in this phase.

---
*Phase: 01-foundation-motion-infrastructure*
*Completed: 2026-07-24*
