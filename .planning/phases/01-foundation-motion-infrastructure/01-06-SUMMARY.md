---
phase: 01-foundation-motion-infrastructure
plan: 06
subsystem: ui
tags: [react, react-router, gsap, lenis, tailwind, vitest]

requires:
  - phase: 01-foundation-motion-infrastructure (01-03)
    provides: MotionProvider (Lenis + GSAP ScrollTrigger, reduced-motion context)
  - phase: 01-foundation-motion-infrastructure (01-04)
    provides: components/ui/ primitives (Button, Card, Typography)
  - phase: 01-foundation-motion-infrastructure (01-05)
    provides: useScrollReveal hook
provides:
  - src/content/hero.ts (verbatim Hero copy data module)
  - src/router.tsx (React Router Data Mode route tree, home route + reserved /case-study/:slug shape)
  - src/routes/home.tsx (Home route rendering the Hero composed from components/ui/ + useScrollReveal)
  - src/main.tsx / src/App.tsx finalized as the real app entrypoint (StrictMode -> MotionProvider -> RouterProvider)
affects: [02-case-studies, 03-homepage-assembly]

tech-stack:
  added: []
  patterns:
    - "Content data modules under src/content/*.ts, consumed by field reference in routes -- never re-typed copy in JSX"
    - "React Router Data Mode (createBrowserRouter from 'react-router', RouterProvider from 'react-router/dom')"
    - "Route components call useScrollReveal(ref) directly on their own root ref -- no per-component matchMedia checks"

key-files:
  created:
    - src/content/hero.ts
    - src/router.tsx
    - src/routes/home.tsx
    - src/routes/home.test.tsx
  modified:
    - src/main.tsx
    - src/App.tsx

key-decisions:
  - "heroContent.ctaHref set to '#hero' (self-referential in-page anchor) rather than a dead href, since Phase 1 ships Hero-only and there is no Selected Work section yet -- Phase 3 repoints this same field to '#selected-work'"
  - "npm ci run to materialize node_modules in this worktree (package.json/package-lock.json already declared @gsap/react, gsap, lenis, react-router etc. from prior waves -- no new packages added, existing lockfile only)"

patterns-established:
  - "Pattern: Hero-style route composition -- root ref + useScrollReveal(ref) + components/ui/ primitives + a content/*.ts data module, no inline copy in JSX"

requirements-completed: []

coverage:
  - id: D1
    description: "Hero content module (src/content/hero.ts) exports HeroContent + heroContent with copy verbatim from Homepage Copy V2.md §02"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "grep -c 'Hazra designs solution oriented interfaces' src/content/hero.ts (=1), grep -c 'View Selected Work' (=1), grep -c 'Remote · CET to GST overlap · Available for new work' (=1)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Home route composes the Hero entirely from components/ui/ primitives and heroContent (no hardcoded copy, no ad-hoc CTA element), calls useScrollReveal(heroRef) on the section root"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/routes/home.test.tsx#renders the eyebrow, statement, CTA, and meta card copy from heroContent"
        status: pass
      - kind: unit
        ref: "src/routes/home.test.tsx#gives the Hero section root an id=\"hero\" matching the CTA href target"
        status: pass
      - kind: unit
        ref: "src/routes/home.test.tsx#composes the CTA via the Button primitive, not a raw ad-hoc anchor"
        status: pass
      - kind: unit
        ref: "src/routes/home.test.tsx#constrains the statement paragraph to a max-width with no truncation classes"
        status: pass
    human_judgment: false
  - id: D3
    description: "React Router Data Mode route tree renders the home route at / and reserves the /case-study/:slug shape as a comment for Phase 2"
    verification:
      - kind: unit
        ref: "grep -n \"createBrowserRouter.*'react-router'\" src/router.tsx; grep -n 'case-study/:slug' src/router.tsx"
        status: pass
    human_judgment: false
  - id: D4
    description: "App entrypoint finalized: StrictMode -> MotionProvider -> RouterProvider(router); App.tsx renders Outlet from react-router; full build and full test suite (7 files, 31 tests) both exit 0"
    verification:
      - kind: integration
        ref: "npm run build (exit 0), npm test (7 test files, 31 tests passed)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Real-browser manual check: keyboard focus order on the CTA anchor, click-to-scroll behavior of the #hero anchor, and OS-level prefers-reduced-motion toggle behavior (reveal suppressed with content visible when reduced, reveal plays when not) -- QUAL-01's native-scroll/keyboard clause and QUAL-02's full 'sees all non-essential motion disabled automatically' clause"
    verification: []
    human_judgment: true
    rationale: "jsdom cannot simulate real scroll physics, OS-level prefers-reduced-motion toggling, or real browser keyboard focus/tab order. Per this project's workflow.human_verify_mode: end-of-phase config and 01-VALIDATION.md's Manual-Only Verifications table, this check is deferred to the phase-level UAT harvest, not fabricated by this execution agent. The task's <verify><human-check> block in 01-06-PLAN.md documents the exact steps for that later verification pass."

duration: 22min
completed: 2026-07-24
status: complete
---

# Phase 01 Plan 06: Homepage Hero Capstone Integration Summary

**Real, running Hero route at `/` composing verbatim Homepage Copy V2.md content through components/ui/ primitives, GSAP+Lenis scroll-reveal motion, and a React Router Data Mode tree that reserves Phase 2's case-study route shape.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-07-24T10:50:00+05:30
- **Completed:** 2026-07-24T10:52:44+05:30
- **Tasks:** 3
- **Files modified:** 6 (4 created, 2 modified)

