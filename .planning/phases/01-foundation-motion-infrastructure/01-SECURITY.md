---
phase: 01
slug: foundation-motion-infrastructure
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: 2026-07-24
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry -> local `node_modules` | Every dependency installed across this phase's 7 plans crosses this boundary | Executable install-script code |
| Google Fonts CDN -> browser | `index.html`'s font `<link>` tags fetch Inter at runtime | Static font assets, no PII |
| OS accessibility setting -> browser `matchMedia` -> React Context -> Lenis instantiation | Reduced-motion preference crosses into app state and gates the Lenis smooth-scroll side-effect | UI preference boolean only |
| GSAP `ticker` (single rAF loop) -> Lenis `.raf()` -> `ScrollTrigger.update` | Scroll-sync loop; leaked/duplicated registration is a reliability risk, not a security boundary | None (internal render-loop wiring) |
| Caller-supplied `className`/`children` props -> rendered DOM | UI primitives accept free-form React children/className from callers | Developer-authored JSX only |
| `src/content/hero.ts` -> rendered JSX | Static, developer-authored copy, no user input | Static copy |
| Browser URL -> React Router route matching | Client-side only, no server-rendered auth-gated routes | Route params only |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-SC | Tampering | `npm install` — all 13 packages (gsap, @gsap/react, lenis, react-router, clsx, tailwind-merge, etc.) | high | mitigate | Human-reviewed Package Legitimacy Audit approved in 01-01 checkpoint before install; `package-lock.json` committed pins exactly the reviewed versions (verified present in repo root) | closed |
| T-01-01 | Tampering | Google Fonts `<link>` tags (Inter) in `index.html` | low | accept | Same-origin trusted Google domains, static `<link>` tags, no inline/dynamic script execution | closed |
| T-01-02 | Information Disclosure | Build tooling / static CSS tokens | n/a | not applicable | No data-collection surface exists | closed |
| T-01-03 | Elevation of Privilege | Static SPA build step | n/a | not applicable | No auth/session/access-control surface exists in this phase | closed |
| T-01-04 | Denial of Service | Leaked `gsap.ticker` callback / un-destroyed `Lenis` instance across StrictMode remounts | medium | mitigate | `MotionProvider.test.tsx` asserts symmetric `ticker.add`/`ticker.remove` and `lenis.destroy()` calls (verified in source: `MotionProvider.tsx:45,49,50`) | closed |
| T-01-05 | Information Disclosure | Reduced-motion boolean (UI preference) | n/a | not applicable | No PII or secret crosses this boundary | closed |
| T-01-06 | Spoofing / Tampering | No network request or user input in provider logic | n/a | not applicable | Pure client-side hook/provider logic | closed |
| T-01-07 | Tampering (XSS-adjacent) | `children`/`className` passed through to JSX (UI primitives) | low | accept | React's JSX escaping; no `dangerouslySetInnerHTML` used anywhere | closed |
| T-01-08 | Information Disclosure | Purely presentational components | n/a | not applicable | No data fetched or stored | closed |
| T-01-09 | Denial of Service | Leaked `ScrollTrigger` instance not scoped/reverted on unmount | medium | mitigate | `useScrollReveal.test.ts` / `MotionProvider.test.tsx` assert `ScrollTrigger.getAll().length === 0` post-unmount, including under StrictMode's phantom cycle (verified present) | closed |
| T-01-10 | Information Disclosure | Ref/options are internal React values | n/a | not applicable | No network/user-input surface exists in this hook | closed |
| T-01-11 | Tampering (XSS) | `heroContent` copy rendered via JSX | low | accept | Static, developer-authored TypeScript data, not user input; no `dangerouslySetInnerHTML` used | closed |
| T-01-12 | Spoofing | React Router client-side route matching (`/`, `/case-study/:slug`) | low | accept | No server-rendered auth-gated routes; all routes are public static content | closed |
| T-01-13 | Denial of Service | Duplicate `MotionProvider`/`useScrollReveal` registration if `main.tsx` wraps tree twice | low | mitigate | Build+test verification catches double-mount; StrictMode phantom cycle already proven safe by cleanup tests | closed |
| T-01-14 | Denial of Service (reliability) | Lenis instantiation re-runs on every `prefersReducedMotion` toggle (`[prefersReducedMotion]` deps in `MotionProvider.tsx:52`) | medium | mitigate | `MotionProvider.test.tsx:178` ("tears down Lenis when prefersReducedMotion toggles... and re-initializes it when toggled back") asserts symmetric destroy/re-instantiation on toggle (verified present) | closed |
| T-01-15 | Information Disclosure | `prefersReducedMotion` boolean crossing OS->Context boundary | n/a | not applicable | UI preference only, no PII | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above workflow.security_block_on (high) count toward threats_open*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-01 | Google Fonts static `<link>` tags — industry-standard practice, same-origin trusted CDN | Plan author (01-02-PLAN.md) | 2026-07-24 |
| AR-01a | T-01-07 | React JSX escaping on `children`/`className` passthrough — no bespoke risk, no `dangerouslySetInnerHTML` | Plan author (01-04-PLAN.md) | 2026-07-24 |
| AR-01b | T-01-11 | Static developer-authored hero copy, not user input — becomes relevant again only when Phase 2 renders user-facing Markdown | Plan author (01-06-PLAN.md) | 2026-07-24 |
| AR-01c | T-01-12 | Public portfolio site, no auth-gated routes — route spoofing has no security consequence | Plan author (01-06-PLAN.md) | 2026-07-24 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-07-24 | 16 | 16 | 0 | /gsd-secure-phase (grep-depth verification, ASVS L1, register authored at plan time — auditor spawn skipped per short-circuit rule) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-07-24
