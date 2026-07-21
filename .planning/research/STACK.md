# Technology Stack

**Domain:** React + Tailwind personal UX/UI portfolio (dark, cinematic, GSAP/Lenis-driven motion; file-based case studies; ~6-11 static pages)
**Researched:** 2026-07-21
**Confidence:** HIGH (core framework/build versions verified directly against the npm registry; integration patterns and comparative tradeoffs MEDIUM — cross-checked web sources, current as of mid-2026)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| React | 19.2.7 | UI library | Already the user's constraint. React 19 is current stable; no reason to pin lower. |
| Vite | 8.1.5 | Build tool / dev server | Standard build tool for React SPAs in 2026, having fully displaced Create React App. Sub-second HMR and a near-zero-config setup are the right fit for a small, mostly-static site with no server-rendering requirement. **Not Next.js** — see rationale below. |
| @vitejs/plugin-react-swc | 4.3.1 | Vite React plugin (SWC-based) | SWC-based transform is faster than the Babel-based `@vitejs/plugin-react` for this project's size; use `npm create vite@latest -- --template react-swc-ts` to scaffold. |
| TypeScript | ~5.7–5.9 (pin below 7.x; see note) | Type safety | ~80% of current React templates ship TS by default; gives typed case-study content objects/frontmatter, which matters once you have 11 project files to keep consistent. **Note:** npm's `latest` tag currently resolves to a `7.0.2` prerelease-track major (Nightly/Corsa rewrite) — pin to the last stable `5.x` line (e.g. `^5.7.0`) in `package.json`, do not blindly install `@latest`. |
| React Router | 7.18.1 (`react-router-dom`) or 8.2.0 (`react-router`, unified package) | Client-side routing | v7 unified `react-router-dom` into the single `react-router` package (with `react-router/dom` subpath); v8 continues that and drops re-exporting through `react-router-dom`. For a ~6-11 route static site, use **Declarative Mode** (`<BrowserRouter>` / `createBrowserRouter` with plain `<Route>` elements) — you don't need Data Mode loaders or Framework Mode (file-based routing, SSR) for this scale. |
| Tailwind CSS | 4.3.3 | Styling | v4 is a rewrite: CSS-first config (`@import "tailwindcss";` + `@theme` in your main CSS file), no `tailwind.config.js` required by default, and a first-party Vite plugin. This replaces the Axisform reference's CDN `<script src="cdn.tailwindcss.com">` approach, which is explicitly unsuitable for production (no purging, no versioning, runtime JIT compile cost). |
| @tailwindcss/vite | 4.3.3 | Tailwind's official Vite plugin | Add `tailwindcss()` to `vite.config.ts` plugins — replaces the old PostCSS + `autoprefixer` + `tailwind.config.js` pipeline entirely for new v4 projects. |
| GSAP (core + ScrollTrigger) | 3.15.0 | Scroll-driven motion, timelines, parallax | Matches the reference template's animation language exactly. **Important 2025 licensing change:** as of GSAP 3.13, Webflow's acquisition made GSAP 100% free for all use, including every previously "Club GreenSock"-only plugin (SplitText, MorphSVG, DrawSVG, etc.) — install everything from the single public `gsap` npm package, no license key needed. SplitText was rewritten in 3.13 (smaller, screen-reader-accessible) and is genuinely useful for the reference's oversized wordmark/heading reveal treatment. |
| @gsap/react | 2.1.2 | Official GSAP + React glue | Provides `useGSAP()`, the officially-supported hook for using GSAP inside React — see integration pattern below. |
| Lenis | 1.3.25 | Smooth/inertia scroll | Same library the Axisform reference already uses (there confirmed at CDN version 1.1.20) — no need to swap it for a "modern alternative"; Lenis is itself the current standard and ships an official React adapter (`lenis/react`), so keep it. Do **not** reach for a heavier alternative like Locomotive Scroll or a custom rAF scroller — Lenis is purpose-built to drive GSAP ScrollTrigger and is what most current GSAP-driven agency sites in this same visual genre use in 2025/2026. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| @mdx-js/rollup | 3.1.1 | MDX-as-Vite-plugin | Compiles `.mdx` case-study files directly in the Vite pipeline (ESM-only; import it via dynamic `import()` inside `vite.config.ts` since the config file itself may be CJS-evaluated). Place before other transform plugins (`enforce: 'pre'` if needed). |
| @mdx-js/react | 3.1.1 | MDX component-provider context | Lets you map MDX elements (e.g. `<img>`, blockquotes) to your own styled React components across all case studies via a single `MDXProvider`. |
| remark-frontmatter + remark-mdx-frontmatter | latest | YAML frontmatter in MDX | Exposes each case study's frontmatter (title, tools, outcome, tags, hero image) as a named export from the MDX module, so you get structured metadata + prose body in one file, matching `Project Page- Template.md`'s mixed structured/narrative shape. |
| zod | ^3.x | Frontmatter shape validation | Optional but recommended: validate each case study's frontmatter object against a schema at build/dev time so a typo (e.g. missing `outcome`) fails loudly instead of silently rendering blank. Lightweight enough to hand-roll without a full content-pipeline tool. |
| react-helmet-async | latest | Per-page `<title>`/meta tags | Since this is a client-rendered SPA (no SSR), each case-study route needs its own `<title>` and OG/meta description for link-preview quality when the URL is shared directly (LinkedIn, email to a recruiter). |
| clsx (or `tailwind-merge`) | latest | Conditional className composition | Standard companion for Tailwind projects with any component variants (buttons, cards) — avoids string-concatenation className bugs. |
| @formspree/react | 3.0.0 | Contact-form-to-email delivery | See "Form Handling" section below — the recommended default. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| ESLint (flat config) + typescript-eslint | Linting | Vite's `react-swc-ts` template now scaffolds flat-config ESLint by default — keep it, add `eslint-plugin-jsx-a11y` given the animation-heavy UI needs accessibility discipline (reduced-motion, focus states on the "magnetic" pill buttons). |
| Prettier | Formatting | Standard; not load-bearing for architecture, but keep case-study MDX/TS files consistently formatted since content will be added incrementally over time. |
| Vitest | Testing (optional) | Only worth adding if you introduce logic worth unit-testing (e.g. a frontmatter-validation function) — a mostly-presentational site doesn't need a heavy test suite. |

