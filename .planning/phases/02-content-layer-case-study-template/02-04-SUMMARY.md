---
phase: 02-content-layer-case-study-template
plan: 4
subsystem: ui
tags: [react, tailwind, react-markdown, lucide-react, vitest, testing-library]

# Dependency graph
requires:
  - phase: 02-content-layer-case-study-template (Plan 01)
    provides: Typography primitives (Label/Body/Heading/Display), cn() utility, project scaffolding
provides:
  - ImagePlaceholder component (banner/stage/centerpiece sizes) — the shared D-02 placeholder block used everywhere the template calls for an image
  - ToolsUsed section component — markdown-rendered tool chip list with empty-state fallback
  - OutcomeImpact section component — markdown-rendered outcome copy with italic empty-state fallback
  - Established react-markdown component-remapping pattern (img -> ImagePlaceholder, p/li -> Body) for later markdown-rendering section components
affects: [02-05, 02-06, 02-09]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "react-markdown component remapping: img always remapped to ImagePlaceholder (never a real <img>, D-02), p/li remapped to Body/Label-derived primitives"
    - "ul remapped to className=\"contents\" so react-markdown-rendered li chips participate directly in a parent flex flex-wrap layout instead of being trapped inside a block-level <ul>"
    - "Section components: <section> wrapping a Heading(as=\"h2\") + either markdown body or a muted/italic empty-state fallback, never a Card wrapper (Card is reserved for Overview only)"

key-files:
  created:
    - src/components/case-study/ImagePlaceholder.tsx
    - src/components/case-study/ImagePlaceholder.test.tsx
    - src/components/case-study/ToolsUsed.tsx
    - src/components/case-study/ToolsUsed.test.tsx
    - src/components/case-study/OutcomeImpact.tsx
    - src/components/case-study/OutcomeImpact.test.tsx
  modified: []

key-decisions:
  - "ImagePlaceholder's banner size includes a max-sm:aspect-video override (16:9 on mobile) per UI-SPEC, in addition to the literal class strings enumerated in the plan's action text, since the <behavior> block and UI-SPEC both explicitly require the mobile variant"
  - "ToolsUsed remaps react-markdown's `ul` to className=\"contents\" so the chip-styled `li` elements participate directly in the wrapping div's flex flex-wrap layout — without this, flex-wrap would have no visible effect since its only direct child would be a single block-level <ul>"
  - "OutcomeImpact's img remap uses caption=\"Outcome visual — pending\" size=\"stage\" — not specified verbatim in the plan's action text (only ToolsUsed's caption was), chosen for consistency with the established caption-copy register"

patterns-established:
  - "react-markdown img/li/p component remapping: every future markdown-rendering case-study section component (Challenge, Process, Solution, LearningsReflections in later plans) should reuse this exact `components` object shape"

requirements-completed: [CASE-02]

coverage:
  - id: D1
    description: "ImagePlaceholder renders a caption via Label beneath a lucide ImageOff icon, with 3 distinct size variants (banner/stage/centerpiece) and never renders a native <img>"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/ImagePlaceholder.test.tsx#never renders a real <img> element for any size"
        status: pass
      - kind: unit
        ref: "src/components/case-study/ImagePlaceholder.test.tsx#produces a distinct className string per size containing its aspect-ratio/max-height classes"
        status: pass
    human_judgment: false
  - id: D2
    description: "ToolsUsed renders 'Tools list pending.' for empty/whitespace content and a wrapping flex-wrap chip list (img remapped to ImagePlaceholder) for non-empty content"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/ToolsUsed.test.tsx#renders \"Tools list pending.\" and no markdown output when content is empty"
        status: pass
      - kind: unit
        ref: "src/components/case-study/ToolsUsed.test.tsx#renders the authored tool list when content contains a bullet item"
        status: pass
      - kind: unit
        ref: "src/components/case-study/ToolsUsed.test.tsx#applies flex-wrap classes to the rendered tool list wrapper"
        status: pass
    human_judgment: false
  - id: D3
    description: "OutcomeImpact renders the exact italic fallback sentence for empty/whitespace content and markdown-rendered outcome content (img remapped to ImagePlaceholder) otherwise"
    requirement: "CASE-02"
    verification:
      - kind: unit
        ref: "src/components/case-study/OutcomeImpact.test.tsx#renders the exact fallback sentence with an italic className when content is empty"
        status: pass
      - kind: unit
        ref: "src/components/case-study/OutcomeImpact.test.tsx#renders authored content instead of the fallback when content is non-empty"
        status: pass
    human_judgment: false

