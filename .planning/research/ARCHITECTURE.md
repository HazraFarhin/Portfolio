# Architecture Research

**Domain:** React + Tailwind personal portfolio / agency-style site with file-based case-study content
**Researched:** 2026-07-21
**Confidence:** MEDIUM (React/Vite/content-collection patterns and GSAP+Lenis wiring verified against multiple current sources; no project code exists yet to validate against, so this is a recommended structure, not an observed one)

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│                        Presentation Layer (React)                     │
├─────────────┬───────────────┬────────────────────┬────────────────────┤
│ Root Layout │  HomePage      │  CaseStudyPage      │  Section/UI       │
│ (Header,    │  (composes     │  (template driven   │  Primitives       │
│  Footer,    │  homepage      │  by 1 CaseStudy      │  (Button, Card,   │
│  Router     │  sections in   │  object per route)   │  SectionLabel)    │
│  Outlet)    │  fixed order)  │                      │                   │
└──────┬──────┴───────┬───────┴──────────┬───────────┴─────────┬────────┘
       │               │                  │                     │
       │      consumes  │        consumes   │           imported by all
       ▼               ▼                  ▼                     ▼
┌───────────────────────────────────────────────────────────────────────┐
│                     Motion Layer (src/motion/)                        │
│  gsap.config.ts (single plugin registration)                          │
│  SmoothScrollProvider (Lenis + GSAP ticker bridge)                     │
│  useScrollReveal / usePinnedSection hooks (wrap useGSAP)               │
└───────────────────────────────────────────────────────────────────────┘
       ▲                                                     ▲
       │ reads                                                │ reads
