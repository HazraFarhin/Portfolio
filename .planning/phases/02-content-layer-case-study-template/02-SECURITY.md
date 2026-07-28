---
phase: 02
slug: content-layer-case-study-template
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-28
---

# Phase 02 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry -> local node_modules | Supply-chain trust boundary crossed at install time for zod, js-yaml, react-markdown, @types/js-yaml | Third-party package code |
| Content author (Hazra) -> rendered page | First-party-authored Markdown/YAML frontmatter, not user-submitted | Case-study copy, frontmatter fields |
| Raw `.md` file text -> parsed/validated in-memory object | Content-integrity boundary between file contents and the app's typed data | Frontmatter + body markdown |
| Parsed markdown-body section string -> react-markdown -> DOM | Content rendered without `dangerouslySetInnerHTML` or `rehype-raw` | Markdown body prose (ToolsUsed, OutcomeImpact, Solution, Challenge, LearningsReflections) |
| Validated frontmatter field values -> Overview's rendered `<a href>` | `external_link` already schema-validated/scheme-restricted before reaching this component | External link URL |
| URL path segment (`:slug`) -> `getCaseStudyBySlug()` lookup -> rendered page | The one place an arbitrary browser-navigable string (not first-party content) reaches the app | User-typed/bookmarked URL slug |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-02-SC | Tampering | npm install (zod, js-yaml, react-markdown, @types/js-yaml) | high | mitigate | Package Legitimacy Audit (02-RESEARCH.md) ran for all four packages; the one [SUS]-flagged package (js-yaml) required a blocking `checkpoint:human-verify` before install, never auto-approved | closed |
| T-02-01 | Repudiation / Tampering | Placeholder copy misrepresenting real named clients as fact | medium | mitigate | Copy Tone Guidance (D-01) followed literally: qualitative-only Outcome & Impact bullets, no invented percentages, no pull-quote fabrication | closed |
| T-02-02 | Tampering | Frontmatter values later validated by Zod schema | low | accept | Field-name mismatch surfaces as a build/dev-time schema-validation error in the loader, not a silent runtime failure | closed |
| T-02-03 | Tampering | `external_link` frontmatter field reaching an `<a href>` | medium | mitigate | Zod `.refine()` restricts `external_link` to `http://`/`https://` only, closing the `javascript:`-scheme gap `.url()` alone would allow | closed |
| T-02-04 | Tampering | Unrecognized/extra frontmatter keys silently accepted | low | mitigate | `CaseStudyFrontmatterSchema` uses `.strict()` — unexpected keys fail validation loudly at parse time | closed |
| T-02-05 | Tampering (data integrity) | Broken/malformed frontmatter silently reaching production | low | accept | `parseCaseStudyFile()` throws immediately on invalid frontmatter (fail-fast); per-file isolation is the loader's responsibility (T-02-13) | closed |
| T-02-06 | Tampering | react-markdown rendering of ToolsUsed/OutcomeImpact section strings | low | accept | react-markdown renders to React elements, never executing embedded raw HTML (no `rehype-raw` plugin); content is author-controlled | closed |
| T-02-09a | Tampering | react-markdown rendering of the `sections.solution` string | low | accept | Same shared mitigation as T-02-06 | closed |
| T-02-10 | Tampering (structural integrity) | Malformed/partial `stages` prop causing variable-length/reordered render | low | mitigate | Rendering iterates a hardcoded 5-item descriptor array, never `Object.keys`/`Object.entries` on the prop | closed |
| T-02-11 | Tampering | Overview rendering `external_link` into two `<a href>` elements | low | accept | Value already schema-validated and scheme-restricted by the parse layer (T-02-03) before reaching this component | closed |
| T-02-12 | Spoofing (structural) | Overview row order depending on iteration/object-key order | low | mitigate | Rows are 6 literal, hardcoded JSX elements in fixed order, never generated via `Object.entries()` | closed |
| T-02-13 | Denial of Service | `loadCaseStudiesFromRawFiles` / module-level `caseStudies` export | medium | mitigate | Per-file `try/catch` isolates each file's parse/validation outcome — one malformed `.md` file is logged and skipped, never blocking the other 5 | closed |
| T-02-14 | Information Disclosure | `console.error` logging of caught per-file parse errors | low | accept | Logs are dev/browser-console only; content is first-party-authored, not user-submitted, so no sensitive data can leak | closed |
| T-02-15 | Denial of Service | `CaseStudyPage` crashing on an unmatched/deferred slug | high | mitigate | `getCaseStudyBySlug(slug)` returning `undefined` is explicitly branched before any field access — not-found fallback renders instead of a `TypeError` | closed |
| T-02-16 | Denial of Service | Empty/missing `:slug` segment reaching no matching route | medium | mitigate | Sibling catch-all `{ path: '*' }` route renders `NotFoundRoute` for any unmatched path | closed |
| T-02-17 | Tampering (structural) | Section order depending on markdown heading order or object-key iteration | low | mitigate | `CaseStudyPage`'s 8 body sections are literal, hardcoded JSX elements in fixed order, never a `.map()` over parsed content | closed |
| T-02-18 | Tampering | Markdown content files (`src/content/case-studies/*.md`) — gap-closure blockquote addition (G-02-7) | low | accept | Content is first-party, author-written, version-controlled copy — same trust level as existing bullet lines; `react-markdown` escapes rendered output by default, no new XSS surface from adding `> ` blockquote lines | closed |

*Status: open · closed · open — below {block_on} threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-02-01 | T-02-02, T-02-05, T-02-06, T-02-09a, T-02-11, T-02-14, T-02-18 | All first-party-authored content (Hazra, per D-12), not user-submitted; react-markdown's default no-raw-HTML rendering closes the XSS vector for every markdown-rendering component in this phase | Plan-time threat model (all 10 plans) | 2026-07-28 |

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-28 | 19 | 19 | 0 | /gsd-secure-phase (short-circuit: threats_open=0, register_authored_at_plan_time=true, asvs_level=1) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-28
