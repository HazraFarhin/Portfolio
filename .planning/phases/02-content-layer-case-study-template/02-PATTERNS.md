# Phase 2: Content Layer & Case-Study Template - Pattern Map

**Mapped:** 2026-07-24
**Files analyzed:** 20 (new) + 1 (modified: `src/router.tsx`)
**Analogs found:** 20 / 21

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|---|---|---|---|---|
| `src/content/case-studies/schema.ts` | model | transform (validation) | `src/content/hero.ts` (content-as-typed-module pattern) | role-match |
| `src/content/case-studies/parse.ts` | utility | transform | none in-repo (pure-function utility is new to this codebase) | no-analog |
| `src/content/case-studies/loader.ts` | service | file-I/O (build-time glob) | `src/content/hero.ts` (module exporting a typed const consumed by routes) | role-match |
| `src/content/case-studies/*.md` (6 files) | config/content | file-I/O | `src/content/hero.ts` (content data kept out of JSX) | role-match (format differs: `.md`+YAML vs `.ts`) |
| `src/router.tsx` (modified) | route | request-response | itself — `src/router.tsx` (the commented-out reserved slot IS the analog) | exact |
| `src/routes/case-study.tsx` | route/controller | request-response | `src/routes/home.tsx` | exact |
| `src/components/case-study/Overview.tsx` | component | request-response (presentational) | `src/routes/home.tsx`'s `Card`+`Label`+`Body` composition block (lines 23-26) | role-match |
| `src/components/case-study/ToolsUsed.tsx` | component | transform (markdown render) | `src/routes/home.tsx` composition style | role-match |
| `src/components/case-study/OutcomeImpact.tsx` | component | transform (markdown render) | `src/routes/home.tsx` composition style | role-match |
| `src/components/case-study/Challenge.tsx` | component | transform (markdown render) | `src/routes/home.tsx` composition style | role-match |
| `src/components/case-study/Process.tsx` | component | transform (fixed 5-item render) | `src/routes/home.tsx`'s eyebrow(`Label`)+statement(`Body`) pairing (lines 20-21) | exact (eyebrow pattern) |
| `src/components/case-study/Solution.tsx` | component | transform (markdown render) | `src/routes/home.tsx` composition style | role-match |
| `src/components/case-study/LearningsReflections.tsx` | component | transform (markdown render) | `src/routes/home.tsx` composition style | role-match |
| `src/components/case-study/DraftBadge.tsx` | component | request-response (conditional render) | `src/routes/home.tsx`'s `metaStatus` `Label` usage (line 25) | role-match |
| `src/components/case-study/ImagePlaceholder.tsx` | component | request-response (presentational) | `src/components/ui/Card.tsx` (styled div wrapper pattern) | role-match |
| `src/components/case-study/NextProject.tsx` | component | request-response | `src/components/ui/Button.tsx` (href-based CTA) + `src/content/hero.ts`'s `ctaHref`/`ctaLabel` fields | role-match |
| `src/content/case-studies/schema.test.ts` | test | transform | `src/motion/useScrollReveal.test.ts` (existing test style) | role-match |
| `src/content/case-studies/parse.test.ts` | test | transform | `src/motion/useScrollReveal.test.ts` | role-match |
| `src/routes/case-study.test.tsx` | test | request-response | `src/routes/home.test.tsx` | exact |
| `src/components/case-study/Process.test.tsx` | test | transform | `src/components/ui/Card.test.tsx` | role-match |
| `src/components/case-study/DraftBadge.test.tsx` | test | request-response | `src/components/ui/Button.test.tsx` | role-match |

## Pattern Assignments

### `src/content/case-studies/schema.ts` (model, transform)

**Analog:** `src/content/hero.ts`

