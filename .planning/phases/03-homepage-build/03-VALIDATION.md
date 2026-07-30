---
phase: 3
slug: homepage-build
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-30
---

# Phase 3 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.10 + @testing-library/react 16.3.2 + jsdom 29.1.1 |
| **Config file** | `vite.config.ts` (`test: {...}` block) |
| **Quick run command** | `npm run test -- <file>` |
| **Full suite command** | `npm run test` (`vitest run`) |
| **Estimated runtime** | ~10-20 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm run test -- <file just touched>`
- **After every plan wave:** Run `npm run test` (full suite)
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** ~20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 03-xx-xx | TBD | TBD | HOME-01 | — | Hero CTA points at real Selected Work section id, not `#hero` | unit | `npm run test -- src/routes/home.test.tsx` | ❌ W0 (existing file, hardcoded assertion must change) | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-02 | — | Proof strip renders all 4 stats from content module | unit | `npm run test -- src/components/home/ProofStrip.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-03 | — | Selected Work renders exactly the 6 real case studies in IA order | unit | `npm run test -- src/components/home/SelectedWork.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-04 | — | "See more" toggles the 5 deferred cards into view and back | unit | `npm run test -- src/components/home/SelectedWork.test.tsx` | ❌ W0 (same file) | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-05 | — | How I Work renders Studio Method words + 5-step Loop | unit | `npm run test -- src/components/home/HowIWork.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-06 | — | Skills & Tools renders 5 Operating Stack cards + aggregated `tags`-derived tool chips | unit | `npm run test -- src/components/home/SkillsTools.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-07 | — | About renders bio + `ImagePlaceholder` headshot | unit | `npm run test -- src/components/home/About.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | HOME-08 | — | Footer renders résumé link with correct `href="/resume.pdf"` and `download` attribute | unit | `npm run test -- src/components/home/Footer.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | CONT-04 | T-03-01 | Footer email/LinkedIn/Behance links correct `href`, `rel="noopener noreferrer"` on `target="_blank"` | unit | `npm run test -- src/components/home/Footer.test.tsx` | ❌ W0 (same file) | ⬜ pending |
| 03-xx-xx | TBD | TBD | D-10 | — | Deferred-slug route renders coming-soon copy, not 404/"not found" | unit | `npm run test -- src/routes/coming-soon.test.tsx` | ❌ W0 | ⬜ pending |
| 03-xx-xx | TBD | TBD | D-04 | — | Field Archive is a native scrollable region (`role="region"`, `aria-label`), no `pin`-based ScrollTrigger | unit | `npm run test -- src/components/home/FieldArchive.test.tsx` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

*Task IDs and wave assignments are TBD — the planner fills these in against the actual PLAN.md task breakdown.*

---

## Wave 0 Requirements

- [ ] `src/components/home/ProofStrip.test.tsx` — new
- [ ] `src/components/home/SelectedWork.test.tsx` — new
- [ ] `src/components/home/FieldArchive.test.tsx` — new
- [ ] `src/components/home/HowIWork.test.tsx` — new
- [ ] `src/components/home/SkillsTools.test.tsx` — new
- [ ] `src/components/home/About.test.tsx` — new
- [ ] `src/components/home/Footer.test.tsx` — new
- [ ] `src/routes/coming-soon.test.tsx` — new
- [ ] `src/routes/home.test.tsx` — existing file's hardcoded `ctaHref === '#hero'` assertion must be updated to the new target id (not a net-new file)
- [ ] No new shared fixtures/setup needed — `src/test/setup.ts` (jsdom `matchMedia` stub) already covers every new test's needs
- [ ] Framework install: none — Vitest/Testing Library already installed and configured

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Résumé PDF renders correctly and matches source `.docx` content | HOME-08 | `.docx`→PDF conversion is a one-time manual asset step (Pattern 3), not machine-verifiable content fidelity | Open `public/resume.pdf` after conversion; visually confirm all sections/text from `Hajra Farhin Resume UX.docx` are present and legible |
| Field Archive scroll feels native (mouse/touch/keyboard), no scroll-jacking regression | D-04 | Accessibility/feel of scroll behavior is not meaningfully unit-testable | Manually scroll the Field Archive section with mouse wheel, trackpad, and keyboard (Tab + arrow keys) in a real browser; confirm vertical page scroll is never hijacked |
| Full homepage scroll order matches IA (hero → proof strip → Selected Work → Field Archive → How I Work → Skills & Tools → About → Footer) | Roadmap Success Criteria #2 | Visual/structural ordering across the whole page, best confirmed by eye | Load `/` in a browser, scroll top to bottom, confirm section order visually |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
