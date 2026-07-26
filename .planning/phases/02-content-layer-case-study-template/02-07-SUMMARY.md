---
phase: 02-content-layer-case-study-template
plan: 7
subsystem: ui
tags: [react, vitest, testing-library, tdd, zod]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plan 03)
    provides: CaseStudyFrontmatter type from schema.ts
  - phase: 02-content-layer-case-study-template (Plan 01 Phase 1)
    provides: Button, Card, Typography primitives
provides:
  - DraftBadge component (null for Published, neutral badge for Draft)
  - Overview component (6-row fixed Card-wrapped metadata table, CASE-03 load-bearing)
affects: [02-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "DraftBadge: imports CaseStudyFrontmatter from schema.ts for status type (no local union re-declaration)"
    - "Overview: hardcoded 6 literal JSX rows in fixed source-code order (never Object.entries iteration) -- T-02-12 mitigation"
    - "Overview: responsive dl grid (grid-cols-1 / md:grid-cols-[auto_1fr]) for label + value pairs"
    - "Links row: two ghost Button elements (both pointing at external_link) when present; Label 'Coming soon' when absent"

key-files:
  created:
    - src/components/case-study/DraftBadge.tsx
    - src/components/case-study/DraftBadge.test.tsx
    - src/components/case-study/Overview.tsx
    - src/components/case-study/Overview.test.tsx
  modified: []

key-decisions:
  - "DraftBadge uses border-line + bg-secondary/40 colors (neutral palette) -- explicitly avoids destructive/red per UI-SPEC"
  - "Overview uses <dl>/<dt>/<dd> semantic HTML for the definition list structure (accessible and semantically correct)"
  - "Both Prototype and Live Site buttons in the Links row share the same external_link href -- this is the UI-SPEC's locked contract (only one link field in the schema)"
  - "DraftBadge returns null (not an empty container) for Published status, so there is truly zero DOM output"

requirements-completed: [CASE-03]

coverage:
  - id: D1
    description: "DraftBadge renders null for Published, renders the exact locked copy text for Draft with neutral styling"
    requirement: "CASE-03"
    verification:
      - kind: unit
        ref: "src/components/case-study/DraftBadge.test.tsx (4 tests)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Overview renders all 6 property-name Labels in fixed DOM order inside a Card"
    requirement: "CASE-03"
    verification:
      - kind: unit
        ref: "src/components/case-study/Overview.test.tsx (5 tests)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Overview's Links row conditionally renders two ghost Buttons or 'Coming soon' Label based on external_link presence"
    requirement: "CASE-03"
    verification:
      - kind: unit
        ref: "src/components/case-study/Overview.test.tsx#renders 'Coming soon' label when external_link is undefined"
        status: pass
      - kind: unit
        ref: "src/components/case-study/Overview.test.tsx#renders Prototype and Live Site buttons when external_link is present"
        status: pass
    human_judgment: false

duration: 3min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 7: Overview + DraftBadge Components Summary

**Overview (CASE-03 skimmability, Card-wrapped 6-row metadata table) and DraftBadge (quiet neutral draft marker), TDD.**

## Accomplishments
- `DraftBadge`: returns `null` for Published, renders a `span` with neutral color classes and the exact copy "Draft content — pending final copy" for Draft
- `Overview`: 6 hardcoded literal JSX rows in a `<dl>` inside `<Card>`, Links row branches on `external_link` presence

## Task Commits

1. **Task 1: DraftBadge + Task 2: Overview (TDD)**
   - `96c66f2` - test(02-07): add failing tests for DraftBadge and Overview components (RED)
   - `85d1746` - feat(02-07): implement DraftBadge and Overview components (GREEN)

## Files Created/Modified
- `src/components/case-study/DraftBadge.tsx` / `.test.tsx` - 4 tests
- `src/components/case-study/Overview.tsx` / `.test.tsx` - 5 tests

## Self-Check: PASSED

All 4 files exist on disk. All 9 tests pass.
