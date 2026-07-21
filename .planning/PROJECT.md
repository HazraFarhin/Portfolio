# Hazra Farhin — Portfolio Website

## What This Is

A personal portfolio website for Hazra Farhin, a UX/UI Designer, built in React + Tailwind CSS to support active job applications, contract work, and consulting engagements. A single-scroll homepage showcases process, skills, and selected case studies, with dedicated case-study pages for deeper work samples — visually and interactively modeled on the Axisform reference template (dark, cinematic, GSAP/Lenis-driven motion).

## Core Value

A recruiter, hiring manager, or prospective client can understand Hazra's design capability and process within minutes through fast, credible, case-study-driven work — clarity of work over decoration.

## Business Context

- **Customer**: Recruiters, hiring managers, and prospective freelance/contract/consulting clients viewing the site
- **Revenue model**: Indirect — full-time job offers, contract/freelance engagements, and consulting bookings generated through the site
- **Success metric**: Interview requests and contract/consulting inquiries submitted via the contact form
- **Strategy notes**: none

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can view the homepage: hero, proof strip, selected work, how-I-work, skills & tools, about, contact/footer (per `Information Architecture.md`)
- [ ] User can view the top 6 featured case studies on the homepage, in Information Architecture order: cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io
- [ ] User can reveal the remaining case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) via a "see more" expansion
- [ ] User can view a full case-study page for each of the 6 featured projects, rendered from file-based content following `Project Page- Template.md`
- [ ] User can submit the contact form ("Send the Brief") and have it delivered via an email service (e.g. Formspree/Resend)
- [ ] Site is deployed and publicly accessible (Vercel or Netlify)

### Out of Scope

- Headless CMS with an editor UI — file-based content chosen instead; no non-technical editing UI needed for v1
- Full case-study pages for the 5 deferred projects (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) — copy not written yet, deferred to v2
- Final, polished homepage copy — current copy (`Homepage Copy V2.md`) is an explicit rough draft meant to be visually iterated after development, not locked content
- Noema-style visual direction — Axisform's interaction language was explicitly chosen instead

## Context

- Hazra Farhin is a UX/UI Designer with experience across banking, e-commerce, telecom, martech, beauty, and sports tech, across India, UAE, Saudi Arabia, Canada, and the USA. This site supports active job applications plus contract/consulting work.
- Substantial content groundwork already exists in `Portfolio-Documentation/`:
  - `Information Architecture.md` — site map and the full case-study route order
  - `Homepage Copy V2.md` — full rough-draft homepage copy (nav, hero, method, services, stats, gallery captions, selected work, principles, process, engagement models, contact, footer)
  - `Project Page- Template.md` — case-study page structure/frontmatter schema (metadata, overview, tools, outcome, challenge, process, solution, learnings)
- Two fully-specced HTML/CSS/JS style references exist in `Templates/`:
  - `Axisform/` — **chosen direction**: dark cinematic agency aesthetic, glass-surface cards, GSAP + Lenis-driven scroll/parallax motion, oversized editorial typography (Inter, black weights)
  - `Noema/` — not chosen: bold editorial artist-portfolio style, high-contrast color blocks
  - Both are reference-only for visual language and motion — not production code to build on directly (CDN-loaded Tailwind/GSAP/Lenis, no build tooling, shared placeholder analytics ID). See `.planning/codebase/CONCERNS.md`.
- `.planning/codebase/` already documents the pre-build repo state: no application code, no `package.json` — this is a from-scratch build in React + Tailwind CSS.
- Homepage copy is explicitly a rough draft meant to be visually validated and iterated after development — implementation should keep copy content easy to swap, not deeply hardcoded, since it will change.
- Project-page copy has not been written yet and will differ per case study; content will be added incrementally once the page template/system exists.

## Constraints

- **Tech stack**: React + Tailwind CSS — user's explicit choice, supersedes the Axisform reference template's vanilla HTML/CDN approach
- **Visual/interaction direction**: Match the Axisform reference's motion language (GSAP + Lenis smooth-scroll, parallax, glass-morphism cards) — reimplemented properly within React, not via CDN script tags
- **Content structure**: Case-study content must be file-based (e.g. MDX/JSON per project) — no external headless CMS, so copy stays simple to add as it's written over time
- **Case-study rollout order**: Homepage shows the first 6 slugs from `Information Architecture.md` (cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io); the remaining 5 (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) sit behind "see more"
- **Deployment**: Vercel or Netlify
- **Timeline**: No hard deadline — prioritize getting it right over shipping fast

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Axisform over Noema for visual/interaction direction | User explicitly prefers Axisform's interactions | — Pending |
| React + Tailwind CSS as the real stack | User's explicit choice over the reference templates' plain HTML/CDN approach | — Pending |
| File-based content for case studies (no headless CMS) | Keeps v1 simple and cost-free; copy is being added incrementally per project anyway | — Pending |
| Contact form wired to an email service, not a custom backend | No backend to maintain; standard pattern for static/React sites | — Pending |
| Ship first 6 case studies per IA order; defer remaining 5 | Matches user's own IA plan (top 6 on home + "see more"); copy for the rest isn't written | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-07-21 after initialization*
