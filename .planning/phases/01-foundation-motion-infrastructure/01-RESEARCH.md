# Phase 1: Foundation & Motion Infrastructure - Research

**Researched:** 2026-07-23
**Domain:** Vite/React/TypeScript build tooling, Tailwind CSS v4 (CSS-first config), GSAP + ScrollTrigger + Lenis motion integration, React Router SPA setup
**Confidence:** MEDIUM (all package versions VERIFIED directly against the npm registry; integration patterns CITED from official docs/GitHub sources found via web search — Context7 MCP was unavailable in this session, see Sources)

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| QUAL-01 | User experiences GSAP/Lenis-driven scroll motion matching the Axisform reference's language (smooth-scroll, parallax, glass-morphism reveals) without breaking native scroll/keyboard navigation | Architecture Patterns → Lenis+GSAP+ScrollTrigger integration pattern; Common Pitfalls → Lenis/native-scroll parity; Code Examples → MotionProvider, useScrollReveal |
| QUAL-02 | User with `prefers-reduced-motion` enabled sees all non-essential motion disabled automatically | Architecture Patterns → MotionProvider reduced-motion context; Don't Hand-Roll → reduced-motion detection; Code Examples → `usePrefersReducedMotion` |
</phase_requirements>

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Phase Boundary:** This phase delivers the technical foundation everything else builds on: a Vite + React + TypeScript + Tailwind CSS v4 scaffold (no CDN script tags), a routing shell, a centralized reduced-motion-safe GSAP + Lenis motion system, and a first set of shared `components/ui/` primitives (button, card, typography). It proves the motion system works end-to-end via a real Hero section, not a throwaway test page. It does not build the rest of the homepage, case-study content, or any section beyond Hero — those are Phase 2/3.

**Visual Foundation (Tailwind v4 tokens)**
- D-01: Lock real Axisform-derived visual tokens (dark background palette, type scale, spacing) into the Tailwind v4 `@theme` config now, in Phase 1 — not deferred to Phase 3.
- D-02: Treat the Axisform reference template as loose inspiration, not a literal source — derive a similar dark cinematic palette/type scale but adjust exact values rather than extracting byte-for-byte from `Templates/Axisform/Axisform Studio Landing Page.html`.
- D-03: Inter is the primary typeface (matches both reference templates; Google Fonts, variable weights 400–900).
- D-04: Phase 1 ships dark-only. A light/dark theme toggle is NOT built in this phase.

**Placeholder/Demo Route**
- D-05: The route proving GSAP+Lenis scroll/reveal motion (success criterion #2) is a real Hero section built with actual copy from `Homepage Copy V2.md` — not a throwaway `/motion-test` page. Phase 3 refines this Hero rather than replacing it.
- D-06: Scope is Hero-only for Phase 1 — no second stubbed section.

**UI Primitive Styling Depth**
- D-07: Button, card, and typography primitives in `components/ui/` are styled to the Axisform aesthetic now (glass-morphism cards, dark chrome buttons, oversized editorial type) — not bare/functional scaffolding.
- D-08: Primitive scope is exactly button, card, typography. No Container/Section layout wrapper in Phase 1.

**Motion Authoring API**
- D-09: Components opt into scroll-driven motion via a shared hook, `useScrollReveal()`, built on GSAP + ScrollTrigger. The hook takes a ref + options and internally no-ops when `prefers-reduced-motion` is set — callers never write their own reduced-motion check.
- D-10: A single app-wide `MotionProvider` at the root owns Lenis initialization, GSAP/ScrollTrigger plugin registration, and the reduced-motion context value that `useScrollReveal()` (and future motion hooks) read from.
- D-11: Routing uses React Router. It must support the homepage route now and the `/case-study/:slug` dynamic routes Phase 2 will add, and needs to work cleanly with SPA rewrite rules for Phase 4's deployment hardening.

### Claude's Discretion
- Exact Tailwind `@theme` token names/values (within the "Axisform-inspired, not literally extracted" constraint from D-02).
- Internal file/folder structure for the motion module (e.g. `src/motion/`), UI primitives (e.g. `src/components/ui/`), and routes.
- Button/card component API shape (props, variants) as long as it supports the Axisform-styled look from D-07.
- ScrollTrigger cleanup/lifecycle details inside `useScrollReveal()`.

### Deferred Ideas (OUT OF SCOPE)
- **Light/dark theme toggle** — not in `REQUIREMENTS.md`, explicitly deferred to a later phase/backlog. If picked up later it needs a second token set, a theme-switching mechanism in the `MotionProvider`/token layer, and a toggle UI control.

### UI Design Contract (from 01-UI-SPEC.md, approved)
- No component library / no shadcn this phase (hand-rolled React + Tailwind v4). Icon library: `lucide-react`.
- Exactly 3 primitives: `Button` (`primary`, `ghost` variants, pill-shaped, `border-radius: 999px`), `Card` (`glass` variant only — `backdrop-filter: blur(16px)`, `border-radius: 24px`), `Typography` (`Label`/`Body`/`Heading`/`Display` roles, 2 weights only: 400/800).
- Spacing scale: 4/8/16/24/32/48/64 (`xs`–`3xl`), 44px minimum tap target for icon-only controls.
- Color tokens: Dominant `#0B0C0A`, Secondary `#16171A`, Accent `#FF6A33`, Destructive `#E5484D` (unused this phase), Foreground `#F2EFE6`, Muted foreground `rgba(242,239,230,0.58)`, Line `rgba(242,239,230,0.10)`.
- Copy is locked verbatim from `Homepage Copy V2.md` §02 — must live in a data/content module (e.g. `src/content/hero.ts`), not hardcoded in JSX.
</user_constraints>

## Summary

Phase 1 is a from-scratch build: no `package.json`, no `src/`, no build tooling exists anywhere in the repo. The two reference templates are single-file, CDN-loaded HTML mockups that must not be built upon directly — they exist purely for visual/motion-language inspiration. This research confirms current (July 2026), registry-verified package versions and integration patterns for the five moving pieces this phase must wire together: Vite 8 + React 19 + TypeScript 7, Tailwind CSS v4's CSS-first `@theme` config, GSAP 3.15 + ScrollTrigger + the official `@gsap/react` hook, Lenis 1.3 (which now ships its React bindings as a `lenis/react` subpath of the single `lenis` package, not a separate package), and React Router — which crossed a major version boundary (v7 → v8) in the last five weeks, removing the `react-router-dom` compatibility package entirely.

The single highest-leverage integration decision in this phase is **not** hand-rolling GSAP+React lifecycle management. React 18/19 StrictMode double-invokes effects in development, and a naive `useEffect` + `gsap.context()` pattern is a well-documented source of duplicate `ScrollTrigger` instances and desynced scroll state. The official `@gsap/react` package's `useGSAP()` hook exists specifically to solve this — it is a drop-in `useEffect`/`useLayoutEffect` replacement that auto-reverts its `gsap.context()` scope on unmount (including StrictMode's phantom mount→unmount→mount cycle) — and `useScrollReveal()` (D-09) should be built on top of it, not on raw `useEffect`.

