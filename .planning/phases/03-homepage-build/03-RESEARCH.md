# Phase 3: Homepage Build - Research

**Researched:** 2026-07-30
**Domain:** React single-scroll marketing/portfolio homepage assembly on an existing GSAP/Lenis motion system and file-based content loader
**Confidence:** HIGH (architecture/patterns are directly grounded in this repo's own Phase 1/2 code); MEDIUM (Field Archive motion pattern, résumé conversion — synthesized from web research, no single canonical source); LOW/ASSUMED flagged explicitly where noted

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Section Scope & Structure**
- **D-01:** The homepage builds all 7 IA-locked sections (Hero, Proof Strip, Selected Work, How I Work, Skills & Tools, About, Contact/Footer) plus three additions beyond the locked IA: a persistent nav bar (D-06), a Field Archive placeholder gallery (D-04), and Studio Method's action-words folded into How I Work (D-02). Field Notes (principle cards) and Engage (engagement-model cards) from `Homepage Copy V2.md` are explicitly cut for v1 (D-05).
- **D-02:** How I Work (HOME-05) combines Studio Method's six action-words (listen / align / reduce / design. / prototype / systemize) as a visual/typographic beat alongside "09/Process (Operating Loop)"'s 5-step Loop (Understand→Align→Structure→Design→Transfer) — not two separate process sections.
- **D-03:** Skills & Tools (HOME-06) reuses `Homepage Copy V2.md`'s "04/Operating Stack" 5 capability-area cards (Discovery & Research; UX Strategy & IA; UI Design & Prototyping; Stakeholder & Developer Alignment; Design Systems & Dev Handoff) as its core content — deliberately NOT placed under How I Work, since PROJECT.md explicitly frames How I Work as process, "not services," and this content reads like services.
- **D-04:** Field Archive (horizontal-scroll gallery of research/wireframe fragment captions from "06/Field Archive") is included as an extra homepage section, using the same styled-placeholder-block pattern Phase 2 used for case-study cover images — no real photography exists anywhere in the repo yet.
- **D-05:** Field Notes (6 principle cards) and Engage (3 engagement-model cards) from `Homepage Copy V2.md` are cut entirely for v1 — not built anywhere on the homepage this phase.
- **D-06:** A persistent nav bar (wordmark + anchor links to the homepage sections, per "01/Navigation") is in scope for Phase 3, even though it is not one of the 7 IA-locked sections — standard for a single-scroll portfolio site, helps recruiters jump around.
- **D-07:** The Contact/Brief area (part of HOME-08's Contact/Footer section) builds ONLY the static 3-field form UI — markup, fields, styling, CTA copy ("What are you working on?" / "Reach me at, Email" / "What needs to become clearer?" / "Send the Brief →"). No submission handling, no email delivery, no success/error states. CONT-01 (delivery) and CONT-02 (feedback) are Phase 4's job, wired onto this UI later.

**Selected Work Data & "See More" (HOME-03, HOME-04)**
- **D-08:** Selected Work renders the 6 featured case studies from Phase 2's real content loader (`caseStudies` export in `src/content/case-studies/loader.ts`) — title, slug, summary, cover_image, client. The old "07/Work (Selected Projects)" copy in `Homepage Copy V2.md` describes 5 different, non-matching fictional-sounding projects that do NOT correspond to the real case-study titles/slugs. That old copy is NOT used.
- **D-09:** "See more" (HOME-04) expands the SAME Selected Work grid inline (6 → 11 entries) rather than a separate list below it. The "see more" trigger becomes "see less" (or disappears) once expanded.
- **D-10:** The 5 deferred-slug entries (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus — no content files or routes exist per Phase 2's D-10) render as full-looking cards matching the featured 6's visual style, linking to a coming-soon route/state — not name-only chips, not a 404.
- **D-11 — Cross-phase conflict, explicitly accepted by the user after being flagged:** DEPL-03 (Phase 4 requirement) requires the 5 deferred slugs to be "not linked from any page." D-10's clickable coming-soon cards directly conflict with this until Phase 4 runs. The user was shown this conflict explicitly and chose to accept a temporary window where the 5 deferred slugs ARE linked, rather than shipping non-clickable entries now. **Phase 4's plan MUST remove or guard these links as part of its own DEPL-03 work — this is a required Phase 4 follow-up, not optional cleanup.**

**About & Skills/Tools Content (HOME-06, HOME-07)**
- **D-12:** About (HOME-07) is a condensed 2-4 sentence bio drawn from the Hero's longer statement plus PROJECT.md's Context section — written fresh, not copy-pasted verbatim from either source.
- **D-13:** About includes a headshot/photo placeholder block (reusing Phase 2's `ImagePlaceholder` component pattern) alongside the bio text, even though no real photo exists yet.
- **D-14:** Skills & Tools (HOME-06), beyond the 5 Operating Stack capability cards (D-03), also includes a row of concrete tool chips — aggregated as the distinct values already present across the 6 case-study frontmatter `tags` fields (e.g. Figma, FigJam, UX, UI, Design System, Mobile) rather than a separately curated/invented tool list.

**Résumé & Footer (HOME-08, CONT-04)**
- **D-15:** A real résumé source file exists at the repo root: `Hajra Farhin Resume UX.docx` (11KB, real content). Phase 3 converts this to a PDF and places it at a public path (e.g. `public/resume.pdf`), wiring the footer's résumé link to the real converted file directly.
- **D-16:** Footer content (contact info, LinkedIn/Behance/email links per CONT-04, legal links) follows "12/Footer" from `Homepage Copy V2.md` as-is: email (hazrafarhinwork@gmail.com), phone, location, LinkedIn/Behance/Website under "Elsewhere," Privacy Policy/Terms under "Legal."

### Claude's Discretion
- Exact visual placement/order of the nav bar, Field Archive gallery, and Studio Method action-words relative to the 7 IA-locked sections.
- Exact wording of the condensed About bio (within the "Hero statement + PROJECT.md bio" source constraint from D-12).
- Visual treatment of the "coming soon" state for the 5 deferred-slug routes from D-10.
- Exact tool-chip rendering (pills, inline list, icons) for D-14.
- Exact `.docx`→PDF conversion method for D-15, as long as résumé content is preserved faithfully.
- Internal component/file structure for all new homepage sections.

### Deferred Ideas (OUT OF SCOPE)
- **Field Notes (6 principle cards) and Engage (3 engagement-model cards)** — cut for v1 (D-05). Could be reconsidered for a future iteration.
- **DEPL-03 link removal for the 5 deferred slugs** — Phase 4 MUST address this as part of its own DEPL-03 work (D-11).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Hero states role, specialization, availability above the fold | Already built in Phase 1 (`src/routes/home.tsx` + `src/content/hero.ts`); this phase only needs to repoint `heroContent.ctaHref` from `#hero` to the real Selected Work section id — see Pitfall 1 |
| HOME-02 | Proof strip with concrete stats (years, industries, regions, outcome) | Content sourced from `Homepage Copy V2.md` §05 Telemetry (~4 years / 8+ industries / 3 regions / 30% reduction) — see Code Examples: content-module pattern |
| HOME-03 | Selected Work grid, first 6 featured case studies, IA order | `caseStudies` from `src/content/case-studies/loader.ts` is already sorted by `order` (0-5) and already matches IA order exactly — verified directly against all 6 `.md` files' frontmatter (see Architecture Patterns, Pattern 1) |
| HOME-04 | "See more" reveals remaining 5 case studies | Requires a NEW small data module for the 5 deferred slugs (no `.md` files exist for them) — see Architecture Patterns, Pattern 2 and Pitfall 3 |
| HOME-05 | "How I Work" process section (not "services") | Combine Studio Method action-words + Operating Loop 5-step content per D-02; both are static content-module copy, no new technical pattern needed |
| HOME-06 | Skills & Tools section | Operating Stack 5 cards (static copy) + tool-chip aggregation from case-study data — see Code Examples: tag/tool aggregation, and Pitfall 4 (data-source ambiguity) |
| HOME-07 | Compact About section | Static bio content-module + `ImagePlaceholder` reuse (`size="centerpiece"` or a new size token — see Pitfall 5) |
| HOME-08 | Footer: résumé download, contact info, social links | Résumé: see Architecture Patterns, Pattern 3 (docx→PDF) + Environment Availability. Footer links: reuse `Button`/`Card`/`Typography` primitives, `rel="noopener noreferrer"` on `target="_blank"` links — see Security Domain |
| CONT-04 | Direct email/LinkedIn/Behance links in footer | Same footer component as HOME-08; content sourced from `Homepage Copy V2.md` §12 Footer |
</phase_requirements>

## Summary

Phase 3 is pure composition, not new infrastructure: every technical building block it needs (motion hooks, UI primitives, content-module pattern, reduced-motion-safe GSAP, the case-study loader) already exists and was purpose-built in Phase 1/2 for exactly this moment. The overwhelming majority of this phase is "write 6 more content modules and 7 more section components that look like `src/routes/home.tsx`'s existing Hero" — low technical risk, well-precedented in this codebase.

Three genuinely new technical sub-problems exist, and this research focuses on them. First, the Field Archive horizontal-scroll gallery (D-04): the textbook GSAP pattern for this (`pin: true` + a horizontal tween driven by vertical scroll progress) is a scroll-jacking technique, and this project's own REQUIREMENTS.md explicitly bans "Scroll-jacking / fully hijacked scroll navigation" as an anti-pattern. The recommendation is a **native horizontally-scrollable container** (the user's real mouse/touch/keyboard scrolling, untouched by JS) with a purely decorative, reduced-motion-gated entrance reveal layered on top via the existing `useScrollReveal` pattern — never a page-scroll-driven horizontal tween. Second, the `.docx`→PDF résumé conversion (D-15): no conversion CLI (LibreOffice, pandoc) is installed in this environment, and given this is a one-time asset with no need to re-run on every build, a manual export (Word/Google Docs) into `public/resume.pdf` is the correct low-maintenance choice — not a new build-time npm dependency. Third, the coming-soon route for the 5 deferred case-study slugs (D-10/D-11): React Router ranks routes by specificity independent of declaration order, so adding 5 literal `case-study/<slug>` routes rendering a new, isolated `ComingSoonRoute` component will always outrank the existing generic `case-study/:slug` route for those exact URLs — giving Phase 4 one clearly delimited block to delete or guard, without touching Phase 2's `case-study.tsx`.

**Primary recommendation:** Build every new section as a `Section` component composed from the existing `Button`/`Card`/`Typography` primitives and a dedicated content module (mirroring `src/content/hero.ts`), wired into `useScrollReveal`; implement Field Archive as a native `overflow-x-auto` scroller (no scroll-jacking); convert the résumé manually and commit the PDF directly; and isolate the 5 deferred-slug routes as literal, easily-deletable route entries pointing at a brand-new `ComingSoonRoute` component.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Homepage section rendering (Hero, Proof Strip, Selected Work, How I Work, Skills & Tools, About, Footer) | Browser / Client | — | Fully static SPA, client-rendered React; no server tier exists in this project |
| Selected Work data sourcing | Browser / Client (build-time inlined) | — | `import.meta.glob({ eager: true })` inlines all `.md` content into the client bundle at build time; there is no runtime data-fetch tier |
| Coming-soon route for deferred slugs | Browser / Client (React Router) | — | Client-side route matching only; no server-side redirect/rewrite tier exists yet (that's Phase 4's DEPL-02 SPA-rewrite concern) |
| Résumé download | CDN / Static | — | A static asset served from `public/`, no processing at request time |
| Reduced-motion / scroll-reveal | Browser / Client | — | `MotionProvider`/`useScrollReveal` already own this; new sections only consume, never reimplement |
| Contact form UI (this phase only — no submission) | Browser / Client | — | D-07 explicitly scopes this phase to markup/styling only; CONT-01/02 (Phase 4) will add the actual submission tier (likely a form-service API or serverless function, per STATE.md's Formspree/Resend open question) |

## Standard Stack

### Core

No new packages are required for this phase. Every dependency needed already exists in `package.json` [VERIFIED: package.json]:

| Library | Version (installed) | Purpose | Why Standard (for this phase) |
|---------|---------|---------|--------------|
| `gsap` | 3.15.0 | Scroll-reveal entrance animation, Field Archive's decorative reveal | Already the project's sole animation engine (Phase 1); `useScrollReveal` wraps it |
| `@gsap/react` | 2.1.2 | `useGSAP()` — StrictMode-safe animation lifecycle | Already required by `useScrollReveal`; do not hand-roll a new `useEffect`+`gsap.context()` pattern |
| `lenis` | 1.3.25 | Smooth-scroll wrapper, driven by `MotionProvider` | Already wired at app root; new sections need zero new Lenis config |
| `react-router` | 8.3.0 | Route tree, incl. new coming-soon routes for deferred slugs | Already the project's router; data-mode `createBrowserRouter` already in `src/router.tsx` |
| `zod` | 4.4.3 | N/A this phase directly, but the `CaseStudyFrontmatterSchema` pattern it enables is what Selected Work consumes | Already validates all Selected Work source data |
| `lucide-react` | 1.26.0 | Icons (e.g. an external-link glyph on footer/social links) | Already used by `ImagePlaceholder` (`ImageOff` icon) |
| `tailwindcss` (`@tailwindcss/vite`) | 4.3.3 | All layout/styling | Already the project's only styling system; custom tokens in `src/index.css` `@theme` block |

### Supporting

None needed. `js-yaml`, `react-markdown` (Phase 2's content parsing) are not touched by this phase.

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Native `overflow-x-auto` for Field Archive | A carousel library (`embla-carousel-react`, `swiper`) | Unnecessary dependency for 6 static caption cards with no autoplay/pagination/dots requirement; native CSS scroll-snap + the existing `useScrollReveal` covers the actual requirement with zero new deps |
| Manual `.docx`→PDF conversion | A build-time npm conversion package (`libreoffice-convert`, `docx-pdf`, `mammoth`+headless-Chrome) | These require an external LibreOffice/Chromium binary (not installed in this dev environment — see Environment Availability), and are designed for content that changes on every build; a résumé is a one-time asset |
| Literal deferred-slug routes in `router.tsx` | A wildcard/regex route matching all 5 deferred slugs at once | React Router's dynamic-segment matching doesn't support "match only these 5 literal strings" in one segment cleanly; 5 explicit literal routes are simpler to find-and-delete for Phase 4 (D-11) than a conditional inside the existing generic route |

**Installation:** None — no `npm install` needed this phase.

**Version verification:** All versions above are read directly from this repo's own `package.json` (already installed and building today), not from the npm registry — no staleness risk since nothing is being upgraded.

## Package Legitimacy Audit

**Not applicable this phase.** No new external packages are introduced. All functionality needed (motion, routing, styling, icons) is served by dependencies already installed and already verified/in-use since Phase 1/2. The Package Legitimacy Gate protocol is skipped per its own trigger condition ("whenever this phase installs external packages").

## Architecture Patterns

### System Architecture Diagram

```
Browser request for "/"
        │
        ▼
router.tsx (createBrowserRouter, data mode)
        │  matches index route
        ▼
App.tsx (<Outlet/>)
        │
        ▼
routes/home.tsx  ──────────────────────────────────────────────┐
        │                                                       │
        │  renders sibling <section> blocks in IA order:        │
        ▼                                                       │
  [Nav (persistent, D-06)]                                      │
        │                                                        │
        ▼                                                        │
  <section id="hero">          ← content/hero.ts (existing)      │
        ▼                                                        │
  <section id="proof-strip">   ← content/proof-strip.ts (new)    │
        ▼                                                        │
  <section id="selected-work"> ← content/case-studies/loader.ts  │
        │        (real 6, sorted by `order`)                     │
        │      + content/case-studies/deferred.ts (new, 5 stub   │
        │        descriptors) — "see more" toggles local state   │
        │        to reveal these 5 in the SAME grid               │
        ▼                                                        │
  <section id="field-archive">  ← content/field-archive.ts (new) │
        │   native overflow-x-auto row, decorative reveal only    │
        ▼                                                        │
  <section id="how-i-work">     ← content/how-i-work.ts (new)    │
        ▼                                                        │
  <section id="skills-tools">   ← content/skills-tools.ts (new)  │
        │        + aggregated tags/tools from                    │
        │          content/case-studies/loader.ts's caseStudies  │
        ▼                                                        │
  <section id="about">          ← content/about.ts (new)         │
        │      + ImagePlaceholder (headshot)                     │
        ▼                                                        │
  <section id="contact-footer"> ← content/footer.ts (new)        │
        │      résumé <a href="/resume.pdf" download>            │
        │      + static 3-field form (no submit handler, D-07)   │
        └───────────────────────────────────────────────────────┘

Separately, clicking a deferred-slug card navigates to:
  /case-study/riyaah  (etc.)
        │
        ▼
router.tsx: literal route (outranks case-study/:slug per React
Router's specificity-based ranking [CITED: reactrouter.com]) 
        ▼
  routes/coming-soon.tsx (new) — renders "coming soon" copy,
  distinct from routes/not-found.tsx and CaseStudyPage's own
  "Case study not found" fallback (both untouched, Phase 2's)
```

### Recommended Project Structure

```
src/
├── content/
│   ├── hero.ts                    # existing (Phase 1) — repoint ctaHref (Pitfall 1)
│   ├── proof-strip.ts             # new — HOME-02 stats
│   ├── field-archive.ts           # new — HOME-04's D-04 caption set
│   ├── how-i-work.ts              # new — HOME-05 (Studio Method + Operating Loop)
│   ├── skills-tools.ts            # new — HOME-06 Operating Stack cards (tool chips computed, not stored)
│   ├── about.ts                   # new — HOME-07 bio
│   ├── footer.ts                  # new — HOME-08/CONT-04 footer content
│   ├── nav.ts                     # new — D-06 nav links
│   └── case-studies/
│       ├── loader.ts              # existing (Phase 2) — untouched
│       ├── deferred.ts            # new — HOME-04/D-10 the 5 deferred-slug display stubs
│       └── ...                    # existing .md + parse/schema — untouched
├── components/
│   ├── home/                      # new folder — one component per new section
│   │   ├── Nav.tsx
│   │   ├── ProofStrip.tsx
│   │   ├── SelectedWork.tsx       # consumes loader.ts + deferred.ts, owns "see more" state
│   │   ├── FieldArchive.tsx       # native horizontal scroller
│   │   ├── HowIWork.tsx
│   │   ├── SkillsTools.tsx
│   │   ├── About.tsx
│   │   └── Footer.tsx
│   ├── ui/                        # existing (Phase 1) — Button/Card/Typography, untouched
│   └── case-study/                # existing (Phase 2) — ImagePlaceholder reused, untouched
├── routes/
│   ├── home.tsx                   # existing — gains sibling section imports
│   ├── coming-soon.tsx            # new — D-10 coming-soon route element
│   ├── case-study.tsx             # existing (Phase 2) — untouched
│   └── not-found.tsx              # existing — untouched
└── router.tsx                     # existing — gains 5 literal deferred-slug routes (Pitfall 3, D-11)
```

### Pattern 1: Content-as-Data-Module (established Phase 1, extend verbatim)

**What:** Every section's copy lives in a typed `.ts` object/array in `src/content/`, imported by a dumb rendering component — never hardcoded JSX strings.
**When to use:** Every new section this phase (Proof Strip, Field Archive, How I Work, Skills & Tools, About, Footer, Nav).
**Example (existing precedent, `src/content/hero.ts`):**
```typescript
// Source: src/content/hero.ts (this repo, Phase 1)
export interface HeroContent {
  eyebrow: string;
  statement: string;
  ctaLabel: string;
  ctaHref: string;
  metaDescription: string;
  metaStatus: string;
}

export const heroContent: HeroContent = {
  eyebrow: 'Hazra Farhin · UX/UI Designer',
  // ...
  ctaHref: '#hero', // Phase 3 must repoint this to '#selected-work' — see Pitfall 1
};
```
Every new content module should follow this same `export interface X` + `export const xContent: X = {...}` shape so the pattern stays uniform across all 8 sections.

### Pattern 2: Selected Work — real 6 + deferred 5, one grid, local "see more" state

**What:** `SelectedWork.tsx` imports `caseStudies` from the real loader (already IA-ordered, verified against frontmatter `order` 0-5 = cad/verzion/tata-capital/mashreq/astrosure/adreport exactly) and a small new `deferredCaseStudies` array for the other 5. `useState` toggles whether the deferred 5 are appended to the rendered grid.
**When to use:** HOME-03/HOME-04.
**Example:**
```typescript
// src/content/case-studies/deferred.ts (new)
// No .md files exist for these 5 (Phase 2 D-10) -- there is no real title,
// client, or summary data anywhere in the repo for them. Minimal display
// stubs, humanized from the slug itself (see Pitfall 3 for why this is
// flagged as an assumption, not a verified content decision).
export interface DeferredCaseStudy {
  slug: string;
  title: string;
}

export const deferredCaseStudies: DeferredCaseStudy[] = [
  { slug: 'riyaah', title: 'Riyaah' },
  { slug: 'icici-bank-atm-kiosk', title: 'ICICI Bank ATM Kiosk' },
  { slug: 'ambit', title: 'Ambit' },
  { slug: 'northernarc', title: 'NorthernArc' },
  { slug: 'citrus', title: 'Citrus' },
];
```
```tsx
// components/home/SelectedWork.tsx (sketch)
import { useState } from 'react';
import { caseStudies } from '../../content/case-studies/loader';
import { deferredCaseStudies } from '../../content/case-studies/deferred';

export function SelectedWork() {
  const [expanded, setExpanded] = useState(false);
  return (
    <section id="selected-work">
      <div className="grid ...">
        {caseStudies.map((cs) => <CaseStudyCard key={cs.slug} {...cs} />)}
        {expanded &&
          deferredCaseStudies.map((cs) => (
            <ComingSoonCard key={cs.slug} slug={cs.slug} title={cs.title} />
          ))}
      </div>
      <Button variant="ghost" onClick={() => setExpanded((e) => !e)}>
        {expanded ? 'See less' : 'See more'}
      </Button>
    </section>
  );
}
```

### Pattern 3: Résumé as a static build artifact, not a build-time transform

**What:** Convert `Hajra Farhin Resume UX.docx` to PDF once, by hand (Word "Save As PDF"/"Export" — avoid File→Print→Save as PDF, which rasterizes text [CITED: general DOCX-to-PDF conversion guidance]), and commit the output directly to `public/resume.pdf`. Vite serves everything under `public/` at the site root unmodified (same mechanism already serving `public/favicon.svg`), so `/resume.pdf` resolves with zero config.
**When to use:** D-15/HOME-08/CONT-03 (CONT-03 becomes a Phase-4 verification-only task once this ships).
**Example:**
```tsx
// components/home/Footer.tsx (sketch)
<Button href="/resume.pdf" download rel="noopener noreferrer">
  Download Résumé
</Button>
```

### Pattern 4: Field Archive — native scroll, decorative reveal only (NOT scroll-jacking)

**What:** A horizontally-scrollable row (`overflow-x-auto`, CSS `scroll-snap-type: x proximity`, `tabIndex={0}` + `role="region"` + `aria-label`) holding `ImagePlaceholder`-style caption cards. The *only* GSAP involvement is the section's own entrance reveal via the existing `useScrollReveal(ref)` (fade/rise on scroll into view) — never a scroll-position-linked horizontal tween. This is a deliberate divergence from the textbook GSAP "pin + horizontal scrub" tutorial pattern (see Common Pitfalls).
**When to use:** D-04 (Field Archive).
**Example:**
```tsx
// components/home/FieldArchive.tsx (sketch)
import { useRef } from 'react';
import { useScrollReveal } from '../../motion/useScrollReveal';
import { ImagePlaceholder } from '../case-study/ImagePlaceholder';
import { fieldArchiveContent } from '../../content/field-archive';

export function FieldArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef); // decorative fade-in only, not scroll-linked horizontal motion

  return (
    <section id="field-archive" ref={sectionRef}>
      <div
        className="flex gap-md overflow-x-auto snap-x snap-proximity"
        role="region"
        aria-label="Field Archive gallery"
        tabIndex={0}
      >
        {fieldArchiveContent.captions.map((caption) => (
          <div key={caption} className="snap-start shrink-0">
            <ImagePlaceholder caption={caption} size="stage" />
          </div>
        ))}
      </div>
    </section>
  );
}
```

### Pattern 5: Coming-soon route via literal, specificity-ranked routes

**What:** Add 5 literal path entries to `router.tsx`'s `children` array, each rendering a new `ComingSoonRoute` component. React Router's data-mode router ranks static path segments above dynamic ones regardless of array order [CITED: reactrouter.com], so `case-study/riyaah` will always be matched over `case-study/:slug` for that exact URL — no ordering gymnastics needed.
**When to use:** D-10 (5 deferred slugs must not hit the generic 404/"not found" fallback).
**Example:**
```tsx
// router.tsx (sketch — additions marked)
import ComingSoonRoute from './routes/coming-soon';
// D-11: Phase 4 MUST delete/guard this whole block as part of its own
// DEPL-03 work (deferred slugs must not be publicly linked/indexed).
const DEFERRED_SLUG_ROUTES = ['riyaah', 'icici-bank-atm-kiosk', 'ambit', 'northernarc', 'citrus']
  .map((slug) => ({ path: `case-study/${slug}`, element: <ComingSoonRoute slug={slug} /> }));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      ...DEFERRED_SLUG_ROUTES, // D-11 marker — Phase 4 deletes this line + import
      { path: 'case-study/:slug', element: <CaseStudyPage /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]);
```

### Anti-Patterns to Avoid

- **Scroll-jacking the Field Archive:** The common GSAP tutorial pattern for "horizontal scroll gallery" pins the section (`pin: true`) and drives horizontal position from vertical scroll progress via `ScrollTrigger`'s `containerAnimation` [CITED: gsap.com]. This project's own REQUIREMENTS.md explicitly lists "Scroll-jacking / fully hijacked scroll navigation" as an anti-pattern ("breaks native scroll semantics, keyboard nav, and screen-reader scroll"). Do not implement Field Archive this way — see Pattern 4.
- **Hardcoding copy inline in JSX:** PROJECT.md and every prior phase treat `Homepage Copy V2.md` as an explicit rough draft expected to be rewritten. Every section must source its copy from a `content/*.ts` module (Pattern 1), never a literal string in the component.
- **Reimplementing reduced-motion checks:** Every new animated element must consume `useScrollReveal`/`usePrefersReducedMotionContext` — never a new `matchMedia` call (already centralized in `usePrefersReducedMotion.ts`).
- **Modifying Phase 2's `case-study.tsx`/`loader.ts` to special-case deferred slugs:** Keep the deferred-slug handling entirely in new files (Pattern 5) so Phase 2's already-tested, already-committed content layer stays untouched and Phase 4's D-11 cleanup has one obvious, isolated block to remove.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Reduced-motion detection | A new `window.matchMedia('(prefers-reduced-motion: reduce)')` listener per section | `usePrefersReducedMotionContext()` / `useScrollReveal()` | Already centralized in `MotionProvider`; duplicating it risks a second listener drifting out of sync with the app-wide Lenis/ScrollTrigger gating |
| GSAP animation cleanup on unmount | A hand-rolled `useEffect` + manual `.kill()`/`gsap.context()` | `@gsap/react`'s `useGSAP()` (already the basis of `useScrollReveal`) | `useGSAP` handles React 19 StrictMode's dev-only double-mount correctly; a hand-rolled effect is a known source of orphaned `ScrollTrigger` instances (already solved once in Phase 1, don't re-solve it) |
| Selected Work data / ordering | A hardcoded array of 6 project objects in `SelectedWork.tsx` | `caseStudies` from `src/content/case-studies/loader.ts` | Explicitly locked by D-08/CASE-04; the loader already sorts by `order` and isolates per-file parse failures — a hardcoded array reintroduces a maintenance duplicate of data that already exists |
| Distinct tag/tool aggregation | Manually re-typing a curated tool list | Compute `[...new Set(caseStudies.flatMap((cs) => cs.tags))]` (or the equivalent over `sections.toolsUsed`, see Pitfall 4) at module load | Keeps Skills & Tools honest to real project data (per D-14's intent) instead of an invented list that silently drifts from the case studies as they're edited |

**Key insight:** This phase's biggest hand-roll risk isn't a missing library — it's reimplementing something Phase 1/2 already solved (motion cleanup, content-module pattern, data loading) instead of composing it. Everything genuinely new (Field Archive, deferred routes, résumé) is small enough that a dedicated library would be over-engineering.

## Common Pitfalls

### Pitfall 1: Forgetting to repoint `heroContent.ctaHref`
**What goes wrong:** The Hero's primary CTA (`View Selected Work →`) still points at `#hero` (a Phase-1-only placeholder, per that file's own comment), so clicking it does nothing once Selected Work exists.
**Why it happens:** `hero.ts` is Phase 1's file; it's easy to treat as "done" and not revisit while building new sections.
**How to avoid:** Update `heroContent.ctaHref` to `'#selected-work'` (or whatever id `SelectedWork`'s root `<section>` uses) as an explicit task, and update/extend `home.test.tsx`'s existing assertion `expect(heroContent.ctaHref).toBe('#hero')` (currently hardcoded in the test itself — it will need to change to the new value).
**Warning signs:** `home.test.tsx`'s existing hero test still asserts `ctaHref === '#hero'` after this phase ships — that's a signal the repoint didn't happen or the test wasn't updated to match.

### Pitfall 2: Building Field Archive as a scroll-jacked pin instead of a native scroller
**What goes wrong:** Copying GSAP's popular "horizontal scroll gallery" tutorial pattern (`pin: true` + `ScrollTrigger.containerAnimation`) technically satisfies "looks like Axisform" but breaks native scroll/keyboard/screen-reader behavior during the pinned segment — directly violating REQUIREMENTS.md's explicit anti-pattern ban.
**Why it happens:** It's the first pattern that appears in nearly every GSAP horizontal-scroll tutorial and forum thread [CITED: gsap.com forums], so it's the "obvious" answer if researched superficially.
**How to avoid:** Use Pattern 4 (native `overflow-x-auto` + decorative-only `useScrollReveal`). Note that Axisform's own reference implementation for this exact section (`archive-gallery`, `Templates/Axisform/Axisform Studio Landing Page.html:550,1046-1063`) also does NOT pin the gallery — it only applies a subtle `xPercent: -18` scrub-driven parallax shift to cards that are already wider than the viewport, while the page itself keeps scrolling natively. Even the visual reference this project is modeled on avoids true scroll-jacking here.
**Warning signs:** Any `ScrollTrigger` config for this section includes `pin: true`, or the section's height is set to something larger than its content specifically to create "scroll runway" for a horizontal tween.

### Pitfall 3: No real display data exists for the 5 deferred case studies
**What goes wrong:** `getCaseStudyBySlug('riyaah')` returns `undefined` today (confirmed directly in `loader.ts`/`parse.ts` — there is no `riyaah.md` etc.), and neither `Information Architecture.md` nor `PROJECT.md` nor `Homepage Copy V2.md` contain any title, client, or summary text for these 5 slugs anywhere in the repo — only the bare slug strings. D-10 requires "full-looking cards," so something has to be displayed.
**Why it happens:** The 5 deferred slugs were locked into scope (rollout order) before any content was written for them (explicitly deferred to v2 per REQUIREMENTS.md CASE-V2-01).
**How to avoid:** Use a small, clearly-labeled stub data module (Pattern 2's `deferred.ts`) with humanized titles derived from the slug (e.g. `icici-bank-atm-kiosk` → "ICICI Bank ATM Kiosk"). **This humanization is `[ASSUMED]`** — it is Claude's/the planner's invention, not sourced content, and should be flagged to the user as a display-copy decision made under discretion, not verified fact.
**Warning signs:** A "coming soon" card that says only the raw slug (`riyaah`) with no humanization, or one that fabricates a client/industry/summary not present anywhere in the repo (overstepping past "title only").

### Pitfall 4: D-14's "tags" instruction and its own example don't agree
**What goes wrong:** D-14 says to aggregate tool chips from "the distinct values already present across the 6 case-study frontmatter `tags` fields," and gives the example "(e.g. Figma, FigJam, UX, UI, Design System, Mobile)." But directly reading all 6 `.md` files' frontmatter: the actual `tags` arrays contain **UX, UI, InsurTech, Dashboard, Banking, Mobile, Design System, Enterprise, Cloud, AI Interface** (10 distinct values, read across `discipline/industry`-shaped labels) — `Figma` and `FigJam` do **not** appear in any `tags` array. Those two names only appear inside each file's unstructured `## Tools Used` Markdown body (a bullet list, not a schema field): distinct values there are **Figma, FigJam, Maze, Notion, Zeroheight, ProtoPie, Miro** (7 distinct tools).
**Why it happens:** The CONTEXT.md example was likely written from a mental image of "what a tools list should contain" rather than checked against the actual frontmatter, since `tags` reads more like industries/disciplines than software tools.
**How to avoid:** This is flagged as an **Open Question** below rather than silently resolved — the planner/discuss-phase should confirm with the user which source is intended: (a) the literal `tags` field as D-14's text specifies (10 discipline/industry values, no schema change needed), or (b) parsing `sections.toolsUsed`'s bullet list as D-14's *example* implies (7 real tool names, but requires writing a small unstructured-text parser against Markdown body content that Phase 2 never designed to be machine-read outside its own component). Both are technically feasible; this research does not pick one, since it is a content-intent decision, not a technical one.
**Warning signs:** Skills & Tools ships showing "InsurTech, Dashboard, Banking" as if they were tool names, or ships silently parsing Markdown bullets in a way that breaks the moment someone edits a case study's Tools Used copy.

### Pitfall 5: `ImagePlaceholder`'s existing size tokens don't include an About-headshot shape
**What goes wrong:** `ImagePlaceholder`'s `ImagePlaceholderSize` union is `'banner' | 'stage' | 'centerpiece'`, each with a fixed aspect ratio tuned for case-study page layouts (21:9 banner, video stage, 4:3 centerpiece). None of these is an obvious fit for a compact portrait-oriented About headshot.
**Why it happens:** Phase 2 built this component/type union scoped to case-study page needs only, before About existed.
**How to avoid:** Either (a) reuse `centerpiece` at a smaller rendered size via a wrapping `className` override (no component change), or (b) extend `ImagePlaceholderSize` with a new token (e.g. `'portrait'`, aspect `3/4` or `1/1`) — a one-line, backward-compatible addition to the existing union and `sizeClasses` map. Prefer (b) if the headshot's visual weight needs to differ meaningfully from `centerpiece`; it's a small, additive, non-breaking change to a Phase 2 file.
**Warning signs:** A separate, one-off placeholder component built just for the headshot instead of extending the existing shared one — this would be the exact "custom one-off solution" the Don't Hand-Roll philosophy warns against, for a problem `ImagePlaceholder` already solves.

### Pitfall 6: Persistent nav bar anchor links break off the homepage
**What goes wrong:** If the Nav bar (D-06) is mounted at the shared `App.tsx` root layout level so it also appears on `/case-study/:slug` pages, its anchor links (`href="#selected-work"` etc.) will silently fail to scroll anywhere when the current route isn't `/` — in-page hash anchors only work relative to the currently rendered document.
**Why it happens:** "Persistent" in D-06's wording could be read as "persists across all routes," but the actual content it links to (`#hero`, `#selected-work`, etc.) only exists inside `home.tsx`.
**How to avoid:** Per this phase's boundary ("It does not... do final visual/motion/performance polish" and scope is homepage assembly), mount the Nav component inside `home.tsx` only (scoped to the homepage), using plain `#id` hrefs consistent with the existing `heroContent.ctaHref` precedent. If cross-page nav (e.g. visible from a case-study page too) is wanted, that's a follow-on decision outside this phase's locked scope — flag it rather than silently building `to="/#selected-work"`-style cross-route links this phase.
**Warning signs:** Nav component imported into `App.tsx` instead of `home.tsx`, or nav links using `to="/#..."` (React Router `Link`) instead of plain `href="#..."` without an explicit decision to support cross-page navigation.

## Code Examples

### Tag aggregation for Skills & Tools (if D-14's literal `tags`-field reading is confirmed — see Pitfall 4)
```typescript
// Source: derived directly from this repo's src/content/case-studies/*.md
// frontmatter (verified via grep against all 6 files, 2026-07-30)
import { caseStudies } from '../content/case-studies/loader';

export const skillTags: string[] = [...new Set(caseStudies.flatMap((cs) => cs.tags))];
// => ['UX', 'UI', 'Design System', 'Enterprise', 'Cloud', 'AI Interface',
//     'Banking', 'Mobile', 'InsurTech', 'Dashboard']  (exact set/order will
// vary slightly with Set iteration order over the loader's `order`-sorted
// array -- sort alphabetically before rendering if a stable display order matters)
```

### Slug humanization helper (for deferred-slug card titles, Pitfall 3)
```typescript
// Example humanization -- NOT sourced from any repo content, [ASSUMED] display copy
function humanizeSlug(slug: string): string {
  const KNOWN_ACRONYMS = new Set(['icici', 'atm']); // preserve casing for these tokens
  return slug
    .split('-')
    .map((word) => (KNOWN_ACRONYMS.has(word) ? word.toUpperCase() : word[0].toUpperCase() + word.slice(1)))
    .join(' ');
}
// humanizeSlug('icici-bank-atm-kiosk') -> 'ICICI Bank ATM Kiosk'
// humanizeSlug('northernarc')          -> 'Northernarc' (single-token slugs won't
//   auto-capitalize brand-correctly -- 'NorthernArc'/'Citrus'/'Ambit'/'Riyaah'
//   need a manual override rather than relying on this function for every slug)
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| GSAP `ScrollTrigger` + a hand-rolled `useEffect`/`gsap.context()` for React lifecycle | `@gsap/react`'s `useGSAP()` hook | Already adopted in this repo since Phase 1 | No action needed this phase — just keep consuming `useScrollReveal`, don't regress to the old pattern for Field Archive |
| Pinned/scroll-jacked horizontal galleries as the default GSAP tutorial answer | Native `overflow-x` scroll containers with optional decorative (non-scroll-linked) reveal, for accessibility-conscious sites | Ongoing industry shift, not a version bump — reflected in this project's own explicit anti-pattern list | Directly shapes Pattern 4/Pitfall 2 above |

**Deprecated/outdated:** Nothing version-specific to flag; all installed dependencies (`gsap` 3.15.0, `react-router` 8.3.0, `react` 19.2.8) are current and already in place, not being upgraded this phase.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Humanized titles for the 5 deferred case-study cards (e.g. "ICICI Bank ATM Kiosk") are acceptable placeholder display copy | Pattern 2 / Pitfall 3 / Code Examples | Low-medium: purely cosmetic, easy to edit later in one file (`deferred.ts`), but could read as more "finished" than intended for content that's explicitly deferred to v2 |
| A2 | Nav bar should be scoped to `home.tsx` only, not the shared `App.tsx` layout | Pitfall 6 | Medium: if the user actually wants nav visible on case-study pages too, this under-scopes the phase and Phase 4/5 would need to retrofit it |
| A3 | Manual (human, one-time) `.docx`→PDF conversion is the right call over a build-time npm tool | Pattern 3 / Alternatives Considered | Low: reversible — if résumé content changes frequently in the future, a build-time tool could be added later without any rework of the footer's link, which stays a static `/resume.pdf` path either way |
| A4 | The `Overview.tsx`-style "hardcoded literal JSX sequence, never `.map()` over section descriptors" convention (fixed document order guaranteed regardless of source iteration order) should extend to new homepage sections too | Recommended Project Structure | Low: stylistic consistency only; deviating wouldn't break functionality, just diverge from the established Phase 1/2 code convention |

**If empty:** Not applicable — see table above; A1-A4 all need eyes before being treated as locked.

## Open Questions

1. **Which data source does D-14's Skills & Tools tool-chip aggregation actually mean: the frontmatter `tags` field, or the unstructured `Tools Used` body content?**
   - What we know: D-14's locked text says "frontmatter `tags` fields" (unambiguous field name); D-14's own parenthetical example ("Figma, FigJam, UX, UI, Design System, Mobile") mixes values that only exist in `tags` (UX, UI, Design System) with values that only exist in `Tools Used` body text (Figma, FigJam) — the example is internally inconsistent with the field it names.
   - What's unclear: Whether "Figma, FigJam" in the example was a drafting slip, or a signal that `Tools Used` body parsing was actually intended over the literal frontmatter field.
   - Recommendation: Confirm with the user before planning locks this. If confirmed as literal `tags`, no new parsing code is needed (Code Examples above is ready to use as-is). If confirmed as `Tools Used` body parsing, a small, explicitly-scoped Markdown-bullet extractor needs to be planned as its own task (higher complexity, more fragile to future case-study edits).

2. **Should the persistent nav bar (D-06) appear on the case-study route (`/case-study/:slug`) as well as the homepage?**
   - What we know: D-06 calls it "persistent," and the phrase "helps recruiters jump around" implies value beyond the homepage; but this phase's boundary explicitly scopes to homepage assembly, and CONTEXT.md's canonical refs only mention `home.tsx` as the nav's home, not `App.tsx`.
   - What's unclear: Whether "persistent" means "always visible while scrolling the homepage" (a sticky/fixed nav within one page — this research's assumption, A2) vs. "visible on every route in the site."
   - Recommendation: Default to homepage-only (A2) per the stated phase boundary; if the user wants it on case-study pages too, that's a clarifiable one-line follow-up (mount in `App.tsx` instead, with `Link to="/#id"` for cross-route anchors) that doesn't change any of the section content built this phase.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Vite build/dev | ✓ | v26.5.0 | — |
| npm | Package management | ✓ | 11.17.0 | — |
| LibreOffice (`soffice`) | Automated `.docx`→PDF conversion (an alternative to manual conversion) | ✗ | — | Manual conversion via Microsoft Word "Save As/Export PDF" or Google Docs upload+"Download as PDF" (Pattern 3) — no CLI dependency needed for a one-time asset |
| `pandoc` | Alternative automated conversion path | ✗ | — | Same fallback as above |

**Missing dependencies with no fallback:** None.

**Missing dependencies with fallback:** LibreOffice/pandoc are unavailable in this dev environment but have a viable, lower-effort fallback (manual conversion) that this research recommends as the primary approach anyway (Pattern 3) — not merely a fallback of necessity.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.10 + @testing-library/react 16.3.2 + jsdom 29.1.1 |
| Config file | `vite.config.ts` (`test: {...}` block) |
| Quick run command | `npm run test -- src/routes/home.test.tsx` (or the specific new component test file) |
| Full suite command | `npm run test` (`vitest run`) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| HOME-01 | Hero CTA points at the real Selected Work section id | unit | `npm run test -- src/routes/home.test.tsx` | ❌ Wave 0 — existing test hardcodes `ctaHref === '#hero'`, must be updated to the new target id |
| HOME-02 | Proof strip renders all 4 stats from content module | unit | `npm run test -- src/components/home/ProofStrip.test.tsx` | ❌ Wave 0 |
| HOME-03 | Selected Work renders exactly the 6 real case studies in IA order | unit | `npm run test -- src/components/home/SelectedWork.test.tsx` | ❌ Wave 0 |
| HOME-04 | "See more" toggles the 5 deferred cards into view; toggles back to "see less" | unit (`fireEvent.click`) | `npm run test -- src/components/home/SelectedWork.test.tsx` | ❌ Wave 0 (same file as HOME-03) |
| HOME-05 | How I Work renders both Studio Method words and the 5-step Loop | unit | `npm run test -- src/components/home/HowIWork.test.tsx` | ❌ Wave 0 |
| HOME-06 | Skills & Tools renders the 5 Operating Stack cards + aggregated tool chips (pending Open Question 1's resolution) | unit | `npm run test -- src/components/home/SkillsTools.test.tsx` | ❌ Wave 0 |
| HOME-07 | About renders bio + `ImagePlaceholder` headshot | unit | `npm run test -- src/components/home/About.test.tsx` | ❌ Wave 0 |
| HOME-08 | Footer renders résumé link with correct `href`, and correct download attribute | unit | `npm run test -- src/components/home/Footer.test.tsx` | ❌ Wave 0 |
| CONT-04 | Footer renders working email/LinkedIn/Behance links (`href` correctness, `rel="noopener noreferrer"` on `target="_blank"`) | unit | `npm run test -- src/components/home/Footer.test.tsx` | ❌ Wave 0 (same file as HOME-08) |
| D-10 | Deferred-slug route renders coming-soon copy, not the generic "not found" or 404 | unit | `npm run test -- src/routes/coming-soon.test.tsx` | ❌ Wave 0 |
| D-04 | Field Archive gallery is a native scrollable region (not a `pin`-based `ScrollTrigger`) with `role="region"`/`aria-label` present | unit | `npm run test -- src/components/home/FieldArchive.test.tsx` | ❌ Wave 0 |

### Sampling Rate

- **Per task commit:** targeted `npm run test -- <file>` for the file(s) just touched
- **Per wave merge:** `npm run test` (full suite)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `src/components/home/ProofStrip.test.tsx`, `SelectedWork.test.tsx`, `FieldArchive.test.tsx`, `HowIWork.test.tsx`, `SkillsTools.test.tsx`, `About.test.tsx`, `Footer.test.tsx` — all new, one per new section component
- [ ] `src/routes/coming-soon.test.tsx` — new
- [ ] `src/routes/home.test.tsx` — existing file needs its hardcoded `ctaHref === '#hero'` assertion updated (Pitfall 1), not a net-new file
- [ ] No new shared fixtures/conftest-equivalent needed — this project's existing `src/test/setup.ts` (jsdom `matchMedia` stub) already covers every new test's needs, matching the precedent in `useScrollReveal.test.ts`/`MotionProvider.test.tsx`
- [ ] Framework install: none — Vitest/Testing Library are already installed and configured

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth anywhere in this project |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No access-controlled resources |
| V5 Input Validation | Marginal | The contact form (D-07) is markup-only this phase, no submission handler to validate against; deferred-slug case-study data (Pattern 2) is static, developer-authored content, not user input |
| V6 Cryptography | No | Not applicable — no secrets/crypto in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Reverse tabnabbing via `target="_blank"` external links (footer's LinkedIn/Behance/Website/résumé links) | Tampering / Spoofing | Always pair `target="_blank"` with `rel="noopener noreferrer"`. The existing `Button` component's `...rest` spread already permits passing both attributes through to the rendered `<a>` — this is a discipline requirement on every call site, not a code change to `Button.tsx` itself. `CaseStudyFrontmatterSchema`'s existing `external_link` `.refine()` (restricting to `http://`/`https://` only, rejecting `javascript:` etc.) is the precedent pattern to follow if any new user-influenceable URL is ever introduced — not applicable to this phase's fully static, developer-authored footer links, but worth keeping as the standard should CONT-01 (Phase 4) ever surface a user-supplied URL |
| Open/dangling `.docx` source file committed to a public repo | Information Disclosure (mild) | The source `Hajra Farhin Resume UX.docx` sits untracked at the repo root today; decide explicitly whether to `git add` the source file alongside the derived `public/resume.pdf`, or keep the source local-only and commit only the PDF derivative — either is acceptable since résumé content is intentionally public-facing, but this should be a deliberate choice, not an accidental `git add -A` sweep |

## Sources

### Primary (HIGH confidence)
- This repo's own source files, read directly: `src/routes/home.tsx`, `src/router.tsx`, `src/content/case-studies/loader.ts`, `src/content/case-studies/parse.ts`, `src/content/case-studies/schema.ts`, `src/content/case-studies/*.md` (all 6), `src/components/case-study/ImagePlaceholder.tsx`, `src/components/case-study/Overview.tsx`, `src/motion/useScrollReveal.ts`, `src/motion/MotionProvider.tsx`, `src/components/ui/{Button,Card,Typography}.tsx`, `src/lib/cn.ts`, `src/content/hero.ts`, `src/index.css`, `package.json`, `vite.config.ts`, `src/test/setup.ts`, `src/routes/home.test.tsx`, `src/motion/useScrollReveal.test.ts`, `src/content/case-studies/loader.test.ts`
- `Portfolio-Documentation/Homepage Copy V2.md`, `Portfolio-Documentation/Information Architecture.md` — content/structure source
- `.planning/REQUIREMENTS.md`, `.planning/PROJECT.md`, `.planning/STATE.md`, `.planning/phases/03-homepage-build/03-CONTEXT.md` — locked scope/decisions
- `Templates/Axisform/Axisform Studio Landing Page.html` (lines 340-380, 535-571, 1040-1063) — reference implementation for nav and Field Archive, read directly, confirming Axisform's own Field Archive is NOT pin-based

### Secondary (MEDIUM confidence)
- [React Router routing docs — route ranking](https://reactrouter.com/start/framework/routing) — static-vs-dynamic segment specificity ranking, cross-checked against multiple independent tutorial sources agreeing on the same behavior

### Tertiary (LOW confidence)
- [GSAP ScrollTrigger docs](https://gsap.com/docs/v3/Plugins/ScrollTrigger/) and [GSAP community forum threads on horizontal scroll](https://gsap.com/community/forums/topic/33311-using-gsap-scrolltrigger-for-horizontal-scroll/) — general pattern description (pin + containerAnimation), not cross-verified against an official "accessibility guidance" doc page; the accessibility concern connecting this pattern to scroll-jacking is this research's own synthesis against REQUIREMENTS.md's anti-pattern list, not a claim GSAP's docs make themselves
- General web guidance on DOCX→PDF conversion quality (Word Save As/Export vs. Print-to-PDF rasterization) — mainstream consensus across multiple non-official sources, no single authoritative citation

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new packages, all versions read directly from installed `package.json`
- Architecture: HIGH for patterns grounded in this repo's existing code (content-module pattern, loader reuse, route ranking); MEDIUM for the Field Archive/résumé recommendations, which synthesize general web research against this project's own specific anti-pattern constraints
- Pitfalls: HIGH — Pitfalls 1, 3, 4, 5 are directly verified by reading the actual repo files/content (no case-study data for deferred slugs, D-14's example/field mismatch, `ImagePlaceholder`'s size union); Pitfall 2 combines a MEDIUM-confidence external claim (GSAP's common tutorial pattern) with a HIGH-confidence internal one (REQUIREMENTS.md's explicit anti-pattern ban)

**Research date:** 2026-07-30
**Valid until:** 2026-08-29 (30 days — stable, no fast-moving dependencies; nothing here depends on library version churn since no new packages are introduced)
