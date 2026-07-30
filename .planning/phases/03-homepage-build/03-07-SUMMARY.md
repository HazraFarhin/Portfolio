---
phase: 03-homepage-build
plan: 07
subsystem: ui
tags: [react, react-router, homepage, routing, composition]

# Dependency graph
requires:
  - phase: 03-homepage-build (Plans 01, 02, 03, 04, 06)
    provides: "Nav, ProofStrip, SelectedWork, FieldArchive, HowIWork, SkillsTools, About, Footer components, each already owning its own root section (or nav) element"
provides:
  - "Complete, live homepage route (src/routes/home.tsx) composing Nav + Hero + all 7 remaining IA-locked sections in exact locked order"
  - "Hero CTA repointed from the Phase-1 placeholder #hero anchor to the real #selected-work section id"
  - "Composition-order test coverage confirming nav precedes 8 sections in exact IA order"
affects: [phase-04-deployment, phase-04-launch-polish]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "home.tsx composes section components as plain siblings via a React Fragment (no extra DOM wrapper); each section component owns its own root <section>/<nav> element -- home.tsx introduces zero new section wrapping markup"

key-files:
  created: []
  modified:
    - src/routes/home.tsx
    - src/content/hero.ts
    - src/routes/home.test.tsx

key-decisions:
  - "Wrapped Nav + Hero + 7 sections in a React Fragment (<>...</>) rather than a new wrapping <div>/<section>, since the acceptance criteria required home.tsx itself to introduce zero new <section> elements"
  - "Ran `npm ci` to populate this worktree's empty node_modules (package.json/package-lock.json already declared @gsap/react and other deps; this was dependency installation from the existing lockfile, not adding a new/unverified package) so the test suite could execute (Rule 3 -- blocking issue, package already vetted in lockfile)"

requirements-completed: [HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, CONT-04]

coverage:
  - id: D1
    description: "home.tsx mounts a persistent Nav plus all 8 IA-locked sections (Hero, Proof Strip, Selected Work, Field Archive, How I Work, Skills & Tools, About, Contact/Footer) in exact locked document order, with zero new <section> wrapper markup introduced by home.tsx itself"
    requirement: "HOME-02"
    verification:
      - kind: unit
        ref: "src/routes/home.test.tsx#mounts a persistent Nav above all 8 sections, in exact locked IA order"
        status: pass
    human_judgment: false
  - id: D2
    description: "Hero's primary CTA href is repointed from the Phase-1 placeholder #hero anchor to the real #selected-work section id"
    requirement: "HOME-01"
    verification:
      - kind: unit
        ref: "src/routes/home.test.tsx#gives the Hero section root an id=\"hero\", with the CTA href pointing at the real Selected Work section"
        status: pass
    human_judgment: false
  - id: D3
    description: "Nav bar mounts only inside home.tsx (via HomeRoute), never on /case-study/:slug routes"
    verification:
      - kind: other
        ref: "src/router.tsx unmodified by this plan; CaseStudyPage route tree has no Nav import (manual code inspection)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Full homepage scroll order visually confirmed correct top-to-bottom in a real browser"
    verification: []
    human_judgment: true
    rationale: "Requires visual/interactive confirmation in an actual browser (VALIDATION.md backstop item) -- automated DOM-order assertions (D1) prove structural correctness but not visual rendering, spacing, or perceived scroll flow"

# Metrics
duration: 20min
completed: 2026-07-30
status: complete
---

# Phase 3 Plan 07: Homepage Wiring Summary

**Wired Nav + all 7 remaining homepage sections (Proof Strip, Selected Work, Field Archive, How I Work, Skills & Tools, About, Footer) into the live `/` route as siblings of Hero in locked IA order, and repointed the Hero CTA from the Phase-1 placeholder `#hero` anchor to the real `#selected-work` section.**

## Performance

- **Duration:** 20 min
- **Started:** 2026-07-30T16:02:01+05:30
- **Completed:** 2026-07-30T16:05:55+05:30
- **Tasks:** 2
- **Files modified:** 3

## Accomplishments
- `src/routes/home.tsx` now composes `<Nav />`, the existing Hero, and `<ProofStrip />`, `<SelectedWork />`, `<FieldArchive />`, `<HowIWork />`, `<SkillsTools />`, `<About />`, `<Footer />` as plain siblings inside a Fragment, in exact locked IA order, with zero new `<section>` wrappers introduced by the route file itself
- `heroContent.ctaHref` repointed from `#hero` to `#selected-work`, resolving HOME-01's remaining fix (RESEARCH.md Pitfall 1) -- the Hero CTA now navigates to the real Selected Work section instead of a self-referential placeholder anchor
- `home.test.tsx`'s stale `toBe('#hero')` assertion corrected to `#selected-work`, and a new composition-order test confirms the persistent `<nav>` precedes all 8 `<section>` elements, whose ids appear in exact locked order: `hero, proof-strip, selected-work, field-archive, how-i-work, skills-tools, about, contact-footer`
- Full test suite (32 files, 191 tests) passes; `npm run build` succeeds with zero TypeScript errors across the fully composed route tree

