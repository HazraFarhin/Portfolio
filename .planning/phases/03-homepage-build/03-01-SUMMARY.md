---
phase: 03-homepage-build
plan: 01
subsystem: ui
tags: [react, tailwind, gsap, content-module, typography]

# Dependency graph
requires:
  - phase: 01-foundation-motion-infrastructure
    provides: useScrollReveal hook, Button/Card/Typography primitives, cn() utility
  - phase: 02-content-layer-case-study-template
    provides: ImagePlaceholder component ('stage' size)
provides:
  - navContent data module + Nav.tsx (persistent, homepage-only nav bar)
  - proofStripContent data module + ProofStrip.tsx (4-stat credibility section)
  - fieldArchiveContent data module + FieldArchive.tsx (accessible horizontal gallery)
  - TypographyProps.href (additive extension enabling Label as="a" href={...})
affects: [03-07 (mounts Nav/ProofStrip/FieldArchive into home.tsx)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Literal indexed JSX blocks (never .stats.map) for fixed-count content sections, mirroring Process.tsx's numbered-sequence discipline"
    - "Content-as-data-module pattern (src/content/*.ts) extended to Nav/ProofStrip/FieldArchive"

key-files:
  created:
    - src/content/nav.ts
    - src/components/home/Nav.tsx
    - src/components/home/Nav.test.tsx
    - src/content/proof-strip.ts
    - src/components/home/ProofStrip.tsx
    - src/components/home/ProofStrip.test.tsx
    - src/content/field-archive.ts
    - src/components/home/FieldArchive.tsx
    - src/components/home/FieldArchive.test.tsx
  modified:
    - src/components/ui/Typography.tsx

key-decisions:
  - "Added optional href to TypographyProps so Label as=\"a\" href={...} type-checks -- HTMLAttributes<HTMLElement> deliberately omits href since it's anchor-specific"

patterns-established:
  - "Pattern: fixed-count sections (Proof Strip's 4 stats) use literal indexed array-index JSX, never .map(), to guarantee count/order regardless of content-module shape"

requirements-completed: [HOME-02]

coverage:
  - id: D1
    description: "Persistent Nav bar: wordmark + 4 links (Work/Method/Skills/Contact) wired to the 4 in-page section ids, homepage-only scope"
    verification:
      - kind: unit
        ref: "src/components/home/Nav.test.tsx"
        status: pass
    human_judgment: false
  - id: D2
    description: "Proof Strip renders all 4 real stats from Homepage Copy V2.md §05 with accent-colored figures only"
    requirement: "HOME-02"
    verification:
      - kind: unit
        ref: "src/components/home/ProofStrip.test.tsx"
        status: pass
    human_judgment: false
  - id: D3
    description: "Field Archive renders a native, keyboard-focusable horizontally-scrollable gallery of the 6 sourced captions with zero scroll-jacking config"
    verification:
      - kind: unit
        ref: "src/components/home/FieldArchive.test.tsx"
        status: pass
    human_judgment: false
  - id: D4
    description: "Nav bar fits without a hamburger menu at 320-375px mobile viewports (visual backstop, not unit-testable)"
    verification: []
    human_judgment: true
    rationale: "UI-SPEC flags this as a backstop item requiring a visual UAT check at a real narrow viewport with rendered link labels -- not a DOM-order assertion"
  - id: D5
    description: "Proof Strip's 2x2 mobile stat grid captions don't overlap/truncate at the smallest supported viewport (visual backstop, not unit-testable)"
    verification: []
    human_judgment: true
    rationale: "UI-SPEC flags this as a backstop item requiring a visual UAT check at a real narrow viewport, not a DOM assertion"

duration: 25min
completed: 2026-07-30
status: complete
---

# Phase 3 Plan 01: Nav, Proof Strip, Field Archive Summary

**Three independent homepage sections (persistent Nav bar, Proof Strip stats, Field Archive gallery) shipped as content module + component + passing test each, following the hero.ts/home.tsx content-as-data pattern.**

## Performance

- **Duration:** ~25 min
- **Completed:** 2026-07-30
- **Tasks:** 3
- **Files modified:** 10 (9 created, 1 modified)

## Accomplishments
- Persistent Nav bar (D-06): `navContent` (wordmark + 4 links) + `Nav.tsx`, fixed/glass overlay, plain `#id` anchors, homepage-only (not imported by `App.tsx`)
- Proof Strip (HOME-02): `proofStripContent` (4 real stats verbatim from Homepage Copy V2.md §05) + `ProofStrip.tsx`, 4 literal indexed stat blocks with `text-accent` on values only
- Field Archive (D-04): `fieldArchiveContent` (6 captions verbatim from Homepage Copy V2.md §06) + `FieldArchive.tsx`, native `overflow-x-auto` accessible scroll region, zero scroll-jacking config

## Task Commits

Each task followed RED → GREEN TDD:

1. **Task 1: Nav bar** - `4ea714e` (test), `1f55516` (feat)
2. **Task 2: Proof Strip** - `fa4bc82` (test), `626db21` (feat)
3. **Task 3: Field Archive** - `cb3b2c7` (test), `1ac9b6f` (feat)

## Files Created/Modified
- `src/content/nav.ts` - `navContent` data module (wordmark + 4 links)
- `src/components/home/Nav.tsx` - Fixed/glass persistent nav bar
- `src/components/home/Nav.test.tsx` - Nav unit tests (5 tests)
- `src/content/proof-strip.ts` - `proofStripContent` data module (4 stats + supporting line)
- `src/components/home/ProofStrip.tsx` - Proof Strip section, 4 literal indexed stat blocks
- `src/components/home/ProofStrip.test.tsx` - ProofStrip unit tests (4 tests)
- `src/content/field-archive.ts` - `fieldArchiveContent` data module (6 captions)
- `src/components/home/FieldArchive.tsx` - Field Archive accessible horizontal gallery
- `src/components/home/FieldArchive.test.tsx` - FieldArchive unit tests (3 tests)
- `src/components/ui/Typography.tsx` - Added optional `href?: string` to `TypographyProps` (see Deviations)

## Decisions Made
- Extended `TypographyProps` with an optional `href` field rather than introducing a new `Link`/`Anchor` typography variant -- the plan's own spec calls for `Label as="a" href={...}` verbatim for both Nav's wordmark and its 4 links, and this is the smallest, most backward-compatible fix (mirrors `Button`'s existing `href?: string` pattern).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `Label as="a" href={...}` didn't type-check**
- **Found during:** Task 1 (Nav bar implementation)
- **Issue:** `TypographyProps extends HTMLAttributes<HTMLElement>`, and React's `HTMLAttributes<T>` deliberately omits `href` (it's anchor-specific, defined only on `AnchorHTMLAttributes<T>`). The plan's own Task 1 action explicitly specifies `<Label as="a" href={navContent.wordmarkHref}>` and `<Label as="a" href={link.href}>`, which would fail `tsc -b` (the project's real build command) even though `vitest` doesn't type-check and would pass silently.
- **Fix:** Added `href?: string` to `TypographyProps` in `src/components/ui/Typography.tsx`, spread through to the underlying element via the existing `{...rest}` pass-through. No other behavior changed; `Label`/`Body`/`Heading`/`Display` all gained the same optional field since they share one interface.
- **Files modified:** `src/components/ui/Typography.tsx`
- **Verification:** `npx tsc -b --noEmit` clean; full `npm run build` succeeds; `npm run test` (137/137) passes
- **Committed in:** `1f55516` (Task 1 feat commit)

