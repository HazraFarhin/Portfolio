---
phase: 01-foundation-motion-infrastructure
verified: 2026-07-24T11:10:00Z
status: gaps_found
score: 2/4 must-haves verified
behavior_unverified: 1
overrides_applied: 0
gaps:
  - truth: "Enabling prefers-reduced-motion at the OS level automatically disables non-essential motion on every animated component built so far, with no per-component opt-in code required (ROADMAP Success Criterion #3)"
    status: failed
    reason: "MotionProvider's useEffect that instantiates Lenis (JS-driven smooth-scroll interception) runs unconditionally with an empty dependency array. It never checks prefersReducedMotion before calling `new Lenis(...)`, wiring it to gsap.ticker, and driving the eased/physics-based scroll. Lenis's scroll hijacking is itself non-essential motion (it replaces native scroll with an animated/eased scroll), and it is NOT gated by the reduced-motion context that MotionProvider itself sources and exposes. Only useScrollReveal's GSAP reveal tweens are correctly gated (confirmed via tests) -- the Lenis smooth-scroll layer is not. The CSS `@media (prefers-reduced-motion: reduce)` safety net in src/index.css only zeroes CSS animation/transition durations and cannot touch Lenis's JS-driven scroll interception. This is a code-level defect confirmed by direct source read, not merely a hypothetical -- it was also independently flagged as WR-01 in 01-REVIEW.md."
    artifacts:
      - path: "src/motion/MotionProvider.tsx"
        issue: "Lines 29-50: the Lenis-instantiation useEffect has an empty dependency array (`[]`) and no `if (prefersReducedMotion) return;` guard, so Lenis is always instantiated and always drives scroll via gsap.ticker regardless of the OS-level reduced-motion setting."
    missing:
      - "Gate the Lenis-instantiation useEffect on prefersReducedMotion (e.g. `if (prefersReducedMotion) return;` at the top of the effect, with `prefersReducedMotion` added to the dependency array so toggling the OS setting mid-session also tears down/re-evaluates Lenis), OR document and justify why Lenis's own scroll-easing is considered 'essential' motion exempt from this criterion -- current code does neither."
deferred: []
behavior_unverified_items:
  - truth: "A demo/placeholder route exhibits GSAP + Lenis-driven smooth-scroll and scroll-triggered reveal motion without breaking native keyboard navigation or scroll-to-anchor behavior (ROADMAP Success Criterion #2)"
    test: "Run `npm run dev`, open the Hero route (/) in a real browser. Tab through focusable elements (the CTA anchor) and confirm correct focus order + visible focus ring. Click the CTA (href=\"#hero\") and confirm the Lenis-driven scroll lands correctly with no jump/desync. Confirm the GSAP scroll-triggered reveal plays on scroll into view."
    expected: "Keyboard tab order reaches the CTA anchor with a visible focus-visible ring; clicking the CTA scrolls to the #hero anchor without a jump or desync; the Hero's scroll-reveal animation plays as content enters the viewport."
    why_human: "jsdom cannot simulate real scroll physics, OS-level keyboard focus/tab order, or Lenis's actual scroll interception in a real browser. This exact check is 01-06-PLAN.md's own Task 3 `<human-check>` block, explicitly deferred to end-of-phase UAT per workflow.human_verify_mode: end-of-phase, and 01-06-SUMMARY.md itself records this check as 'has not yet been performed by a human' (D5, human_judgment: true)."
human_verification:
  - test: "Run `npm run dev`, open the Hero route (/) in a real browser. Tab through focusable elements (the CTA anchor) and confirm correct focus order + visible focus ring. Click the CTA (href=\"#hero\") and confirm the Lenis-driven scroll lands correctly with no jump/desync."
    expected: "Keyboard tab order reaches the CTA anchor with a visible focus-visible ring; clicking the CTA scrolls to the #hero anchor without a jump or desync."
    why_human: "jsdom cannot simulate real scroll physics or OS-level keyboard focus/tab order; this is the exact deferred check from 01-06-PLAN.md's Task 3 human-check block, not yet performed (per 01-06-SUMMARY.md D5)."
  - test: "Enable `prefers-reduced-motion: reduce` at the OS level, reload the Hero route, and observe both (a) whether the GSAP scroll-triggered reveal is suppressed with content immediately visible (expected to pass per useScrollReveal's tests), and (b) whether Lenis's eased/physics-based scroll interception is still active despite the OS setting (expected to still be active -- this is the gap already confirmed by source read and listed above, included here so a human can see the live symptom, e.g. scroll still feels 'smoothed'/eased rather than native, even with the OS setting on)."
    expected: "Per the stated success criterion, ALL non-essential motion should be disabled, including Lenis's scroll easing. Current code will show the GSAP reveal suppressed correctly but Lenis's smooth-scroll still active."
    why_human: "Confirms the real, user-visible symptom of the code-level gap already identified; also closes 01-06-PLAN.md's Task 3 human-check item for the OS-level reduced-motion toggle."
