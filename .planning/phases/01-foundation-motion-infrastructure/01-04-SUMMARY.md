---
phase: 01-foundation-motion-infrastructure
plan: 04
subsystem: ui
tags: [react, tailwindcss, vitest, testing-library, tailwind-merge, ui-primitives]

# Dependency graph
requires:
  - phase: 01-foundation-motion-infrastructure (01-02)
    provides: "@theme design tokens (color/spacing/typography scale) and src/lib/cn.ts class-merge utility"
provides:
  - "Button primitive (primary/ghost variants, pill shape, motion-safe hover lift, polymorphic <a>/<button> via href prop)"
  - "Card primitive (glass variant -- backdrop-blur-lg, rounded-3xl, low-opacity secondary surface)"
  - "Typography primitives (Label/Body/Heading/Display) mapping 1:1 to the four locked type roles, each with `as` tag override"
  - "Fixed tailwind-merge misclassification bug in src/lib/cn.ts affecting all custom @theme font-size tokens"
affects: [02-case-studies, 03-homepage-assembly]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "UI primitives live exclusively in src/components/ui/ -- no per-section redefinition of button/card/typography styling"
    - "Polymorphic Button (href prop) and Typography (as prop) rendering rather than separate components per element"
    - "cn() (clsx + tailwind-merge) is the mandatory class-merge path for base + variant + caller className in every primitive"

key-files:
  created:
    - src/components/ui/Button.tsx
    - src/components/ui/Button.test.tsx
    - src/components/ui/Card.tsx
    - src/components/ui/Card.test.tsx
    - src/components/ui/Typography.tsx
    - src/components/ui/Typography.test.tsx
  modified:
    - src/lib/cn.ts

key-decisions:
  - "Extended tailwind-merge's font-size class group to explicitly register text-label/text-body/text-heading/text-display -- without this, twMerge silently dropped these custom @theme tokens whenever merged with a text-color utility (e.g. text-muted-foreground), which would have broken every Typography-role class emitted by any component using cn()"

patterns-established:
  - "cn() extension point: custom @theme-scale utilities that share a Tailwind class-group prefix (text-*, bg-*, etc.) must be registered in tailwind-merge's classGroups override in src/lib/cn.ts, or they silently disappear on merge"

requirements-completed: [QUAL-01, QUAL-02]

coverage:
  - id: D1
    description: "Button primitive renders <button>/<a> polymorphically, distinct primary/ghost styling, never truncates CTA copy, gates hover-lift behind motion-safe:"
    requirement: "QUAL-02"
    verification:
      - kind: unit
        ref: "src/components/ui/Button.test.tsx (5 tests)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Card primitive renders glass surface (rounded-3xl, backdrop-blur-lg), never clips long content, merges caller className"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/components/ui/Card.test.tsx (3 tests)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Typography primitives (Label/Body/Heading/Display) render correct default tag + token classes, support `as` override, never truncate long content"
    requirement: "QUAL-01"
    verification:
      - kind: unit
        ref: "src/components/ui/Typography.test.tsx (6 tests)"
        status: pass
    human_judgment: false

duration: 12min
completed: 2026-07-24
status: complete
---

# Phase 1 Plan 04: UI Primitives (Button, Card, Typography) Summary

**Button/Card/Typography primitives built via TDD in `src/components/ui/`, consuming the locked `@theme` tokens, plus a fix to `cn()`'s tailwind-merge config that was silently dropping custom font-size classes**

## Performance

- **Duration:** ~12 min
- **Started:** 2026-07-24T04:49:00Z
- **Completed:** 2026-07-24T04:51:45Z
- **Tasks:** 3 completed
- **Files modified:** 7 (6 created, 1 modified)

## Accomplishments
- `Button` — polymorphic `<button>`/`<a>` via optional `href`, `primary`/`ghost` variants, pill shape, motion-safe hover lift, focus-visible ring
- `Card` — glass variant (`rounded-3xl`, `backdrop-blur-lg`, low-opacity secondary background, drop shadow), content-driven height (no clipping)
- `Typography` — `Label`/`Body`/`Heading`/`Display` primitives mapping 1:1 to the four locked type roles, each supporting tag override via `as`
- Fixed a tailwind-merge classification bug in `src/lib/cn.ts` that silently dropped every custom `@theme` font-size token (`text-label`, `text-body`, `text-heading`, `text-display`) whenever merged with a `text-color` utility — this would have silently broken Typography (and any future component pairing these tokens with color classes) without producing a visible error