**2. [Rule 1 - Bug] Test file used `node:fs`/`node:path`, which broke `tsc -b`**
- **Found during:** Task 1 (Nav bar test authoring)
- **Issue:** An initial source-text-grep-based test (`readFileSync` via `node:fs`/`node:path`) compiled fine under `vitest` (esbuild transpile-only) but failed `tsc -b --noEmit` with `TS2591: Cannot find name 'node:fs'` -- the project's `tsconfig.app.json` scopes `types` to `["vite/client"]` only, with no Node type-checking precedent anywhere else in `src/`.
- **Fix:** Replaced the source-text-grep test with an equivalent DOM-based assertion (every rendered nav `<a>` has an `href` starting with `#`, confirming plain in-page anchors are used, not router-driven `to="/#..."` links). The plan's own grep-based acceptance criteria (`useScrollReveal`/`to="/#` counts == 0 in `Nav.tsx`) were verified directly via `grep` during task execution instead of being embedded in the committed test file.
- **Files modified:** `src/components/home/Nav.test.tsx`
- **Verification:** `npx tsc -b --noEmit` clean; `npm run test -- src/components/home/Nav.test.tsx` passes (5/5)
- **Committed in:** `4ea714e` (Task 1 test commit, before the `node:fs` version was ever committed)

**3. [Rule 1 - Bug] Doc-comment text accidentally matched acceptance-criteria greps**
- **Found during:** Tasks 1-3
- **Issue:** JSDoc comments in `Nav.tsx` and `FieldArchive.tsx` initially quoted the literal patterns the acceptance criteria grep for (`useScrollReveal`, `to="/#`, `pin: true`/`containerAnimation`) while explaining what the component deliberately avoids -- causing the acceptance-criteria `grep -c ... == 0` checks to fail even though the actual behavior was correct. Similarly, `ProofStrip.tsx`'s comment literally spelled out `.stats.map(...)`, tripping the `grep -c '\.stats\.map(' == 0` check.
- **Fix:** Reworded all four comments to describe the same constraint without reproducing the literal banned substring (e.g. "never a router-driven link component", "ScrollTrigger-pinned, container-driven scroll-jacked gallery", "never derived via array iteration").
- **Files modified:** `src/components/home/Nav.tsx`, `src/components/home/ProofStrip.tsx`, `src/components/home/FieldArchive.tsx`
- **Verification:** All 4 acceptance-criteria grep counts re-run and confirmed `0` (or `>= 4` for the `text-accent` count) after rewording; `npm run test` still green
- **Committed in:** `1f55516`, `626db21`, `1ac9b6f` (each task's feat commit)

---

**Total deviations:** 3 auto-fixed (1 blocking type-check fix, 2 bugs in test/comment authoring)
**Impact on plan:** All three are mechanical correctness fixes required to satisfy the plan's own explicit code spec and acceptance criteria under `tsc -b` (the project's real build gate, distinct from vitest's transpile-only test run). No scope creep -- no new features, no architecture changes.

## Issues Encountered
- `node_modules/` was absent in this worktree at task start; ran `npm install` (226 packages, 0 vulnerabilities) before any test could execute. Not a plan deviation -- routine environment bootstrap.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- All 3 sections (`Nav`, `ProofStrip`, `FieldArchive`) exist as fully independent, tested modules ready for Plan 03-07 to mount into `home.tsx` in IA order.
- No file this plan touched is expected to be modified by any other Wave 1 plan, per this plan's own success criteria -- confirmed via `git log` (only this plan's 6 commits touch `src/content/nav.ts`, `src/content/proof-strip.ts`, `src/content/field-archive.ts`, `src/components/home/{Nav,ProofStrip,FieldArchive}.tsx`, and `src/components/ui/Typography.tsx`).
- `src/components/ui/Typography.tsx`'s new optional `href` field is additive/backward-compatible -- no existing `Label`/`Body`/`Heading`/`Display` call site changes behavior.
- Two backstop UI Considerations (Nav bar at 320-375px, Proof Strip's 2x2 mobile grid) are flagged for visual UAT at end-of-phase, per UI-SPEC's own "🧪 backstop" status -- not resolved by unit tests in this plan, consistent with the plan's own must_haves verification tags.
- Full regression suite confirmed green: `npm run test` = 25 files / 137 tests passing (no regressions to any Phase 1/2 test file); `npm run build` (`tsc -b && vite build`) succeeds cleanly.

---
*Phase: 03-homepage-build*
*Completed: 2026-07-30*