---

# Phase 1: Foundation & Motion Infrastructure Verification Report

**Phase Goal:** The technical foundation (build tooling, centralized motion system, routing shell, UI primitives) is in place so every later phase builds features on established patterns instead of inventing new ones per component.
**Verified:** 2026-07-24T11:10:00Z
**Status:** gaps_found
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | App builds and runs on Vite + React + TS + Tailwind CSS v4 with a working routing shell (root layout + router), no CDN script tags carried over | ✓ VERIFIED | `npm run build` exits 0 (tsc -b && vite build, 186ms, dist/ produced). `grep -rn "cdn.tailwindcss.com\|cdnjs.cloudflare.com\|jsdelivr.net/npm/lenis\|unpkg.com/lucide" index.html src/` returns zero matches. `src/router.tsx` uses `createBrowserRouter` (Data Mode) from `'react-router'`; `src/App.tsx` renders `<Outlet />` as the root layout. |
| 2 | A demo/placeholder route exhibits GSAP + Lenis-driven smooth-scroll and scroll-triggered reveal motion without breaking native keyboard navigation or scroll-to-anchor behavior | ⚠️ PRESENT_BEHAVIOR_UNVERIFIED | The Hero route (`src/routes/home.tsx`) calls `useScrollReveal(heroRef)` (GSAP/ScrollTrigger-driven reveal, unit-tested) and is wrapped in `MotionProvider` (Lenis-driven smooth-scroll) at the app root (`src/main.tsx`). The animation-registration half is code-present and unit-verified. The "without breaking native keyboard navigation or scroll-to-anchor behavior" half is a real-browser behavioral claim that jsdom cannot exercise — 01-06-PLAN.md's own Task 3 `<human-check>` defers this exact check, and 01-06-SUMMARY.md (D5) explicitly records it as not yet performed by a human. See Human Verification below. |
| 3 | Enabling `prefers-reduced-motion` at the OS level automatically disables non-essential motion on every animated component built so far, with no per-component opt-in code required | ✗ FAILED | Confirmed by direct source read of `src/motion/MotionProvider.tsx` (lines 29-50): the `useEffect` that instantiates `Lenis` and wires it to `gsap.ticker` runs unconditionally (`[]` deps, no `prefersReducedMotion` guard). Lenis's JS-driven scroll interception is not disabled when reduced motion is active. `useScrollReveal`'s GSAP reveal tweens ARE correctly gated (unit-tested, `ScrollTrigger.getAll().length === 0` under reduced motion) — but Lenis's own smooth-scroll is not, so the criterion is not fully met. This is independently confirmed as WR-01 in `01-REVIEW.md`. No override recorded for this deviation. |
| 4 | A shared `components/ui/` primitive set (buttons, cards, typography) exists and is reused rather than redefined per section | ✓ VERIFIED | `src/components/ui/{Button,Card,Typography}.tsx` exist, each with a passing test file (14 tests total). `grep` across `src/` for redefined button/card-like class combinations (`rounded-full.*px-lg`, `backdrop-blur-lg`) outside `components/ui/` returns zero matches — the only consumer, `src/routes/home.tsx`, imports and composes `Button`/`Card`/`Label`/`Body` rather than redefining styling inline. |

