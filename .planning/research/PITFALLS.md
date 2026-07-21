# Pitfalls Research

**Domain:** React + Tailwind portfolio site with heavy GSAP/Lenis scroll-driven motion, ported from a vanilla-HTML/CDN reference (Axisform), plus job-search portfolio content/conversion concerns
**Researched:** 2026-07-21
**Confidence:** MEDIUM (cross-checked across GSAP official docs/forums, GreenSock's own React guidance, Lenis maintainer issues, and multiple independent UX-portfolio/recruiter-behavior sources; no single source treated as authoritative alone)

## Critical Pitfalls

### Pitfall 1: Manual useEffect + ScrollTrigger instead of gsap.context()/useGSAP() — leaks that compound with StrictMode

**What goes wrong:**
GSAP animations and ScrollTrigger instances are created in a plain `useEffect` with no (or incomplete) cleanup. On unmount, the DOM listeners, resize observers, and pinned-section spacer elements ScrollTrigger creates keep running against detached nodes. In development, React 18 StrictMode double-invokes effects (mount → unmount → mount) specifically to surface this class of bug — so a component that "works" will visibly double-fire animations (duplicate scroll markers, animations that trigger twice) the moment StrictMode is on, and the same missing cleanup causes real leaks/duplicate triggers in production when users navigate between routes (home ↔ case study ↔ home) in the deployed SPA.

**Why it happens:**
The Axisform reference is vanilla JS with one global `DOMContentLoaded` init and no unmount concept at all — there is nothing to "port" for cleanup, so it's easy to translate GSAP calls 1:1 into a `useEffect` and skip teardown because the reference never needed it. React re-mounts/unmounts components constantly (route changes, conditional rendering, StrictMode); vanilla HTML never does.

**How to avoid:**
Standardize on the `@gsap/react` `useGSAP()` hook (GreenSock's own React integration) for every component that creates GSAP tweens/ScrollTriggers, scoped to a container ref. It auto-wraps setup in `gsap.context()` and automatically kills/reverts all animations, ScrollTriggers, and inline style mutations on unmount — including the StrictMode double-invoke case. If a raw `useEffect` is ever used instead, the cleanup function must call `ctx.revert()` (or manually `.kill()` every ScrollTrigger/tween created) — never skip cleanup "because it's cosmetic."

**Warning signs:**
- Scroll markers/animations firing twice in dev (StrictMode symptom)
- Animations from a previous page still visible/triggering after client-side navigation to a new route
- Scroll position or pinned-section behavior degrading the longer a session runs without a full page reload
- Console warnings about ScrollTrigger acting on elements no longer in the DOM

**Phase to address:**
Foundation/animation-infrastructure phase — establish the `useGSAP()` pattern (and a shared hook/wrapper if multiple components need ScrollTrigger) before any section-specific animation work begins, so every subsequent phase inherits the safe pattern instead of retrofitting it later.

---

### Pitfall 2: Lenis smooth-scroll shipped without the anchor-link, route-change, and sticky-layout integration work

**What goes wrong:**
Lenis is dropped in for the buttery-scroll feel but only the "happy path" (scrolling the current page) is wired up. Three specific breakages follow: (1) in-page anchor links (nav → `#section`) do a native instant jump instead of a Lenis-smoothed scroll, because Lenis intercepts wheel/touch input but not `<a href="#...">` clicks by default; (2) after a client-side route change (React Router), old scroll-trigger/scroll-position state persists or the new page's scroll container isn't re-measured, so scroll feels "stuck" or jumps to the wrong position; (3) `position: sticky` elements (e.g., a sticky nav or sticky case-study sidebar) silently stop sticking, because Lenis-driven layouts often need `overflow-x: hidden` replaced with `overflow-x: clip` and sticky ancestors given `align-self: start` — details easy to miss when porting from a reference that never had React Router in the mix.

**Why it happens:**
Smooth-scroll is "cheap to add poorly and hard to add well" — the naive integration (just wrapping the app in a Lenis instance) looks correct in isolation but breaks on exactly the interactions a real multi-page portfolio has (nav anchor links, case-study detail routes, sticky elements) that a single static demo page never exercises.

**How to avoid:**
Treat Lenis integration as its own checklist, not a drop-in: wire nav anchor links through `lenis.scrollTo(target)` explicitly (don't rely on native anchor behavior); on route change, reset/re-measure Lenis and call `ScrollTrigger.refresh()` after the new route's content has painted; audit every `overflow-x: hidden` and every `position: sticky` element introduced during the port and adjust per the known Lenis constraints. Verify by manually testing every nav link and every case-study route transition, not just the homepage scroll.

**Warning signs:**
- Anchor nav links jump instantly instead of smooth-scrolling
- Scrolling feels different/broken immediately after navigating from home to a case-study page (or back)
- A sticky header or sidebar stops sticking after Lenis is added
- ScrollTrigger-pinned sections show stale trigger start/end positions after a route change

**Phase to address:**
Same animation-infrastructure phase as Pitfall 1 (Lenis + GSAP are set up together), with an explicit follow-up check in the routing/navigation phase once case-study routes exist — this pitfall can't be fully verified until there's more than one route to navigate between.

---

### Pitfall 3: Motion accessibility bolted on late instead of gated at the animation-setup layer

**What goes wrong:**
`prefers-reduced-motion` is checked once (if at all) with a one-off `matchMedia(...).matches` read at load time, then animation code proceeds unconditionally. New sections added later (case-study pages, additional homepage sections) forget the check entirely, because there's no structural enforcement — each animated component has to remember to opt in. Users with vestibular disorders or reduced-motion OS settings get full parallax/pin/scroll-jack motion anyway, and toggling the OS setting mid-session (or testing it) doesn't retroactively disable anything since the check only ran once.

**Why it happens:**
The Axisform reference itself does check `prefersReducedMotion` (good precedent to carry forward), but it's a single global check in one script file — there's no reusable pattern that scales to a component-based React app with many independent animated components being added over time across multiple phases.

**How to avoid:**
Use `gsap.matchMedia()` (or `ScrollTrigger.matchMedia()`) as the standard gating mechanism in the shared animation hook/wrapper established in Pitfall 1's fix, so reduced-motion handling is structural (built into the one hook every animated component uses) rather than a per-component opt-in. This also handles live toggling of the OS setting correctly, which a load-time-only check does not.

**Warning signs:**
- Any new animated section that doesn't route through the shared animation hook
- Manually toggling the OS "reduce motion" setting mid-session and animations still play
- A code review turning up a raw `useEffect` GSAP block with no matchMedia/reduced-motion check

**Phase to address:**
Bake into the same foundation animation-infrastructure phase as Pitfall 1 — this should be a property of the shared hook, not a separate later pass, since retrofitting it across every section is expensive once several are built without it.

---

### Pitfall 4: Case-study pages structured as a portfolio piece (final-UI-first) instead of a skimmable, role/outcome-first story

**What goes wrong:**
Recruiters and hiring managers give each case study a very short skim (often well under the "2-5 minutes for the whole portfolio" figure — frequently under 30 seconds per project before deciding whether to keep reading). If a case study opens with polished final screens and makes the reader hunt for the problem, Hazra's role, and the outcome, the recruiter moves on before reaching the parts that actually differentiate a strong candidate (process, reasoning, impact). This is a specific risk here because `Project Page- Template.md` already defines a rich structure (overview, tools, outcome, challenge, process, solution, learnings) — the pitfall isn't a missing template, it's rendering that template in an order/layout that buries role/outcome below the fold or behind scroll-heavy motion before the reader gets there.

**Why it happens:**
The visual reference (Axisform) is an agency-landing-page aesthetic optimized for cinematic impact, not for information scent — a direct visual port risks importing "impressive first, informative later" pacing into content that needs the opposite pacing (informative immediately, impressive as reinforcement).

**How to avoid:**
Render the case-study frontmatter (role, goal/problem, outcome) as immediately visible summary content above or alongside the hero visual — not purely as a payoff after scrolling through cinematic motion. Keep the motion language (parallax, reveals) as texture around the content, never as a gate the reader must scroll through before reaching the "why this project matters" summary. Homepage case-study cards should carry a one-line outcome/role, not just an image + title.

**Warning signs:**
- A case-study page's first viewport contains only a hero image/title with no stated role or outcome
- Requires more than ~2 scroll actions to reach any concrete claim about impact/outcome
- Homepage "selected work" cards show only project name/image, no differentiating one-liner

**Phase to address:**
Case-study page template/build phase (the phase that renders `Project Page- Template.md` into actual page layout) — this is a content-layout decision independent of the animation-infrastructure work, so it can and should be verified against the template before visual polish passes.

---

### Pitfall 5: Contact form "success" state trusted without verifying actual delivery

**What goes wrong:**
The contact form shows a success message on submit (because the HTTP request didn't throw), but the email never arrives — landed in spam, blocked by the receiving mail server, silently rejected due to a misconfigured form ID/access key, or never actually sent because a client-side JS error occurred before the network call fired. Since this site's stated success metric is literally "interview requests and inquiries submitted via the contact form," a silently-broken form isn't a minor bug — it's the one path that directly undermines the site's core value with zero visible signal that anything is wrong.

**Why it happens:**
Form-as-a-service providers (Formspree, Resend) return a 200-level response for "we accepted your submission," not "the recipient definitely received it" — those are different guarantees, and it's easy to treat the former as if it were the latter. Free-tier quota exhaustion and provider-side deliverability issues fail exactly the same way from the sender's point of view (a clean success response) as a genuinely delivered email.

**How to avoid:**
Show an explicit, distinguishable error state in the UI when the request itself fails (network error, non-2xx response, thrown JS error) rather than a generic "sent" message regardless of outcome. Separately — and this is the part that's easy to skip — manually test the live, deployed form end-to-end after launch (real submission → check the actual receiving inbox and spam folder, not just the browser network tab) before treating the contact flow as done. Consider a lightweight redundant signal (e.g., a second notification channel, or logging submissions somewhere Hazra can audit) if the job-search stakes justify it.

**Warning signs:**
- "It works" was verified only by seeing a success toast, never by checking the actual inbox
- No distinct error UI state exists for a failed submission — only a success state
- No test submission has been done against the live, deployed (not local dev) form
- Free-tier plan limits (submission caps) were never checked against expected traffic

**Phase to address:**
Contact-form integration phase — verification criteria for that phase must explicitly include "a real end-to-end test submission was confirmed received in the actual inbox," not just "the API call returns 200."

---

### Pitfall 6: Client-side routed case-study pages 404 on direct load/refresh, or get indexed before content exists

**What goes wrong:**
Two related but distinct failures for the same root cause (client-side routing on static hosting): (a) a recruiter opens a direct link to `/case-study/mashreq` (from a resume, LinkedIn, or a shared link) and the host serves a real 404 instead of the SPA's index/router taking over, because the static host isn't configured to rewrite all paths to the app entry point; (b) the 5 deferred case-study slugs (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) exist in the Information Architecture and may get scaffolded as routes before content is written — if these are publicly reachable/linked/indexed before real content exists, they either 404 for a visitor who followed a "see more" link, or get crawled and indexed as thin/empty pages, which is bad both for the visitor experience and for search presence once real content does land.

**Why it happens:**
The IA doc (already flagged in `CONCERNS.md`) lists concrete routes as a target sitemap, and it's tempting to scaffold all 11 routes for structural completeness during the build phase — but a route existing in the router doesn't mean it should be publicly linked or crawlable yet.

**How to avoid:**
Configure the static host's SPA rewrite rule (Vercel `rewrites`/`vercel.json` or Netlify `_redirects`) so every case-study path serves the app shell rather than a host-level 404 — verify by hard-refreshing a deep link, not just clicking through in-app navigation. For the 5 deferred case studies, either don't scaffold public routes for them until content exists, or scaffold them behind explicit "coming soon" states with `noindex` — never let an empty/placeholder route be reachable and indexable as if it were a finished case study.

**Warning signs:**
- Hard-refreshing `/case-study/<slug>` in the deployed site returns a host 404 page instead of the app
- A deferred case-study slug is linked from the homepage "see more" list before its content file exists
- Search console (once set up) shows deferred-project URLs indexed with thin/placeholder content

**Phase to address:**
Deployment/routing phase (host rewrite config) for the direct-load 404 issue; case-study rollout phase (gating which of the 11 slugs are actually publicly linked) for the deferred-content issue — both should be explicit verification checks before the site is called "launched."

---

### Pitfall 7: Homepage copy hardcoded directly into JSX, making the planned post-launch copy rewrite expensive

**What goes wrong:**
`Homepage Copy V2.md` is explicitly a rough draft meant to be visually iterated after development (per PROJECT.md). If that copy is typed directly as JSX string literals scattered across many components (`<h1>Actual hero headline text</h1>` repeated across hero/method/services/stats/gallery/contact sections), the planned post-launch copy pass becomes a multi-file hunt-and-replace across component code — risking accidental breakage of surrounding markup/animation trigger attachments (since GSAP often targets specific DOM structure/text nodes) for a task that should be a pure content edit.

**Why it happens:**
It's the path of least resistance during initial visual build — pulling copy into a separate data structure feels like premature abstraction when there's no CMS and only one homepage. But this project has already declared the copy will change, which changes the calculus: this isn't hypothetical future-proofing, it's a known near-term rewrite.

**How to avoid:**
Keep homepage copy in a single colocated content module (e.g., a `content/homepage.ts`/`.json` object, or per-section MDX/JSON similar to the case-study file-based pattern already chosen) that components import and render — not because a CMS is needed (explicitly out of scope), but so the post-visual-iteration copy swap is "edit one data file" rather than "find every hardcoded string across N components." This mirrors the file-based content pattern already decided for case studies, applied consistently to the homepage. Section-level components should accept copy as props/data, not embed it as literal JSX text.

**Warning signs:**
- Grepping the homepage component tree for phrases from `Homepage Copy V2.md` finds them inline in JSX rather than imported from a data source
- Changing one line of copy requires touching a `.tsx` file's markup rather than a content/data file
- GSAP animation selectors are coupled to specific hardcoded text content in a way that copy changes would break

**Phase to address:**
Homepage build phase — establish the content-module pattern when each section is first built, not after the visual-iteration copy pass has already been requested (retrofitting it after the fact means doing the extraction work anyway, just with more surface area).

---

## Technical Debt Patterns

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|-----------------|------------------|
| Copy-pasting Axisform's CDN `<script>` tags / Tailwind CDN runtime as a starting point | Fast visual parity while prototyping layout | No build pipeline, ~300KB+ blocking JS parse cost, no purge/tree-shaking, no design-token config, unpinned supply chain | Never in the real build — reference-only, per CONCERNS.md; acceptable only for a disposable local HTML mockup, not committed app code |
| Raw `useEffect` GSAP setup instead of `useGSAP()` | Slightly less new API to learn upfront | Leaks, StrictMode duplicate-fire bugs, harder-to-audit cleanup across dozens of components | Never once more than one or two animated components exist — the hook cost is trivial and the fix-later cost is not |
| Scaffolding all 11 case-study routes immediately for IA completeness | Feels structurally "done," routing looks finished | Deferred-content routes become reachable/indexable dead pages | Acceptable only if gated behind `noindex` + explicit "coming soon" UI, never as bare empty routes |
| Hardcoding homepage copy directly in JSX during first visual build | Faster to write the first pass of each section | Post-visual-iteration copy rewrite touches many component files instead of one content file | Acceptable only for a true throwaway spike, never for the actual homepage build phase given the copy rewrite is already planned |
| Skipping a live end-to-end contact-form delivery test ("the API returned 200, ship it") | Faster to mark the contact-form task done | The site's core success metric (inquiries) can silently fail with zero warning | Never — this is a one-time manual check, cost is minutes, risk of skipping is the entire product goal failing quietly |

## Integration Gotchas

| Integration | Common Mistake | Correct Approach |
|-------------|-----------------|-------------------|
| GSAP + React (general) | Creating tweens/ScrollTriggers in a bare `useEffect` with no/partial cleanup | Use `@gsap/react`'s `useGSAP()` hook scoped to a container ref; it auto-reverts on unmount |
| GSAP ScrollTrigger + React Router | Assuming trigger start/end positions stay valid across route changes | Call `ScrollTrigger.refresh()` after the new route's DOM has painted; kill prior route's triggers on unmount |
| Lenis + anchor nav links | Relying on native `<a href="#section">` jump behavior | Explicitly wire nav links to `lenis.scrollTo(target)` |
| Lenis + `position: sticky` | Sticky elements silently stop sticking once Lenis wraps the page | Replace `overflow-x: hidden` with `overflow-x: clip`; give sticky ancestors `align-self: start` |
| Formspree/Resend contact form | Treating a 200 response as proof of delivery | Show distinct success/error UI states from the actual request outcome; separately, do a real end-to-end test submission and check the live inbox/spam folder post-launch |
| Vercel/Netlify static hosting + client-side router | Only testing navigation via in-app `<Link>` clicks | Verify with hard-refresh/direct-load of every case-study path; configure SPA rewrite rules (`vercel.json` rewrites / Netlify `_redirects`) |
| Google Fonts / analytics snippet carried from Axisform reference | Copying the reference's hardcoded `gtag` ID and font `<link>` tags verbatim | Replace with the real site's own analytics ID (or omit until one exists) and self-host/npm-manage font loading through the real build tooling |

## Performance Traps

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|-----------------|
| `backdrop-filter: blur()` glass-morphism cards, especially on `position: fixed`/pinned elements | Scroll jank, dropped frames, especially in iOS Safari (known repaint-per-frame bug on fixed+blur) | Cap blur radius ~8-16px, limit number of simultaneously blurred elements, prefer `position: sticky` over `fixed` where the design allows, test on real mid/low-tier mobile hardware | Noticeable immediately on iOS Safari with more than a couple of stacked blurred cards; worsens as more glass cards are added per section |
| Long onload GSAP timelines animating dozens of elements on every page load | Slow Largest Contentful Paint / long main-thread task on initial load, especially on mobile | Scope ScrollTrigger-driven reveals to lazy-init as sections enter view rather than one giant upfront timeline; keep the preloader/hero timeline minimal | Breaks Core Web Vitals targets as more homepage sections are added if all are wired into one master timeline |
| Manual scroll event listeners instead of ScrollTrigger's/IntersectionObserver's built-in throttling | Janky, delayed-feeling scroll response, worse on low-end Android devices | Let ScrollTrigger/IntersectionObserver own scroll-position work; never add a second manual `window.addEventListener('scroll', ...)` alongside it | Becomes visible as more sections independently listen to scroll without coordinating |
| Oversized wordmark typography (23vw) and large images without responsive/format optimization | Slow mobile load, layout shift, memory pressure on lower-end phones | Serve responsively sized/optimized images (WebP/AVIF, `srcset`), clamp oversized type with `clamp()` rather than raw `vw` units that can overflow on unusual aspect ratios | Most visible on the hero/gallery sections once real (non-placeholder) imagery is swapped in at full case-study-photo resolution |

## Security Mistakes

| Mistake | Risk | Prevention |
|---------|------|------------|
| Carrying over unpinned CDN script tags (GSAP, Lenis, Lucide) from the Axisform reference | Supply-chain risk (no version pinning/SRI), single point of failure if a CDN goes down | Install `gsap`, `lenis`, an icon package as versioned npm dependencies and bundle them (already flagged in CONCERNS.md) |
| No spam/abuse protection on the contact form | Form gets used for spam submissions, potentially exhausting free-tier email quota (which then masks real inquiries as the same silent-failure mode as Pitfall 5) | Use the form provider's built-in honeypot/reCAPTCHA option; monitor quota usage, especially on a free tier |
| Committing `.env`/API keys for the email service without a `.gitignore` in place | Secret leakage into git history | Add `.gitignore` covering `.env*` before wiring the email service integration (already flagged as a repo-hygiene gap in CONCERNS.md) |

## UX Pitfalls

| Pitfall | User Impact | Better Approach |
|---------|--------------|-------------------|
| Motion-heavy hero/pinned sections gating access to content (must scroll through cinematic reveal before reaching substance) | Recruiter skimming in seconds bounces before reaching anything informative | Keep role/outcome/summary content visible early; use motion as reinforcement, not as a gate |
| No visible loading/success/error state distinction on contact form submit | User (or Hazra, auditing later) can't tell a failed submission from a successful one | Explicit, distinct UI states for pending/success/error tied to actual request outcome |
| Case-study "see more" expansion revealing routes with no content behind them | Dead-end click erodes trust right when a visitor is most engaged | Only link routes with real content; gate placeholders behind "coming soon," not a live dead route |
| Ignoring `prefers-reduced-motion` | Motion-sensitive/vestibular-disorder users experience discomfort, may leave immediately | Gate all non-essential motion setup through `gsap.matchMedia()`/`ScrollTrigger.matchMedia()` reduced-motion query, applied structurally not per-component |
| Résumé/CV download link broken or pointing to a stale file after a copy/asset iteration | A recruiter's single most-likely-to-be-used action fails silently | Treat the resume download as a first-class, explicitly tested link — verify after every deploy, not just once at initial build |

## "Looks Done But Isn't" Checklist

- [ ] **GSAP/ScrollTrigger setup:** Often missing proper cleanup — verify by toggling React StrictMode on in dev and confirming animations don't double-fire, and by navigating between routes and confirming no stale triggers remain active
- [ ] **Lenis smooth scroll:** Often missing anchor-link wiring and sticky-layout fixes — verify every nav anchor link smooth-scrolls (not native-jumps) and every intended sticky element still sticks
- [ ] **Reduced-motion support:** Often only checked once at load, or only on the first section built — verify by toggling the OS "reduce motion" setting mid-session across every animated section, including case-study pages added later
- [ ] **Contact form:** Often only "verified" via a UI success toast — verify with a real submission checked against the actual receiving inbox (including spam folder)
- [ ] **Case-study routes:** Often only tested via in-app navigation — verify by hard-refreshing/direct-loading every case-study URL on the deployed host, and confirm deferred (not-yet-written) case studies aren't publicly linked/indexed
- [ ] **Resume download link:** Often untested after content iterations — verify the link resolves to the current file after every deploy, not just at initial setup
- [ ] **Homepage copy structure:** Often hardcoded during first build pass — verify copy lives in one importable content module per section, not scattered literal JSX strings, before the planned post-launch copy rewrite begins

## Recovery Strategies

| Pitfall | Recovery Cost | Recovery Steps |
|---------|----------------|------------------|
| Missing GSAP cleanup discovered late (many components affected) | MEDIUM | Introduce the shared `useGSAP()`-based hook, then migrate each animated component to it one at a time, verifying no duplicate-fire regression per component |
| Lenis anchor/sticky issues discovered after several sections built | LOW-MEDIUM | Centralize anchor-link handling and sticky-element audit into one pass rather than fixing per-section reactively; usually a handful of CSS/JS touch points, not a rewrite |
| Homepage copy hardcoded across many components | MEDIUM-HIGH | Extract inline strings into a content module retroactively, verifying no GSAP selector was implicitly coupled to specific text content during extraction |
| Contact form found to be silently failing post-launch | LOW (fix) / HIGH (reputational, if discovered late) | Fix delivery config/provider settings immediately, then proactively reach out to anyone who may have submitted during the broken window if identifiable |
| Deferred case-study routes discovered already indexed with placeholder content | LOW-MEDIUM | Add `noindex`, submit removal via Search Console, replace placeholder with either real content or a clear "coming soon" state |

## Pitfall-to-Phase Mapping

| Pitfall | Prevention Phase | Verification |
|---------|-------------------|----------------|
| Uncleaned ScrollTrigger / StrictMode double-fire | Animation-infrastructure/foundation phase | Toggle StrictMode in dev; confirm no duplicate animation fire; confirm triggers are killed after unmount/route change |
| Lenis + anchor links / route changes / sticky breakage | Animation-infrastructure phase, re-checked in routing/navigation phase | Click every nav anchor link and confirm smooth-scroll; navigate between all routes and confirm scroll state resets correctly; confirm sticky elements still stick |
| Reduced-motion not respected | Animation-infrastructure phase | Toggle OS reduced-motion setting mid-session across every section (including later-added case-study pages) and confirm animation is disabled/simplified |
| Case studies not skimmable in seconds | Case-study page template/build phase | Time-box a self-review: can role + outcome be identified within the first viewport / first few seconds of a scroll? |
| Contact form silent failure | Contact-form integration phase | Real end-to-end test submission confirmed received in the live inbox (and spam folder checked), not just a 200 response |
| Case-study routes 404 on direct load / deferred routes indexed early | Deployment/routing phase + case-study rollout phase | Hard-refresh every case-study URL on the deployed host; confirm deferred slugs aren't publicly linked/crawlable |
| Homepage copy hardcoded, expensive to swap later | Homepage build phase | Grep component tree for literal copy strings vs. content-module imports before calling section "done" |
| Glass-morphism / backdrop-filter mobile jank | Visual polish / performance-hardening phase | Test on real mid/low-tier mobile device (not just desktop dev tools) with multiple glass cards in view simultaneously |

## Sources

- [React & GSAP — official docs](https://gsap.com/resources/React/) (HIGH — official GreenSock documentation)
- [gsap-react agent skill / SKILL.md — greensock/gsap-skills](https://github.com/greensock/gsap-skills/blob/main/skills/gsap-react/SKILL.md) (HIGH — maintained by GreenSock)
- [React with GSAP causing multiple trigger on scroll — GSAP forum](https://gsap.com/community/forums/topic/35621-react-with-gsap-causing-multiple-trigger-on-scroll-and-showing-multiple-marker/) (MEDIUM — official community forum, cross-checked)
- [ScrollTrigger Position Issues After Route Change in React App — GSAP forum](https://gsap.com/community/forums/topic/43932-scrolltrigger-position-issues-after-route-change-in-react-app/) (MEDIUM)
- [ScrollTrigger breaks when navigating back (useGSAP + React + React Router) — GSAP forum](https://gsap.com/community/forums/topic/39982-scrolltrigger-breaks-when-navigating-back-usegsap-react-react-router/) (MEDIUM)
- [gsap.matchMedia() — official docs](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/) (HIGH — official)
- [ScrollTrigger.matchMedia and prefers-reduced-motion — GSAP forum](https://gsap.com/community/forums/topic/27141-scrolltriggermatchmedia-and-prefers-reduced-motion/) (MEDIUM)
- [Lenis — darkroomengineering/lenis (GitHub)](https://github.com/darkroomengineering/lenis) (HIGH — official repo)
- [ScrollTo smooth scroll not working on anchors — Lenis issue #277](https://github.com/darkroomengineering/lenis/issues/277) (MEDIUM — maintainer-tracked issue)
- [Lenis + Next.js: smooth scroll without breaking sticky — Krishna Adhikari](https://krishna-adhikari.com.np/blogs/lenis-nextjs-smooth-scroll) (MEDIUM)
- [Smooth Scrolling in Next.js with Lenis & GSAP — DevDreaming](https://devdreaming.com/blogs/nextjs-smooth-scrolling-with-lenis-gsap) (MEDIUM)
- [7 UX Case Study Mistakes to Avoid — uxfol.io](https://blog.uxfol.io/case-study-mistakes/) (MEDIUM)
- [8 UX portfolio website mistakes you must avoid — Career Strategy Lab](https://www.careerstrategylab.com/8-ux-portfolio-website-mistakes-to-avoid/) (MEDIUM)
- [How Recruiters and Hiring Managers Actually Look at Your Portfolio — Opendoors Careers](https://blog.opendoorscareers.com/p/how-recruiters-and-hiring-managers-actually-look-at-your-portfolio) (MEDIUM)
- [4 Things Recruiters Look For In Your Design Portfolio — Kalibrr Design](https://medium.com/kalibrr-design/4-things-recruiters-look-for-in-your-design-portfolio-5e2471348540) (MEDIUM)
- [I'm not receiving the confirmation email — Formspree Help](https://help.formspree.io/hc/en-us/articles/115008227307-I-m-not-receiving-the-confirmation-email) (HIGH — official provider docs)
- [I'm not receiving emails — Formspree Help](https://help.formspree.io/hc/en-us/articles/115008379388-I-m-not-receiving-emails) (HIGH — official provider docs)
- [Contact Form Not Working? 8 Causes and Fixes — splitforms](https://splitforms.com/blog/contact-form-not-working) (MEDIUM)
- [A case study on scroll-driven animations performance — Chrome for Developers](https://developer.chrome.com/blog/scroll-animation-performance-case-study) (HIGH — official Chrome team)
- [How to Build Scroll Animations That Don't Kill Performance — Brad Holmes](https://www.brad-holmes.co.uk/web-performance-ux/build-scroll-animations/) (MEDIUM)
- [Why Scroll Animation is sluggish on mobile? — GSAP forum](https://gsap.com/community/forums/topic/45146-why-scroll-animation-is-sluggish-on-mobile-i-need-guidance/) (MEDIUM)
- [Enhancing My Web Portfolio: Overcoming backdrop-filter Challenges in Safari — Medium](https://medium.com/@wendyteo.wy/enhancing-my-web-portfolio-overcoming-backdrop-filter-challenges-in-safari-0f84aae74a83) (MEDIUM)
- [How to fix filter: blur() performance issue in Safari — Graffino](https://graffino.com/til/how-to-fix-filter-blur-performance-issue-in-safari) (MEDIUM)
- [Next-level frosted glass with backdrop-filter — Josh W. Comeau](https://www.joshwcomeau.com/css/backdrop-filter/) (MEDIUM — well-regarded independent source, cross-checked against other blur-performance sources)
- [Nextjs Render Error caused by Scroll Trigger being enabled — GSAP GitHub issue #603](https://github.com/greensock/GSAP/issues/603) (MEDIUM — maintainer-tracked; relevant if an SSR framework is later adopted, currently informational since this project's React+Tailwind stack is not confirmed to use SSR)
- Internal: `.planning/PROJECT.md`, `.planning/codebase/CONCERNS.md`, `Templates/Axisform/Axisform Studio Design.md` (project-specific context, HIGH — primary source documents)

---
*Pitfalls research for: React + Tailwind portfolio site (GSAP/Lenis scroll motion, ported from Axisform reference)*
*Researched: 2026-07-21*
