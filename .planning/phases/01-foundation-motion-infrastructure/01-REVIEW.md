---
phase: 01-foundation-motion-infrastructure
reviewed: 2026-07-24T00:00:00Z
depth: standard
files_reviewed: 28
files_reviewed_list:
  - .gitignore
  - .oxlintrc.json
  - index.html
  - package.json
  - public/favicon.svg
  - src/App.tsx
  - src/components/ui/Button.test.tsx
  - src/components/ui/Button.tsx
  - src/components/ui/Card.test.tsx
  - src/components/ui/Card.tsx
  - src/components/ui/Typography.test.tsx
  - src/components/ui/Typography.tsx
  - src/content/hero.ts
  - src/index.css
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
  - tsconfig.app.json
  - tsconfig.json
  - tsconfig.node.json
  - vite.config.ts
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-07-24T00:00:00Z
**Depth:** standard
**Files Reviewed:** 28
**Status:** issues_found

## Summary

Reviewed the full Phase 1 foundation/motion-infrastructure change set: build config, the `Button`/`Card`/`Typography` UI primitives, the `cn()` class-merge helper, the `MotionProvider`/`usePrefersReducedMotion`/`useScrollReveal` motion stack, the router, and the `HomeRoute`/hero content wiring, plus their unit tests. No secrets, injection vectors, `eval`/`innerHTML` usage, or debug artifacts were found (confirmed via targeted grep as well as full reads). Cleanup logic in `MotionProvider` and `useScrollReveal` (GSAP ticker removal, Lenis destroy, `useGSAP` scope revert under StrictMode) is correct and well-tested.

The most notable gap is that `MotionProvider` unconditionally instantiates Lenis's JS-driven smooth-scroll regardless of the user's `prefers-reduced-motion` setting, even though the module's own doc comment and the CSS reduced-motion block imply motion should be fully suppressed for those users — the CSS `!important` overrides only affect CSS transitions/animations and cannot touch Lenis's JS-based scroll interception. There's also a type-safety gap in `Button`'s polymorphic anchor/button props (an unchecked double cast that lets button-only attributes leak onto the rendered `<a>`), a couple of minor dead-prop / unused-primitive issues (`Card`'s `variant`, `Typography`'s `Display`/`Heading` exports), and no `errorElement` configured on the single route, so any render-time exception in `HomeRoute` produces a blank page with no fallback UI.

None of these rise to data-loss/security/crash-blocking severity given the current single-Hero-section scope, but the reduced-motion gap in particular is worth fixing before more motion-heavy sections are layered on in later phases.

## Warnings

### WR-01: Lenis smooth-scroll is never disabled for `prefers-reduced-motion` users

**File:** `src/motion/MotionProvider.tsx:26-50`
**Issue:** `MotionProvider` reads `prefersReducedMotion` from `usePrefersReducedMotion()` and exposes it via context (consumed correctly by `useScrollReveal` to no-op GSAP tweens), but the `useEffect` that instantiates `Lenis` and wires it to `gsap.ticker` runs unconditionally — it never checks `prefersReducedMotion` before creating the Lenis instance. Lenis intercepts wheel/touch input and replaces native scrolling with its own eased/physics-based scroll, which is itself a motion effect. The CSS reduced-motion rule in `src/index.css:36-45` only zeroes `animation-duration`/`transition-duration`/`scroll-behavior` for CSS animations/transitions — it has no effect on Lenis's JS-driven scroll hijacking. As a result, users who have explicitly opted out of motion at the OS level still get eased/animated scrolling behavior, contradicting the module's own doc comment ("No other component should read `matchMedia` directly (D-09)" implies this is the single gate for all motion, but Lenis bypasses it).
**Fix:**
```tsx
useEffect(() => {
  if (prefersReducedMotion) return;

  const lenis = new Lenis({ autoRaf: false, duration: 1.05, smoothWheel: true, wheelMultiplier: 0.85, touchMultiplier: 1.15 });
  lenis.on('scroll', ScrollTrigger.update);
  const update = (time: number) => lenis.raf(time * 1000);
  gsap.ticker.add(update);
  gsap.ticker.lagSmoothing(0);

  return () => {
    gsap.ticker.remove(update);
    lenis.destroy();
  };
}, [prefersReducedMotion]);
```

### WR-02: `Button`'s polymorphic anchor/button prop typing relies on an unchecked double cast, allowing invalid attribute combinations

