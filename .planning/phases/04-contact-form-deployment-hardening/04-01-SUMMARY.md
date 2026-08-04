---
phase: 04-contact-form-deployment-hardening
plan: 01
subsystem: infra
tags: [npm, resend, dependency, supply-chain]

requires: []
provides:
  - "resend npm package installed in package.json dependencies, ready for Plan 04-02's api/contact.ts import"
affects: [04-02]

tech-stack:
  added: [resend@^6.18.1]
  patterns: []

key-files:
  created: []
  modified: [package.json, package-lock.json]

key-decisions:
  - "Human explicitly re-confirmed resend's [SUS]-flagged legitimacy verdict (9M+ weekly downloads, verifiable github.com/resend/resend-node source) before install, per the Package Legitimacy Gate (T-04-SC)."
  - "@vercel/node deliberately NOT installed — Pattern 1's dependency-free Web Standard fetch export supersedes it for Plan 04-02."

patterns-established: []

requirements-completed: [CONT-01]

coverage:
  - id: D1
    description: "resend listed in package.json dependencies and resolvable via npm ls resend with no invalid/missing markers, only after human legitimacy re-confirmation"
    requirement: "CONT-01"
    verification:
      - kind: other
        ref: "npm ls resend"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-08-04
status: complete
---

# Phase 04 Plan 01: Install resend SDK Summary

**resend@6.18.1 installed as a runtime dependency after human legitimacy re-confirmation of its [SUS]-flagged Package Legitimacy Audit verdict**

## Performance

- **Duration:** ~6 min (checkpoint wait excluded)
- **Completed:** 2026-08-04
- **Tasks:** 2/2
- **Files modified:** 2

## Accomplishments
- Human reviewed and explicitly approved installing `resend` after reviewing its npm registry page, weekly download count, and `github.com/resend/resend-node` source repo
- `resend@6.18.1` installed in `package.json` dependencies and `node_modules`, ready for Plan 04-02 to import inside `api/contact.ts`
- Confirmed `@vercel/node` is NOT installed (Pattern 1's dependency-free Web Standard `fetch` export supersedes it)

## Task Commits

Each task was committed atomically:

1. **Task 1: Re-confirm resend package legitimacy before install** - checkpoint only, no code changes, no commit
2. **Task 2: Install resend** - `7c79bcb` (feat)

## Files Created/Modified
- `package.json` - added `resend: "^6.18.1"` to dependencies
- `package-lock.json` - lockfile updated for the new dependency tree (5 packages added)

## Decisions Made
- Human explicitly typed "approved" directly in the orchestrator conversation after reviewing the legitimacy evidence (download counts, source repo link) called out in the checkpoint — satisfying the `gate="blocking-human"` requirement.
- `npm ls @vercel/node` confirmed empty — no unneeded dependency added.

## Deviations from Plan

**1. [Process] Task 2 executed by the orchestrator directly, not the dispatched executor subagent**
- **Found during:** Task 1 checkpoint resolution
- **Issue:** The dispatched worktree-isolated executor subagent made no code changes in Task 1 (as designed), so Claude Code's harness auto-cleaned up its empty worktree after it returned the checkpoint. When the orchestrator relayed the human's approval back to that subagent via SendMessage, the subagent correctly refused to treat a coordinator-relayed message as valid human consent for a `gate="blocking-human"` checkpoint (this is the intended defense-in-depth behavior described in the plan's threat model, T-04-SC) — and its worktree no longer existed to act on regardless.
- **Fix:** Since the human had genuinely and directly typed "approved" in the live conversation with the orchestrator (satisfying the plan's `<resume-signal>` and `<done>` criteria), the orchestrator performed Task 2 directly on the main checkout: `npm install resend`, verified via `npm ls resend` / `npm ls @vercel/node`, confirmed `npm run build` still succeeds, and committed with hooks enabled (no `--no-verify`).
- **Files modified:** package.json, package-lock.json (as planned — no scope change)
- **Verification:** `npm ls resend` exits 0 with `resend@6.18.1` and no invalid/missing markers; `npm ls @vercel/node` reports empty; `npm run build` completes successfully; `git diff package.json` shows only the single expected dependency line added.
- **Committed in:** `7c79bcb`

---

**Total deviations:** 1 (process-only — same human approval, same commands, different actor executing them; no scope or content deviation from the plan)
**Impact on plan:** None on outcome. `resend` is installed exactly as planned, gated on the same human review the plan required.

## Issues Encountered
- `npm audit` reports 2 pre-existing vulnerabilities (postcss via vite, undici via jsdom) — confirmed both are transitive dependencies unrelated to `resend`'s install (verified via `npm ls postcss` / `npm ls undici`), not introduced by this plan.

## User Setup Required
None - no external service configuration required. (Vercel/Resend API key configuration is deferred to Plan 04-06's deployment checkpoint.)

## Next Phase Readiness
`resend` is installed and ready for Plan 04-02 to import inside `api/contact.ts`. No blockers.

---
*Phase: 04-contact-form-deployment-hardening*
*Completed: 2026-08-04*
