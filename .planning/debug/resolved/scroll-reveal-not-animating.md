---
status: resolved
trigger: "DATA_START UAT report: 'pass but it's all loading at once' -- homepage section order is correct top-to-bottom, but the GSAP scroll-reveal animation isn't visibly staggering/animating sections in as the user scrolls at http://localhost:5173/. Everything appears to render/show immediately instead of fading/sliding up on scroll into view. DATA_END"
created: 2026-07-31T04:19:47Z
updated: 2026-07-31T09:15:00Z
resolution: "User confirmed the primary hypothesis: browser/OS 'prefers-reduced-motion' was enabled during the UAT session. Not a code defect -- this is QUAL-02's intended behavior. User disabled the setting and re-verified scroll-reveal now animates correctly. No code changes required for this session."
---

## Current Focus

hypothesis: CONFIRMED (primary) -- `prefersReducedMotionContext()` is evaluating to `true` in the tester's real browser session, causing `useScrollReveal`'s `if (!ref.current || prefersReducedMotion) return;` guard (src/motion/useScrollReveal.ts:36) to skip `gsap.from()`/ScrollTrigger registration for every one of the 8 homepage sections. This is a single shared React Context value (`ReducedMotionContext`, src/motion/MotionProvider.tsx:11), so one `true` read disables motion identically and totally across the whole page -- exactly matching "section order correct, zero animation, everything just shows up."
test: Code-level: confirmed `usePrefersReducedMotion.ts`'s matchMedia read is NOT inverted/buggy (correct query string, correct `.matches` boolean, no stray global matchMedia stub in app code). Confirmed via `useScrollReveal.test.ts` (jsdom) that the gating logic itself is mechanically correct (0 ScrollTriggers when true, 1 when false). Could not execute a live browser to read the actual runtime `matchMedia(...).matches` value in the tester's session -- no headless browser/MCP browser tool available in this environment (checked: no playwright/puppeteer in node_modules, no chrome/chromium CLI, no browser MCP server registered).
expecting: If the tester opens the SAME browser tab/session used for UAT and runs `window.matchMedia('(prefers-reduced-motion: reduce)').matches` in DevTools console, a `true` result confirms this hypothesis directly.
next_action: Human verification required (see checkpoint below) -- ask the tester to check (a) DevTools console `matchMedia` value, (b) DevTools -> More tools -> Rendering -> "Emulate CSS media feature prefers-reduced-motion" (must be "No emulation", not "reduce" -- easy to leave toggled from an earlier accessibility/motion QA pass), and (c) OS-level Reduce Motion accessibility setting. This determines whether the fix is purely environmental (nothing to change in code) or whether the secondary code-level findings below (also confirmed) should be promoted to primary and fixed.

## Symptoms

expected: Scrolling top to bottom on the homepage causes each section (Hero, Proof Strip, Selected Work, Field Archive, How I Work, Skills & Tools, About, Footer) to fade up (opacity 0->1, y +32px->0, 0.8s, power2.out) as it crosses roughly 85% down the viewport -- a staggered, scroll-driven reveal per section, per `useScrollReveal`'s design.
actual: Section order is correct top-to-bottom, but no section visibly animates in on scroll -- everything appears to already be in its final, fully-visible state immediately, as if the reveal already played or never engaged.
errors: None reported (no console errors mentioned; UAT explicitly passed on section-order correctness).
reproduction: Load `http://localhost:5173/` in a real browser (`npm run dev`), scroll from top to bottom, observe whether each section fades/slides into view or is simply already visible.
started: First real-browser UAT pass of the completed Phase 3 homepage build (03-VERIFICATION.md item 3 -- "Full homepage scroll order is visually confirmed correct in a real browser" -- this animation observation is a bonus finding surfaced during that same pass, not a separate regression from a previously-working state).

## Eliminated

