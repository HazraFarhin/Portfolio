---
phase: 01-foundation-motion-infrastructure
reviewed: 2026-07-24T17:35:00Z
depth: standard
files_reviewed: 19
files_reviewed_list:
  - src/App.tsx
  - src/components/ui/Button.test.tsx
  - src/components/ui/Button.tsx
  - src/components/ui/Card.test.tsx
  - src/components/ui/Card.tsx
  - src/components/ui/Typography.test.tsx
  - src/components/ui/Typography.tsx
  - src/content/hero.ts
  - src/lib/cn.ts
  - src/main.tsx
  - src/motion/MotionProvider.test.tsx
  - src/motion/MotionProvider.tsx
  - src/motion/usePrefersReducedMotion.test.ts
  - src/motion/usePrefersReducedMotion.ts
  - src/motion/useScrollReveal.test.ts
  - src/motion/useScrollReveal.ts
  - src/router.tsx
  - src/routes/home.test.tsx
  - src/routes/home.tsx
  - src/test/setup.ts
findings:
  critical: 0
  warning: 3
  info: 4
  total: 7
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-24T17:35:00Z
**Depth:** standard
**Files Reviewed:** 19
**Status:** issues_found

## Summary

Re-reviewed Phase 1 (foundation-motion-infrastructure) after gap-closure plan 01-07, whose stated purpose was fixing WR-01 from the prior review: `MotionProvider`'s Lenis-instantiation effect running unconditionally regardless of `prefersReducedMotion`.

**The prior WR-01 defect is confirmed fixed and clean.** `src/motion/MotionProvider.tsx:29-30` now guards the effect with `if (prefersReducedMotion) return;` as the first statement, before the `new Lenis(...)` call, and the effect's dependency array (`MotionProvider.tsx:52`) changed from `[]` to `[prefersReducedMotion]`. Verified via `git show ac4e3ca` that this is the *only* logic change in the file (constructor options, `lenis.on('scroll', ...)` wiring, ticker wiring, and the cleanup function are untouched, matching 01-07-SUMMARY.md's stated scope). Traced all re-entrancy paths by hand against the existing cleanup function:
- Mount with `prefersReducedMotion=true` -> early return, no Lenis instance, no ticker registration, no cleanup needed (correct).
- Mount with `prefersReducedMotion=false` -> unchanged pre-fix behavior (Lenis created, ticker registered).
- Toggle `false -> true` mid-session -> previous effect's cleanup (`gsap.ticker.remove` + `lenis.destroy`) runs, then the new effect run early-returns -- no replacement instance created. Correct.
- Toggle `true -> false` mid-session -> no prior cleanup needed (nothing was created), new effect run proceeds past the guard and creates a fresh Lenis instance. Correct.
- StrictMode phantom mount-unmount-mount -> symmetric under both `true` and `false` starting states, confirmed by the two new StrictMode-specific tests.

`npm test` (34/34 passing across 7 files), `tsc -b` (zero errors), and `npm run build` all pass cleanly as of this review. No regressions introduced by the fix.

However, this review surfaces three functional/quality gaps independent of WR-01 that should be tracked before the phase's motion-safety and interaction claims are considered fully closed -- most notably a Lenis/anchor-link integration gap that affects the one interactive CTA this phase ships.

## Warnings

### WR-01: In-page anchor links bypass Lenis's smooth-scroll entirely (native jump, possible desync)

**File:** `src/motion/MotionProvider.tsx:32-38`
**Issue:** The `Lenis` instance is constructed with `{ autoRaf: false, duration: 1.05, smoothWheel: true, wheelMultiplier: 0.85, touchMultiplier: 1.15 }`. Lenis's own type definitions (`node_modules/lenis/dist/lenis.d.ts`) document an `anchors?: boolean | ScrollToOptions` option, `@default false`, whose docstring is literally "If `true`, Lenis will handle anchor links automatically." It is not set here, so it stays at its default `false`.

The only interactive element this phase ships, the Hero CTA (`src/content/hero.ts` `ctaHref: '#hero'`, rendered via `<Button href={heroContent.ctaHref}>` in `src/routes/home.tsx:22`), is a plain in-page anchor link. With `anchors` unset, clicking it triggers the browser's native, instant anchor-jump scroll, completely bypassing Lenis's eased/smoothed scroll animation and GSAP/ScrollTrigger's `lenis.on('scroll', ScrollTrigger.update)` wiring for that jump. Because Lenis tracks scroll state independently while driving eased wheel/touch input, a native jump that Lenis did not initiate can leave Lenis's internal target/position state briefly out of sync with the DOM's actual scroll position, producing a visible jump or stutter on the next wheel/touch input after the anchor click.

This is precisely the risk 01-07-SUMMARY.md's deferred human-check (D5) calls out ("clicking the CTA scrolls to #hero without jump/desync") but frames as pending verification rather than a code-level gap -- the code itself has no anchor-handling wiring at all, so the check is very likely to fail in a real browser as currently written, not just unverified.
**Fix:**
```ts
const lenis = new Lenis({
  autoRaf: false,
  duration: 1.05,
  smoothWheel: true,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.15,
  anchors: true, // let Lenis intercept and smoothly scroll in-page anchor clicks
});
```
Re-run the deferred human-check (D5) against this change specifically, since it directly targets the failure mode described there.