## Installation

```bash
# Scaffold
npm create vite@latest portfolio -- --template react-swc-ts
cd portfolio

# Core
npm install react-router
npm install tailwindcss @tailwindcss/vite
npm install gsap @gsap/react
npm install lenis

# Content (MDX case studies)
npm install @mdx-js/rollup @mdx-js/react remark-frontmatter remark-mdx-frontmatter
npm install zod

# SEO / forms
npm install react-helmet-async
npm install @formspree/react
npm install clsx

# Dev dependencies
npm install -D eslint-plugin-jsx-a11y
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| Vite + React Router (declarative mode) | Next.js (App Router) | Choose Next.js if you later need true SSR/ISR, an API-route-heavy backend, or built-in image optimization at scale. For this project it adds friction: every GSAP/Lenis-touching component needs `"use client"`, and `window`/`document` access inside ScrollTrigger setup risks hydration mismatches the Vite SPA simply doesn't have to think about. Community examples of "GSAP + Next.js portfolio" are common, but that's driven by Next's popularity, not a technical requirement — Vite is the leaner, more direct fit for a static, client-only, heavily-animated single-scroll page. |
| Vite + React Router | Astro + React islands | Choose Astro if the site were content/blog-heavy with mostly-static sections and only isolated interactive widgets (Astro ships zero JS by default per component). It works against this project's specific motion design: the Axisform-style experience relies on **one continuous Lenis scroll context** and ScrollTrigger instances that span across sections, which fights against islands' per-component hydration boundaries. Not worth the added architectural split for a single continuously-animated page. |
| MDX + typed frontmatter | Contentlayer | Do not use — **Contentlayer is abandoned** (maintainer now contributes ~1 day/month; issues piling up; no active roadmap). If you want its schema-validation ergonomics without the abandonment risk, use **Velite** instead (actively maintained, Zod-based, has a Vite-compatible pipeline) — worth adopting if the case-study count grows well past the current ~11 and manual frontmatter-shape discipline stops scaling. |
| MDX + zod (hand-rolled validation) | Velite | Use Velite once you're validating/transforming more than a handful of content types, want typed collection output generated automatically, or add the deferred second batch of 5 case studies and want confidence nothing is malformed. At today's ~6-11 files, a hand-rolled Zod schema check is simpler and has one fewer dependency to track. |
| @formspree/react | Resend + a serverless function | Use Resend directly if you want full control over the email template/branding and don't mind writing (and maintaining) a small serverless function (Vercel/Netlify function) that calls the Resend API. More setup, but avoids Formspree's per-submission pricing entirely and keeps the "no custom backend" constraint honest in spirit (a single stateless serverless function is arguably still "no backend to maintain" in practice, but it is more moving parts than a drop-in form SDK). |
| @formspree/react | EmailJS | Use EmailJS only if you specifically want to skip any server-side step and send straight from the browser — acceptable, but it means your email-provider connection details live in the client bundle and its free tier is more limited than Formspree's or a Resend function's. Not recommended as the primary choice here. |
| Vercel or Netlify (either is fine) | GitHub Pages / Cloudflare Pages | Both are viable free options for a purely static build if the future contact-form serverless function is dropped (i.e. going with EmailJS or Formspree only, no first-party function). Not the default recommendation since the project already leans toward Vercel/Netlify per the user's own constraint. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| Tailwind via CDN (`cdn.tailwindcss.com`), as in the Axisform reference | No purge/tree-shaking, ships the full runtime JIT compiler to the browser, no versioning/lockfile — explicitly a prototyping tool, not for production. This is the single most important "don't carry over" item from the reference template. | `tailwindcss` + `@tailwindcss/vite` installed as real dependencies (above). |
| Loading GSAP/ScrollTrigger/Lenis via `<script>` CDN tags | No bundling, no tree-shaking of unused GSAP plugins, no type definitions, and it re-introduces the exact "reference-only" pattern the project explicitly wants to move away from. | `gsap`, `@gsap/react`, `lenis` as npm dependencies, imported as ES modules. |
| Contentlayer | Abandoned/unmaintained (see above) — a known, well-documented dead end as of 2025/2026. | Plain MDX + hand-rolled Zod validation (now), or Velite (later, if scale demands it). |
| Manually wiring GSAP inside a bare `useEffect` with manual `.kill()`/`.revert()` calls scattered per component | Error-prone cleanup is the single most common source of memory leaks and duplicate-animation bugs when GSAP is combined with React's render lifecycle (especially with StrictMode's double-invoke in dev). | `useGSAP()` from `@gsap/react`, which wraps `gsap.context()` and auto-reverts everything (tweens, ScrollTriggers, Draggables, SplitText instances) on unmount. |
| Running Lenis's own `requestAnimationFrame` loop *and* GSAP's ticker independently | Two independent RAF loops updating scroll position causes visible jitter/desync between smooth-scroll position and ScrollTrigger-pinned animations — this is the most commonly reported Lenis+GSAP integration bug. | Drive Lenis from GSAP's ticker (`gsap.ticker.add(time => lenis.raf(time * 1000))`, `gsap.ticker.lagSmoothing(0)`, Lenis instance created with `autoRaf: false`) so there is exactly one RAF driver. |
| Ignoring `prefers-reduced-motion` | The reference spec itself calls this out (GSAP timelines/transitions must be disabled under reduced-motion), and it's a baseline accessibility expectation for any portfolio a hiring manager might view. | Check `window.matchMedia('(prefers-reduced-motion: reduce)').matches` inside your `useGSAP()` setup and skip ScrollTrigger/parallax registration entirely (or swap to opacity-only fades) when true. |
| Pinning `typescript@latest` blindly | npm's `latest` dist-tag currently resolves to an early `7.x` prerelease track (a from-scratch rewrite), not the mature `5.x` line most tooling/plugins target today. | Pin `"typescript": "^5.7.0"` (or whatever the current stable 5.x is at implementation time) explicitly in `package.json`. |

## Stack Patterns by Variant

**If SEO / link-preview quality for individual case-study pages turns out to matter a lot** (e.g. sharing a specific case-study URL directly with a recruiter, wanting a rich Slack/LinkedIn unfurl):
- Add a prerendering step post-build (e.g. `vite-react-ssg`, which spins up a headless-browser crawl of your routes at build time and emits real static HTML per route) so each case study gets real server-rendered `<title>`/OG meta instead of only client-side `react-helmet-async` tags.
- Treat this as a Phase 2 / nice-to-have — not required for v1, since the primary distribution channel is direct links from a resume/LinkedIn/portfolio listing, not organic search.

**If the case-study content set grows significantly past the current ~11 slugs** (e.g. after the deferred 5 are ready plus more added later):
- Migrate from hand-rolled MDX + Zod validation to **Velite** for generated types and centralized schema enforcement across all collections.

**If you want richer per-project structured filtering/sorting on the homepage** (e.g. filter by industry/tool) beyond the current fixed IA order:
- Keep frontmatter as the single source of truth (already typed via Zod) and derive an in-memory index (`import.meta.glob('./content/case-studies/*.mdx', { eager: true })`) at build time rather than introducing a database — a 6-11 item array needs no query layer.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `vite@8.x` | `@vitejs/plugin-react-swc@4.x`, `@tailwindcss/vite@4.x`, `@mdx-js/rollup@3.x` | All current majors as of this research date; no known incompatibilities. |
| `tailwindcss@4.x` | `@tailwindcss/vite@4.x` (matching major/minor) | v4's plugin and core package are versioned together — do not mix a v4 plugin with a v3 `tailwindcss` core or vice versa. |
| `gsap@3.13+` | `@gsap/react@2.x` | 3.13+ is required to get the free bundled plugins (SplitText, etc.) — anything below 3.13 will still gate premium plugins behind the old Club GreenSock license. |
| `lenis@1.3.x` | `gsap@3.x` ticker API | Sync pattern (`gsap.ticker.add` + `autoRaf:false`) is stable across recent Lenis 1.x releases; re-check Lenis's own docs/CHANGELOG if bumping a major version later. |
| `react-router@7.x`/`8.x` | `react@19.x` | Both current majors target React 18/19; declarative mode has no additional peer requirements beyond React itself. |
| `@mdx-js/rollup@3.x` | ESM-only | `vite.config.ts` must import it via dynamic `import()` if the config itself isn't natively ESM — a common gotcha, not a version incompatibility. |

## Sources

- `registry.npmjs.org` direct API queries (react, react-dom, vite, tailwindcss, @tailwindcss/vite, gsap, @gsap/react, lenis, react-router, react-router-dom, @mdx-js/rollup, @mdx-js/react, typescript, @vitejs/plugin-react, @vitejs/plugin-react-swc, @formspree/react, resend) — HIGH confidence, current version numbers as of 2026-07-21.
- GSAP official blog, "3.13 release" (gsap.com/blog/3-13/) and Webflow's "GSAP becomes free" announcement — HIGH confidence, licensing change directly from primary source.
- `github.com/greensock/react` (official `@gsap/react` repo) and `gsap.com/resources/React/` (official React integration docs) — MEDIUM/HIGH, cross-checked via web search summarizing official docs.
- `github.com/darkroomengineering/lenis` (official Lenis repo, incl. React adapter) and GSAP community forum threads on ScrollTrigger + Lenis sync — MEDIUM, cross-checked across multiple independent write-ups converging on the same ticker-sync pattern.
- `github.com/contentlayerdev/contentlayer/issues/429` ("State of the project") — MEDIUM, direct maintainer statement about reduced maintenance, corroborated by multiple third-party "Contentlayer alternatives" posts.
- `reactrouter.com/upgrading/v7` and `remix.run/blog/react-router-v8` — MEDIUM, official migration docs summarized via search.
- Comparative web sources on Formspree/EmailJS/Resend pricing and positioning, and Vercel-vs-Netlify 2026 comparisons — LOW/MEDIUM individually (marketing-adjacent comparison blogs), triangulated across several independent sources before being stated here as recommendations.
- `mdxjs.com/packages/rollup/` (official MDX Rollup plugin docs) — MEDIUM, cross-checked via search summary of official docs.

---
*Stack research for: React + Tailwind personal portfolio (Axisform-style motion, file-based case studies)*
*Researched: 2026-07-21*
