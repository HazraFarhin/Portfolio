# Phase 4: Contact Form & Deployment Hardening - Research

**Researched:** 2026-08-03
**Domain:** Vercel serverless functions (Node.js runtime) + Resend transactional email + Vercel SPA routing/deployment + robots.txt/sitemap conventions
**Confidence:** MEDIUM

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** Use Resend (not Formspree) for email delivery, via a serverless function. A `RESEND_API_KEY` already exists in the repo's `.env` (gitignored via `.env*`) — reuse it rather than introduce a second, unused third-party service.
- **D-02:** Send from Resend's default `onboarding@resend.dev` address — no custom domain is verified in Resend yet. This means Resend restricts the recipient to the Resend account owner's own verified email, which is `hazrafarhinwork@gmail.com` — the real inbox this form should reach anyway, so no functional loss for v1.
- **D-03:** Email format is a plain subject line (e.g. `New brief from {submitter email}`) plus a labeled plain-text body listing all 3 form fields — no styled HTML email template. This is a low-volume inbox notification, not a marketing email; skip the template-build cost.
- **D-04:** Deploy to Vercel, not Netlify. First-party Vite framework detection, serverless functions as `/api/*.ts` files matching this repo's existing TypeScript setup directly.
- **D-05:** Ship on the default `*.vercel.app` subdomain for v1 — no custom domain owned/connected yet. A custom domain is a fast follow-up later, not part of this phase's scope.
- **D-06:** No Vercel account is connected to this repo's GitHub remote yet. The plan MUST include a manual checkpoint step: user creates/connects a Vercel account, imports the GitHub repo, and adds `RESEND_API_KEY` as a Vercel project environment variable — execution then resumes and verifies the live deployment (mirrors the Phase 3 résumé-conversion checkpoint pattern in `03-05-PLAN.md`).
- **D-07:** Remove all links to the 5 deferred case studies (riyaah, icici-bank-atm-kiosk, ambit, northernarc, citrus) from the homepage. The coming-soon route itself (`src/routes/coming-soon.tsx`, wired in `src/router.tsx`) stays reachable by direct URL — but nothing on the site links to it. Exclude these 5 routes from any sitemap and disallow them in `robots.txt` (neither currently exists in the repo).
- **D-08 — Requirements conflict, explicitly flagged and accepted by the user:** The "see more" expansion (HOME-04, marked Complete in Phase 3) is removed/disabled entirely rather than kept as non-clickable "coming soon" cards. HOME-04 is no longer literally satisfied — REQUIREMENTS.md must be updated to mark HOME-04 as superseded by DEPL-03 for v1. Selected Work's grid should show only the 6 featured case studies going forward.
- **D-09:** Success/error feedback is inline, not a toast/banner. On success, the form fields are replaced in place with a confirmation message. On error, an inline error message appears above the form with the user's entered field values preserved (no data loss on failure).
- **D-10:** Spam protection is a honeypot field only — one hidden input real users never see; if it arrives non-empty on submit, silently reject without calling Resend. No CAPTCHA, no third-party rate-limiting service for v1.
- **D-11:** All 3 form fields become required before submit — add `required` to "What are you working on?" and "What needs to become clearer?" (currently only Email has `required`).
- **D-12 (carried forward from `03-REVIEW.md`):** The footer's `<form>` currently has `type="submit"` with no `onSubmit`/`preventDefault`, so a real click today triggers a native full-page GET reload. Add `e.preventDefault()` in the submit handler as part of wiring the real Resend submission — this is a correctness fix, not new scope.
- **D-13 (carried forward from `03-CONTEXT.md` D-15):** `public/resume.pdf` is already the real, converted résumé from Phase 3 — Phase 4's CONT-03 work is verification only, not a rebuild.

### Claude's Discretion

- Exact copy/wording of the inline success and error messages (D-09), within the "clear, distinct states" requirement of CONT-02.
- Exact serverless function file structure/naming under `/api/` for the Resend call (D-01/D-04).
- Whether to consolidate the deferred-slug title data currently hand-duplicated across `router.tsx`, `coming-soon.tsx`, and `content/case-studies/deferred.ts` into one source of truth while touching all three files for D-07/D-08 — do it if it doesn't expand scope, skip it if it does.
- Exact `robots.txt` syntax and whether a sitemap.xml is generated statically or at build time (D-07) — as long as the 5 deferred routes are excluded/disallowed.
- Honeypot field name/implementation details (D-10), as long as it's invisible to real users and doesn't trip accessibility tooling (e.g. proper `aria-hidden`/`tabindex="-1"`, not just `display:none` alone if that risks autofill).

### Deferred Ideas (OUT OF SCOPE)