The second highest-leverage decision is the Lenis↔GSAP sync direction: Lenis must run inside GSAP's `ticker`, not its own internal `requestAnimationFrame` loop, otherwise `ScrollTrigger` reads stale scroll positions and animations desync from scroll on scroll-heavy pages. Lenis is standards-based (wraps native scroll rather than hijacking it), so anchor links, `Tab`/keyboard scroll, and screen-reader scroll continue to work without extra effort — but this must be verified manually (Common Pitfalls), because a misconfigured `scrollerProxy` or an un-synced `ticker` is the most frequent way Lenis+ScrollTrigger integrations silently break keyboard/anchor navigation in the wild.

React Router's version jump (v7.18.1 → v8.3.0, released June 17 2026) is a "boring" major per the maintainers — nearly all breaking changes were opt-in Future Flags in v7 — but it does remove `react-router-dom` as an installable package. **Recommendation: install `react-router` directly (not `react-router-dom`), use Data Mode (`createBrowserRouter`)**, which gives nested/dynamic routes (`/case-study/:slug` in Phase 2) without the overhead of Framework Mode's Vite plugin and SSR/static-generation machinery this static SPA doesn't need.

Tailwind v4's CSS-first model is a genuine behavioral change from v3 knowledge an LLM might default to: there is no `tailwind.config.js` by default, no `content` array (automatic content detection), and design tokens are declared in a CSS `@theme { }` block using `--color-*`, `--font-*`, `--spacing-*` custom-property-style variable names that Tailwind reads at build time to generate utility classes. The install is `tailwindcss` + `@tailwindcss/vite` (the dedicated Vite plugin — no PostCSS/autoprefixer setup needed, it's built in).

**Primary recommendation:** Scaffold with Vite's React-TS template, wire Tailwind v4 via `@tailwindcss/vite` + a single `@theme` block in `src/index.css`, install `gsap` + `@gsap/react` + `lenis` + `react-router`, build `MotionProvider` around `useGSAP`'s cleanup guarantees and a Lenis instance driven by `gsap.ticker` (not its own rAF), expose reduced-motion via React Context read once via `matchMedia`, and route with React Router's Data Mode (`createBrowserRouter`) so Phase 2's `/case-study/:slug` route and Phase 4's SPA-rewrite deployment both attach cleanly.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Build tooling (Vite bundling, dev server, TS compile) | Browser / Client (build-time, produces static assets) | CDN / Static (deployed output is static HTML/JS/CSS) | No server runtime exists in this project — Vite always outputs a static SPA bundle; there is no SSR tier |
| Client-side routing (React Router, `/case-study/:slug`) | Browser / Client | CDN / Static (host must rewrite unknown paths to `index.html`) | Route matching/rendering happens entirely in-browser; the host's job is only to serve the SPA shell for any path (Phase 4 concern, flagged now) |
| Styling / design tokens (Tailwind v4 `@theme`) | Browser / Client | — | Tokens compile to static CSS at build time; no runtime theming server exists |
| Scroll/motion system (Lenis + GSAP + ScrollTrigger, `MotionProvider`) | Browser / Client | — | DOM-bound smooth-scroll interception and scroll-linked animation are inherently client-only concerns |
| Reduced-motion detection (`prefers-reduced-motion` context) | Browser / Client | — | Reads an OS-level signal via `window.matchMedia`, a browser-only API |
| UI primitives (`Button`, `Card`, `Typography`) | Browser / Client | — | Presentational React components, rendered and hydrated entirely client-side (no SSR in this SPA) |