## Accomplishments
- `src/content/hero.ts` holds the Hero's verbatim copy (eyebrow, statement, CTA label/href, meta description, meta status) as a typed data module -- no copy duplicated inline in JSX
- `src/routes/home.tsx` composes the Hero entirely from the `components/ui/` primitives (`Label`, `Body`, `Button`, `Card`) built in 01-04, wired to `useScrollReveal` from 01-05 on the section's own root ref
- `src/router.tsx` establishes the React Router v8 Data Mode route tree (`createBrowserRouter` from `'react-router'`), rendering the home route at `/` and reserving the `/case-study/:slug` shape as a documented comment for Phase 2
- `src/main.tsx` / `src/App.tsx` finalized as the real app entrypoint: `StrictMode -> MotionProvider -> RouterProvider`, `App` rendering `Outlet`
- `npm run build` and the full `npm test` suite (7 test files, 31 tests, including this plan's 4 new Home route tests) both exit 0

## Task Commits

Each task was committed atomically:

1. **Task 1: Hero content module (D-05 verbatim copy)** - `67d1e1c` (feat)
2. **Task 2: Router (Data Mode) + Home route Hero composition** - `9b1eca2` (test, RED) then `58e58b5` (feat, GREEN)
3. **Task 3: Finalize app entrypoint** - `a6fa36a` (feat)

_Note: Task 2 was TDD (`tdd="true"`) -- test committed first and confirmed failing (missing `./home` module), then the implementation committed after all 4 behavior tests passed. No refactor commit was needed; the implementation was already clean on first pass._

## Files Created/Modified
- `src/content/hero.ts` - `HeroContent` interface + `heroContent` verbatim copy data
- `src/router.tsx` - `createBrowserRouter` Data Mode route tree; home route + reserved `/case-study/:slug` comment
- `src/routes/home.tsx` - `HomeRoute` composing the Hero from `components/ui/` + `heroContent` + `useScrollReveal`
- `src/routes/home.test.tsx` - 4 behavior tests for the Home route Hero composition
- `src/main.tsx` - finalized entrypoint: `StrictMode -> MotionProvider -> RouterProvider`
- `src/App.tsx` - finalized root layout: renders `Outlet` from `'react-router'`

## Decisions Made
- `heroContent.ctaHref` set to the self-referential `'#hero'` anchor rather than a dead placeholder href, matching the plan's Claude's Discretion note (Phase 1 ships Hero-only per D-06; Phase 3 repoints this field to `'#selected-work'`)
- Ran `npm ci` to materialize `node_modules` in this worktree -- all packages were already declared in `package.json`/`package-lock.json` by prior-wave plans (01-01 through 01-05); no new packages were added or substituted, this only fulfilled the existing lockfile (Rule 3, not the package-install exclusion, since no new/unverified package name was introduced)

## Deviations from Plan

None - plan executed exactly as written. The only environment action taken (`npm ci`) was fulfilling dependencies already declared and locked by prior plans in this phase, not adding new ones, and is documented above as a decision rather than a deviation.

## Issues Encountered
- This worktree's `node_modules` was not yet materialized (only `.vite` cache directories present) when Task 2's test was first run, causing an unrelated-looking "Failed to resolve import '@gsap/react'" error. Resolved by running `npm ci` against the existing `package-lock.json` (no new dependencies), then re-running the test, which passed as expected.

## User Setup Required

None - no external service configuration required.

## Requirements Traceability Note (QUAL-01 / QUAL-02)

This plan's frontmatter tags `requirements: [QUAL-01, QUAL-02]`, and this is the genuine capstone integration point for both. However, per the deferral pattern already established in this phase (and the correction applied to 01-03/01-04's premature self-marking), `.planning/REQUIREMENTS.md`'s checkbox/traceability rows for QUAL-01 and QUAL-02 are **NOT** being marked complete by this plan or this SUMMARY. Automated coverage delivered here (D1-D4 above) proves:
- QUAL-02 (data-driven copy, no hardcoded literals): fully verified automatically.
- QUAL-01 (motion doesn't break native scroll/keyboard nav) and the remainder of QUAL-02 (OS-level reduced-motion auto-disable, observed live): depend on the real-browser `<human-check>` in Task 3, which has not yet been performed by a human and cannot be simulated in jsdom (see D5's `human_judgment: true` entry and rationale). That confirmation belongs to the phase's `verify_phase_goal` / UAT step, not to this plan's own commit.

## Next Phase Readiness
- The Hero route is fully wired end-to-end: real content, real primitives, real motion, real routing -- proving all four prior-wave plans (01-02 through 01-05) compose correctly together, not just in isolation.
- Phase 2 can add the `/case-study/:slug` route as a sibling in `src/router.tsx`'s reserved comment without restructuring the route tree.
- Phase 3 can add the remaining homepage sections as siblings within `HomeRoute` (or split into further route-level composition) and repoint `heroContent.ctaHref` to `'#selected-work'` once that section exists.
- Blocker/concern carried forward: Task 3's real-browser `<human-check>` (keyboard focus order, CTA anchor scroll, OS-level `prefers-reduced-motion` toggle) is outstanding and must be completed as part of end-of-phase UAT before QUAL-01/QUAL-02 can be marked complete in REQUIREMENTS.md.

---
*Phase: 01-foundation-motion-infrastructure*
*Completed: 2026-07-24*
