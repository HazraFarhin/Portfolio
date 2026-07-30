# Phase 3: Homepage Build - Pattern Map

**Mapped:** 2026-07-30
**Files analyzed:** 19 (8 content modules, 8 section components, 1 route, 2 test-bearing modifications, router.tsx)
**Analogs found:** 19 / 19 (all covered — this phase is pure composition on Phase 1/2 precedent, per RESEARCH.md's own conclusion)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/content/proof-strip.ts` | config (content module) | transform (static data) | `src/content/hero.ts` | exact |
| `src/content/field-archive.ts` | config (content module) | transform (static data) | `src/content/hero.ts` | exact |
| `src/content/how-i-work.ts` | config (content module) | transform (static data) | `src/content/hero.ts` | exact |
| `src/content/skills-tools.ts` | config (content module) | transform (static data) + CRUD-style aggregation | `src/content/hero.ts` (shape) + `src/content/case-studies/loader.ts` (aggregation) | exact / role-match |
| `src/content/about.ts` | config (content module) | transform (static data) | `src/content/hero.ts` | exact |
| `src/content/footer.ts` | config (content module) | transform (static data) | `src/content/hero.ts` | exact |
| `src/content/nav.ts` | config (content module) | transform (static data) | `src/content/hero.ts` | exact |
| `src/content/case-studies/deferred.ts` | model (stub data) | CRUD (static array) | `src/content/case-studies/loader.ts` | role-match |
| `src/components/home/Nav.tsx` | component | request-response (in-page anchors) | `src/routes/home.tsx` (existing Hero section) | exact |
| `src/components/home/ProofStrip.tsx` | component | transform (render stats list) | `src/components/case-study/Overview.tsx` (fixed dl grid) | exact |
| `src/components/home/SelectedWork.tsx` | component | CRUD (list + local toggle state) | `src/routes/case-study.tsx` (list/lookup consumption) + new `useState` pattern | role-match |
| `src/components/home/FieldArchive.tsx` | component | streaming-like (native horizontal scroll, non-JS-driven) | `src/components/case-study/ImagePlaceholder.tsx` (placeholder block reused inside) | role-match |
| `src/components/home/HowIWork.tsx` | component | transform (render fixed step list) | `src/components/case-study/Process.tsx` (fixed-order stage list) — see below | exact |
| `src/components/home/SkillsTools.tsx` | component | transform (render cards + aggregated chips) | `src/components/case-study/Overview.tsx` (Card + dl fixed layout) | role-match |
| `src/components/home/About.tsx` | component | transform (bio + placeholder image) | `src/components/case-study/Overview.tsx` + `ImagePlaceholder.tsx` | exact |
| `src/components/home/Footer.tsx` | component | request-response (external links, download attr) | `src/components/case-study/Overview.tsx` (Links row: `external_link` branch, `rel`/`target` precedent) | exact |
| `src/routes/coming-soon.tsx` | route (fallback) | request-response | `src/routes/not-found.tsx` | exact |
| `src/router.tsx` (modified) | route config | request-response | itself (existing) | exact |
| `src/routes/home.tsx` (modified) | route (composition) | request-response | itself (existing) | exact |
| `src/content/hero.ts` (modified: `ctaHref`) | config | transform | itself (existing) | exact |

## Pattern Assignments

### `src/content/*.ts` (proof-strip, field-archive, how-i-work, skills-tools, about, footer, nav) — content modules

**Analog:** `src/content/hero.ts` (full file read above)

**Shape to replicate exactly:**
```typescript
// Source: src/content/hero.ts:1-32
/**
 * <Section> copy (D-XX), sourced from `Portfolio-Documentation/Homepage Copy V2.md` §NN.
 * Kept in a dedicated content module -- not hardcoded in JSX -- because the
 * homepage copy is an explicit rough draft expected to be rewritten.
 */
export interface XContent {
  fieldA: string;
  fieldB: string;
  // ...
}

export const xContent: XContent = {
  fieldA: '...',
  fieldB: '...',
};
```
Every new content module must follow `export interface X` + `export const xContent: X = {...}` — no default export, named export matching the file's concept, JSDoc block citing the source copy section (or `[ASSUMED]` for invented copy like About's bio or deferred-slug titles).