**Content-as-typed-module pattern** (whole file, `src/content/hero.ts:1-33`):
```typescript
/**
 * Hero section copy (D-05), sourced verbatim from
 * `Portfolio-Documentation/Homepage Copy V2.md` §02 / Hero. Kept in a
 * dedicated content module -- not hardcoded in JSX -- because the homepage
 * copy is an explicit rough draft expected to be rewritten after visual
 * iteration (see PROJECT.md Context).
 */
export interface HeroContent {
  eyebrow: string;
  statement: string;
  ctaLabel: string;
  ctaHref: string;
  metaDescription: string;
  metaStatus: string;
}

export const heroContent: HeroContent = { /* ... */ };
```
**What to copy:** the doc-comment convention explaining *why* content lives in a dedicated module (cites the source doc + the "swap later" precedent), and the pattern of exporting both a named `interface`/type and the data. `schema.ts` should follow the same doc-comment convention but export a Zod schema + `z.infer<>` type instead of a hand-written interface (per RESEARCH.md's Code Examples section, already schema-complete — reuse that block verbatim as the starting point).

**Note:** RESEARCH.md's `CaseStudyFrontmatterSchema` code example (02-RESEARCH.md lines 348-371) is the primary source for this file; `hero.ts` only supplies the doc-comment/module convention, not the Zod API itself (no Zod usage exists yet in this repo — first introduction).

---

### `src/content/case-studies/loader.ts` (service, file-I/O)

**Analog:** `src/content/hero.ts` (as consumed by `src/routes/home.tsx`)

**Consumption pattern** (`src/routes/home.tsx:1-6, 20-26`):
```typescript
import { heroContent } from '../content/hero';
// ...
<Label>{heroContent.eyebrow}</Label>
<Body className="max-w-[62ch]">{heroContent.statement}</Body>
```
**What to copy:** the shape of exporting a single ready-to-consume value (here, an array + lookup function per RESEARCH.md Pattern 1) that route components import directly with zero parsing logic in the component itself — same separation-of-concerns already established between `hero.ts` and `home.tsx`.

**Primary source for implementation:** RESEARCH.md Pattern 1 (`import.meta.glob` + `caseStudies[]` + `getCaseStudyBySlug()`, lines 199-219) and Pitfall 2/3 (slug-extraction and ordering) — no direct in-repo precedent for `import.meta.glob` usage exists yet.

---

### `src/router.tsx` (modified — route, request-response)

**Analog:** itself (the reserved comment slot)

**Existing reserved slot** (`src/router.tsx:1-20`):
```typescript
import { createBrowserRouter } from 'react-router';
import App from './App';
import HomeRoute from './routes/home';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      // Reserved for Phase 2 (D-11) -- do not implement here:
      // { path: 'case-study/:slug', element: <CaseStudyRoute /> },
    ],
  },
]);
```
**What to copy:** literally fill in the commented route exactly as pre-anticipated — `import CaseStudyRoute from './routes/case-study'` then replace the comment with `{ path: 'case-study/:slug', element: <CaseStudyRoute /> }`. No structural changes to the route tree, no new nesting.

---

### `src/routes/case-study.tsx` (route/controller, request-response)

**Analog:** `src/routes/home.tsx`

**Full composition pattern** (`src/routes/home.tsx:1-29`):
```typescript
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
      <Label>{heroContent.eyebrow}</Label>
      <Body className="max-w-[62ch]">{heroContent.statement}</Body>
      <Button href={heroContent.ctaHref}>{heroContent.ctaLabel}</Button>
      <Card>
        <Body>{heroContent.metaDescription}</Body>
        <Label>{heroContent.metaStatus}</Label>
      </Card>
    </section>
  );
}
```
**What to copy:**
- Import UI primitives the same way (`from '../components/ui/...'`), content the same way (`from '../content/...'`).
- `useRef` + `useScrollReveal(ref)` pattern if any section wants scroll-reveal motion (optional per CONTEXT.md, not required).
- Route component is a plain default-exported function component with no props — `CaseStudyRoute`/`case-study.tsx` will instead need `useParams()` from `react-router` (not used in `home.tsx` since it takes no params) to read `:slug`, then call `getCaseStudyBySlug(slug)`.

**Error handling / not-found pattern:** no existing analog in repo (home.tsx has no failure branch) — must be authored fresh per RESEARCH.md Pitfall 4 and UI-SPEC's "Case study not found." copy contract, composed only from existing `Body` + `Button` primitives (per UI-SPEC line 136).

---

### `src/components/case-study/*.tsx` (Overview, ToolsUsed, OutcomeImpact, Challenge, Process, Solution, LearningsReflections, DraftBadge, ImagePlaceholder, NextProject)

**Analog:** `src/routes/home.tsx`'s composition style + `src/components/ui/{Button,Card,Typography}.tsx`

**Primitive composition pattern** (`src/routes/home.tsx:23-26`):
```typescript
<Card>
  <Body>{heroContent.metaDescription}</Body>
  <Label>{heroContent.metaStatus}</Label>
</Card>
```
**What to copy:** every section subcomponent should be a small presentational function taking typed props (frontmatter fields or a body-section string), returning JSX built exclusively from `Label`/`Body`/`Heading`/`Card`/`Button` (per D-07/D-09 and UI-SPEC's typography mapping table) — no new raw HTML tags with ad-hoc Tailwind classes duplicating what these primitives already provide.

**Typography `as` prop pattern** (`src/components/ui/Typography.tsx:10-22, 32-41`):
```typescript
export function Label({ as: Tag = 'span', className, children, ...rest }: TypographyProps) {
  return (
    <Tag className={cn('text-label font-normal uppercase tracking-[0.14em] text-muted-foreground', className)} {...rest}>
      {children}
    </Tag>
  );
}
```
**What to copy:** use the `as="h3"` / `as="h1"` override exactly like this when UI-SPEC specifies semantic tags (e.g. case-study `h1` title via `<Heading as="h1">`, Process sub-stage eyebrows via `<Label as="h3">`) — never hardcode a raw `<h1>`/`<h3>` outside the primitive.

**Card variant pattern** (`src/components/ui/Card.tsx:10-23`):
```typescript
export function Card({ variant = 'glass', className, children }: CardProps) {
  void variant;
  return (
    <div className={cn('rounded-3xl border border-line bg-secondary/55 backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.5)] p-lg', className)}>
      {children}
    </div>
  );
}
```
**What to copy:** `Overview.tsx` is the one section wrapped in `<Card>` (per UI-SPEC's Layout section) — reuse exactly as-is, no restyling; other sections render as plain `<section>` flow content (no `Card` wrapper), matching UI-SPEC's explicit "not wrapped in a Card, except Overview" rule.

**Button href/CTA pattern** (`src/components/ui/Button.tsx:29-59`, consumed at `src/routes/home.tsx:22`):
```typescript
<Button href={heroContent.ctaHref}>{heroContent.ctaLabel}</Button>
```
**What to copy:** `NextProject.tsx` computes `{Next Project Title} →` dynamically from the ordered `caseStudies[]` list (per UI-SPEC Copywriting Contract) but renders it through the exact same `<Button href={...} variant="primary">{...}</Button>` call shape; Overview's "Prototype"/"Live Site" links use `<Button variant="ghost">`.

**`cn()` utility** (`src/lib/cn.ts:19-21`):
```typescript
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```
**What to copy:** any new one-off classNames in section components (e.g. `ImagePlaceholder`'s gradient/aspect-ratio classes, `DraftBadge`'s pill shape) should be composed via `cn(...)` from `'../../lib/cn'`, following the same import path convention as `Button.tsx`/`Card.tsx`/`Typography.tsx` (`import { cn } from '../../lib/cn'`).

**No new `@theme` scale needed:** UI-SPEC confirms zero new spacing/typography/color tokens this phase — do not touch `src/index.css` or `cn.ts`'s `classGroups` registration (that registration in `cn.ts:11-17` is only relevant if a *new* custom `text-*` scale were introduced, which UI-SPEC explicitly rules out).

---

### `react-markdown` component-remapping (ToolsUsed, OutcomeImpact, Challenge, Process paragraphs, Solution, LearningsReflections)

**Analog:** none in-repo (first introduction of `react-markdown` — no prior markdown rendering exists in this codebase). Use RESEARCH.md's Pattern 4 code example directly (02-RESEARCH.md lines 277-295):
```tsx
import Markdown from 'react-markdown';
import { Body, Heading } from '../ui/Typography';

<Markdown
  components={{
    h3: (props) => <Heading as="h3" {...props} />,
    p: (props) => <Body {...props} />,
    img: () => <ImagePlaceholder />, // D-02: never render a real <img> this phase
  }}
>
  {sections.challenge}
</Markdown>
```
**What to copy verbatim:** the `components` remap object shape, and unconditionally remapping `img` to `ImagePlaceholder` (never a real `<img>` per D-02).

---

### Test files (`*.test.ts`, `*.test.tsx`)

**Analog:** `src/components/ui/Button.test.tsx`, `src/motion/useScrollReveal.test.ts`, `src/routes/home.test.tsx`

Follow existing Vitest + Testing Library conventions already established in this repo (import from `vitest`, `@testing-library/react`; component tests render via `render()` from Testing Library, pure-function tests (`parse.ts`, `schema.ts`) call functions directly with fixture strings per RESEARCH.md's own test example (lines 373-413), which should be treated as the authoritative starting point for `parse.test.ts` since no closer in-repo analog for pure-function content-parsing tests exists yet.

---

## Shared Patterns

### ClassName composition (`cn()`)
**Source:** `src/lib/cn.ts`
**Apply to:** every new component file (`ImagePlaceholder.tsx`, `DraftBadge.tsx`, `Overview.tsx`, etc.)
```typescript
import { cn } from '../../lib/cn';
// ...
className={cn('base-classes', className)}
```

### Typography primitive usage (no raw heading/paragraph tags)
**Source:** `src/components/ui/Typography.tsx`
**Apply to:** all case-study section components — always route text through `Label`/`Body`/`Heading`/`Display` with the `as` prop for semantic tag overrides, never a bare `<h1>`/`<h2>`/`<p>`.

### Content-module doc-comment convention
**Source:** `src/content/hero.ts:1-7`
**Apply to:** `schema.ts` and `loader.ts` — a doc comment explaining what canonical doc/decision the module implements (mirrors hero.ts citing `Homepage Copy V2.md` §02 and D-05; case-study modules should cite `Project Page- Template.md` and D-04/D-05/D-11).

### Reserved-slot fill-in pattern
**Source:** `src/router.tsx:16-17`
**Apply to:** `router.tsx` modification — the phase's only router change is uncommenting/implementing the exact line Phase 1 already pre-wrote.

### Motion opt-in (optional)
**Source:** `src/motion/useScrollReveal.ts`, consumed at `src/routes/home.tsx:15-16`
**Apply to:** any case-study section that wants scroll-reveal motion — call `useScrollReveal(sectionRef)` exactly as `home.tsx` does; not required by any locked decision this phase (CONTEXT.md explicitly marks this optional).

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/content/case-studies/parse.ts` | utility | transform | No pure frontmatter/body-parsing utility exists yet in this codebase; RESEARCH.md's Pattern 2/3 code examples (regex + `js-yaml` split, H2/H3 section split) are the authoritative source instead of an in-repo analog |
| `src/content/case-studies/loader.ts` (glob mechanics specifically) | service | file-I/O | No prior `import.meta.glob` usage exists in this repo; RESEARCH.md Pattern 1 is the source |
| `react-markdown` component remapping | transform | — | First introduction of markdown rendering in this codebase; RESEARCH.md Pattern 4 is the source |

## Metadata

**Analog search scope:** `src/` (entire existing application source — 15 files pre-existing before this phase)
**Files scanned:** `src/content/hero.ts`, `src/components/ui/{Button,Card,Typography}.tsx` (+ their `.test.tsx`), `src/router.tsx`, `src/lib/cn.ts`, `src/routes/home.tsx` (+ `.test.tsx`), `src/motion/{useScrollReveal,MotionProvider,usePrefersReducedMotion}.ts`
**Pattern extraction date:** 2026-07-24