- **Custom domain for Vercel deployment** — deferred per D-05; default `*.vercel.app` subdomain ships for v1.
- **Custom Resend-verified sending domain** — deferred per D-02.
- **Styled HTML email template** — deferred per D-03; plain-text labeled body is sufficient.
- **CAPTCHA / third-party rate-limiting for the contact form** — deferred per D-10; honeypot-only for v1.
- **Full case-study pages for the 5 deferred projects** — already tracked as v2 (CASE-V2-01) in REQUIREMENTS.md; unaffected by this phase's D-07/D-08.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CONT-01 | User can submit a 3-field contact form and have it delivered to Hazra's inbox via an email service | Architecture Patterns (Pattern 1, Pattern 2, Code Examples) — `api/contact.ts` + Resend SDK call shape; Package Legitimacy Audit for `resend` |
| CONT-02 | User receives clear success/error feedback after submitting the contact form | Architecture Patterns (Pattern 4 — client-side honeypot short-circuit and `{ data, error }` → status-code mapping consumed by the existing UI-SPEC success/error states) |
| CONT-03 | User can download Hazra's résumé as a PDF | Runtime State Inventory note (no rename/migration needed — verification only per D-13); Validation Architecture (manual-only test row) |
| DEPL-01 | Site is deployed and publicly accessible on Vercel or Netlify | Standard Stack (Vercel CLI/project settings), Common Pitfalls (Pitfall 1, Pitfall 3), Environment Availability |
| DEPL-02 | Case-study routes work correctly on direct load/refresh (SPA rewrite rules configured) | Architecture Patterns (Pattern 3 — `vercel.json` rewrite), System Architecture Diagram (deep-link request flow) |
| DEPL-03 | The 5 deferred case-study routes are not publicly linked or indexed until their content exists | Don't Hand-Roll (sitemap library avoidance), Standard Stack (Alternatives Considered — hand-maintained `sitemap.xml`), Validation Architecture (DEPL-03 test rows) |

</phase_requirements>

## Summary

Phase 4 wires four net-new capabilities onto an otherwise-complete static Vite + React SPA: (1) a Vercel serverless function under `/api` that calls the Resend API server-side to deliver the contact form, (2) a `vercel.json` rewrite so client-side React Router deep links survive a hard refresh, (3) a `public/robots.txt` + hand-maintained `public/sitemap.xml` that excludes the 5 deferred case-study slugs, and (4) the manual Vercel account-connection checkpoint that unblocks live verification of all of the above. None of this exists in the repo today — no `/api` directory, no `vercel.json`, no `robots.txt`/sitemap, no `resend` dependency.

The Vercel Node.js runtime's modern, zero-config pattern is a Web Standard `fetch` export in `api/contact.ts` (`export default { fetch(request: Request) { ... } }`) — this needs no `@vercel/node` dependency and no configuration file, and reads `process.env.RESEND_API_KEY` directly server-side. The Resend SDK (`resend` package) returns errors as a `{ data, error }` object rather than throwing, which the function must forward to the client as a non-2xx JSON response so the existing UI-SPEC error state can render. Because `onboarding@resend.dev` is unverified, Resend restricts the `to` field to only the account owner's own address — which is already `hazrafarhinwork@gmail.com`, so this restriction has zero practical effect for this phase (D-02). SPA routing is fixed with one `vercel.json` catch-all rewrite to `/index.html`; Vercel resolves `/api/*` functions and static files before applying rewrites, so the rewrite does not need to special-case `/api`.

