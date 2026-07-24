---
phase: 01-foundation-motion-infrastructure
plan: 05
subsystem: infra
tags: [gsap, useGSAP, ScrollTrigger, react, vitest, motion]

requires:
  - phase: 01-foundation-motion-infrastructure (plan 03)
    provides: MotionProvider / usePrefersReducedMotionContext (reduced-motion Context source of truth)
provides:
  - useScrollReveal(ref, options) -- the public motion-authoring hook for scroll-triggered reveal animations
  - Vitest config fix for a real @gsap/react + Vite dual-module-instance hazard affecting any future test that asserts ScrollTrigger cleanup
affects: [01-06 (Hero section wiring useScrollReveal onto real content)]

tech-stack:
  added: []
  patterns:
    - "useScrollReveal built on @gsap/react's useGSAP({ scope, dependencies }) rather than a hand-rolled useEffect + gsap.context()"
    - "Vite resolve.alias pinning @gsap/react to its ESM src build to avoid dual gsap-core module instances under Vitest's Node/SSR-style resolution"

key-files:
  created:
    - src/motion/useScrollReveal.ts
    - src/motion/useScrollReveal.test.ts
  modified:
    - vite.config.ts

key-decisions:
  - "Widened useScrollReveal's ref parameter to RefObject<HTMLElement | null> (not RefObject<HTMLElement>) to match React 19's actual useRef(null) typing -- callers pass the ref useRef gives them with no cast"
  - "Aliased @gsap/react to its ESM src/index.js in vite.config.ts to fix a dual gsap module instance bug: @gsap/react's CJS dist build's require('gsap') resolves to gsap/dist/gsap.js (a separate bundled copy of gsap-core.js) while our own import gsap from 'gsap' resolves to gsap/index.js -- two separate private _context variables meant useGSAP's context-based revert never saw ScrollTrigger/tweens created via our import, silently leaking a ScrollTrigger instance on every unmount"

patterns-established:
  - "Any future motion hook built on useGSAP should rely on this same vite.config.ts alias; do not remove it without re-verifying ScrollTrigger cleanup under StrictMode"

requirements-completed: []

coverage:
  - id: D1
    description: "useScrollReveal(ref, options) registers a ScrollTrigger-driven gsap.from animation when motion is enabled, honoring custom y/duration/start options"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/motion/useScrollReveal.test.ts#registers a ScrollTrigger-driven gsap.from animation when motion is enabled"
        status: pass
      - kind: unit
        ref: "src/motion/useScrollReveal.test.ts#honors custom options for y/duration/start instead of the defaults"
        status: pass
    human_judgment: false
  - id: D2
    description: "useScrollReveal no-ops (zero ScrollTrigger instances) when the reduced-motion context is true"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "src/motion/useScrollReveal.test.ts#is a no-op (zero ScrollTrigger instances) when reduced motion is on"
        status: pass
    human_judgment: false
  - id: D3
    description: "Multiple useScrollReveal call sites observe an identical reduced-motion boolean regardless of mount order"
    verification:
      - kind: unit
        ref: "src/motion/useScrollReveal.test.ts#multiple call sites observe an identical reduced-motion value regardless of mount order"
        status: pass
    human_judgment: false
  - id: D4
    description: "Unmount, including React StrictMode's phantom mount-unmount-mount cycle, leaves zero orphaned ScrollTrigger instances"
    verification:
      - kind: unit
        ref: "src/motion/useScrollReveal.test.ts#unmount, including StrictMode phantom mount-unmount-mount, leaves zero orphaned ScrollTrigger instances"
        status: pass
    human_judgment: false

duration: 55min
completed: 2026-07-24
status: complete
---

# Phase 01 Plan 05: useScrollReveal Motion Hook Summary

**`useScrollReveal(ref, options)` built on `@gsap/react`'s `useGSAP()`, plus a fix for a real @gsap/react + Vite dual gsap-module-instance bug that was silently defeating StrictMode ScrollTrigger cleanup.**

## Performance

