---
phase: 04-contact-form-deployment-hardening
plan: 02
subsystem: api
tags: [vercel, resend, serverless, spa-routing, tsconfig]

requires:
  - phase: 04-contact-form-deployment-hardening (04-01)
    provides: honeypot/client-side wiring context and D-01..D-13 locked decisions consumed by this plan's server-side function

provides:
  - api/contact.ts Vercel serverless function delivering the contact form via Resend
  - vercel.json SPA catch-all rewrite fixing case-study deep-link 404s
  - tsconfig.api.json wired into the root tsconfig.json so tsc -b type-checks /api locally

affects: [04-03, 04-06]

tech-stack:
  added: []
  patterns:
    - "Web Standard fetch(request: Request) export for Vercel Functions (no @vercel/node dependency)"
    - "Resend { data, error } outcome forwarded as JSON status-code responses ({ ok, message })"
    - "Server-side re-validation of all client-submitted fields, never trusting client-side required attributes alone"

key-files:
  created: [api/contact.ts, api/contact.test.ts, vercel.json, tsconfig.api.json]
  modified: [tsconfig.json]

key-decisions:
  - "Followed the plan's exact success-body shape ({ ok: true }, no id field) over 04-RESEARCH.md's Code Examples section which included data?.id — the plan's Task 1 action text is the more specific/authoritative source for this task"
  - "Mocked the resend package's Resend class using a named function implementation (function ResendMockImpl() {...}) rather than an arrow function, matching this repo's existing vi.mock pattern in src/motion/MotionProvider.test.tsx — vi.fn().mockImplementation() requires 'function'/'class' semantics to behave as a constructor"

requirements-completed: [CONT-01, DEPL-02]

coverage:
  - id: D1
    description: "api/contact.ts Vercel Function delivers the contact form via Resend with server-side validation, newline/email-shape rejection, and { data, error } forwarded as JSON status codes"
    requirement: "CONT-01"
    verification:
      - kind: unit
        ref: "api/contact.test.ts#contactHandler.fetch (11 tests)"
        status: pass
      - kind: unit
        ref: "npx vitest run api/contact.test.ts"
        status: pass
    human_judgment: true
    rationale: "End-to-end email delivery to the live hazrafarhinwork@gmail.com inbox via a real Resend API call cannot be simulated in Vitest/jsdom without mocking away the exact thing being verified (04-RESEARCH.md Validation Architecture) — requires live verification in Plan 04-06's deployment checkpoint."
  - id: D2
    description: "vercel.json single catch-all rewrite (/(.*) -> /index.html) so direct-loaded/refreshed case-study routes resolve to the SPA shell instead of a Vercel 404"
    requirement: "DEPL-02"
    verification:
      - kind: unit
        ref: "node -e JSON.parse + rewrites-array assertion (inline verify command from 04-02-PLAN.md Task 2)"
        status: pass
    human_judgment: true
    rationale: "Rewrite behavior is evaluated by Vercel's live routing layer and cannot be exercised inside Vitest/jsdom (04-RESEARCH.md Validation Architecture DEPL-02 row) — requires live verification against the deployed URL in Plan 04-06."
  - id: D3
    description: "tsconfig.api.json wired into root tsconfig.json references so npm run build's tsc -b step type-checks api/contact.ts locally instead of only at Vercel's deploy-time build"
    verification:
      - kind: unit
        ref: "npm run build"
        status: pass
    human_judgment: false

duration: 2min
completed: 2026-08-04
status: complete
---

# Phase 4 Plan 2: Contact API Function + SPA Rewrite Summary

**Vercel serverless function (`api/contact.ts`) delivering the contact form via Resend with server-side validation and newline-injection rejection, plus the `vercel.json` SPA catch-all rewrite and a third `tsconfig.api.json` project reference so `/api` is locally type-checked.**

## Performance

- **Duration:** 2 min
- **Started:** 2026-08-04T15:39:14+05:30
- **Completed:** 2026-08-04T15:40:58+05:30
- **Tasks:** 3
- **Files modified:** 5

## Accomplishments

