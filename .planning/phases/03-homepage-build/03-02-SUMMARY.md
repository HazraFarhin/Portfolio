---
phase: 03-homepage-build
plan: 02
subsystem: ui
tags: [react, typescript, vitest, gsap, tailwind]

requires:
  - phase: 02-content-layer-case-study-template
    provides: "caseStudies loader (src/content/case-studies/loader.ts), CaseStudy/CaseStudyFrontmatter types, and reusable UI primitives (Button/Card/Typography/ImagePlaceholder)"
provides:
  - "SelectedWork.tsx: real 6-card grid from caseStudies + persistent See more/See less toggle appending 5 deferred coming-soon cards"
  - "src/content/selected-work.ts and src/content/case-studies/deferred.ts content modules"
  - "HowIWork.tsx: single section combining 6 Studio Method action-words + 5-step Operating Loop"
  - "src/content/how-i-work.ts content module"
affects: [03-07-homepage-assembly]

tech-stack:
  added: []
  patterns:
    - "Content-module-per-section pattern (mirrors src/content/hero.ts): copy lives in a typed .ts module, never hardcoded in JSX"
    - "Literal hardcoded JSX blocks with numbered comments (never .map()) for fixed-count/fixed-order content, mirroring Process.tsx's STAGE_DESCRIPTORS approach"
    - "Deferred-slug stub dataset pattern: a minimal DeferredCaseStudy[] array separate from the validated loader.ts pipeline, for content that has no .md source yet"

key-files:
  created:
    - src/content/selected-work.ts
    - src/content/case-studies/deferred.ts
    - src/components/home/SelectedWork.tsx
    - src/components/home/SelectedWork.test.tsx
    - src/content/how-i-work.ts
    - src/components/home/HowIWork.tsx
    - src/components/home/HowIWork.test.tsx
  modified: []

key-decisions:
  - "Selected Work and How I Work exported as named (not default) exports, matching Process.tsx/ImagePlaceholder.tsx precedent for reusable section components mounted by a parent route (Plan 03-07 will compose them into home.tsx)"
  - "Test click interactions use @testing-library/react's fireEvent instead of @testing-library/user-event, since user-event is not an installed dependency in this codebase and no existing test uses it"

patterns-established:
  - "See more/less toggle pattern: useState boolean gates a second .map() block appended into the same grid container, toggle button always rendered (never conditionally unmounted)"

requirements-completed: [HOME-03, HOME-04, HOME-05]

coverage:
  - id: D1
    description: "Selected Work renders exactly the 6 real case studies from caseStudies in IA order on initial render, with zero Coming soon labels"
    requirement: "HOME-03"
    verification:
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#renders exactly 6 real case-study cards, in caseStudies order, on initial render"
        status: pass
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#renders zero \"Coming soon\" labels on initial render"
        status: pass
    human_judgment: false
  - id: D2
    description: "Clicking See more reveals the 5 deferred coming-soon cards into the same grid; clicking again collapses to 6; toggle button persists in both states"
    requirement: "HOME-04"
    verification:
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#reveals exactly 5 deferred coming-soon cards when the toggle is clicked"
        status: pass
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#collapses back to 6 cards on a second toggle click, keeping the toggle button present"
        status: pass
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#the toggle label reads \"See more\" collapsed and \"See less\" expanded"
        status: pass
    human_judgment: false
  - id: D3
    description: "Selected Work never renders the superseded fictional Homepage Copy V2.md §07 project copy"
    requirement: "HOME-03"
    verification:
      - kind: unit
        ref: "src/components/home/SelectedWork.test.tsx#never renders any superseded fictional project title from Homepage Copy V2.md §07"
        status: pass
    human_judgment: false
  - id: D4
    description: "How I Work renders the 6 Studio Method action-words and the 5-step Operating Loop together inside one section, never split into two"
    requirement: "HOME-05"
    verification:
      - kind: unit
        ref: "src/components/home/HowIWork.test.tsx#renders a single <section id=\"how-i-work\"> containing all 6 action words"
        status: pass
      - kind: unit
        ref: "src/components/home/HowIWork.test.tsx#renders all 5 loop step names and descriptions inside the same section"
        status: pass
      - kind: unit
        ref: "src/components/home/HowIWork.test.tsx#renders exactly one section element (never split into two)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Visual verification that Selected Work and How I Work match the UI-SPEC's cinematic/glass-morphism direction once mounted on the live homepage"
    verification: []
    human_judgment: true
    rationale: "These are standalone components built ahead of Plan 03-07's home.tsx assembly -- there is no live page yet to screenshot; visual/motion review belongs to the phase-level UAT once all sections are mounted"

duration: 22min
completed: 2026-07-30
status: complete
---

# Phase 03 Plan 02: Selected Work + How I Work Summary

**Selected Work grid pulling the real 6 loader-sourced case studies with a stateful See more/See less toggle revealing 5 deferred coming-soon stubs, plus a combined How I Work section rendering both the Studio Method action-words and the 5-step Operating Loop in one section.**

## Performance

- **Duration:** 22 min
- **Started:** 2026-07-30T15:13:00Z
- **Completed:** 2026-07-30T15:35:00Z
- **Tasks:** 2
- **Files modified:** 7 (all created)

