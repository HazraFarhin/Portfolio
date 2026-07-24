/**
 * Hero section copy (D-05), sourced verbatim from
 * `Portfolio-Documentation/Homepage Copy V2.md` §02 / Hero. Kept in a
 * dedicated content module -- not hardcoded in JSX -- because the homepage
 * copy is an explicit rough draft expected to be rewritten after visual
 * iteration (see PROJECT.md Context).
 */
export interface HeroContent {
  eyebrow: string;
  statement: string;
  ctaLabel: string;
  ctaHref: string;
  metaDescription: string;
  metaStatus: string;
}

export const heroContent: HeroContent = {
  eyebrow: 'Hazra Farhin · UX/UI Designer',
  statement:
    "Hazra designs solution oriented interfaces to minimize friction for products where the stakes are real: banking flows, checkout paths, dashboards people rely on daily. The work starts with two questions asked at the same time: what does the user need, and what does the business need this screen to do. Research that's actually used, interfaces that remove friction before adding decoration, and systems a team, including the developers building it, can run without her in the room.",
  ctaLabel: 'View Selected Work →',
  // Phase 1 ships Hero-only (D-06) -- there is no "Selected Work" section
  // yet to link to. `#hero` is a real, currently-resolvable in-page anchor
  // pointing at the Hero section's own `id="hero"` (set in home.tsx), so
  // the CTA is a genuine, testable anchor link today rather than a dead
  // href. Phase 3 repoints this same field to `#selected-work` once that
  // section exists.
  ctaHref: '#hero',
  metaDescription:
    'Product design, systems, and front-end-ready UI for teams across the USA, the Gulf, and beyond, built around user needs and business outcomes together.',
  metaStatus: 'Remote · CET to GST overlap · Available for new work',
};