**For `skills-tools.ts`'s aggregated tool chips** (computed, not stored — per RESEARCH.md Code Examples):
```typescript
// Source: RESEARCH.md "Code Examples" section, grounded in loader.ts's real export
import { caseStudies } from './case-studies/loader';

export const skillTags: string[] = [...new Set(caseStudies.flatMap((cs) => cs.tags))];
```

---

### `src/content/case-studies/deferred.ts`

**Analog:** `src/content/case-studies/loader.ts` (full file read above, lines 1-89)

**Pattern to copy:** the file's own JSDoc-heavy documentation style, explicit typed array export, and the `[ASSUMED]` flagging convention already used elsewhere in this repo for non-sourced content.
```typescript
// Pattern shape (see RESEARCH.md Pattern 2, already vetted against this repo)
export interface DeferredCaseStudy {
  slug: string;
  title: string;
}

export const deferredCaseStudies: DeferredCaseStudy[] = [
  { slug: 'riyaah', title: 'Riyaah' },
  // ...
];
```
Do NOT modify `loader.ts` itself — RESEARCH.md's Anti-Patterns section explicitly forbids special-casing deferred slugs inside Phase 2's tested loader/parse files. `deferred.ts` is a wholly separate, deletable file (supports D-11's Phase-4 cleanup).

---

### `src/routes/home.tsx` (modified — gains sibling sections)

**Analog:** itself (existing file, full contents read above, lines 1-29)

**Core pattern to extend (not replace):**
```typescript
// Source: src/routes/home.tsx:1-29
import { useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Label, Body } from '../components/ui/Typography';
import { heroContent } from '../content/hero';
import { useScrollReveal } from '../motion/useScrollReveal';

export default function HomeRoute() {
  const heroRef = useRef<HTMLElement>(null);
  useScrollReveal(heroRef);

  return (
    <section id="hero" ref={heroRef}>
      {/* ...existing Hero JSX, untouched... */}
    </section>
  );
}
```
**Extension approach:** add each new section as a literal, hardcoded sibling `<section>` (or imported section component) directly below `<section id="hero">`, in fixed document order — mirroring `case-study.tsx`'s "NO `.map()` over a section-descriptor array; literal hardcoded JSX sequence" discipline (see below). One `<Nav />` mounted above the Hero section, scoped to this file only (RESEARCH.md Pitfall 6 / A2 — do not mount in `App.tsx`).

**Required edit:** `heroContent.ctaHref` in `src/content/hero.ts` must change from `'#hero'` to `'#selected-work'` (Pitfall 1), and `src/routes/home.test.tsx`'s hardcoded assertion `expect(heroContent.ctaHref).toBe('#hero')` (line 26) must be updated to match, or the test will fail.

---

### `src/components/home/*.tsx` — new section components

**Analog for fixed-order Card/dl-style sections (ProofStrip, SkillsTools, About):** `src/components/case-study/Overview.tsx` (full file read above, lines 1-79)

**Core pattern — literal, hardcoded row/field sequence, never derived from object iteration:**
```typescript
// Source: src/components/case-study/Overview.tsx:1-79
import { cn } from '../../lib/cn';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Body, Label } from '../ui/Typography';

export function Overview({ client, industry, role, /* ... */ }: OverviewProps) {
  return (
    <Card>
      <dl className={cn('grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-md gap-y-sm')}>
        <Label as="dt">Client</Label>
        <Body as="dd">{client}</Body>
        {/* ...literal, fixed rows in sequence, never Object.entries(props).map()... */}
      </dl>
    </Card>
  );
}
```
Reuse this exact "fixed literal JSX sequence, never `.map()` over a props-derived descriptor array" discipline for ProofStrip's 4 stats and SkillsTools' 5 capability cards (both fixed-count, order-sensitive per D-01/D-03). Use `.map()` ONLY for genuinely dynamic-length lists: Selected Work's case-study grid, Field Archive's caption row, and Skills & Tools' aggregated tool chips (variable-length, data-driven).

**Analog for fixed-order stage lists (HowIWork):** `src/components/case-study/Process.tsx` — same repo, same fixed-sequence discipline as `case-study.tsx`'s "12-section fixed order" (see `src/routes/case-study.tsx:70-131`, e.g. the literal numbered-comment JSX blocks `{/* 1. Cover banner */}` … `{/* 12. Next Project */}`). Use this same numbered-comment-per-section convention for `HowIWork`'s Studio Method words + Operating Loop 5 steps.

**Analog for placeholder image reuse (About headshot, Field Archive cards):** `src/components/case-study/ImagePlaceholder.tsx` (full file read above, lines 1-39)
```typescript
// Source: src/components/case-study/ImagePlaceholder.tsx:1-39
import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Label } from '../ui/Typography';

export type ImagePlaceholderSize = 'banner' | 'stage' | 'centerpiece';
// About headshot needs a new 'portrait' token added to this union (Pitfall 5,
// a backward-compatible one-line addition to sizeClasses) rather than a
// bespoke one-off placeholder component.

export function ImagePlaceholder({ caption, size }: ImagePlaceholderProps) {
  return (
    <div className={cn(baseClasses, sizeClasses[size])}>
      <ImageOff className="text-muted-foreground" />
      <Label>{caption}</Label>
    </div>
  );
}
```

**Analog for external/download links with security attrs (Footer):** `src/components/case-study/Overview.tsx` lines 60-75 — the `external_link` branch pattern:
```typescript
// Source: src/components/case-study/Overview.tsx:63-71
{external_link ? (
  <div className={cn('flex gap-sm flex-wrap')}>
    <Button variant="ghost" href={external_link}>
      Prototype
    </Button>
    <Button variant="ghost" href={external_link}>
      Live Site
    </Button>
  </div>
) : (
  <Label>Coming soon</Label>
)}
```
Extend this with `target="_blank" rel="noopener noreferrer"` passed through `Button`'s `...rest` spread (`src/components/ui/Button.tsx:34,43` confirms these attrs pass through to the rendered `<a>`) for Footer's LinkedIn/Behance/Website links (RESEARCH.md Security Domain). Résumé link: `<Button href="/resume.pdf" download>Download Résumé</Button>` — no `target="_blank"` needed since it's same-origin.

**Analog for scroll-reveal wiring (every animated section):** `src/motion/useScrollReveal.ts` (full file read above, lines 1-52)
```typescript
// Source: src/routes/home.tsx:1,6,15-16 (usage pattern)
import { useRef } from 'react';
import { useScrollReveal } from '../motion/useScrollReveal';

const sectionRef = useRef<HTMLElement>(null);
useScrollReveal(sectionRef);
// <section id="..." ref={sectionRef}>
```
Every new section component must call `useScrollReveal(ref)` exactly this way — never a new `matchMedia`/`gsap.context()` call. `useScrollReveal` already internally no-ops on reduced-motion via `usePrefersReducedMotionContext()`.

---

### `src/components/home/SelectedWork.tsx` (stateful list + toggle — genuinely new pattern this phase)

**Closest analog:** `src/routes/case-study.tsx` for the defensive-lookup/data-consumption style (`getCaseStudyBySlug`, `next &&` guard pattern), but the `useState` toggle itself has no existing analog in this repo — it is RESEARCH.md's own vetted sketch (Pattern 2), which is the authoritative reference:
```tsx
// Source: 03-RESEARCH.md, Pattern 2 (sketch, vetted against this repo's real exports)
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
Data-consumption discipline to copy from `loader.ts`/`case-study.tsx`: never re-sort or hardcode case-study data locally — `caseStudies` is already `order`-sorted; only compose it.

---

### `src/components/home/FieldArchive.tsx` (native horizontal scroll — genuinely new pattern this phase)

**Analog:** `src/components/case-study/ImagePlaceholder.tsx` for the individual card block; `useScrollReveal` for the section-level entrance only. No existing horizontal-scroll analog exists in this repo — RESEARCH.md Pattern 4 is authoritative:
```tsx
// Source: 03-RESEARCH.md, Pattern 4 (sketch)
import { useRef } from 'react';
import { useScrollReveal } from '../../motion/useScrollReveal';
import { ImagePlaceholder } from '../case-study/ImagePlaceholder';
import { fieldArchiveContent } from '../../content/field-archive';

export function FieldArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef); // decorative fade-in only, NOT scroll-linked horizontal motion

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
**CRITICAL constraint:** no `ScrollTrigger` `pin: true` or `containerAnimation` config — this is explicitly banned by REQUIREMENTS.md's anti-pattern list (see Anti-Patterns below).