- hypothesis: "`usePrefersReducedMotion.ts` has an inverted or malformed `matchMedia` read, causing it to report `true` regardless of the actual OS setting."
  evidence: Read `src/motion/usePrefersReducedMotion.ts` in full. `REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)'` is the correct standard query string (not inverted, e.g. not `no-preference`). `useState(() => window.matchMedia(REDUCED_MOTION_QUERY).matches)` reads `.matches` directly, un-negated. The 'change' listener re-reads `mql.matches` the same way. `grep -rn "matchMedia"` across all non-test `src/**/*.ts(x)` shows exactly this one read site plus its own doc comments -- no second/duplicate/global matchMedia stub anywhere in app code (`index.html`, `vite.config.ts`, `main.tsx`) that could force it globally. Code itself is correct; if `prefersReducedMotion` is `true` at runtime it is because the actual OS/browser signal is `true`, not a code defect in this file.
  timestamp: 2026-07-31T04:00:00Z

- hypothesis: "ScrollTrigger isn't told about Lenis's scroll container/proxy, so it reads a different scroll position source than what the user visually experiences (window.scrollY desync)."
  evidence: `MotionProvider.tsx` constructs `new Lenis({ autoRaf: false, ... })` with no `wrapper`/`content` options -- this is Lenis 1.x's default "native scroll" mode, where Lenis animates the real `window`/`document.documentElement` scroll position directly (no transform-based virtual scroll container), so `window.scrollY` genuinely reflects what the user sees. Since ScrollTrigger's default scroller is also `window`, no `ScrollTrigger.scrollerProxy()` is required -- and none exists in the codebase (`grep -rn "scrollerProxy"` returns nothing). This matches 01-RESEARCH.md's own Pitfall 5, which explicitly states adding an unnecessary manual scrollerProxy (not omitting one) is the common way to introduce this exact bug class. `lenis.on('scroll', ScrollTrigger.update)` (MotionProvider.tsx:40) correctly keeps ScrollTrigger's scroll cache in sync with Lenis's eased position on every tick. This mechanism is sound.
  timestamp: 2026-07-31T04:05:00Z

- hypothesis: "React 19 StrictMode's dev-only double-invoke of `useScrollReveal`'s effect leaves stale/duplicate ScrollTrigger instances at initial mount, causing incorrect trigger positions."
  evidence: Read `@gsap/react` v2.1.2 source (`node_modules/@gsap/react/src/index.js`) directly and traced its `deferCleanup`/`mounted.current` mechanism against React's actual StrictMode phantom mount->cleanup->remount ordering. For a *plain initial mount* (dependency value itself unchanged across the phantom cycle), the trace shows: phantom-mount creates 1 ScrollTrigger -> phantom-cleanup's `context.current.revert()` (registered by the OTHER internal effect in the same shared `gsap.context()`) correctly kills it -> real remount creates exactly 1 fresh ScrollTrigger. This matches the existing, already-passing test `useScrollReveal.test.ts` ("unmount, including StrictMode phantom mount-unmount-mount, leaves zero orphaned ScrollTrigger instances" -- asserts count is 1 after StrictMode mount, 0 after full unmount). No duplication occurs for a simple StrictMode-only mount with a stable dependency value.
  timestamp: 2026-07-31T04:10:00Z

## Evidence

- timestamp: 2026-07-31T03:50:00Z
  checked: `src/motion/MotionProvider.tsx`, `src/motion/useScrollReveal.ts`, `src/motion/usePrefersReducedMotion.ts` (full read)
  found: Architecture matches the documented design exactly (01-RESEARCH.md): `gsap.registerPlugin(ScrollTrigger)` at module scope; Lenis driven by `gsap.ticker` with `autoRaf: false`; `lenis.on('scroll', ScrollTrigger.update)`; `useScrollReveal` built on `useGSAP({ scope: ref, dependencies: [prefersReducedMotion] })`; every homepage section (`ProofStrip`, `SelectedWork`, `FieldArchive`, `HowIWork`, `SkillsTools`, `About`, `Footer`, Hero in `home.tsx`) calls `useScrollReveal(ref)` with its own ref. No structural wiring defect found.
  implication: The bug, if it exists at the code level, is not in the basic wiring/architecture -- it's either environmental (reduced-motion signal) or in a subtler timing/lifecycle detail.

