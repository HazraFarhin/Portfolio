/**
 * Deferred case-study stub data (HOME-04, D-09/D-10).
 *
 * No `.md` content files exist for these 5 slugs (Phase 2 D-10) -- they
 * are the 5 case studies deferred behind Selected Work's "See more" toggle,
 * not yet written up as full case studies. This module intentionally
 * mirrors none of `loader.ts`'s parsing/validation machinery: it is a
 * minimal, hardcoded display-only stub list, not a second content pipeline.
 *
 * [ASSUMED] These `title` values are humanized display copy derived
 * directly from each slug (RESEARCH.md Assumptions Log A1) -- they are NOT
 * sourced from any verified case-study content file, brief, or client-approved
 * copy, since none exists yet for these 5 projects. No other field (client,
 * industry, summary) is fabricated alongside them (T-03-04, accepted risk).
 *
 * Order matches `Portfolio-Documentation/Information Architecture.md`'s
 * slug order for the deferred 5 (positions 7-11 of the 11 total case studies).
 */
export interface DeferredCaseStudy {
  slug: string;
  title: string;
}

export const deferredCaseStudies: DeferredCaseStudy[] = [
  { slug: 'riyaah', title: 'Riyaah' },
  { slug: 'icici-bank-atm-kiosk', title: 'ICICI Bank ATM Kiosk' },
  { slug: 'ambit', title: 'Ambit' },
  { slug: 'northernarc', title: 'NorthernArc' },
  { slug: 'citrus', title: 'Citrus' },
];