---

### `src/routes/coming-soon.tsx`

**Analog:** `src/routes/not-found.tsx` (full file read above, lines 1-25)
```typescript
// Source: src/routes/not-found.tsx:1-24
import { Button } from '../components/ui/Button';
import { Body } from '../components/ui/Typography';

export default function NotFoundRoute() {
  return (
    <div className="flex flex-col items-center justify-center gap-md min-h-[50vh] text-center px-lg">
      <Body>Page not found.</Body>
      <Body>{"This page doesn't exist. Let's get you back to the homepage."}</Body>
      <Button variant="ghost" href="/">
        ← Back to home
      </Button>
    </div>
  );
}
```
Same layout classes, same `Body` + `Button variant="ghost" href="/"` "back to home" affordance, but distinct copy ("coming soon" framing, per D-10) and accept a `slug` prop to personalize the message (e.g. render the humanized title). Keep this file isolated and easily deletable — do not fold it into `not-found.tsx` or `case-study.tsx`'s existing "not found" fallback (RESEARCH.md Anti-Patterns).

---

### `src/router.tsx` (modified — 5 literal deferred-slug routes)

**Analog:** itself (existing file, full contents read above, lines 1-27)
```typescript
// Source: src/router.tsx:1-27 (existing structure to extend)
import { createBrowserRouter } from 'react-router';
import App from './App';
import HomeRoute from './routes/home';
import CaseStudyPage from './routes/case-study';
import NotFoundRoute from './routes/not-found';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'case-study/:slug', element: <CaseStudyPage /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]);
```
**Insertion pattern (RESEARCH.md Pattern 5):** add 5 literal `case-study/<slug>` entries BEFORE (or after — array order doesn't matter for React Router's specificity-based ranking) the generic `case-study/:slug` route, generated from a single labeled array so Phase 4 has one obvious block to delete per D-11:
```tsx
import ComingSoonRoute from './routes/coming-soon';
// D-11: Phase 4 MUST delete/guard this whole block as part of its own DEPL-03 work.
const DEFERRED_SLUG_ROUTES = ['riyaah', 'icici-bank-atm-kiosk', 'ambit', 'northernarc', 'citrus']
  .map((slug) => ({ path: `case-study/${slug}`, element: <ComingSoonRoute slug={slug} /> }));
// then spread ...DEFERRED_SLUG_ROUTES into children[], with a comment marker
```

