---
phase: 03-homepage-build
plan: 03
subsystem: ui
tags: [react, tailwind, content-module, gsap, tdd]

requires:
  - phase: 02-content-layer-case-study-template
    provides: caseStudies loader (src/content/case-studies/loader.ts), ImagePlaceholder component
provides:
  - Skills & Tools section (5 Operating Stack capability cards + real computed tool-chip row)
  - About section (fresh condensed bio + portrait headshot placeholder)
  - ImagePlaceholder 'portrait' size token (additive extension)
affects: [03-07 (home.tsx assembly), any future plan touching ImagePlaceholder]

tech-stack:
  added: []
  patterns:
    - "Fixed-sequence literal cards (never .map() over a content array) for a small, stable set of items; .map() reserved for genuinely variable-length, data-driven lists like the tool-chip row"
    - "Computed content derived from real data (skillTags via caseStudies.flatMap) instead of hand-typed literals, kept in the same content module as static copy"

key-files:
  created:
    - src/content/skills-tools.ts
    - src/components/home/SkillsTools.tsx
    - src/components/home/SkillsTools.test.tsx
    - src/content/about.ts
    - src/components/home/About.tsx
    - src/components/home/About.test.tsx
  modified:
    - src/components/case-study/ImagePlaceholder.tsx
    - src/components/case-study/ImagePlaceholder.test.tsx

key-decisions:
  - "aboutContent.label set to 'Who I Am' (distinct from heading 'About') to avoid duplicate-text DOM ambiguity in tests -- both fields were originally drafted as 'About' in the plan text but that collides in a11y queries"
  - "skillTags computed via caseStudies.flatMap(tags), deduplicated with Set, alphabetically sorted -- verified equal to the 10 real values (AI Interface, Banking, Cloud, Dashboard, Design System, Enterprise, InsurTech, Mobile, UI, UX)"

patterns-established:
  - "ImagePlaceholder size union extension pattern: add a new union member + one sizeClasses entry with a comment, never touch existing entries or existing test assertions"

requirements-completed: [HOME-06, HOME-07]

coverage:
  - id: D1
    description: "Skills & Tools renders 5 Operating Stack capability cards (D-03) in fixed sequence"
    requirement: "HOME-06"
    verification:
      - kind: unit
        ref: "src/components/home/SkillsTools.test.tsx#skillsToolsContent > has exactly 5 capability cards in D-03 order"
        status: pass
      - kind: unit
        ref: "src/components/home/SkillsTools.test.tsx#SkillsTools > never uses .cards.map() -- the 5 cards are literal, fixed-sequence JSX"
        status: pass
    human_judgment: false
  - id: D2
    description: "Skills & Tools tool-chip row is computed from real case-study tags (D-14 clarified), wraps via flex-wrap, never scrolls/clips"
    requirement: "HOME-06"
    verification:
      - kind: unit
        ref: "src/components/home/SkillsTools.test.tsx#skillTags > equals the real, computed, alphabetically-sorted tag values"
        status: pass
      - kind: unit
        ref: "src/components/home/SkillsTools.test.tsx#SkillsTools > renders all 10 real tool chips inside a flex-wrap row that never scrolls or clips"
        status: pass
    human_judgment: false
  - id: D3
    description: "About renders a fresh, condensed 2-4 sentence bio distinct from Hero's statement, plus a portrait headshot placeholder, with full-text rendering (no truncation)"
    requirement: "HOME-07"
    verification:
      - kind: unit
        ref: "src/components/home/About.test.tsx#aboutContent > bio is 2-4 sentences (by \". \" boundary count)"
        status: pass
      - kind: unit
        ref: "src/components/home/About.test.tsx#aboutContent > bio is textually distinct from heroContent.statement"
        status: pass
      - kind: unit
        ref: "src/components/home/About.test.tsx#About > renders the bio paragraph with no truncation/clamp/overflow-hidden class"
        status: pass
      - kind: unit
        ref: "src/components/home/About.test.tsx#About > renders exactly one ImagePlaceholder with size=\"portrait\""
        status: pass
    human_judgment: false
  - id: D4
    description: "ImagePlaceholder gains a 'portrait' size token additively, with zero regression to existing banner/stage/centerpiece usages across the 6 case-study pages"
    requirement: "HOME-07"
    verification:
      - kind: unit
        ref: "src/components/case-study/ImagePlaceholder.test.tsx (full suite, pre-existing + new portrait describe block)"
        status: pass
      - kind: unit
        ref: "npm run test (full suite, 24 files / 138 tests)"
        status: pass
    human_judgment: false

duration: 15min
completed: 2026-07-30
status: complete
---

# Phase 3 Plan 03: Skills & Tools + About Summary

**Skills & Tools ships 5 fixed Operating Stack cards plus a real, computed tool-chip row (10 values aggregated live from case-study frontmatter tags); About ships a fresh condensed bio and a portrait headshot placeholder built on a new, additive `ImagePlaceholder` size token.**

## Performance

- **Duration:** ~15 min
- **Tasks:** 2 completed
- **Files modified:** 8 (6 created, 2 modified)

## Accomplishments

