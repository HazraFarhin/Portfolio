# Roadmap: Hazra Farhin — Portfolio Website

## Overview

This roadmap builds a from-scratch React + Tailwind CSS portfolio in five layers, each a complete technical foundation the next assembles on top of. Phase 1 establishes the build tooling and the centralized GSAP/Lenis motion system — the single hardest thing to retrofit — before any real content exists. Phase 2 builds the validated, file-based case-study content layer and template so each of the 6 featured projects has a real, navigable page. Phase 3 assembles the single-scroll homepage on top of that content layer and motion system, wiring every section (hero through footer) to real data instead of placeholders. Phase 4 hardens the two things that "look done but aren't" until tested under real conditions: contact-form email delivery and host routing/deployment. Phase 5 is the final cross-cutting pass — motion restraint, mobile behavior, accessibility, and performance — validated against the whole built site rather than component-by-component. By the end, a recruiter or prospective client can land on the live site, skim role and outcome in seconds, read any of the 6 case studies in full, and reach Hazra through a working contact form, résumé download, or social link.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Motion Infrastructure** - Vite/React/TS/Tailwind scaffold with a centralized, reduced-motion-safe GSAP + Lenis motion system and routing shell (completed 2026-07-24)
- [x] **Phase 2: Content Layer & Case-Study Template** - Validated file-based case-study content and a reusable template rendering all 6 featured project pages (completed 2026-07-28)
- [ ] **Phase 3: Homepage Build** - Single-scroll homepage assembling hero through footer from real content and motion hooks
- [ ] **Phase 4: Contact Form & Deployment Hardening** - Verified end-to-end contact-form delivery, résumé download, and public deployment with correct routing
- [ ] **Phase 5: Visual/Motion Polish & Performance Hardening** - Cross-site QA pass on motion restraint, mobile behavior, accessibility, and performance budget

## Phase Details

### Phase 1: Foundation & Motion Infrastructure

**Goal**: The technical foundation (build tooling, centralized motion system, routing shell, UI primitives) is in place so every later phase builds features on established patterns instead of inventing new ones per component.
**Depends on**: Nothing (first phase)
**Requirements**: QUAL-01, QUAL-02
**Success Criteria** (what must be TRUE):

  1. The app builds and runs on Vite + React + TypeScript + Tailwind CSS v4 with a working routing shell (root layout + router) — no CDN script tags carried over from the Axisform reference
  2. A demo/placeholder route exhibits GSAP + Lenis-driven smooth-scroll and scroll-triggered reveal motion without breaking native keyboard navigation or scroll-to-anchor behavior
  3. Enabling `prefers-reduced-motion` at the OS level automatically disables non-essential motion on every animated component built so far, with no per-component opt-in code required
  4. A shared `components/ui/` primitive set (buttons, cards, typography) exists and is reused rather than redefined per section

**Plans**: 7/7 plans executed
Plans:

- [x] 01-07-PLAN.md

**Wave 1**

- [x] 01-01-PLAN.md — Package legitimacy verification checkpoint (blocking, gates npm install)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Vite+React+TS scaffold, Tailwind v4 design tokens, Vitest+jsdom test harness

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 01-03-PLAN.md — MotionProvider (Lenis+GSAP/ScrollTrigger bootstrap) + reduced-motion detection
- [x] 01-04-PLAN.md — UI primitives: Button, Card, Typography

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 01-05-PLAN.md — useScrollReveal hook

**Wave 5** *(blocked on Wave 4 completion)*

- [x] 01-06-PLAN.md — Hero content module + router + Hero composition (capstone integration)

**UI hint**: yes

### Phase 2: Content Layer & Case-Study Template

**Goal**: Case-study content is modeled as validated, file-based data and rendered through a reusable template mirroring `Project Page- Template.md`, so recruiters can read any of the 6 featured case studies end-to-end and adding a new one is a content-only change.
**Depends on**: Phase 1
**Requirements**: CASE-01, CASE-02, CASE-03, CASE-04
**Success Criteria** (what must be TRUE):

  1. User can navigate to a dedicated page for each of the 6 featured case studies (cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io)
  2. Each case-study page renders Overview, Tools Used, Outcome & Impact, Challenge, Process, Solution, and Learnings & Reflections sections in that structure
  3. Role and outcome are visible within the first viewport of every case-study page, skimmable in seconds without scrolling
  4. Case-study content lives in typed Markdown+frontmatter files validated by a schema; adding a 7th case study requires only a new content file, no component changes

**Plans**: 10/10 plans executed
Plans:

- [x] 02-10-PLAN.md

**Wave 1**

- [x] 02-01-PLAN.md — Package legitimacy verification checkpoint (blocking, gates zod/js-yaml/react-markdown install)
- [x] 02-02-PLAN.md — 6 case-study content files (Markdown + YAML frontmatter)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 02-03-PLAN.md — CaseStudyFrontmatterSchema (Zod) + parseCaseStudyFile/splitBodyIntoSections
- [x] 02-04-PLAN.md — ImagePlaceholder, ToolsUsed, OutcomeImpact components

**Wave 3** *(blocked on Wave 2 completion)*

- [x] 02-05-PLAN.md — Solution component
- [x] 02-06-PLAN.md — Process component (5 fixed sub-stages)
- [x] 02-07-PLAN.md — Overview + DraftBadge components
- [x] 02-08-PLAN.md — Content loader (import.meta.glob, per-file isolation, circular Next Project)

