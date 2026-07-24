# Phase 2: Content Layer & Case-Study Template - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-24
**Phase:** 2-Content Layer & Case-Study Template
**Areas discussed:** Content authoring status, Content format & tooling, Template rendering & composition, Deferred-slug scope boundary

---

## Content Authoring Status (real client content does not exist)

| Option | Description | Selected |
|--------|-------------|----------|
| Structurally-complete placeholder copy | Realistic, clearly-draft-quality placeholder content for all 6 slugs (generic role/process/outcome language, no invented client-specific metrics/claims) so the template/loader/validation is fully proven end-to-end; real copy swapped in later | ✓ |
| One real worked example + stubs | Fully build one of the 6 using real detail supplied live; leave the other 5 as minimal draft stubs | |
| Schema/template only, zero content | Build against a dummy test fixture; leave all 6 real slugs unauthored | |

**User's choice:** Structurally-complete placeholder copy (recommended option, explicitly confirmed via AskUserQuestion — this was the one gray area escalated to the user rather than auto-selected, given the risk of fabricating professional claims about real named clients).
**Notes:** No real case-study copy or images exist anywhere in the repo (confirmed by full-repo search). Placeholder content must avoid inventing client-specific metrics/quotes attributed as fact, and should carry a visible (but unobtrusive) draft-status signal — see CONTEXT.md D-01/D-02/D-03.

---

## Content Format & Tooling

[auto] Area — Q: "Should case-study content be authored as Markdown+frontmatter files, MDX, or plain TypeScript/JSON data modules?" → Selected: "Markdown + YAML frontmatter per file, parsed via a typed schema validator, loaded via Vite's `import.meta.glob`" (recommended default — matches CASE-04's own literal example, keeps the site fully static per the no-headless-CMS constraint, and full JSX-in-content power of MDX isn't needed since sections are structured, not freeform).

**Notes:** Captured as D-04/D-05/D-06 in CONTEXT.md. Exact validation library (Zod vs. alternative) left to Claude's Discretion.

---

## Template Rendering & Composition

[auto] Area — Q: "Should the case-study template be one monolithic page component, or composed of small per-section subcomponents reusing Phase 1's UI primitives?" → Selected: "One `CaseStudyPage` route component composing small per-section subcomponents (Overview, Tools Used, Outcome & Impact, Challenge, Process, Solution, Learnings), built on Phase 1's Button/Card/Typography primitives" (recommended — matches Phase 1's own established composition pattern and avoids one-off styling).

[auto] Area — Q: "Should case-study section subcomponents also be designed for reuse by Phase 3's homepage 'Selected Work' cards?" → Selected: "Not locked in this phase — left as Phase 3's decision" (recommended — avoids over-constraining Phase 3's card design before it's discussed, since a homepage preview card likely needs a much more condensed view than any full-page section component).

**Notes:** Captured as D-07/D-08/D-09 in CONTEXT.md. CASE-03 (role/outcome skimmable above the fold) directly drives D-08's Overview-section-first ordering.

---

## Scope Boundary — Deferred Slugs

[auto] Area — Q: "Does this phase stub out routes/content placeholders for the 5 deferred case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus), or leave them entirely untouched?" → Selected: "Leave entirely untouched — no content files, no routes, no stubs" (recommended — matches PROJECT.md's Out of Scope entry and Phase 2's requirements, which only reference the 6 featured projects; gating deferred slugs out of nav/sitemap is explicitly Phase 4's job per ROADMAP.md).

**Notes:** Captured as D-10 in CONTEXT.md. Reconfirms the STATE.md Deferred Items entry from milestone requirements definition.

---

## Claude's Discretion

- Exact schema-validation library (Zod vs. Valibot vs. other lightweight runtime validator)
- Internal file/folder structure for content files and the loader module
- Exact wording/tone of placeholder copy per case study (draft-quality, generic, non-fabricated)
- Visual treatment of the draft-content marker
- Internal component API/props shape for section subcomponents

## Deferred Ideas

- Reusing case-study section subcomponents for homepage preview cards — left for Phase 3 to decide
- Full pages for the 5 deferred case studies — already tracked in STATE.md Deferred Items, reconfirmed out of scope here
