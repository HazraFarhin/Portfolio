---
phase: 02-content-layer-case-study-template
plan: 9
subsystem: routing, ui
tags: [react, react-router, react-markdown, vitest, testing-library, tdd, integration]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plans 04-08)
    provides: All Wave 1-3 section components and loader
provides:
  - Challenge section component (pull-quote support, defensive img remap)
  - LearningsReflections section component
  - NextProject nav component (pure props, no data lookup)
  - NotFoundRoute (app-level catch-all 404)
  - CaseStudyPage route component (capstone integration, D-11 fixed document order)
  - router.tsx (case-study/:slug + catch-all * routes added)
affects: [Phase 3 homepage - consumes caseStudies/getCaseStudyBySlug from loader only]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "CaseStudyPage uses literal hardcoded JSX sequence (never .map() over section descriptors) for fixed D-11 document order (T-02-17)"
    - "useParams<{ slug: string }>() + getCaseStudyBySlug(slug) for content lookup; graceful null check before any field access (T-02-15)"
    - "Defensive next && guard before NextProject render (getNextCaseStudy can return undefined for edge cases)"
    - "case-study/:slug + sibling * catch-all route in router.tsx (T-02-16)"
    - "sectionClass = cn('py-xl md:py-2xl') applied uniformly to all 8 body section wrappers"

key-files:
  created:
    - src/components/case-study/Challenge.tsx
    - src/components/case-study/Challenge.test.tsx
    - src/components/case-study/LearningsReflections.tsx
    - src/components/case-study/LearningsReflections.test.tsx
    - src/components/case-study/NextProject.tsx
    - src/components/case-study/NextProject.test.tsx
    - src/routes/not-found.tsx
    - src/routes/not-found.test.tsx
    - src/routes/case-study.tsx
    - src/routes/case-study.test.tsx
  modified:
    - src/router.tsx

key-decisions:
  - "CaseStudyPage's not-found fallback renders distinct copy ('Case study not found.') from NotFoundRoute ('Page not found.') -- one is a data miss, the other a routing miss, per plan spec"
  - "Next Project section uses a defensive `{next && <NextProject ... />}` guard even though Plan 02-08's circular guarantee means next is always defined for all 6 real slugs"
  - "LearningsReflections heading uses &amp; entity in JSX ('Learnings & Reflections') for HTML entity correctness"
  - "Challenge blockquote remap uses cn('italic border-l-2 border-line pl-md') exactly as specified in the plan"

requirements-completed: [CASE-01, CASE-02, CASE-03, CASE-04]

coverage:
  - id: D1
    description: "CaseStudyPage renders all 7 section h2 headings in fixed document order for a real slug"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/routes/case-study.test.tsx#renders all 8 section h2 headings in fixed document order"
        status: pass
    human_judgment: false
  - id: D2
    description: "Dotted slugs (astrosure.ai, adreport.io) resolve correctly without dot-truncation"
    requirement: "CASE-01"
    verification:
      - kind: unit
        ref: "src/routes/case-study.test.tsx#resolves dotted slug astrosure.ai correctly"
        status: pass
      - kind: unit
        ref: "src/routes/case-study.test.tsx#resolves dotted slug adreport.io correctly"
        status: pass
    human_judgment: false
  - id: D3
    description: "Unmatched slug (riyaah) renders 'Case study not found.' fallback without crashing"
    requirement: "CASE-01"
    verification:
      - kind: unit
        ref: "src/routes/case-study.test.tsx#renders 'Case study not found.' for an unmatched slug"
        status: pass
    human_judgment: false
  - id: D4
    description: "Empty /case-study/ segment falls through to catch-all NotFoundRoute (Page not found.)"
    requirement: "CASE-01"
    verification:
      - kind: unit
        ref: "src/routes/case-study.test.tsx#does not render CaseStudyPage content for an empty slug segment"
        status: pass
    human_judgment: false
  - id: D5
    description: "CASE-04: zero hardcoded slug literals in non-test source files"
    requirement: "CASE-04"
    verification:
      - kind: manual
        ref: "grep -rn 'cad|verzion-cloud-migration|...' src/routes src/components src/router.tsx --include='*.ts' --include='*.tsx' | grep -v '.test.' returns 0 matches"
        status: pass
    human_judgment: false
  - id: D6
    description: "All body sections have py-xl md:py-2xl spacing classes"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/routes/case-study.test.tsx#every body section wrapper has py-xl and md:py-2xl spacing classes"
        status: pass
    human_judgment: false
  - id: D7
    description: "Title + summary + Overview visible above the fold (manual UAT)"
    requirement: "CASE-03"
    verification:
      - kind: manual
        ref: "02-VALIDATION.md Manual-Only Verifications table -- viewport visual check"
        status: pending
    human_judgment: true

duration: 15min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 9: Capstone Integration Summary

**CaseStudyPage route + 3 leaf components (Challenge, LearningsReflections, NextProject) + NotFoundRoute + router wiring. Full Phase 2 integration complete. 75 test files, 407 tests all passing.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-07-26
- **Tasks:** 3
- **Files modified:** 10 created, 1 modified (router.tsx)

## Accomplishments
- `Challenge`: react-markdown section with pull-quote support (blockquote remap with italic + border-l treatment) and defensive img remap
- `LearningsReflections`: same structural pattern as ToolsUsed/OutcomeImpact, no bespoke empty-state (per spec)
- `NextProject`: pure presentational component, props-only, no internal data lookup
- `NotFoundRoute`: app-level catch-all 404 with distinct copy from CaseStudyPage's data-miss fallback
- `CaseStudyPage`: composes all 12 D-11 document-order items in a literal hardcoded JSX sequence; graceful not-found fallback; dotted slugs work correctly; no hardcoded slug literals
- `router.tsx`: added `case-study/:slug` and `*` catch-all routes

## Task Commits

1. **Task 1: Challenge + LearningsReflections (TDD)**
   - `57bf1d0` - test(02-09): add failing tests for Challenge and LearningsReflections (RED)
   - `a8939c2` - feat(02-09): implement Challenge and LearningsReflections section components (GREEN)

2. **Task 2: NextProject + NotFoundRoute (TDD)**
   - `8f431da` - test(02-09): add failing tests for NextProject and NotFoundRoute (RED)
   - `5347cf0` - feat(02-09): implement NextProject component and NotFoundRoute (GREEN)

3. **Task 3: CaseStudyPage + router wiring (TDD)**
   - `abf98e1` - test(02-09): add failing tests for CaseStudyPage integration and router wiring (RED)
   - `c99452c` - feat(02-09): implement CaseStudyPage and wire router (GREEN)
   - `8fa5024` - docs(02-09): remove slug literals from router.tsx comment (CASE-04 cleanup)

## Post-Merge Verification
- Full suite `npm test`: **75 test files, 407 tests, all passing** ✅
- CASE-04 check: zero hardcoded slug literals in non-test source ✅

## Manual UAT Pending
- Viewport above-the-fold check for title + summary + Overview (per 02-VALIDATION.md)
- To be confirmed during `/gsd-verify-work`

## Self-Check: PASSED

All 10 created files and 1 modified file verified present on disk. Full npm test suite passes.
