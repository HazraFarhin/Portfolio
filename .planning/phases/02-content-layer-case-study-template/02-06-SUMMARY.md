---
phase: 02-content-layer-case-study-template
plan: 6
subsystem: ui
tags: [react, vitest, testing-library, tdd]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plan 04)
    provides: ImagePlaceholder component
provides:
  - Process section component (5 fixed sub-stages, 3 with stage ImagePlaceholder slots)
  - ProcessStages TypeScript interface
affects: [02-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Hardcoded STAGE_DESCRIPTORS array (never Object.keys/Object.entries) guarantees exactly 5 stages in fixed order (T-02-10)"
    - "Label as=h3 for numbered eyebrow headings (01 — Discovery & Research, etc.) -- reusing Label-as-eyebrow pattern from Hero"
    - "Vertical flex column with gap-xl (32px) between all 5 stage blocks"

key-files:
  created:
    - src/components/case-study/Process.tsx
    - src/components/case-study/Process.test.tsx
  modified: []

key-decisions:
  - "Stage order and image-slot assignment are locked in a hardcoded STAGE_DESCRIPTORS constant, not derived from any runtime data -- guarantees structural invariant regardless of what stages prop contains"
  - "ProcessStages interface exported from Process.tsx (not schema.ts) since it describes the component's prop shape, which happens to match parse.ts's CaseStudyProcessStages for downstream passing convenience"
  - "No Card wrapper -- consistent with all non-Overview section components"

requirements-completed: []

coverage:
  - id: D1
    description: "Process always renders exactly 5 numbered eyebrow labels in fixed order, regardless of stage content"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/Process.test.tsx#renders exactly 5 numbered eyebrow labels in fixed order"
        status: pass
      - kind: unit
        ref: "src/components/case-study/Process.test.tsx#renders 5 stages even when all stage strings are empty"
        status: pass
    human_judgment: false
  - id: D2
    description: "Exactly 3 stage-sized ImagePlaceholder blocks at fixed positions (Discovery & Research, Ideate & Wireframe, Design & Prototype)"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/Process.test.tsx#renders exactly 3 stage-sized ImagePlaceholder blocks at fixed positions"
        status: pass
      - kind: unit
        ref: "src/components/case-study/Process.test.tsx#renders exactly 3 ImagePlaceholder blocks even with empty stage strings"
        status: pass
    human_judgment: false
  - id: D3
    description: "No native <img> element is ever rendered"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/Process.test.tsx#never renders a native <img> element"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 6: Process Section Component Summary

**Process section with hardcoded 5-sub-stage structure and exactly 3 fixed ImagePlaceholder slots, TDD.**

## Performance

- **Duration:** ~3 min
- **Completed:** 2026-07-26
- **Tasks:** 1
- **Files modified:** 2 (all newly created)

## Accomplishments
- `Process` component: renders an `h2` heading "Process" and exactly 5 sub-stages from a hardcoded `STAGE_DESCRIPTORS` array (never `Object.keys`), each with a numbered `Label` eyebrow `h3`, a `Body` paragraph, and (for 3 of the 5) a `stage`-sized `ImagePlaceholder`
- `ProcessStages` TypeScript interface exported for downstream Plan 02-09 consumption
- Exactly 3 image slots at fixed positions (Discovery & Research, Ideate & Wireframe, Design & Prototype) regardless of stage string content

## Task Commits

1. **Task 1: Process section component (TDD)**
   - `12340f1` - test(02-06): add failing tests for Process component (RED)
   - `ffc5360` - feat(02-06): implement Process section component (GREEN)

## Files Created/Modified
- `src/components/case-study/Process.tsx` - 5-stage hardcoded Process section with 3 ImagePlaceholder slots
- `src/components/case-study/Process.test.tsx` - 8 unit tests

## Self-Check: PASSED

Both files exist on disk. All 8 tests pass.