**Score:** 2/4 truths verified (1 present-but-behavior-unverified, 1 failed)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `src/motion/usePrefersReducedMotion.ts` | matchMedia read + change subscription, boolean | ✓ VERIFIED | Exports `usePrefersReducedMotion(): boolean`; mount-time sync read + live `'change'` listener with cleanup; 4 passing tests. |
| `src/motion/MotionProvider.tsx` | Owns Lenis init, GSAP/ScrollTrigger registration, reduced-motion Context | ⚠️ HOLLOW (partial) | Context sourcing and GSAP plugin registration correct and tested; Lenis instantiation is unconditional (not gated by the very context value the component exposes) — see Gap above. |
| `src/motion/useScrollReveal.ts` | Public scroll-reveal authoring hook built on `useGSAP` | ✓ VERIFIED | Built on `@gsap/react`'s `useGSAP`; correctly no-ops under reduced motion (unit-tested); honors custom options; StrictMode-safe cleanup verified. |
| `src/components/ui/Button.tsx` | primary/ghost variants, pill, motion-safe hover lift, polymorphic `<a>`/`<button>` | ✓ VERIFIED | 5 passing tests; `motion-safe:hover:-translate-y-0.5` present with no unguarded `hover:-translate-y` variant. |
| `src/components/ui/Card.tsx` | glass variant (`rounded-3xl`, `backdrop-blur-lg`) | ✓ VERIFIED | 3 passing tests; no clipping/truncation on long content. |
| `src/components/ui/Typography.tsx` | Label/Body/Heading/Display primitives | ✓ VERIFIED | 6 passing tests; `as` tag override supported; no truncation. |
| `src/router.tsx` | Data Mode route tree, home + reserved `/case-study/:slug` shape | ✓ VERIFIED | `createBrowserRouter` from `'react-router'`; reserved shape present as a comment. |
| `src/routes/home.tsx` | Hero composed from `components/ui/` + `useScrollReveal` + `heroContent` | ✓ VERIFIED | Composes `Label`/`Body`/`Button`/`Card` + `useScrollReveal(heroRef)`; copy sourced by field reference from `src/content/hero.ts`. |
| `src/index.css` | Single `@theme` token block, dark-only, global reduced-motion CSS safety net | ✓ VERIFIED | One `@theme` block (grep confirms count=1); no `tailwind.config.*` file exists; `@media (prefers-reduced-motion: reduce)` block present (CSS-only scope, does not cover Lenis — see Gap). |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `src/motion/MotionProvider.tsx` | `src/motion/usePrefersReducedMotion.ts` | Calls `usePrefersReducedMotion()` internally | ✓ WIRED | Confirmed at line 27; context value sourced from the hook, no duplicate `matchMedia` read anywhere else in `src/` (grep confirms zero `matchMedia` references outside `src/motion/`). |
| `src/motion/useScrollReveal.ts` | `src/motion/MotionProvider.tsx` | Reads `usePrefersReducedMotionContext()` | ✓ WIRED | Confirmed at line 32; gates the `gsap.from` call on the context value. |
| `src/routes/home.tsx` | `src/content/hero.ts` | Renders `heroContent` fields by reference | ✓ WIRED | `heroContent.eyebrow/.statement/.ctaLabel/.ctaHref/.metaDescription/.metaStatus` all consumed by reference; no duplicated inline copy. |
| `src/routes/home.tsx` | `src/motion/useScrollReveal.ts` | Calls `useScrollReveal(heroRef)` on the Hero root ref | ✓ WIRED | Confirmed at line 16. |
| `src/main.tsx` | `src/motion/MotionProvider.tsx` | Wraps `RouterProvider` in `MotionProvider` at app root | ✓ WIRED | `StrictMode > MotionProvider > RouterProvider` confirmed. |
| `src/motion/MotionProvider.tsx` (internal) | Lenis instance | Gated by `prefersReducedMotion` | ✗ NOT WIRED | The Lenis-instantiation effect does not read `prefersReducedMotion` at all before running — this is the confirmed gap. |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Production build succeeds | `npm run build` | `tsc -b && vite build` exit 0, `dist/` produced (98 modules, 186ms) | ✓ PASS |
| Full test suite passes | `npm test` (vitest run) | 7 test files, 31 tests, all passed, 1.16s | ✓ PASS |
| No CDN script/link tags remain | `grep -rn "cdn.tailwindcss.com\|cdnjs.cloudflare.com\|jsdelivr.net/npm/lenis\|unpkg.com/lucide" index.html src/` | 0 matches | ✓ PASS |
| No duplicate `matchMedia` reads outside `src/motion/` | `grep -rn "matchMedia" src/ | grep -v src/motion/ | grep -v .test.` | 0 matches | ✓ PASS |
| Lenis instantiation gated by reduced-motion | Direct read of `src/motion/MotionProvider.tsx:29-50` | `useEffect(() => { const lenis = new Lenis(...); ...}, [])` — no `prefersReducedMotion` check anywhere in the effect body or dependency array | ✗ FAIL — confirms the Gap above |
| Real-browser keyboard/scroll/reduced-motion behavior | N/A — requires running browser | Not run (not a spot-checkable command) | ? SKIP — routed to Human Verification |

### Requirements Coverage

| Requirement | Source Plans | Description | Status | Evidence |
|--------------|--------------|--------------|--------|----------|
| QUAL-01 | 01-01 through 01-06 (all tagged) | User experiences GSAP/Lenis-driven scroll motion matching the Axisform reference's language without breaking native scroll/keyboard navigation | ? NEEDS HUMAN (partially blocked) | Motion mechanism (GSAP+Lenis) is built and wired; the "without breaking native scroll/keyboard navigation" clause is unverified pending the real-browser human-check (01-06-PLAN.md Task 3). REQUIREMENTS.md correctly still shows this as Pending. |
| QUAL-02 | 01-01 through 01-06 (all tagged) | User with `prefers-reduced-motion` enabled sees all non-essential motion disabled automatically | ✗ BLOCKED | GSAP reveal tweens are correctly gated, but Lenis's smooth-scroll is not (confirmed gap above) — the requirement as literally worded ("all non-essential motion") is not yet satisfied. REQUIREMENTS.md correctly still shows this as Pending. |