### WR-02: `Button`'s prop typing allows `disabled` (and other button-only attributes) to leak onto the rendered `<a>` when `href` is set

**File:** `src/components/ui/Button.tsx:17-19, 38-48`
**Issue:** `ButtonProps` is `BaseButtonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>`. Because the `Omit`s only strip keys that overlap with `BaseButtonProps` (`variant`, `href`, `className`, `children`), button-only attributes like `disabled` remain part of the intersection type unconditionally -- TypeScript does not narrow the allowed prop set based on whether `href` is also passed.

Verified this compiles with zero type errors:
```tsx
<Button href="/x" disabled>Test</Button>
```
At runtime this renders `<a href="/x" disabled ...>`. `disabled` has no effect on `<a>` elements per the HTML spec -- the link remains fully focusable and clickable, while a screen reader / the visual affordance may still imply it is inert. No caller in this phase currently does this (`src/routes/home.tsx` never passes `disabled`), but the component's public contract silently permits an invalid, misleading combination with no runtime guard.
**Fix:** Discriminate the two prop shapes with a proper union instead of an unconditional intersection, e.g.:
```ts
type ButtonProps =
  | (BaseButtonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>)
  | (BaseButtonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>);
```
so `disabled` (and other button-only attrs) are only assignable when `href` is absent.

### WR-03: `useScrollReveal`'s dependency array omits `y`/`duration`/`start`, so option changes on re-render are silently ignored

**File:** `src/motion/useScrollReveal.ts:34-51`
**Issue:** `useGSAP` is called with `{ scope: ref, dependencies: [prefersReducedMotion] }`. The animation body reads `y`, `duration`, and `start` from the hook's second argument, but none of them are included in `dependencies`. If a consuming component re-renders with a *different* `options` object (e.g. a parent passing a computed `start` value that changes across renders), the GSAP context will not revert/re-run, and the component keeps animating with whatever `y`/`duration`/`start` values were captured on the very first run. No current caller (`src/routes/home.tsx` calls `useScrollReveal(heroRef)` with no options) exercises this path, so it is latent rather than actively triggered, but the hook is documented as "the single public motion-authoring hook every animated component uses" (i.e., it is expected to see varied option usage soon).
**Fix:** Add the destructured option values to the dependency array:
```ts
{ scope: ref, dependencies: [prefersReducedMotion, y, duration, start] }
```

## Info

### IN-01: `Card`'s `variant` prop is accepted but has no effect

**File:** `src/components/ui/Card.tsx:4-11`
**Issue:** `CardProps.variant?: 'glass'` is destructured and then immediately discarded via `void variant;` because only one variant is implemented. Callers can pass `variant="glass"` (the only legal value) but it changes nothing, and the type gives the impression of a configurable API surface that doesn't exist yet.
**Fix:** Either drop the prop until a second variant exists, or add a one-line comment at the destructuring site (there is currently none) explaining it is a placeholder for a future variant, to avoid it looking like dead/forgotten code to the next reader.

### IN-02: `MotionProvider.tsx` mixes a component export and a non-component hook export, disabling Fast Refresh

**File:** `src/motion/MotionProvider.tsx:14`
**Issue:** `oxlint` flags this (`react(only-export-components)`): the file exports both the `MotionProvider` component and the `usePrefersReducedMotionContext` hook. React Fast Refresh only works reliably when a file exports components only, so edits to this file during dev will trigger a full reload instead of a fast in-place update.
**Fix:** Move `usePrefersReducedMotionContext` (and the `ReducedMotionContext` it wraps) into its own module (e.g. `src/motion/ReducedMotionContext.ts`), imported by both `MotionProvider.tsx` and `useScrollReveal.ts`.

### IN-03: `Display` typography primitive defaults to `<p>`, not a heading element

**File:** `src/components/ui/Typography.tsx:43-52`
**Issue:** `Display` is presumably used for the page's most visually prominent statement (it's the largest type scale, `text-display`), yet it defaults to rendering as `<p>` rather than any heading level. If any homepage section ends up using `Display` for its primary statement without an explicit `as="h1"`/`as="h2"` override, that content gets no heading landmark for assistive tech, even though it visually reads as the page's lead statement. `src/routes/home.tsx` doesn't currently use `Display` (it uses `Body`/`Label` for the hero statement), so this is not yet triggered, but is worth flagging before more sections adopt this primitive.
**Fix:** Consider defaulting `Display` to `h1`/`h2` (matching `Heading`'s pattern) or add a code comment documenting that callers are expected to always pass an explicit `as` for semantic correctness.

### IN-04: Small race window between `usePrefersReducedMotion`'s initial synchronous read and its effect's listener registration

**File:** `src/motion/usePrefersReducedMotion.ts:17-26`
**Issue:** The initial state is read synchronously via `useState(() => window.matchMedia(...).matches)` during render, but the `change` listener is only registered afterward, inside `useEffect`. In the (very narrow) window between those two points, if the OS-level setting changes, the component won't observe it until the *next* actual change event fires (since the effect doesn't re-sync `mql.matches` against the current value when it registers, only listens going forward). Negligible in practice (sub-millisecond real-world window) but technically a correctness gap in an otherwise carefully-commented hook.
**Fix:** Optionally re-sync inside the effect before subscribing, e.g. `setPrefersReducedMotion(mql.matches);` as the first line of the effect, to close the window (idempotent no-op re-render if unchanged).

---

_Reviewed: 2026-07-24T17:35:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
