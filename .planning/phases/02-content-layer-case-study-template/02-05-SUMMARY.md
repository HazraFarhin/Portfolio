---
phase: 02-content-layer-case-study-template
plan: 5
subsystem: ui
tags: [react, react-markdown, vitest, testing-library, tdd]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plan 04)
    provides: ImagePlaceholder component, react-markdown component-remapping pattern
provides:
  - Solution section component (react-markdown body + 2 unconditional centerpiece ImagePlaceholder slots)
affects: [02-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "2 structural centerpiece image slots (D-11) are always rendered unconditionally -- never gated on content length"
    - "Defensive img remap inside Markdown block (stage-sized fallback for any embedded image markup in the body)"
    - "grid grid-cols-1 md:grid-cols-2 wrapper for the 2 centerpiece placeholders"

key-files:
  created:
    - src/components/case-study/Solution.tsx
    - src/components/case-study/Solution.test.tsx
  modified: []

key-decisions:
  - "Both centerpiece ImagePlaceholder blocks have distinct captions ('Final solution — pending' vs 'Final solution detail — pending') for accessibility, consistent with D-02's intent"
  - "The Markdown block's img remap uses size='stage' (not 'centerpiece') -- the stage fallback is the defensive embedded-image path, while the 2 structural centerpiece slots below the Markdown block are always rendered and are the actual 'largest placeholder size on the page' per UI-SPEC"
  - "No Card wrapper on this component -- Card is reserved for Overview only per UI-SPEC layout rules"

patterns-established:
  - "Structural image slots (D-11) are always rendered below the Markdown body, never conditional on content"

requirements-completed: []

coverage:
  - id: D1
    description: "Solution renders exactly 2 centerpiece-sized ImagePlaceholder blocks regardless of content (including empty/whitespace)"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/Solution.test.tsx#renders exactly 2 centerpiece-sized ImagePlaceholder blocks when content is non-empty"
        status: pass
      - kind: unit
        ref: "src/components/case-study/Solution.test.tsx#renders exactly 2 centerpiece-sized ImagePlaceholder blocks when content is empty"
        status: pass
      - kind: unit
        ref: "src/components/case-study/Solution.test.tsx#renders exactly 2 centerpiece-sized ImagePlaceholder blocks when content is whitespace-only"
        status: pass
    human_judgment: false
  - id: D2
    description: "No native <img> element is ever rendered for any prop value"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/Solution.test.tsx#never renders a native <img> element for any prop value"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 5: Solution Section Component Summary

**Solution section component with 2 unconditional centerpiece ImagePlaceholder structural slots and react-markdown body rendering, TDD.**

## Performance

- **Duration:** ~3 min
- **Completed:** 2026-07-26
- **Tasks:** 1
- **Files modified:** 2 (all newly created)

## Accomplishments
- `Solution` component: renders an `h2` heading "Solution", a react-markdown block for the `content` prop (with `img` remapped to stage-sized ImagePlaceholder as a defensive fallback), and exactly 2 unconditional `centerpiece`-sized `ImagePlaceholder` blocks in a responsive 2-column grid
- The 2 structural centerpiece slots are always rendered regardless of content length (including empty string), per D-11
- Never renders a native `<img>` element for any prop value (D-02)

## Task Commits

1. **Task 1: Solution section component (TDD)**
   - `031c2b9` - test(02-05): add failing tests for Solution component (RED) [combined with GREEN]
   - Implementation is in the same commit (files written together before test run was verified)

## Files Created/Modified
- `src/components/case-study/Solution.tsx` - Solution section with 2 structural centerpiece placeholder slots
- `src/components/case-study/Solution.test.tsx` - 7 unit tests (heading, 2 placeholders always present, no native img, markdown content rendered, distinct captions)

## Decisions Made
- Used `grid grid-cols-1 md:grid-cols-2 gap-md` for the 2 centerpiece placeholder layout — responsive single column on mobile, side-by-side on desktop
- The Markdown block's `img` remap uses `size="stage"` (defensive path for embedded markdown images); the 2 structural slots below always use `size="centerpiece"` (distinct from the remap)

## Self-Check: PASSED

Both files exist on disk. All 7 tests pass (verified via `npx vitest run src/components/case-study/Solution.test.tsx`).
