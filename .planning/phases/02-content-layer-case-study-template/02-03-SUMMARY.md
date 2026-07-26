---
phase: 02-content-layer-case-study-template
plan: 3
subsystem: content
tags: [zod, js-yaml, vitest, tdd, content-validation]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plan 02-01)
    provides: Real authored .md case-study files following the Project Page Template shape
provides:
  - "CaseStudyFrontmatterSchema — strict Zod schema validating all 13 frontmatter fields"
  - "CaseStudyFrontmatter/CaseStudy/CaseStudySections/CaseStudyProcessStages exported types"
  - "parseCaseStudyFile(raw, filePath) — pure frontmatter+body parser with fail-fast validation"
  - "splitBodyIntoSections(body) — pure body-to-named-sections splitter with graceful missing-heading fallback"
affects: [02-07 (Overview.tsx/DraftBadge.tsx), 02-08 (loader.ts)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Regex + js-yaml frontmatter split instead of gray-matter/front-matter (avoids Buffer-is-not-defined in browser bundles)"
    - "Fail-fast (throw) for frontmatter/schema/slug-mismatch errors; graceful degrade (empty string) for missing body sections"

key-files:
  created:
    - src/content/case-studies/schema.ts
    - src/content/case-studies/schema.test.ts
    - src/content/case-studies/parse.ts
    - src/content/case-studies/parse.test.ts
  modified: []

key-decisions:
  - "external_link hardened beyond Zod's bare .url() with a .refine() restricting to http(s):// only, closing the javascript:/ftp: scheme gap before values ever reach an <a href>"
  - "Process sub-stage matching is positional (1st/2nd/3rd/4th/5th H3 match -> fixed stage key), not heading-text keyed, matching the plan's literal instruction"
  - "Frontmatter/parsing errors fail fast (throw); missing body-section headings degrade to an empty string rather than throwing, since Plan 02-08's loader must isolate one bad file without crashing the whole app"

patterns-established:
  - "Pattern: pure fixture-string parsing functions, no filesystem/import.meta.glob access inside schema.ts/parse.ts -- keeps content-layer logic fully unit-testable and defers real file loading to the loader (02-08)"

requirements-completed: [CASE-04]

coverage:
  - id: D1
    description: "CaseStudyFrontmatterSchema strictly validates all 13 frontmatter fields, rejects unrecognized keys, and hardens external_link to http/https only"
    requirement: "CASE-04"
    verification:
      - kind: unit
        ref: "src/content/case-studies/schema.test.ts (10 tests)"
        status: pass
    human_judgment: false
  - id: D2
    description: "parseCaseStudyFile parses well-formed fixtures into typed CaseStudy objects and throws file-path-specific errors for malformed/missing frontmatter and slug mismatches"
    requirement: "CASE-04"
    verification:
      - kind: unit
        ref: "src/content/case-studies/parse.test.ts (7 tests)"
        status: pass
    human_judgment: false
  - id: D3
    description: "splitBodyIntoSections gracefully returns an empty string for a missing H2 heading instead of throwing"
    requirement: "CASE-04"
    verification:
      - kind: unit
        ref: "src/content/case-studies/parse.test.ts#splitBodyIntoSections (1 test) + parse.test.ts#parseCaseStudyFile missing-heading case"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-07-26
status: complete
---

# Phase 02 Plan 3: Case-Study Frontmatter Schema & Parser Summary

**Strict Zod frontmatter schema plus regex+js-yaml parse functions turning raw case-study `.md` text into typed, validated `CaseStudy` objects -- test-first, 17 unit tests, zero real-file/glob dependency.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-07-26T10:53:04+05:30
- **Completed:** 2026-07-26T10:56:03+05:30
- **Tasks:** 2 completed
- **Files modified:** 4 created (0 modified)

## Accomplishments
- `CaseStudyFrontmatterSchema` (Zod, `.strict()`) validates all 13 frontmatter fields per `Project Page- Template.md`, rejecting unrecognized keys and hardening `external_link` to `http(s)://` only
- `parseCaseStudyFile()` splits raw `.md` text into validated frontmatter + body via regex + `js-yaml` (no `gray-matter`/`Buffer` dependency), throwing file-path-specific errors for malformed frontmatter, schema failures, and filename/frontmatter slug mismatches (fixes the `astrosure.ai`/`adreport.io` dotted-filename truncation pitfall)
- `splitBodyIntoSections()` splits the body into the 6 named top-level sections plus 5 positionally-matched Process sub-stages, degrading missing headings to an empty string rather than throwing
- Sanity-verified (ad-hoc, not committed) against all 6 real authored `.md` files in `src/content/case-studies/` -- all parse without throwing

## Task Commits

Each task was committed atomically, following RED/GREEN TDD:

1. **Task 1: CaseStudyFrontmatterSchema (Zod)**
   - `fcb9d29` test(02-03): add failing tests for CaseStudyFrontmatterSchema (RED)
   - `6941aa1` feat(02-03): implement CaseStudyFrontmatterSchema (Zod) (GREEN)
2. **Task 2: parseCaseStudyFile + splitBodyIntoSections**
   - `3d95a59` test(02-03): add failing tests for parseCaseStudyFile/splitBodyIntoSections (RED)
   - `8e12503` feat(02-03): implement parseCaseStudyFile and splitBodyIntoSections (GREEN)

_No REFACTOR commits needed -- both implementations passed cleanly on first GREEN attempt with no follow-up cleanup required._

## Files Created/Modified
- `src/content/case-studies/schema.ts` - `CaseStudyFrontmatterSchema` (strict Zod object) + `CaseStudyFrontmatter` inferred type
- `src/content/case-studies/schema.test.ts` - 10 behavior-case unit tests for the schema
- `src/content/case-studies/parse.ts` - `parseCaseStudyFile`, `splitBodyIntoSections`, `CaseStudy`/`CaseStudySections`/`CaseStudyProcessStages` types
- `src/content/case-studies/parse.test.ts` - 7 behavior-case unit tests for the parse functions

## Decisions Made
- `external_link` uses Zod's `.url()` plus an explicit `.refine()` checking a case-insensitive `http(s)://` prefix, since bare `.url()` accepts any URL-spec-valid scheme including `javascript:` (T-02-03 mitigation)
- Process sub-stage extraction matches `### \d+\.\s*(.+)` H3 headings **positionally** (1st match maps to `discoveryResearch`, 2nd to `define`, etc.) rather than by heading text, per the plan's literal "in that order" instruction -- keeps the implementation resilient to minor heading-text rewording as long as numbering and order are preserved
- Frontmatter/schema/slug-mismatch failures throw synchronously (fail-fast); missing body-section headings degrade gracefully to an empty string -- an intentional asymmetry: frontmatter is structured data that must be correct, body prose is free-form content Plan 02-08's loader must isolate per-file without taking the whole app down

## Deviations from Plan

None - plan executed exactly as written. Both tasks matched the `<action>` specifications precisely; `npm install` was run once at the start of the session since `node_modules/` wasn't present in this worktree checkout (standard worktree setup, not a plan deviation).

## Issues Encountered

None. `js-yaml@5.2.2` and `zod@4.4.3` (both already in `package.json` from prior phase work) matched the API shapes assumed by 02-RESEARCH.md's code examples with no adjustments needed.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `CaseStudyFrontmatter`/`CaseStudy` types and `parseCaseStudyFile`/`splitBodyIntoSections` functions are ready for Plan 02-08's loader to consume per real `.md` file via `import.meta.glob`
- Plan 02-07's `Overview.tsx`/`DraftBadge.tsx` can import `CaseStudyFrontmatter` directly from `schema.ts`
- No blockers. Verified against all 6 currently-authored case-study `.md` files with zero parse failures, giving confidence the schema/parser correctly matches real content, not just synthetic fixtures.

---
*Phase: 02-content-layer-case-study-template*
*Completed: 2026-07-26*

## Self-Check: PASSED

All 4 created files and all 4 task commit hashes verified present on disk / in git log.