## Task Commits

Each task followed RED → GREEN (TDD):

1. **Task 1: Button primitive**
   - `4717799` test(01-04): add failing test for Button primitive
   - `6d38b34` feat(01-04): implement Button primitive with motion-safe hover lift
2. **Task 2: Card primitive**
   - `9c554d0` test(01-04): add failing test for Card primitive
   - `75a21c0` feat(01-04): implement Card glass primitive
3. **Task 3: Typography primitives**
   - `38b0109` test(01-04): add failing test for Typography primitives
   - `48e2a9a` feat(01-04): implement Typography primitives and fix cn() font-size classification

_No REFACTOR commits were needed — implementations were clean on first GREEN pass._

## Files Created/Modified
- `src/components/ui/Button.tsx` - primary/ghost variants, pill shape, motion-safe hover lift, polymorphic `<a>`/`<button>`
- `src/components/ui/Button.test.tsx` - 5 tests covering render mode, variant distinction, untruncated CTA copy, motion-safe gating
- `src/components/ui/Card.tsx` - glass surface variant, content-driven height, className merge
- `src/components/ui/Card.test.tsx` - 3 tests covering base classes, long-content handling, className merge
- `src/components/ui/Typography.tsx` - `Label`/`Body`/`Heading`/`Display` exports with `as` tag override
- `src/components/ui/Typography.test.tsx` - 6 tests covering default tags/classes, `as` override, long-text handling
- `src/lib/cn.ts` - extended `tailwind-merge`'s `font-size` class group to register the four custom `@theme` typography tokens

## Decisions Made
- Registered `text-label`/`text-body`/`text-heading`/`text-display` in tailwind-merge's `font-size` classGroup override (in `src/lib/cn.ts`) rather than in each component, so the fix applies globally to every future consumer of `cn()` — establishes the pattern that any future custom `@theme` scale sharing a Tailwind class-group prefix must be registered here.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed tailwind-merge silently dropping custom font-size tokens**
- **Found during:** Task 3 (Typography primitives) — `Label`, `Body`, `Heading`, and `Display` tests failed because their base font-size classes (`text-label`, `text-body`, `text-heading`, `text-display`) were entirely absent from the rendered `className`, even though the source JSX included them.
- **Issue:** `tailwind-merge`'s default class-group detection doesn't recognize the project's custom `@theme` font-size scale (defined in `src/index.css` under 01-02). It misclassified `text-label` etc. as members of the `text-color` group (shared `text-*` prefix), so when merged with an actual color utility like `text-muted-foreground` or `text-foreground`, twMerge's conflict resolution silently dropped the earlier (font-size) class and kept only the later (color) class. This affected Button's own `text-label` class too, though Button's tests didn't happen to assert its presence.
- **Fix:** Extended `cn()`'s `tailwind-merge` config via `extendTailwindMerge({ extend: { classGroups: { 'font-size': [...] } } })` in `src/lib/cn.ts`, explicitly registering all four tokens under the `font-size` group so they no longer collide with `text-color` utilities.
- **Files modified:** `src/lib/cn.ts`
- **Verification:** Reproduced the drop with a standalone Node script against the unpatched `twMerge`, confirmed the fix resolves it the same way, then re-ran all three test files (`Button.test.tsx`, `Card.test.tsx`, `Typography.test.tsx` — 14 tests total) plus `tsc -b` and `oxlint` — all pass.
- **Committed in:** `48e2a9a` (Task 3 commit)

---

**Total deviations:** 1 auto-fixed (1 blocking)
**Impact on plan:** Necessary correctness fix for all three primitives (and any future component) relying on the locked typography tokens — without it the Typography role classes would silently fail to render whenever paired with a text-color utility, which is the exact pairing every one of these primitives uses. No scope creep — fix was scoped entirely to `src/lib/cn.ts`.

## Issues Encountered
None beyond the tailwind-merge deviation documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `Button`, `Card`, and `Typography` are ready for composition by the Hero section (01-05) and later phases (2, 3) — no per-section button/card/typography styling should be redefined.
- The `cn()` fix means any future custom `@theme` scale token sharing a Tailwind class-group prefix (e.g. a new `bg-*` or `border-*` custom scale) should be checked against this same tailwind-merge classification issue and registered in `src/lib/cn.ts` if needed.
- No blockers for wave 3/later plans in this phase.

---
*Phase: 01-foundation-motion-infrastructure*
*Completed: 2026-07-24*
