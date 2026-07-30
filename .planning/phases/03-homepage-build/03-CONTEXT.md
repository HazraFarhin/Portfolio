# Phase 3: Homepage Build - Context

**Gathered:** 2026-07-30
**Status:** Ready for planning

<domain>
## Phase Boundary

This phase assembles the single-scroll homepage on top of Phase 1's motion/routing/UI-primitive foundation and Phase 2's real case-study content loader: the existing Hero route (`src/routes/home.tsx`) gains sibling sections in Information Architecture order — Proof Strip, Selected Work, How I Work, Skills & Tools, About, and Contact/Footer — plus a persistent nav bar and a Field Archive gallery beyond the locked 7-section IA. It does not build actual contact-form submission/email delivery (Phase 4's CONT-01/02), does not build full pages for the 5 deferred case studies (out of scope for v1 per PROJECT.md), and does not do final visual/motion/performance polish (Phase 5).

</domain>

<decisions>
## Implementation Decisions

### Section Scope & Structure (reconciling Homepage Copy V2.md's 12 sections against the 7-section locked IA)
- **D-01:** The homepage builds all 7 IA-locked sections (Hero, Proof Strip, Selected Work, How I Work, Skills & Tools, About, Contact/Footer) plus three additions beyond the locked IA: a persistent nav bar (D-06), a Field Archive placeholder gallery (D-04), and Studio Method's action-words folded into How I Work (D-02). Field Notes (principle cards) and Engage (engagement-model cards) from `Homepage Copy V2.md` are explicitly cut for v1 (D-05).
- **D-02:** How I Work (HOME-05) combines Studio Method's six action-words (listen / align / reduce / design. / prototype / systemize) as a visual/typographic beat alongside "09/Process (Operating Loop)"'s 5-step Loop (Understand→Align→Structure→Design→Transfer) — not two separate process sections.
- **D-03:** Skills & Tools (HOME-06) reuses `Homepage Copy V2.md`'s "04/Operating Stack" 5 capability-area cards (Discovery & Research; UX Strategy & IA; UI Design & Prototyping; Stakeholder & Developer Alignment; Design Systems & Dev Handoff) as its core content — deliberately NOT placed under How I Work, since PROJECT.md explicitly frames How I Work as process, "not services," and this content reads like services.
- **D-04:** Field Archive (horizontal-scroll gallery of research/wireframe fragment captions from "06/Field Archive") is included as an extra homepage section, using the same styled-placeholder-block pattern Phase 2 used for case-study cover images — no real photography exists anywhere in the repo yet.
- **D-05:** Field Notes (6 principle cards) and Engage (3 engagement-model cards) from `Homepage Copy V2.md` are cut entirely for v1 — not built anywhere on the homepage this phase.
- **D-06:** A persistent nav bar (wordmark + anchor links to the homepage sections, per "01/Navigation") is in scope for Phase 3, even though it is not one of the 7 IA-locked sections — standard for a single-scroll portfolio site, helps recruiters jump around.
- **D-07:** The Contact/Brief area (part of HOME-08's Contact/Footer section) builds ONLY the static 3-field form UI — markup, fields, styling, CTA copy ("What are you working on?" / "Reach me at, Email" / "What needs to become clearer?" / "Send the Brief →"). No submission handling, no email delivery, no success/error states. CONT-01 (delivery) and CONT-02 (feedback) are Phase 4's job, wired onto this UI later.

### Selected Work Data & "See More" (HOME-03, HOME-04)
- **D-08:** Selected Work renders the 6 featured case studies from Phase 2's real content loader (`caseStudies` export in `src/content/case-studies/loader.ts`) — title, slug, summary, cover_image, client. The old "07/Work (Selected Projects)" copy in `Homepage Copy V2.md` describes 5 different, non-matching fictional-sounding projects (e.g. "AI-Native Banking Interface") that do NOT correspond to the real case-study titles/slugs (e.g. "Mashreq Mobile Banking Redesign" / `mashreq`). That old copy is NOT used — this reconfirms what REQUIREMENTS.md's HOME-03 already locks (loader-driven, not hardcoded).
- **D-09:** "See more" (HOME-04) expands the SAME Selected Work grid inline (6 → 11 entries) rather than a separate list below it. The "see more" trigger becomes "see less" (or disappears) once expanded.
- **D-10:** The 5 deferred-slug entries (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus — no content files or routes exist per Phase 2's D-10) render as full-looking cards matching the featured 6's visual style, linking to a coming-soon route/state — not name-only chips, not a 404.
- **D-11 — Cross-phase conflict, explicitly accepted by the user after being flagged:** DEPL-03 (Phase 4 requirement) requires the 5 deferred slugs to be "not linked from any page." D-10's clickable coming-soon cards directly conflict with this until Phase 4 runs. The user was shown this conflict explicitly and chose to accept a temporary window where the 5 deferred slugs ARE linked, rather than shipping non-clickable entries now. **Phase 4's plan MUST remove or guard these links as part of its own DEPL-03 work — this is a required Phase 4 follow-up, not optional cleanup.** Flag this in Phase 4's CONTEXT.md/planning and in STATE.md's Blockers/Concerns.

### About & Skills/Tools Content (HOME-06, HOME-07 — no matching copy exists in Homepage Copy V2.md for either)
- **D-12:** About (HOME-07) is a condensed 2-4 sentence bio drawn from the Hero's longer statement plus PROJECT.md's Context section (background across banking/e-commerce/telecom/martech/beauty/sports tech; India/UAE/Saudi Arabia/Canada/USA) — written fresh, not copy-pasted verbatim from either source.
- **D-13:** About includes a headshot/photo placeholder block (reusing Phase 2's `ImagePlaceholder` component pattern) alongside the bio text, even though no real photo exists yet — consistent with the swap-later pattern already established for case-study cover images.
- **D-14:** Skills & Tools (HOME-06), beyond the 5 Operating Stack capability cards (D-03), also includes a row of concrete tool chips — aggregated as the distinct values already present across the 6 case-study frontmatter `tags` fields (e.g. Figma, FigJam, UX, UI, Design System, Mobile) rather than a separately curated/invented tool list. This stays consistent with real content and requires no new copy to invent.

### Résumé & Footer (HOME-08, CONT-04)
- **D-15:** A real résumé source file exists at the repo root: `Hajra Farhin Resume UX.docx` (11KB, real content — not a placeholder). Phase 3 converts this to a PDF and places it at a public path (e.g. `public/resume.pdf`), wiring the footer's résumé link to the real converted file directly — NOT a placeholder path. This means HOME-08's résumé link ships fully functional in Phase 3, ahead of Phase 4's CONT-03 (which now only needs to verify the already-real download works end-to-end).
- **D-16:** Footer content (contact info, LinkedIn/Behance/email links per CONT-04, legal links) follows "12/Footer" from `Homepage Copy V2.md` as-is: email (hazrafarhinwork@gmail.com), phone, location, LinkedIn/Behance/Website under "Elsewhere," Privacy Policy/Terms under "Legal."

### Post-Research Clarifications (resolved 2026-07-30, after RESEARCH.md flagged them as open questions)
- **D-14 clarified:** Skills & Tools tool chips are aggregated from the case-study frontmatter `tags` field only (10 discipline/industry values: UX, UI, InsurTech, Dashboard, Banking, Mobile, Design System, Enterprise, Cloud, AI Interface) — NOT from the unstructured `Tools Used` Markdown body text. D-14's own "e.g. Figma, FigJam" example is superseded/incorrect; no new Markdown parsing is needed.
- **D-06 clarified:** The persistent nav bar is scoped to the homepage only (mounted inside `home.tsx`, plain `#id` anchor hrefs) — it does NOT appear on `/case-study/:slug` pages. Matches this phase's stated boundary; a site-wide nav is an explicit out-of-scope follow-up, not silently expanded scope.

### Claude's Discretion
- Exact visual placement/order of the nav bar, Field Archive gallery, and Studio Method action-words relative to the 7 IA-locked sections.
- Exact wording of the condensed About bio (within the "Hero statement + PROJECT.md bio" source constraint from D-12).
- Visual treatment of the "coming soon" state for the 5 deferred-slug routes from D-10.
- Exact tool-chip rendering (pills, inline list, icons) for D-14.
- Exact `.docx`→PDF conversion method for D-15, as long as résumé content is preserved faithfully.
- Internal component/file structure for all new homepage sections.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project scope & requirements
- `.planning/ROADMAP.md` — Phase 3 goal, success criteria, requirement mapping (HOME-01–08, CONT-04)
- `.planning/REQUIREMENTS.md` — HOME-01–08 (homepage sections), CONT-04 (footer contact links); note DEPL-03 (Phase 4) is the source of the D-11 conflict
- `.planning/PROJECT.md` — "Homepage copy is explicit rough draft... keep copy easy to swap" constraint still applies — copy stays in a data module, not hardcoded, per Phase 1/2 precedent

### Homepage copy & structure sources
- `Portfolio-Documentation/Homepage Copy V2.md` — full rough-draft homepage copy for every section (Nav, Hero, Studio Method, Operating Stack, Telemetry, Field Archive, Work [superseded by real data, see D-08], Field Notes [cut, D-05], Process, Engage [cut, D-05], Contact/Brief, Footer)
- `Portfolio-Documentation/Information Architecture.md` — the 7 locked homepage sections in scroll order, plus the full 6-featured + 5-deferred case-study slug list

### Prior phase (Phase 1, Phase 2) foundation this phase builds on
- `.planning/phases/01-foundation-motion-infrastructure/01-CONTEXT.md` — motion system (MotionProvider, useScrollReveal), UI primitives (Button/Card/Typography), existing Hero (Phase 1 D-05: Phase 3 refines/extends this same route rather than replacing it)
- `.planning/phases/02-content-layer-case-study-template/02-CONTEXT.md` — case-study content loader is the integration point for Selected Work (D-08); `ImagePlaceholder` component pattern reused for D-04 and D-13
- `src/content/case-studies/loader.ts` — `caseStudies`, `getCaseStudyBySlug`, `getNextCaseStudy` — the real data source for Selected Work (D-08)
- `src/content/case-studies/schema.ts` — `CaseStudyFrontmatter` fields available for card rendering (title, slug, summary, cover_image, tags, client, industry, featured, order)
- `src/components/case-study/ImagePlaceholder.tsx` — placeholder-image pattern to reuse for D-04 (Field Archive) and D-13 (About photo)
- `src/components/ui/{Button,Card,Typography}.tsx`, `src/lib/cn.ts` — Axisform-styled UI primitives to compose all new sections from
- `src/motion/useScrollReveal.ts`, `src/motion/MotionProvider.tsx` — reduced-motion-safe scroll-reveal hook, already wired at app root
- `src/routes/home.tsx`, `src/content/hero.ts` — existing Hero implementation this phase extends (add sibling sections, do not replace); `heroContent.ctaHref` currently points at `#hero` (a Phase-1-only placeholder anchor per that file's own comment) and must be repointed to the real Selected Work section id once it exists
- `src/router.tsx` — route tree; Phase 3 adds a coming-soon route for the 5 deferred slugs (D-10) that Phase 4 must remove/guard per D-11

### Résumé source
- `Hajra Farhin Resume UX.docx` (repo root) — real résumé content to convert to PDF for D-15

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/Button.tsx`, `Card.tsx`, `Typography.tsx` — Axisform-styled primitives; compose all new sections (Proof Strip stats, Selected Work cards, How I Work steps, Skills & Tools cards, About, Contact form, Footer) from these rather than introducing new one-off styling
- `src/components/case-study/ImagePlaceholder.tsx` — existing placeholder-image component from Phase 2, reusable for the Field Archive gallery (D-04) and About headshot (D-13)
- `src/content/case-studies/loader.ts` — `caseStudies` array is the single source of truth for Selected Work (D-08); already sorted by `order`, already isolates per-file parse failures
- `src/motion/useScrollReveal.ts` — reduced-motion-safe reveal hook already used by the Hero; every new section should consume this rather than writing new scroll-trigger logic

### Established Patterns
- Content-as-data-module pattern (`src/content/hero.ts`) — copy lives outside JSX because Homepage Copy V2.md is an explicit rough draft expected to be rewritten; every new section's copy (Proof Strip stats, How I Work steps, Skills & Tools cards, About bio, Footer links) should follow the same pattern, not be hardcoded inline
- Reduced-motion and cleanup discipline (StrictMode-safe ScrollTrigger/Lenis teardown) established in Phase 1 — reuse `useScrollReveal()`, do not reimplement

### Integration Points
- `src/routes/home.tsx` — the single route all new sections mount into as siblings of the existing `<section id="hero">`
- `src/router.tsx` — where the coming-soon route for deferred slugs (D-10) attaches; Phase 4 will need to find and remove/guard it here (D-11)
- `heroContent.ctaHref` in `src/content/hero.ts` — must be updated once Selected Work's section id exists (currently a Phase-1 placeholder anchor)

</code_context>

<specifics>
## Specific Ideas

- The résumé at `Hajra Farhin Resume UX.docx` (repo root) is real, current content — not a placeholder — and should be converted and linked for real in this phase (D-15), unlike case-study cover images and About's headshot, which stay as placeholders since no real photography exists.
- Skills & Tools tool chips should read as an actual skimmable skills list for recruiters (D-14) — pulled from real case-study tag data, not invented.
- The About section's bio should read as genuinely compact (2-4 sentences per D-12), not a repeat of the Hero's longer statement.

</specifics>

<deferred>
## Deferred Ideas

- **Field Notes (6 principle cards) and Engage (3 engagement-model cards)** — cut for v1 (D-05). Could be reconsidered for a future iteration if Hazra wants more "how I think" / "how to hire me" content on the homepage — not currently in REQUIREMENTS.md.
- **DEPL-03 link removal for the 5 deferred slugs** — not deferred by accident but by explicit cross-phase design (D-11): Phase 4 MUST address this as part of its own DEPL-03 work. Carried forward to STATE.md Blockers/Concerns so it isn't lost between phases.

### Reviewed Todos (not folded)
None — no pending todos matched this phase.

</deferred>

---

*Phase: 3-Homepage Build*
*Context gathered: 2026-07-30*
