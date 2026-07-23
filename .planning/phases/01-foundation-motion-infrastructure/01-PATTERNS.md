# Phase 1: Foundation & Motion Infrastructure - Pattern Map

**Mapped:** 2026-07-23
**Files analyzed:** 16
**Analogs found:** 0 exact / 2 conceptual-only / 16 total

## IMPORTANT: This is a from-scratch build

Confirmed via `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, and a direct filesystem check: there is no `src/`, no `package.json` for the site, and no application code anywhere in this repository. The only pre-existing material is two static, CDN-loaded HTML mockups under `Templates/` (Noema, Axisform) that CONTEXT.md decision D-02 explicitly designates as **loose visual/motion inspiration only — not a literal source, not to be built upon directly**.

Because of this, **every file in this phase has "no code analog"** in the strict sense (no prior React/TS/Vite file exists to copy imports/structure/error-handling from). What follows instead is:
1. A classification table so the planner can group files by role/data-flow.
2. For the small number of files where the Axisform template contains a genuinely relevant *conceptual* sequence (the reduced-motion-check → Lenis-on-gsap.ticker → ScrollTrigger bootstrap), the exact excerpt is quoted below, with an explicit instruction that it must be reimplemented as idiomatic React/TypeScript (per D-02, RESEARCH.md Pattern 1/2), not transcribed.
3. For everything else (UI primitives, router, content module), RESEARCH.md's `Code Examples` / `Architecture Patterns` sections are the only available concrete reference — cited directly per file below, since no local codebase analog exists.

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|-----------------|----------------|
| `src/main.tsx` | config/entrypoint | request-response (app bootstrap) | none | no analog |
| `src/router.tsx` | route | request-response | none | no analog |
| `src/routes/home.tsx` | route/component | request-response | none | no analog |
| `src/index.css` | config (design tokens) | transform (build-time) | `Templates/Axisform/Axisform Studio Landing Page.html` `<style>` block | inspiration-only (D-02) |
| `src/motion/MotionProvider.tsx` | provider | event-driven (scroll ticker) | `Templates/Axisform/Axisform Studio Landing Page.html` lines 849-874 (inline bootstrap script) | conceptual-only, see below |
| `src/motion/useScrollReveal.ts` | hook | event-driven | none (RESEARCH.md Pattern 2 is the concrete reference) | no analog |
| `src/motion/usePrefersReducedMotion.ts` | hook | event-driven | `Templates/Axisform/Axisform Studio Landing Page.html` line 852 (`matchMedia` check) + CSS `@media (prefers-reduced-motion: reduce)` block, lines 298-307 | conceptual-only, see below |
| `src/components/ui/Button.tsx` | component | request-response (render) | none | no analog |
| `src/components/ui/Card.tsx` | component | request-response (render) | none | no analog |
| `src/components/ui/Typography.tsx` | component | request-response (render) | none | no analog |
| `src/content/hero.ts` | model/content data | transform (static data module) | none (source copy: `Portfolio-Documentation/Homepage Copy V2.md` §02) | no analog |
| `src/lib/cn.ts` | utility | transform | none | no analog |
| `vite.config.ts` | config | build-time | none | no analog |
| `vitest.config.ts` (or test block in vite.config.ts) | config | build-time | none | no analog |
| `src/motion/useScrollReveal.test.ts` | test | request-response (assertions) | none | no analog |
| `src/motion/usePrefersReducedMotion.test.ts` | test | request-response (assertions) | none | no analog |
| `src/components/ui/*.test.tsx` | test | request-response (assertions) | none | no analog |

## Pattern Assignments

### `src/motion/MotionProvider.tsx` (provider, event-driven)

**Nearest thing in the repo (conceptual only, NOT a code analog per D-02):** `Templates/Axisform/Axisform Studio Landing Page.html` lines 849-874, the inline bootstrap `<script>` block.

**What it shows (sequence to reimplement, not transcribe):**
```javascript
// Templates/Axisform/Axisform Studio Landing Page.html:852-867
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion && window.gsap && window.ScrollTrigger && window.Lenis) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: "power3.out" });

  const lenis = new Lenis({
    duration: 1.05,
    smoothWheel: true,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.15
  });

  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  // ...preloader -> hero entrance timeline follows (out of scope, see D-06)
}
```

**Why this is inspiration-only, not a pattern to copy:**
- It's vanilla JS reading `window.gsap`/`window.Lenis` globals loaded via CDN `<script>` tags — this project has "no CDN script tags" as an explicit success criterion, so the global-detection `if` guard has no place in the real code.
- It gates the entire motion setup behind `!prefersReducedMotion`, meaning zero cleanup/registration happens at all when reduced motion is on. D-09/D-10 require a more granular per-hook no-op (`useScrollReveal` checks the flag, not the whole provider), because the reduced-motion preference can change at runtime (`change` event) — the static template never subscribes to changes, only reads the value once at page load.
- No StrictMode/unmount cleanup exists (single-page load, not a React component tree).

**Concrete pattern to actually build from:** RESEARCH.md `Architecture Patterns → Pattern 1` (full `MotionProvider.tsx` implementation, `gsap.ticker.add` + `autoRaf: false` + `lenis.on('scroll', ScrollTrigger.update)` — same *sequence* as the Axisform snippet above, reimplemented as an idiomatic React effect with subscribe/cleanup and a Context provider for the reduced-motion boolean).

---

### `src/motion/usePrefersReducedMotion.ts` (hook, event-driven)

**Nearest thing in the repo (conceptual only):** `Templates/Axisform/Axisform Studio Landing Page.html` line 852 (one-time `matchMedia` read, no subscription) and the accompanying CSS `@media (prefers-reduced-motion: reduce)` block:

```css
/* Templates/Axisform/Axisform Studio Landing Page.html:298-307 */
@media (prefers-reduced-motion: reduce) {
*,
*::before,
*::after {
animation-duration: .001ms !important;
animation-iteration-count: 1 !important;
scroll-behavior: auto !important;
transition-duration: .001ms !important;
}
.ax-loader { display: none; }
}
```

**Gap vs. what's needed:** This is a CSS-only fallback with no JS `change` listener — acceptable for a static page that never re-checks the preference after load, insufficient for D-09/D-10's requirement that `useScrollReveal()` (and the app generally) react if the OS preference changes mid-session. Use RESEARCH.md's `Code Examples → usePrefersReducedMotion` (subscribes via `mql.addEventListener('change', ...)`) as the actual reference implementation.

**Note:** Regardless of the JS hook, it is still worth keeping a global CSS `@media (prefers-reduced-motion: reduce)` safety-net rule (forcing `animation-duration`/`transition-duration` near-zero) in `src/index.css` as defense-in-depth alongside the JS-driven `useScrollReveal` no-op — this is the one piece of the Axisform CSS worth carrying forward conceptually.

---

### `src/index.css` (config, design tokens)

**Nearest thing in the repo:** `Templates/Axisform/Axisform Studio Landing Page.html`'s inline `<style>` block (dark palette, spacing, type scale) — per D-01/D-02, treat only as directional inspiration for "dark cinematic feel," not a source of literal hex/spacing values. The actual token values are locked in `01-CONTEXT.md`'s "UI Design Contract" section (Dominant `#0B0C0A`, Secondary `#16171A`, Accent `#FF6A33`, Destructive `#E5484D`, Foreground `#F2EFE6`, Muted foreground `rgba(242,239,230,0.58)`, Line `rgba(242,239,230,0.10)`; spacing 4/8/16/24/32/48/64) — these values, not anything extracted from the template file, are authoritative.