- timestamp: 2026-07-31T03:58:00Z
  checked: `package.json` versions (`gsap@3.15.0`, `@gsap/react@2.1.2`, `lenis@1.3.25`, `react@19.2.8`), `src/App.tsx` (5-line `Outlet`-only, no custom scroll wrapper/overflow container), `index.html` (no scroll-container divs, standard Google Fonts `<link>` for Inter with `display=swap`), `src/index.css` (Tailwind v4 `@theme` tokens; a `prefers-reduced-motion: reduce` CSS media block only affects native CSS `animation-duration`/`transition-duration`, not GSAP's JS-driven inline-style tweens, so it can't be silently gating anything GSAP does).
  implication: No custom scroll container exists that would require a `ScrollTrigger.scrollerProxy()`; native `window` scroller assumption throughout the codebase is correct and consistent.

- timestamp: 2026-07-31T04:15:00Z
  checked: Live experimental probe (written and run via `vitest`, then deleted -- no code changes committed) mounting a `useScrollReveal` consumer and flipping the mocked `prefersReducedMotionContext()` return value false -> true -> false across re-renders (no StrictMode, simulating an OS-level reduced-motion toggle mid-session).
  found: `ScrollTrigger.getAll().length` was 1 after initial mount (flag=false), **stayed at 1** after flipping to `true` (the stale ScrollTrigger from the `false` state was never reverted/killed), then became **2** after flipping back to `false` (a second ScrollTrigger was added on top of the still-live stale one, i.e. a genuine stacked-duplicate).
  implication: `@gsap/react` v2.1.2's `useGSAP` `deferCleanup` mechanism (present when `dependencies` is a non-empty array and `revertOnUpdate` is not set) only auto-reverts the very first (StrictMode phantom) pass; any *later* change to the `dependencies` array value does NOT revert the previous registration before adding a new one. This directly contradicts `useScrollReveal.ts`'s own inline comment ("dependencies: [prefersReducedMotion] -- so the effect reverts and re-runs if the reduced-motion preference flips mid-session") -- that claim is false per the actual library behavior, confirmed by direct execution. This is a real, previously-undetected, untested latent defect (no existing test in `useScrollReveal.test.ts` exercises a dependency-change scenario, only static true/false states at mount). However, it requires `prefersReducedMotion`'s *value* to actually change mid-session to manifest -- it does not, by itself, explain a fresh single-load top-to-bottom scroll test where the OS setting is presumably static throughout.

## Resolution

root_cause: |
  Primary (highest confidence, could not be observed directly -- no browser tooling available in this environment, requires human confirmation): the shared `ReducedMotionContext` value consumed by every `useScrollReveal()` call site (`src/motion/MotionProvider.tsx`) was `true` during the tester's real-browser session -- either a genuine OS-level "Reduce Motion" accessibility setting, or (very plausibly, given this exact phase's own 03-VERIFICATION.md flagged multiple items for hands-on visual/accessibility-style browser QA immediately prior) a Chrome DevTools "Emulate CSS media feature prefers-reduced-motion: reduce" override left active from an earlier check. Because `useScrollReveal.ts:36` (`if (!ref.current || prefersReducedMotion) return;`) is a single shared gate hit identically by all 8 sections, this one boolean being `true` produces *exactly* the reported symptom: correct DOM/section order, zero `gsap.from()`/ScrollTrigger calls anywhere on the page, every section rendering in its plain final CSS state with no fade/slide motion at all ("it's all loading at once").

  Secondary (confirmed via direct experiment, real code defect, but not sufficient on its own to explain a single static-preference scroll-through): `useScrollReveal.ts` passes `dependencies: [prefersReducedMotion]` to `useGSAP()` without `revertOnUpdate: true`. Per `@gsap/react` v2.1.2's actual `deferCleanup` implementation (traced and confirmed by running a live probe), this means only the very first (StrictMode phantom) effect pass is ever auto-reverted -- a genuine later change to `prefersReducedMotion` does not revert the prior ScrollTrigger before creating a new one, producing stale/stacked ScrollTrigger instances. This contradicts the hook's own inline comment and is untested by the existing suite. Worth fixing regardless of which hypothesis explains today's specific UAT report, since it's a real latent bug in mid-session reduced-motion toggling.

