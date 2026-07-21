# Feature Research

**Domain:** UX/UI designer personal portfolio (job search + freelance/consulting lead gen)
**Researched:** 2026-07-21
**Confidence:** MEDIUM (web search only, no MCP doc/verified providers configured this run; findings cross-checked across 3-10 independent articles per topic and are consistent with the project's own existing IA/copy/template)

## Feature Landscape

### Table Stakes (Users Expect These)

Features recruiters, hiring managers, and prospective clients assume exist. Missing these reads as unfinished or unprofessional, and the visitor bounces before reaching the work.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Deep, narrative case studies (3-6 shown) | Recruiters want evidence of *how you think* (problem framing, constraints, trade-offs, collaboration, impact) — not a visual-only gallery. This is the single most-cited expectation across all sources. | MEDIUM | Already planned: 6 featured case studies via `Project Page- Template.md` (Overview → Challenge → Process → Solution → Learnings). Structure matches research consensus well. |
| Skimmable case-study structure (headings, bullets, hierarchy) | Hiring managers decide whether to keep reading in the first 0-10 seconds and scan rather than read line-by-line; they're checking for framing, constraints, decisions, and impact, not prose. | LOW | Requires visual/typographic hierarchy discipline in implementation — the template's tabular Overview block and numbered Process steps already support this; make sure headings/metrics are front-loaded, not buried under prose. |
| Outcome/impact stated early and concretely | Case studies that hide the "so what" until the end lose the skim-reader. Sources agree: if the problem→decision→impact chain isn't visible fast, restructure. | LOW | Template already has an "Outcome & Impact" section — consider surfacing a one-line outcome even higher (e.g. in the card/one-line summary), which the template's "One-line summary" field already supports. |
| Downloadable résumé (PDF), linked prominently | Recruiters and ATS-adjacent workflows expect a PDF résumé; portfolio is expected to link to/from it, not replace it. A well-designed PDF is itself read as a design-skill signal. | LOW | Already in IA (Contact/Footer: "résumé download"). Keep it a real downloadable file, not a scroll-to-read embed only — PDF download plus optional inline preview is the safer pattern. |
| Simple, low-friction contact form (3-5 fields) | Freelance/job-search contacts convert best with minimal fields framed as "start a conversation," not a formal intake form. Long forms suppress completions. | LOW | Homepage Copy V2's "Brief" form (What are you working on / Email / What needs to become clearer) is already exactly this pattern — 3 fields, conversational framing. Validate this is not expanded later. |
| Multiple direct contact paths (email, LinkedIn, etc.) alongside the form | Recruiters/clients pre-qualify or self-select the fastest channel; the form isn't the only path they'll trust. | LOW | Already planned: footer contact block (email, phone, LinkedIn, Behance). |
| Fast load / good Core Web Vitals (LCP, CLS, INP) | Performance is read as a direct signal of design judgment for a *design* portfolio specifically — a shifting grid or laggy interaction undercuts credibility more than it would on a generic marketing site. | MEDIUM-HIGH | Direct tension with the chosen Axisform-style GSAP/Lenis motion direction — must budget for lazy-loaded images, code-split GSAP, and no layout-shift-inducing reveal animations. Flag as a phase-specific research/QA item. |
| Baseline accessibility (semantic headings, alt text, keyboard nav, visible focus states, contrast) | Same logic as performance: accessibility lapses are especially damaging for a UX/UI designer's own site, since the homepage copy explicitly claims "Accessible and compliant" (Field Notes #04) as a personal principle — the site must not contradict its own copy. | MEDIUM | This is a credibility-critical dependency: the "Accessible and compliant" claim in copy creates an implicit requirement the built site must satisfy, especially given heavy scroll/motion interactions (must offer `prefers-reduced-motion` handling, keyboard-operable nav/case-study cards, etc.). |
| Mobile-responsive layout | Universally expected baseline for any modern site; recruiters increasingly check portfolios on mobile between meetings. | LOW-MEDIUM | Cinematic/parallax homepage direction needs a deliberately simpler mobile treatment (reduced parallax, stacked cards) rather than a scaled-down desktop experience. |
| Clear "who is this / what do they do" above the fold | Recruiters decide relevance in seconds; hero must state role + specialization + value immediately. | LOW | Already covered by Hero copy (eyebrow + hero statement + "Available for new work" meta card). |
| Case-study visuals in context (not just static final screens) | Sources note that showing flows/interaction context (wireframes → hi-fi → outcome) signals process depth better than polished mockups alone. | MEDIUM | Template's Process section (Discovery → Define → Ideate → Design/Prototype → Test) already asks for supporting artifacts at each stage — make sure real projects populate all stages, not just final screens. |

### Differentiators (Competitive Advantage)

Features that set this portfolio apart from a "good enough" designer portfolio. Should reinforce the Core Value (fast, credible understanding of capability) — not just add polish for its own sake.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Explicit business-impact framing per case study (metrics + stakeholder/dev alignment narrative) | Most designer portfolios show UX craft only; framing decisions against *business* outcomes and developer/stakeholder alignment (as the homepage copy already does — "Card 04: Stakeholder & Developer Alignment") is less common and directly targets hiring managers and clients evaluating business judgment, not just visual taste. | MEDIUM | Already strongly present in existing copy (stats: "30% avg reduction," "8+ industries," proof strip). Keep this thread consistent inside each case study's Outcome section, not just on the homepage. |
| Honest "Learnings & Reflections" section per case study | Sources flag this explicitly: honesty about what would be done differently reads as credible/senior, versus purely promotional case studies. Most portfolios skip this or keep it superficial. | LOW | Already in the template — protect it from being cut for time; this is a differentiator specifically because it's commonly omitted. |
| Cross-market/localization signal (RTL, multi-region UX) | Distinct, verifiable differentiator vs. generic portfolios — most designers can't credibly claim shipped work across India/UAE/Saudi/Canada/USA with RTL-aware commerce UI. | LOW (content only) | Already present in copy (Field Archive caption "Component states, RTL-optimised commerce UI"; stats block "3 regions designed for"). No build complexity — just don't let it get diluted in final case-study writing. |
| Restrained, purposeful motion (not absent, not excessive) | Because the reference direction (Axisform) is cinematic/motion-heavy, doing it *well* — smooth, intentional, purposeful, respecting `prefers-reduced-motion` — differentiates from both static portfolios and from the many portfolios that overuse animation and get called out for it in nearly every "mistakes" article found. | MEDIUM-HIGH | This is the single biggest execution risk/opportunity in the project: the chosen visual direction is exactly the pattern most sources warn against when done poorly. Treat "motion done credibly" as a specific phase needing UI/motion review, not a generic dev task. |
| "Engagement models" section (Full-Time / Contract / Consulting) | Most personal portfolios target only full-time hiring; explicitly offering distinct engagement models (already drafted in copy section 10) is uncommon and directly serves the dual audience (recruiters + freelance/consulting clients) named in PROJECT.md. | LOW (content only) | Already drafted — no research contradicts this; reinforces the project's stated dual goal. |
| Condensed case-study summary/TL;DR at the top of each page | Not universally documented as a named pattern, but directly supported by the skim-behavior research (problem→decision→impact chain must be visible fast) and by the template's existing "One-line summary" field. | LOW | Consider promoting the existing "One-line summary" + Overview table even higher/more visually prominent than current template draft — effectively a built-in TL;DR, low cost to strengthen. |
| Proof strip with concrete stats (years, industries, regions, measurable outcome) | Numeric proof-of-scope strip is a stronger, faster credibility signal than prose bios; already drafted (Telemetry section) and matches "recruiters scan for metrics in the first 10 seconds" finding. | LOW (content only) | Already implemented in copy — no change needed, just don't cut it visually on mobile. |

### Anti-Features (Commonly Requested, Often Problematic)

Features that seem appealing but create real risk for this specific site, given research and the project's constraints.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| Cinematic full-screen intro/loader animation before content | Feels premium, matches "agency portfolio" aesthetic references (Axisform-style) | Directly named across multiple sources as a top mistake — adds a forced delay before the visitor can even assess relevance, and is one of the most common reasons designer portfolios get criticized; actively costs LCP. | Let the hero render immediately with motion applied progressively (elements animate in as they mount/scroll into view), never gate first paint behind an intro sequence. |
| Autoplay background/hero video | Feels cinematic, "shows personality" | Named directly in research as adding cognitive load, breaking accessibility, hurting performance/bandwidth, and often being disruptive rather than persuasive — especially risky combined with heavy GSAP/Lenis motion already planned. | If video is used at all (e.g. process B-roll), make it muted, short, user-triggered or paused-by-default with clear play affordance, and never load-blocking. |
| All-visual case studies with no narrative text (image dump / mockup gallery only) | Visually impressive, faster to produce than writing | Directly contradicts the primary finding across nearly every source: recruiters explicitly say they need problem framing, decisions, trade-offs, and impact in words, not just final screens — an image-only case study reads as junior or unable to reason about outcomes. | Enforce the existing template's text sections (Challenge, Process, Learnings) as required, not optional, for every published case study — never ship a case study missing them. |
| Scroll-jacking / fully custom scroll-hijacked navigation | Matches the "cinematic agency" reference feel | Heavy Lenis/GSAP scroll-hijacking can break expected scroll behavior (mouse wheel speed, trackpad momentum, keyboard/Page-Down, screen readers), directly conflicting with the accessibility table-stakes item and the copy's own "Accessible and compliant" claim. | Use Lenis for smooth-scroll easing only, preserve native scroll semantics and keyboard/focus order, and respect `prefers-reduced-motion` to disable non-essential motion entirely. |
| Password-gated / "request access" case studies | Common in agency portfolios protecting client NDAs, feels exclusive | For a job-search-primary site, gating the exact content recruiters need to scan in seconds adds friction that competing candidates' open portfolios don't have; only defensible if a real NDA requires it. | Default to open case studies; anonymize sensitive client specifics in copy (the template already supports "Client Name or Anonymized Description") instead of gating access. |
| "Available for work" gimmick badges/animated status widgets (e.g. live clock, animated pulsing dot tied to real-time availability) | Trend on freelance marketplaces (e.g. Upwork's Availability Badge) and some indie-hacker portfolios | No verified evidence this pattern transfers to personal portfolio sites or influences recruiter/client decisions (LOW confidence finding); risks looking gimmicky and requires ongoing manual maintenance to stay truthful, or the copy becomes stale/misleading. | Keep the existing static text approach already drafted ("Remote · CET to GST overlap · Available for new work" in the hero meta card, and the footer's "Available for on-site and remote engagements..." line) — simple, truthful, zero-maintenance. |
| Long-form single-page case studies with all content force-scrolled inline, no jump navigation | Simple to build, matches single-scroll homepage pattern | Contradicts the skim-behavior finding — recruiters want to jump straight to outcomes/decisions, not scroll linearly through a 1500-word narrative every time. | Add a lightweight in-page nav/anchor jump (Overview / Challenge / Process / Solution / Learnings) on case-study pages so skimmers can jump directly to Outcome or Solution. |
| Chasing exhaustive case-study count (publishing all 11 immediately) | Feels more complete/impressive | Research consensus caps ideal count around 3-5 *strong* case studies; more, thinner case studies dilute rather than strengthen the impression, and PROJECT.md already defers 5 of 11 due to unwritten copy. | Current plan (6 featured, "see more" reveal for the rest, 5 deferred to v2) already matches this — do not rush deferred copy just to hit a higher count. |

## Feature Dependencies

```
[Downloadable PDF Résumé]
    └──requires──> [Résumé content/design produced as a real file, not just written copy]

[Skimmable Case-Study Structure] (headings, TL;DR/summary, in-page anchor nav)
    └──requires──> [Project Page Template's existing section structure]
                       └──requires──> [Written case-study copy per project — 6 for v1, 5 deferred]

[Fast Load / Core Web Vitals] ──conflicts (in tension with, must be reconciled)──> [Cinematic GSAP/Lenis Motion Direction]

[Accessible / prefers-reduced-motion Handling] ──conflicts (in tension with, must be reconciled)──> [Scroll-hijacked / Heavy Parallax Motion]

[Restrained Purposeful Motion] ──enhances──> [Fast Load / Core Web Vitals]
[Restrained Purposeful Motion] ──enhances──> [Accessibility Baseline]

[Simple 3-field Contact Form] ──enhances──> [Multiple Direct Contact Paths] (form is one of several channels, not the only one)

[Honest Learnings Section] ──enhances──> [Deep Narrative Case Studies] (credibility signal within the required structure)

[Autoplay Video] (anti-feature) ──conflicts──> [Fast Load / Core Web Vitals]
[Autoplay Video] (anti-feature) ──conflicts──> [Accessibility Baseline]
[Full-Screen Intro Loader] (anti-feature) ──conflicts──> [Fast Load / Core Web Vitals]
[Scroll-Jacking] (anti-feature) ──conflicts──> [Accessibility Baseline]
```

### Dependency Notes

- **Skimmable Case-Study Structure requires the Project Page Template's section structure:** the template (Overview table, numbered Process steps, dedicated Outcome/Learnings sections) is the scaffolding that makes skim-reading possible — implementation should render these as visually distinct blocks with real heading hierarchy, not just markdown-to-HTML dump.
- **Fast Load conflicts with the cinematic GSAP/Lenis motion direction chosen from Axisform:** this is the most important dependency for roadmap ordering. A phase focused on "get motion right without hurting performance/accessibility" should be scoped explicitly (lazy-load below-fold animations, code-split GSAP, respect `prefers-reduced-motion`, avoid layout-shift-inducing reveals) rather than treated as a footnote of a general "build homepage" phase.
- **Restrained Purposeful Motion enhances both Fast Load and Accessibility:** getting motion right isn't just an anti-feature avoidance — it's the mechanism that reconciles the table-stakes performance/accessibility requirements with the differentiator of doing Axisform-style motion credibly. This should likely be its own review/QA checkpoint late in the relevant phase (visual/motion QA gate), not assumed to fall out of "just build it."
- **Autoplay Video and Full-Screen Intro Loader (anti-features) both conflict with Fast Load:** if either is ever proposed later (e.g. "let's add a hero video" during visual iteration), flag it against this researched conflict before accepting.
- **Simple Contact Form enhances Multiple Direct Contact Paths:** the 3-field form works specifically because it doesn't have to be the only channel — footer email/LinkedIn/Behance links de-risk the form being someone's sole way to reach out (already the plan).

## MVP Definition

### Launch With (v1)

Matches PROJECT.md's Active requirements — validated against research, no additions needed to the scope, only implementation-quality bars.

- [ ] Homepage (hero, proof strip, selected work, how-I-work, skills & tools, about, contact/footer) — table stakes, already scoped
- [ ] 6 featured case studies, full depth per `Project Page- Template.md` (Overview, Tools, Outcome, Challenge, Process, Solution, Learnings) — table stakes; research confirms this exact structure (problem→decisions→impact, narrative + visuals, honest learnings) is what recruiters actually read
- [ ] "See more" reveal for the remaining 5 slugs — table stakes for signaling full body of work without diluting the primary 6
- [ ] Downloadable résumé PDF + direct contact links (email, LinkedIn, Behance) in footer — table stakes
- [ ] 3-field contact form ("Send the Brief") wired to an email service — table stakes, matches conversion research (minimal fields, conversational framing)
- [ ] Deployed, publicly accessible, mobile-responsive — table stakes
- [ ] Baseline accessibility pass (semantic structure, alt text, keyboard nav, focus states, `prefers-reduced-motion` support) — table stakes given the copy's own "Accessible and compliant" claim
- [ ] Motion/performance budget for GSAP/Lenis (lazy-loaded assets, no CLS-inducing reveals, code-split animation libraries) — table stakes given performance is a credibility signal for a design portfolio specifically

### Add After Validation (v1.x)

- [ ] In-page anchor navigation within case-study pages (jump to Outcome/Solution) — add once real case-study copy length is known; may not be needed if case studies stay in the 800-1500 word range research recommends
- [ ] The 5 deferred case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) — trigger: copy gets written
- [ ] Analytics on which case studies get the most engagement/scroll depth — trigger: enough traffic to be meaningful, informs which projects to keep featured