┌──────┴──────────────────────┐                 ┌─────────────┴───────────┐
│  Content Layer               │                 │  Routing Layer           │
│  src/content/caseStudies/*.md│                 │  React Router:           │
│  + schema.ts (Zod/TS type)   │                 │   /                      │
│  + index.ts (loader:         │                 │   /case-study/:slug      │
│  getAll / getFeatured /      │                 │  loader reads content    │
│  getBySlug, sorted by order) │                 │  layer by slug           │
└───────────────────────────────┘                 └──────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `Root` layout | Persistent chrome (nav header, footer), mounts `SmoothScrollProvider` once, hosts `<Outlet />` | React Router layout route |
| `HomePage` | Pure composition — stacks section components in IA order, passes homepage copy data down | No animation/content logic of its own |
| Section components (`Hero`, `ProofStrip`, `SelectedWork`, `HowIWork`, `SkillsAndTools`, `About`, `ContactForm`, `Footer`) | Render one homepage block; receive copy as props/imported content object; call shared motion hooks for reveal/parallax | Presentational components + `useScrollReveal(ref)` |
| `CaseStudyCard` | Render one case-study preview (cover image, title, tags, client) inside the `SelectedWork` grid | Pure component, takes a `CaseStudy` (or a slim preview subset) as props |
| `CaseStudyPage` | Template that renders one full case study by composing designed sub-sections from a single typed `CaseStudy` object | Route element; looks up data via loader/hook by `slug` param |
| Case-study sub-sections (`CaseStudyHero`, `OverviewTable`, `ToolsList`, `OutcomeList`, `ChallengeBlock`, `ProcessTimeline`, `SolutionGallery`, `LearningsBlock`, `NextProjectLink`) | Each owns rendering + motion for one template section, matching `Project Page- Template.md` 1:1 | Presentational, typed props sliced from `CaseStudy` |
| Content layer (`src/content/`) | Single source of truth for all case-study data; schema validation; sorting/filtering | Markdown+frontmatter files + a loader module (no CMS, no network) |
| Motion layer (`src/motion/`) | Owns all GSAP/Lenis setup, plugin registration, reduced-motion handling; exposes hooks | Isolated module, imported — never re-implemented — by sections |
| UI primitives (`src/components/ui/`) | Design-token-driven atoms (glass Card, magnetic pill Button, SectionLabel, Container) shared by both homepage sections and case-study sections | Tailwind-class components, no content/animation logic |

## Recommended Project Structure

```
src/
├── content/
│   ├── caseStudies/
│   │   ├── cad.md                     # 1 file = 1 published case study
│   │   ├── verzion-cloud-migration.md
│   │   ├── tata-capital-ai-interface.md
│   │   ├── mashreq.md
│   │   ├── astrosure-ai.md
│   │   ├── adreport-io.md
│   │   └── _template.md               # copy of Project Page- Template.md, kept as scaffold for v2 additions
│   ├── caseStudySchema.ts             # Zod schema + inferred CaseStudy TS type (mirrors Project Page- Template.md fields)
│   ├── caseStudies.ts                 # loader: import.meta.glob + parse + validate + sort; exports getAllCaseStudies/getFeaturedCaseStudies/getCaseStudyBySlug
│   └── homepage.ts                    # homepage copy as data (hero heading, proof-strip logos, how-I-work steps, skills list, about blurb, contact copy) — swappable independent of components
├── motion/
│   ├── gsap.config.ts                 # gsap.registerPlugin(ScrollTrigger) — called exactly once
│   ├── SmoothScrollProvider.tsx        # Lenis + gsap.ticker bridge, prefers-reduced-motion guard
│   ├── useScrollReveal.ts             # shared "fade/slide up on enter viewport" hook (wraps useGSAP)
│   └── usePinnedSection.ts            # shared pin+scrub hook for Hero/Selected-Work-style pinned sections
├── components/
│   └── ui/                            # Button, Card (glass surface), SectionLabel, Container, Pill — design-token driven, no content
├── sections/                          # one file per homepage block: Hero.tsx, ProofStrip.tsx, SelectedWork.tsx, HowIWork.tsx, SkillsAndTools.tsx, About.tsx, ContactForm.tsx, Footer.tsx
├── case-study/                        # CaseStudyPage.tsx + sub-sections: CaseStudyHero, OverviewTable, ToolsList, OutcomeList, ChallengeBlock, ProcessTimeline, SolutionGallery, LearningsBlock, NextProjectLink
├── pages/
│   ├── HomePage.tsx                    # composes sections/* in IA order
│   └── CaseStudyPage.tsx (or re-export from case-study/)
├── layouts/
│   └── RootLayout.tsx                  # Header, Footer, SmoothScrollProvider, <Outlet/>
├── router.tsx                          # React Router route tree: "/" and "/case-study/:slug"
├── lib/
│   └── contact.ts                      # thin wrapper around Formspree/Resend submission — isolates provider choice from ContactForm component
└── styles/
    └── (Tailwind entry, global.css: noise texture, grid veil, base tokens)
```

### Structure Rationale

- **`content/` is isolated from `sections/` and `case-study/`:** components only ever import from `content/caseStudies.ts` or `content/homepage.ts` — never read raw markdown or call `import.meta.glob` themselves. This is the seam that makes "add a case study = add one file" true, and the seam that lets homepage copy be swapped without touching JSX.
- **`motion/` is isolated from every section:** GSAP/Lenis specifics live in one small folder; sections consume 2 hooks (`useScrollReveal`, `usePinnedSection`) instead of importing `gsap`/`ScrollTrigger` directly. This directly answers the "don't leak animation logic into every component" requirement.
- **`case-study/` sub-sections mirror `Project Page- Template.md` sections 1:1** (Overview → OverviewTable, Tools Used → ToolsList, Outcome & Impact → OutcomeList, Challenge → ChallengeBlock, Process → ProcessTimeline, Solution → SolutionGallery, Learnings → LearningsBlock) so the template's fixed schema maps directly onto fixed, individually art-directable components — matching the Axisform reference's heavily bespoke-per-section motion style better than rendering generic parsed-markdown HTML would.
- **`components/ui/` is shared by both homepage and case-study code** — glass cards, pill buttons, and section labels are visual atoms defined once (from Axisform's `colors`/`rounded`/`typography` tokens) and reused everywhere, which is also what keeps the visual language consistent across 11 case-study pages without duplicating card/button styling per page.

## Architectural Patterns

### Pattern 1: File-based content collection via typed frontmatter + loader module

**What:** Each case study is one Markdown file under `src/content/caseStudies/` whose YAML frontmatter carries *all* structured data described in `Project Page- Template.md` (title, slug, client, industry, role, team, timeline, tags, cover_image, tools[], outcome[], challenge[], process[] (stage/title/description/image), solution images[], status, featured, order, external_link). The markdown body is reserved only for genuinely free-form long-form prose (the "Learnings & Reflections" narrative and any pull-quotes) — everything else that needs to render into a *specific, art-directed component* (table, list, timeline, gallery) stays in frontmatter, not in prose-to-be-parsed.

**When to use:** Any time content has a fixed, repeating shape (which this template clearly does — 6 case studies today, 11 eventually, all following the exact same section structure) and the site is heavily art-directed rather than a generic blog.

**Trade-offs:** Slightly more upfront schema design work than "just write Markdown and parse whatever headings appear," but it buys type safety (a missing required field fails validation immediately instead of silently rendering blank), and it keeps every visual section a real, animatable React component instead of `dangerouslySetInnerHTML`'d prose. Con: content authors must respect the frontmatter shape (mitigated by keeping `_template.md` as a copy-paste scaffold, and by Zod validation giving a clear error at dev/build time).

**Example:**
```ts
// content/caseStudySchema.ts
import { z } from "zod";

export const processStageSchema = z.object({
  title: z.string(),
  description: z.string(),
  image: z.string().optional(),
});

export const caseStudySchema = z.object({
  title: z.string(),
  slug: z.string(),
  client: z.string(),
  industry: z.string(),
  role: z.string(),
  team: z.string(),
  timeline: z.string(),
  tags: z.array(z.string()),
  coverImage: z.string(),
  status: z.enum(["Published", "Draft"]),
  featured: z.boolean(),
  order: z.number(),
  externalLink: z.string().url().optional(),
  summary: z.string(),
  tools: z.array(z.string()),
  outcome: z.array(z.string()),
  challenge: z.array(z.string()),
  process: z.array(processStageSchema),
  solutionImages: z.array(z.string()),
  learnings: z.string(), // markdown body, parsed to HTML at render time
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
```

```ts
// content/caseStudies.ts
import matter from "gray-matter";
import { caseStudySchema, type CaseStudy } from "./caseStudySchema";

const files = import.meta.glob("./caseStudies/*.md", { eager: true, query: "?raw", import: "default" }) as Record<string, string>;

const all: CaseStudy[] = Object.values(files)
  .map((raw) => {
    const { data, content } = matter(raw);
    return caseStudySchema.parse({ ...data, learnings: content });
  })
  .filter((cs) => cs.status === "Published")
  .sort((a, b) => a.order - b.order);

export const getAllCaseStudies = () => all;
export const getFeaturedCaseStudies = () => all.filter((cs) => cs.featured);
export const getCaseStudyBySlug = (slug: string) => all.find((cs) => cs.slug === slug);
```

### Pattern 2: Data-driven "first 6 / see more" — no hardcoded slug lists in JSX

**What:** `SelectedWork` never hardcodes `["cad", "verzion-cloud-migration", ...]`. It calls `getFeaturedCaseStudies()` for the initial grid and `getAllCaseStudies().filter(cs => !cs.featured)` for the "see more" reveal. The current 6-vs-5 split from `Information Architecture.md` is expressed as `featured: true/false` + `order: n` in each file's frontmatter, not as an array literal in a component.

**When to use:** Any homepage "top N of a growing collection" pattern — this is exactly what lets the 6→11 case-study growth (and any future reordering/promotion) be a content-only change.

**Trade-offs:** Requires discipline to keep `order`/`featured` accurate per file, but the alternative (hardcoded slug array in `SelectedWork.tsx`) recreates a second source of truth that has to be kept in sync with the content folder — a classic drift risk.

**Example:**
```tsx
// sections/SelectedWork.tsx
import { getFeaturedCaseStudies, getAllCaseStudies } from "@/content/caseStudies";

export function SelectedWork() {
  const featured = getFeaturedCaseStudies();          // homepage grid, in `order`
  const rest = getAllCaseStudies().filter(cs => !cs.featured); // behind "see more"
  const [expanded, setExpanded] = useState(false);

  return (
    <section>
      <CaseStudyGrid items={featured} />
      {expanded && <CaseStudyGrid items={rest} />}
      {!expanded && rest.length > 0 && (
        <button onClick={() => setExpanded(true)}>See more</button>
      )}
    </section>
  );
}
```

### Pattern 3: Centralized motion layer (gsap config + Lenis bridge + shared hooks)

**What:** One `motion/` module owns: (a) GSAP plugin registration (`gsap.registerPlugin(ScrollTrigger)`, called exactly once, not per-component), (b) the Lenis↔GSAP RAF bridge, (c) 1-2 reusable hooks that wrap `@gsap/react`'s `useGSAP` for the two motion patterns that recur across almost every section — "reveal on scroll" (fade/slide-up) and "pin + scrub" (Hero, Selected Work horizontal reveal). Section components call these hooks; they do not construct `gsap.timeline()`/`ScrollTrigger.create()` calls inline except for the 1-2 genuinely bespoke set-pieces (e.g., Hero's overlapping card stack).

**When to use:** Any React + GSAP + Lenis build where the same 2-3 motion idioms repeat across many sections — centralizing avoids (a) re-registering plugins, (b) duplicated manual cleanup/`ScrollTrigger.getAll().forEach(t => t.kill())` boilerplate in every component, (c) desynced RAF loops.

**Trade-offs:** A thin abstraction layer adds one hop of indirection versus "just write GSAP in the component," but for 8 homepage sections + 9 case-study sub-sections reusing the same reveal pattern, the hook pays for itself almost immediately and is the difference between "each component reimplements cleanup" and "cleanup is centralized once."

**Example:**
```tsx
// motion/gsap.config.ts
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };
```

```tsx
// motion/SmoothScrollProvider.tsx
import { ReactLenis, useLenis } from "lenis/react";
import { gsap } from "./gsap.config";
import { useEffect } from "react";

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reduced = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <ReactLenis root options={{ autoRaf: false }}>
      <LenisTickerBridge disabled={reduced} />
      {children}
    </ReactLenis>
  );
}

function LenisTickerBridge({ disabled }: { disabled: boolean }) {
  const lenis = useLenis();
  useEffect(() => {
    if (disabled || !lenis) return;
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    lenis.on("scroll", gsap.ScrollTrigger.update);
    return () => gsap.ticker.remove(update);
  }, [lenis, disabled]);
  return null;
}
```

```tsx
// motion/useScrollReveal.ts
import { useGSAP } from "@gsap/react";
import { gsap } from "./gsap.config";
import { RefObject } from "react";

export function useScrollReveal(ref: RefObject<HTMLElement>) {
  useGSAP(() => {
    gsap.from(ref.current, {
      opacity: 0,
      y: 32,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: { trigger: ref.current, start: "top 85%" },
    });
  }, { scope: ref }); // auto-reverted on unmount by useGSAP
}
```

## Data Flow

### Content → Page Flow (case study)

```
src/content/caseStudies/*.md  (author writes/edits one file)
    ↓  import.meta.glob (build-time, eager, static paths — Vite requirement)
gray-matter parse → caseStudySchema.parse (Zod, fails loudly on shape drift)
    ↓
content/caseStudies.ts  (getAllCaseStudies / getFeaturedCaseStudies / getCaseStudyBySlug)
    ↓                                            ↓
SelectedWork (homepage grid, "see more")   Router "/case-study/:slug" → CaseStudyPage
    ↓                                            ↓
CaseStudyCard (preview props)              CaseStudyPage composes 9 sub-sections
                                              from the single CaseStudy object
```

### Homepage Copy Flow

```
content/homepage.ts (plain data: hero copy, proof-strip items, how-I-work steps,
                     skills list, about blurb, contact copy)
    ↓ imported as props/data, never inlined as JSX strings
HomePage.tsx → Hero / ProofStrip / HowIWork / SkillsAndTools / About / ContactForm
```
Because `Homepage Copy V2.md` is an explicit rough draft meant to be swapped after the visual build, keeping it in `content/homepage.ts` (not hardcoded inside each section's JSX) means the entire copy pass can be redone by editing one data file, with zero component changes — directly satisfying the "content reasonably decoupled from layout" constraint.

### Motion Data Flow

```
App mount → SmoothScrollProvider (Lenis instance + gsap.ticker bridge, once)
    ↓
Section mounts → ref → useScrollReveal(ref) / usePinnedSection(ref, config)
    ↓ (useGSAP registers ScrollTrigger scoped to ref)
User scrolls (Lenis) → gsap.ticker tick → ScrollTrigger.update() → timeline plays
    ↓ on unmount
useGSAP auto-reverts (kills tweens + ScrollTriggers scoped to that component)
```

### Key Data Flows

1. **Case-study addition:** New `.md` file dropped in `content/caseStudies/` → picked up automatically by the existing `import.meta.glob` pattern on next build/dev-server restart (glob patterns are static, so no code change needed) → validated by schema → appears in `getAllCaseStudies()` → shows on homepage (if `featured: true`) and gets a working `/case-study/<slug>` route automatically, since the route is a single dynamic route resolved by slug lookup, not one static route per case study.
2. **Homepage copy iteration:** Edit `content/homepage.ts` → every section re-renders with new copy → zero JSX/component edits required, so the "rough draft → iterate visually" workflow doesn't touch component code.
3. **Contact form submission:** `ContactForm` section → `lib/contact.ts` (thin fetch wrapper around Formspree/Resend endpoint, holds the provider-specific payload shape) → external email service. Isolating this in `lib/` means switching from Formspree to Resend (or adding a fallback) later is a one-file change.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|---------------------------|
| 6 case studies (v1 launch) | Eager `import.meta.glob` of all `.md` files is trivially cheap; no lazy loading needed. |
| 11 case studies (v2, all filled in) | Same pattern holds unchanged — this is exactly the scale the file-based/glob approach is designed for. No structural change needed when going 6→11, only new files. |
| 20-50+ case studies (hypothetical future) | Switch the glob to non-eager (`import.meta.glob(..., { eager: false })`) so each case-study's markdown is code-split and only fetched when its route is visited, and lazily code-split the case-study route itself via `React.lazy`. Not needed at 11. |

### Scaling Priorities

1. **First real "bottleneck" is authoring discipline, not performance:** the schema/Zod validation is the safeguard that keeps 11 hand-written files consistent — prioritize getting `caseStudySchema.ts` right and the `_template.md` scaffold correct before writing real content, since every new file is copy-pasted from it.
2. **Second, if it ever mattered: route-level code splitting for case studies** (`React.lazy(() => import("./CaseStudyPage"))`) so the homepage bundle doesn't grow with case-study count — irrelevant at 6-11 pages but a one-line change to add later if the collection grows substantially.

## Anti-Patterns

### Anti-Pattern 1: Hardcoded "first 6" slug array in JSX

**What people do:** Write `const featured = ["cad", "verzion-cloud-migration", "tata-capital-ai-interface", "mashreq", "astrosure-ai", "adreport-io"]` directly inside `SelectedWork.tsx`, then `.map` over it.
**Why it's wrong:** Creates a second source of truth that has to be manually kept in sync with the content folder; adding/reordering/promoting a case study means editing a component file instead of "just adding one file," which directly violates the stated goal.
**Do this instead:** Add `featured: boolean` and `order: number` fields to each case study's frontmatter (both already implied by the template's `featured: true` field) and derive the homepage split from `getFeaturedCaseStudies()` / `getAllCaseStudies()`.

### Anti-Pattern 2: GSAP/ScrollTrigger setup duplicated per component with manual cleanup

**What people do:** Each section does its own `useEffect(() => { const ctx = gsap.context(...); return () => ctx.revert(); }, [])`, or worse, calls `ScrollTrigger.create(...)` directly without any cleanup, and imports/registers the ScrollTrigger plugin at the top of every file.
**Why it's wrong:** React 18 Strict Mode double-invokes effects in development, and unmanaged `ScrollTrigger` instances leak on route change/unmount, causing duplicate triggers, jank, and hard-to-debug scroll position bugs — this is a documented, common failure mode with GSAP in React (verified via GSAP's own docs and community forum threads).
**Do this instead:** Register plugins once in `motion/gsap.config.ts`; use `@gsap/react`'s `useGSAP` hook (which is purpose-built to handle Strict Mode double-invoke and auto-reverts tweens/ScrollTriggers on unmount) inside the 1-2 shared hooks (`useScrollReveal`, `usePinnedSection`), and have sections call those hooks rather than writing raw GSAP setup/cleanup themselves.

### Anti-Pattern 3: Two independent RAF loops (Lenis default + GSAP's ticker)

**What people do:** Mount Lenis with its default `autoRaf: true` behavior alongside GSAP ScrollTrigger reading scroll position on its own loop.
**Why it's wrong:** The two RAF loops running independently causes ScrollTrigger positions to jitter by 1-2 frames relative to Lenis's smoothed scroll position — visible as micro-stutter on pinned/parallax sections (verified across GSAP's own community forum and Lenis maintainers' guidance).
**Do this instead:** Set `autoRaf: false` on the Lenis instance and drive it from `gsap.ticker` instead (`gsap.ticker.add((time) => lenis.raf(time * 1000))`), so both systems share one clock — the pattern implemented in `SmoothScrollProvider` above.

### Anti-Pattern 4: Generic markdown-to-HTML rendering for a heavily art-directed template

**What people do:** Treat each case study as one big Markdown file rendered through a generic `<Markdown>` component with a Tailwind `prose` class, parsing arbitrary `##` headings to detect "which section is this."
**Why it's wrong:** The Axisform-style direction depends on every section (Overview table, Process timeline, Solution gallery) having bespoke layout and motion — generic prose rendering can't express glass cards, pinned timelines, or parallax image grids, and heading-based section detection is fragile (a typo in a heading silently breaks a section).
**Do this instead:** Keep every repeatable, structured field (tools, outcome, challenge, process stages, solution images) in typed frontmatter rendered by dedicated components; reserve markdown body parsing only for the one genuinely free-form prose block (Learnings & Reflections).

### Anti-Pattern 5: Contact form logic inlined directly in the `ContactForm` component

**What people do:** `fetch("https://formspree.io/f/xxxx", { method: "POST", body: ... })` written straight inside the form's `onSubmit` handler.
**Why it's wrong:** Couples UI to one provider's request shape; makes it harder to add client-side validation, loading/error states, or switch providers (Formspree → Resend, or add a fallback) without touching the component.
**Do this instead:** Put the submission call behind `lib/contact.ts` (a single `submitContactForm(payload)` function); `ContactForm` only calls that function and renders loading/success/error UI.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|----------------------|-------|
| Formspree or Resend (contact form) | Client-side `fetch`/SDK call from `lib/contact.ts`, no custom backend | Formspree needs only a form endpoint + honeypot/reCAPTCHA for spam; Resend requires a serverless function (Vercel/Netlify function) since its API key can't be exposed client-side — this is a real fork in the architecture: Formspree keeps the site 100% static, Resend requires adding one serverless function route. Decide before wiring `ContactForm`. |
| Vercel or Netlify (hosting) | Static build output (`vite build`) deployed as a SPA | Must configure SPA fallback rewrite (`/* → /index.html` on Netlify, or Vercel's default SPA handling) so direct loads of `/case-study/:slug` don't 404 — a common gotcha with client-side-routed SPAs on static hosts. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|----------------|-------|
| `content/` ↔ `sections/` / `case-study/` | Plain function calls (`getFeaturedCaseStudies()`, etc.), no context/global state needed at this scale | Content is static at build time; no runtime fetching, no loading states needed for case-study data itself. |
| `motion/` ↔ everything else | Hooks (`useScrollReveal`, `usePinnedSection`) + one provider (`SmoothScrollProvider`) wrapping the root layout | Sections never import `gsap`/`ScrollTrigger`/`lenis` directly except the 1-2 bespoke set-pieces (Hero stack) — even those should still import from `motion/gsap.config.ts` for the shared registered instance, not re-import/re-register GSAP. |
| `router.tsx` ↔ `CaseStudyPage` | React Router route param (`:slug`) → `getCaseStudyBySlug(slug)` lookup | If slug not found (typo, unpublished draft), render a not-found state rather than crashing — cheap to add, easy to forget. |

## Sources

- [React & GSAP — GSAP official docs](https://gsap.com/resources/React/) — MEDIUM confidence (official docs, cross-checked)
- [greensock/react GitHub — useGSAP()](https://github.com/greensock/react) — MEDIUM confidence (official repo, cross-checked)
- [ScrollTrigger and React component cycle cleanup — GSAP community forum](https://gsap.com/community/forums/topic/35810-scrolltrigger-and-react-component-cycle-cleanup/) — MEDIUM confidence (cross-checked against official docs)
- [darkroomengineering/lenis GitHub — README](https://github.com/darkroomengineering/lenis/blob/main/README.md) — MEDIUM confidence (official repo, cross-checked)
- [Pattern(s) for synchronizing ScrollTrigger and Lenis in React/Next — GSAP community forum](https://gsap.com/community/forums/topic/40426-patterns-for-synchronizing-scrolltrigger-and-lenis-in-reactnext/) — MEDIUM confidence (cross-checked against Lenis README guidance)
- [Astro Docs — Imports reference (Markdown/frontmatter/collections pattern)](https://docs.astro.build/en/guides/imports/) — MEDIUM confidence (cross-checked against Vite glob usage examples)
- [hmsk/vite-plugin-markdown GitHub](https://github.com/hmsk/vite-plugin-markdown) — MEDIUM confidence (cross-checked, alternative to raw `import.meta.glob` + `gray-matter` if a build-time plugin is preferred)
- `Portfolio-Documentation/Information Architecture.md` (project-internal, HIGH confidence — primary source for site map and case-study route order)
- `Portfolio-Documentation/Project Page- Template.md` (project-internal, HIGH confidence — primary source for case-study schema)
- `Templates/Axisform/Axisform Studio Design.md` (project-internal, HIGH confidence — primary source for motion/visual tokens and reduced-motion requirement)
- `.planning/PROJECT.md` (project-internal, HIGH confidence — primary source for constraints and scope)

---
*Architecture research for: React + Tailwind portfolio site with file-based case-study content*
*Researched: 2026-07-21*
