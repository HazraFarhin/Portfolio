# Requirements: Hazra Farhin — Portfolio Website

**Defined:** 2026-07-21
**Core Value:** A recruiter, hiring manager, or prospective client can understand Hazra's design capability and process within minutes through fast, credible, case-study-driven work — clarity of work over decoration.

## v1 Requirements

### Homepage

- [ ] **HOME-01**: User can view a hero section stating role, specialization, and availability status above the fold
- [ ] **HOME-02**: User can view a proof strip with concrete stats (years, industries, regions, measurable outcome)
- [ ] **HOME-03**: User can view a "Selected Work" grid showing the first 6 featured case studies in Information Architecture order (cad, verzion-cloud-migration, tata-capital-ai-interface, mashreq, astrosure.ai, adreport.io)
- [ ] **HOME-04**: User can reveal the remaining 5 case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) via a "see more" expansion
- [ ] **HOME-05**: User can view a "How I Work" section describing process (not framed as "services")
- [ ] **HOME-06**: User can view a "Skills & Tools" section
- [ ] **HOME-07**: User can view a compact "About" section (not a separate page)
- [ ] **HOME-08**: User can view a footer with résumé download link, contact info, and social links (LinkedIn, Behance)

### Case Studies

- [ ] **CASE-01**: User can navigate to a full case-study page for each of the 6 featured projects
- [ ] **CASE-02**: Each case-study page displays Overview, Tools Used, Outcome & Impact, Challenge, Process, Solution, and Learnings & Reflections sections per `Project Page- Template.md`
- [ ] **CASE-03**: Each case-study page states role/outcome visibly near the top so it can be skimmed in seconds
- [ ] **CASE-04**: Case-study content is stored as file-based, typed data (e.g. Markdown+frontmatter) so adding a new case study is a content-only change

### Contact & Resume

- [ ] **CONT-01**: User can submit a 3-field contact form ("What are you working on?", Email, "What needs to become clearer?") and have it delivered to Hazra's inbox via an email service
- [ ] **CONT-02**: User receives clear success/error feedback after submitting the contact form
- [ ] **CONT-03**: User can download Hazra's résumé as a PDF
- [ ] **CONT-04**: User can reach Hazra directly via email, LinkedIn, and Behance links in the footer

### Motion, Performance & Accessibility

- [ ] **QUAL-01**: User experiences GSAP/Lenis-driven scroll motion matching the Axisform reference's language (smooth-scroll, parallax, glass-morphism reveals) without breaking native scroll/keyboard navigation
- [ ] **QUAL-02**: User with `prefers-reduced-motion` enabled sees all non-essential motion disabled automatically
- [ ] **QUAL-03**: User on mobile experiences a deliberately simplified motion treatment, not a scaled-down desktop experience
- [ ] **QUAL-04**: Site meets baseline accessibility (semantic headings, alt text, keyboard navigation, visible focus states, adequate contrast)
- [ ] **QUAL-05**: Site meets a performance budget (fast load, no layout-shift-inducing reveal animations, code-split animation libraries)

### Deployment

- [ ] **DEPL-01**: Site is deployed and publicly accessible on Vercel or Netlify
- [ ] **DEPL-02**: Case-study routes work correctly on direct load/refresh (SPA rewrite rules configured)
- [ ] **DEPL-03**: The 5 deferred case-study routes are not publicly linked or indexed until their content exists

## v2 Requirements

Deferred to future release. Tracked but not in current roadmap.

### Case Studies

- **CASE-V2-01**: Full case-study pages for the 5 deferred projects (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus)
- **CASE-V2-02**: In-page anchor navigation within case-study pages (jump to Outcome/Solution)

### Analytics

- **ANLY-V2-01**: Analytics on case-study engagement/scroll depth

## Out of Scope

Explicitly excluded. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Headless CMS with editor UI | File-based content chosen instead; no non-technical editing UI needed for v1 |
| Password-gated / NDA-anonymized case studies | Anti-feature for a job-search-primary site; adds friction vs. open competing portfolios. Only defensible if a real NDA requires it |
| "Available for work" animated status widget | Unverified pattern for personal portfolios (marketplace-specific precedent only); static text in copy is sufficient |
| Full-screen intro/loader animation | Directly hurts LCP and delays relevance assessment; named anti-pattern across research sources |
| Autoplay hero/background video | Hurts performance and accessibility; not requested |
| Scroll-jacking / fully hijacked scroll navigation | Breaks native scroll semantics, keyboard nav, and screen-reader scroll — conflicts with accessibility requirements |
| Noema visual direction | Axisform's interaction language was explicitly chosen instead |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HOME-01 | TBD | Pending |
| HOME-02 | TBD | Pending |
| HOME-03 | TBD | Pending |
| HOME-04 | TBD | Pending |
| HOME-05 | TBD | Pending |
| HOME-06 | TBD | Pending |
| HOME-07 | TBD | Pending |
| HOME-08 | TBD | Pending |
| CASE-01 | TBD | Pending |
| CASE-02 | TBD | Pending |
| CASE-03 | TBD | Pending |
| CASE-04 | TBD | Pending |
| CONT-01 | TBD | Pending |
| CONT-02 | TBD | Pending |
| CONT-03 | TBD | Pending |
| CONT-04 | TBD | Pending |
| QUAL-01 | TBD | Pending |
| QUAL-02 | TBD | Pending |
| QUAL-03 | TBD | Pending |
| QUAL-04 | TBD | Pending |
| QUAL-05 | TBD | Pending |
| DEPL-01 | TBD | Pending |
| DEPL-02 | TBD | Pending |
| DEPL-03 | TBD | Pending |

**Coverage:**
- v1 requirements: 24 total
- Mapped to phases: 0
- Unmapped: 24 ⚠️ (to be resolved by roadmap creation)

---
*Requirements defined: 2026-07-21*
*Last updated: 2026-07-21 after initial definition*
