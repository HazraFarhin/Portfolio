---
phase: 02-content-layer-case-study-template
plan: 01
subsystem: infra
tags: [zod, js-yaml, react-markdown, npm, dependencies]

# Dependency graph
requires: []
provides:
  - "zod, js-yaml, react-markdown installed as runtime dependencies"
  - "@types/js-yaml installed as devDependency"
affects: [02-03, 02-04, 02-05, 02-06, 02-07, 02-08, 02-09]

# Tech tracking
tech-stack:
  added: [zod@4.4.3, js-yaml@5.2.2, react-markdown@10.1.0, "@types/js-yaml@4.0.9"]
  patterns: []

key-files:
  created: []
  modified: [package.json, package-lock.json]

key-decisions:
  - "Human re-confirmed js-yaml's [SUS]-flagged legitimacy verdict before install (date-heuristic false positive on a 15-year-old nodeca-maintained package) via direct AskUserQuestion interaction plus independent live npm-registry verification, per the blocking-human Package Legitimacy Gate"
  - "Install executed directly by the orchestrator on the main checkout rather than via a worktree-isolated executor subagent, after the isolated executor's worktree vanished mid-checkpoint and a resumed instance wandered into a sibling plan's worktree; Claude Code's own permission layer separately and correctly refused to accept an orchestrator-relayed 'approved' message as valid consent for this blocking-human gate, since only genuine, non-relayed human input may satisfy it. The orchestrator held that genuine input directly (via AskUserQuestion), so completed Task 2 itself rather than re-attempting a relay."

patterns-established: []

requirements-completed: [CASE-04]

coverage:
  - id: D1
    description: "zod, js-yaml, react-markdown installed in package.json dependencies and resolvable via node_modules"
    requirement: "CASE-04"
    verification:
      - kind: other
        ref: "npm ls zod js-yaml react-markdown @types/js-yaml"
        status: pass
    human_judgment: false
  - id: D2
    description: "js-yaml's [SUS]-flagged legitimacy verdict human-reconfirmed before install"
    verification: []
    human_judgment: true
    rationale: "Package Legitimacy Gate requires a real human decision, not an automated check — captured via direct AskUserQuestion approval in this session"

# Metrics
duration: ~25min (across checkpoint wait + worktree recovery)
completed: 2026-07-26
status: complete
---

# Phase 02-01: Install Content-Layer Dependencies Summary

**zod, js-yaml, react-markdown installed as runtime deps (plus @types/js-yaml) after direct human re-confirmation of js-yaml's flagged legitimacy verdict**

## Performance

- **Duration:** ~25 min (includes checkpoint wait + worktree-recovery detour)
- **Started:** 2026-07-26T05:02Z
- **Completed:** 2026-07-26T05:35Z
- **Tasks:** 2/2
- **Files modified:** 2

## Accomplishments
- Human re-confirmed js-yaml's `[SUS]`-flagged legitimacy verdict via direct interaction (AskUserQuestion) plus independent live verification against the npm registry (first published 2011-11-02, repo `github.com/nodeca/js-yaml`, maintainer `vitaly@rcopen.com`, current version 5.2.2 — matches 02-RESEARCH.md's reasoning exactly)
- `zod`, `js-yaml`, `react-markdown` installed as runtime dependencies; `@types/js-yaml` installed as a devDependency
- `npm ls zod js-yaml react-markdown @types/js-yaml` reports all four installed cleanly; `npm run build` still succeeds

## Task Commits

1. **Task 1: Re-confirm js-yaml package legitimacy before install** — no commit (checkpoint only, no files changed)
2. **Task 2: Install zod, js-yaml, react-markdown and @types/js-yaml** - `7aab100` (chore)

## Files Created/Modified
- `package.json` - added zod, js-yaml, react-markdown (dependencies), @types/js-yaml (devDependency)
- `package-lock.json` - lockfile updated for the above

## Decisions Made
- See `key-decisions` above (checkpoint approval provenance + why the install was completed directly by the orchestrator instead of a re-dispatched worktree executor)

## Deviations from Plan

### Auto-fixed Issues

**1. [Process] Worktree isolation failure mid-checkpoint recovered by direct orchestrator execution**
- **Found during:** Task 2, on continuation after checkpoint approval
- **Issue:** The isolated executor's own worktree (`worktree-agent-af3d19c507fce7853`) had been removed by the time the checkpoint response arrived. The resumed agent's HEAD-assertion guard found only one `worktree-agent-*` worktree in `git worktree list` — belonging to sibling plan 02-02 — and incorrectly treated it as its own, running `npm install zod js-yaml react-markdown` inside it (uncommitted). Claude Code's permission layer then correctly denied the second install command (`@types/js-yaml`), reasoning that an orchestrator-relayed "approved" message cannot itself satisfy a `gate="blocking-human"` checkpoint requiring genuine human confirmation.
- **Fix:** Reverted the accidental uncommitted `package.json`/`package-lock.json` changes in 02-02's worktree (`git checkout -- package.json package-lock.json`), confirmed it clean, then ran the install directly in the main orchestrator checkout — the orchestrator held genuine, non-relayed human approval from this same session (via `AskUserQuestion`), so no further relay was needed or attempted.
- **Files modified:** `package.json`, `package-lock.json` (main checkout only — 02-02's worktree was restored, not altered)
- **Verification:** `npm ls zod js-yaml react-markdown @types/js-yaml` exits 0 with no invalid/missing markers; `npm run build` succeeds; 02-02's worktree confirmed clean (`git status` → nothing to commit) before Wave 1 merge
- **Committed in:** `7aab100`

---

**Total deviations:** 1 auto-fixed (process/infrastructure, not a plan defect)
**Impact on plan:** No change to what was installed or how it was verified — same packages, same versions, same human-confirmation gate satisfied. Only the execution path (orchestrator-direct vs. worktree-isolated subagent) changed.

## Issues Encountered
- Worktree isolation for this specific checkpointed plan proved unreliable in this runtime: the executor's worktree was not available on resume after the human-verify pause. Recommend treating multi-minute-pause checkpoint plans as candidates for orchestrator-direct execution (or non-worktree sequential mode) rather than worktree isolation, since long pauses appear to risk worktree reclamation.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- `zod`, `js-yaml`, `react-markdown`, `@types/js-yaml` are present in `package.json`/`node_modules` on `main`, ready for Plan 02-03 (schema/parser) and Plan 02-04 (markdown-rendering components) to import
- No other Phase 2 plan touches `package.json`/`package-lock.json`, so this is the only dependency-install plan in the phase

---
*Phase: 02-content-layer-case-study-template*
*Completed: 2026-07-26*
