# Phase 4: Contact Form & Deployment Hardening - Pattern Map

**Mapped:** 2026-08-03
**Files analyzed:** 11
**Analogs found:** 8 / 11 (3 files have no in-repo analog — greenfield infra, listed below)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `api/contact.ts` | controller (serverless function) | request-response | none in-repo | no analog (see below) |
| `vercel.json` | config | — | none in-repo | no analog (see below) |
| `public/robots.txt` | config | — | none in-repo | no analog (see below) |
| `public/sitemap.xml` | config | — | none in-repo | no analog (see below) |
| `src/components/home/Footer.tsx` | component | request-response (client fetch + local state) | itself (existing file, modified) | exact — extending established markup |
| `src/content/footer.ts` | config (content-as-data-module) | — | itself (existing file, modified) | exact |
| `src/components/home/SelectedWork.tsx` | component | CRUD-ish (render/filter static list) | itself (existing file, modified) | exact |
| `src/components/home/SelectedWork.test.tsx` | test | — | itself (existing file, rewritten) | exact |
| `src/components/home/Footer.test.tsx` | test | — | itself (existing file, extended) | exact |
| `src/test/seo.test.ts` | test | file-I/O (parse static files) | `src/content/case-studies/loader.test.ts` / `parse.test.ts` | role-match (unit test reading a file's content and asserting on strings) |
| `src/router.tsx` | route | request-response | itself (existing file, modified — comment removal only) | exact |
| `.planning/REQUIREMENTS.md` | doc | — | n/a (doc update per D-08, not code) | n/a |

## Pattern Assignments

### `src/components/home/Footer.tsx` (component, request-response — modified in place)

**Analog:** itself, `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/components/home/Footer.tsx`

**Current imports** (lines 1-5):
```typescript
import { useId, useRef } from 'react';
import { Button } from '../ui/Button';
import { Body, Label } from '../ui/Typography';
import { footerContent } from '../../content/footer';
import { useScrollReveal } from '../../motion/useScrollReveal';
```
Add `useState` to the `react` import for submit-status state (`'idle' | 'submitting' | 'success' | 'error'`); import `CheckCircle2`, `AlertCircle` from `lucide-react` (UI-SPEC Design System) for success/error icons.

**Current form markup to modify** (lines 40-65):
```typescript
<form className="flex flex-col gap-md mt-lg">
  <div className="flex flex-col gap-xs">
    <label htmlFor={workingOnId}>
      <Label as="span">{footerContent.formFields.workingOn}</Label>
    </label>
    <input id={workingOnId} type="text" className={fieldClasses} />
  </div>
  {/* ... emailId field already has `required` ... */}
  <Button variant="primary" type="submit" className="self-start">
    {footerContent.submitLabel}
  </Button>
</form>
```
Per D-11, add `required` to the `workingOn` input and the `clarify` textarea (email input at line 52 already has `required` — copy that exact attribute placement). Per D-12, the `<form>` needs `onSubmit={handleSubmit}` where `handleSubmit` calls `e.preventDefault()` first (RESEARCH.md Pattern 4 gives the exact handler shape to follow, including honeypot short-circuit and `fetch('/api/contact', ...)`).

**Honeypot field placement (D-10):** add as a new hidden input inside the same `<form>`, using the accessible-hiding technique specified in UI-SPEC Spacing Scale exceptions (`absolute w-px h-px overflow-hidden opacity-0`, `aria-hidden="true"`, `tabIndex={-1}`, `autoComplete="off"`) — no existing analog for a honeypot in this repo; this is the one net-new UI element, follow the UI-SPEC literally rather than searching for a codebase precedent.

**State-driven conditional render pattern to add:** Footer.tsx currently has no conditional rendering/state at all (`useId`/`useRef` only) — this is new to the file. Model the three-way branch (`idle/submitting` shows form, `success` replaces form, `error` shows banner + form) directly per UI-SPEC's Interaction & Motion Contract section — no existing component in this repo does a conditional form/success swap, so there is no in-repo analog for this specific state machine; follow UI-SPEC copy/transition classes verbatim (`transition-opacity duration-200 ease-out`).

**Button component reuse** — `src/components/ui/Button.tsx` (lines 29-58): the `Button` component defaults `type="button"` unless explicitly passed. The submit button already correctly passes `type="submit"` (Footer.tsx line 62) — keep this, only add `disabled={status === 'submitting'}` and swap the label text conditionally (`footerContent.submitLabel` vs new `footerContent.submittingLabel`).

**Typography reuse** — `Body`/`Label` from `src/components/ui/Typography.tsx`, already imported (line 3). Success/error headline uses `Body` + `font-extrabold` className override per UI-SPEC Typography section — no new Typography variant needed.

---

### `src/content/footer.ts` (content-as-data-module — modified)

**Analog:** itself, `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/content/footer.ts`

**Existing interface/object shape to extend** (lines 16-36, 38-66):
```typescript
export interface FooterContent {
  briefLabel: string;
  briefIntro: string;
  formFields: {
    workingOn: string;
    emailLabel: string;
    clarify: string;
  };
  submitLabel: string;
  // ...
}
```
Add new fields following this exact flat-string convention (no nesting beyond `formFields`'s existing pattern): `submittingLabel: 'Sending…'`, `successHeadline: 'Brief received.'`, `successBody: string` (interpolate `contactEmail` — UI-SPEC says "pull from footer.ts, do not hardcode a second literal string", so build this as a template referencing the existing `contactEmail` field within the same object, or compose it in the component from two separate content strings — planner's call, but must not duplicate the email literal), `errorHeadline: 'Something didn\'t send.'`, `errorBody: string` (same email-reuse constraint). Exact copy given verbatim in UI-SPEC Copywriting Contract table.

---

### `src/components/home/SelectedWork.tsx` (component — modified, simplification/removal)

**Analog:** itself, `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/components/home/SelectedWork.tsx`

**Current imports to remove** (lines 1, 7):
```typescript
import { useRef, useState } from 'react';
import { deferredCaseStudies } from '../../content/case-studies/deferred';
```
`useState` becomes unused once the `expanded` state (line 23) and its toggle button (lines 57-63) and the deferred `.map()` block (lines 44-54) are deleted — remove the `useState` import too (oxlint's `noUnusedLocals`/`noUnusedParameters` config in `tsconfig.app.json` will fail the build otherwise).

**Block to delete entirely** (lines 44-54, the deferred cards) and (lines 57-63, the toggle button) per D-07/D-08. The remaining grid (lines 31-42, the real 6 `caseStudies.map(...)`) is untouched — this becomes the final, permanent Selected Work rendering with no expand/collapse state.

**`selectedWorkContent` fields** (`src/content/selected-work.ts`, not read in full above but referenced at line 8 as `selectedWorkContent.seeLessLabel`/`seeMoreLabel`/`footnote`) — `seeMoreLabel`/`seeLessLabel` become unused once the toggle button is removed; check whether `footnote` copy references "see more" and needs updating to remove any promise of hidden content (Claude's Discretion territory, flag if found).

---

### `src/components/home/SelectedWork.test.tsx` (test — rewrite)

**Analog:** itself, `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/components/home/SelectedWork.test.tsx`

The existing file's 2nd, 3rd, 4th, 5th `it()` blocks (lines 30-79) all assert the toggle/deferred-card behavior that D-08 removes — these must be deleted/rewritten, not merely extended. The 1st test (lines 16-28, "renders exactly 6 real case-study cards") and the 6th test (lines 81-86, superseded-titles guard) stay as-is and remain valid post-change. New assertions to add: "no toggle button of any kind renders" (`screen.queryByRole('button', { name: /see more/i })` is null) and "no link to any deferred slug renders" (assert none of the 5 deferred slugs appear in any `href`).

---

### `src/components/home/Footer.test.tsx` (test — extend)

**Analog:** itself, `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/components/home/Footer.test.tsx`

Existing test structure uses `render(<Footer />)` + `screen`/`fireEvent`-free assertions (this file currently has no `fireEvent` usage at all — `SelectedWork.test.tsx` above is the better analog for the `fireEvent.click` + async-state pattern needed for submit/success/error tests). Combine both analogs: keep this file's existing `render`/`screen.getByLabelText`/`toHaveAttribute` idioms for the new `required` attribute assertions (mirror the existing email-field test at lines 33-38 exactly, duplicate its shape for `workingOn` and `clarify`), and borrow `SelectedWork.test.tsx`'s `fireEvent.click` pattern (lines 39, 60, 64, 77) for the submit-button click. RESEARCH.md's Validation Architecture section specifies mocking `global.fetch` — no existing test in this repo mocks `fetch` yet (new pattern for this repo), so follow Vitest's standard `vi.stubGlobal('fetch', vi.fn(...))` / `vi.spyOn(global, 'fetch')` approach directly (no in-repo precedent, follow Vitest docs).

---

### `src/test/seo.test.ts` (test, file-I/O — new file)

**Analog:** `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/content/case-studies/loader.test.ts` and `src/content/case-studies/parse.test.ts` (both read/parse file content and assert on structure — closest role-match for "read a static file, assert string content")

These two files were not fully read (out of budget for this pass — RESEARCH.md's Wave 0 Gaps section already specifies exactly what this new test must assert: `public/robots.txt` disallows the 5 deferred slugs, `public/sitemap.xml` omits them). Use Node's `fs.readFileSync`/`readFile` (already a devDependency-available API — no new package needed) to read `public/robots.txt` and `public/sitemap.xml` as plain text/XML, then assert on substring presence/absence of the 5 deferred slugs (`riyaah`, `icici-bank-atm-kiosk`, `ambit`, `northernarc`, `citrus`) — this repo's existing `.test.ts` files (co-located, `describe`/`it`, Vitest) establish the surrounding test-file conventions (imports of `describe`, `expect`, `it` from `vitest`, as seen in every `*.test.tsx` file read above).

---

### `src/router.tsx` (route — modified, comment/removal only)

**Analog:** itself, `/Users/hazrafarhin/Desktop/Repositories/Portfolio/src/router.tsx`

Per D-07, `DEFERRED_SLUG_ROUTES` (lines 22-26) stays functionally identical — only the inline "Phase 4 MUST delete/guard this whole block" comment (lines 19-21) is stale once this phase's decision (keep routes, remove homepage links only) is finalized; update/remove that comment to reflect the D-07 resolution so a future reader isn't misled into thinking route deletion is still pending.

---

### `api/contact.ts` (serverless function — new, no in-repo analog)

No existing `/api` directory or serverless function exists anywhere in this repo — this is genuinely new infrastructure. RESEARCH.md's Code Examples section (lines 344-394) is the canonical source to follow directly: Web Standard `fetch` export, `Resend` SDK call, `{ data, error }` → JSON status-code mapping, server-side re-validation of the 3 fields plus email-shape regex. No project-specific conventions to inherit here since nothing comparable exists — follow RESEARCH.md's example verbatim as the primary source, not a codebase pattern.

### `vercel.json`, `public/robots.txt`, `public/sitemap.xml` (config — new, no in-repo analog)

None of these three files exist in the repo (confirmed via `ls public/` → only `favicon.svg`, `resume.pdf`; confirmed no root-level `vercel.json`). RESEARCH.md's Architecture Patterns Pattern 3 (`vercel.json` rewrite, lines 242-255) and Recommended Project Structure (lines 179-192) are the canonical sources. `public/robots.txt`/`public/sitemap.xml` follow standard web conventions (Disallow rules, `<urlset>` XML) — RESEARCH.md flags these as Tertiary/LOW-confidence sourcing (general WebSearch, not one authoritative doc) but the syntax is standard enough that any planner-authored version following basic robots.txt/sitemap.xml spec will be correct. `public/favicon.svg` and `public/resume.pdf` (existing files in the same directory) confirm the convention: static files at `public/*` are served verbatim at the site root by Vite — no build step needed for these 3 new files either.

---

## Shared Patterns

### Content-as-data-module (copy lives in `src/content/*.ts`, never hardcoded in JSX)
**Source:** `src/content/footer.ts` (existing, lines 38-66), same pattern in `src/content/selected-work.ts`, `src/content/hero.ts`, etc.
**Apply to:** All new success/error/submitting copy strings in `Footer.tsx` — must be added to `footerContent` in `src/content/footer.ts`, not inlined.

### `useScrollReveal` scroped to section-level entrance only, not state transitions
**Source:** `src/motion/useScrollReveal.ts`, used identically in both `Footer.tsx` (line 24) and `SelectedWork.tsx` (line 21)
**Apply to:** Do NOT wrap the new success/error state swap in `useScrollReveal` — UI-SPEC explicitly reserves it for whole-section entrance; use plain CSS `transition-opacity` classes instead (UI-SPEC Interaction & Motion Contract).

### `Button` component's implicit `type="button"` default
**Source:** `src/components/ui/Button.tsx` lines 50-58 — plain `<button>` elements always default `type="button"` unless explicitly overridden via `...rest` spreading `type="submit"`.
**Apply to:** Confirms D-12's bug is real: Footer.tsx's submit button already correctly passes `type="submit"` explicitly (Footer.tsx line 62) — the actual bug is the missing `onSubmit`/`preventDefault` on the `<form>` element itself, not the button. Any new buttons added in this phase (there are none planned) should default to `type="button"` unless intentionally a submit trigger.

### Vitest test file conventions (describe/it/expect from 'vitest', @testing-library/react render/screen/fireEvent)
**Source:** every existing `*.test.tsx`/`*.test.ts` file in `src/` (e.g. `src/components/home/Footer.test.tsx`, `src/components/home/SelectedWork.test.tsx`)
**Apply to:** `src/test/seo.test.ts` (new), extensions to `Footer.test.tsx`, rewrite of `SelectedWork.test.tsx` — all follow this exact import/structure convention, no new test framework or config needed (`vite.config.ts`'s existing `test` block already covers `src/**`).

### Checkpoint pattern for manual/human-only steps blocking downstream automation
**Source:** `.planning/phases/03-homepage-build/03-05-PLAN.md`, `<task type="checkpoint:human-action" gate="blocking">` (lines 50-67) and `<task type="checkpoint:decision" gate="blocking">` (lines 69-93)
**Apply to:** D-06's Vercel account-connection/env-var checkpoint — reuse this exact XML task shape (`<action>`, `<how-to-verify>` numbered steps, `<verify><automated>`, `<resume-signal>`, `<done>`) when the planner writes the Vercel-connection checkpoint task. Also directly applicable to the `resend`/`@vercel/node` `checkpoint:human-verify` requirement RESEARCH.md's Package Legitimacy Audit flags (lines 120, 123) — same task-type convention, adapted for a package-install verification rather than a content-supply decision.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `api/contact.ts` | controller (serverless) | request-response | No `/api` directory or serverless function exists anywhere in this repo — first backend code in an otherwise pure-frontend Vite SPA. Follow RESEARCH.md Code Examples (lines 344-394) directly. |
| `vercel.json` | config | — | No deployment config of any kind exists yet (no hosting target was previously chosen). Follow RESEARCH.md Pattern 3 (lines 242-255). |
| `public/robots.txt` | config | — | Net-new; follow standard robots.txt Disallow syntax per RESEARCH.md guidance (Tertiary sourcing, standard enough not to need a citation). |
| `public/sitemap.xml` | config | — | Net-new; hand-maintained per RESEARCH.md's Alternatives Considered (no generator library justified at this scale). |

## Metadata

**Analog search scope:** `src/` (all components, content, routes, tests), `public/`, repo root config files, `.planning/phases/03-homepage-build/03-05-PLAN.md` (checkpoint pattern precedent)
**Files scanned:** ~40 (full `src/` tree via `find`, plus targeted `Read` of Footer.tsx, footer.ts, SelectedWork.tsx, SelectedWork.test.tsx, Footer.test.tsx, Button.tsx, router.tsx, deferred.ts, coming-soon.tsx, package.json, tsconfig.app.json, 03-05-PLAN.md)
**Pattern extraction date:** 2026-08-03
