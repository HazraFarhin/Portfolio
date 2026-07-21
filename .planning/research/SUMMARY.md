# Project Research Summary

**Project:** Portfolio (Hazra's UX/UI designer personal portfolio)
**Domain:** React + Tailwind personal portfolio site — cinematic/motion-driven design (Axisform reference), file-based case-study content, job-search + freelance lead-gen goals
**Researched:** 2026-07-21
**Confidence:** MEDIUM-HIGH

## Executive Summary

This is a small (~6-11 page), heavily art-directed, motion-driven personal portfolio for a UX/UI designer targeting two audiences: recruiters/hiring managers and freelance/consulting clients. The right way to build it is a Vite + React 19 + TypeScript SPA (not Next.js — no SSR need, and Next's "use client" ceremony fights the GSAP/Lenis scroll architecture), styled with Tailwind CSS v4 (installed properly, not the CDN runtime the Axisform reference uses), with case-study content modeled as typed Markdown+frontmatter files validated by Zod rather than hand-parsed prose. Motion (GSAP + ScrollTrigger + Lenis) should be centralized in one small `motion/` module built around `@gsap/react`'s `useGSAP()` hook and a single Lenis-GSAP-ticker bridge, rather than re-implemented per component — this is the single highest-leverage architectural decision, since it structurally prevents the most common and costly bugs (StrictMode double-fire leaks, desynced RAF loops, reduced-motion being forgotten).

The recommended approach treats content and motion as clearly separated layers from day one: `content/caseStudies/*.md` plus a loader (`getFeaturedCaseStudies`/`getAllCaseStudies`/`getCaseStudyBySlug`) is the single source of truth driving both the homepage "selected work" grid and the case-study route, so adding/promoting/reordering a case study is a content-only change, never a JSX edit. Homepage copy is likewise pulled into one `content/homepage.ts` data module rather than hardcoded in JSX, because the copy is an explicit rough draft slated for a near-term rewrite — hardcoding it now creates real, foreseeable rework. Each case-study's structured fields (tools, outcome, challenge, process stages, solution images) map onto dedicated, individually art-directable React components mirroring `Project Page- Template.md` 1:1, rather than being rendered as generic parsed markdown.

The primary risks are not stack risk (the stack is well-documented and low-ambiguity) but execution risk in three areas: (1) motion infrastructure done incorrectly (uncleaned GSAP/ScrollTrigger instances, desynced Lenis/GSAP RAF loops, reduced-motion checked once instead of structurally) — must be solved once, early, in a dedicated foundation phase, not retrofitted later; (2) content pacing — the cinematic Axisform aesthetic is optimized for impact, but recruiters skim in seconds and need role/outcome visible immediately, so case-study layout must front-load substance while using motion as reinforcement, not a gate; (3) the contact form's "success" being trusted without a real end-to-end delivery test, which is uniquely dangerous here because form submissions are the site's literal success metric. All three risks have concrete, well-documented mitigations captured in PITFALLS.md and should be built as structural properties of the relevant phases, not left to later QA passes.

## Key Findings

### Recommended Stack

Vite 8 + React 19 + TypeScript (pinned to stable 5.x, not the `latest` 7.x prerelease track) + React Router 7/8 in declarative mode is the core. Tailwind CSS v4 (CSS-first config, `@tailwindcss/vite` plugin) replaces the Axisform reference's CDN Tailwind — the single most important "don't carry over" item. GSAP 3.15 + `@gsap/react` + Lenis 1.3 drive all motion; GSAP is now fully free (Webflow's 2025 acquisition removed the "Club GreenSock" paywall). Content is Markdown+frontmatter parsed via `import.meta.glob` + `gray-matter`, validated with Zod (Contentlayer is explicitly abandoned — do not use; Velite is the fallback if content scale grows well past 11 items). Forms use `@formspree/react` as the default (Resend requires a serverless function; EmailJS exposes provider details client-side).

**Core technologies:**
- Vite 8 + `@vitejs/plugin-react-swc` — build tool, right-sized for a static-ish client SPA, no SSR needed
- Tailwind CSS v4 + `@tailwindcss/vite` — styling, replaces the reference's unsuitable CDN approach
- GSAP 3.15 + `@gsap/react` (`useGSAP`) + Lenis 1.3 — motion, matches reference's animation language with a safe React integration pattern
- React Router 7/8 declarative mode — routing for ~6-11 static routes
- `@mdx-js/rollup`/plain Markdown + `gray-matter` + Zod — typed, validated case-study content

### Expected Features

**Must have (table stakes):**
- Deep narrative case studies (6 featured, per `Project Page- Template.md` structure) with skimmable hierarchy and outcome stated early
- Downloadable résumé PDF + multiple direct contact paths (email, LinkedIn, Behance) alongside a simple 3-field contact form
- Fast load / good Core Web Vitals and baseline accessibility (semantic structure, keyboard nav, focus states, `prefers-reduced-motion`) — both directly load-bearing since the site's own copy claims "Accessible and compliant"
- Mobile-responsive treatment of the cinematic homepage (simplified motion, not scaled-down desktop)

**Should have (competitive differentiators):**
- Explicit business-impact framing per case study (metrics, stakeholder/dev alignment) — already present in drafted copy, must be protected in final case-study writing
- Honest "Learnings & Reflections" section per case study — commonly omitted elsewhere, a credibility signal here
- Restrained, purposeful motion (not absent, not excessive) — the single biggest execution risk/opportunity given the cinematic reference direction
- Cross-market/localization signal (RTL, multi-region UX) and "Engagement models" (Full-Time/Contract/Consulting) section — both already drafted in copy, zero build cost

**Defer (v2+):**
- In-page anchor navigation within case studies (add once real copy length is known)
- The 5 deferred case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) — trigger: copy gets written
- Analytics on case-study engagement/scroll depth
- Password-gated/NDA case studies and any "live availability" widget — anti-features, do not build by default

### Architecture Approach

A layered structure with `content/` (typed frontmatter + loader functions), `motion/` (centralized GSAP/Lenis setup + shared hooks), `sections/` (homepage blocks) and `case-study/` (template sub-sections mirroring `Project Page- Template.md`), all composed by thin `pages/` and a single `router.tsx`. The key discipline is that no component reads raw content, imports GSAP/Lenis directly, or hardcodes case-study slug lists — everything flows through the content loader and the two shared motion hooks (`useScrollReveal`, `usePinnedSection`).

**Major components:**
1. `content/caseStudies.ts` + `caseStudySchema.ts` — single source of truth for all case-study data, validated via Zod, sorted/filterable by `featured`/`order`
2. `motion/` (`gsap.config.ts`, `SmoothScrollProvider`, `useScrollReveal`, `usePinnedSection`) — owns all plugin registration, Lenis-GSAP ticker sync, and reduced-motion gating
3. `sections/*` + `case-study/*` — presentational components per homepage block / per case-study template section, consuming content and motion hooks but never implementing either directly
4. `lib/contact.ts` — isolates the contact-form provider (Formspree/Resend) behind one function so UI and provider choice stay decoupled

### Critical Pitfalls

1. **Manual `useEffect` + ScrollTrigger instead of `useGSAP()`** — causes StrictMode double-fire and route-change leaks; standardize on `@gsap/react`'s `useGSAP()` from the first animated component, in a foundation/animation-infrastructure phase.
2. **Lenis shipped without anchor-link, route-change, and sticky-layout integration** — smooth scroll looks fine in isolation but breaks nav anchors, sticky elements, and post-navigation scroll state; treat as its own checklist, verified across every route, not just the homepage.
3. **Reduced-motion checked once instead of gated structurally** — use `gsap.matchMedia()`/`ScrollTrigger.matchMedia()` inside the shared hook so every current and future animated component inherits it automatically.
4. **Case studies paced "impressive first, informative later"** — recruiters skim in seconds; role/outcome must be visible in the first viewport, with motion as reinforcement, not a gate the reader scrolls through first.
5. **Contact form "success" trusted without real delivery verification** — a 200 response is not proof of delivery; requires a real end-to-end test against the live inbox (and spam folder) before the contact-form phase is considered done, since inquiries are the site's core success metric.

Additional pitfalls to carry into planning: client-side-routed case-study pages 404 on direct load/refresh unless the static host's SPA rewrite is configured; homepage copy hardcoded in JSX makes the already-planned copy rewrite expensive; `backdrop-filter`/glass-morphism cards cause real mobile (especially iOS Safari) scroll jank if not capped and tested on real devices.

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation & Motion Infrastructure
**Rationale:** GSAP/Lenis integration mistakes (uncleaned ScrollTrigger, desynced RAF loops, reduced-motion forgotten) are the most costly to retrofit — every later phase inherits whatever pattern is established here. Must exist before any section-specific animation work begins.
**Delivers:** Vite/React/TS/Tailwind v4 scaffold, `motion/` module (`gsap.config.ts`, `SmoothScrollProvider`, `useScrollReveal`, `usePinnedSection`), routing shell (`RootLayout`, `router.tsx`), design-token/UI-primitive set (`components/ui/`).
**Addresses:** Baseline accessibility (reduced-motion support), performance budget groundwork.
**Avoids:** Pitfalls 1, 2, 3 (uncleaned GSAP effects, Lenis integration gaps, late-bolted reduced-motion).

### Phase 2: Content Layer & Case-Study Template
**Rationale:** Case-study rendering depends on a validated content schema existing first; building this before homepage polish lets "add a case study = add one file" hold from day one, and lets the case-study pacing pitfall be addressed at the template level rather than after visual polish.
**Delivers:** `caseStudySchema.ts` + Zod validation, `content/caseStudies.ts` loader (`getAllCaseStudies`/`getFeaturedCaseStudies`/`getCaseStudyBySlug`), `case-study/` sub-section components (Overview, Tools, Outcome, Challenge, Process, Solution, Learnings) mirroring `Project Page- Template.md`, `/case-study/:slug` route.
**Uses:** Zod, `gray-matter`/`import.meta.glob`, `motion/` hooks from Phase 1.
**Implements:** Content Layer + Routing Layer from ARCHITECTURE.md; "data-driven first N / see more" pattern.
**Avoids:** Pitfall 4 (case studies not skimmable/role-outcome-first); Anti-Pattern 4 (generic markdown-to-HTML for a heavily art-directed template).

### Phase 3: Homepage Build
**Rationale:** Homepage composes the same motion/content patterns established in Phases 1-2; sequencing after the content layer means `SelectedWork` can immediately consume `getFeaturedCaseStudies()` instead of a placeholder.
**Delivers:** `content/homepage.ts` copy data module, all homepage sections (Hero, ProofStrip, SelectedWork with "see more", HowIWork, SkillsAndTools, About, ContactForm, Footer) wired to shared motion hooks.
**Addresses:** Table-stakes features — above-the-fold role/value statement, proof strip, skimmable selected-work grid, engagement-models content, footer contact block.
**Avoids:** Pitfall 7 (homepage copy hardcoded in JSX) — copy must live in `content/homepage.ts` from first build, not retrofitted after a copy-iteration request.

### Phase 4: Contact Form & Deployment Hardening
**Rationale:** Contact-form delivery and routing/hosting correctness are both "looks done but isn't" categories that only surface under real conditions (live inbox, direct-loaded deep links) — must be explicitly verified, not assumed from local dev testing.
**Delivers:** `lib/contact.ts` (Formspree default) with distinct success/error UI states, résumé PDF download wired and verified, SPA rewrite rules configured on the chosen host (Vercel/Netlify), deferred case-study slugs gated (not publicly linked/indexed) until content exists.
**Addresses:** Table-stakes contact/résumé features; anti-feature avoidance (no dead deferred routes).
**Avoids:** Pitfalls 5 and 6 (silent contact-form failure; case-study routes 404ing or getting indexed prematurely).

### Phase 5: Visual/Motion Polish & Performance Hardening
**Rationale:** Restrained, purposeful motion (the project's key differentiator) and mobile performance (glass-morphism/backdrop-filter jank, oversized responsive imagery) are best validated once real content and real motion are in place across all pages, not mid-build.
**Delivers:** Motion QA pass across all sections (reduced-motion toggled mid-session, StrictMode double-fire check), glass-morphism/backdrop-filter mobile testing on real devices, responsive image optimization, Core Web Vitals validation.
**Addresses:** The "restrained purposeful motion" differentiator; performance/accessibility table stakes as final gates.
**Avoids:** Performance traps (backdrop-filter jank, oversized onload timelines, unoptimized imagery) and re-verifies Pitfalls 1-3 hold across the full built site.

### Phase Ordering Rationale

- Motion infrastructure must come first because retrofitting `useGSAP()`/reduced-motion gating across many already-built components is documented as expensive (MEDIUM-HIGH recovery cost per PITFALLS.md), while doing it right from the start is nearly free.
- Content layer before homepage build lets the homepage consume real loader functions (`getFeaturedCaseStudies()`) instead of placeholder data, avoiding the hardcoded-slug-array anti-pattern entirely.
- Homepage before contact-form/deployment hardening because the contact form and hosting rewrite rules are meaningfully testable only once real routes and real content exist to click through and deep-link into.
- Visual/motion polish is deliberately last: it's a cross-cutting QA pass (reduced-motion toggling, mobile device testing, glass-morphism tuning) that needs the full built site to test against, not a "build correctly once" concern like Phase 1's infrastructure.

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Foundation & Motion Infrastructure):** GSAP+Lenis+React StrictMode interaction is well-documented at the pattern level, but the specific `usePinnedSection`/bespoke Hero set-piece implementation will likely need targeted research once the exact Axisform-derived motion choreography is finalized.
- **Phase 4 (Contact Form & Deployment Hardening):** Host-specific SPA rewrite configuration (Vercel vs. Netlify specifics) and Formspree quota/spam-protection setup should be confirmed against current provider docs at implementation time, since pricing/limits/config surface changes over time.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Content Layer & Case-Study Template):** File-based content + Zod validation is a well-established, thoroughly-documented pattern with a concrete code example already in ARCHITECTURE.md.
- **Phase 3 (Homepage Build):** Composition of sections from already-drafted copy and already-decided architecture; no open technical questions.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core versions verified directly against npm registry; integration patterns cross-checked against official GSAP/Lenis docs and repos |
| Features | MEDIUM | Web search only (no direct competitor-site teardown), but findings are cross-checked across 10+ independent sources and consistent with the project's own existing IA/copy/template |
| Architecture | MEDIUM | Patterns verified against official React/GSAP/Lenis sources and Vite glob conventions, but no project code exists yet to validate against — this is a recommended structure, not an observed one |
| Pitfalls | MEDIUM | Cross-checked across GSAP official docs/forums, Lenis maintainer issues, and multiple independent UX-portfolio/recruiter-behavior sources; no single source treated as authoritative alone |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- **Formspree vs. Resend decision:** Formspree keeps the site fully static (recommended default); Resend requires a serverless function. Confirm the final choice before Phase 4 planning, as it changes whether a serverless function needs to be provisioned at all.
- **Prerendering/SSG for case-study SEO:** Deferred as a Phase 2+ nice-to-have (`vite-react-ssg`) if link-preview quality for direct case-study shares turns out to matter more than assumed — not required for v1 since distribution is primarily direct links, not organic search. Revisit if this assumption proves wrong.
- **Exact bespoke motion set-pieces (Hero stack, pinned Selected Work reveal):** Architecture research provides the general pattern (`useScrollReveal`/`usePinnedSection`) but the specific choreography for 1-2 genuinely bespoke sections will need hands-on iteration during Phase 1/3 planning, not just pattern-level research.
- **Case-study word count/pacing validation:** In-page anchor navigation is deferred pending real copy length (research recommends ~800-1500 words); confirm once actual case-study copy is drafted whether anchor nav is needed for v1 or can stay deferred.

