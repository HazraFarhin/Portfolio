---
phase: 02-content-layer-case-study-template
plan: 8
subsystem: content
tags: [vite, import-meta-glob, vitest, tdd, content-validation]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plan 02)
    provides: 6 authored .md case-study files
  - phase: 02-content-layer-case-study-template (Plan 03)
    provides: parseCaseStudyFile, CaseStudy type
provides:
  - loadCaseStudiesFromRawFiles (pure, testable helper with per-file isolation)
  - caseStudies (sorted CaseStudy[] from import.meta.glob)
  - getCaseStudyBySlug (slug lookup, returns undefined for deferred slugs)
  - getNextCaseStudy (circular next-case computation for footer link)
affects: [02-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "import.meta.glob with { query: '?raw', import: 'default', eager: true } for static file discovery at build time (D-06)"
    - "Per-file try/catch isolation: one malformed .md file is logged and skipped, never crashes the whole content load (T-02-13)"
    - "Deterministic order via .sort((a,b) => a.order - b.order) on the numeric frontmatter field -- never relies on Object.entries/glob iteration order"
    - "Circular getNextCaseStudy via modulo: (idx + 1) % caseStudies.length"

key-files:
  created:
    - src/content/case-studies/loader.ts
    - src/content/case-studies/loader.test.ts
  modified: []

key-decisions:
  - "loadCaseStudiesFromRawFiles exported as a named function (not just internal) so tests can exercise it with synthetic fixtures without touching real glob or content files"
  - "getNextCaseStudy returns undefined (not throws) for unknown slugs -- defensive, since the real content is always 6 files, but future edge cases degrade gracefully"
  - "No hardcoded slug literals anywhere in loader.ts (CASE-04 guarantee)"

requirements-completed: [CASE-01, CASE-04]

coverage:
  - id: D1
    description: "loadCaseStudiesFromRawFiles isolates malformed files; excludes from result without throwing"
    requirement: "CASE-04"
    verification:
      - kind: unit
        ref: "src/content/case-studies/loader.test.ts#isolates a malformed file"
        status: pass
      - kind: unit
        ref: "src/content/case-studies/loader.test.ts#returns 6 case studies from 6 well-formed + 1 malformed"
        status: pass
    human_judgment: false
  - id: D2
    description: "caseStudies real glob export has 6 entries in IA order (ascending order field)"
    requirement: "CASE-01"
    verification:
      - kind: unit
        ref: "src/content/case-studies/loader.test.ts#contains exactly 6 case studies"
        status: pass
      - kind: unit
        ref: "src/content/case-studies/loader.test.ts#returns slugs in IA order"
        status: pass
    human_judgment: false
  - id: D3
    description: "getNextCaseStudy wraps circularly (adreport.io -> cad)"
    requirement: "CASE-04"
    verification:
      - kind: unit
        ref: "src/content/case-studies/loader.test.ts#wraps circularly: last slug (adreport.io) -> first slug (cad)"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 8: Content Loader Summary

**import.meta.glob-based case-study content loader with per-file failure isolation, deterministic sorting, slug lookup, and circular Next Project computation, TDD.**

## Accomplishments
- `loadCaseStudiesFromRawFiles`: pure helper that parses/validates/sorts a raw-files map with per-file try/catch isolation
- `caseStudies`: module-level export wired to the real glob, verified to contain exactly 6 entries in IA order
- `getCaseStudyBySlug`: returns undefined (not throws) for deferred/unknown slugs like `riyaah`
- `getNextCaseStudy`: circular modulo computation, wraps adreport.io -> cad

## Task Commits

1. **Task 1+2: loader.ts (TDD)**
   - `69025f7` - test(02-08): add failing tests for content loader (RED)
   - `6003958` - feat(02-08): implement content loader (GREEN)

## Files Created/Modified
- `src/content/case-studies/loader.ts` - The single case-study data API
- `src/content/case-studies/loader.test.ts` - 14 unit tests

## Self-Check: PASSED

Both files exist on disk. All 14 tests pass.