duration: 8min
completed: 2026-07-26
status: complete
---

# Phase 2 Plan 4: Placeholder + ToolsUsed/OutcomeImpact Section Components Summary

**ImagePlaceholder (3-size shared image placeholder), ToolsUsed, and OutcomeImpact section components built with react-markdown component-remapping and empty-state fallbacks, per TDD**

## Performance

- **Duration:** ~8 min
- **Started:** 2026-07-26T10:53:32+05:30
- **Completed:** 2026-07-26T10:57:05+05:30
- **Tasks:** 3
- **Files modified:** 6 (all newly created)

## Accomplishments
- `ImagePlaceholder` component: renders a `Label` caption beneath a `lucide-react` `ImageOff` icon, with `banner`/`stage`/`centerpiece` size variants applying distinct aspect-ratio/max-height classes, and never renders a native `<img>` (D-02)
- `ToolsUsed` section component: renders the muted "Tools list pending." fallback for empty/whitespace content, otherwise renders the authored tool list as a wrapping `flex flex-wrap` chip row via `react-markdown` with `img` remapped to `ImagePlaceholder`
- `OutcomeImpact` section component: renders the exact italic fallback sentence for empty/whitespace content, otherwise renders the authored outcome copy via `react-markdown` with `img` remapped to `ImagePlaceholder` and `p`/`li` remapped to `Body`
- Established the `react-markdown` component-remapping pattern (`img` -> `ImagePlaceholder`, `p`/`li` -> `Body`) that later markdown-rendering section components (Plans 02-05, 02-06) will repeat

## Task Commits

Each task was committed atomically (TDD RED -> GREEN per task):

1. **Task 1: ImagePlaceholder component**
   - `5d92a2d` - test(02-04): add failing test for ImagePlaceholder component (RED)
   - `f92261e` - feat(02-04): implement ImagePlaceholder component (GREEN)
2. **Task 2: ToolsUsed section component**
   - `0d68f92` - test(02-04): add failing test for ToolsUsed component (RED)
   - `d486f8a` - feat(02-04): implement ToolsUsed section component (GREEN)
3. **Task 3: OutcomeImpact section component**
   - `7b1ebbb` - test(02-04): add failing test for OutcomeImpact component (RED)
   - `5349d2e` - feat(02-04): implement OutcomeImpact section component (GREEN)

**Plan metadata:** committed separately (SUMMARY.md, see final commit below)

_Note: all 3 tasks used the RED -> GREEN TDD cycle per their `tdd="true"` marker; no REFACTOR commits were needed._

## Files Created/Modified
- `src/components/case-study/ImagePlaceholder.tsx` - Shared image placeholder block (banner/stage/centerpiece sizes), never renders a native `<img>`
- `src/components/case-study/ImagePlaceholder.test.tsx` - Tests for size-variant classNames and no-`<img>`-ever assertion
- `src/components/case-study/ToolsUsed.tsx` - "Tools Used" section: markdown chip list or "Tools list pending." fallback
- `src/components/case-study/ToolsUsed.test.tsx` - Tests for empty/whitespace fallback, non-empty rendering, heading, flex-wrap classes
- `src/components/case-study/OutcomeImpact.tsx` - "Outcome & Impact" section: markdown body or italic fallback sentence
- `src/components/case-study/OutcomeImpact.test.tsx` - Tests for exact fallback text/className, non-empty rendering, heading

