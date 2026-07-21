# Coding Conventions

**Analysis Date:** 2026-07-21

## Status: No Established Project Code Style Yet

This repository contains **no real application code**. There is no `package.json`, `src/` directory, build tooling, or framework installed at the project root. The only HTML present lives under `Templates/` and consists of two static, single-file design-reference mockups (`Templates/Noema/Noema Artist Portfolio.html`, `Templates/Axisform/Axisform Studio Landing Page.html`) plus accompanying markdown design-rationale docs. These templates are **inspiration/style references only** — sourced (per accompanying markdown notes and embedded Google Analytics snippets) from external design examples, not code written for this project.

The rest of the repo (`.claude/`, `.agents/`, `.codex/`, `.opencode/`, `.zcode/`) is GSD tooling/framework scaffolding, not application code, and should not be treated as a convention source for the eventual portfolio build.

**Everything below is observational only** — notes on how the reference templates are written, flagged clearly as **NOT prescriptive** for whatever stack/framework the real portfolio build ultimately adopts (e.g. if the real build uses React/Next.js/Astro with a proper bundler, none of the single-file/CDN patterns below should carry over as-is).

## Reference Template Observations (Templates/ only — NOT prescriptive)

### Single-File Structure

Both templates are self-contained single HTML files (~1,175–1,267 lines) with all markup, CSS, and JS inline:
- `Templates/Noema/Noema Artist Portfolio.html` (1,267 lines)
- `Templates/Axisform/Axisform Studio Landing Page.html` (1,175 lines)

No separate `.css` or `.js` files, no build step, no module system. Everything ships in one `<html>` document.

### CDN-Loaded Libraries (no package manager)

Both templates load all third-party libraries via `<script src="https://...">` CDN tags in `<head>`, with no `package.json`/npm install step:

- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>` (`Templates/Noema/Noema Artist Portfolio.html:5`, `Templates/Axisform/Axisform Studio Landing Page.html:5`)
- GSAP + ScrollTrigger via cdnjs: `gsap.min.js`, `ScrollTrigger.min.js` (both templates, lines 6-7)
- Lucide icons via unpkg: `lucide@latest` (`Templates/Noema/Noema Artist Portfolio.html:8`), `lucide@latest/dist/umd/lucide.min.js` (`Templates/Axisform/Axisform Studio Landing Page.html:6`)
- Axisform additionally loads Lenis (smooth-scroll) via jsdelivr: `lenis@1.1.20` (`Templates/Axisform/Axisform Studio Landing Page.html:9`)
- Both embed Google Analytics gtag.js inline (`Templates/Noema/Noema Artist Portfolio.html:344-345`, `Templates/Axisform/Axisform Studio Landing Page.html:316-317`) — this is analytics wiring belonging to the original template source, not something to carry into the real build without deliberate decision.

**Note:** Tailwind-via-CDN is explicitly a prototyping-only approach (no purge/tree-shaking, no config file); a real build would use Tailwind as a proper build-step dependency (or a different styling approach entirely) rather than copy this pattern.

### Inline `<style>` and `<script>` Blocks

Each template has one or more inline `<style>` blocks near the top for custom CSS beyond Tailwind utilities (e.g. `Templates/Noema/Noema Artist Portfolio.html:12`, `Templates/Axisform/Axisform Studio Landing Page.html:13`), and a large inline `<script>` block near the end of `<body>` containing all page interactivity/animation logic (`Templates/Noema/Noema Artist Portfolio.html:1046`, `Templates/Axisform/Axisform Studio Landing Page.html:849`).

### Naming Patterns (within reference templates)

**CSS classes:**
- Noema uses a `loader-*` / `noema-*` BEM-ish prefix for custom components: `.noema-loader`, `.loader-grid`, `.loader-mark`, `.loader-letter`, `.loader-strip` — flat, hyphenated, no double-dash BEM modifiers observed.
- Axisform uses a short brand-prefixed convention: `.ax-loader`, `.ax-loader__inner`, `.ax-loader__brand`, `.ax-dot` — true BEM double-underscore element notation (`ax-loader__*`).
- Both mix custom prefixed classes with raw Tailwind utility classes on the same elements (e.g. `class="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-5 py-5 md:px-8 lg:px-12"` in Axisform nav).
- Both use utility classes for one-off links (`.nav-link` custom class + Tailwind utilities together).

**IDs:** camelCase for JS-hooked elements (`#noemaLoader`, `#heroWord`, `#heroCopy`, `#createcta`, `#card1`) in Noema; kebab-case (`#ax-loader`) in Axisform. The two templates are inconsistent with each other — do not treat either as a project-wide standard.

### GSAP Animation Pattern (observed, not prescribed)

Both templates follow a similar animation bootstrap pattern worth noting purely as prior art:

1. Call `lucide.createIcons()` first to render icon placeholders.
2. Register `ScrollTrigger` plugin: `gsap.registerPlugin(ScrollTrigger)`.
3. Check `prefers-reduced-motion` via `window.matchMedia('(prefers-reduced-motion: reduce)').matches` and skip/short-circuit animations (remove loader immediately) when true — this accessibility fallback pattern is worth carrying forward conceptually, though not the exact code.
4. Use `gsap.set(...)` to establish initial hidden/offset states before building a `gsap.timeline({ defaults: { ease: 'power3.out' } })` for the load-in sequence.
5. Axisform additionally wires Lenis smooth-scroll into GSAP's ticker: `lenis.on("scroll", ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))`.

Example (`Templates/Noema/Noema Artist Portfolio.html:1046-1067`):
```javascript
lucide.createIcons();
gsap.registerPlugin(ScrollTrigger);
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (reducedMotion && noemaLoader) { document.body.classList.remove('is-loading'); noemaLoader.remove(); }
if (!reducedMotion) {
  gsap.set(['nav', '#createcta', '#heroWord', '#heroCopy'], { autoAlpha: 0 });
  const onLoadTimeline = gsap.timeline({ defaults: { ease: 'power3.out' } });
  ...
}
```

## What This Means for the Real Build

- No linting/formatting config exists (no `.eslintrc*`, `.prettierrc*`, `biome.json`, etc.) — one should be established when the real stack is chosen.
- No naming convention has been decided for the actual project; the two templates disagree with each other (camelCase vs kebab-case IDs, BEM vs flat prefixes), so neither should be inherited by default.
- Tailwind-via-CDN and all-inline single-file structure are prototyping shortcuts appropriate for throwaway mockups, not patterns to replicate in production code.
- The reduced-motion accessibility check and the GSAP timeline/ScrollTrigger approach are reasonable techniques to reference conceptually when building real animations, provided they're reimplemented within whatever proper build tooling (bundler, module system) the real project adopts.
- Markdown content docs (`Portfolio-Documentation/Homepage Copy V2.md`, `Portfolio-Documentation/Information Architecture.md`, `Portfolio-Documentation/Project Page- Template.md`, `Templates/Noema/Noema Artist Portfolio Design.md`, `Templates/Axisform/Axisform Studio Design.md`) contain copy and design rationale, not code conventions.

---

*Convention analysis: 2026-07-21*