No orphaned requirements found: REQUIREMENTS.md's Phase 1 mapping (QUAL-01, QUAL-02) matches exactly what every plan's frontmatter declares.

### Anti-Patterns Found

None. Scanned all phase-modified source files (`src/motion/*`, `src/routes/home.tsx`, `src/router.tsx`, `src/main.tsx`, `src/App.tsx`, `src/components/ui/*`, `src/index.css`, `src/lib/cn.ts`, `src/content/hero.ts`) for `TBD`/`FIXME`/`XXX`/`TODO`/`HACK`/`PLACEHOLDER`/stub patterns — zero matches. The code-review report (`01-REVIEW.md`) independently found 0 critical issues, 4 warnings (WR-01 through WR-04), 4 info items; WR-01 is the same reduced-motion gap surfaced here as a BLOCKER-level gap given it directly maps to a stated ROADMAP Success Criterion (not merely a code-quality nitpick). WR-02/WR-03/WR-04 (Button prop-typing looseness, missing router `errorElement`, empty-string `href` edge case) and the info items (IN-01 through IN-04) are real but do not block this phase's stated success criteria — they are worth carrying forward as follow-up but are not gating this verification.

### Human Verification Required

#### 1. Real-browser keyboard focus, CTA scroll-to-anchor, and reduced-motion toggle (deferred from 01-06-PLAN.md Task 3)

**Test:** Run `npm run dev`, open the Hero route (`/`) in a real browser. (a) Tab through focusable elements and confirm the CTA anchor receives keyboard focus in the correct order with a visible focus-visible ring. (b) Click the CTA (`href="#hero"`) and confirm the browser/Lenis-driven scroll lands correctly with no jump/desync. (c) Enable `prefers-reduced-motion: reduce` at the OS level, reload, and confirm the Hero's scroll-triggered reveal does NOT play while content is immediately visible — and separately observe whether Lenis's scroll easing is still active (expected: yes, still active, confirming the gap above as a live symptom). (d) Disable the OS setting, reload again, confirm the reveal plays.

**Expected:** Keyboard nav and scroll-to-anchor behave natively/correctly; GSAP reveal is correctly suppressed under reduced motion; Lenis's smooth-scroll easing is very likely still perceptible even with reduced motion enabled (this would visually confirm the code-level gap).

**Why human:** jsdom cannot simulate real scroll physics, real keyboard tab order, or OS-level `prefers-reduced-motion` toggling. This is the exact deferred check documented in `01-06-PLAN.md`'s Task 3 `<human-check>` block and explicitly recorded as not-yet-performed in `01-06-SUMMARY.md` (coverage id D5, `human_judgment: true`).

### Gaps Summary

Two of the four ROADMAP Success Criteria for Phase 1 are not fully satisfied:

1. **Success Criterion #3 is FAILED, not merely unverified.** This is confirmed directly from the source code, independent of any human/browser check: `MotionProvider`'s Lenis-instantiation `useEffect` never reads `prefersReducedMotion` before running, so Lenis's JS-driven smooth-scroll interception remains active for users who have opted out of motion at the OS level. Only the GSAP scroll-reveal layer (`useScrollReveal`) is correctly gated. The project's own code review (`01-REVIEW.md`, WR-01) independently identified this exact defect and proposed the fix (gate the effect on `prefersReducedMotion`, add it to the dependency array). Given the phase's explicit purpose is to build the "centralized, reduced-motion-safe" motion system every later phase relies on (per ROADMAP's one-line Phase 1 description), this is a BLOCKER, not a warning-level nitpick.

2. **Success Criterion #2's real-browser clause is unverified**, not failed — the code and unit tests support the claim that reveal motion works and doesn't structurally interfere with native scroll (Lenis wraps rather than replaces the DOM's native scroll target), but the actual keyboard-navigation and scroll-to-anchor behavior in a real browser has never been checked by a human, and the plan that was supposed to close this (01-06-PLAN.md Task 3's `<human-check>`) explicitly says so in its own SUMMARY.

Both gaps trace back to the same root cause area (`MotionProvider`/Lenis) and should likely be closed together: fix the Lenis gating (a straightforward code change matching the WR-01 fix already proposed in `01-REVIEW.md`), then perform the deferred human-check with the fix in place (verifying both that reduced motion now also disables Lenis's easing, and that keyboard/scroll-to-anchor behavior remains correct).

REQUIREMENTS.md's decision to leave QUAL-01 and QUAL-02 as Pending is correct and should NOT be changed to complete until both gaps above are closed.

---

_Verified: 2026-07-24T11:10:00Z_
_Verifier: Claude (gsd-verifier)_
