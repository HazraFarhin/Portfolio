# Codebase Concerns

**Analysis Date:** 2026-07-21

## Project Status Context

This repository is **pre-code**. There is no `package.json`, no application source, no framework, no build tooling, no tests, and no CI. It currently contains:
- Two static HTML design-reference templates: `Templates/Noema/Noema Artist Portfolio.html` and `Templates/Axisform/Axisform Studio Landing Page.html`, each paired with a design-rationale doc (`Templates/Noema/Noema Artist Portfolio Design.md`, `Templates/Axisform/Axisform Studio Design.md`)
- Portfolio content/planning docs in `Portfolio-Documentation/` (`Information Architecture.md`, `Homepage Copy V2.md`, `Project Page- Template.md`)
- GSD planning scaffolding (`.planning/`, `.agents/`, `.claude/`, `.codex/`, `.opencode/`, `.zcode/`)

The concerns below are scoped to what is realistically at risk at this stage: how the reference templates could be misused, gaps between planning docs and buildable reality, repo hygiene, and readiness gaps before a real build starts.

## Tech Debt

**Reference templates use CDN-loaded, non-production tooling — risk of being copy-pasted as-is into the real build:**
- Issue: Both `Templates/Noema/Noema Artist Portfolio.html` and `Templates/Axisform/Axisform Studio Landing Page.html` load Tailwind via the CDN runtime script (`<script src="https://cdn.tailwindcss.com"></script>`), not the compiled/PostCSS build. The Tailwind team explicitly says the CDN build is "not meant for production" — it ships the full JIT compiler to the browser, has no purge/tree-shaking, no config file support for design tokens, and adds a render-blocking JS dependency for something that should be a static stylesheet.
- Files: `Templates/Noema/Noema Artist Portfolio.html:5`, `Templates/Axisform/Axisform Studio Landing Page.html:5`
- Impact: If these files (or their `<head>` boilerplate) are copied wholesale into the real site, the production build inherits: no build pipeline, degraded Core Web Vitals (extra ~300KB+ JS parse/compile on every load), no offline/purged CSS, and no design-token single source of truth.
- Fix approach: Treat both HTML files strictly as **visual/interaction references**. When the real framework is chosen, port only markup structure, animation choreography (GSAP timelines), and visual language into that framework's proper Tailwind setup (CLI/PostCSS with `tailwind.config`) or an equivalent styling system — never carry over the CDN script tags or inline `<script>`/`<style>` blocks verbatim.

**GSAP and other libraries also loaded via public CDN with no version pinning strategy or SRI:**
- Issue: `gsap.min.js`, `ScrollTrigger.min.js`, `lucide` icons, and (Axisform only) `lenis` are pulled from `cdnjs.cloudflare.com`, `unpkg.com`, and `cdn.jsdelivr.net` inside the HTML `<head>` (`Templates/Noema/Noema Artist Portfolio.html:6-8`, `Templates/Axisform/Axisform Studio Landing Page.html:6-9`). No Subresource Integrity (SRI) hashes, no self-hosting, no lockfile.
- Files: `Templates/Noema/Noema Artist Portfolio.html`, `Templates/Axisform/Axisform Studio Landing Page.html`
- Impact: Fine for disposable design references; unacceptable for a production portfolio (single point of failure if a CDN goes down, no supply-chain integrity guarantee, no reproducible builds).
- Fix approach: When rebuilding for real, install these as versioned npm dependencies (`gsap`, `lucide-react` or equivalent, `lenis`) and bundle them, rather than reusing the `<script src="https://...">` tags.

**Two competing visual/interaction languages with no design-system decision made:**
- Issue: `Templates/Noema/` (bold "Anton" display type, editorial/artist-portfolio aesthetic, loader + archive/board sections) and `Templates/Axisform/` (Inter-only, structured studio-landing aesthetic, Lenis smooth-scroll + GSAP scroll-triggered reveals) represent two different design directions for the same portfolio. Nothing in the repo records which one (or what hybrid) has been chosen as the actual design system for Hazra Farhin's site.
- Files: `Templates/Noema/Noema Artist Portfolio Design.md`, `Templates/Axisform/Axisform Studio Design.md`
- Impact: Without a decision, the eventual build phase has no single source of truth for typography scale, color tokens, spacing system, or motion language — high risk of an inconsistent hybrid emerging ad hoc during implementation.
- Fix approach: Before starting the real build phase, explicitly choose one template's direction as the base design system (or define a merged one) and record the decision in a planning doc (e.g., a DESIGN-SYSTEM decision in `.planning/`) so the build phase has a single reference.

## Known Bugs

Not applicable — no application code exists yet to contain runtime bugs. The two reference HTML files are self-contained demos and not evaluated for bugs since they are not intended to ship.

## Security Considerations

**No secrets exposure risk currently, but no `.gitignore` exists to prevent future leakage:**
- Risk: There is no `.gitignore` file at the repo root. Once real build tooling is added (Node modules, `.env` files for CMS/API keys, build output), there is nothing in place to stop these from being committed.
- Files: repo root (no `.gitignore` present)
- Current mitigation: None — repo is small and pre-code, so nothing sensitive exists yet.
- Recommendations: Add a `.gitignore` before introducing any framework/tooling, covering at minimum: `node_modules/`, `.env*`, build output dirs (`dist/`, `.next/`, `out/`), OS cruft (`.DS_Store`), and editor/local config as needed.