**Primary recommendation:** Ship a single `api/contact.ts` using the Web Standard `fetch` handler signature, call `resend.emails.send` with a plain-text body, forward `{ data, error }` outcomes as JSON to the client's existing fetch call, add one root-level `vercel.json` with the standard SPA catch-all rewrite, and hand-write `public/robots.txt` + `public/sitemap.xml` (no generator library — 7 total indexable URLs does not justify one).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Contact form field capture, client-side required validation, inline success/error UI | Browser / Client | — | Existing `Footer.tsx` markup; D-09 states success/error render is a same-page DOM swap, not a route change |
| Honeypot silent-reject check | Browser / Client | — | D-10/UI-SPEC: "no network call made" on honeypot trip — the check and the no-fetch decision both happen client-side before any request leaves the browser |
| Resend API call, `RESEND_API_KEY` custody, email composition | API / Backend | — | Must never reach the client bundle; only a Vercel Function (server-side `process.env`) can hold the secret |
| Contact form spam/error response shaping | API / Backend | Browser / Client (renders it) | The function decides success/failure and status code; the client only renders the outcome it's given |
| SPA deep-link rewrite (`/case-study/:slug` survives refresh) | CDN / Static (Vercel edge routing layer) | Browser / Client (React Router then takes over) | `vercel.json` rewrites are evaluated by Vercel's routing layer before any JS runs; React Router only takes over once `index.html` is served |
| robots.txt / sitemap.xml crawler exclusion | CDN / Static | — | Both are static files served verbatim from `public/`, read only by external crawlers — no app code involved |
| Vercel project creation, env var storage, GitHub import | Deployment platform (out-of-band, human) | — | Cannot be automated from inside the repo; requires a manual checkpoint (D-06) |
| Résumé PDF delivery | CDN / Static | — | Already-shipped static asset (`public/resume.pdf`); Phase 4 only verifies it, per D-13 |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `resend` | 6.18.1 (npm, published 2026-07-28) [ASSUMED — package identity via WebSearch/training knowledge; version confirmed live via `npm view resend version`, VERIFIED: npm registry] | Node SDK for the Resend transactional email API; used inside the Vercel Function to call `emails.send` | Official first-party SDK for the provider already locked in by CONTEXT.md D-01; avoids hand-rolling a raw HTTPS call to Resend's REST API |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `@vercel/node` | 5.9.3 (npm) [ASSUMED — package identity via WebSearch/training knowledge; version confirmed via `npm view`, VERIFIED: npm registry] | Provides `VercelRequest`/`VercelResponse` TypeScript types for the classic `(request, response)` handler style | Only needed if the planner chooses the classic Node handler signature instead of the Web Standard `fetch` export (see Architecture Patterns, Pattern 1) — **not required** for the recommended `fetch`-export pattern, since that pattern types against the global `Request`/`Response` (available via `lib: ["DOM"]`, already present in `tsconfig.app.json`) |
| `vercel` (CLI) | 58.4.4 (npm) [ASSUMED — package identity via WebSearch/training knowledge; version confirmed via `npm view`, VERIFIED: npm registry] | Optional local CLI for `vercel dev` (local `/api` emulation) and `vercel link` | Only needed if the planner wants to test the serverless function locally before the D-06 checkpoint's live deploy; not required to ship — Vercel's own build pipeline builds `/api` independent of local tooling |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Resend SDK (`resend` npm package) | Raw `fetch()` to `https://api.resend.com/emails` with `Authorization: Bearer` header | SDK saves a small amount of boilerplate and gives typed responses; raw fetch avoids one dependency but CONTEXT.md D-01 already locked in Resend as the provider, and the SDK is the documented integration path — no reason to hand-roll the HTTP call |
| Web Standard `fetch` export (`api/contact.ts`) | Classic `(request, response)` handler with `@vercel/node` types | The `fetch` export needs zero extra dependencies and is Vercel's currently-recommended pattern (per official docs, "Create a Node.js function in /api" section: "No additional configuration is needed"); the classic handler adds `request.body`/`request.query` convenience helpers this phase's single POST endpoint doesn't need |
| Hand-written `public/sitemap.xml` | A sitemap-generation library (e.g. `vite-plugin-sitemap`, `sitemap` npm package) | With only 7 total indexable URLs (home + 6 shipped case studies) and a fixed, rarely-changing route list, a static hand-maintained file is simpler and has zero new dependencies; a generator only pays for itself once the URL set is large or changes frequently (not the case here, and CONTEXT.md leaves this to Claude's Discretion) |

**Installation:**
```bash
npm install resend
```
No `@vercel/node` install needed if the planner follows the recommended `fetch`-export pattern (Pattern 1 below). `vercel` CLI is optional and would be a `devDependency` only if local `vercel dev` testing is desired.

**Version verification:** Verified live against the npm registry during this research session:
```
$ npm view resend version        → 6.18.1
$ npm view @vercel/node version  → 5.9.3
$ npm view vercel version        → 58.4.4
```
[VERIFIED: npm registry] for the version numbers themselves. Per this agent's package-name provenance rule, the *package names* `resend`, `@vercel/node`, and `vercel` were originally surfaced via WebSearch/training knowledge, not an authoritative source lookup, so they carry `[ASSUMED]` tags above despite the registry confirming they exist — see Package Legitimacy Audit below for why this matters in practice for these two specific packages.

## Package Legitimacy Audit

| Package | Registry | Age (of latest publish) | Downloads | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| `resend` | npm | latest version published 2026-07-28 (6 days before this research date) | 9,082,525/wk | `github.com/resend/resend-node` | `[SUS]` (reason: "too-new") | Approved — see note below |
| `@vercel/node` | npm | latest version published 2026-07-30 (4 days before this research date) | 3,893,603/wk | `github.com/vercel/vercel` | `[SUS]` (reason: "too-new") | Approved — see note below |

**Note on the `[SUS]` verdicts:** The legitimacy gate's "too-new" heuristic is measuring the publish date of the *latest version*, not the package's first-ever release — both packages have millions of weekly downloads and long-established, verifiable GitHub source repos (`resend/resend-node`, `vercel/vercel`), which are strong legitimacy signals a newly-published/slopsquatted package would not have. This reads as a false positive from a continuously-released, actively-maintained package rather than a genuine hallucination/slopsquat risk. Per protocol, the `[SUS]` tag is kept and the planner **must still add a `checkpoint:human-verify` task** before the `npm install resend` step, even though the download-count/repo evidence strongly supports approval.

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `resend`, `@vercel/node` — planner must add `checkpoint:human-verify` before each install (or a single combined checkpoint covering both, since they're installed together).

## Architecture Patterns

### System Architecture Diagram

```
Browser (Footer.tsx contact form)
  │
  │ 1. onSubmit → preventDefault() (D-12)
  │ 2. read honeypot field value
  │
  ├─ honeypot non-empty? ──yes──> render success block, NO network call (D-10)
  │
  └─ honeypot empty (real user path)
        │
        │ 3. set Submitting state (button "Sending…", aria-busy)
        │ 4. fetch('/api/contact', { method: 'POST', body: JSON.stringify({ workingOn, email, clarify }) })
        ▼
  Vercel Function  api/contact.ts  (Node.js runtime, same-origin, no CORS needed)
        │
        │ 5. parse request body
        │ 6. server-side validation (email format, required fields present)
        │ 7. resend.emails.send({ from: 'onboarding@resend.dev',
        │                          to: 'hazrafarhinwork@gmail.com',
        │                          subject: `New brief from ${email}`,
        │                          text: '...' })
        ▼
  Resend API (external)
        │
        │ 8. { data, error } returned to the function
        ▼
  api/contact.ts responds:
        │  success → 200 JSON { ok: true }
        │  failure → 4xx/5xx JSON { ok: false, message }
        ▼
  Browser receives response
        │
        ├─ ok: true  → render Success block (D-09), form unmounted
        └─ ok: false → render Error banner above form, form + values remain mounted (D-09)

──────────────────────────────────────────────────────────────

Deep-link request (e.g. GET /case-study/mashreq, direct load/refresh)
  │
  ▼
Vercel routing layer
  │
  ├─ matches a real file/function? (static asset, /api/*)  → serve it directly
  │
  └─ no match → vercel.json rewrite: "/(.*)" → "/index.html"
        ▼
  index.html served → React Router (client-side) reads the URL,
  matches `case-study/:slug`, renders CaseStudyPage — no 404
```

### Recommended Project Structure
```
api/
└── contact.ts        # Vercel Function — Web Standard fetch export, calls Resend
public/
├── favicon.svg        # existing
├── resume.pdf          # existing (D-13: verify only)
├── robots.txt          # NEW — Disallow the 5 deferred slugs
└── sitemap.xml          # NEW — hand-maintained, lists only the 6 shipped case studies + home
vercel.json            # NEW — SPA rewrite so deep links survive refresh
src/
├── components/home/Footer.tsx   # gains onSubmit, honeypot, success/error render
└── content/footer.ts             # gains success/error/sending copy strings
```

### Pattern 1: Vercel Function via the Web Standard `fetch` export (recommended)
**What:** A single `/api/contact.ts` file exporting a default object with an async `fetch(request: Request)` method that returns a standard `Response`.
**When to use:** Any single-purpose Vercel Function with no need for `request.query`/`request.cookies` convenience helpers — exactly this phase's one POST endpoint.
**Example:**
```typescript
// Source: https://vercel.com/docs/functions/runtimes/node-js
// (CITED: vercel.com/docs/functions/runtimes/node-js, "Create a Node.js function in /api")
// api/contact.ts
export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    const body = await request.json();
    // ...validate body, call Resend...

    return Response.json({ ok: true }, { status: 200 });
  },
};
```
No `@vercel/node` dependency, no `vercel.json` `functions` config block, no build-step configuration — Vercel detects the file and runtime automatically [CITED: vercel.com/docs/functions/runtimes/node-js].

### Pattern 2: Resend call with explicit error forwarding
**What:** Call `resend.emails.send`, check the returned `error` field (Resend does not throw), and map it to an HTTP error response the client's `fetch` call can distinguish from success.
**When to use:** Every call to the Resend API in this phase — this is the only send path.
**Example:**
```typescript
// Source: https://resend.com/docs/send-with-nodejs
// (CITED: resend.com/docs/send-with-nodejs)
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const { data, error } = await resend.emails.send({
  from: 'onboarding@resend.dev',
  to: 'hazrafarhinwork@gmail.com',
  subject: `New brief from ${submitterEmail}`,
  text: `What are you working on?\n${workingOn}\n\nEmail: ${submitterEmail}\n\nWhat needs to become clearer?\n${clarify}`,
});

if (error) {
  return Response.json({ ok: false, message: error.message }, { status: 502 });
}

return Response.json({ ok: true, id: data?.id }, { status: 200 });
```

### Pattern 3: SPA catch-all rewrite
**What:** A single `vercel.json` rewrite rule that sends every unmatched path to `/index.html`.
**When to use:** Any Vite SPA deployed on Vercel using a client-side router (React Router here) — this phase's DEPL-02.
**Example:**
```json
// Source: https://vercel.com/docs/frameworks/frontend/vite ("Using Vite to make SPAs")
// (CITED: vercel.com/docs/frameworks/frontend/vite)
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```
[CITED] Vercel resolves real files/functions (including everything under `/api`) before evaluating rewrites, so this single rule is sufficient and does not need an `/api/(.*)` exclusion — confirmed via Vercel community/official guidance that filesystem-generated routes take precedence over rewrite rules.

### Pattern 4: Client-side honeypot short-circuit
**What:** Before calling `fetch('/api/contact', ...)`, read the hidden honeypot input's value. If non-empty, skip the network call entirely and go straight to rendering the success block.
**When to use:** Exactly the UI-SPEC's Interaction & Motion Contract requirement — "no network call made" on the honeypot path, so response-timing/response-shape can't leak the detection mechanism to a bot.
**Example (illustrative, not prescriptive of exact variable names):**
```typescript
async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault(); // D-12 fix
  const form = e.currentTarget;
  const honeypot = (form.elements.namedItem('company') as HTMLInputElement)?.value;

  if (honeypot) {
    setStatus('success'); // silent reject — identical UI, no fetch (D-10)
    return;
  }

  setStatus('submitting');
  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ workingOn, email, clarify }),
    });
    const json = await res.json();
    setStatus(json.ok ? 'success' : 'error');
  } catch {
    setStatus('error'); // network failure also renders the error banner (values preserved via uncontrolled inputs)
  }
}
```

### Anti-Patterns to Avoid
- **Prefixing `RESEND_API_KEY` with `VITE_`:** Any Vite env var prefixed `VITE_` is inlined into the client JS bundle at build time and is publicly readable in browser devtools. `RESEND_API_KEY` must be added to Vercel's Project Settings environment variables **without** a `VITE_` prefix so it is only ever read via `process.env` inside `api/contact.ts` (server-side, never bundled) [CITED: vercel.com/docs/frameworks/frontend/vite, "Environment Variables"].
- **Trusting client-side `required` HTML validation as the only validation layer:** Native `required`/`type="email"` attributes are trivially bypassed by any direct POST to `/api/contact` (e.g. curl). The function should re-validate required fields and a basic email shape server-side before calling Resend — this is standard defense-in-depth for any publicly-reachable endpoint, not optional hardening.
- **Special-casing `/api/(.*)` in the `vercel.json` rewrite:** Unnecessary and adds a maintenance surface — Vercel already resolves functions before rewrites (Pattern 3).
- **Reaching for a sitemap-generation library for 7 URLs:** Overkill for this phase's fixed, small route set (see Alternatives Considered).

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Sending transactional email via SMTP/raw HTTP | A hand-rolled `fetch()` to Resend's REST API with manually-constructed auth headers and error parsing | `resend` npm SDK's `emails.send()` | SDK handles auth header formatting, typed request/response shapes, and the `{ data, error }` contract already documented by Resend — CONTEXT.md D-01 already locked in Resend as the provider, only the call mechanism is in question here |
| Detecting and rejecting bot form submissions | A custom bot-detection heuristic (user-agent sniffing, timing analysis, etc.) | The single honeypot field already decided in D-10 | CONTEXT.md explicitly scoped spam protection to honeypot-only for v1 (D-10) and deferred CAPTCHA/rate-limiting; building anything more elaborate here is out of this phase's locked scope |
| SPA deep-link routing on Vercel | A custom Express-style catch-all server, or manually configuring Vercel's legacy `routes` array | The single `vercel.json` `rewrites` rule (Pattern 3) | This is Vercel's own documented, one-line fix for exactly this problem — no framework-level or server-level workaround needed |

**Key insight:** Every piece of net-new infrastructure this phase introduces (serverless function shape, SPA rewrite, email SDK call) has a single, short, officially-documented canonical form. The risk in this phase is not under-building — it's over-building (adding unneeded dependencies like `@vercel/node` types, a sitemap generator, or a custom spam-detection layer) where a locked decision or a one-line platform feature already covers the requirement.

## Runtime State Inventory

> Not applicable — this is a greenfield-additive phase (new `/api` function, new `vercel.json`, new `robots.txt`/`sitemap.xml`), not a rename/refactor/migration phase. No existing stored data, live service config, OS-registered state, or build artifacts reference strings being renamed. **Skipped per Step 2.5 trigger condition.**

The one adjacent "runtime state" concern worth flagging (not a rename, but state-shaped): the deferred case-study routes (`DEFERRED_SLUG_ROUTES` in `src/router.tsx`) are **staying registered** per D-07 — this is a deliberate non-removal, not a gap. No route deletion means no dangling-link risk from stale bookmarks/cached links to `/case-study/riyaah` etc. — they'll still resolve to the coming-soon page, just with no inbound links from the site itself.

## Common Pitfalls

### Pitfall 1: `RESEND_API_KEY` never added to Vercel, function fails silently in production
**What goes wrong:** The function works in theory but every submission returns a 500/502 in production because the env var was never added to the Vercel project (it only exists in the local, gitignored `.env`).
**Why it happens:** Local `.env` files are never uploaded to Vercel automatically — Vercel Functions only see variables explicitly added via Project Settings (or `vercel env add`).
**How to avoid:** D-06's manual checkpoint must explicitly instruct the user to add `RESEND_API_KEY` as a Project Environment Variable in the Vercel dashboard before the live-deployment verification step runs.
**Warning signs:** The contact form works in local dev (`vercel dev`, if used) but fails on the deployed URL; function logs in the Vercel dashboard show a Resend auth error.

### Pitfall 2: Sending to any address other than `hazrafarhinwork@gmail.com` from `onboarding@resend.dev`
**What goes wrong:** The `to` field is hardcoded correctly per D-02, but if a future edit (or a stray test) sets `to` to a different address, Resend returns a 403-style error because the sending domain is unverified.
**Why it happens:** `onboarding@resend.dev` is a Resend test-only address restricted to the account owner's verified email — this is a platform-enforced restriction, not a bug [CITED: resend.com/docs/knowledge-base/403-error-resend-dev-domain].
**How to avoid:** Hard-code `to: 'hazrafarhinwork@gmail.com'` (or read it from a single source-of-truth constant, e.g. `footerContent.contactEmail`) — never accept `to` as user input, and never let it drift from the literal value already locked in D-02.
**Warning signs:** Resend's `error` object mentions "own email address" or domain verification.

### Pitfall 3: `vercel.json` rewrite added, but built with the wrong Output Directory assumption
**What goes wrong:** If a custom `vercel.json` `outputDirectory` or `buildCommand` override is added unnecessarily, it can conflict with the auto-detected Vite defaults (`dist`, `npm run build`) and break the deploy.
**Why it happens:** Some tutorials show a full `vercel.json` with `buildCommand`/`outputDirectory` fields "just in case," but this repo's `package.json` `build` script and Vite's default `dist` output already match Vercel's auto-detection exactly [CITED: vercel.com/docs/builds/configure-a-build].
**How to avoid:** Keep `vercel.json` minimal — only the `rewrites` array (Pattern 3). Do not add `buildCommand`/`outputDirectory` overrides; let auto-detection do its job.
**Warning signs:** A "framework detected but build failed" error in the Vercel deployment log after import.

### Pitfall 4: `tsc -b` (the project's own build script) does not type-check `/api/contact.ts`
**What goes wrong:** `npm run build` (`tsc -b && vite build`) only builds the projects referenced by `tsconfig.json` — currently `tsconfig.app.json` (scoped to `include: ["src"]`) and `tsconfig.node.json` (scoped to `vite.config.ts`). A file under `/api` at the repo root is outside both, so TypeScript errors inside `api/contact.ts` will NOT surface via `npm run build` or `npm run lint` locally.
**Why it happens:** `/api` is a new, third code area this phase introduces; the existing tsconfig project-references setup was never designed to include it.
**How to avoid:** Either (a) accept that Vercel's own build pipeline type-checks/transpiles `/api` independently at deploy time (esbuild-based, catches syntax errors but not full `tsc` strictness), or (b) add a third `tsconfig` reference (e.g. `tsconfig.api.json` with `include: ["api"]`) wired into the root `tsconfig.json`'s `references` array so `tsc -b` covers it locally too. Flag this as a planning decision — CONTEXT.md's "exact serverless function file structure" discretion area covers this.
**Warning signs:** A typo or type error inside `api/contact.ts` passes local `npm run build`/CI but the function fails/behaves unexpectedly once deployed.

### Pitfall 5: Native HTML5 `required`/`type="email"` validation gives a false sense of server-side safety
**What goes wrong:** Because the client already blocks empty-field submission (D-11), it's tempting to skip server-side re-validation in `api/contact.ts` entirely.
**Why it happens:** The UI-SPEC's "native browser validation UI" section (marked ⚠ unresolved) only covers the *client* validation UX, not whether the server trusts it.
**How to avoid:** Re-check for empty/whitespace-only fields and a basic email-shape regex inside `api/contact.ts` before calling Resend — any direct POST to the endpoint (bypassing the browser form entirely) skips all client-side checks.
**Warning signs:** Malformed or empty-field emails arriving in the inbox from non-browser traffic.

## Code Examples

### Minimal end-to-end contact submission (client → function → Resend)
```typescript
// Source: https://vercel.com/docs/functions/runtimes/node-js +
//         https://resend.com/docs/send-with-nodejs
// (CITED: both URLs)
// api/contact.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactBody {
  workingOn?: string;
  email?: string;
  clarify?: string;
}

export default {
  async fetch(request: Request) {
    if (request.method !== 'POST') {
      return new Response('Method Not Allowed', { status: 405 });
    }

    let body: ContactBody;
    try {
      body = await request.json();
    } catch {
      return Response.json({ ok: false, message: 'Invalid request body' }, { status: 400 });
    }

    const { workingOn, email, clarify } = body;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!workingOn?.trim() || !email?.trim() || !clarify?.trim() || !emailPattern.test(email)) {
      return Response.json({ ok: false, message: 'Missing or invalid fields' }, { status: 400 });
    }

    const { error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'hazrafarhinwork@gmail.com',
      subject: `New brief from ${email}`,
      text: `What are you working on?\n${workingOn}\n\nReach me at: ${email}\n\nWhat needs to become clearer?\n${clarify}`,
    });

    if (error) {
      return Response.json({ ok: false, message: error.message }, { status: 502 });
    }

    return Response.json({ ok: true }, { status: 200 });
  },
};
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Vercel Functions written with `(req, res)` + `@vercel/node` types as the only supported pattern | Web Standard `fetch(request: Request)` export supported natively, no dependency required | Documented as current in Vercel's Node.js runtime docs (checked 2026-08-03) | This phase should default to the dependency-free `fetch` export (Pattern 1) rather than installing `@vercel/node`, unless the planner specifically needs `request.query`/`request.cookies` helpers |

**Deprecated/outdated:**
- Legacy `vercel.json` `routes` array (predecessor to `rewrites`/`redirects`/`headers`) — current docs exclusively show the `rewrites` array for this use case; do not reach for `routes`.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Package identity of `resend`, `@vercel/node`, and `vercel` (CLI) as the correct npm packages for this integration | Standard Stack, Package Legitimacy Audit | Low — all three were cross-checked live against the npm registry (existence + version + download counts + source repo), and `resend` in particular is already a name-locked decision from CONTEXT.md D-01, not a research discovery |
| A2 | Exact shape of Resend's 403 error object when sending to a non-owner address from an unverified domain (message text/format) | Common Pitfalls (Pitfall 2) | Low — the *existence* and cause of the restriction is confirmed via Resend's own knowledge-base article; only the precise error string wasn't independently reproduced this session (no live Resend account call was made) |
| A3 | Hand-maintained static `sitemap.xml` is preferable to a generator library for this project's scale | Standard Stack (Alternatives Considered) | Low — this is explicitly left to Claude's Discretion in CONTEXT.md, and the recommendation is a simplicity judgment call, not a factual claim requiring verification |

## Open Questions (RESOLVED)

1. **Exact `api/contact.ts` handler style (Web Standard `fetch` export vs. classic `(request, response)` + `@vercel/node`)**
   - What we know: Both are officially supported; the `fetch` export needs no extra dependency and is the pattern Vercel's own docs lead with for "Create a Node.js function in /api."
   - What's unclear: Whether the planner prefers the classic style for familiarity/parity with any existing Express-like mental model.
   - Recommendation: Default to the `fetch` export (Pattern 1) — CONTEXT.md's "Claude's Discretion" section explicitly leaves "exact serverless function file structure/naming" open, and the dependency-free option is simpler.
   - **RESOLVED:** Planner adopted the `fetch` export in `04-02-PLAN.md` Task 1, per the recommendation above.

2. **Whether to add a third TypeScript project reference so `tsc -b` covers `/api`**
   - What we know: Vercel's own deploy pipeline will type-check/transpile `/api` independently of this repo's local `tsc -b` regardless of what's decided here.
   - What's unclear: Whether the team wants local `npm run build`/CI to also catch `/api` type errors before deploy (see Pitfall 4).
   - Recommendation: Add the reference (low cost, catches errors earlier) unless the planner judges it out of scope for this phase's size.
   - **RESOLVED:** Planner added `tsconfig.api.json` in `04-02-PLAN.md` Task 3, per the recommendation above.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Local dev, build | ✓ | v26.5.0 | — |
| npm | Package install | ✓ | 11.17.0 | — |
| Vercel CLI (`vercel`) | Optional local `vercel dev` testing of `/api/contact.ts` before deploy | ✗ (not installed) | — | Not required — the D-06 checkpoint deploys via GitHub import + Vercel dashboard, not local CLI; install only if the planner wants pre-deploy local testing (`npm install -g vercel` or `npx vercel dev`) |
| Vercel account connected to this repo's GitHub remote | DEPL-01, all live verification steps | ✗ (confirmed not connected per CONTEXT.md D-06) | — | None — this is exactly what D-06's manual checkpoint exists to resolve; no code-only fallback |
| `RESEND_API_KEY` value | Contact form delivery (CONT-01) | ✓ (exists in local `.env`, gitignored) | — | Must be copied into Vercel's Project Settings env vars during the D-06 checkpoint — local presence alone does not make it available to the deployed function |

**Missing dependencies with no fallback:**
- Vercel account/GitHub connection (D-06 checkpoint is the only path to resolving this — by design, not an oversight)

**Missing dependencies with fallback:**
- Vercel CLI — optional, dashboard-driven deploy flow works without it

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.10 + @testing-library/react 16.3.2 (existing, already configured) |
| Config file | `vite.config.ts` (`test` block) — existing, no new config file needed |
| Quick run command | `npx vitest run src/components/home/Footer.test.tsx` |
| Full suite command | `npm test` (runs `vitest run`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| CONT-01 | Form submit calls `/api/contact` with the 3 field values when honeypot is empty | unit (mock `global.fetch`) | `npx vitest run src/components/home/Footer.test.tsx` | ❌ Wave 0 — extend existing `Footer.test.tsx` |
| CONT-01 | Serverless function delivers a real email end-to-end | manual-only (justification: requires a live Resend API call + live inbox check against `hazrafarhinwork@gmail.com`; cannot be simulated in Vitest/jsdom without mocking away the exact thing being verified) | N/A — verified via `/gsd-verify-work` against the live deployed URL | N/A |
| CONT-02 | Success state renders in place after a 2xx response; error banner renders with preserved field values after a non-2xx/network failure | unit (mock `global.fetch` resolved/rejected) | `npx vitest run src/components/home/Footer.test.tsx` | ❌ Wave 0 |
| CONT-02 | Honeypot non-empty → success block renders, `fetch` is NOT called | unit (spy on `global.fetch`, assert not called) | `npx vitest run src/components/home/Footer.test.tsx` | ❌ Wave 0 |
| CONT-03 | Résumé link downloads a working PDF | manual-only (justification: verifying an actual PDF file downloads correctly and opens is a human/browser check, not simulable in jsdom) | N/A — verified via `/gsd-verify-work` against the live deployed URL | N/A — existing test already covers the `href`/`download` attribute (`Footer.test.tsx` line 40-45); the *content* verification is manual-only |
| DEPL-01 | Site is publicly reachable at a `*.vercel.app` URL | manual-only (justification: deployment reachability is an infrastructure check, not a unit-testable behavior) | N/A — verified via `/gsd-verify-work` | N/A |
| DEPL-02 | Direct load/refresh of `/case-study/mashreq` returns the app shell, not a 404 | manual-only (justification: requires a real HTTP request to the deployed Vercel routing layer; `vercel.json` rewrite behavior cannot be exercised inside Vitest/jsdom) | N/A — verified via `/gsd-verify-work` against the live deployed URL | N/A |
| DEPL-03 | Homepage renders no links to the 5 deferred slugs; "see more" toggle is gone | unit | `npx vitest run src/components/home/SelectedWork.test.tsx` | ❌ Wave 0 — existing `SelectedWork.test.tsx` currently asserts the "see more" toggle DOES work (D-08 requires rewriting these assertions, not just adding new ones) |
| DEPL-03 | 5 deferred slugs excluded from `sitemap.xml`; disallowed in `robots.txt` | unit (parse the two static files, assert slug strings absent/disallowed) | new test file, e.g. `npx vitest run src/test/seo.test.ts` | ❌ Wave 0 — no test file exists for this yet |

### Sampling Rate
- **Per task commit:** `npx vitest run <changed-test-file>`
- **Per wave merge:** `npm test`
- **Phase gate:** Full suite green before `/gsd-verify-work`; all manual-only rows above must be executed against the live deployed URL, not local dev, per ROADMAP.md's explicit "verified end-to-end, not just a 200 response" standard for this phase.

### Wave 0 Gaps
- [ ] Extend `src/components/home/Footer.test.tsx` — cover CONT-01/CONT-02 submit/success/error/honeypot behavior (mock `global.fetch`)
- [ ] Rewrite `src/components/home/SelectedWork.test.tsx` — remove/replace assertions that currently expect the "see more" toggle and deferred-slug cards to exist (DEPL-03/D-08)
- [ ] New `src/test/seo.test.ts` (or similar) — assert `public/robots.txt` disallows the 5 deferred slugs and `public/sitemap.xml` omits them (DEPL-03)
- [ ] No new framework/config install needed — Vitest + Testing Library are already fully configured

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | N/A — no auth surface in this phase |
| V3 Session Management | no | N/A |
| V4 Access Control | no | N/A — `/api/contact` is intentionally public (anyone can submit the contact form) |
| V5 Input Validation | yes | Server-side re-validation of required fields + email-shape regex inside `api/contact.ts` (Pitfall 5) — never trust client-side `required`/`type="email"` alone |
| V6 Cryptography | no | N/A — no cryptographic operations introduced; `RESEND_API_KEY` custody is a secrets-management concern (covered below), not a crypto-primitive one |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| `RESEND_API_KEY` leaking into the client bundle | Information Disclosure | Never prefix the env var `VITE_`; only read it via `process.env` inside `api/contact.ts` (server-side only) — see Anti-Patterns |
| Spam/abuse via automated form submission | Denial of Service (resource exhaustion of Resend send quota / inbox flooding) | Honeypot field (D-10, already locked); CAPTCHA/rate-limiting explicitly deferred by CONTEXT.md — accepted residual risk for v1, not a gap to fix in this phase |
| Malformed/injected `subject`/`text` content reaching Resend (e.g. newline injection attempting to smuggle extra headers) | Tampering | Resend's `emails.send` takes `subject`/`text` as discrete JSON API fields (not raw SMTP header text the caller constructs), which structurally prevents classic SMTP header-injection; still worth stripping/rejecting embedded newlines from the `email` field specifically since it's interpolated into the `subject` string (`New brief from ${email}`) |
| Direct POST to `/api/contact` bypassing all client-side checks (empty fields, malformed email) | Tampering | Server-side validation inside the function (Pitfall 5) — the client's `required` attributes provide UX only, not security |
| Unverified sending domain accidentally allowing a spoofed/different recipient | Tampering / Information Disclosure | `to` field hardcoded to `hazrafarhinwork@gmail.com` (D-02), never accepted as user input — Resend's own domain-verification restriction is a secondary backstop, not the primary control |

## Sources

### Primary (HIGH confidence)
None — no Context7/curated-authoritative sources were reachable in this session (Context7 MCP tool unavailable in this environment); all findings below fall to CITED/MEDIUM or lower.

### Secondary (MEDIUM confidence)
- [Using the Node.js Runtime with Vercel Functions](https://vercel.com/docs/functions/runtimes/node-js) — official Vercel docs, fetched via WebFetch; handler signatures, TypeScript support, request/response helpers
- [Vite on Vercel](https://vercel.com/docs/frameworks/frontend/vite) — official Vercel docs, fetched via WebFetch; SPA rewrite requirement, environment variable behavior, auto-detected build settings
- [Rewrites on Vercel](https://vercel.com/docs/routing/rewrites) — official Vercel docs, fetched via WebFetch; rewrite syntax, routing precedence
- [Send emails with Node.js - Resend](https://resend.com/docs/send-with-nodejs) — official Resend docs, fetched via WebFetch; SDK usage, `{ data, error }` contract
- [403 Error Using resend.dev Domain - Resend](https://resend.com/docs/knowledge-base/403-error-resend-dev-domain) — official Resend knowledge base, surfaced via WebSearch; unverified-domain recipient restriction

### Tertiary (LOW confidence)
- General WebSearch results on robots.txt/sitemap.xml conventions (no single authoritative source page fetched directly) — used to confirm Disallow/absolute-URL conventions, marked for validation if precise syntax matters beyond the basics
- General WebSearch results on honeypot accessibility attributes (`aria-hidden`, `tabindex="-1"`, `autocomplete="off"`) — cross-referenced across multiple third-party dev blogs, not a single official spec; already aligned with CONTEXT.md D-10's own accessibility guidance

## Metadata

**Confidence breakdown:**
- Standard stack: MEDIUM — package identities are training/WebSearch-derived (tagged `[ASSUMED]` per provenance rule) but versions/existence independently verified live against the npm registry; Resend as the provider itself was already a locked CONTEXT.md decision, not a research finding
- Architecture: MEDIUM — Vercel/Resend patterns confirmed via official docs fetched this session (CITED), but Context7 was unavailable so nothing reached HIGH/VERIFIED tier
- Pitfalls: MEDIUM — derived from official docs plus reasoning about this specific repo's tsconfig/build setup (verified directly by reading the repo's own config files, not assumed)

**Research date:** 2026-08-03
**Valid until:** 2026-08-17 (14 days — Vercel/Resend APIs and npm package versions move fast enough that a shorter-than-default window is warranted; re-verify package versions before executing if this research is consumed after that date)
