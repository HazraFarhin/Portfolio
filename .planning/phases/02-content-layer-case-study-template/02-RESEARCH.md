# Phase 2: Content Layer & Case-Study Template - Research

**Researched:** 2026-07-24
**Domain:** File-based typed content (Markdown+frontmatter) loading in a Vite/React SPA, schema validation, and a reusable case-study template component
**Confidence:** MEDIUM (core libraries verified against npm registry + official docs; the specific "browser-safe frontmatter parsing" recommendation is cross-checked via multiple independent sources but is a synthesized recommendation, not a single canonical doc)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** No real case-study copy exists anywhere in the repo for any of the 6 named projects — confirmed via repo search. Phase 2 ships **structurally-complete placeholder content** for all 6 slugs: realistic, clearly draft-quality copy (generic role/process/outcome language) that fully exercises every template section, schema field, and validation rule — but does **not** invent client-specific metrics, quotes, or claims attributed as fact to the real named clients (Mashreq, Tata Capital, etc.). This mirrors the already-established pattern for `Homepage Copy V2.md`.
- **D-02:** No image assets exist (`public/` contains only `favicon.svg`). Cover images and in-process images referenced by the template are placeholder blocks (styled divs/gradients using Phase 1's design tokens, not real photos) for all 6 case studies in this phase.
- **D-03:** Placeholder content must be visibly identifiable as draft (e.g. a subtle "Draft content — pending final copy" marker sourced from the same `status` frontmatter field the template schema already defines).
- **D-04:** Case-study content is Markdown + YAML frontmatter per file (one `.md` per slug). Frontmatter carries structured fields (title, slug, client, industry, role, team, timeline, status, featured, cover_image, tags, external_link, **one-line summary**) exactly per `Project Page- Template.md`'s CMS-fields block; the Markdown body carries the narrative sections (Challenge, Process stage write-ups, Solution paragraph, Learnings & Reflections).
- **D-05:** Frontmatter is validated against a typed schema (Zod, or an equivalent lightweight runtime validator — Claude's Discretion on exact library) at content-load time.
- **D-06:** Content files are loaded via Vite's native glob import (e.g. `import.meta.glob`) rather than a Node-only build step, keeping the site fully static.
- **D-07:** One `CaseStudyPage` route component (mounted at `/case-study/:slug`) composes small presentational subcomponents per template section, reusing Phase 1's `Button`/`Card`/`Typography` primitives.
- **D-08:** Role and outcome must be visible in the Overview section without scrolling (CASE-03) — the Overview table (client/industry/role/team/timeline/links) renders directly below the title and one-line summary, before any other section.
- **D-09:** Section subcomponents are internal to the case-study template only in this phase. Whether Phase 3's homepage reuses them is Phase 3's decision, not locked here — Phase 3 reads this phase's loader/metadata, not necessarily these components.
- **D-10:** Phase 2 authors content files for exactly the 6 featured slugs. The 5 deferred slugs are NOT created as content files, NOT given routes, and NOT stubbed in this phase.
- **D-11:** `Portfolio-Documentation/Project Page- Template.md` is the literal, authoritative case-study template — every frontmatter field and every body section (Overview, Tools Used, Outcome & Impact, The Challenge, Process's 5 sub-stages, Solution, Learnings & Reflections, Next Project footer) must be implemented exactly as structured there, with no deviation, reordering, or omission of sections.
- **D-12:** Hazra intends to directly edit case-study content herself after the site is visualized — swapping placeholder copy for real copy by editing `.md` files directly, with no developer involvement and no new tooling required. Editing a `.md` file's body or frontmatter must be sufficient on its own to update the rendered page — no component changes should ever be required for a content-only edit.

### Claude's Discretion

- Exact schema-validation library (Zod vs. Valibot vs. other lightweight runtime validator) — D-05 only locks that one exists.
- Internal file/folder structure for content files (e.g. `src/content/case-studies/*.md`) and the loader module.
- Exact wording/tone of placeholder copy per case study (draft-quality, generic, non-fabricated per D-01).
- Visual treatment of the "draft content" marker from D-03 (badge, banner, subtle label — consistent with Phase 1's dark cinematic tokens).
- Internal component API/props shape for the section subcomponents from D-07, as long as they compose Phase 1's primitives.

### Deferred Ideas (OUT OF SCOPE)

- Reusing case-study section subcomponents for homepage preview cards — left for Phase 3 to decide.
- Full pages for the 5 deferred case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) — out of scope for v1.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CASE-01 | User can navigate to a full case-study page for each of the 6 featured projects | React Router `:slug` route (already scaffolded in `src/router.tsx`) + a content loader keyed by slug (see Architecture Patterns, Pattern 1) |
| CASE-02 | Each case-study page displays Overview, Tools Used, Outcome & Impact, Challenge, Process, Solution, and Learnings & Reflections sections per `Project Page- Template.md` | Section-splitting strategy (Pattern 2) maps markdown body H2/H3 headings to named sections rendered by dedicated subcomponents |
| CASE-03 | Each case-study page states role/outcome visibly near the top so it can be skimmable in seconds | Overview component reads frontmatter directly (not parsed markdown) and renders immediately after title+summary, before any body-derived section (D-08) |
| CASE-04 | Case-study content is stored as file-based, typed data so adding a new case study is a content-only change | Zod-validated frontmatter schema + `import.meta.glob` loader with zero slug-specific code in components/router (Pattern 1, Don't Hand-Roll, Pitfall 4) |

</phase_requirements>

## Summary

This phase's central technical risk is **not** the Zod-vs-Valibot choice the CONTEXT.md flagged as the open question — it is the interaction between "browser-only, no Node build step" (D-06) and the naive suggestion of `gray-matter` for frontmatter parsing. Verified via GitHub issue #143 on `gray-matter` itself and a Vite maintainer discussion (vitejs/vite#6180): `gray-matter` calls `Buffer.isBuffer`/`toBuffer` internally, and Vite (unlike webpack 4) does **not** auto-polyfill Node core globals for the browser bundle. Shipping `gray-matter` in client-bundled code throws `ReferenceError: Buffer is not defined` at runtime. The same caveat applies to `front-matter`, its closest alternative. Given D-06 explicitly rules out a Node-only build step (i.e., no custom Vite plugin doing Node-side parsing, no separate content-generation script), the loader must run in the browser bundle — so frontmatter parsing must use browser-safe primitives only: a two-line regex split on the `---` delimiters plus `js-yaml`'s pure-JS `load()` function (no Buffer dependency), then a Zod schema `.parse()`/`.safeParse()` on the resulting plain object.

For markdown-body rendering, `react-markdown` (v10.1.0, current) is the standard, security-conscious choice — it renders to React elements without `dangerouslySetInnerHTML` and accepts a `components` prop to remap tags (`h2`, `img`, `ul`, etc.) to Phase 1's `Typography`/`Card` primitives, plus a `remarkPlugins` array (`remark-gfm` for tables/strikethrough if ever needed). Content sections (Tools Used, Outcome & Impact, The Challenge, Process, Solution, Learnings & Reflections) are extracted from the raw markdown body by splitting on `## ` (H2) headings before handing each section's substring to `<ReactMarkdown>` — Overview is **not** a markdown-body section at all; it is a small React component reading frontmatter fields directly (client, industry, role, team, timeline, external_link), which is what makes CASE-03's "visible without scrolling" requirement tractable (no markdown parsing needed to paint the above-the-fold content).

Zod is the recommended validator over Valibot: bundle-size savings (~10x smaller) matter far less for a ~6-file static portfolio site than API ergonomics and ecosystem familiarity, and Zod's `.safeParse()` gives clean per-file error reporting for D-05's "typed data validated at content-load time" requirement.

**Primary recommendation:** Use `import.meta.glob('/src/content/case-studies/*.md', { query: '?raw', import: 'default', eager: true })` + a hand-rolled regex/`js-yaml` frontmatter splitter (NOT `gray-matter`) + a Zod schema + `react-markdown` for body rendering, with Overview/Tools-Used-frontmatter-derived fields rendered by dedicated React components and markdown-body sections (Challenge, Process, Solution, Learnings & Reflections) split by heading text and rendered via `react-markdown`.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Content authoring (`.md` files) | Browser/Client (build input) | — | Static files bundled at build time; no server, no CMS (PROJECT.md constraint) |
| Frontmatter parsing + schema validation | Browser/Client (SPA runtime, at module-eval/content-load time) | — | D-06 rules out a Node-only build step; parsing must happen in code that ships to the browser bundle, executed once per session at import time |
| Markdown-to-JSX rendering | Browser/Client | — | `react-markdown` runs client-side; no SSR/build-time HTML generation in this static SPA |
| Route resolution (`/case-study/:slug`) | Browser/Client (React Router, client-side routing) | — | Phase 1 already established `createBrowserRouter` (client-only, no server loaders) |
| Case-study section composition (Overview, Tools Used, etc.) | Browser/Client (React components) | — | Presentational composition of Phase 1's `Button`/`Card`/`Typography` primitives |
| Deployment SPA-rewrite for direct `/case-study/:slug` loads | CDN/Static (hosting config) | — | Out of scope for this phase — explicitly Phase 4's DEPL-02 |

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `zod` | 4.4.3 (verified npm, published 2026-05-04) | Runtime schema validation of case-study frontmatter | Most widely adopted TS-first runtime validator (239M+ weekly downloads); `.safeParse()` gives per-file structured errors, matching D-05's "typed data validated at content-load time" literally |
| `js-yaml` | 5.2.2 (verified npm) | Pure-JS YAML parsing of the frontmatter block (no Node `Buffer` dependency) | Browser-safe alternative to `gray-matter`'s YAML engine; avoids the confirmed `Buffer is not defined` bundling failure (see Common Pitfalls) |
| `react-markdown` | 10.1.0 (verified npm) | Renders markdown-body section content (Challenge, Process, Solution, Learnings & Reflections) to React elements | Renders without `dangerouslySetInnerHTML`; accepts `components` prop to remap tags to Phase 1's `Typography`/`Card` primitives — avoids hand-rolling a markdown-to-JSX renderer |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `remark-gfm` | 4.0.1 (verified npm) | GFM extensions (tables, strikethrough, task lists) for `react-markdown` | Only if any case-study body content actually needs a markdown table/task list; the Overview "table" in the template is rendered from frontmatter directly (not parsed markdown), so this may not be strictly required — include only if body copy uses GFM syntax |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod | Valibot (1.4.2, verified npm) | ~10x smaller bundle (1.4KB vs Zod's ~12-15KB gzip for a typical object schema) and better tree-shaking via its `pipe()`-composed functional API, but a less familiar chained-method API and smaller ecosystem. For 6 known content files validated once at app load, bundle-size delta is immaterial; Zod's ergonomics win for a solo-maintained project |
| Hand-rolled regex + `js-yaml` frontmatter split | `gray-matter` (4.0.3) | `gray-matter` is the most common Node-side frontmatter library, but calls `Buffer.isBuffer`/`toBuffer` internally — confirmed to throw `ReferenceError: Buffer is not defined` when bundled for the browser by Vite (no auto Node-polyfill, unlike webpack 4). Would require adding a Buffer polyfill package or moving parsing into a Node-only Vite plugin, both of which conflict with D-06 |
| Hand-rolled regex + `js-yaml` | `front-matter` (4.0.2) | Same Node-oriented design lineage as `gray-matter`; not confirmed browser-bundle-safe either — not worth the risk over a two-line regex split |
| `react-markdown` | Full `unified`/`remark`/`rehype` pipeline (`remark-parse`, `remark-frontmatter`, `remark-rehype`, `rehype-react`) | More powerful (can extract frontmatter AND body from a single AST pass, single source of truth), but meaningfully more packages/config for a 6-file static site; `react-markdown` already wraps this pipeline internally for rendering, so adding it again just for frontmatter extraction is redundant complexity given the regex+js-yaml approach is simpler and sufficient |

**Installation:**
```bash
npm install zod js-yaml react-markdown
# remark-gfm only if body content actually needs GFM tables/task-lists:
npm install remark-gfm
npm install -D @types/js-yaml
```

**Version verification:** All four core/supporting packages confirmed current via `npm view <pkg> version` against the live npm registry on 2026-07-24 (see table above for exact versions and publish dates).

## Package Legitimacy Audit

| Package | Registry | Age | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| zod | npm | Est. 2020 (mature; latest 4.4.3 published 2026-05-04) | 239M/week | github.com/colinhacks/zod | OK | Approved |
| js-yaml | npm | First published 2011-11-02 (15 yrs); latest patch 2026-07-23 | 272M/week | github.com/nodeca/js-yaml | SUS (flagged "too-new") — **false positive, see note** | Approved (see note) |
| react-markdown | npm | Latest major published 2025-03-07 | 28M/week | github.com/remarkjs/react-markdown | OK | Approved |
| remark-gfm | npm | Latest published 2025-02-10 | 33M/week | github.com/remarkjs/remark-gfm | OK | Approved (only if GFM syntax is actually used) |

**Note on `js-yaml`'s SUS flag:** The legitimacy-check heuristic flagged `js-yaml` "too-new" because its `publishedAt` timestamp (2026-07-23) reflects a very recent **patch release**, not the package's actual age. Direct registry lookup (`npm view js-yaml time.created`) confirms the package's first release was **2011-11-02** — this is a 15-year-old, extremely widely used package (272M weekly downloads, maintained by the long-established `nodeca` org) that simply shipped a routine patch the day before this research ran. This is a confirmed false positive from a date-based heuristic misreading "latest version publish date" as "package age," not a real supply-chain risk signal. No `checkpoint:human-verify` is warranted for `js-yaml` specifically, but the planner should still note this reasoning inline if a human reviews the audit table, since the raw verdict is technically SUS.

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `js-yaml` — flagged by a date heuristic false positive (see note above); no action needed beyond documenting the reasoning.

## Architecture Patterns

### System Architecture Diagram

```
.md content files (src/content/case-studies/*.md)
        │
        │  import.meta.glob('*.md', { query:'?raw', import:'default', eager:true })
        ▼
Raw string map { path -> rawMarkdownText }
        │
        │  parseCaseStudyFile(raw, path)   [regex split on '---' + js-yaml.load()]
        ▼
{ frontmatter: unknown, body: string }
        │
        │  CaseStudyFrontmatterSchema.safeParse(frontmatter)   [Zod]
        ▼
   ┌────┴─────┐
   │  valid?  │
   └────┬─────┘
   yes  │  no → collect error (file path + Zod issue path), surfaced at content-load time
        ▼
{ slug, title, summary, client, industry, role, team, timeline,
  status, featured, cover_image, tags, external_link, body } : CaseStudy
        │
        │  splitBodyIntoSections(body)   [split on '## ' H2 headings; Process further
        │                                 split on '### ' H3 sub-stage headings]
        ▼
{ toolsUsed, outcomeImpact, challenge, process: {5 stages}, solution, learnings }
        │
        │  caseStudies: CaseStudy[]  +  getCaseStudyBySlug(slug)
        ▼
router.tsx  '/case-study/:slug'  ──useParams()──▶  CaseStudyPage
        │
        ├─ found  → renders Title/Summary → Overview (frontmatter-driven) → DraftBadge
        │            (if status==='Draft') → ToolsUsed → OutcomeImpact → Challenge →
        │            Process (5 sub-stages) → Solution → Learnings → NextProject
        │            (computed from ordered caseStudies[] list, not per-file data)
        │
        └─ not found → lightweight "case study not found" fallback (edge case: any
                         slug not among the 6 loaded content files, e.g. a deferred
                         slug typed directly into the URL per D-10)
```

### Recommended Project Structure
```
src/
├── content/
│   ├── hero.ts                          # existing (Phase 1)
│   └── case-studies/
│       ├── cad.md
│       ├── verzion-cloud-migration.md
│       ├── tata-capital-ai-interface.md
│       ├── mashreq.md
│       ├── astrosure.ai.md
│       ├── adreport.io.md
│       ├── schema.ts                    # Zod schema + CaseStudyFrontmatter/CaseStudy types
│       ├── parse.ts                     # parseCaseStudyFile(), splitBodyIntoSections() — pure functions, unit-testable without glob
│       └── loader.ts                    # import.meta.glob wiring; exports caseStudies[], getCaseStudyBySlug()
├── components/
│   └── case-study/
│       ├── Overview.tsx                 # reads frontmatter fields directly
│       ├── ToolsUsed.tsx                # renders body section via react-markdown
│       ├── OutcomeImpact.tsx
│       ├── Challenge.tsx
│       ├── Process.tsx                  # renders 5 sub-stage children
│       ├── Solution.tsx
│       ├── LearningsReflections.tsx
│       ├── DraftBadge.tsx               # D-03 marker, conditional on status
│       ├── ImagePlaceholder.tsx         # D-02 styled placeholder block
│       └── NextProject.tsx              # computed from ordered caseStudies[], not per-file
└── routes/
    └── case-study.tsx                   # CaseStudyPage — composes all of the above
```

**File naming note:** slugs `astrosure.ai` and `adreport.io` contain literal dots (per `Information Architecture.md`); filenames `astrosure.ai.md` / `adreport.io.md` are valid on all major filesystems and match `*.md` glob patterns correctly (the glob only anchors on the final `.md` extension), but double-check the loader's slug-extraction logic strips exactly one trailing `.md` and not `.ai`/`.io` — a naive `filename.split('.')[0]` would incorrectly truncate these two slugs to `astrosure`/`adreport`. Use `filename.replace(/\.md$/, '')` instead.

### Pattern 1: Content-only extensibility (CASE-04)
**What:** The loader discovers files via a static glob pattern; the route and every component reference `slug` generically via `useParams()` / props — no file lists any of the 6 slugs by name in code.
**When to use:** Everywhere in this phase's implementation — the router, the page component, and the loader itself must contain zero hardcoded slug literals (only the glob pattern `'/src/content/case-studies/*.md'` and the `:slug` route param).
**Example:**
```typescript
// src/content/case-studies/loader.ts
const rawFiles = import.meta.glob('/src/content/case-studies/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

export const caseStudies: CaseStudy[] = Object.entries(rawFiles)
  .map(([path, raw]) => parseCaseStudyFile(raw, path))
  .sort((a, b) => a.order - b.order); // order derived from Information Architecture.md sequence, stored in frontmatter or a small explicit ordering map — NOT the array's arbitrary glob iteration order, which is not guaranteed to match IA order across filesystems

export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}
```
*(Source: synthesized from Vite's official `import.meta.glob` docs — vite.dev/guide/features#glob-import — combined with this project's D-04/D-06/CASE-04 constraints.)*

### Pattern 2: Frontmatter + body split without `gray-matter`
**What:** A minimal, browser-safe two-step parse: split the raw file on the `---` delimiters via regex, `js-yaml.load()` the frontmatter block into a plain object, then `Zod.safeParse()` it against the schema.
**When to use:** Inside `parse.ts`, called once per file at loader module-eval time.
**Example:**
```typescript
// src/content/case-studies/parse.ts
import { load } from 'js-yaml';
import { CaseStudyFrontmatterSchema } from './schema';

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

export function parseCaseStudyFile(raw: string, filePath: string) {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`${filePath}: missing or malformed frontmatter block (expected '---' delimiters)`);
  }
  const [, frontmatterBlock, body] = match;
  const parsedYaml = load(frontmatterBlock); // pure JS, no Buffer dependency
  const result = CaseStudyFrontmatterSchema.safeParse(parsedYaml);
  if (!result.success) {
    throw new Error(`${filePath}: invalid frontmatter — ${result.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ')}`);
  }
  return { ...result.data, body: body.trim() };
}
```
*(Source: synthesized recommendation — cross-checked against `gray-matter` GitHub issue #143 and the vitejs/vite#6180 discussion confirming the Buffer incompatibility that motivates this approach instead of `gray-matter`.)*

### Pattern 3: Body section splitting (CASE-02)
**What:** Split the markdown body string on top-level (`## `) headings into a `Record<SectionKey, string>`, with `Process` further split on `### ` sub-headings into its 5 stages.
**When to use:** Once per case study, inside `parse.ts` or a dedicated `splitBodyIntoSections()` helper called by the loader.
**Example:**
```typescript
const SECTION_HEADING_MAP: Record<string, SectionKey> = {
  'Tools Used': 'toolsUsed',
  'Outcome & Impact': 'outcomeImpact',
  'The Challenge': 'challenge',
  'Process': 'process',
  'Solution': 'solution',
  'Learnings & Reflections': 'learnings',
};

export function splitBodyIntoSections(body: string): Record<SectionKey, string> {
  const parts = body.split(/^## (.+)$/m); // odd indices are heading text, even indices are content
  const sections = {} as Record<SectionKey, string>;
  for (let i = 1; i < parts.length; i += 2) {
    const heading = parts[i].trim();
    const key = SECTION_HEADING_MAP[heading];
    if (key) sections[key] = parts[i + 1]?.trim() ?? '';
  }
  return sections;
}

// Process sub-stages: split `sections.process` again on /^### \d+\.\s*(.+)$/m
```
*(Source: synthesized — standard string-splitting technique for a fixed, known set of heading names locked by D-11; no library needed since headings are literal and controlled by this project's own template, not arbitrary user markdown.)*

### Pattern 4: react-markdown with custom component mapping
**What:** Render each extracted section's markdown substring through `react-markdown`, remapping tags to Phase 1 primitives.
**When to use:** Inside each section subcomponent (ToolsUsed, Challenge, Solution, etc.).
**Example:**
```tsx
// Source: react-markdown README (github.com/remarkjs/react-markdown), verified v10.1.0 API
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

### Anti-Patterns to Avoid
- **Using `gray-matter` or `front-matter` in client-bundled code:** Confirmed to throw `Buffer is not defined` at runtime when bundled by Vite for the browser (no auto-polyfill). Use `js-yaml` + regex instead.
- **Hardcoding the 6 slugs anywhere in component/router code:** Breaks CASE-04's "content-only change" requirement the moment a 7th case study is added. The only place a slug string may appear in code is the glob pattern itself and route matching logic (`useParams().slug`).
- **Rendering real `<img src="...">` tags this phase:** No image assets exist (D-02); pointing `<img>` at nonexistent paths produces broken-image icons. Use a placeholder component unconditionally this phase.
- **Splitting body sections with a full markdown-AST library just to find heading boundaries:** Overkill for a fixed, known set of heading strings defined by this project's own authoritative template (D-11) — a plain string split is simpler, has zero extra dependencies, and is trivially unit-testable.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Markdown → HTML/JSX rendering | A custom regex-based markdown-to-JSX converter | `react-markdown` | Markdown has many edge cases (nested lists, emphasis inside links, escaping); a battle-tested renderer avoids XSS-adjacent bugs and rendering glitches for zero extra cost given content is already in `.md` format |
| YAML parsing | A hand-rolled `key: value` line parser | `js-yaml` | YAML has quoting, multi-line strings, and type coercion rules (e.g. unquoted `true`/`false`/numbers) that are easy to get subtly wrong; `js-yaml` is the standard, pure-JS, browser-safe parser |
| Schema validation / type guarantees | Manual `if (typeof x.title !== 'string') throw ...` checks per field | Zod schema + `.safeParse()` | Manual checks don't compose, don't give structured per-field error paths, and drift from the TS type over time; Zod's schema is both the runtime validator and the type source (`z.infer<>`) |

**Key insight:** The only thing this phase should hand-roll is the frontmatter *delimiter* split (`---`) and the H2/H3 body *section* split — both are trivial, fully deterministic string operations against a fixed, self-authored template (D-11), not general-purpose markdown or YAML parsing. Everything downstream of those two splits (YAML→object, object→typed/validated data, markdown→JSX) uses a standard library.

## Common Pitfalls

### Pitfall 1: `gray-matter`/`front-matter` throwing `Buffer is not defined` in production
**What goes wrong:** The app works in `npm run dev` under some conditions (esbuild's dev-server pre-bundling can sometimes mask the issue) but throws a hard runtime error in the production build or in certain browsers, because `gray-matter` calls `Buffer.isBuffer`/`toBuffer` and Vite doesn't polyfill Node globals for the browser bundle.
**Why it happens:** `gray-matter` was designed for Node.js file-processing contexts (SSGs, build scripts), not browser bundles.
**How to avoid:** Don't add `gray-matter`/`front-matter` as a dependency at all; use the regex + `js-yaml` approach in Pattern 2.
**Warning signs:** `ReferenceError: Buffer is not defined` in the browser console at app load; works when run via a Node script/test but fails when actually rendered in a browser or a real `vite build && vite preview`.

### Pitfall 2: `astrosure.ai` / `adreport.io` slug-from-filename truncation
**What goes wrong:** A naive `filename.split('.')[0]` (or similar) truncates `astrosure.ai.md` to `astrosure` and `adreport.io.md` to `adreport`, breaking route matching for those two case studies specifically (their slugs contain a literal dot per `Information Architecture.md`).
**Why it happens:** These are the only 2 of the 6 slugs containing a `.` character; easy to miss when testing with the other 4 straightforward slugs.
**How to avoid:** Derive slug via `filePath.replace(/^.*\//, '').replace(/\.md$/, '')` (strip only the trailing `.md` extension, not everything after the first dot).
**Warning signs:** `/case-study/astrosure.ai` 404s or resolves to the wrong content while `/case-study/mashreq` works fine.

### Pitfall 3: `import.meta.glob` non-deterministic ordering vs. Information Architecture order
**What goes wrong:** `Object.entries()` over the glob's result map is not guaranteed to preserve the exact IA-specified order (`cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io`) across all filesystems/OSes — filesystem directory listing order is not contractually alphabetical or insertion-order everywhere.
**Why it happens:** JS object/Map key order for glob results generally follows the underlying filesystem's directory-read order, which V8 does preserve for string keys in modern engines, but relying on that as an implicit content-ordering mechanism is fragile and not something the loader controls explicitly.
**How to avoid:** Give each case-study frontmatter an explicit `order` (or reuse `featured`'s semantics is not enough on its own since it's boolean, not ordinal) — OR sort `caseStudies[]` at loader time by a small hardcoded array of slugs matching Information Architecture.md's order (`['cad', 'verzion-cloud-migration', ...]`) using `.indexOf()`. Note: this ordering array lives in the loader (infrastructure), not per-content-file data, so adding a 7th case study still doesn't require touching component code — only appending one slug to this one ordering list, or (cleaner) an `order: number` frontmatter field per file, which fully avoids touching the loader too. Recommend the frontmatter `order` field for true D-12 "content-only" compliance.
**Warning signs:** Homepage "Selected Work" (Phase 3) or any internally-ordered list of case studies renders in an unexpected/inconsistent sequence.

### Pitfall 4: Route matches any `:slug`, including the 5 deferred/unknown ones
**What goes wrong:** Because `/case-study/:slug` is a single dynamic route (per D-10/Phase 1's D-11), navigating to `/case-study/riyaah` (a real slug from Information Architecture.md, just not built this phase) or `/case-study/typo` will match the route and attempt to render — if `CaseStudyPage` naively does `getCaseStudyBySlug(slug)!.title`, this crashes on `undefined`.
**Why it happens:** React Router path matching doesn't know which slugs "should" exist; that's purely a data-lookup concern.
**How to avoid:** `CaseStudyPage` must explicitly handle `getCaseStudyBySlug(slug) === undefined` with a lightweight "not found" fallback (reusing `Button`/`Body` primitives — e.g. "Case study not found." + a link back home). This is a small but load-bearing addition for CASE-01 correctness, not just a nice-to-have.
**Warning signs:** A blank white screen or a React error boundary crash when visiting any non-implemented `/case-study/*` path.

### Pitfall 5: D-08's "above the fold" requirement conflicting with a cover-image placement
**What goes wrong:** The template's literal structure places a cover image immediately below the H1 title, before the Overview table. If the cover-image placeholder (D-02) is rendered at full visual weight in that position, it could push the Overview table (client/role/team/timeline — CASE-03's skimmable content) below the first viewport on smaller screens, contradicting D-08.
**Why it happens:** D-11 (literal template fidelity) and D-08 (Overview must be above-the-fold) are two separate locked decisions that can visually conflict depending on how much vertical space the placeholder block occupies.
**How to avoid:** This is a visual/layout decision for the planner/UI-spec step, not something to resolve in research — flagged here so the plan explicitly sizes/positions the cover placeholder (e.g., a compact banner strip, not a full-viewport hero image) to preserve D-08's above-the-fold guarantee. Do not silently drop the cover-image slot to "solve" this — D-11 requires it to exist structurally.
**Warning signs:** Overview content requires scrolling past a large placeholder block on smaller viewports during UAT.

## Code Examples

### Zod schema for case-study frontmatter (D-04, D-05)
```typescript
// src/content/case-studies/schema.ts
// Source: Zod README (github.com/colinhacks/zod), verified v4.4.3 API
import { z } from 'zod';

export const CaseStudyFrontmatterSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  client: z.string().min(1),
  industry: z.string().min(1),
  role: z.string().min(1),
  team: z.string().min(1),
  timeline: z.string().min(1),
  status: z.enum(['Published', 'Draft']),
  featured: z.boolean(),
  cover_image: z.string().min(1),
  tags: z.array(z.string()).default([]),
  external_link: z.string().url().optional(),
  summary: z.string().min(1), // D-04's "one-line summary" as a frontmatter field
  order: z.number().int().nonnegative(), // Pitfall 3 — explicit IA ordering, content-only extensible
});

export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>;
```

### Unit-testing the pure parse functions without touching the real glob (Validation Architecture)
```typescript
// src/content/case-studies/parse.test.ts
import { describe, expect, it } from 'vitest';
import { parseCaseStudyFile } from './parse';

const VALID_FIXTURE = `---
title: "Test Project"
slug: "test-project"
client: "Test Client"
industry: "FinTech"
role: "Lead UX Designer"
team: "Solo"
timeline: "Jan 2026 - Feb 2026"
status: "Draft"
featured: true
cover_image: "/images/test-project/cover.jpg"
tags: ["UX", "UI"]
summary: "A one-line summary."
order: 0
---

## Tools Used

- Figma
`;

describe('parseCaseStudyFile', () => {
  it('parses valid frontmatter and body', () => {
    const result = parseCaseStudyFile(VALID_FIXTURE, 'test-project.md');
    expect(result.slug).toBe('test-project');
    expect(result.status).toBe('Draft');
    expect(result.body).toContain('## Tools Used');
  });

  it('throws a descriptive error for malformed frontmatter', () => {
    const badFixture = VALID_FIXTURE.replace('featured: true', 'featured: "yes"');
    expect(() => parseCaseStudyFile(badFixture, 'bad.md')).toThrow(/bad\.md/);
  });
});
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `gray-matter` as the default frontmatter parser for any JS project | Context-dependent: fine for Node-only build scripts/SSGs, unsafe for client-bundled browser code | Ongoing (bundler-dependent — Vite never polyfilled Buffer; this isn't a recent regression in `gray-matter`, it's an inherent Node-vs-browser mismatch) | Recommending against `gray-matter` here is not "the library got worse" — it's "the library was never designed for this exact usage (client-bundled Vite SPA)" |
| Zod v3 | Zod v4 (57% smaller, includes a `zod/mini` tree-shakeable build) | Zod v4 release | Zod's historical bundle-size disadvantage vs. Valibot has narrowed somewhat, though Valibot remains smaller |

**Deprecated/outdated:** None directly relevant — all recommended libraries are current major versions.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Zod is the better fit than Valibot for this specific project (ergonomics over bundle size) | Standard Stack / Alternatives Considered | Low — this is Claude's Discretion per CONTEXT.md; if the planner/user prefers Valibot for bundle-size discipline, the schema shape translates directly (same validation semantics, different API surface) |
| A2 | `js-yaml` + regex is confirmed sufficient for this project's frontmatter (no exotic YAML features needed: no anchors, no multi-document files, no custom tags) | Architecture Patterns / Pattern 2 | Low — the template's frontmatter fields are all simple scalars/arrays/booleans; if future content needs more complex YAML, `js-yaml` already supports it, no library swap needed |
| A3 | An explicit `order: number` frontmatter field is the best fix for Pitfall 3 (glob ordering) rather than a hardcoded slug-order array in the loader | Common Pitfalls / Pitfall 3 | Low-Medium — both approaches work; the `order` field is recommended specifically because it keeps "add a 7th case study" a pure content-file change (no loader edit), most faithfully satisfying D-12, but this is Claude's Discretion, not a locked decision |
| A4 | The cover-image placeholder should NOT be dropped from the template structure despite the D-08/D-11 layout tension (Pitfall 5) | Common Pitfalls / Pitfall 5 | Medium — if a future planner/UI-spec step decides differently (e.g., moves cover image to only appear on hover, or omits it entirely for v1), that's a legitimate call, but it should be a deliberate decision, not an oversight |

## Open Questions

1. **Should `order` live in frontmatter, or should the loader hardcode an IA-derived slug-order array?**
   - What we know: Both work technically; `order` per-file is more consistent with D-12's "content-only change" spirit.
   - What's unclear: Whether the user has a preference for keeping ordering logic centralized (loader) vs. distributed (per-file frontmatter).
   - Recommendation: Default to `order: number` in frontmatter (Assumption A3); flag for confirmation in discuss-phase or plan-check if the planner disagrees.

2. **Exact visual treatment of the cover-image placeholder given the D-08/D-11 tension (Pitfall 5).**
   - What we know: A cover-image slot must exist structurally (D-11); Overview must be reachable without scrolling (D-08).
   - What's unclear: Exact pixel/viewport sizing — this is a visual design decision better suited to a UI-spec pass or explicit planner judgment call, not something researchable in the abstract.
   - Recommendation: Planner should size the cover-image placeholder conservatively (e.g., a compact strip rather than a full-bleed hero) and verify visually during UAT that Overview is still reachable without scrolling on a typical viewport (per CASE-03's literal wording).

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js / npm | Installing new dependencies (`zod`, `js-yaml`, `react-markdown`) | ✓ | — (package.json shows Vite 8.1.5, React 19.2.8 already installed) | — |
| Vite | `import.meta.glob` with `query`/`import` options | ✓ | 8.1.5 (installed) | — |
| Vitest | Unit-testing `parse.ts`/`schema.ts` per Validation Architecture | ✓ | 4.1.10 (installed) | — |

No missing dependencies — this phase adds only pure-JS npm packages (`zod`, `js-yaml`, `react-markdown`, optionally `remark-gfm`), all installable via `npm install` with no native/binary/system dependencies.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.10 + @testing-library/react 16.3.2 + jsdom 29.1.1 (already configured, Phase 1) |
| Config file | `vite.config.ts` (`test:` block) + `src/test/setup.ts` |
| Quick run command | `npx vitest run src/content/case-studies/parse.test.ts` (or any single new test file) |
| Full suite command | `npm test` (`vitest run`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CASE-01 | Each of the 6 slugs resolves to a rendered `CaseStudyPage` (route + loader lookup succeeds) | integration | `npx vitest run src/routes/case-study.test.tsx` | ❌ Wave 0 (this phase creates it) |
| CASE-01 | An unmatched slug (e.g. a deferred slug or typo) renders the "not found" fallback, not a crash | unit | `npx vitest run src/routes/case-study.test.tsx -t "not found"` | ❌ Wave 0 |
| CASE-02 | `CaseStudyPage` renders all 7 section headings (Overview, Tools Used, Outcome & Impact, The Challenge, Process, Solution, Learnings & Reflections) in that order for a given fixture | unit | `npx vitest run src/routes/case-study.test.tsx -t "renders all sections in order"` | ❌ Wave 0 |
| CASE-02 | Process section renders all 5 sub-stages (Discovery & Research, Define, Ideate & Wireframe, Design & Prototype, Test & Iterate) | unit | `npx vitest run src/components/case-study/Process.test.tsx` | ❌ Wave 0 |
| CASE-03 | Overview section (role, client, timeline) appears in the DOM before Tools Used/Challenge/Process/Solution sections | unit (structural proxy for "above the fold"; true viewport visibility is a human/browser check) | `npx vitest run src/routes/case-study.test.tsx -t "overview renders before body sections"` | ❌ Wave 0 |
| CASE-04 | `CaseStudyFrontmatterSchema.safeParse()` rejects malformed/missing fields with a structured error | unit | `npx vitest run src/content/case-studies/schema.test.ts` | ❌ Wave 0 |
| CASE-04 | `parseCaseStudyFile()` throws a file-path-specific error for a malformed fixture; succeeds for a valid fixture | unit | `npx vitest run src/content/case-studies/parse.test.ts` | ❌ Wave 0 |
| CASE-04 | No hardcoded slug literals exist in router/component source (content-only-change guarantee) | manual/code-review (grep-based) | `grep -rn "cad\|verzion-cloud-migration\|tata-capital-ai-interface\|mashreq\|astrosure\.ai\|adreport\.io" src/routes src/components src/router.tsx` should return zero matches outside `src/content/case-studies/*.md` | — (verification step, not a test file) |
| D-03 | Draft badge renders when `status === 'Draft'`, absent when `'Published'` | unit | `npx vitest run src/components/case-study/DraftBadge.test.tsx` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run <changed-file>.test.tsx` (quick, scoped)
- **Per wave merge:** `npm test` (full suite — currently 34 tests from Phase 1, growing with this phase's additions)
- **Phase gate:** Full suite green before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `src/content/case-studies/schema.test.ts` — covers CASE-04 (schema validation)
- [ ] `src/content/case-studies/parse.test.ts` — covers CASE-04 (frontmatter/body parsing)
- [ ] `src/routes/case-study.test.tsx` — covers CASE-01, CASE-02, CASE-03 (integration: route → loader → full page render)
- [ ] `src/components/case-study/Process.test.tsx` — covers CASE-02 (5 sub-stages)
- [ ] `src/components/case-study/DraftBadge.test.tsx` — covers D-03
- [ ] No new test-framework installation needed — Vitest/Testing Library/jsdom are already fully configured by Phase 1; this phase only adds test files, not infrastructure

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | No | No auth in this phase — static content site |
| V3 Session Management | No | No sessions |
| V4 Access Control | No | No access-controlled resources; all 6 case studies are public by design |
| V5 Input Validation | Yes (data-integrity framing, not user-input framing) | Zod schema validates all frontmatter at content-load time (D-05); `external_link` validated as `.url()` to reject malformed/non-URL values before they reach an `<a href>` |
| V6 Cryptography | No | Not applicable — no secrets, no crypto operations in this phase |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Markdown-body XSS (if content were ever externally/user-sourced) | Tampering / Elevation of Privilege | `react-markdown` renders to React elements without `dangerouslySetInnerHTML`, so raw HTML embedded in markdown is not executed by default — this is defense-in-depth given content is currently first-party-authored only (Hazra editing `.md` files directly per D-12), not user-submitted |
| `javascript:` pseudo-protocol in `external_link` | Tampering | Zod's `.url()` validator rejects non-`http(s)` URL schemes at content-load time, preventing a malformed frontmatter value from ever reaching an `<a href="javascript:...">` |
| Broken/malformed content silently shipping to production | Tampering (data integrity) | `parseCaseStudyFile()` throws immediately (at module-eval / app-load time) on schema validation failure, rather than silently rendering `undefined` fields — fail-fast is appropriate here since this is a solo-authored, low-file-count content set (Pitfall 1's fail-fast recommendation) |

This phase's security surface is intentionally small — no backend, no user input, no auth. The main practical control is the Zod schema itself, already required by D-05 for functional reasons and doubling as the input-validation control here.

## Sources

### Primary (HIGH confidence)
- None — no MCP-based Context7/authoritative doc-fetch tool was available in this environment for direct verification (see Metadata below); official Vite docs were fetched via `WebFetch` (built-in tool) rather than an MCP-verified channel, placing that source at MEDIUM/CITED rather than HIGH.

### Secondary (MEDIUM confidence — CITED)
- Vite official docs, `import.meta.glob` API — vite.dev/guide/features#glob-import (fetched directly, confirms `query`/`import`/`eager` options and static-literal-only constraint)
- `gray-matter` GitHub issue #143 (jonschlinkert/gray-matter) — confirms `Buffer is not defined` failure mode
- vitejs/vite GitHub Discussion #6180 — confirms Vite does not auto-polyfill Node core globals for the browser bundle
- react-markdown README (remarkjs/react-markdown) — confirms `components`/`remarkPlugins` API shape for v10
- npm registry (`npm view <pkg> version`, `npm view <pkg> time.created`) — confirms exact current versions and package ages for zod, valibot, gray-matter, front-matter, react-markdown, remark-gfm, js-yaml, react-router, react-router-dom

### Tertiary (LOW confidence — flagged for validation)
- Various 2026-dated blog posts comparing Zod v4 vs. Valibot bundle sizes (dev.to, souvenirlist.com, pkgpulse.com) — directionally consistent with each other and with the underlying architectural reasoning (Valibot's `pipe()`-composed functions tree-shake better than Zod's chained-method objects), but none are an official benchmark source; treated as corroborating, not authoritative

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM — package versions/existence verified directly against the npm registry; the specific "avoid gray-matter, use js-yaml+regex" recommendation is a synthesized architectural conclusion cross-checked against 2 independent sources (gray-matter's own issue tracker + a Vite maintainer discussion), not a single canonical "how-to" doc, since this exact combination (Vite SPA + markdown content + no build step) is a project-specific constraint rather than a heavily-documented standard pattern
- Architecture: MEDIUM — the section-splitting and loader patterns are synthesized from Vite's official glob-import docs plus this project's own locked decisions (D-04/D-06/D-11); no single official tutorial covers this exact combination, so patterns were derived rather than copied
- Pitfalls: MEDIUM-HIGH — Pitfall 1 (Buffer issue) is cross-source-confirmed; Pitfalls 2-5 are derived directly from this project's own file-naming/data (Information Architecture.md, Project Page- Template.md, CONTEXT.md's D-08) rather than external research, so confidence in their correctness is high, but they are project-specific reasoning, not externally-verified facts

**Research date:** 2026-07-24
**Valid until:** 2026-08-23 (30 days — npm package versions and Vite's glob API are stable; re-verify package versions if planning is delayed significantly past this window)
