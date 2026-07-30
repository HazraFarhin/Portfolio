/**
 * Persistent nav bar copy (D-06, Homepage Copy V2.md §01 Navigation --
 * 4-link cadence, "Engage" swapped for "Skills" since Engage is cut per
 * D-05, per UI-SPEC Copywriting Contract). Kept in a dedicated content
 * module -- not hardcoded in JSX -- because the homepage copy is an
 * explicit rough draft expected to be rewritten after visual iteration
 * (see PROJECT.md Context).
 */
export interface NavLink {
  label: string;
  href: string;
}

export interface NavContent {
  wordmark: string;
  wordmarkHref: string;
  links: NavLink[];
}

export const navContent: NavContent = {
  wordmark: 'Hazra Farhin',
  wordmarkHref: '#hero',
  links: [
    { label: 'Work', href: '#selected-work' },
    { label: 'Method', href: '#how-i-work' },
    { label: 'Skills', href: '#skills-tools' },
    { label: 'Contact', href: '#contact-footer' },
  ],
};
