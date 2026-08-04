---
phase: 04-contact-form-deployment-hardening
plan: 03
subsystem: ui
tags: [react, forms, honeypot, fetch, vitest, tdd]

# Dependency graph
requires:
  - phase: 04-contact-form-deployment-hardening
    provides: "Plan 04-02's POST /api/contact serverless function contract (not read directly this plan — fetch target only)"
provides:
  - "Footer.tsx real onSubmit handler: preventDefault, honeypot short-circuit, fetch('/api/contact'), idle/submitting/success/error state machine"
  - "footerContent copy fields for submitting/success/error states, single CONTACT_EMAIL source of truth"
affects: [contact-form-deployment-hardening]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline CSS-transition state swap (transition-opacity duration-200 ease-out) for discrete UI states, reserving useScrollReveal/GSAP for section-level entrance reveals only"
    - "Accessible honeypot hiding (absolute/w-px/h-px/overflow-hidden/opacity-0 + aria-hidden + tabIndex=-1 + autoComplete=off) instead of display:none"

key-files:
  created: []
  modified:
    - src/content/footer.ts
    - src/components/home/Footer.tsx
    - src/components/home/Footer.test.tsx

key-decisions:
  - "Used globalThis.fetch instead of global.fetch in tests — this project's tsconfig.app.json has no Node globals (types: [\"vite/client\"] only), so global.fetch failed tsc -b with TS2304"
  - "Installed npm dependencies in the worktree (node_modules was empty on worktree creation) so tests/typecheck could run"

patterns-established: []

requirements-completed: [CONT-01, CONT-02]

coverage:
  - id: D1
    description: "Footer form submits via POST /api/contact with preventDefault (fixes the prior native full-page-reload GET), sending workingOn/email/clarify as JSON"
    requirement: "CONT-01"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#Footer submission handling > submitting with honeypot empty calls fetch once with /api/contact, POST, and the 3 field values"
        status: pass
    human_judgment: false
  - id: D2
    description: "Honeypot field (name=company) silently short-circuits bot submissions with zero network calls, rendering the identical success block (D-10)"
    requirement: "CONT-01"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#Footer submission handling > submitting with honeypot filled never calls fetch and renders the success block"
        status: pass
    human_judgment: false
  - id: D3
    description: "Submitting/success/error UI states render exactly per 04-UI-SPEC.md: button disabled + aria-busy while in flight, success replaces form in place, error banners above form with field values preserved"
    requirement: "CONT-02"
    verification:
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#Footer submission handling > shows the submitting label, disables the button, and sets aria-busy on the form while in flight"
        status: pass
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#Footer submission handling > renders the success block in place of the form when fetch resolves ok"
        status: pass
      - kind: unit
        ref: "src/components/home/Footer.test.tsx#Footer submission handling > renders an error banner above the form and preserves field values when fetch resolves not-ok"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-08-04
status: complete
---

# Phase 4 Plan 03: Footer Contact Form Submission Handling Summary

**Footer's contact form now submits for real via `fetch('/api/contact')` with a honeypot spam short-circuit and three new inline UI states (submitting/success/error), replacing Phase 3's inert `type="submit"` markup that previously triggered a native full-page GET reload.**

## Performance

- **Duration:** 6 min
- **Started:** 2026-08-04T14:24:00+05:30
- **Completed:** 2026-08-04T14:28:15+05:30
- **Tasks:** 2 completed
- **Files modified:** 3

## Accomplishments
- `preventDefault()` fix (D-12): clicking "Send the Brief →" no longer causes a native full-page GET reload
- Real `handleSubmit`: honeypot check (`FormData.get('company')`) short-circuits to the success block with zero `fetch` calls when non-empty (D-10) — bot detection is invisible via response shape/timing
- Genuine submissions POST `{ workingOn, email, clarify }` as JSON to `/api/contact`; response drives `idle → submitting → success | error` state
- Submitting state: button label swaps to "Sending…", disabled, form gets `aria-busy="true"`, no layout shift
- Success state: form replaced in place by a `CheckCircle2` + "Brief received." confirmation block, 200ms opacity cross-fade
- Error state: `AlertCircle` + "Something didn't send." banner renders above the still-mounted form; all entered field values remain intact (uncontrolled inputs)
- `workingOn` input and `clarify` textarea now `required` (D-11); email was already required
- `footerContent` gained 5 new copy fields (`submittingLabel`, `successHeadline`, `successBody`, `errorHeadline`, `errorBody`) sourced verbatim from 04-UI-SPEC.md, all interpolating a single `CONTACT_EMAIL` constant (no second hardcoded email literal)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add success/error/submitting copy to src/content/footer.ts** - `80aa52f` (feat)
2. **Task 2: Wire real onSubmit handler, honeypot, and 3-state UI into Footer.tsx** - RED `e46dd62` (test) → GREEN `1033f96` (feat)

