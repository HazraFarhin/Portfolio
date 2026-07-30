---
phase: 03-homepage-build
reviewed: 2026-07-30T12:00:00Z
depth: standard
files_reviewed: 34
files_reviewed_list:
  - src/components/case-study/ImagePlaceholder.test.tsx
  - src/components/case-study/ImagePlaceholder.tsx
  - src/components/home/About.test.tsx
  - src/components/home/About.tsx
  - src/components/home/FieldArchive.test.tsx
  - src/components/home/FieldArchive.tsx
  - src/components/home/Footer.test.tsx
  - src/components/home/Footer.tsx
  - src/components/home/HowIWork.test.tsx
  - src/components/home/HowIWork.tsx
  - src/components/home/Nav.test.tsx
  - src/components/home/Nav.tsx
  - src/components/home/ProofStrip.test.tsx
  - src/components/home/ProofStrip.tsx
  - src/components/home/SelectedWork.test.tsx
  - src/components/home/SelectedWork.tsx
  - src/components/home/SkillsTools.test.tsx
  - src/components/home/SkillsTools.tsx
  - src/components/ui/Typography.tsx
  - src/content/about.ts
  - src/content/case-studies/deferred.ts
  - src/content/field-archive.ts
  - src/content/footer.ts
  - src/content/hero.ts
  - src/content/how-i-work.ts
  - src/content/nav.ts
  - src/content/proof-strip.ts
  - src/content/selected-work.ts
  - src/content/skills-tools.ts
  - src/router.test.tsx
  - src/router.tsx
  - src/routes/coming-soon.test.tsx
  - src/routes/coming-soon.tsx
  - src/routes/home.test.tsx
  - src/routes/home.tsx
findings:
  critical: 1
  warning: 2
  info: 4
  total: 7
status: issues_found
---

# Phase 03: Code Review Report

**Reviewed:** 2026-07-30T12:00:00Z
**Depth:** standard
**Files Reviewed:** 34
**Status:** issues_found

## Summary

Reviewed the Phase 3 homepage build: every home section component and its
content module, the shared `ImagePlaceholder`/`Typography` primitives, the
router config, and the `home`/`coming-soon` routes, at standard depth
(full read + language-aware checks per file, plus light cross-file
cross-referencing of imports/exports and shared data sources).

The section components themselves are clean — consistent `useScrollReveal`
usage, no dead imports, no debug artifacts, no hardcoded secrets, no
dangerous DOM APIs, `rel="noopener noreferrer"` correctly paired with every
`target="_blank"` anchor. The one real defect is in `Footer.tsx`: the Brief
contact form ships with a functioning `type="submit"` button but no
`onSubmit` handler and no `action`, so clicking it triggers a native
full-page form GET submission today — not an inert/no-op state. A secondary,
purely structural theme is that the 5 deferred case-study slugs/titles are
now hand-duplicated in three separate places (`router.tsx`, `coming-soon.tsx`,
`content/case-studies/deferred.ts`), which is a live desync risk the next
time that list changes.

## Critical Issues

### CR-01: Contact form submit button triggers a full-page reload (unguarded native form submission)

**File:** `src/components/home/Footer.tsx:40-64`
**Issue:** The Brief `<form>` (line 40) has no `onSubmit` handler and no
`action` attribute. Its submit control (lines 62-64) is `<Button variant="primary" type="submit">`; `Button`'s spread-prop order
(`<button type="button" {...rest}>` in `src/components/ui/Button.tsx`)
means the caller's `type="submit"` correctly overrides the default, so the
rendered `<button>` really is `type="submit"`. With no `onSubmit`/
`preventDefault` and no `action`, a real click on "Send the Brief →" makes
the browser perform its default form submission: a GET navigation to the
current URL. In the SPA this causes a full-page reload — losing all
client-side router state, GSAP/ScrollTrigger instances, and scroll
position — every time a visitor clicks the primary CTA of the Contact
section, which is one of the site's key conversion actions. This is
materially worse than doing nothing: it looks like the site crashed/reset.
The code comments correctly note that real submission wiring (CONT-01/
CONT-02) is deferred to Phase 4, but that only justifies omitting the
network call — it doesn't justify omitting `preventDefault`, which is
needed regardless of whether the eventual submit action exists yet.
**Fix:**
```tsx
// Footer.tsx
<form
  className="flex flex-col gap-md mt-lg"
  onSubmit={(e) => {
    // Real delivery/feedback wiring is Phase 4 (CONT-01/CONT-02).
    // Prevent the default native GET submission/page-reload until then.
    e.preventDefault();
  }}
>
```

## Warnings

### WR-01: Deferred case-study slug/title data duplicated across three files