**File:** `src/components/ui/Button.tsx:17-19, 38-58`
**Issue:** `ButtonProps` is built as `BaseButtonProps & Omit<ButtonHTMLAttributes<...>> & Omit<AnchorHTMLAttributes<...>>`, then `rest` is force-cast at render time (`rest as AnchorHTMLAttributes<HTMLAnchorElement>` / `rest as ButtonHTMLAttributes<HTMLButtonElement>`). Because the intersection type admits both button-only props (e.g. `disabled`, `form`, `type`) and anchor-only props (e.g. `download`, `target`) simultaneously regardless of whether `href` is supplied, a caller can pass `<Button href="/x" disabled />` and TypeScript will accept it, but at runtime it renders `disabled=""` on an `<a>` element (a no-op/invalid attribute) rather than surfacing a compile-time error. The cast silently discards the type-level distinction the component is trying to enforce.
**Fix:** Use a discriminated union instead of an intersection so the two attribute sets are mutually exclusive at the type level:
```ts
type ButtonProps =
  | (BaseButtonProps & { href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>)
  | (BaseButtonProps & { href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>);
```
This removes the need for the `as` casts and makes invalid prop combinations (e.g. `disabled` with `href`) a compile-time error.

### WR-03: No `errorElement` configured on the router — a render-time throw produces a blank page

**File:** `src/router.tsx:10-20`
**Issue:** `createBrowserRouter` is configured with a single route tree and no `errorElement`/`ErrorBoundary` on either the root `/` route or the `index` route. If `HomeRoute` (or any component it renders) throws during render — e.g. a future data-fetching failure once case-study content is added — React Router's default behavior is to render nothing inside the router outlet, leaving the user with a blank page and no recovery path or diagnostic.
**Fix:**
```tsx
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <RouteErrorFallback />,
    children: [{ index: true, element: <HomeRoute /> }],
  },
]);
```

### WR-04: `Button` treats an empty-string `href` as "no link", silently changing element type

**File:** `src/components/ui/Button.tsx:38`
**Issue:** `if (href)` is falsy for `href=""`. A caller passing `href=""` (e.g. from a not-yet-populated content field) would silently get a `<button type="button">` instead of an `<a>`, with no warning. Given `heroContent.ctaHref` is sourced from a content module that's explicitly called out as a rough draft likely to be edited, an accidental empty string during a future content edit would silently change the rendered semantics/behavior of the CTA.
**Fix:** Use an explicit `href !== undefined` check (paired with WR-02's discriminated union, this becomes moot since `href` would be required in the anchor branch of the union).

## Info

### IN-01: `Card`'s `variant` prop is declared but has no effect

**File:** `src/components/ui/Card.tsx:5,10-11`
**Issue:** `CardProps.variant` only ever accepts `'glass'`, and the value is immediately discarded (`void variant;`) purely to satisfy `noUnusedParameters`. There is no second variant implemented, so the prop is dead API surface that suggests a configurability that doesn't exist yet.
**Fix:** Remove the `variant` prop until a second variant is actually implemented, or implement the branching logic now if a second variant is imminent.

### IN-02: `Display` defaults to a `<p>` tag despite being the largest/most prominent text style

**File:** `src/components/ui/Typography.tsx:43-52`
**Issue:** `Heading` defaults to `h2` but `Display` (visually the largest text style, `--text-display: clamp(48px, 8vw, 88px)`) defaults to `p`. If a future section uses `<Display>` without explicitly passing `as="h1"`/`as="h2"`, the page could end up with a large visual headline that has no heading semantics, harming the document outline for screen-reader/SEO purposes.
**Fix:** Default `Display` to `h1` (there is typically only one `Display`-styled element per page — the top hero), and let callers override with `as` when reusing it elsewhere.

### IN-03: `Display` and `Heading` are exported but currently unused anywhere in the app

**File:** `src/components/ui/Typography.tsx:32-52`, `src/routes/home.tsx`
**Issue:** `HomeRoute` only uses `Label` and `Body`; `Heading` and `Display` have no call sites yet in the reviewed file set. This is expected for a Hero-only phase (per the in-file comments about Phase 3 adding more sections) but is worth flagging so it isn't mistaken for accidental omission when reviewing test coverage — `Typography.test.tsx` does test them directly, so this is intentional scaffolding rather than orphaned dead code.
**Fix:** No action needed now; confirm these get their first real call site in the next phase that adds homepage sections.

### IN-04: Potential reverse-tabnabbing footgun if `Button`/anchor consumers set `target="_blank"`

**File:** `src/components/ui/Button.tsx:38-48`
**Issue:** Because `rest` is spread onto the rendered `<a>` without any normalization, a future caller passing `target="_blank"` (e.g. for an external case-study or Behance/LinkedIn link) would not automatically get `rel="noopener noreferrer"`, which is the standard mitigation for reverse-tabnabbing via `window.opener`. No current call site does this, but the primitive doesn't guard against it either.
**Fix:** Auto-inject `rel="noopener noreferrer"` when `target === '_blank'` and no explicit `rel` was passed:
```tsx
const rel = rest.target === '_blank' && !('rel' in rest) ? 'noopener noreferrer' : (rest as AnchorHTMLAttributes<HTMLAnchorElement>).rel;
```

---

_Reviewed: 2026-07-24T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