---

## Shared Patterns

### Content-as-data-module (applies to every new section)
**Source:** `src/content/hero.ts` (all 32 lines)
**Apply to:** `proof-strip.ts`, `field-archive.ts`, `how-i-work.ts`, `skills-tools.ts`, `about.ts`, `footer.ts`, `nav.ts`, `case-studies/deferred.ts`
`export interface XContent { ... }` + `export const xContent: XContent = {...}` — never hardcode copy inline in JSX.

### Reduced-motion-safe scroll reveal (applies to every new section component)
**Source:** `src/motion/useScrollReveal.ts` (all 52 lines); consumption example `src/routes/home.tsx:1,6,15-16`
**Apply to:** `ProofStrip.tsx`, `SelectedWork.tsx`, `FieldArchive.tsx`, `HowIWork.tsx`, `SkillsTools.tsx`, `About.tsx`, `Footer.tsx` (Nav is likely exempt — persistent chrome, not a reveal-on-scroll section; confirm with planner)
```typescript
const ref = useRef<HTMLElement>(null);
useScrollReveal(ref);
```
Never a new `matchMedia` call — already centralized via `usePrefersReducedMotionContext()`.

### UI primitive composition (applies to every new section)
**Source:** `src/components/ui/Button.tsx` (59 lines), `Card.tsx` (23 lines), `Typography.tsx` (52 lines — exports `Label`, `Body`, `Heading`, `Display`)
**Apply to:** all 8 new section components
- `Button`: `variant="primary" | "ghost"`, `href` prop switches `<a>`/`<button>` rendering, arbitrary `...rest` (incl. `target`, `rel`, `download`) passes through to the rendered element.
- `Card`: single `variant="glass"` (currently a no-op prop, glass-morphism styling always applied), wraps grouped content.
- `Typography`: `Label` (uppercase, muted, for eyebrows/dt labels), `Body` (paragraph text), `Heading` (h2-style, `as` prop for semantic override), `Display` (largest, hero-scale).