**Why this matters:** every capability in this phase is Browser/Client tier — there is no backend, no SSR, no API layer. The only place a "secondary tier" appears is deployment-host rewrite config (CDN/Static), which is explicitly Phase 4's job (`DEPL-02`) but the routing *mode* chosen in Phase 1 (Data Mode vs. Framework Mode) directly determines how much host config that later phase needs — this is why React Router mode selection is called out as a now-or-rework-later decision in this research.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `vite` | 8.1.5 `[VERIFIED: npm registry]` | Build tool / dev server | Official Vite+React scaffold target; ships Rolldown (Rust bundler) by default as of v8, full plugin-API back-compat |
| `@vitejs/plugin-react` | 6.0.4 `[VERIFIED: npm registry]` | Official React fast-refresh plugin for Vite | Default plugin scaffolded by `npm create vite@latest -- --template react-ts`; more universally compatible than the SWC variant for a first-time setup |
| `react` / `react-dom` | 19.2.8 `[VERIFIED: npm registry]` | UI runtime | Current React major; required minimum for React Router v8 (`React 19.2.7+`) |
| `typescript` | 7.0.2 `[VERIFIED: npm registry]` | Type checking | GA July 8 2026 — native Go-ported compiler ("Project Corsa"), ~10x faster type-checking, same type-checking semantics as 5.x/6.x per the TS team; see Common Pitfalls for its stricter default `tsconfig` |
| `tailwindcss` | 4.3.3 `[VERIFIED: npm registry]` | Utility CSS engine | Locked by CONTEXT.md D-01/D-02; CSS-first `@theme` config model |
| `@tailwindcss/vite` | 4.3.3 `[VERIFIED: npm registry]` | Vite plugin for Tailwind v4 | Official first-party integration — replaces the old PostCSS pipeline entirely, no `postcss.config.js`/`autoprefixer` needed |
| `gsap` | 3.15.0 `[VERIFIED: npm registry]` | Core animation engine + `ScrollTrigger` plugin (bundled, imported from `gsap/ScrollTrigger`) | Locked by CONTEXT.md/ROADMAP — matches Axisform's motion language |
| `@gsap/react` | 2.1.2 `[VERIFIED: npm registry]` | Official `useGSAP()` React hook | Purpose-built StrictMode-safe replacement for hand-rolled `useEffect` + `gsap.context()`; see Don't Hand-Roll |
| `lenis` | 1.3.25 `[VERIFIED: npm registry]` | Smooth-scroll, wraps native scroll (doesn't hijack it) | Locked by CONTEXT.md/ROADMAP; ships its own React bindings at the `lenis/react` subpath — no separate package |
| `react-router` | 8.3.0 `[VERIFIED: npm registry]` | Client-side routing, Data Mode | D-11; v8 removed `react-router-dom` — import directly from `react-router` (+ `react-router/dom` for `RouterProvider`) |
| `lucide-react` | 1.26.0 `[VERIFIED: npm registry]` | Icon library | Locked by 01-UI-SPEC.md |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `clsx` | 2.1.1 `[VERIFIED: npm registry]` | Conditional className composition | `Button`/`Card` variant props need to merge base + variant + user-passed classes without string-concat bugs |
| `tailwind-merge` | 3.6.0 `[VERIFIED: npm registry]` | Resolves conflicting Tailwind utility classes (e.g. two `px-*` values) | Combine with `clsx` (the common `cn()` helper pattern) if primitives ever accept a `className` override prop |
| `class-variance-authority` | 0.7.1 `[VERIFIED: npm registry]` | Typed variant API for components (`variant: 'primary' | 'ghost'`) | Optional — only worth adding if `Button`/`Card` variant logic grows past a simple ternary; for exactly 2–1 variants (D-08 scope) a hand-written variant map may be sufficient (Claude's Discretion per CONTEXT.md) |
| `vitest` | 4.1.10 `[VERIFIED: npm registry]` | Test runner (Vite-native, Jest-compatible API) | Unit/behavior tests for `useScrollReveal`, `usePrefersReducedMotion`, UI primitives (see Validation Architecture) |
| `@testing-library/react` | 16.3.2 `[VERIFIED: npm registry]` | Component testing | Rendering/asserting UI primitives and hook behavior |
| `@testing-library/jest-dom` | 7.0.0 `[VERIFIED: npm registry]` | DOM assertion matchers | Pairs with `@testing-library/react` |
| `jsdom` | 29.1.1 `[VERIFIED: npm registry]` | DOM environment for Vitest | Required test environment since GSAP/ScrollTrigger/`matchMedia` all need a DOM to run against in tests |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Vite (SPA) | Next.js | Adds SSR/RSC machinery and a server runtime this project explicitly doesn't need (static portfolio, `DEPL-01`/`DEPL-02` assume a static SPA host) — not chosen; would also require abandoning the already-locked Vite+React+TS decision |
| React Router Data Mode | React Router Framework Mode | Framework Mode bundles routing + SSR/SSG + typesafe codegen behind its own Vite plugin — overkill for a 2-route-shape SPA (home + `/case-study/:slug`); Data Mode gets nested/dynamic routes without that overhead |
| React Router Data Mode | React Router Declarative Mode (`<BrowserRouter>`) | Simpler API, but loses the loader/data APIs that make future data-driven route work (Phase 2 content loading) cleaner; Data Mode costs little extra setup for meaningfully more headroom |
| `@gsap/react`'s `useGSAP()` | Hand-rolled `useEffect` + `gsap.context()` + `ctx.revert()` | Works, but re-implements exactly what `useGSAP()` already solves for StrictMode double-invoke; higher bug surface for no benefit |
| `lenis`'s bundled `lenis/react` export | `@studio-freight/react-lenis` (legacy name for the same project) | Frozen at `0.0.47`, effectively superseded by the `lenis/react` subpath shipped in the main `lenis` package — don't install the old name |
| TypeScript 7 (native/Go compiler) | Stay on latest TypeScript 5.x | TS 7 preserves identical type-checking semantics per the TS team and is a straight port, not a rewrite — but it hard-adopts TS 6.0's stricter defaults (implicit `strict: true`, no `target: es5`, no `baseUrl`). If the planner wants zero tsconfig surprises, pinning to a 5.x/6.x line and upgrading later is a safe fallback — flagged as a discretionary call, not re-litigated here since no locked decision exists on TS version |
| `class-variance-authority` for variants | Plain object/ternary variant maps | For exactly 2 `Button` variants and 1 `Card` variant (current D-08 scope), a typed variant library may be more machinery than the problem needs — reasonable to defer until Phase 2/3 grow the primitive surface |

**Installation:**
```bash
npm create vite@latest . -- --template react-ts
npm install tailwindcss @tailwindcss/vite
npm install gsap @gsap/react lenis
npm install react-router
npm install lucide-react clsx tailwind-merge
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

**Version verification:** All versions above were confirmed live against the npm registry (`npm view <pkg> version` + `npm view <pkg> time --json`, cross-checked with a direct `registry.npmjs.org` fetch) on 2026-07-23 — not taken from training data, which would be stale by more than a year for several of these (React Router v8, Vite 8, TypeScript 7, and Tailwind v4 all shipped after this assistant's training cutoff).

## Package Legitimacy Audit

Ran `gsd-tools query package-legitimacy check --ecosystem npm` against every package in Standard Stack. **Important caveat on the results:** the checker's "too-new" signal is computed from the **latest published version's** timestamp, not the package's original creation date. For extremely high-velocity, high-download packages (React, Vite, TypeScript, Tailwind, React Router, `@vitejs/plugin-react`, `@testing-library/jest-dom`, `vitest`), a very recent patch/minor release is normal and expected, not a legitimacy signal — every one of these packages has an official GitHub source repo matching its well-known maintainer org and tens to hundreds of millions of weekly downloads. Treat the `SUS`/"too-new" rows below as a **heuristic false-positive for actively-maintained mainstream tooling**, not a slopsquatting risk — no `checkpoint:human-verify` gate is warranted for these specific rows despite the raw verdict.

| Package | Registry | Latest Publish | Weekly Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----------------|-------------------|--------------|---------|-------------|
| `tailwindcss` | npm | 2026-07-16 (7 days old) | 113,489,645 | `github.com/tailwindlabs/tailwindcss` | SUS (too-new heuristic) | Approved — override, see caveat above |
| `@tailwindcss/vite` | npm | 2026-07-16 | 41,483,184 | `github.com/tailwindlabs/tailwindcss` | SUS (too-new heuristic) | Approved — override |
| `gsap` | npm | 2026-04-13 (3+ mo old) | 3,947,500 | `github.com/greensock/GSAP` | OK | Approved |
| `@gsap/react` | npm | 2025-01-15 (18+ mo old) | 1,030,605 | `github.com/greensock/react` | OK | Approved |
| `lenis` | npm | 2026-06-26 (~4 wk old) | 1,142,391 | `github.com/darkroomengineering/lenis` | SUS (too-new heuristic) | Approved — override; smaller download count than the giants above, spot-checked README directly (see Sources) |
| `react-router` | npm | 2026-07-22 (1 day old) | 49,300,054 | `github.com/remix-run/react-router` | SUS (too-new heuristic) | Approved — override; v8.3.0 is a patch release on an already-established (June 2026) major |
| `react` / `react-dom` | npm | 2026-07-21 | 159,674,528 / 150,710,252 | `github.com/react/react` (mirrors facebook/react publishing) | SUS (too-new heuristic) | Approved — override |
| `vite` | npm | 2026-07-16 | 157,094,468 | `github.com/vitejs/vite` | SUS (too-new heuristic) | Approved — override |
| `@vitejs/plugin-react` | npm | 2026-07-22 | 74,975,282 | `github.com/vitejs/vite-plugin-react` | SUS (too-new heuristic) | Approved — override |
| `typescript` | npm | 2026-07-08 | 239,877,049 | `github.com/microsoft/TypeScript` | SUS (too-new heuristic) | Approved — override |
| `lucide-react` | npm | 2026-07-23 (today) | 94,784,682 | `github.com/lucide-icons/lucide` | SUS (too-new heuristic) | Approved — override |
| `clsx` | npm | 2024-04-23 | 112,057,355 | `github.com/lukeed/clsx` | OK | Approved |
| `tailwind-merge` | npm | 2026-05-10 | 75,401,483 | `github.com/dcastil/tailwind-merge` | OK | Approved |
| `class-variance-authority` | npm | 2024-11-26 | 58,470,790 | `github.com/joe-bell/cva` | OK | Approved |
| `vitest` | npm | 2026-07-06 | 79,970,325 | `github.com/vitest-dev/vitest` | SUS (too-new heuristic) | Approved — override |
| `@testing-library/react` | npm | 2026-01-19 | 47,931,857 | `github.com/testing-library/react-testing-library` | OK | Approved |
| `@testing-library/jest-dom` | npm | 2026-07-20 | 53,782,675 | `github.com/testing-library/jest-dom` | SUS (too-new heuristic) | Approved — override |
| `jsdom` | npm | 2026-04-30 | 82,841,187 | `github.com/jsdom/jsdom` | OK | Approved |

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** all rows above marked "too-new heuristic" — reviewed and overridden per the caveat (established, high-download, correctly-sourced packages; no unverified/hallucinated names in this list). No `checkpoint:human-verify` task is required before installing any package in this table. If the planner or executor wants an extra layer of caution regardless, the lowest-confidence-by-download-count entry is `lenis` (1.14M weekly downloads vs. tens/hundreds of millions for the rest) — reasonable candidate for a single manual glance at its README/CHANGELOG before `npm install`, but not blocking.

## Architecture Patterns

### System Architecture Diagram

```
OS-level "Reduce Motion" setting
        │
        ▼
window.matchMedia('(prefers-reduced-motion: reduce)')
        │  (read once, subscribed via 'change' listener)
        ▼
┌───────────────────────────── MotionProvider (root, wraps <RouterProvider>) ─────────────────────────────┐
│                                                                                                          │
│  1. gsap.registerPlugin(ScrollTrigger)   — once, at module scope                                        │
│  2. new Lenis({ ...options })            — smooth-scroll instance wrapping native scroll                │
│  3. lenis.on('scroll', ScrollTrigger.update)   — keeps ScrollTrigger's cached positions live             │
│  4. gsap.ticker.add((time) => lenis.raf(time * 1000))  — single rAF loop drives both Lenis & GSAP        │
│  5. ReducedMotionContext.Provider value={prefersReducedMotion}                                          │
│                                                                                                          │
└───────────────────────────────────────────┬────────────────────────────────────────────────────────────┘
                                             │  context read by
                                             ▼
                                 useScrollReveal(ref, options)
                                 (built on @gsap/react's useGSAP())
                                             │
                     ┌───────────────────────┼────────────────────────┐
                     │ if prefersReducedMotion│  else                 │
                     ▼                        ▼                       │
            no-op (element renders      gsap.context(() => {          │
            in final visible state,     ScrollTrigger.create({        │
            no animation registered)      trigger: ref.current, ...   │
                                         })                            │
                                       }, ref)  →  auto-revert on      │
                                       unmount/StrictMode remount      │
                                             │
                                             ▼
                          Hero section (Label → Body statement → Button → Card)
                          composed from components/ui/{Button,Card,Typography}
                                             │
                                             ▼
                          Rendered inside a React Router Data Mode route tree
                          (createBrowserRouter) — home route now, /case-study/:slug
                          route shape reserved for Phase 2
                                             │
                                             ▼
                          Native browser scroll / keyboard nav / anchor links
                          (Lenis wraps, does not replace, native scrolling)
```

Trace the primary use case: OS reduced-motion setting → `matchMedia` → `MotionProvider` context → `useScrollReveal` reads the context and either no-ops or registers a `ScrollTrigger` → Hero section renders using `components/ui/` primitives inside a routed page → native scroll/keyboard/anchor behavior is preserved throughout because Lenis wraps rather than intercepts the browser's own scroll.

### Recommended Project Structure
```
src/
├── main.tsx                 # createRoot, renders <RouterProvider> wrapped in <MotionProvider>
├── index.css                 # single Tailwind entry: @import "tailwindcss"; + @theme { ... }
├── router.tsx                 # createBrowserRouter route tree (Data Mode)
├── routes/
│   └── home.tsx               # Hero-only route this phase
├── motion/
│   ├── MotionProvider.tsx     # Lenis init, ScrollTrigger plugin registration, reduced-motion context
│   ├── useScrollReveal.ts     # public motion-authoring hook (built on @gsap/react's useGSAP)
│   └── usePrefersReducedMotion.ts  # matchMedia hook consumed only by MotionProvider
├── components/
│   └── ui/
│       ├── Button.tsx
│       ├── Card.tsx
│       └── Typography.tsx     # Label / Body / Heading / Display
├── content/
│   └── hero.ts                # Hero copy as data, not hardcoded JSX (per 01-UI-SPEC.md)
└── lib/
    └── cn.ts                  # clsx + tailwind-merge className helper, if adopted
```

### Pattern 1: MotionProvider owns all cross-cutting motion state
**What:** A single provider component mounted once near the app root initializes Lenis, registers the `ScrollTrigger` GSAP plugin, wires Lenis's scroll events into `ScrollTrigger.update`, drives Lenis's `raf` from `gsap.ticker` (not its own internal loop), and exposes the resolved `prefers-reduced-motion` boolean via React Context.
**When to use:** Exactly once, at the app root — this is what satisfies D-10 and success criterion #3 ("no per-component opt-in code required").
**Example:**
```tsx
// src/motion/MotionProvider.tsx
// Pattern synthesized from GSAP's official React guidance (gsap.com/resources/React)
// and Lenis+GSAP ticker-sync guidance (github.com/darkroomengineering/lenis)
import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

const ReducedMotionContext = createContext(false);
export const usePrefersReducedMotionContext = () => useContext(ReducedMotionContext);

export function MotionProvider({ children }: { children: ReactNode }) {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setPrefersReducedMotion(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    // Lenis wraps native scroll rather than replacing it — anchor links,
    // Tab/keyboard scroll, and screen-reader scroll all keep working.
    const lenis = new Lenis({ autoRaf: false });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);

    // Single rAF loop: GSAP's ticker drives Lenis, not Lenis's own internal loop.
    // gsap.ticker passes seconds; Lenis.raf expects milliseconds.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
```

### Pattern 2: useScrollReveal built on @gsap/react's useGSAP (not raw useEffect)
**What:** `useScrollReveal(ref, options)` wraps GSAP's official `useGSAP()` hook so cleanup/StrictMode safety is inherited for free, and reads `usePrefersReducedMotionContext()` internally so callers never write their own check (D-09).
**When to use:** Any component in `components/ui/` or a route/section that wants a scroll-triggered reveal.
**Example:**
```tsx
// src/motion/useScrollReveal.ts
// Pattern per GSAP + React official docs (gsap.com/resources/React) —
// useGSAP() auto-reverts its gsap.context() scope on unmount, including
// StrictMode's dev-only phantom mount→unmount→mount cycle.
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type { RefObject } from 'react';
import { usePrefersReducedMotionContext } from './MotionProvider';

interface ScrollRevealOptions {
  y?: number;       // px travel distance, default 32 (xl spacing token)
  duration?: number;
  start?: string;   // ScrollTrigger start position
}

export function useScrollReveal(
  ref: RefObject<HTMLElement>,
  { y = 32, duration = 0.8, start = 'top 85%' }: ScrollRevealOptions = {}
) {
  const prefersReducedMotion = usePrefersReducedMotionContext();

  useGSAP(() => {
    if (!ref.current || prefersReducedMotion) return; // no-op — no per-caller check needed

    gsap.from(ref.current, {
      y,
      opacity: 0,
      duration,
      ease: 'power2.out',
      scrollTrigger: { trigger: ref.current, start },
    });
  }, { scope: ref, dependencies: [prefersReducedMotion] }); // revert + re-run if pref changes mid-session
}
```

### Pattern 3: React Router Data Mode for a Vite SPA
**What:** `createBrowserRouter` + `<RouterProvider>` from `react-router` (not `react-router-dom` — removed in v8) and `react-router/dom` for the provider's browser-specific export.
**When to use:** Now, for the homepage route; Phase 2 adds `/case-study/:slug` as a sibling route object without restructuring.
**Example:**
```tsx
// src/router.tsx
// Pattern per React Router "Picking a Mode" docs (reactrouter.com/start/modes)
// and the v7→v8 migration guide (react-router-dom removed; import from
// 'react-router' + 'react-router/dom')
import { createBrowserRouter } from 'react-router';
import App from './App';
import HomeRoute from './routes/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      // Phase 2 reserves this shape:
      // { path: 'case-study/:slug', element: <CaseStudyRoute /> },
    ],
  },
]);
```
```tsx
// src/main.tsx
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router/dom';
import { MotionProvider } from './motion/MotionProvider';
import { router } from './router';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <MotionProvider>
    <RouterProvider router={router} />
  </MotionProvider>
);
```

### Anti-Patterns to Avoid
- **Per-component `matchMedia` listeners:** Every animated component re-implementing its own reduced-motion check violates D-09/D-10 and success criterion #3 outright — the check must live once, in `MotionProvider`/`useScrollReveal`.
- **Lenis driven by its own internal rAF while GSAP runs on `gsap.ticker`:** two separate animation loops racing each other is the single most common cause of scroll-position desync between Lenis and `ScrollTrigger` in the wild — always set `autoRaf: false` on Lenis and drive it from `gsap.ticker.add`.
- **Hand-rolled `gsap.context()` cleanup instead of `useGSAP()`:** works today, but re-implements exactly the StrictMode-safety logic `@gsap/react` already ships and tests — higher bug surface for zero benefit.
- **Full-viewport intro loader / scroll-jacking:** explicitly out of scope per `REQUIREMENTS.md`'s Out of Scope table — not part of Axisform's motion language to carry forward regardless of what the reference template's loader does.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| GSAP effect cleanup under React StrictMode | Custom `useEffect` + manual `gsap.context()`/`ctx.revert()` bookkeeping | `@gsap/react`'s `useGSAP()` hook | Purpose-built by GSAP's maintainers specifically to survive StrictMode's double-invoke dev behavior; hand-rolling this is reinventing a solved, officially-shipped problem |
| Smooth-scroll that preserves native scroll semantics | A custom scroll-interception layer (`wheel`/`touchmove` handlers repositioning content) | `lenis` | Lenis wraps native scroll rather than replacing it, so anchor links, keyboard (`Tab`/`Space`/arrow) scroll, and screen-reader scroll all keep working "for free" — QUAL-01 explicitly requires this not break |
| `prefers-reduced-motion` detection | Reading the media query ad hoc inside every animated component | One `matchMedia` subscription inside `MotionProvider`, exposed via Context | Centralizing avoids drift (some components checking, others forgetting) and is the literal mechanism the phase's success criterion #3 requires |
| SPA client-route rewrite handling at the host | A custom Express/Node catch-all server | The deployment host's documented rewrite mechanism (Vercel `vercel.json` rewrites, Netlify `public/_redirects`) | Both hosts already solve "serve `index.html` for any unmatched path" declaratively — this project has no server runtime to host a catch-all in anyway (flagged now for Phase 4, `DEPL-02`) |
| Conditional Tailwind className composition | String concatenation / template literals for variant classes | `clsx` (+ `tailwind-merge` if conflicting utilities need resolving) | Trivial-looking string-concat bugs (duplicate/conflicting utility classes, missing space) are exactly what these two small, extremely widely-used libraries exist to eliminate |

**Key insight:** every "don't hand-roll" item above already has a first-party or extremely-well-established library solution shipped by the same maintainers as the core library (GSAP's own React package, Lenis's own React subpath, the deployment host's own documented config format). None of these problems benefit from a custom implementation in a portfolio project — the payoff of hand-rolling would be near zero and the StrictMode/scroll-desync failure modes are subtle enough to cost real debugging time later.

## Common Pitfalls

### Pitfall 1: Duplicate ScrollTrigger instances from React StrictMode
**What goes wrong:** In development, React 18/19 StrictMode intentionally mounts, unmounts, then remounts every component once. A naive `useEffect(() => { gsap.to(...) }, [])` without matching cleanup registers a `ScrollTrigger` on the first (phantom) mount that never gets killed, then registers a second one on the real mount — resulting in duplicate/conflicting scroll-triggered animations, visible as an element animating twice or triggers firing at the wrong scroll position.
**Why it happens:** GSAP's animations and `ScrollTrigger` instances are not React-aware; they persist independently of the component tree unless explicitly reverted.
**How to avoid:** Build `useScrollReveal()` on `@gsap/react`'s `useGSAP()` hook (Pattern 2 above), which auto-reverts its `gsap.context()` scope on every unmount including StrictMode's phantom one.
**Warning signs:** An element appears to animate twice, or `ScrollTrigger.getAll().length` (checked in dev console) is larger than the number of triggers you actually created.

### Pitfall 2: Lenis and GSAP running on two separate animation loops
**What goes wrong:** If Lenis is left on its default internal `requestAnimationFrame` loop while GSAP animations/`ScrollTrigger` run on `gsap.ticker`, the two loops execute in a different order each frame. `ScrollTrigger` ends up reading a stale scroll position, causing visible jitter or reveal animations that fire a frame late/early.
**Why it happens:** Two independent `requestAnimationFrame` callbacks are not guaranteed to run in a fixed relative order across browsers/frames.
**How to avoid:** Set `autoRaf: false` on the Lenis instance and drive it explicitly via `gsap.ticker.add((time) => lenis.raf(time * 1000))` (note the seconds→milliseconds conversion), and call `lenis.on('scroll', ScrollTrigger.update)` so `ScrollTrigger`'s cache invalidates on every Lenis scroll tick.
**Warning signs:** Scroll-triggered reveals feel "laggy" or slightly desynced from the actual scroll position, especially noticeable on fast scroll/trackpad flicks.

### Pitfall 3: Tailwind v4 config written in the v3 mental model
**What goes wrong:** Writing a `tailwind.config.js` with a `theme.extend` object and a `content` array (v3 patterns an LLM's training data defaults to), then wondering why custom tokens/colors aren't generating utility classes.
**Why it happens:** Tailwind v4 is CSS-first — design tokens are declared inside a `@theme { --color-*: ...; }` block in a CSS file, not a JS config object, and content scanning is automatic (no `content` array needed for the common case).
**How to avoid:** Do not create a `tailwind.config.js` unless a specific legacy plugin requires it. Define everything in `src/index.css`'s `@theme` block, imported once via `@import "tailwindcss";`.
**Warning signs:** Custom color/spacing utilities silently don't exist (`bg-brand` renders as nothing) because they were declared in a `tailwind.config.js` v4 never reads by default.

### Pitfall 4: TypeScript 7's stricter default tsconfig breaking an unmigrated scaffold
**What goes wrong:** TypeScript 7 hard-adopts TS 6.0's stricter defaults — if a `tsconfig.json` doesn't explicitly set `"strict": true`, TS 7 turns it on anyway (including `noImplicitAny`, `strictNullChecks`); `target: "es5"`, `moduleResolution: "node"`, and `baseUrl` are removed outright. A `tsconfig.json` copy-pasted from an older tutorial/example can fail to compile.
**Why it happens:** TS 7 is a straight compiler port (identical type-checking semantics), but it also finalizes deprecations that were only warnings in 6.0 into hard errors in 7.0.
**How to avoid:** Use Vite's own `npm create vite@latest -- --template react-ts` scaffolded `tsconfig.json` as the starting point rather than an older reference — it already targets current module resolution (`bundler`) and doesn't use the removed options.
**Warning signs:** `tsc` errors referencing `moduleResolution`, `baseUrl`, or `target` immediately after install, before any application code is written.

### Pitfall 5: Lenis/ScrollTrigger breaking keyboard or anchor-link scroll despite Lenis's native-scroll design
**What goes wrong:** Even though Lenis is designed to wrap (not replace) native scroll, a misconfigured integration — most often a custom `ScrollTrigger.scrollerProxy()` that doesn't correctly proxy `scrollTop`/`scrollTo` back to Lenis, or forgetting `lenis.on('scroll', ScrollTrigger.update)` — can leave keyboard scroll (`Tab`, `Page Down`, arrow keys on a focused scrollable) visually desynced from where `ScrollTrigger` thinks the page is, or anchor-link jumps (`<a href="#section">`) landing at the wrong position.
**Why it happens:** The default Lenis+GSAP setup (this research's recommended pattern) does not require a manual `scrollerProxy` — that's an older/more complex integration pattern some tutorials still show. Adding one unnecessarily is the most common way to introduce this bug.
**How to avoid:** Use the simpler, current pattern (Lenis on `gsap.ticker` + `lenis.on('scroll', ScrollTrigger.update)`, no manual `scrollerProxy`) and manually verify — this is exactly what success criterion #2 requires and it is not purely a static/type-check-able property, so it needs a manual pass (see Validation Architecture).
**Warning signs:** Clicking an in-page anchor link overshoots/undershoots the target section; pressing `Tab` to focus an off-screen interactive element doesn't scroll it into view correctly.

## Code Examples

### Tailwind v4 CSS-first setup
```ts
// vite.config.ts
// Source: Tailwind CSS v4 official Vite integration (tailwindcss.com/docs — CITED via web search)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
});
```
```css
/* src/index.css */
/* Source: Tailwind CSS v4 @theme documentation pattern (CITED via web search) */
@import "tailwindcss";