_TDD task (Task 2) has 2 commits: failing tests first, then the implementation that makes them pass. No refactor commit was needed._

## Files Created/Modified
- `src/content/footer.ts` - Extended `FooterContent` with 5 new copy fields; `contactEmail`/`contactEmailHref` now derive from a single `CONTACT_EMAIL` constant
- `src/components/home/Footer.tsx` - Real `onSubmit` handler (preventDefault, honeypot short-circuit, fetch, state machine); honeypot hidden input; `name`/`required` attributes on form fields; conditional submitting/success/error rendering
- `src/components/home/Footer.test.tsx` - 7 new tests covering required fields, honeypot input shape, fetch call shape, honeypot silent-reject, success/error/submitting states

## Decisions Made
- `global.fetch` → `globalThis.fetch` in tests: this project's `tsconfig.app.json` sets `"types": ["vite/client"]` only (no `@types/node`), so the bare `global` identifier isn't typed and `tsc -b` failed with TS2304. `globalThis` is the portable, correctly-typed equivalent and produces identical runtime behavior in jsdom.
- Ran `npm install` in the worktree before executing: the worktree checkout had an empty `node_modules/` (git worktrees don't share untracked directories), so `vitest`/`tsc` couldn't resolve `@gsap/react` and other deps until installed from the existing `package-lock.json`.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] `global.fetch` unresolved under project's tsconfig, causing `tsc -b` to fail**
- **Found during:** Task 2 verification (post-GREEN typecheck, run proactively beyond the plan's stated `npx vitest run` verification command)
- **Issue:** `Footer.test.tsx` used `global.fetch` per common Node test convention, but this project's `tsconfig.app.json` restricts `types` to `["vite/client"]` with no `@types/node`, so `global` is an unresolved identifier (`TS2304`) even though vitest ran the tests fine at runtime (jsdom exposes `global` as an alias, so tests still passed, but the codebase would fail `npm run build`'s `tsc -b` step)
- **Fix:** Replaced all 7 occurrences of `global.fetch` with `globalThis.fetch` (the standard, correctly-typed cross-environment global)
- **Files modified:** `src/components/home/Footer.test.tsx`
- **Verification:** `npx tsc -b` exits 0; `npx vitest run src/components/home/Footer.test.tsx` still passes all 17 tests
- **Committed in:** `1033f96` (Task 2 GREEN commit, bundled with the implementation since it's a same-file test correctness fix discovered while completing the task)

**2. [Rule 3 - Blocking] Worktree had no installed dependencies**
- **Found during:** Task 1, first verification run
- **Issue:** `npx vitest run` failed to resolve `@gsap/react` — the worktree's `node_modules/` was empty despite a valid `package-lock.json` being present (git worktrees don't inherit the main checkout's untracked `node_modules/`)
- **Fix:** Ran `npm install --no-audit --no-fund` in the worktree root, installing from the existing lockfile (226 packages, no version changes)
- **Files modified:** none tracked (node_modules is gitignored; package.json/package-lock.json untouched)
- **Verification:** Subsequent `npx vitest run` resolved all imports and ran successfully
- **Committed in:** n/a (no file changes to commit — node_modules is gitignored)

---

**Total deviations:** 2 auto-fixed (both Rule 3 - blocking issues, environment/typecheck only — no scope or behavior change)
**Impact on plan:** Zero impact on shipped functionality or scope. Both fixes were prerequisite/adjacent corrections needed to get the plan's own stated verification (`npx vitest run`) and the project's stricter `tsc -b` gate green; no architectural or feature changes.

## Issues Encountered
None beyond the two auto-fixed blocking issues documented above.

## User Setup Required
None - no external service configuration required. (Plan 04-02's `/api/contact` serverless function and any Resend API key setup are that plan's concern, not this one — this plan only wires the client-side `fetch` call.)

## Next Phase Readiness
- Footer.tsx's contact form is now feature-complete for CONT-01 (delivery) and CONT-02 (feedback) from the client side; it depends at runtime on Plan 04-02's `POST /api/contact` endpoint existing and returning `{ ok: boolean }` JSON — that endpoint was not read or verified by this plan (no `depends_on` declared, ran in the same wave)
- End-to-end verification (real form submission hitting a live `/api/contact` deployment and confirming email delivery) is out of this plan's scope — it belongs to whatever plan/checkpoint does live-deployment verification per STATE.md's Phase 4 blocker note ("require end-to-end verification against the live inbox... not local dev assumption")
- No known stubs: all 3 UI states (submitting/success/error) are fully wired to real state transitions, not hardcoded/mocked placeholders

## Self-Check: PASSED

All created/modified files confirmed present on disk; all 4 commit hashes (`80aa52f`, `e46dd62`, `1033f96`, `206a865`) confirmed present in `git log`.

---
*Phase: 04-contact-form-deployment-hardening*
*Completed: 2026-08-04*
