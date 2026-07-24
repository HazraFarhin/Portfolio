---
status: testing
phase: 01-foundation-motion-infrastructure
source: [01-VERIFICATION.md]
started: 2026-07-24T18:05:00Z
updated: 2026-07-24T18:05:00Z
---

## Current Test

number: 1
name: Real-browser keyboard focus order and visible focus ring on the CTA
expected: |
  Run `npm run dev`, open the Hero route (/). Tab through the page's focusable elements and confirm the CTA anchor (<a href="#hero">) receives keyboard focus in the correct order with a visible focus-visible ring, per the existing `focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent` classes.
awaiting: user response

## Tests

### 1. Real-browser keyboard focus order and visible focus ring on the CTA
expected: Tab order reaches the CTA; a visible ring renders per the existing focus-visible classes. jsdom cannot render or observe real focus-visible rings or tab order in a live browser.
result: [pending]

### 2. CTA anchor-click scroll behavior — acceptability judgment
expected: Per source-trace, clicking the CTA (href="#hero") will be a native, instant browser anchor-jump (Lenis's `anchors` option is unset in MotionProvider.tsx, so its click-interception is never attached). Judge whether this native jump is acceptable in context (it matches the Axisform reference template's own anchor-link behavior and does not leave a lasting scroll desync in the idle-click case) or whether `anchors: true` should be added to MotionProvider.tsx's Lenis constructor as a follow-up.
result: [pending]

### 3. Live OS-level reduced-motion toggle — final visual confirmation
expected: Enable `prefers-reduced-motion: reduce` at the OS level, reload the Hero route, and confirm both (a) the GSAP scroll-reveal is suppressed with content immediately visible, and (b) scrolling now feels native/instant rather than eased (Lenis's smooth-scroll also disabled). Disable the OS setting and reload again to confirm both re-enable.
result: [pending]

## Summary

total: 3
passed: 0
issues: 0
pending: 3
skipped: 0
blocked: 0

## Gaps