## Sources

### Primary (HIGH confidence)
- `registry.npmjs.org` direct API queries — current versions for react, vite, tailwindcss, gsap, @gsap/react, lenis, react-router, @mdx-js/rollup, typescript, and related packages
- GSAP official docs (gsap.com/resources/React/, gsap.com/docs/v3/GSAP/gsap.matchMedia()) and GSAP 3.13 licensing announcement
- `github.com/greensock/react` (official `@gsap/react` repo) and `github.com/darkroomengineering/lenis` (official Lenis repo)
- Chrome for Developers — scroll-driven animation performance case study
- Formspree official help docs (delivery/quota troubleshooting)
- Project-internal: `.planning/PROJECT.md`, `Portfolio-Documentation/Information Architecture.md`, `Portfolio-Documentation/Project Page- Template.md`, `Portfolio-Documentation/Homepage Copy V2.md`, `Templates/Axisform/Axisform Studio Design.md`, `.planning/codebase/CONCERNS.md`

### Secondary (MEDIUM confidence)
- GSAP community forum threads (ScrollTrigger + React cleanup, Lenis sync patterns, route-change position issues)
- `github.com/contentlayerdev/contentlayer/issues/429` (maintainer statement on reduced maintenance) and third-party "Contentlayer alternatives" write-ups
- UX-hiring/portfolio-advice ecosystem sources (UXfolio, UX Design Institute, UXPin, Toptal, Career Strategy Lab, Sarah Doody) on recruiter skim behavior and case-study structure
- Backdrop-filter/mobile performance sources (Josh W. Comeau, Graffino, Medium write-ups on Safari blur jank)

### Tertiary (LOW confidence)
- Comparative marketing-adjacent blogs on Formspree/EmailJS/Resend pricing and Vercel-vs-Netlify positioning — triangulated across several sources before being stated as recommendations
- Upwork "Availability Badge" precedent — explicitly flagged as marketplace-specific, low-confidence transfer to personal portfolios; treated as an anti-feature by default

---
*Research completed: 2026-07-21*
*Ready for roadmap: yes*