@theme {
  /* Color tokens per 01-UI-SPEC.md */
  --color-dominant: #0B0C0A;
  --color-secondary: #16171A;
  --color-accent: #FF6A33;
  --color-destructive: #E5484D;
  --color-foreground: #F2EFE6;
  --color-line: rgba(242, 239, 230, 0.10);

  /* Spacing scale per 01-UI-SPEC.md (xs..3xl) */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;

  /* Typography per 01-UI-SPEC.md — 2 weights only (400, 800) */
  --font-sans: 'Inter', system-ui, sans-serif;
}
```

### `usePrefersReducedMotion` (standalone, if not folded directly into MotionProvider)
```ts
// src/motion/usePrefersReducedMotion.ts
// Source: common React + matchMedia community pattern (CITED via web search,
// cross-referenced against multiple independent sources — see Sources)
import { useEffect, useState } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefers, setPrefers] = useState(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const listener = () => setPrefers(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return prefers;
}
```

### Vercel/Netlify SPA rewrite (Phase 4 concern — flagged now per CONTEXT.md so routing mode doesn't need rework)
```json
// vercel.json
// Source: Vercel + React Router deployment docs pattern (CITED via web search)
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```
```
# public/_redirects (Netlify)
/*    /index.html   200
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Tailwind config in `tailwind.config.js` (JS object, `content` array) | CSS-first `@theme { }` block, automatic content detection | Tailwind v4 (Jan 2026 GA line; this project pins 4.3.3) | An LLM's default training-data instinct (write a `tailwind.config.js`) produces a file v4 ignores by default — must be actively avoided |
| `react-router-dom` as the installable package | `react-router` (core) + `react-router/dom` (browser bindings) | v7 kept `react-router-dom` as a re-export shim; **v8 (June 2026) removed it entirely** | Any tutorial/training-data example importing from `react-router-dom` will not work once this project is on v8 |
| Manual `useEffect` + `gsap.context()` cleanup | `@gsap/react`'s `useGSAP()` hook | `@gsap/react` has existed since 2023 but is still frequently skipped in favor of manual patterns in older tutorials | Manual cleanup still works but re-implements a solved StrictMode-safety problem |
| Lenis's own internal rAF loop | Lenis driven by `gsap.ticker` (`autoRaf: false`) | Recommended pattern for any Lenis+GSAP pairing, not new in 2026 but still frequently omitted in copy-pasted examples | Prevents the scroll-desync pitfall documented above |
| TypeScript's JS-based ("Strada") compiler | TypeScript 7's native Go-ported compiler ("Corsa") | TS 7.0 GA July 8 2026 | ~10x faster type-checking; identical semantics but stricter default `tsconfig` (see Pitfall 4) |

**Deprecated/outdated:**
- `react-router-dom`: fully removed as of React Router v8 — do not add it as a dependency for this project.
- `@studio-freight/react-lenis`: superseded by the `lenis/react` subpath shipped inside the main `lenis` package; the old scoped package is frozen at a pre-1.0 version.
- Tailwind v3's `tailwind.config.js` + PostCSS/autoprefixer pipeline: replaced by `@tailwindcss/vite` + CSS-first `@theme` in v4.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@vitejs/plugin-react` (Babel-based) is the better first-time choice over `@vitejs/plugin-react-swc` for this project | Standard Stack → Core | Low — both are official, interchangeable Vite plugins; swapping later is a one-line `vite.config.ts` change with no code impact |
| A2 | TypeScript 7's identical-semantics claim (from vendor/community blog posts, not the official TS release notes directly) holds for this project's actual code | Standard Stack → Alternatives Considered, Pitfall 4 | Medium — if a subtle semantic difference surfaces, the fallback (pin to TS 5.x/6.x) is cheap to apply before any app code depends on TS-7-specific behavior |
| A3 | `class-variance-authority` is unnecessary machinery for exactly 2 `Button` variants + 1 `Card` variant in this phase | Standard Stack → Alternatives Considered | Low — already framed as Claude's Discretion in CONTEXT.md; easy to add later without breaking the component's public API if variant count grows |
| A4 | Context7 MCP being unavailable this session didn't materially change findings vs. official docs (websearch results were cross-referenced against `gsap.com`, `tailwindcss.com`, `reactrouter.com` and GitHub source repos, not single-source blog posts) | Sources | Low-Medium — the planner should treat the integration-pattern claims (not the version numbers, which are `[VERIFIED]` via direct registry query) as `[CITED]` rather than `[VERIFIED]`, and spot-check against official docs during implementation if anything looks off |

## Open Questions

1. **`@vitejs/plugin-react` vs. `@vitejs/plugin-react-swc`**
   - What we know: Both are official, both work with Vite 8/React 19; SWC is faster on large codebases.
   - What's unclear: Whether this project's scale ever benefits meaningfully from the SWC build-speed win (unlikely for a portfolio site).
   - Recommendation: Default to `@vitejs/plugin-react` (the one `npm create vite@latest -- --template react-ts` scaffolds) for maximum compatibility; revisit only if dev-server rebuild speed becomes noticeably slow.

2. **React Router v8 vs. staying on the v7 line**
   - What we know: v8 is a "boring" major (nearly all changes were opt-in Future Flags in v7), released June 17 2026, now 5+ weeks old with 3 patch releases; `react-router-dom` no longer exists as of v8.
   - What's unclear: Whether any Phase 2/3/4-relevant React Router feature (e.g. specific loader/data APIs) behaves differently enough to matter for this project's simple 2-route-shape needs.
   - Recommendation: Go with v8 now (matches the "current, not stale" research goal and avoids installing a package — `react-router-dom` — that's already a dead end); the migration guide's breaking-change list is short enough to sanity-check against the planner's actual route tree if anything surfaces during Phase 2.

3. **TypeScript 7 adoption timing**
   - What we know: GA as of July 8 2026, straight compiler port preserving semantics, but stricter default `tsconfig`.
   - What's unclear: Whether any Vite/React ecosystem tooling this project will add later (e.g. a linter, a testing library type-defs package) has fully caught up to TS 7 in the ~2 weeks since GA.
   - Recommendation: Use TS 7 (current, registry-verified), but if the planner hits an unexpected type-checking error from a third-party `.d.ts` file during Wave 0 setup, falling back to the latest TS 5.x/6.x is a low-cost, fully-supported escape hatch — flag this as a first-hour sanity check rather than a blocking decision now.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite dev server, npm scripts, all tooling | ✓ | v26.5.0 | — |
| npm | Package installation | ✓ | 11.17.0 | — |
| git | Version control (already a repo) | ✓ | 2.50.1 | — |
| Internet access to `registry.npmjs.org` | `npm install` for all packages above | ✓ (confirmed during this research session via direct `curl`) | — | — |

**Missing dependencies with no fallback:** none.
**Missing dependencies with fallback:** none — this phase has no external service dependencies beyond the npm registry and Google Fonts CDN (for Inter, per D-03), both of which are standard, unauthenticated, publicly reachable resources.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.10 (Vite-native, Jest-compatible API) + `@testing-library/react` 16.3.2 + `jsdom` 29.1.1 |
| Config file | none yet — see Wave 0 Gaps |
| Quick run command | `npx vitest run --reporter=dot` |
| Full suite command | `npx vitest run` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| QUAL-01 | `useScrollReveal` registers a `ScrollTrigger`-driven `gsap.from` when motion is enabled | unit | `npx vitest run src/motion/useScrollReveal.test.ts` | ❌ Wave 0 |
| QUAL-01 | Native scroll/keyboard nav/anchor-link behavior is preserved with Lenis mounted | manual-only (jsdom cannot simulate real scroll physics/OS keyboard scroll) | manual UAT: `Tab` through the Hero, click an anchor link, verify scroll lands correctly | n/a |
| QUAL-02 | `usePrefersReducedMotion` / `MotionProvider` context reflects `matchMedia` state and updates on `change` | unit | `npx vitest run src/motion/usePrefersReducedMotion.test.ts` | ❌ Wave 0 |
| QUAL-02 | `useScrollReveal` no-ops (creates zero `ScrollTrigger` instances) when reduced-motion context is `true` | unit | `npx vitest run src/motion/useScrollReveal.test.ts` | ❌ Wave 0 |
| — | `Button`/`Card`/`Typography` render expected variant classnames | unit (component smoke test) | `npx vitest run src/components/ui/*.test.tsx` | ❌ Wave 0 |
| — | No orphaned `ScrollTrigger` instances after route unmount (StrictMode safety) | integration | `npx vitest run src/motion/MotionProvider.test.tsx` — assert `ScrollTrigger.getAll().length` returns to 0 after unmount | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run --reporter=dot` (fast subset relevant to the changed file)
- **Per wave merge:** `npx vitest run` (full suite)
- **Phase gate:** Full suite green before `/gsd-verify-work`, plus the manual UAT pass for native scroll/keyboard/anchor behavior (not automatable in jsdom) and a manual OS-level `prefers-reduced-motion` toggle check across at least one animated component.

### Wave 0 Gaps
- [ ] `vitest.config.ts` (or `vite.config.ts` test block) — set `test.environment: 'jsdom'`, add a setup file registering `@testing-library/jest-dom` matchers
- [ ] `src/motion/useScrollReveal.test.ts` — covers QUAL-01/QUAL-02 hook behavior
- [ ] `src/motion/usePrefersReducedMotion.test.ts` (or `MotionProvider.test.tsx` if folded in) — covers QUAL-02
- [ ] `src/components/ui/*.test.tsx` — smoke tests for Button/Card/Typography primitives
- [ ] Framework install: `npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom`
- [ ] Manual UAT checklist entry for keyboard/anchor-scroll parity (QUAL-01) and OS-level reduced-motion toggle (QUAL-02) — neither is meaningfully testable in `jsdom`

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth surface exists in this phase (or the whole project — it's a static portfolio) |
| V3 Session Management | No | No sessions/cookies in this phase |
| V4 Access Control | No | No protected resources in this phase |
| V5 Input Validation | No | No user input exists yet — Hero is static content; the contact form (`CONT-01`) is Phase 4's concern |
| V6 Cryptography | No | Nothing to encrypt/hash in this phase |
| V14 Configuration (dependency integrity) | Yes | `npm install` with the lockfile committed (`package-lock.json`); no `postinstall` scripts detected on any recommended package (spot-checked via `npm view <pkg> scripts.postinstall`, all empty) |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|-----------------------|
| Supply-chain / dependency confusion (malicious package with a similar name) | Tampering | Package Legitimacy Audit above — every recommended package verified against the npm registry with matching official source repos; commit the lockfile so CI/deploy installs exactly what was audited |
| XSS via unescaped dynamic content in a future data-driven route | Tampering | Not applicable yet — Phase 1's only content is static, developer-authored copy (`src/content/hero.ts`); becomes relevant starting Phase 2 when case-study Markdown content is rendered (flag for that phase's research, not this one) |
| CDN/build-time script injection (e.g. compromised Google Fonts embed) | Tampering | Load Inter via the standard `fonts.googleapis.com`/`fonts.gstatic.com` `<link>` pattern (same origin Google already uses across both reference templates) — no inline `<script>` CDN tags of any kind, consistent with this phase's explicit "no CDN script tags" success criterion |

## Sources

### Primary (HIGH confidence)
- Direct `npm view <pkg> version` / `npm view <pkg> time --json` against `registry.npmjs.org` for every package listed in Standard Stack, cross-checked with a direct `curl https://registry.npmjs.org/<pkg>/latest` fetch — run live during this research session (2026-07-23), not sourced from training data.
- `gsd-tools query package-legitimacy check` — machine-computed verdicts against registry signals (downloads, repo URL, publish age, postinstall scripts) for every recommended package.

### Secondary (MEDIUM confidence — web search, cross-referenced against official/known-authoritative sources)
- Tailwind CSS v4 `@theme`/Vite integration — cross-referenced against `tailwindcss.com` official docs and blog (`tailwindcss.com/blog/tailwindcss-v4`).
- GSAP + React integration (`useGSAP`, `gsap.context`, StrictMode safety) — cross-referenced against GSAP's own official React resource page (`gsap.com/resources/React/`) and the `greensock/react` GitHub repo.
- Lenis + GSAP ticker sync pattern — cross-referenced against the `darkroomengineering/lenis` official README/GitHub discussions and the package's own `exports` map (verified directly via `npm view lenis exports`).
- React Router v7→v8 migration (removal of `react-router-dom`, mode selection) — cross-referenced against `reactrouter.com/start/modes`, the official upgrade guide (`reactrouter.com/upgrading/v7`), and the Remix/React Router v8 blog announcement.
- Vercel/Netlify SPA rewrite configuration — cross-referenced against Vercel's own React Router deployment docs (`vercel.com/docs/frameworks/frontend/react-router`).
- TypeScript 7 native-compiler GA details (release date, stricter tsconfig defaults) — multiple independent third-party technical write-ups converging on the same facts (release date, "Corsa"/"Strada" naming, `strict` default change); no single official TS blog post URL was directly retrieved in this session, so semantics claims are logged in the Assumptions table.
- Vite 8/Rolldown release details — multiple independent third-party technical write-ups converging on the same facts (release date, Rust-based bundler default).

### Tertiary (LOW confidence)
- None used as a sole source for any claim in this document — every non-registry-verified claim above was cross-checked against at least one recognizable official-domain or project-GitHub source per the Secondary list.

**Note on Context7:** The `mcp__context7__resolve-library-id` tool was unavailable in this execution environment (tool call failed with "No such tool available"). Per the tool-strategy fallback rule, all `docs`-kind research questions fell back to `websearch` instead of Context7. If Context7 becomes available in a later session, the planner or a future research pass should re-verify the GSAP/Tailwind/React-Router integration code samples against Context7's canonical snippets before treating them as HIGH confidence.

## Metadata

**Confidence breakdown:**
- Standard stack (versions): HIGH — every version number directly verified against the live npm registry in this session, not training data
- Standard stack (choice rationale) / Architecture patterns: MEDIUM — sourced via web search, cross-referenced against official docs/GitHub repos rather than a single blog post, but not confirmed via Context7 (unavailable this session)
- Package legitimacy: MEDIUM — machine-computed verdicts, manually reviewed and overridden where the "too-new" heuristic produced a false positive on well-established, high-download, correctly-sourced packages (documented explicitly in the audit table)
- Pitfalls: MEDIUM — GSAP/StrictMode and Lenis/ScrollTrigger desync pitfalls are well-documented, recurring community issues (multiple independent sources describe the same failure mode and fix), but no first-party GSAP/Lenis blog post was directly retrieved confirming them as "known issues" in those exact terms

**Research date:** 2026-07-23
**Valid until:** 2026-08-06 (14 days — shorter than the default 30-day window because this phase's stack includes two libraries that crossed a major version boundary within the last 5 weeks of the research date: React Router v8 and TypeScript 7; re-verify versions/breaking-changes if planning is delayed past this date)
