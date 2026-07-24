# Phase 2: Content Layer & Case-Study Template - Context

**Gathered:** 2026-07-24
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase builds the file-based, typed case-study content system and the reusable template that renders it: a schema for case-study data, a content-loading mechanism, and the `/case-study/:slug` page component (built on Phase 1's routing shell and UI primitives) that renders Overview, Tools Used, Outcome & Impact, Challenge, Process, Solution, and Learnings & Reflections in that structure for each of the 6 featured projects (cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io). It does not build the homepage's Selected Work grid/cards (Phase 3 consumes this phase's loader), and it does not author full pages for the 5 deferred projects (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) — out of scope per PROJECT.md.

</domain>

<decisions>
## Implementation Decisions

### Content Authoring Status (real client content does not exist yet)
- **D-01:** No real case-study copy exists anywhere in the repo for any of the 6 named projects — confirmed via repo search. Phase 2 ships **structurally-complete placeholder content** for all 6 slugs: realistic, clearly draft-quality copy (generic role/process/outcome language) that fully exercises every template section, schema field, and validation rule — but does **not** invent client-specific metrics, quotes, or claims attributed as fact to the real named clients (Mashreq, Tata Capital, etc.). This mirrors the already-established pattern for `Homepage Copy V2.md` (explicit rough draft, meant to be swapped later, kept in a data layer rather than hardcoded deep in JSX).
- **D-02:** No image assets exist (`public/` contains only `favicon.svg`). Cover images and in-process images referenced by the template are placeholder blocks (styled divs/gradients using Phase 1's design tokens, not real photos) for all 6 case studies in this phase — real photography/mockups get swapped in later alongside real copy, same swap-later pattern as D-01.
- **D-03:** Placeholder content must be visibly identifiable as draft (e.g. a subtle "Draft content — pending final copy" marker sourced from the same `status` frontmatter field the template schema already defines) so it's never mistaken for finished, shippable copy if seen out of context.

### Content Format & Tooling
- **D-04:** Case-study content is Markdown + YAML frontmatter per file (one `.md` per slug), matching CASE-04's own literal example and the PROJECT.md file-based constraint. Frontmatter carries structured fields (title, slug, client, industry, role, team, timeline, status, featured, cover_image, tags, external_link, one-line summary) exactly per `Project Page- Template.md`'s CMS-fields block; the Markdown body carries the narrative sections (Challenge, Process stage write-ups, Solution paragraph, Learnings & Reflections).
- **D-05:** Frontmatter is validated against a typed schema (Zod, or an equivalent lightweight runtime validator — Claude's Discretion on exact library) at content-load time, satisfying CASE-04's "typed data" requirement literally rather than relying on TypeScript-only structural typing (which can't catch malformed frontmatter in a plain `.md` file at build time).
- **D-06:** Content files are loaded via Vite's native glob import (e.g. `import.meta.glob`) rather than a Node-only build step, keeping the site fully static per the "no headless CMS / no backend" constraint from PROJECT.md.

### Template Rendering & Composition
- **D-07:** One `CaseStudyPage` route component (mounted at `/case-study/:slug` — the route already exists per Phase 1's D-11) composes small presentational subcomponents per template section (Overview table, Tools Used list, Outcome & Impact list, Challenge, Process steps, Solution, Learnings & Reflections), reusing Phase 1's `Button`/`Card`/`Typography` primitives rather than introducing new one-off styling.
- **D-08:** Role and outcome must be visible in the Overview section without scrolling (CASE-03) — the Overview table (client/industry/role/team/timeline/links) renders directly below the title and one-line summary, before any other section.
- **D-09:** These section subcomponents are internal to the case-study template only in this phase. Whether any of them (e.g. a project preview card) get reused by Phase 3's homepage "Selected Work" grid is Phase 3's decision, not locked here — Phase 3 will read this phase's loader/metadata (title, slug, one-line summary, cover image, featured flag), not necessarily these section components directly.

### Scope Boundary — Deferred Slugs
- **D-10:** Phase 2 authors content files for exactly the 6 featured slugs. The 5 deferred slugs (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) are NOT created as content files, NOT given routes, and NOT stubbed in this phase — full pages for them are out of scope for v1 per PROJECT.md, and gating them out of navigation/sitemap is explicitly Phase 4's job (ROADMAP.md Phase 4 success criterion #5), not this phase's.

### Claude's Discretion
- Exact schema-validation library (Zod vs. Valibot vs. other lightweight runtime validator) — D-05 only locks that one exists.
- Internal file/folder structure for content files (e.g. `src/content/case-studies/*.md`) and the loader module.
- Exact wording/tone of placeholder copy per case study (draft-quality, generic, non-fabricated per D-01).
- Visual treatment of the "draft content" marker from D-03 (badge, banner, subtle label — consistent with Phase 1's dark cinematic tokens).
- Internal component API/props shape for the section subcomponents from D-07, as long as they compose Phase 1's primitives.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/ROADMAP.md` — Phase 2 goal, success criteria, requirement mapping (CASE-01–04)
- `.planning/REQUIREMENTS.md` — CASE-01 (navigable page per featured project), CASE-02 (7 required sections per template), CASE-03 (role/outcome skimmable above the fold), CASE-04 (typed, file-based content; new case study = content-only change)
- `.planning/PROJECT.md` — file-based content constraint (no headless CMS), case-study rollout order (6 featured now, 5 deferred to v2), "Homepage copy is explicit rough draft... keep copy easy to swap" precedent applied here to case-study copy too

### Content structure (the schema source of truth)
- `Portfolio-Documentation/Project Page- Template.md` — full case-study page structure: CMS frontmatter fields (title, slug, client, industry, role, team, timeline, status, featured, cover_image, tags, external_link) and the 7 body sections (Overview, Tools Used, Outcome & Impact, The Challenge, Process [5 sub-stages: Discovery & Research, Define, Ideate & Wireframe, Design & Prototype, Test & Iterate], Solution, Learnings & Reflections), plus a "Next Project" footer link
- `Portfolio-Documentation/Information Architecture.md` — the 6 featured + 5 deferred slug list and route paths (`/case-study/{slug}`)

### Prior phase (Phase 1) foundation this phase builds on
- `.planning/phases/01-foundation-motion-infrastructure/01-CONTEXT.md` — D-11 (React Router already supports `/case-study/:slug`), D-07/D-08 (UI primitive styling depth — button/card/typography are already Axisform-styled, reuse rather than re-skin)
- `src/router.tsx`, `src/components/ui/{Button,Card,Typography}.tsx`, `src/lib/cn.ts` — existing routing shell and primitives to build on directly (see Existing Code Insights below)

### Codebase state confirmed during this discussion
- No case-study content exists anywhere in the repo for any of the 6 named projects (confirmed via full-repo search for cad/verzion/tata capital/mashreq/astrosure/adreport)
- No image assets exist beyond `public/favicon.svg`
- No Markdown/frontmatter-parsing or schema-validation library (`gray-matter`, `zod`, etc.) is installed yet — this phase's planner/researcher must select and add one

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Button.tsx`, `Card.tsx`, `Typography.tsx` — Axisform-styled UI primitives from Phase 1, ready to compose the case-study template sections (D-07) rather than redefining styling
- `src/lib/cn.ts` — `clsx`/`tailwind-merge` className helper with the custom `text-*` font-size classGroup registration from Phase 1's 01-04-PLAN.md; any new typography variant added in this phase should register here too if it introduces a new `@theme` scale
- `src/router.tsx` — React Router setup; the `/case-study/:slug` dynamic route slot already anticipated per Phase 1's D-11, ready to be filled in
- `src/motion/useScrollReveal.ts`, `src/motion/MotionProvider.tsx` — reduced-motion-safe scroll-reveal hook and provider available if case-study sections want scroll-triggered reveals (optional, not required by any Phase 2 requirement)

### Established Patterns
- Content-as-data-module pattern already established for Hero copy (`src/content/hero.ts`) — keeps copy out of JSX. This phase's case-study content should follow the same spirit (content separated from rendering) but via Markdown+frontmatter files per D-04, not more `.ts` data modules, since CASE-04 specifically asks for typed, file-based (Markdown+frontmatter-style) content.
- Reduced-motion and cleanup discipline (StrictMode-safe `ScrollTrigger`/`Lenis` teardown) established in Phase 1 — if this phase's components use `useScrollReveal()`, no new reduced-motion logic should be written; consume the existing hook.

### Integration Points
- This phase's content loader is the integration point Phase 3 depends on for "Selected Work" (must expose `featured`, IA order, and preview fields like title/slug/one-line-summary/cover_image without requiring Phase 3 to parse Markdown itself)
- The `/case-study/:slug` route slot in `src/router.tsx` is where this phase's `CaseStudyPage` component attaches

</code_context>

<specifics>
## Specific Ideas

- Placeholder copy per case study should stay generic enough to avoid misrepresenting real client work (D-01) — e.g. describing a plausible UX process and role without inventing specific quantified outcomes ("reduced onboarding drop-off by 40%") that could later be mistaken for a real, verified claim about a real bank/company.
- The "draft content" signal (D-03) should be unobtrusive in the rendered page, not a jarring warning banner — this is a portfolio site, first impressions matter even on draft-labeled pages.

</specifics>

<deferred>
## Deferred Ideas

- **Reusing case-study section subcomponents for homepage preview cards** — Raised during Template Rendering discussion (D-09). Not locked in this phase; left for Phase 3 to decide when it builds Selected Work, since Phase 3's card design may need a much more condensed view than any Phase 2 section component provides.
- **Full pages for the 5 deferred case studies** (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) — already tracked in STATE.md Deferred Items from milestone requirements definition; reconfirmed out of scope for this phase (D-10).

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 2-Content Layer & Case-Study Template*
*Context gathered: 2026-07-24*
