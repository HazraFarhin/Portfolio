# Technology Stack

**Analysis Date:** 2026-07-21

## Project Status: No Application Stack Exists Yet

This repository currently contains **no buildable application code**. There is no `package.json`, no framework, no build tooling, and no chosen tech stack for the actual portfolio website. The repo consists of:

- `Templates/Noema/` and `Templates/Axisform/` — two static HTML design-reference templates used purely for visual/style inspiration. **Not to be built upon directly.**
- `Portfolio-Documentation/` — content and information-architecture docs for the actual site (`Homepage Copy V2.md`, `Information Architecture.md`, `Project Page- Template.md`).
- `.agents/`, `.claude/`, `.codex/`, `.opencode/`, `.zcode/` — GSD (Get Sh*t Done) workflow tooling/agent framework installed across multiple AI-CLI integrations. This is planning/process tooling, not part of the site's runtime stack.
- `.planning/` — GSD planning artifacts (this document lives here).

**No language, runtime, framework, or dependency has been chosen for the actual portfolio site implementation.** The technology choices below describe what the reference templates use, documented so future phases can decide what (if anything) to reuse vs. reject.

## Languages

**Reference templates only (not the project's stack):**
- HTML5 - `Templates/Noema/Noema Artist Portfolio.html`, `Templates/Axisform/Axisform Studio Landing Page.html`
- Inline CSS (custom properties, keyframes) - embedded in both template `<style>` blocks
- Inline vanilla JavaScript (GSAP/ScrollTrigger/Lenis init, IntersectionObserver, DOM interactions) - embedded in both templates' `<script>` blocks

**Documentation:**
- Markdown - `Portfolio-Documentation/*.md`, `Templates/Noema/Noema Artist Portfolio Design.md`, `Templates/Axisform/Axisform Studio Design.md`

## Runtime

**Environment:**
- None chosen. The reference templates run entirely client-side in a browser with no build step or server runtime — they are single self-contained `.html` files loading everything via CDN `<script>`/`<link>` tags.

**Package Manager:**
- None. No `package.json`, no lockfile, no `node_modules/` for the site itself.
- Note: `.agents/package.json`, `.claude/package.json`, `.opencode/package.json` exist but belong to the GSD tooling installation, not the portfolio site.

## Frameworks

**Reference templates use (design-reference-only, CDN-loaded, no local install):**
- Tailwind CSS (via Play CDN, `https://cdn.tailwindcss.com`) - utility-first styling in both `Templates/Noema/Noema Artist Portfolio.html` and `Templates/Axisform/Axisform Studio Landing Page.html`
- GSAP 3.12.5 (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`) - scroll/entrance animations, both templates
- GSAP ScrollTrigger 3.12.5 (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js`) - scroll-linked animation triggers, both templates
- Lenis 1.1.20 (`https://cdn.jsdelivr.net/npm/lenis@1.1.20/dist/lenis.min.js`) - smooth scrolling, `Templates/Axisform/Axisform Studio Landing Page.html` only (Noema template does not load Lenis)
- Lucide Icons (`https://unpkg.com/lucide@latest` / `.../lucide.min.js`) - icon rendering, both templates

**Testing:**
- None. No test framework configured anywhere in the repo for site code.

**Build/Dev:**
- None. No bundler, transpiler, or dev server config for the site. Templates are opened/served as static `.html` files directly.

## Key Dependencies

**Critical (reference-only, via CDN, not installed as project dependencies):**
- Tailwind CSS (CDN build) - utility classes for all layout/styling in both templates
- GSAP + ScrollTrigger - drives most motion design in both templates
- Lenis - smooth-scroll wrapper, Axisform template only

**Infrastructure:**
- Google Fonts (`fonts.googleapis.com`, `fonts.gstatic.com`) - webfont delivery
  - Noema: Anton, Inter (400–700), Caveat (600–700)
  - Axisform: Inter (400–900)
- Lucide (`unpkg.com`) - icon set, both templates

## Configuration

**Environment:**
- No `.env` files present. No environment-based configuration exists for the site.

**Build:**
- No build config files exist (no `tailwind.config.js`, `vite.config.*`, `next.config.*`, etc.). Tailwind is configured inline via the CDN script's implicit defaults in both templates; no custom `tailwind.config` object was found in either file.

## Platform Requirements

**Development:**
- None formally required yet. A text editor and browser are sufficient to view/reference the existing template files. No Node.js version, package manager, or toolchain has been established for building the actual site.

**Production:**
- No deployment target chosen. No hosting config (Vercel, Netlify, GitHub Pages, etc.) present in the repo.

## Recommendation for Future Phases

When the actual site tech stack is chosen, this document should be rewritten to reflect the real, installed stack (framework, package manager, build tool, dependency versions from `package.json`/lockfile) rather than the CDN-based reference templates. Until then, treat every technology listed above under "Reference templates" as inspiration only — not a locked-in decision.

---

*Stack analysis: 2026-07-21*
</content>
