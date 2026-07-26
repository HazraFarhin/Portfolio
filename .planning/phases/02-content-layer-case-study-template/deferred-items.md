# Deferred Items

Out-of-scope discoveries logged during plan execution, per executor SCOPE BOUNDARY rules.
Not fixed as part of the plan that discovered them.

## From 02-10 (gap closure: G-02-7 Challenge pull-quotes)

**Item:** `npm test` in this worktree fails to resolve `@gsap/react` from `src/motion/useScrollReveal.ts`, causing 2 test files (`src/routes/home.test.tsx` and one other consumer of `useScrollReveal`) to fail as unresolved import errors. All other 20 test files (116 tests) pass.

**Why deferred, not fixed:** This plan is a content-only change (6 markdown files in `src/content/case-studies/`). It cannot affect module resolution of `@gsap/react` in `src/motion/useScrollReveal.ts` or its consumers -- an unrelated file this plan does not touch. Confirmed pre-existing/environmental:
- `@gsap/react` is declared in `package.json` dependencies and present at `/Users/hazrafarhin/Desktop/Repositories/Portfolio/node_modules/@gsap/react` (main repo), but this worktree's local `node_modules/` is effectively empty (only a `.vite` cache dir), relying on Node's directory-walk-up resolution -- which fails specifically for this one scoped package in Vite's transform step while succeeding for every other dependency.
- Also observed: this worktree only has 22 test files (116 tests) versus the 75 files / 407 tests recorded in ROADMAP.md as of the `main` branch HEAD -- this worktree's branch point (`dee71df6`) predates later test files added on `main` after the worktree was created. Not related to this plan's changes either.

**Directly relevant tests confirmed passing:** `src/components/case-study/*` (10 files, 50 tests, including `Challenge.test.tsx`) and `src/content/case-studies/*.test.ts` (3 files, 31 tests, including `parse.test.ts` and `loader.test.ts`) -- all green. These are the tests that actually exercise the 6 edited markdown files and the Challenge blockquote rendering path.

**Suggested follow-up:** Not a code defect to fix via a plan; likely resolved by re-running `npm install` in the worktree or by the worktree lifecycle syncing with `main` before/after merge. Flag to the orchestrator/user if it persists after this worktree is merged back.
