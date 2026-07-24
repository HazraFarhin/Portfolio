---
phase: 2
slug: content-layer-case-study-template
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
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

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 02-01-XX | 01 | 1 | CASE-04 | — | `CaseStudyFrontmatterSchema.safeParse()` rejects malformed/missing frontmatter fields with a structured error | unit | `npx vitest run src/content/case-studies/schema.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-XX | 01 | 1 | CASE-04 | — | `parseCaseStudyFile()` throws a file-path-specific error for a malformed fixture; succeeds for a valid fixture | unit | `npx vitest run src/content/case-studies/parse.test.ts` | ❌ W0 | ⬜ pending |
| 02-01-XX | 01 | 1 | CASE-04 | — | No hardcoded slug literals exist in router/component source (content-only-change guarantee) | manual/code-review (grep-based) | `grep -rn "cad\|verzion-cloud-migration\|tata-capital-ai-interface\|mashreq\|astrosure\.ai\|adreport\.io" src/routes src/components src/router.tsx` returns zero matches outside `src/content/case-studies/*.md` | n/a | ⬜ pending |
| 02-02-XX | 02 | 2 | CASE-01 | — | Each of the 6 slugs resolves to a rendered `CaseStudyPage` (route + loader lookup succeeds) | integration | `npx vitest run src/routes/case-study.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-XX | 02 | 2 | CASE-01 | — | An unmatched slug (deferred slug or typo) renders a "not found" fallback, not a crash | unit | `npx vitest run src/routes/case-study.test.tsx -t "not found"` | ❌ W0 | ⬜ pending |
| 02-02-XX | 02 | 2 | CASE-02 | — | `CaseStudyPage` renders all 7 section headings (Overview, Tools Used, Outcome & Impact, The Challenge, Process, Solution, Learnings & Reflections) in that order for a fixture | unit | `npx vitest run src/routes/case-study.test.tsx -t "renders all sections in order"` | ❌ W0 | ⬜ pending |
| 02-02-XX | 02 | 2 | CASE-02 | — | Process section renders all 5 sub-stages (Discovery & Research, Define, Ideate & Wireframe, Design & Prototype, Test & Iterate) | unit | `npx vitest run src/components/case-study/Process.test.tsx` | ❌ W0 | ⬜ pending |
| 02-02-XX | 02 | 2 | CASE-03 | — | Overview section (role, client, timeline) appears in the DOM before Tools Used/Challenge/Process/Solution sections | unit (structural proxy for "above the fold") | `npx vitest run src/routes/case-study.test.tsx -t "overview renders before body sections"` | ❌ W0 | ⬜ pending |
| 02-02-XX | 02 | 2 | D-03 | — | Draft badge renders when `status === 'Draft'`, absent when `'Published'` | unit | `npx vitest run src/components/case-study/DraftBadge.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky. Task IDs finalized once PLAN.md is written by the planner.*

---

## Wave 0 Requirements

- [ ] `src/content/case-studies/schema.test.ts` — covers CASE-04 (schema validation)
- [ ] `src/content/case-studies/parse.test.ts` — covers CASE-04 (frontmatter/body parsing)
- [ ] `src/routes/case-study.test.tsx` — covers CASE-01, CASE-02, CASE-03 (integration: route → loader → full page render)
- [ ] `src/components/case-study/Process.test.tsx` — covers CASE-02 (5 sub-stages)
- [ ] `src/components/case-study/DraftBadge.test.tsx` — covers D-03
- [ ] No new test-framework installation needed — Vitest/Testing Library/jsdom already fully configured by Phase 1; this phase only adds test files

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Role/outcome skimmable within the first viewport with no scrolling, across common viewport sizes | CASE-03 | jsdom asserts DOM order, not real viewport/visual layout | Load each of the 6 case-study routes in a browser at common desktop/laptop viewport heights; confirm Overview (role, client, outcome) is visible without scrolling |
| Draft-content marker reads as unobtrusive, not a jarring warning banner | D-03 | Visual/tone judgment, not a DOM assertion | Visually inspect each case-study page's draft badge against Phase 1's dark cinematic design tokens |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
