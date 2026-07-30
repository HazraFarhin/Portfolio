# Phase 3: Homepage Build - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-30
**Phase:** 3-Homepage Build
**Areas discussed:** Copy reconciliation, About & Skills/Tools content, "See more" mechanism, Footer résumé link

---

## Copy reconciliation

| Question | Option | Selected |
|----------|--------|----------|
| Studio Method placement | Fold into How I Work | ✓ |
| Studio Method placement | Cut for v1 | |
| Studio Method placement | You decide | |
| Operating Stack services grid | Cut entirely | |
| Operating Stack services grid | Fold into Skills & Tools | ✓ |
| Operating Stack services grid | Keep as its own section | |
| Field Archive gallery | Cut for v1 | |
| Field Archive gallery | Include with placeholders | ✓ |
| Field Notes + Engage | Cut both for v1 | ✓ |
| Field Notes + Engage | Fold Field Notes into About | |
| Field Notes + Engage | Keep both as extra sections | |
| Contact/Brief form scope | Static form UI only | ✓ |
| Contact/Brief form scope | Skip form, just links | |
| Navigation bar | Yes, build it | ✓ |
| Navigation bar | No, out of scope | |

**User's choice:** Fold Studio Method into How I Work; fold Operating Stack into Skills & Tools; include Field Archive with placeholders; cut Field Notes and Engage entirely; build static contact form UI only (Phase 4 wires delivery); build a persistent nav bar.
**Notes:** Operating Stack was deliberately NOT folded into How I Work despite both being "process" content, because PROJECT.md explicitly frames How I Work as "not services" — Operating Stack's services framing was routed to Skills & Tools instead.

---

## About & Skills/Tools content

| Question | Option | Selected |
|----------|--------|----------|
| Skills & Tools scope | Capability areas only | |
| Skills & Tools scope | Capability areas + tool chips | ✓ |
| About source | Condense Hero statement + PROJECT.md bio | ✓ |
| About source | New copy needed — flag for Hazra | |
| Tool chip source | Aggregate from case-study tags | ✓ |
| Tool chip source | Curated standalone list | |
| About photo | Text only | |
| About photo | Text + placeholder image block | ✓ |

**User's choice:** Skills & Tools = 5 Operating Stack cards + tool chips aggregated from case-study frontmatter tags. About = condensed bio from Hero statement + PROJECT.md context, with a placeholder headshot block.
**Notes:** No changes requested after initial answers — area completed in one round of 4 questions.

---

## "See more" mechanism

| Question | Option | Selected |
|----------|--------|----------|
| Deferred-slug entry style | Non-clickable name-only entries | |
| Deferred-slug entry style | Cards linking to a "coming soon" state | ✓ |
| Expansion interaction | Inline expand within the grid | ✓ |
| Expansion interaction | Separate list below the grid | |

**User's choice:** Cards linking to a coming-soon state, expanding inline within the Selected Work grid.
**Notes:** This choice was flagged as conflicting with DEPL-03 (Phase 4 requirement: the 5 deferred slugs must not be linked from any page). The conflict was surfaced explicitly with a follow-up question offering "switch to non-clickable" vs. "build now, unlink in Phase 4." The user's first response ("save for later") was clarified via a confirmation question, then the user explicitly re-affirmed "clickable now, unlinked in Phase 4" as the final answer — recorded as D-11 in CONTEXT.md with a mandatory Phase 4 follow-up obligation.

---

## Footer résumé link

| Question | Option | Selected |
|----------|--------|----------|
| Résumé link approach | Link to placeholder path now | |
| Résumé link approach | Omit until Phase 4 | |
| Résumé link approach | (freeform) pointed to real file: `Hajra Farhin Resume UX.docx` | ✓ |
| Résumé format handling | Convert to PDF now, ship real link | ✓ |
| Résumé format handling | Link to placeholder, convert later | |

**User's choice:** A real résumé source file exists at the repo root (`Hajra Farhin Resume UX.docx`) — convert it to PDF now and ship a fully working footer download link in Phase 3, rather than a placeholder.
**Notes:** This discovery changed the original placeholder-vs-omit framing entirely — neither original option applied once a real file was found.

---

## Claude's Discretion

- Exact visual placement/order of the nav bar, Field Archive gallery, and Studio Method action-words relative to the 7 IA-locked sections.
- Exact wording of the condensed About bio (within the source constraint).
- Visual treatment of the "coming soon" state for deferred-slug routes.
- Exact tool-chip rendering (pills, inline list, icons).
- Exact `.docx`→PDF conversion method, as long as content is preserved faithfully.
- Internal component/file structure for all new homepage sections.

## Deferred Ideas

- Field Notes (6 principle cards) and Engage (3 engagement-model cards) — cut for v1, could be reconsidered for a future iteration.
- DEPL-03 link removal for the 5 deferred slugs — explicit required follow-up for Phase 4 (not a "maybe," a locked cross-phase obligation created by D-11).