**Concrete pattern to build from:** RESEARCH.md `Code Examples → Tailwind v4 CSS-first setup` — the full `@theme { }` block example is the direct reference (CSS-first token declaration, no `tailwind.config.js`).

---

### `src/motion/useScrollReveal.ts`, `src/router.tsx`, `src/main.tsx`, `src/components/ui/*.tsx`, `src/content/hero.ts`, `src/lib/cn.ts`

**No analog of any kind exists in this repository** (not even conceptually — these are pure React/TypeScript/React-Router constructs with no counterpart in the static HTML templates). The planner should treat RESEARCH.md's `Architecture Patterns → Pattern 2` (useScrollReveal built on `@gsap/react`'s `useGSAP()`), `Pattern 3` (React Router Data Mode `createBrowserRouter`/`RouterProvider`), and `Recommended Project Structure` as the sole concrete reference for these files. Component API shape (Button/Card/Typography variants) and `cn()` helper implementation are explicitly Claude's Discretion per CONTEXT.md — no existing convention constrains them.

**Content source for `src/content/hero.ts`:** `Portfolio-Documentation/Homepage Copy V2.md` §02 — copy must be extracted verbatim into this data module, not paraphrased or hardcoded in JSX (per 01-UI-SPEC.md cited in CONTEXT.md).

