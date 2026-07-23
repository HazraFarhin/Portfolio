# Phase 1: Foundation & Motion Infrastructure - Context

**Gathered:** 2026-07-23
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase delivers the technical foundation everything else builds on: a Vite + React + TypeScript + Tailwind CSS v4 scaffold (no CDN script tags), a routing shell, a centralized reduced-motion-safe GSAP + Lenis motion system, and a first set of shared `components/ui/` primitives (button, card, typography). It proves the motion system works end-to-end via a real Hero section, not a throwaway test page. It does not build the rest of the homepage, case-study content, or any section beyond Hero — those are Phase 2/3.

</domain>

<decisions>
## Implementation Decisions

### Visual Foundation (Tailwind v4 tokens)
- **D-01:** Lock real Axisform-derived visual tokens (dark background palette, type scale, spacing) into the Tailwind v4 `@theme` config now, in Phase 1 — not deferred to Phase 3.
- **D-02:** Treat the Axisform reference template as loose inspiration, not a literal source — derive a similar dark cinematic palette/type scale but adjust exact values rather than extracting byte-for-byte from `Templates/Axisform/Axisform Studio Landing Page.html`.
- **D-03:** Inter is the primary typeface (matches both reference templates; Google Fonts, variable weights 400–900).
- **D-04:** Phase 1 ships dark-only. A light/dark theme toggle is NOT built in this phase (see Deferred Ideas) — no theme-switching mechanism, no second token set.

### Placeholder/Demo Route
- **D-05:** The route proving GSAP+Lenis scroll/reveal motion (success criterion #2) is a real Hero section built with actual copy from `Homepage Copy V2.md` — not a throwaway `/motion-test` page. Phase 3 refines this Hero rather than replacing it.
- **D-06:** Scope is Hero-only for Phase 1 — no second stubbed section (e.g. Proof Strip) to prove cross-section motion. Multi-section scroll composition is Phase 3's job once real content exists for every section.

### UI Primitive Styling Depth
- **D-07:** Button, card, and typography primitives in `components/ui/` are styled to the Axisform aesthetic now (glass-morphism cards, dark chrome buttons, oversized editorial type) — not bare/functional scaffolding to be re-skinned later. Consistent with locking real tokens and building a real Hero in this same phase.
- **D-08:** Primitive scope is exactly button, card, typography — matching the roadmap's stated set. No Container/Section layout wrapper in Phase 1; add it in Phase 3 once real homepage sections define what it needs to do.

### Motion Authoring API
- **D-09:** Components opt into scroll-driven motion via a shared hook, `useScrollReveal()`, built on GSAP + ScrollTrigger. The hook takes a ref + options and internally no-ops when `prefers-reduced-motion` is set — callers never write their own reduced-motion check.
- **D-10:** A single app-wide `MotionProvider` at the root owns Lenis initialization, GSAP/ScrollTrigger plugin registration, and the reduced-motion context value that `useScrollReveal()` (and future motion hooks) read from. This is the concrete mechanism satisfying success criterion #3 ("no per-component opt-in code required").
- **D-11:** Routing uses React Router (standard for Vite+React SPAs). It must support the homepage route now and the `/case-study/:slug` dynamic routes Phase 2 will add, and needs to work cleanly with SPA rewrite rules for Phase 4's deployment hardening.

### Claude's Discretion
- Exact Tailwind `@theme` token names/values (within the "Axisform-inspired, not literally extracted" constraint from D-02).
- Internal file/folder structure for the motion module (e.g. `src/motion/`), UI primitives (e.g. `src/components/ui/`), and routes.
- Button/card component API shape (props, variants) as long as it supports the Axisform-styled look from D-07.
- ScrollTrigger cleanup/lifecycle details inside `useScrollReveal()`.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/ROADMAP.md` — Phase 1 goal, success criteria, requirement mapping (QUAL-01, QUAL-02)
- `.planning/REQUIREMENTS.md` — QUAL-01 (motion matching Axisform language, no broken scroll/keyboard nav), QUAL-02 (prefers-reduced-motion disables all non-essential motion automatically)
- `.planning/PROJECT.md` — "dark, cinematic" visual direction, React + Tailwind CSS constraint, Axisform-over-Noema decision

### Visual/motion reference (inspiration only, not literal source per D-02)
- `Templates/Axisform/Axisform Studio Landing Page.html` — dark cinematic aesthetic, glass-morphism cards, GSAP/Lenis motion bootstrap pattern (see lines ~1046-1067 equivalent: reduced-motion check → `gsap.set` initial states → `gsap.timeline`)
- `Templates/Axisform/Axisform Studio Design.md` — design rationale accompanying the Axisform template

### Content for the real Hero (D-05)
- `Portfolio-Documentation/Homepage Copy V2.md` — hero copy to use in the Phase 1 demo/Hero route (explicit rough draft — keep copy easy to swap, not hardcoded deep in JSX)

### Codebase state (pre-build)
- `.planning/codebase/STACK.md`, `.planning/codebase/ARCHITECTURE.md`, `.planning/codebase/CONVENTIONS.md` — confirm no application code, no package.json, no build tooling exists yet; reference templates are CDN-based prototypes, explicitly not to be built upon directly

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — this is a from-scratch build. No `src/`, no `package.json`, no components exist anywhere in the repo outside the static reference templates.

### Established Patterns
- None to inherit as project convention. The two reference templates (Noema, Axisform) disagree with each other on naming (camelCase vs kebab-case IDs, BEM vs flat class prefixes) — neither should be treated as a standard. Only the reduced-motion-check-before-animating pattern and the general GSAP timeline/ScrollTrigger bootstrap sequence from Axisform are worth carrying forward conceptually (see Canonical References above), reimplemented as a proper React module rather than an inline `<script>` block.

### Integration Points
- This phase creates the integration points for everything downstream: the routing shell (where Phase 2's `/case-study/:slug` routes attach), the `MotionProvider` (where every later animated component attaches via `useScrollReveal()`), and `components/ui/` (where Phase 2/3 components compose button/card/typography rather than redefining their own).

</code_context>

<specifics>
## Specific Ideas

- The Hero built in this phase should use real copy from `Homepage Copy V2.md`, not lorem ipsum or generic placeholder text — it's meant to carry forward into Phase 3, not be discarded.
- Visual tokens should evoke the Axisform reference's dark cinematic feel (oversized Inter type, dark chrome, glass-morphism cards) without being a pixel-exact copy of its specific hex values.

</specifics>

<deferred>
## Deferred Ideas

- **Light/dark theme toggle** — Raised during Visual Foundation discussion. Not currently in `REQUIREMENTS.md` (which specifies a "dark, cinematic" direction with no light-mode requirement). Explicitly deferred to a later phase/backlog rather than added to Phase 1 or as a new v1 requirement. If picked up later, it would need: a second token set, a theme-switching mechanism in the `MotionProvider`/token layer, and a toggle UI control — scoped as its own piece of work, not bundled into Phase 1's foundation.

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 1-Foundation & Motion Infrastructure*
*Context gathered: 2026-07-23*
