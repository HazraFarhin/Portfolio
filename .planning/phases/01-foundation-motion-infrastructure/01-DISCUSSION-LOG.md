# Phase 1: Foundation & Motion Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-23
**Phase:** 1-Foundation & Motion Infrastructure
**Areas discussed:** Visual foundation timing, Placeholder route purpose, UI primitive styling depth, Motion authoring API

---

## Visual Foundation Timing

| Option | Description | Selected |
|--------|-------------|----------|
| Lock tokens now | Define real color palette, font, and type scale from Axisform in Tailwind's @theme now | ✓ |
| Tailwind defaults for now | Use stock Tailwind palette/scale, design real tokens later in Phase 3 | |

**User's choice:** Lock tokens now.

| Option | Description | Selected |
|--------|-------------|----------|
| Extract from Axisform HTML | Pull literal CSS custom properties/values from the Axisform reference for exact match | |
| Use Axisform as loose inspiration | Treat as mood board; similar dark cinematic palette/type scale, values adjusted freely | ✓ |

**User's choice:** Use Axisform as loose inspiration.

| Option | Description | Selected |
|--------|-------------|----------|
| Dark-only | Matches Axisform reference and "dark, cinematic" direction; simpler token set | |
| Light/dark toggle | Support both themes with a toggle | ✓ |

**User's choice:** Light/dark toggle.
**Notes:** Not currently tracked in REQUIREMENTS.md. Follow-up question asked how to handle this.

| Option | Description | Selected |
|--------|-------------|----------|
| Add as new v1 requirement | Formally add light/dark toggle to REQUIREMENTS.md, build both token sets + toggle now | |
| System-preference only, no manual toggle | Respect prefers-color-scheme automatically, skip toggle UI | |
| Defer to a later phase/backlog | Keep Phase 1 dark-only per current PROJECT.md direction; log as deferred idea | ✓ |

**User's choice:** Defer to a later phase/backlog.
**Notes:** Phase 1 ships dark-only; light/dark toggle logged under Deferred Ideas below.

| Option | Description | Selected |
|--------|-------------|----------|
| Inter | Matches both reference templates exactly (400-900 weights) | ✓ |
| Different typeface | User specifies an alternative | |

**User's choice:** Inter.

---

## Placeholder Route Purpose

| Option | Description | Selected |
|--------|-------------|----------|
| Real Hero section | Build an early version of the actual homepage Hero using Homepage Copy V2.md, refined later rather than replaced | ✓ |
| Throwaway test page | A dedicated /motion-test route with placeholder content, deleted once Phase 3 builds the real homepage | |

**User's choice:** Real Hero section.

| Option | Description | Selected |
|--------|-------------|----------|
| Hero only | Keep Phase 1 scoped to Hero + one scroll-triggered reveal | ✓ |
| Hero + a second stub section | Add a placeholder section below Hero to prove motion continuity across a section transition | |

**User's choice:** Hero only.

---

## UI Primitive Styling Depth

| Option | Description | Selected |
|--------|-------------|----------|
| Axisform-styled now | Primitives look production-ready from Phase 1 (glass-morphism, dark chrome) | ✓ |
| Bare/functional for now | Primitives work correctly but use minimal default styling, polished later | |

**User's choice:** Axisform-styled now.

| Option | Description | Selected |
|--------|-------------|----------|
| Just button, card, typography | Matches roadmap's stated success criteria exactly | ✓ |
| Also add Container/Section wrapper | Add a layout primitive now since most homepage sections will need one | |

**User's choice:** Just button, card, typography.

---

## Motion Authoring API

| Option | Description | Selected |
|--------|-------------|----------|
| Shared hook, e.g. useScrollReveal() | Hook checks prefers-reduced-motion internally, components stay declarative | ✓ |
| Wrapper components, e.g. <Reveal> | JSX composition wraps children, handles GSAP + reduced-motion internally | |
| Data-attribute auto-wiring | Global ScrollTrigger scan wires up data-reveal/data-parallax attributes | |

**User's choice:** Shared hook, e.g. useScrollReveal().

| Option | Description | Selected |
|--------|-------------|----------|
| App-wide MotionProvider | Single provider owns Lenis init, ScrollTrigger registration, reduced-motion context | ✓ |
| Self-contained per-hook checks | Each hook/component independently sets up its own checks | |

**User's choice:** App-wide MotionProvider.

| Option | Description | Selected |
|--------|-------------|----------|
| React Router | Standard for Vite+React SPA routing, supports future /case-study/:slug routes | ✓ |
| Different routing approach | User specifies an alternative | |

**User's choice:** React Router.

---

## Claude's Discretion

- Exact Tailwind `@theme` token names/values (within the Axisform-inspired, not-literal-extraction constraint).
- Internal file/folder structure for the motion module, UI primitives, and routes.
- Button/card component API shape (props, variants).
- ScrollTrigger cleanup/lifecycle details inside `useScrollReveal()`.

## Deferred Ideas

- **Light/dark theme toggle** — not in v1 REQUIREMENTS.md; deferred to a later phase/backlog rather than built in Phase 1. Would require a second token set, theme-switching mechanism, and toggle UI if picked up later.
