<!-- refreshed: 2026-07-21 -->
# Architecture

**Analysis Date:** 2026-07-21

## Status: No Built Application Yet

This repository is **pre-code**. There is no application, no framework installed, no build tooling, and no source directory (`src/`, `app/`, etc.). The repo currently contains:

1. Two static HTML **design-reference templates** (`Templates/Noema/`, `Templates/Axisform/`) — used purely as visual/style inspiration, not as a starting codebase to extend.
2. **Content and IA documents** (`Portfolio-Documentation/`) describing the intended structure and copy for the real portfolio site.
3. GSD tooling configuration (`.claude/`, `.codex/`, `.opencode/`, `.zcode/`, `.agents/`) supporting the planning workflow itself, not the portfolio site.

There is nothing to reverse-engineer architecturally yet. The sections below capture the **intended** site architecture as described in `Portfolio-Documentation/Information Architecture.md`, so future planning phases have a structural reference before any code exists.

## Intended Site Map (from Information Architecture.md)

```text
┌───────────────────────────────────────────────────────────────────────┐
│                    Homepage (single scroll)                            │
├─────────────┬───────────────┬───────────────────────┬─────────────────┤
│    Hero     │  Proof Strip  │   Selected Work        │  How I Work     │
│             │ (logos/       │ (Top 6 case study      │ (process, not   │
│             │  industries + │  cards; rest via       │  "services")    │
│             │  credibility) │  Explore More [CMS])   │                 │
└─────────────┴───────────────┴───────────┬───────────┴─────────────────┘
                                            │
                                            ▼
                          ┌───────────────────────────────────────┐
                          │        Case Study Sub-Pages            │
                          │  /case-study/cad                       │
                          │  /case-study/verzion-cloud-migration   │
                          │  /case-study/tata-capital-ai-interface │
                          │  /case-study/mashreq                   │
                          │  /case-study/astrosure.ai               │
                          │  /case-study/adreport.io                │
                          │  /case-study/riyaah                     │
                          │  /case-study/icici-bank-atm-kiosk       │
                          │  /case-study/ambit                      │
                          │  /case-study/northernarc                │
                          │  /case-study/citrus                     │
                          └───────────────────────────────────────┘
┌───────────────────────────────────────────────────────────────────────┐
│  Skills & Tools │ About (compact — not a separate page) │ Contact/Footer│
│                  │                                        │ (résumé DL, │
│                  │                                        │  email,     │
│                  │                                        │  LinkedIn/  │
│                  │                                        │  Behance)   │
└───────────────────────────────────────────────────────────────────────┘
```

## Component Responsibilities (Intended)

| Section | Responsibility | Source Spec |
|---------|----------------|--------------|
| Hero | First impression / positioning statement | `Portfolio-Documentation/Information Architecture.md` |
| Proof Strip | Credibility signal — logos, industries worked in, markers | `Portfolio-Documentation/Information Architecture.md` |
| Selected Work | Surfaces top 6 case studies on homepage; links to full case-study list via CMS-driven "Explore more" | `Portfolio-Documentation/Information Architecture.md` |
| Case Study Sub-Pages (x11) | Deep-dive project pages, one per case study slug | `Portfolio-Documentation/Information Architecture.md`, `Portfolio-Documentation/Project Page- Template.md` |
| How I Work | Communicates process/methodology (explicitly not framed as "services") | `Portfolio-Documentation/Information Architecture.md` |
| Skills & Tools | Lists design skills and tooling | `Portfolio-Documentation/Information Architecture.md` |
| About | Compact bio, intentionally not a separate page/route | `Portfolio-Documentation/Information Architecture.md` |
| Contact / Footer | Résumé download, email, LinkedIn/Behance links | `Portfolio-Documentation/Information Architecture.md` |

## Pattern Overview (Intended)

**Overall:** Single-scroll marketing homepage + a set of individual case-study detail pages (list-detail pattern). This resembles a typical portfolio/agency site: one long-form homepage assembled from stacked sections, with 11 known case-study routes branching off "Selected Work."

**Key Characteristics (from IA doc):**
- Homepage is a single continuous scroll, not a multi-page nav-driven site for top-level sections.
- "About" is deliberately kept compact and inline on the homepage rather than promoted to its own route — a stated content/IA decision, not a technical constraint.
- Case studies are the only true sub-pages/routes currently planned; homepage sections are anchors/blocks, not separate routes.
- "Selected Work" surfaces only 6 of the 11 case studies directly; the rest are reachable via an "Explore more" affordance implying some CMS-like or list-driven data source (mentioned as `[CMS]` in the source doc — not yet decided/implemented).
- Section naming deliberately avoids typical portfolio-site jargon (e.g., "How I Work" instead of "Services") — a content/positioning choice future implementation should preserve verbatim.

## Content & Copy Sources (for future implementation reference)

- Site map / structure: `Portfolio-Documentation/Information Architecture.md`
- Homepage copy: `Portfolio-Documentation/Homepage Copy V2.md`
- Case study page template/copy structure: `Portfolio-Documentation/Project Page- Template.md`

## Design/Visual References (not architectural code)

- `Templates/Noema/Noema Artist Portfolio.html` + `Templates/Noema/Noema Artist Portfolio Design.md` — static HTML mockup + design spec, style reference only.
- `Templates/Axisform/Axisform Studio Landing Page.html` + `Templates/Axisform/Axisform Studio Design.md` — static HTML mockup + design spec, style reference only.

These templates are **not** intended to be forked, extended, or used as the technical foundation for the real site — they exist purely to inform visual direction (layout, typography, color, motion) during design/build decisions.

## Open Architectural Decisions (not yet made)

- No framework/stack chosen yet (e.g., static site generator vs. React/Next.js vs. plain HTML/CSS).
- No decision on how the "Explore more [CMS]" case-study list is sourced (headless CMS, static JSON/MDX, hardcoded array, etc.).
- No hosting/deployment target decided.
- No routing strategy defined for the 11 `/case-study/*` pages (file-based routing, dynamic route + data file, etc.).

## Cross-Cutting Concerns

**Logging:** Not applicable — no application exists.
**Validation:** Not applicable — no application exists.
**Authentication:** Not applicable — public portfolio site, no auth expected per IA doc.

---

*Architecture analysis: 2026-07-21*