### Future Consideration (v2+)

- [ ] Password-gated/NDA-anonymized case-study variant — defer unless a specific client requires it; anti-feature by default per research
- [ ] Any "live availability" widget — defer indefinitely; LOW-confidence, no evidence it changes outcomes for personal portfolios (Upwork-style badges are marketplace-specific, not portfolio-specific)

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|---------------------|----------|
| Deep narrative case studies (6, per template) | HIGH | HIGH (content-heavy) | P1 |
| Skimmable structure / hierarchy in case studies | HIGH | LOW | P1 |
| Downloadable résumé PDF | HIGH | LOW | P1 |
| Simple 3-field contact form | HIGH | LOW | P1 |
| Multiple direct contact channels (footer) | MEDIUM | LOW | P1 |
| Baseline accessibility (semantic/keyboard/contrast/reduced-motion) | HIGH | MEDIUM | P1 |
| Performance budget for motion (CWV-safe GSAP/Lenis) | HIGH | MEDIUM-HIGH | P1 |
| Mobile-responsive treatment of cinematic homepage | HIGH | MEDIUM | P1 |
| Honest "Learnings" section per case study | MEDIUM-HIGH | LOW | P1 |
| "See more" reveal for remaining 5 case studies | MEDIUM | LOW | P1 |
| Business-impact framing woven through case studies | HIGH | LOW (content) | P1 |
| In-page anchor nav for case studies | MEDIUM | LOW | P2 |
| Deferred 5 case studies published | MEDIUM | HIGH (content) | P2 |
| Engagement scroll-depth analytics | LOW-MEDIUM | LOW | P3 |
| Autoplay hero video | LOW (anti-feature) | MEDIUM | Do not build |
| Full-screen intro loader | LOW (anti-feature) | MEDIUM | Do not build |
| "Available for work" animated badge/widget | LOW (unverified) | LOW-MEDIUM | Do not build |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible
- P3: Nice to have, future consideration

