---
phase: 03
slug: homepage-build
status: verified
threats_open: 0
asvs_level: 1
created: 2026-07-31
---

# Phase 03 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| None crossed (Nav, Proof Strip, Field Archive) | Static developer-authored TS content-module strings only | None |
| SelectedWork.tsx → internal routes | Same-origin `/case-study/<slug>` hrefs, no user input drives the href | None (internal navigation only) |
| None crossed (Skills & Tools, About) | Static content + build-time computed tag aggregation | None |
| Client-side route table (coming-soon routes) | Literal, developer-authored path strings | None |
| Human-provided real-world content (résumé, URLs) | Résumé PDF and social URLs supplied directly by site owner (Hazra), not derived from untrusted input | Public professional content |
| Footer.tsx → third-party origins | LinkedIn, Behance, Website links navigate to external, human-confirmed origins outside app control | Outbound navigation only |
| Contact form → nowhere (this phase) | 3 form fields collect no data and submit nowhere this phase (D-07); Phase 4 (CONT-01) adds the real submission boundary | None (no handler wired) |
| None new (home.tsx composition) | Composition-only change, no new rendering logic or external surface | None |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-03-01 | Tampering / Spoofing | Footer.tsx `target="_blank"` external links | high | mitigate | Every `target="_blank"` anchor pairs with `rel="noopener noreferrer"` — verified via grep count match in 03-REVIEW.md and 03-VERIFICATION.md (2 and 2, equal) | closed |
| T-03-02 | Denial of Service (accessibility) | FieldArchive.tsx scroll container | medium | mitigate | Native `overflow-x-auto` + `role="region"`/`aria-label`/`tabIndex={0}`; zero `pin`/`containerAnimation` config — verified via grep (0 matches) in 03-VERIFICATION.md | closed |
| T-03-03 | Information Disclosure / Tampering | Nav.tsx, ProofStrip.tsx, FieldArchive.tsx | low | accept | All rendered strings are typed TS literals, never `dangerouslySetInnerHTML` or markdown-rendered user content | closed |
| T-03-04 | Information Disclosure | deferred.ts `[ASSUMED]` humanized titles | low | accept | Purely cosmetic display copy, explicitly flagged `[ASSUMED]` in code; no fabricated client/industry/summary data | closed |
| T-03-05 | Tampering | SelectedWork.tsx toggle state | low | accept | Local `useState` UI toggle only, no persisted state, no trust-boundary crossing | closed |
| T-03-06 | Information Disclosure | About.tsx bio/headshot placeholder | low | accept | Intentionally public-facing professional copy; no PII beyond what Hero/résumé already state publicly | closed |
| T-03-07 | Tampering | ImagePlaceholder.tsx additive change | low | accept | Pure addition to existing union; full pre-existing test suite still passes, guarding against regression | closed |
| T-03-08 | Tampering / Spoofing | router.tsx 5 literal deferred routes | low | accept | Hardcoded literal path strings from a fixed, developer-authored array; no user-controlled route registration | closed |
| T-03-09 | Information Disclosure | 5 deferred-slug routes temporarily publicly reachable | medium | accept | Explicit, user-approved cross-phase tradeoff (D-11); logged in STATE.md as required Phase 4 (DEPL-03) follow-up | closed |
| T-03-10 | Information Disclosure | Résumé source `.docx` committed alongside derived PDF | low | accept | Résumé content is intentionally public-facing (job-search site); no NDA/sensitive data; deliberate documented choice | closed |
| T-03-11 | Information Disclosure | Contact form fields (markup only, D-07) | low | accept | No submission handler exists this phase — no data ever leaves the browser; CONT-01 (Phase 4) owns real validation/sanitization | closed |
| T-03-12 | Tampering | home.tsx composition | low | accept | Composition-only change; every mounted component already verified in its own plan; `dangerouslySetInnerHTML` grep returns 0 across the phase | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (high) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| R-03-01 | T-03-04 | Deferred case-study titles are `[ASSUMED]`-flagged cosmetic copy, no fabricated real data | Plan 03-02 (design decision) | 2026-07-30 |
| R-03-02 | T-03-09 | 5 deferred routes temporarily publicly reachable — explicit user-approved cross-phase tradeoff (D-11), Phase 4/DEPL-03 to resolve | User (via plan 03-04) | 2026-07-30 |
| R-03-03 | T-03-11 | Contact form has no submission handler this phase — no data leaves the browser; Phase 4/CONT-01 owns real handling | Plan 03-06 (design decision, D-07) | 2026-07-30 |
| R-03-04 | T-03-03, T-03-05, T-03-06, T-03-07, T-03-08, T-03-10, T-03-12 | Low-severity, no-trust-boundary-crossing items: static content, local UI state, additive/composition-only changes, intentionally public professional content | Plans 03-01, 03-02, 03-03, 03-04, 03-05, 03-07 | 2026-07-30 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-31 | 12 | 12 | 0 | Claude (gsd-secure-phase, L1 grep-depth via existing 03-REVIEW.md/03-VERIFICATION.md evidence) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-31