- `src/content/skills-tools.ts` exports `skillsToolsContent` (5 D-03 capability cards, verbatim `Homepage Copy V2.md` §04 descriptions) and `skillTags` -- a computed, deduplicated, alphabetically-sorted aggregation of every case study's frontmatter `tags` (never a hand-typed array)
- `src/components/home/SkillsTools.tsx` renders the 5 cards as literal, fixed-sequence JSX (grep-verified: zero dynamic loop over the cards array) inside a responsive grid, plus a `flex flex-wrap` chip row that `.map()`s over `skillTags` -- the intentional exception to the fixed-sequence rule since that list's length is data-driven
- `src/components/case-study/ImagePlaceholder.tsx` gains a new `'portrait'` size token (`aspect-[3/4] max-h-[320px]`), added purely additively -- the pre-existing `ImagePlaceholder.test.tsx` suite runs unmodified and still passes, confirming zero regression to the 6 live case-study pages using `banner`/`stage`/`centerpiece`
- `src/content/about.ts` exports `aboutContent` with a fresh, 3-sentence bio condensed from `heroContent.statement` + `PROJECT.md`'s Context section (per D-12), textually distinct from the Hero statement
- `src/components/home/About.tsx` renders the full bio with zero truncation classes alongside one `ImagePlaceholder` using the new `portrait` size (per D-13)

## Task Commits

Each task followed the RED → GREEN TDD cycle:

1. **Task 1: Skills & Tools** -- `00ba290` (test, RED) → `f7d7047` (feat, GREEN)
2. **Task 2: About + ImagePlaceholder portrait extension** -- `198c68b` (test, RED) → `a611a07` (feat, GREEN)

## Files Created/Modified

- `src/content/skills-tools.ts` - 5 Operating Stack capability cards + computed `skillTags` aggregation
- `src/components/home/SkillsTools.tsx` - Skills & Tools section component
- `src/components/home/SkillsTools.test.tsx` - RED/GREEN test coverage for cards + chips
- `src/content/about.ts` - Fresh, condensed About bio content module
- `src/components/home/About.tsx` - About section component
- `src/components/home/About.test.tsx` - RED/GREEN test coverage for bio + headshot placeholder
- `src/components/case-study/ImagePlaceholder.tsx` (modified) - additive `'portrait'` size token
- `src/components/case-study/ImagePlaceholder.test.tsx` (modified) - additive portrait test cases only, no existing assertions touched

## Decisions Made

- `aboutContent.label` set to `'Who I Am'` rather than a second literal `'About'` (the plan's draft content had both `label` and `heading` as `'About'`, which produces duplicate-text DOM matches in accessible queries). `heading` stays `'About'` per the section's IA name; `label` is Claude's-discretion eyebrow copy, consistent with the `label`/`heading` pattern already used in `skillsToolsContent` (`'What I Do'` / `'Operating Stack'`).
- Confirmed `skillTags`'s 10 real values against all 6 case-study `.md` frontmatter files directly (`grep -A3 "^tags:"`) before writing the test's expected array, rather than trusting the plan's stated list blind.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Installed npm dependencies in the worktree**
- **Found during:** Task 1, first test run
- **Issue:** This worktree's `node_modules/` contained only Vite cache directories (no actual packages), so `npm run test` failed to resolve `@gsap/react` and other dependencies already present in the main repo checkout.
- **Fix:** Ran `npm install` inside the worktree (uses the existing `package-lock.json`, no version changes).
- **Files modified:** None tracked by git (`node_modules/` is gitignored).
- **Verification:** Subsequent test runs resolved all imports correctly; full suite (138 tests) passes.

**2. [Rule 1 - Bug] Fixed duplicate-text DOM collision between About's label and heading**
- **Found during:** Task 2, GREEN test run
- **Issue:** Plan's draft `aboutContent` had both `label: 'About'` and `heading: 'About'`, causing `screen.getByText('About')` to match two elements and throw.
- **Fix:** Changed `label` to `'Who I Am'`, keeping `heading` as `'About'` per the section's IA name.
- **Files modified:** `src/content/about.ts`
- **Committed in:** `a611a07` (Task 2 GREEN commit)

**3. [Rule 1 - Bug] Reworded an ImagePlaceholder doc-comment to avoid tripping its own acceptance-criteria grep**
- **Found during:** Task 1, post-GREEN acceptance-criteria verification
- **Issue:** `SkillsTools.tsx`'s doc comment originally read "...fixed sequence, never `.cards.map()`..." which itself matched the plan's literal acceptance check `grep -c '\.cards\.map(' src/components/home/SkillsTools.tsx` (expected `0`), returning `1`.
- **Fix:** Reworded the comment to describe the same constraint without the literal substring (`"never a dynamic loop over the cards array"`).
- **Files modified:** `src/components/home/SkillsTools.tsx`
- **Committed in:** `f7d7047` (Task 1 GREEN commit)

---

**Total deviations:** 3 auto-fixed (1 blocking/environment, 2 bugs caught by the plan's own verification steps)
**Impact on plan:** All three were necessary to get the plan's own stated acceptance criteria and test suite green. No scope creep -- no additional features or files beyond what the plan specified.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Both `SkillsTools` and `About` are self-contained, exported components ready to mount into `src/routes/home.tsx` by Plan 03-07, alongside the other homepage sections built in parallel this wave.
- `ImagePlaceholder`'s `portrait` size token is now available for any other section needing a compact portrait-oriented placeholder (e.g. if a future plan reuses it), without needing to touch `ImagePlaceholder.tsx` again.
- No blockers identified for this plan's scope.

---
*Phase: 03-homepage-build*
*Completed: 2026-07-30*