## Competitor Feature Analysis

Note: this run used general web/community research (blog posts, career-advice articles) rather than direct scrape of named competitor portfolio URLs. Findings are aggregated patterns from the UX-hiring/portfolio-advice ecosystem (UXfolio, UX Design Institute, UXPin, Toptal, Sarah Doody, uxplaybook.org, career strategy coaches) rather than a side-by-side named-site teardown. Treat the table below as pattern-level, not brand-level.

| Feature | Pattern A: "Agency/cinematic portfolio" (Axisform-style reference) | Pattern B: "Plain case-study-first portfolio" (career-coach recommended) | Our Approach |
|---------|--------------------------------------------------------------------|----------------------------------------------------------------------------|--------------|
| Homepage motion | Heavy scroll-driven parallax/reveal, glass-morphism, cinematic pacing | Minimal/no motion, static grid of case-study cards | Adopt Axisform's motion language but reconcile with performance/accessibility table stakes (restrained, purposeful, `prefers-reduced-motion`-aware) |
| Case-study depth | Often visual-heavy, can skew light on narrative text | Narrative-first, heavier on problem/decision/impact text | Follow Pattern B's narrative depth inside Pattern A's visual polish — template already supports this (text sections + supporting visuals per stage) |
| Contact | Often a stylized "brief"/inquiry form matching brand voice | Plain, minimal form or just an email link | Already planned "Send the Brief" 3-field form — matches both patterns' best practice (branded voice + minimal fields) |
| Résumé | Sometimes omitted in favor of "see full case studies" | Almost always present, prominent PDF download | Keep résumé PDF prominent in footer per plan — do not let brand styling push it out of view |