fix: |
  Not applied -- this session is diagnosis-only per the task's own instructions. Suggested fix directions, not yet implemented:

  1. (Environmental, if Primary is confirmed) No code change needed -- verify DevTools rendering emulation is off and/or the OS accessibility "Reduce Motion" setting is off, then re-run the UAT scroll-through.

  2. (Code fix, for the Secondary/confirmed defect, recommended regardless) In `src/motion/useScrollReveal.ts`, add `revertOnUpdate: true` to the `useGSAP()` config object at line ~50:
     ```ts
     { scope: ref, dependencies: [prefersReducedMotion], revertOnUpdate: true }
     ```
     This makes `@gsap/react` fully revert the gsap context (killing the existing ScrollTrigger) before re-running the callback on every `prefersReducedMotion` change, matching the hook's own documented intent ("the effect reverts and re-runs if the reduced-motion preference flips mid-session"). Should be paired with a new test in `useScrollReveal.test.ts` that flips the mocked context value across re-renders (not just static true/false at mount) and asserts `ScrollTrigger.getAll().length` stays at 1 (or 0) at every step -- this exact scenario is currently untested.

  3. (Defense-in-depth, optional, addresses a related but distinct real gap found during investigation: no `ScrollTrigger.refresh()` is ever called after the Google-Fonts-loaded "Inter" webfont finishes swapping in via `display=swap`, which happens asynchronously and is NOT guaranteed to complete before ScrollTrigger's built-in `autoRefreshEvents` fires on the `load` event scanned in `01-RESEARCH.md`/GSAP's own docs. This could cause reveal trigger positions to be computed against pre-font-swap layout metrics, drifting slightly early/late per section on a long page. Recommended: in `MotionProvider.tsx`'s effect, add `document.fonts.ready.then(() => ScrollTrigger.refresh())` alongside the existing Lenis setup. This is a secondary hardening item, not the primary explanation for "zero animation across the entire page," since a webfont-reflow drift would produce mistimed reveals per section rather than a uniform total absence of motion.

verification: Not yet performed -- diagnosis-only session. Requires a human to (a) confirm the actual `prefersReducedMotion` runtime value in their own UAT browser session, and (b) re-test after any of the above fixes are applied in a follow-up fix session.
files_changed: []
---

## CHECKPOINT REACHED

**Type:** human-verify
**Debug Session:** .planning/debug/scroll-reveal-not-animating.md

### Investigation State

**Current Hypothesis:** `prefersReducedMotion` was `true` during the UAT browser session, causing every `useScrollReveal()` call site to hard no-op (matches the symptom with full fidelity: correct order, zero animation across all 8 sections).

**Evidence So Far:**
- `usePrefersReducedMotion.ts`'s `matchMedia` read is code-correct (not inverted, no stray stub) -- ruled out as a code bug, but the runtime *value* it reports depends on the real browser/OS environment, which this environment cannot observe directly (no headless browser tool available here).
- Lenis+ScrollTrigger scroller wiring is correct and matches the documented, no-scrollerProxy-needed pattern -- ruled out.
- StrictMode double-invoke at a *plain* initial mount does not duplicate ScrollTriggers -- ruled out (confirmed both by tracing `@gsap/react`'s source and by the existing passing test suite).
- Directly executed a probe confirming a real, separate, previously-undetected defect: `useScrollReveal`'s `dependencies: [prefersReducedMotion]` (without `revertOnUpdate: true`) does NOT cleanly revert+recreate on a later dependency change as its own comment claims -- it stacks a duplicate ScrollTrigger. Confirmed but requires the preference to change mid-session, so likely secondary to today's specific symptom.

### Checkpoint Details

**Need verification:** Please confirm whether reduced motion is active in the browser tab/session used for the UAT pass.

**How to check:**
1. In the same browser used for testing, open DevTools console at `http://localhost:5173/` and run: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
2. In Chrome DevTools: More tools -> Rendering -> check the "Emulate CSS media feature prefers-reduced-motion" dropdown is set to "No emulation" (not "reduce")
3. Check the OS-level accessibility setting: macOS System Settings -> Accessibility -> Display -> Reduce Motion (should be off), or the equivalent on Windows/Linux

**Tell me:** the result of step 1 (`true` or `false`), and whether either emulation/OS toggle was active. This determines whether the fix is purely environmental (re-test with the toggle off) or whether the code-level `revertOnUpdate: true` fix (and/or the `ScrollTrigger.refresh()` webfont hardening) should be applied and verified in a follow-up fix session.