- `api/contact.ts` exports a dependency-free Web Standard `fetch(request: Request)` handler (Pattern 1) that rejects non-POST methods, catches unparsable JSON bodies, re-validates all three fields server-side (non-empty, email shape, no embedded `\r`/`\n`), and forwards Resend's `{ data, error }` outcome as `{ ok, message }` JSON with the correct HTTP status (200/400/405/502).
- `to`/`from` are hardcoded literal strings (`hazrafarhinwork@gmail.com` / `onboarding@resend.dev`) inside `api/contact.ts` — never destructured from user input — closing threat T-04-05.
- `RESEND_API_KEY` is read exclusively via `process.env.RESEND_API_KEY` inside `api/contact.ts`, never `VITE_`-prefixed anywhere in the codebase (T-04-01 mitigation, verified via repo-wide grep).
- `vercel.json` adds the single documented catch-all rewrite so direct loads/refreshes of `/case-study/*` resolve to `index.html` and React Router renders the correct page instead of a platform 404 (DEPL-02).
- `tsconfig.api.json` (new) is wired as a third `references` entry in root `tsconfig.json`, so `npm run build`'s `tsc -b` step now type-checks `api/contact.ts` locally rather than relying solely on Vercel's deploy-time build (Pitfall 4).

## Task Commits

Each task was committed atomically (Task 1 followed TDD RED → GREEN):

1. **Task 1 (RED): add failing test for api/contact.ts** - `64bd240` (test)
2. **Task 1 (GREEN): implement api/contact.ts Resend serverless function** - `a5dc109` (feat)
3. **Task 2: add vercel.json SPA catch-all rewrite** - `edcbca7` (feat)
4. **Task 3: wire tsconfig.api.json into root build** - `9aa618c` (feat)

**Plan metadata:** (this commit) `docs(04-02): complete api/contact.ts + vercel.json plan`

## TDD Gate Compliance

Task 1 had `tdd="true"`. Gate sequence verified in git log:
1. RED gate: `64bd240` (`test(04-02): add failing test for api/contact.ts serverless function`) — confirmed failing (`Failed to resolve import "./contact"`) before commit.
2. GREEN gate: `a5dc109` (`feat(04-02): implement api/contact.ts Resend serverless function`) — all 11 tests passing after commit.
3. No REFACTOR-only commit was needed; a mock-implementation fix (arrow function → named function for the `Resend` constructor mock) was folded into the GREEN commit since it was required to make GREEN pass, not a post-pass cleanup.

Both RED and GREEN gates present and correctly ordered — compliant.

## Files Created/Modified
- `api/contact.ts` - Vercel Function: Resend delivery with server-side validation, error forwarding, hardcoded to/from
- `api/contact.test.ts` - 11 Vitest cases covering method rejection, JSON-parse failure, required-field/email-shape/newline validation, success/error status mapping, and the D-02 to/from regression guard
- `vercel.json` - Single catch-all SPA rewrite (`/(.*)` → `/index.html`), no build-override keys
- `tsconfig.api.json` - New TS project scoped to `include: ["api"]`, `types: ["node"]`, `lib: ["ES2023", "DOM"]`, `strict: true`
- `tsconfig.json` - Added `{ "path": "./tsconfig.api.json" }` as a third `references` entry

## Decisions Made

- Followed 04-02-PLAN.md Task 1's action text exactly for the success-response shape (`Response.json({ ok: true }, { status: 200 })`, no `id` field) rather than 04-RESEARCH.md's illustrative Code Example (which included `id: data?.id`) — the plan's task-level action is the authoritative spec for what this task delivers; the research's code sample is illustrative context, not a literal requirement.
- Fixed the `vi.mock('resend', ...)` test double to use a named-function `Resend` class implementation instead of an arrow function, after the first test run failed with `TypeError: ... is not a constructor` — Vitest's `mockImplementation` requires `function`/`class` semantics for a mock to behave as a `new`-able constructor (same pattern already used for `Lenis` in `src/motion/MotionProvider.test.tsx`).

## Deviations from Plan

None - plan executed exactly as written. The mock-implementation fix above was a same-task TDD iteration (part of getting the already-planned Task 1 test to pass, not new scope), not a Rule 1-4 deviation.

## Issues Encountered

None beyond the expected TDD RED→GREEN cycle (test intentionally failed first due to `api/contact.ts` not existing, then the initial mock implementation needed a one-line fix to satisfy Vitest's constructor-mocking requirements).

## User Setup Required

None in this plan. `RESEND_API_KEY` must still be added as a Vercel Project Environment Variable during the D-06 manual checkpoint in a later plan (04-06) before live delivery works in production — this plan only wires the code path that reads it via `process.env`.

## Next Phase Readiness

- `api/contact.ts` is ready for Plan 04-03 to wire `Footer.tsx`'s `fetch('/api/contact', ...)` call against (per this plan's `key_links`).
- `vercel.json`'s rewrite is ready for live exercise during Plan 04-06's DEPL-02 verification checkpoint, once a Vercel project is connected.
- No blockers. `npm run build` and `npm test` (224/224 passing across 34 files) both pass with no regressions.

---
*Phase: 04-contact-form-deployment-hardening*
*Completed: 2026-08-04*