- **Duration:** ~55 min
- **Completed:** 2026-07-24T05:16:06Z
- **Tasks:** 2 (combined into one test file / one implementation, per plan's own Task 2 guidance that "no production-code change is required" if Task 1 scopes correctly)
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments

- `useScrollReveal(ref, options)` exported from `src/motion/useScrollReveal.ts`: reads `usePrefersReducedMotionContext()`, wraps `gsap.from(ref.current, { y, opacity: 0, duration, ease: 'power2.out', scrollTrigger: { trigger, start } })` in `useGSAP(callback, { scope: ref, dependencies: [prefersReducedMotion] })` -- no-ops entirely (zero ScrollTrigger instances) when reduced motion is active, honors custom `y`/`duration`/`start` options over the defaults (`32`/`0.8`/`'top 85%'`)
- 5 passing Vitest tests covering: enabled registration, reduced-motion no-op, custom options, multi-call-site context-read ordering, and unmount cleanup (including React StrictMode's phantom mount-unmount-mount cycle)
- Diagnosed and fixed a genuine `@gsap/react` + Vite dual-module-instance bug (not a test-authoring mistake) that was silently defeating `useGSAP`'s StrictMode cleanup guarantee -- see Deviations below

## Task Commits

Both tasks landed via the standard TDD RED/GREEN cycle (single test file covering both tasks' behaviors, since the plan itself notes Task 2 requires no separate production-code change when Task 1 is scoped correctly):

1. **Task 1 + Task 2: useScrollReveal implementation and full test coverage** -
   - `2e03339` (test) -- RED: all 5 behaviors (enabled/disabled/options/ordering/unmount) written against a no-op stub; 3 failed as expected
   - `8e7a265` (feat) -- GREEN: real implementation + the `vite.config.ts` dual-module fix; all 5 tests pass

**Plan metadata:** (this commit, docs: complete plan)

_Note: Task 2's own `<action>` explicitly anticipates "no production-code change is required if Task 1's implementation already scopes the useGSAP call correctly" -- that held true; the two tasks share one RED→GREEN cycle rather than two separate cycles._

## Files Created/Modified

- `src/motion/useScrollReveal.ts` - Exports `useScrollReveal(ref, options)`, the public motion-authoring hook every animated component uses to opt into scroll-driven reveal motion
- `src/motion/useScrollReveal.test.ts` - 5 Vitest tests: enabled registration, reduced-motion no-op, custom options, multi-call-site ordering, StrictMode unmount cleanup
- `vite.config.ts` - Added `resolve.alias` pinning `@gsap/react` to its ESM `src/index.js` build (see Deviations)

## Decisions Made

- Widened the hook's `ref` parameter type from the plan's literal `RefObject<HTMLElement>` to `RefObject<HTMLElement | null>` -- React 19's `useRef<T>(null)` genuinely types the ref as `RefObject<T | null>`, and the stricter plan-spec'd type failed `tsc -b` for every real call site (a `useRef(null)` ref, exactly what callers naturally pass). This is the actually-correct type for a ref that starts out null before the DOM node mounts.
- Fixed the `@gsap/react` + Vite dual-module-instance hazard by aliasing `@gsap/react` to its ESM `src/index.js` build rather than any test-local workaround, so every future motion hook/component built on `useGSAP` in this app benefits from the same fix without needing to know about it.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] `RefObject<HTMLElement>` type too strict for React 19's `useRef(null)`**
- **Found during:** Build verification after Task 1's GREEN implementation
- **Issue:** `tsc -b` failed with `Type 'HTMLDivElement | null' is not assignable to type 'HTMLElement'` at every real call site in the test harness, because React 19 types `useRef<T>(null)` as `RefObject<T | null>`, not `RefObject<T>`
- **Fix:** Changed the exported signature to `ref: RefObject<HTMLElement | null>`
- **Files modified:** `src/motion/useScrollReveal.ts`
- **Verification:** `npm run build` (tsc -b && vite build) passes
- **Committed in:** `8e7a265`

**2. [Rule 3 - Blocking] `@gsap/react` + Vite dual gsap-module-instance hazard silently defeating StrictMode cleanup**
- **Found during:** Task 2's StrictMode unmount-cleanup test -- the test failed with `ScrollTrigger.getAll().length` staying at `2` (never dropping to `0`) after `unmount()`, even though the raw `gsap.context()` mechanism (verified independently, no `@gsap/react` involved) correctly reverted and removed ScrollTrigger instances
- **Issue:** `@gsap/react`'s package.json declares both a CJS `main` (`dist/index.js`) and an ESM `module` (`src/index.js`) entry. Under Vitest's Node/SSR-style dependency resolution, the CJS `dist/index.js` was the one actually loaded, and its internal `require('gsap')` resolves via Node's `"require"` export condition to `gsap/dist/gsap.js` -- a fully self-contained, separately-bundled copy of `gsap-core.js` (verified by diffing entry files; `dist/gsap.js` inlines its own core internals rather than importing `./gsap-core.js`). Meanwhile our own `import gsap from 'gsap'` (and the app's `MotionProvider.tsx`) resolves via the `"import"` condition to `gsap/index.js` -- the "real" `gsap-core.js`. Two module instances means two separate private `_context` closure variables inside `gsap-core.js`, so `useGSAP`'s `gsap.context()`-based auto-revert (called on unmount, including StrictMode's phantom cycle) was reverting a context that never actually tracked the `ScrollTrigger`/tween our code created via the *other* `gsap` instance -- a silent no-op that would have shipped a real production memory leak (every scroll-revealed component leaking one `ScrollTrigger` instance per mount/remount) had it gone unnoticed.
- **Fix:** Added `resolve.alias` in `vite.config.ts` pinning the `@gsap/react` specifier directly to its ESM `src/index.js` file, forcing it (and every module it imports, including `gsap`) through Vite's own unified resolution rather than Node's native CJS/ESM dual-condition resolution. Verified via direct instrumentation (patching `gsap.context()` and comparing `Context` constructor identity) before and after the fix: before, `raw ctx proto === react ctx proto?` was `false` and `ScrollTrigger.getAll().length` stayed nonzero after `context.revert()`; after, they matched and post-unmount count reliably hit `0`.
- **Files modified:** `vite.config.ts`
- **Verification:** All 5 `useScrollReveal` tests pass (including the StrictMode unmount test); full suite (`npx vitest run`) reports 27/27 passing across 6 files; `npm run build` passes
- **Committed in:** `8e7a265`

---

**Total deviations:** 2 auto-fixed (1 type/build-blocking bug, 1 infrastructure-level blocking issue with real production-correctness implications)
**Impact on plan:** Both fixes were necessary to reach the plan's own stated acceptance criteria (`npx vitest run src/motion/useScrollReveal.test.ts` exits 0 with 5 passing tests, `npm run build` implicitly required for any real usage). No scope creep -- the `vite.config.ts` fix is scoped to exactly the `@gsap/react` resolution path this plan's own `useGSAP` usage depends on.

## Issues Encountered

None beyond the two deviations documented above, both fully resolved with all tests and build green.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `useScrollReveal(ref, options)` is ready for 01-06's Hero section to consume directly, proving the phase's success criterion #2 (real scroll-triggered reveal motion) end-to-end
- The `vite.config.ts` `@gsap/react` alias is now in place app-wide; any future component built on `useGSAP` inherits correct StrictMode cleanup automatically -- no per-component workaround needed
- No blockers for 01-06

---
*Phase: 01-foundation-motion-infrastructure*
*Completed: 2026-07-24*