## Accomplishments
- Built `SelectedWork.tsx` consuming the real Phase 2 `caseStudies` loader export (zero hardcoded slugs) plus a new `deferredCaseStudies` stub dataset for the 5 not-yet-written case studies, composed into one grid behind a persistent toggle
- Built `HowIWork.tsx` combining the 6 Studio Method action-words and 5-step Operating Loop into a single `<section id="how-i-work">`, rendered via literal hardcoded JSX blocks (never `.map()`) per D-02
- Both sections wired to `useScrollReveal` and built entirely from existing `components/ui/` primitives, ready for Plan 03-07 to mount into `home.tsx`
- Fixed a blocking environment issue: this worktree's `node_modules` was empty (4KB, missing all dependencies) — ran `npm ci` to restore a working dependency tree before any test could execute

## Task Commits

Each task was committed atomically (TDD RED -> GREEN):

1. **Task 1: Selected Work — real 6 + deferred 5 toggle**
   - `4e0f422` test(03-02): add failing test for Selected Work real+deferred toggle
   - `e653f03` feat(03-02): implement Selected Work real 6 + deferred 5 toggle
2. **Task 2: How I Work — Studio Method + Operating Loop, combined**
   - `00da1a4` test(03-02): add failing test for How I Work combined section
   - `4e3eb0e` feat(03-02): implement How I Work combined Studio Method + Operating Loop

_Note: this worktree does not commit STATE.md/ROADMAP.md — the orchestrator owns those writes after all wave agents complete._

## Files Created/Modified
- `src/content/selected-work.ts` - Selected Work section copy (label/heading/supportingCopy/footnote/toggle labels), verbatim from Homepage Copy V2.md §07 minus the superseded fictional project blocks (D-08)
- `src/content/case-studies/deferred.ts` - `DeferredCaseStudy[]` stub dataset for the 5 case studies with no `.md` file yet, `[ASSUMED]`-flagged humanized titles (RESEARCH.md A1)
- `src/components/home/SelectedWork.tsx` - Grid of real 6 case-study Cards + conditionally-rendered 5 deferred Cards (each carrying a "Coming soon" `Label`), persistent toggle button (D-09)
- `src/components/home/SelectedWork.test.tsx` - 6 tests covering initial render, toggle expand/collapse, label text, and the D-08 fictional-copy prohibition
- `src/content/how-i-work.ts` - `HowIWorkContent` with 6 `actionWords` and 5 `loopSteps`, verbatim from Homepage Copy V2.md §03/§09
- `src/components/home/HowIWork.tsx` - Single section rendering both content beats via literal, index-based JSX (no `.map()` over the arrays)
- `src/components/home/HowIWork.test.tsx` - 6 tests covering content-module shape, single-section DOM structure, and full content presence

## Decisions Made
- Used named exports (`export function SelectedWork()` / `export function HowIWork()`) rather than default exports, matching the `Process.tsx`/`ImagePlaceholder.tsx` convention for reusable section components that a parent route composes — `home.tsx`'s own top-level route component is the only default export in this codebase's home-adjacent files
- Used `fireEvent` from `@testing-library/react` instead of `@testing-library/user-event` for the toggle-click tests, since `user-event` is not a project dependency and no other test file in the repo uses it — avoids introducing a new test dependency for a single interaction pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Restored missing worktree dependencies**
- **Found during:** Task 1, first test run attempt
- **Issue:** This worktree's `node_modules/` contained only Vite's internal cache directories (4KB total) — none of the project's actual npm dependencies (including `@gsap/react`, required by `useScrollReveal`) were installed, so every test run failed at module resolution before any test could execute
- **Fix:** Ran `npm ci` from the worktree root, which restored the full dependency tree (226 packages) from the existing `package-lock.json`
- **Files modified:** None tracked by git (`node_modules/` is gitignored); no `package.json`/`package-lock.json` changes
- **Verification:** `npm run test -- src/components/home/SelectedWork.test.tsx` resolved and ran successfully afterward
- **Committed in:** N/A (no git-tracked change; environment-only fix)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary to execute any test in this worktree; no scope creep, no code-level deviation from the plan's specified files or content.

## Issues Encountered
- Initial test for How I Work used a custom `getByText` text-matcher function that matched both a parent `<div>` and its child `<h3>` on `textContent` inclusion, causing a "multiple elements found" failure. Fixed by querying `h3` elements directly via `querySelectorAll('h3')` and asserting positional content — a test-authoring correction, not an implementation bug (committed as part of the Task 2 GREEN commit).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Both `SelectedWork` and `HowIWork` are self-contained, tested components ready for Plan 03-07 to import and mount into `home.tsx` alongside Hero and the other Wave 1 sections
- `SelectedWork.tsx`'s deferred-card hrefs (`/case-study/<deferred-slug>`) depend on Plan 03-04's `ComingSoonRoute` literal routes to resolve to real pages — until that plan lands, those hrefs point at Phase 2's generic `case-study.tsx` route, which already has a defensive "Case study not found" fallback for unknown slugs, so no broken/crashing state exists in the interim
- Full test suite (137 tests across 24 files) passes with zero regressions to Phase 1/2 tests

---
*Phase: 03-homepage-build*
*Completed: 2026-07-30*

## Self-Check: PASSED

All 8 claimed files found on disk; all 4 claimed task commit hashes (4e0f422, e653f03, 00da1a4, 4e3eb0e) found in git log.