---

## Shared Patterns

### Reduced-motion gate (applies to MotionProvider + useScrollReveal + index.css)
**Source:** Conceptually seeded by `Templates/Axisform/Axisform Studio Landing Page.html:852` + `:298-307`; concrete implementation from RESEARCH.md Patterns 1 & 2.
**Apply to:** `MotionProvider.tsx` (owns the single `matchMedia` subscription + Context), `useScrollReveal.ts` (reads context, no-ops per-call), `index.css` (CSS-level safety net). Never duplicate the `matchMedia` check in any other component (D-09/D-10; RESEARCH.md `Anti-Patterns` and `Don't Hand-Roll` tables list this explicitly as the #1 thing not to re-implement per-component).

### Lenis-driven-by-gsap.ticker (applies to MotionProvider only)
**Source:** `Templates/Axisform/Axisform Studio Landing Page.html:858-867` (sequence: `new Lenis(...)` → `lenis.on('scroll', ScrollTrigger.update)` → `gsap.ticker.add((time) => lenis.raf(time * 1000))` → `gsap.ticker.lagSmoothing(0)`), reimplemented per RESEARCH.md Pattern 1 with `autoRaf: false` added explicitly (the Axisform template doesn't set this because it has no competing rAF loop concern in plain JS, but React's `MotionProvider` must set it to avoid Pitfall 2 — two competing rAF loops).
**Apply to:** `MotionProvider.tsx` only — this is the single place Lenis is instantiated (D-10).

### Design tokens (applies to index.css, all UI primitives)
**Source:** `01-CONTEXT.md` UI Design Contract (authoritative values) + RESEARCH.md `Code Examples → Tailwind v4 CSS-first setup` (mechanism).
**Apply to:** `index.css` `@theme` block is the single source of truth; `Button.tsx`/`Card.tsx`/`Typography.tsx` consume Tailwind utility classes generated from these tokens, never hardcode raw hex/px values.

## No Analog Found

All 16 files in this phase lack a true code analog (confirmed: no `src/`, no prior `package.json`, no application code exists anywhere in the repo). Planner must rely on RESEARCH.md's `Code Examples`, `Architecture Patterns`, and `Recommended Project Structure` sections as the primary implementation reference for every file, with the Axisform template consulted only for the two conceptual sequences documented above (reduced-motion gate, Lenis/GSAP ticker sync) and only as directional inspiration per D-02 — never transcribed verbatim.

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/main.tsx` | config/entrypoint | request-response | No prior React entrypoint exists in repo |
| `src/router.tsx` | route | request-response | No prior routing code exists in repo |
| `src/routes/home.tsx` | route/component | request-response | No prior route components exist in repo |
| `src/motion/useScrollReveal.ts` | hook | event-driven | No prior GSAP/React hook code exists in repo |
| `src/components/ui/Button.tsx` | component | request-response | No prior React component exists in repo |
| `src/components/ui/Card.tsx` | component | request-response | No prior React component exists in repo |
| `src/components/ui/Typography.tsx` | component | request-response | No prior React component exists in repo |
| `src/content/hero.ts` | content data | transform | No prior data/content module exists in repo |
| `src/lib/cn.ts` | utility | transform | No prior utility module exists in repo |
| `vite.config.ts` / `vitest.config.ts` | config | build-time | No prior build config exists in repo |
| `*.test.ts(x)` files | test | request-response | No prior test framework/tests exist in repo |

## Metadata

**Analog search scope:** Entire repository (`Templates/`, `Portfolio-Documentation/`, `.planning/`, top-level) — confirmed no `src/` directory and no site `package.json` exists.
**Files scanned:** `Templates/Axisform/Axisform Studio Landing Page.html` (targeted grep + 2 non-overlapping reads: lines 845-874, 296-307), `.planning/codebase/STACK.md`/`ARCHITECTURE.md` (referenced, confirms greenfield status), repo root/`src` existence check via `ls`/`find`.
**Pattern extraction date:** 2026-07-23
