/**
 * Selected Work section copy (HOME-03/HOME-04), sourced verbatim from
 * `Portfolio-Documentation/Homepage Copy V2.md` §07 -- EXCLUDING the 5
 * per-project copy blocks in that section, which describe fictional
 * projects ("AI-Native Banking Interface", "Cloud Migration Platform",
 * "Luxury Beauty Commerce Platform", "AI-Based Astrology Platform",
 * "Analytics Dashboards") that don't match the real case-study loader data
 * (D-08). The grid itself is sourced from `caseStudies`
 * (`src/content/case-studies/loader.ts`), never from this content module.
 */
export interface SelectedWorkContent {
  label: string;
  heading: string;
  supportingCopy: string;
  footnote: string;
  seeMoreLabel: string;
  seeLessLabel: string;
}

export const selectedWorkContent: SelectedWorkContent = {
  label: 'Selected Work',
  heading: 'Interfaces Built to Hold Up',
  supportingCopy:
    "Every project here followed the same loop: understand the problem and the business goal behind it, align with stakeholders and developers on what's actually feasible, structure a solution, design to remove friction, then hand off something reusable. The sectors changed. The process didn't.",
  footnote:
    'Design Systems · Multi-Market UX · Dashboards · Conversational & AI Interfaces · Commerce · Business Requirement Translation · Developer Handoff',
  seeMoreLabel: 'See more',
  seeLessLabel: 'See less',
};
