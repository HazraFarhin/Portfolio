---
phase: 04-contact-form-deployment-hardening
plan: 05
subsystem: infra
tags: [seo, robots-txt, sitemap, vitest, static-assets]

# Dependency graph
requires:
  - phase: 03-homepage-assembly
    provides: 6 shipped case-study slugs (cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io) and the 5 deferred slugs list
provides:
  - public/robots.txt disallowing all 5 deferred case-study slugs and referencing sitemap.xml
  - public/sitemap.xml listing exactly home + 6 shipped case-study URLs, omitting all deferred slugs
  - src/test/seo.test.ts asserting the exclusion holds
affects: [04-06-deployment-checkpoint]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "REPLACE_WITH_DEPLOYED_DOMAIN placeholder convention — grep-able marker in static SEO files, backfilled once the real deploy domain is known"

key-files:
  created:
    - public/robots.txt
    - public/sitemap.xml
    - src/test/seo.test.ts
  modified: []

key-decisions:
  - "Hand-maintained static sitemap.xml (7 fixed URLs) chosen over a generator library, per 04-RESEARCH.md Alternatives Considered"
  - "REPLACE_WITH_DEPLOYED_DOMAIN placeholder left in every <loc>/Sitemap: URL — real domain not knowable until Plan 04-06's deployment checkpoint (D-05)"

patterns-established:
  - "Second, independent enforcement layer for DEPL-03 alongside Plan 04-04's link removal: robots.txt + sitemap.xml exclusion holds even if a stray inbound link to a deferred slug ever appears"

requirements-completed: [DEPL-03]

coverage:
  - id: D1
    description: "public/robots.txt disallows all 5 deferred case-study slugs and references sitemap.xml"
    requirement: "DEPL-03"
    verification:
      - kind: unit
        ref: "src/test/seo.test.ts#robots.txt > disallows deferred case-study slug"
        status: pass
    human_judgment: false
  - id: D2
    description: "public/sitemap.xml lists exactly home + 6 shipped case-study URLs, omitting all 5 deferred slugs"
    requirement: "DEPL-03"
    verification:
      - kind: unit
        ref: "src/test/seo.test.ts#sitemap.xml > does not contain deferred case-study slug / contains shipped case-study slug"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-08-04
status: complete
---

# Phase 04 Plan 05: SEO Crawler Exclusion Summary

**Static `public/robots.txt` and `public/sitemap.xml` excluding the 5 deferred case-study slugs from crawler discovery, with `src/test/seo.test.ts` proving the exclusion via 16 assertions.**

## Performance

- **Duration:** 6 min
- **Tasks:** 2
- **Files modified:** 3 (all created)

## Accomplishments
- Created `public/robots.txt` — `User-agent: *`, 5 `Disallow:` lines (one per deferred slug: riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus), plus a `Sitemap:` reference
- Created `public/sitemap.xml` — standard `<urlset>` with exactly 7 `<url><loc>` entries: homepage + the 6 shipped case-study slugs in IA order, zero deferred slugs present
- Created `src/test/seo.test.ts` — 16 passing assertions (5 disallow checks, 5 sitemap-omission checks, 6 sitemap-inclusion checks) reading both files via `fs.readFileSync`/`path.join`, matching this repo's existing Vitest `describe`/`it`/`expect` convention

## Task Commits

Each task was committed atomically:

1. **Task 1: Create public/robots.txt and public/sitemap.xml** - `2286665` (feat)
2. **Task 2: Create src/test/seo.test.ts asserting robots.txt/sitemap.xml exclusion** - `8420e5b` (test)

**Plan metadata:** committed separately per worktree protocol (SUMMARY.md only; STATE.md/ROADMAP.md owned by orchestrator)

## Files Created/Modified
- `public/robots.txt` - Disallows all 5 deferred case-study slugs, references sitemap.xml
- `public/sitemap.xml` - Lists home + 6 shipped case-study URLs only
- `src/test/seo.test.ts` - Asserts robots.txt/sitemap.xml exclusion of deferred slugs and inclusion of shipped slugs

## Decisions Made
- Followed 04-RESEARCH.md's recommendation: hand-maintained static sitemap.xml, no generator dependency, since only 7 URLs exist with a fixed route list
- Left `REPLACE_WITH_DEPLOYED_DOMAIN` placeholder literal in both files intentionally — Plan 04-06's deployment checkpoint backfills the real `*.vercel.app` domain once known; the test suite deliberately does not assert on the placeholder/domain value so it remains valid before and after that replacement

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `public/robots.txt` and `public/sitemap.xml` exist and are verified correct; ready for Plan 04-06 to backfill the real deployed domain over the `REPLACE_WITH_DEPLOYED_DOMAIN` placeholder
- `src/test/seo.test.ts` will continue to pass after that backfill since it doesn't assert on the placeholder/domain string itself
- No blockers for downstream plans

---
*Phase: 04-contact-form-deployment-hardening*
*Completed: 2026-08-04*