**File:** `src/router.tsx:22`, `src/routes/coming-soon.tsx:18-24`, `src/content/case-studies/deferred.ts:24-30`
**Issue:** The same 5 deferred-project slugs (and, in two of the three
places, their display titles) are hand-typed independently in three
locations:
- `router.tsx:22` — `DEFERRED_SLUGS = ['riyaah', 'icici-bank-atm-kiosk', 'ambit', 'northernarc', 'citrus']` (slugs only, used to build the literal routes)
- `coming-soon.tsx:18-24` — `DEFERRED_TITLES` record (slug → title, used for the sr-only `<h1>`)
- `deferred.ts:24-30` — `deferredCaseStudies` (slug + title, used by `SelectedWork`'s "see more" grid)

`deferred.ts` already exports exactly the `{ slug, title }` pairs that
`coming-soon.tsx` re-declares by hand, and `router.tsx` re-declares the
slugs a third time. Nothing enforces these three lists staying in sync;
adding/renaming/removing a deferred project requires editing all three
correctly, and there is no compile-time or runtime check that catches a
missed spot (e.g. router.tsx gains/loses a route while `deferred.ts`'s
grid and `coming-soon.tsx`'s title map silently diverge, producing
mismatched titles between the Selected Work card and its own Coming Soon
page, or a "see more" card that 404s).
**Fix:** Derive `router.tsx` and `coming-soon.tsx` from the single
`deferredCaseStudies` export instead of re-typing the list:
```tsx
// router.tsx
import { deferredCaseStudies } from './content/case-studies/deferred';

const DEFERRED_SLUG_ROUTES = deferredCaseStudies.map(({ slug }) => ({
  path: `case-study/${slug}`,
  element: <ComingSoonRoute slug={slug} />,
}));
```
```tsx
// coming-soon.tsx
import { deferredCaseStudies } from '../content/case-studies/deferred';

const DEFERRED_TITLES: Record<string, string> = Object.fromEntries(
  deferredCaseStudies.map(({ slug, title }) => [slug, title])
);
```

### WR-02: Brief form fields have no `name` attribute

**File:** `src/components/home/Footer.tsx:45,52,59`
**Issue:** The three form controls (`workingOn` text input, `email` input,
`clarify` textarea) each have an `id` (for label association) but no
`name` attribute. Unnamed form controls are excluded from a native
`FormData`/URL-encoded submission entirely — combined with CR-01, a user
who submits today gets a page reload that carries none of what they typed.
Once Phase 4 wires this up (whether via `FormData` or a controlled-input
read), the fields will need `name` (or explicit `useState` bindings) to be
usable; adding it now costs nothing and removes one more thing to
remember later.
**Fix:**
```tsx
<input id={workingOnId} name="workingOn" type="text" className={fieldClasses} />
<input id={emailId} name="email" type="email" required className={fieldClasses} />
<textarea id={clarifyId} name="clarify" rows={4} className={fieldClasses} />
```

## Info

### IN-01: Decorative placeholder icon not marked `aria-hidden`

**File:** `src/components/case-study/ImagePlaceholder.tsx:37`
**Issue:** `<ImageOff className="text-muted-foreground" />` renders next
to a `Label` that already carries the same information as visible text
(the caption). The icon is purely decorative in that context but isn't
explicitly hidden from assistive tech via `aria-hidden="true"`, so screen
readers that do surface untitled SVGs may announce a redundant/ambiguous
node ahead of the caption text.
**Fix:** `<ImageOff aria-hidden="true" className="text-muted-foreground" />`

### IN-02: Real and deferred case-study cards duplicate near-identical JSX

**File:** `src/components/home/SelectedWork.tsx:32-54`
**Issue:** The real-case-study `.map()` block (lines 32-42) and the
deferred-case-study `.map()` block (lines 44-54) render structurally
identical `Card` markup (image placeholder, heading, secondary label,
optional body, "View case study" button), differing only in which fields
are available. A future layout/styling change to one card type is easy to
apply inconsistently to the other since there's no shared render helper.
**Fix:** Extract a small shared `renderCaseStudyCard(props)` helper (or a
`CaseStudyCard` component accepting an optional `client`/`summary`) used
by both `.map()` calls.

### IN-03: "See more" toggle lacks `aria-controls`

**File:** `src/components/home/SelectedWork.tsx:57-63`
**Issue:** The expand/collapse button sets `aria-expanded={expanded}` but
has no `aria-controls` pointing at the grid `<div>` it shows/hides, so
assistive tech can't programmatically associate the button with the
region it toggles.
**Fix:** Give the grid `<div>` a stable `id` (e.g. `id="selected-work-grid"`)
and add `aria-controls="selected-work-grid"` to the toggle `Button`.

### IN-04: Fixed-index content-array access has no compile-time length guarantee

**File:** `src/components/home/ProofStrip.tsx:26-56`, `src/components/home/HowIWork.tsx:26-65`, `src/components/home/SkillsTools.tsx:26-51`, `src/components/home/Footer.tsx:106-107`
**Issue:** These components deliberately index into content-module arrays
by fixed literal position (`proofStripContent.stats[0..3]`,
`howIWorkContent.actionWords[0..5]` / `loopSteps[0..4]`,
`skillsToolsContent.cards[0..4]`, `footerContent.legal[0..1]`) rather than
`.map()`-ing over them, per the documented D-02/D-03 "guaranteed fixed
count/order" decisions. The content modules type these fields as plain
`string[]` / `T[]`, not fixed-length tuples, so TypeScript can't catch a
content edit that shortens one of these arrays — it would only surface as
a runtime `undefined` crash in that section (caught today by each
component's own unit test asserting array length, but not by the type
system). Not a current bug; flagging as a latent maintainability trap for
whoever edits `content/*.ts` next without re-running tests.
**Fix (optional):** Type these arrays as fixed-length tuples
(`[ProofStat, ProofStat, ProofStat, ProofStat]`, etc.) so a shortened
array fails `tsc` instead of only failing at runtime/test time.

---

_Reviewed: 2026-07-30T12:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