## Task Commits

Each task was committed atomically:

1. **Task 1: Mount Nav + all 7 sections into home.tsx, repoint heroContent.ctaHref** - `d8ca3f1` (feat)
2. **Task 2: Update home.test.tsx -- fix stale ctaHref assertion, add composition-order assertions** - `d035875` (test)

**Plan metadata:** committed separately (SUMMARY.md, per worktree convention)

## Files Created/Modified
- `src/routes/home.tsx` - Now imports and renders Nav plus all 7 remaining homepage section components as siblings of the existing Hero, in locked IA order, inside a Fragment (no new wrapping element)
- `src/content/hero.ts` - `ctaHref` changed from `'#hero'` to `'#selected-work'`; stale Phase-1 "Hero-only" comment replaced with a note about the Phase-3 repoint
- `src/routes/home.test.tsx` - Corrected the hardcoded `'#hero'` assertion to `'#selected-work'`; added a new test asserting nav-before-sections ordering and the exact 8-section id sequence

## Decisions Made
- Used a React Fragment (`<>...</>`) to wrap Nav + Hero + 7 sections rather than any new `<div>`/`<section>` element, satisfying the acceptance criterion that `home.tsx` itself introduces zero new `<section>` wrappers (`grep -c '<section' src/routes/home.tsx` returns exactly 1, the pre-existing Hero section)
- Ran `npm ci` to populate this worktree's node_modules (previously empty aside from a `.vite` cache dir) since `package.json`/`package-lock.json` already declared all dependencies including `@gsap/react` -- this is standard dependency installation from an existing, committed lockfile, not introducing a new or unverified package, so it did not require a `checkpoint:human-verify` gate per the package-manager-install exclusion in Rule 3

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Worktree node_modules was empty; installed dependencies from the existing lockfile**
- **Found during:** Task 1 verification (`npm run test -- src/routes/home.test.tsx`)
- **Issue:** The worktree's `node_modules/` contained only a stray `.vite` cache directory -- no packages were installed, so `useScrollReveal.ts`'s `@gsap/react` import failed to resolve, blocking all test execution
- **Fix:** Ran `npm ci`, which installed exactly the 226 packages already pinned in the committed `package-lock.json` (no new package names, no version changes)
- **Files modified:** none tracked by git (`node_modules/` is gitignored)
- **Verification:** `npm run test -- src/routes/home.test.tsx` then executed successfully
- **Committed in:** n/a (gitignored, not committed)

---

**Total deviations:** 1 auto-fixed (1 blocking, package-manager-install exclusion did not apply since no new/unverified package was introduced -- only installing already-locked dependencies)
**Impact on plan:** Necessary to make the verification environment usable; no scope creep, no code behavior change.

## Issues Encountered
- Task 1's own verify step (`npm run test -- src/routes/home.test.tsx`) intentionally still failed on 1 of 4 pre-existing assertions after Task 1 alone (the stale `toBe('#hero')` line) -- this was expected per the plan's task split (Task 2 owns the test-file fix) and is not a defect; Task 2's follow-up commit brought the file to 5/5 passing.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- The homepage is now a single, complete, scrollable page presenting Hero -> Proof Strip -> Selected Work -> Field Archive -> How I Work -> Skills & Tools -> About -> Contact/Footer, with a persistent Nav, matching UI-SPEC's locked composition -- Phase 3's core deliverable is structurally and behaviorally complete
- Manual, real-browser scroll-order confirmation (VALIDATION.md backstop item, coverage D4) remains outstanding and requires human judgment -- flagged as `human_judgment: true` in this SUMMARY's coverage block for the verifier/UAT step to route to a human
- Phase 4 (deployment/launch) inherits the STATE.md-carried MUST-DO: the 5 deferred case-study "see more" links currently route to a coming-soon page and must be removed/guarded as part of Phase 4's own DEPL-03 work

---
*Phase: 03-homepage-build*
*Completed: 2026-07-30*

## Self-Check: PASSED

- FOUND: src/routes/home.tsx
- FOUND: src/content/hero.ts
- FOUND: src/routes/home.test.tsx
- FOUND: .planning/phases/03-homepage-build/03-07-SUMMARY.md
- FOUND commit: d8ca3f1 (Task 1)
- FOUND commit: d035875 (Task 2)