### `cn()` utility for conditional/merged classNames
**Source:** `src/lib/cn.ts` (referenced by every file above; not separately read — trivial `clsx`/`tailwind-merge`-style helper, imported identically everywhere: `import { cn } from '../../lib/cn';` or `'../lib/cn'` depending on directory depth)
**Apply to:** all new components composing Tailwind classes conditionally.

### Fixed-order, non-iteration-derived JSX sequences (applies to any section with a locked content order per D-01–D-16)
**Source:** `src/routes/case-study.tsx:70-131` (12 numbered-comment sections), `src/components/case-study/Overview.tsx:39-76` (6 literal dt/dd rows)
**Apply to:** `ProofStrip.tsx` (4 stats), `HowIWork.tsx` (6 action-words + 5-step loop), `SkillsTools.tsx`'s 5 capability cards (NOT the variable-length tool chips), `Footer.tsx`'s fixed link groups (Elsewhere/Legal)
Never `Object.entries(x).map()` or iterate over a content-module array when the count/order is fixed by a locked decision — write literal JSX with numbered comments instead.

### External-link security discipline (Footer only)
**Source:** `src/components/case-study/Overview.tsx:63-71` (the `Button ... href={external_link}` precedent) + RESEARCH.md Security Domain table
**Apply to:** `Footer.tsx`'s LinkedIn/Behance/Website links
Always pair `target="_blank"` with `rel="noopener noreferrer"` on every external link call site (discipline enforced at the call site, not inside `Button.tsx`, since `Button`'s `...rest` spread already permits both attrs through).

## No Analog Found

None. RESEARCH.md's own conclusion ("Phase 3 is pure composition, not new infrastructure... low technical risk, well-precedented in this codebase") holds after direct file inspection — every new file has at least a role-match analog, and the two genuinely novel behaviors (SelectedWork's toggle state, FieldArchive's native horizontal scroll) already have vetted, repo-grounded sketches in RESEARCH.md's Architecture Patterns section (Pattern 2, Pattern 4), which this document treats as authoritative in place of a codebase analog.

## Metadata

**Analog search scope:** `src/content/`, `src/components/ui/`, `src/components/case-study/`, `src/routes/`, `src/motion/`, `src/router.tsx`, `src/lib/cn.ts` (entire `src/` tree — small enough for full-repo read, no `Glob`/`Grep` sampling needed)
**Files scanned:** 19 (all non-test source files in `src/`, read in full given each is well under 200 lines)
**Pattern extraction date:** 2026-07-30