## Performance Bottlenecks

**Reference templates are not representative of production performance and should not set expectations:**
- Problem: Both templates rely on CDN Tailwind's runtime JIT compiler plus GSAP/ScrollTrigger animating dozens of timeline steps on load (`Templates/Noema/Noema Artist Portfolio.html:1069-1263`, `Templates/Axisform/Axisform Studio Landing Page.html:854-893`). This is acceptable for a one-off visual mockup opened locally but would fail Lighthouse/Core Web Vitals targets if shipped unchanged.
- Files: `Templates/Noema/Noema Artist Portfolio.html`, `Templates/Axisform/Axisform Studio Landing Page.html`
- Cause: Runtime CSS compilation + unbundled, unminified-in-context external script loading + long onload GSAP timelines with no `prefers-reduced-motion` gating in the Noema template (Axisform does check `prefersReducedMotion` at `Templates/Axisform/Axisform Studio Landing Page.html:854`, Noema does not appear to).
- Improvement path: In the real build, compile Tailwind ahead of time, bundle and code-split GSAP usage, lazy-load ScrollTrigger-dependent sections, and ensure every animation path respects `prefers-reduced-motion` (carry forward the Axisform pattern, add it to Noema-derived sections too).

## Fragile Areas

Not applicable in the traditional sense (no live code to break), but flagging one structural fragility:

**Portfolio content docs assume URL structure and CMS-backed content that doesn't exist yet:**
- Files: `Portfolio-Documentation/Information Architecture.md`
- Why fragile: The IA doc lists concrete live case-study routes intended for the sitemap — `/case-study/cad`, `/case-study/verzion-cloud-migration`, `case-study/tata-capital-ai-interface`, `/case-study/mashreq`, `/case-study/astrosure.ai`, `/case-study/adreport.io`, `/case-study/riyaah`, `/case-study/icici-bank-atm-kiosk`, `/case-study/ambit`, `/case-study/northernarc`, `/case-study/citrus` (`Portfolio-Documentation/Information Architecture.md:5-15`). None of these case studies have corresponding content files, images, or a CMS/data source in the repo yet — only `Portfolio-Documentation/Project Page- Template.md` exists as a generic template.
- Safe modification: Treat the IA doc as the target sitemap, not a build-ready spec. Before routing/build phases wire up these paths, each case study needs real written content (following the template) and media assets; until then these should be planned as a content-population workstream, not assumed "ready."
- Test coverage: N/A (no code), but flag as a launch-blocking content gap — the site cannot go live with 11 dead/placeholder case-study routes.

## Scaling Limits

Not applicable at this stage — no infrastructure, no data layer, no traffic.

## Dependencies at Risk

Not applicable — no dependency manifest exists yet. When one is created, avoid re-introducing the CDN-script pattern noted above (Tailwind CDN, unpinned GSAP/Lucide/Lenis) as actual dependencies; use proper package installs instead.

## Missing Critical Features

**No framework or scaffolding decision recorded:**
- Problem: There is no `package.json`, no chosen frontend framework (e.g., Next.js, Astro, plain Vite+HTML), no repo scaffolding (`src/`, routing, build config) — the two `Templates/` HTML files are the only markup that exists, and they are explicitly design references, not app scaffolding.
- Blocks: Any real implementation phase (component structure, routing for case-study pages, content/CMS integration, deployment) is blocked until a framework and project structure are chosen.

**No CI/CD or deployment target defined:**
- Problem: No CI config (no `.github/workflows/`, no other CI provider config found), no hosting/deployment target documented.
- Blocks: Cannot verify builds automatically or ship changes with confidence once real code exists; should be set up alongside initial scaffolding, not as an afterthought.

**No content/CMS strategy for case studies:**
- Problem: `Portfolio-Documentation/Information Architecture.md` implies ~11 distinct case-study pages plus a homepage (`Portfolio-Documentation/Homepage Copy V2.md`), but there's no decision on whether these will be hand-authored pages, MDX files, or backed by a headless CMS.
- Blocks: Page/routing architecture for the build phase can't be finalized until this is decided, since it affects whether case studies are static routes, dynamic CMS-driven routes, or a mix.

## Test Coverage Gaps

Not applicable — no test framework, no application code to test. When the real build starts, establish testing conventions from the outset (see future `TESTING.md` once code exists) rather than retrofitting later.

## Repository Hygiene

**Stray macOS `.DS_Store` files committed/untracked at multiple levels, with no `.gitignore` to prevent re-occurrence:**
- Files found: `./.DS_Store`, `Portfolio-Documentation/.DS_Store`, `Templates/.DS_Store`, `Templates/Noema/.DS_Store`
- Impact: Clutters `git status` output and diffs, low-value noise in the repository; the root `.DS_Store` shows as modified in git status, meaning it may already be tracked in git history.
- Fix approach: Add a `.gitignore` containing `.DS_Store` (and ideally `**/.DS_Store`), then run `git rm --cached` on any already-tracked `.DS_Store` files to stop tracking them going forward.

**No root-level `.gitignore` at all:**
- Impact: Beyond `.DS_Store`, any future `node_modules/`, build artifacts, or local env files have no guard against being committed once tooling is introduced.
- Fix approach: Create a `.gitignore` now, even before the framework is chosen, covering OS cruft and common future artifacts (`node_modules/`, `.env*`, `dist/`, `.next/`, `.DS_Store`).

---

*Concerns audit: 2026-07-21*