**Wave 4** *(blocked on Wave 3 completion)*

- [x] 02-09-PLAN.md — CaseStudyPage integration + router wiring (capstone)

**UI hint**: yes

### Phase 3: Homepage Build

**Goal**: A single-scroll homepage presents Hazra's role, proof, selected work, process, skills, and contact paths in Information Architecture order, so a recruiter can assess fit within minutes.
**Depends on**: Phase 1, Phase 2
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, HOME-06, HOME-07, HOME-08, CONT-04
**Success Criteria** (what must be TRUE):

  1. Above the fold, the hero states role, specialization, and availability status
  2. Scrolling the homepage reveals, in Information Architecture order: hero, proof strip (stats), Selected Work, How I Work, Skills & Tools, About, and contact/footer
  3. Selected Work shows the 6 featured case studies in IA order, pulled from the Phase 2 content loader (not hardcoded), and a "see more" control reveals the remaining 5 as entries
  4. The footer offers a résumé download link, contact info, and direct LinkedIn/Behance/email links that all navigate correctly

**Plans**: 5/7 plans executed
Plans:

- [x] 03-01-PLAN.md — Nav bar + Proof Strip + Field Archive (D-06, HOME-02, D-04)
- [x] 03-02-PLAN.md — Selected Work (real 6 + deferred 5 toggle) + How I Work (HOME-03/04/05)
- [x] 03-03-PLAN.md — Skills & Tools + About (HOME-06/07)
- [x] 03-04-PLAN.md — Coming-soon route + router wiring for 5 deferred slugs (D-10/D-11)
- [x] 03-05-PLAN.md — Checkpoint: résumé PDF conversion + real social URLs (D-15, CONT-04)
- [ ] 03-06-PLAN.md — Contact/Brief form UI + Footer (HOME-08, CONT-04)
- [ ] 03-07-PLAN.md — Home route integration capstone (mounts all sections, repoints Hero CTA)

**Wave 1**

- [x] 03-01-PLAN.md — Nav + Proof Strip + Field Archive
- [x] 03-02-PLAN.md — Selected Work + How I Work
- [x] 03-03-PLAN.md — Skills & Tools + About
- [x] 03-04-PLAN.md — Coming-soon route + router wiring
- [x] 03-05-PLAN.md — Checkpoint: résumé PDF + social URLs

**Wave 2** *(blocked on 03-05 completion)*

- [ ] 03-06-PLAN.md — Contact/Brief + Footer

**Wave 3** *(blocked on Wave 1 + 03-06 completion)*

- [ ] 03-07-PLAN.md — Home route integration (capstone)

**UI hint**: yes

### Phase 4: Contact Form & Deployment Hardening

**Goal**: The site is live at a public URL, the contact form reliably delivers inquiries to Hazra's inbox with clear feedback, the résumé is downloadable, and case-study rollout is correctly gated.
**Depends on**: Phase 3
**Requirements**: CONT-01, CONT-02, CONT-03, DEPL-01, DEPL-02, DEPL-03
**Success Criteria** (what must be TRUE):

  1. Submitting the 3-field contact form ("What are you working on?", Email, "What needs to become clearer?") delivers a real email to Hazra's inbox, verified end-to-end against the live inbox — not just a 200 response
  2. The form shows a distinct, clear success state on delivery and a distinct error state on failure
  3. Clicking the résumé link downloads a working PDF
  4. The deployed site is publicly reachable at a Vercel/Netlify URL, and directly loading or refreshing a case-study route (e.g. `/case-study/mashreq`) works without a 404
  5. The 5 deferred case-study slugs (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) are not linked from any page and are excluded from sitemap/indexing

**Plans**: TBD
**UI hint**: yes

### Phase 5: Visual/Motion Polish & Performance Hardening

**Goal**: The full built site's motion is restrained and purposeful, behaves correctly on mobile, respects accessibility needs, and meets a performance budget — validated as a final cross-cutting pass against the whole site, not assumed from earlier component-level work.
**Depends on**: Phase 4
**Requirements**: QUAL-03, QUAL-04, QUAL-05
**Success Criteria** (what must be TRUE):

  1. On mobile viewports, motion is deliberately simplified (not a scaled-down desktop timeline), and glass-morphism/backdrop-filter effects don't cause scroll jank on real devices
  2. The site meets baseline accessibility: semantic headings, image alt text, full keyboard navigation, visible focus states, and adequate color contrast across all pages
  3. The site meets a performance budget: fast initial load, no layout-shift-inducing reveal animations, and animation libraries are code-split rather than bundled into the main chunk
  4. Toggling `prefers-reduced-motion` mid-session and reloading each route confirms no orphaned GSAP/ScrollTrigger instances or desynced scroll state remain anywhere on the site

**Plans**: TBD
**UI hint**: yes

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Motion Infrastructure | 7/7 | Complete    | 2026-07-24 |
| 2. Content Layer & Case-Study Template | 10/10 | Complete    | 2026-07-28 |
| 3. Homepage Build | 5/7 | In Progress|  |
| 4. Contact Form & Deployment Hardening | 0/TBD | Not started | - |
| 5. Visual/Motion Polish & Performance Hardening | 0/TBD | Not started | - |
