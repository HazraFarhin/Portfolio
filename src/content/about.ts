/**
 * About section copy (HOME-07, D-12, D-13). No matching copy exists in
 * `Homepage Copy V2.md` for this section, so `bio` is fresh, condensed
 * copy -- Claude's-discretion original wording per D-12, derived from
 * `heroContent.statement` plus PROJECT.md's Context section (background
 * across banking/e-commerce/telecom/martech/beauty/sports tech; India/UAE/
 * Saudi Arabia/Canada/USA), not a verbatim repeat of either source.
 */
export interface AboutContent {
  label: string;
  heading: string;
  bio: string;
  headshotCaption: string;
}

export const aboutContent: AboutContent = {
  label: 'Who I Am',
  heading: 'About',
  bio: 'Hazra is a UX/UI Designer with about four years shaping interfaces for banking, e-commerce, telecom, martech, beauty, and sports-tech products across India, the UAE, Saudi Arabia, Canada, and the USA. Every project starts from the same brief: understand what the user needs and what the business needs the screen to do, then design and hand off systems a team can run without her in the room. Currently remote, working comfortably across CET-to-GST hours.',
  headshotCaption: 'Hazra Farhin — photo pending',
};