## Sources

- [UX Designer Portfolio: What Hiring Managers Look For | UXfolio](https://blog.uxfol.io/ux-designer-portfolio/)
- [What hiring managers look for in a UX portfolio - UX Design Institute](https://www.uxdesigninstitute.com/blog/hiring-managers-ux-portfolio/)
- [Your UX Design Portfolio: What Hiring Managers Are Looking For - Skillcrush](https://skillcrush.com/blog/ux-design-portfolio-advice/)
- [UX portfolio: What hiring managers look for - Victor Adeyemo, Bootcamp/Medium](https://bootcamp.uxdesign.cc/ux-portfolios-what-hiring-managers-look-for-b7c5285133fc)
- [Get Hired With this Recruiter's UX Portfolio Tips - Toptal](https://www.toptal.com/designers/ux/ux-portfolio-tips-recruiter)
- [16 Best UX Portfolio Examples That Stand Out to Recruiters (2026) - UXPin](https://www.uxpin.com/studio/blog/ux-portfolio-examples/)
- [How to Write UX Case Studies That Land You Job (2025/2026) - Medium/uxplaybook](https://uxchrisnguyen.medium.com/how-to-write-ux-case-studies-that-land-you-job-in-2025-00549454b39e)
- [UX Case Study Design Tips for Portfolios - UXfolio](https://blog.uxfol.io/ux-portfolio-design-tips/)
- [UX Case Study Structure: How To Follow UX Recruiters' Logic - UXfolio](https://blog.uxfol.io/ux-case-study-structure/)
- [5 Principles of Exceptional Case Studies in UX Portfolios - UX Tools](https://www.uxtools.co/blog/5-principles-of-exceptional-case-studies-in-ux-portfolios)
- [How to Structure a UX Case Study that Hiring Managers Notice - Medium](https://medium.com/@maxrichy/how-to-structure-a-ux-case-study-that-hiring-managers-notice-4f0e9bf45fa4)
- [What Hiring Managers Look for in UX Case Studies - designcase.app](https://designcase.app/blog/what-hiring-managers-look-for-ux-case-studies/)
- [How long should your UX Case Study be? - Aashrey Sharma](https://aashreysharma.com/how-long-should-your-ux-case-study-be)
- [How long should a UX case study be so it stands out to recruiters? - Career Strategy Lab](https://www.careerstrategylab.com/how-long-should-ux-case-study-be/)
- [The Ultimate UX Case Study Template & Structure (2026 Guide) - UXfolio](https://blog.uxfol.io/ux-case-study-template/)
- [17 Brilliant Product Designer Resume Examples - UXfolio](https://blog.uxfol.io/product-designer-resume/)
- [21 UX Designer Resume Examples - Case Study Club](https://www.casestudy.club/journal/ux-designer-resume)
- [About the Availability Badge - Upwork Help](https://support.upwork.com/hc/en-us/articles/17935107001107--About-the-Availability-Badge) (marketplace-specific precedent, LOW confidence transfer to personal portfolios)
- [15 Best Contact Form Design Examples (2026) - Ventureharbour](https://ventureharbour.com/15-contact-form-examples-help-design-ultimate-contact-page/)
- [20 Best Practices to Boost Your Lead Capture Forms - Purpleplanet](https://purpleplanet.com/blog/20-best-practices-to-boost-your-lead-capture-forms/)
- [Core Web Vitals & Performance Tips for Designers - Netco Design](https://netcodesign.com/core-web-vitals-performance-tips-every-designer-should-know/)
- [How to Evaluate a Web Design Agency Portfolio - designindc](https://designindc.com/blog/how-to-evaluate-a-web-design-agency-portfolio/)
- [8 UX Mistakes To Avoid On Your UX Portfolio Website - Sarah Doody, Medium](https://sarahdoody.medium.com/8-ux-mistakes-to-avoid-on-your-ux-portfolio-website-4d6dd437cf21)
- [Most UI Animations Shouldn't Exist - Trevor Calabro](https://trevorcalabro.substack.com/p/most-ui-animations-shouldnt-exist)
- [Adventures in Autoplay and Sticky Video UX - Foliovision](https://foliovision.com/2023/03/sticky-video-ux)
- [Autoplay Videos: Best Practices for UX & Performance - Ignite](https://www.ignite.video/en/articles/basics/autoplay-videos)
- Project-internal: `Portfolio-Documentation/Information Architecture.md`, `Homepage Copy V2.md`, `Project Page- Template.md`, `.planning/PROJECT.md` (cross-referenced to validate research findings against existing plan, not as external sources)

---
*Feature research for: UX/UI designer portfolio (job search + freelance/consulting)*
*Researched: 2026-07-21*