## Decisions Made
- Included ImagePlaceholder's mobile 16:9 override (`max-sm:aspect-video`) on top of the literal desktop class strings named in the plan's action text, since both the task's `<behavior>` block and UI-SPEC explicitly require it — treated as part of the specified behavior, not scope creep
- Remapped react-markdown's `ul` to `className="contents"` in `ToolsUsed` so the chip-styled `li` elements participate directly in the wrapping div's `flex flex-wrap` layout (see Deviations below)
- Chose `caption="Outcome visual — pending"` / `size="stage"` for `OutcomeImpact`'s `img` remap since the plan's action text didn't specify exact copy for this component (only `ToolsUsed`'s caption was specified verbatim)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed non-functional flex-wrap in ToolsUsed's chip list**
- **Found during:** Task 2 (ToolsUsed section component)
- **Issue:** The plan's action text specifies wrapping `<Markdown>` in a `div` with `flex flex-wrap gap-sm` and remapping `li` to a chip-styled `span`, but react-markdown's default `ul` wrapper remains a single block-level element. Without also handling `ul`, the wrapping div's only direct child is one `<ul>`, so `flex-wrap` has no visible effect on the individual chips — contradicting the locked UI-SPEC requirement ("Tools Used chip list at typical/high volume ... wraps to additional lines, never scrolls or clips horizontally").
- **Fix:** Remapped react-markdown's `ul` to `<ul className="contents">{children}</ul>` (Tailwind's `display: contents`), so the `li`-rendered chips become direct flex participants in the wrapping div while the `<ul>` retains its semantic/accessibility role.
- **Files modified:** src/components/case-study/ToolsUsed.tsx
- **Verification:** `applies flex-wrap classes to the rendered tool list wrapper` test passes; manually reasoned through the DOM structure (`contents` display removes the `<ul>`'s own box from layout, so its `<li>` children are laid out as flex items of the parent div)
- **Committed in:** d486f8a (Task 2 commit)

**2. [Rule 1 - Bug] Fixed TypeScript error in OutcomeImpact's react-markdown component remapping**
- **Found during:** Task 3 (OutcomeImpact section component), post-implementation `tsc -b --noEmit` check
- **Issue:** Spreading react-markdown's component props directly onto `Body` (`<Body {...props} />`) failed to typecheck: react-markdown's `Components` type marks `children` as optional (`ReactNode | undefined`) while `Typography.tsx`'s `TypographyProps` requires `children: ReactNode`.
- **Fix:** Destructured `children` explicitly and passed it as JSX children instead of spreading props (`p: ({ children }) => <Body>{children}</Body>`), matching the pattern already used in `ToolsUsed.tsx`'s `li` remap.
- **Files modified:** src/components/case-study/OutcomeImpact.tsx
- **Verification:** `npx tsc -b --noEmit` passes with zero errors; all 4 OutcomeImpact tests pass
- **Committed in:** 5349d2e (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 - bug fixes required for correct behavior/build)
**Impact on plan:** Both fixes were necessary for the components to actually satisfy their locked UI-SPEC/behavior requirements and to typecheck cleanly. No scope creep — no new files, no architectural changes.

## Issues Encountered
- `grep -c '<img' src/components/case-study/ImagePlaceholder.tsx` initially matched a doc-comment sentence describing the "never renders `<img>`" behavior in prose, returning 1 instead of the plan's expected 0. Reworded the doc comment to avoid the literal `<img` substring while preserving the same meaning; re-verified grep returns 0.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `ImagePlaceholder` is ready for reuse by Plan 02-05 (Solution centerpiece images), Plan 02-06 (Process stage images), and Plan 02-09 (page-level cover banner) — exports `{ caption, size }` props with `'banner' | 'stage' | 'centerpiece'` size variants
- `ToolsUsed` and `OutcomeImpact` establish the `react-markdown` component-remapping pattern (img -> ImagePlaceholder, p/li -> Body) for Plan 02-05's remaining markdown-rendering sections (Challenge, Solution) and Plan 02-06 (Process paragraphs)
- No blockers or concerns for downstream plans

---
*Phase: 02-content-layer-case-study-template*
*Completed: 2026-07-26*

## Self-Check: PASSED

All 6 created files verified present on disk (ImagePlaceholder.tsx/.test.tsx, ToolsUsed.tsx/.test.tsx, OutcomeImpact.tsx/.test.tsx). All 6 task commit hashes (5d92a2d, f92261e, 0d68f92, d486f8a, 7b1ebbb, 5349d2e) verified present in git log.

**Note on requirements-completed:** `CASE-02` is not marked complete in REQUIREMENTS.md by this plan. It is a shared requirement contributed to by 5 plans in this phase (02-04, 02-05, 02-06, 02-07, 02-09) — marking it complete here, after only this plan's 3 of the 7 required sections exist, would be premature and misleading to the audit/verification pipeline. It should be marked complete only once the last contributing plan lands.
