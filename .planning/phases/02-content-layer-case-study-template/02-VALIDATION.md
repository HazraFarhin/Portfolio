---
phase: 2
slug: content-layer-case-study-template
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: validated
nyquist_compliant: true
wave_0_complete: true
created: 2026-07-24
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.10 + `@testing-library/react` 16.3.2 + `jsdom` 29.1.1 (already configured, Phase 1) |
| **Config file** | `vite.config.ts` (`test:` block) + `src/test/setup.ts` |
| **Quick run command** | `npx vitest run --reporter=dot` (or a single changed test file) |
| **Full suite command** | `npm test` (`vitest run`) |
| **Estimated runtime** | ~10-15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=dot`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

Finalized against the 9-plan structure (02-01 through 02-09) produced by planning.

| Task ID | Plan | Wave | Requirement | Threat Ref | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------|--------------------|--------|
| 02-01-01 | 01 | 1 | CASE-04 | T-02-SC | manual-only (blocking human checkpoint) | n/a — human confirms js-yaml legitimacy | ⬜ pending |
| 02-01-02 | 01 | 1 | CASE-04 | T-02-SC | integration | `npm ls zod js-yaml react-markdown @types/js-yaml` | ⬜ pending |
| 02-02-01 | 02 | 1 | CASE-01, CASE-04 | T-02-01/T-02-02 | source | `grep -c '^## ' src/content/case-studies/{cad,verzion-cloud-migration,tata-capital-ai-interface}.md` | ⬜ pending |
| 02-02-02 | 02 | 1 | CASE-01, CASE-04 | T-02-01/T-02-02 | source | `ls src/content/case-studies/{mashreq,astrosure.ai,adreport.io}.md && grep -c '^## ' src/content/case-studies/{mashreq,astrosure.ai,adreport.io}.md` | ⬜ pending |
| 02-03-01 | 03 | 2 | CASE-04 | T-02-03/T-02-04 | unit | `npx vitest run src/content/case-studies/schema.test.ts` | ⬜ pending |
| 02-03-02 | 03 | 2 | CASE-04 | T-02-05 | unit | `npx vitest run src/content/case-studies/parse.test.ts` | ⬜ pending |
| 02-04-01 | 04 | 2 | CASE-02 | — | unit | `npx vitest run src/components/case-study/ImagePlaceholder.test.tsx && grep -c '<img' src/components/case-study/ImagePlaceholder.tsx` | ⬜ pending |
| 02-04-02 | 04 | 2 | CASE-02 | T-02-06 | unit | `npx vitest run src/components/case-study/ToolsUsed.test.tsx` | ⬜ pending |
| 02-04-03 | 04 | 2 | CASE-02 | T-02-06 | unit | `npx vitest run src/components/case-study/OutcomeImpact.test.tsx` | ⬜ pending |
| 02-05-01 | 05 | 3 | CASE-02 | — | unit | `npx vitest run src/components/case-study/Solution.test.tsx` | ⬜ pending |
| 02-06-01 | 06 | 3 | CASE-02 | — | unit | `npx vitest run src/components/case-study/Process.test.tsx` | ⬜ pending |
| 02-07-01 | 07 | 3 | CASE-02, CASE-03 | — | unit | `npx vitest run src/components/case-study/DraftBadge.test.tsx` | ⬜ pending |
| 02-07-02 | 07 | 3 | CASE-02, CASE-03 | — | unit | `npx vitest run src/components/case-study/Overview.test.tsx` | ⬜ pending |
| 02-08-01 | 08 | 3 | CASE-01, CASE-04 | (per-file isolation) | integration | `npx vitest run src/content/case-studies/loader.test.ts` | ⬜ pending |
| 02-08-02 | 08 | 3 | CASE-01, CASE-04 | — | unit | `npx vitest run src/content/case-studies/loader.test.ts` | ⬜ pending |
| 02-09-01 | 09 | 4 | CASE-02 | — | unit | `npx vitest run src/components/case-study/Challenge.test.tsx src/components/case-study/LearningsReflections.test.tsx` | ⬜ pending |
| 02-09-02 | 09 | 4 | CASE-01, CASE-02, CASE-03, CASE-04 | (unmatched-slug fallback) | unit | `npx vitest run src/components/case-study/NextProject.test.tsx src/routes/not-found.test.tsx` | ⬜ pending |
| 02-09-03 | 09 | 4 | CASE-01, CASE-02, CASE-03, CASE-04 | (full integration) | integration | `npx vitest run src/routes/case-study.test.tsx && npm test` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky — flips to ✅ as each task is executed by `/gsd-execute-phase`.*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.* Vitest/Testing Library/jsdom are already fully configured by Phase 1 (`vite.config.ts` `test:` block, `src/test/setup.ts`); this phase only adds test files alongside each new source file, no new framework install.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Role/outcome skimmable within the first viewport with no scrolling, across common viewport sizes | CASE-03 | jsdom asserts DOM order, not real viewport/visual layout | Load each of the 6 case-study routes at 1440×900 and 375×812; confirm Overview (role, client, outcome) is visible without scrolling, using the longest actual title/summary among the 6 placeholder files (per UI-SPEC's above-the-fold budget backstop) |
| Draft-content marker reads as unobtrusive, not a jarring warning banner | D-03 | Visual/tone judgment, not a DOM assertion | Visually inspect each case-study page's draft badge against Phase 1's dark cinematic design tokens |
| js-yaml package legitimacy re-confirmation | CASE-04 | Package Legitimacy Gate requires human sign-off on any `[SUS]`-flagged package regardless of research's own reasoning | Task 02-01-01's `<how-to-verify>` steps (npmjs.com publisher/downloads check) |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies (02-01-01 is the sole exception — a blocking human-verify checkpoint, not an automatable step)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (none — Phase 1 infrastructure fully covers this phase)
- [x] No watch-mode flags
- [x] Feedback latency < 15s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved (2026-07-26) — validated against the finalized 9-plan structure by `/gsd-plan-phase 2`'s plan-checker pass (0 blockers, 3 non-blocking documentation-hygiene warnings, all resolved).
