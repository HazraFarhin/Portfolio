---
phase: 1
slug: foundation-motion-infrastructure
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-07-23
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 4.1.10 (Vite-native, Jest-compatible API) + `@testing-library/react` 16.3.2 + `jsdom` 29.1.1 |
| **Config file** | none yet — Wave 0 installs |
| **Quick run command** | `npx vitest run --reporter=dot` |
| **Full suite command** | `npx vitest run` |
| **Estimated runtime** | ~10 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run --reporter=dot`
- **After every plan wave:** Run `npx vitest run`
- **Before `/gsd-verify-work`:** Full suite must be green, plus the manual UAT pass below
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-01-XX | 01 | 1 | QUAL-01 | — | `useScrollReveal` registers a `ScrollTrigger`-driven `gsap.from` when motion is enabled | unit | `npx vitest run src/motion/useScrollReveal.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-XX | 01 | 1 | QUAL-01 | — | Native scroll/keyboard nav/anchor-link behavior preserved with Lenis mounted | manual-only | manual UAT: `Tab` through the Hero, click an anchor link, verify scroll lands correctly | n/a | ⬜ pending |
| 01-01-XX | 01 | 1 | QUAL-02 | — | `usePrefersReducedMotion` / `MotionProvider` context reflects `matchMedia` state and updates on `change` | unit | `npx vitest run src/motion/usePrefersReducedMotion.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-XX | 01 | 1 | QUAL-02 | — | `useScrollReveal` no-ops (zero `ScrollTrigger` instances) when reduced-motion context is `true` | unit | `npx vitest run src/motion/useScrollReveal.test.ts` | ❌ W0 | ⬜ pending |
| 01-01-XX | 01 | 1 | — | — | `Button`/`Card`/`Typography` render expected variant classnames | unit (smoke) | `npx vitest run src/components/ui/*.test.tsx` | ❌ W0 | ⬜ pending |
| 01-01-XX | 01 | 1 | — | — | No orphaned `ScrollTrigger` instances after route unmount (StrictMode safety) | integration | `npx vitest run src/motion/MotionProvider.test.tsx` — assert `ScrollTrigger.getAll().length` returns to 0 after unmount | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky. Task IDs finalized once PLAN.md is written by the planner.*

---

## Wave 0 Requirements

- [ ] `vitest.config.ts` (or `vite.config.ts` test block) — set `test.environment: 'jsdom'`, add a setup file registering `@testing-library/jest-dom` matchers
- [ ] `src/motion/useScrollReveal.test.ts` — covers QUAL-01/QUAL-02 hook behavior
- [ ] `src/motion/usePrefersReducedMotion.test.ts` (or `MotionProvider.test.tsx` if folded in) — covers QUAL-02
- [ ] `src/components/ui/*.test.tsx` — smoke tests for Button/Card/Typography primitives
- [ ] Framework install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Native scroll/keyboard nav/anchor-link behavior preserved with Lenis smooth-scroll mounted | QUAL-01 | jsdom cannot simulate real scroll physics or OS-level keyboard scroll | `Tab` through the Hero's focusable elements; click an in-page anchor link; verify scroll lands at the correct position and keyboard focus order is unaffected |
| OS-level `prefers-reduced-motion` toggle disables non-essential motion | QUAL-02 | Requires a real OS accessibility setting toggle, not simulatable in jsdom | Enable `prefers-reduced-motion: reduce` at the OS level, reload the Hero route, confirm no scroll-triggered reveal/parallax motion plays (content is still visible, just without animation) |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
