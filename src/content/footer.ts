/**
 * Contact/Brief + Footer section copy (HOME-08, CONT-04, D-07/D-15/D-16).
 * Brief copy sourced verbatim from `Homepage Copy V2.md` §11; Footer copy
 * sourced verbatim from §12. `elsewhere` contains ONLY the LinkedIn and
 * Behance URLs confirmed real by a human in Plan 03-05's checkpoint
 * (03-05-SUMMARY.md) -- Website was explicitly recorded as "omit" there
 * (no real URL supplied yet), so no Website entry exists in this array.
 * Never add a placeholder/guessed URL here; only checkpoint-confirmed
 * values may populate `elsewhere`.
 */
export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterContent {
  briefLabel: string;
  briefIntro: string;
  formFields: {
    workingOn: string;
    emailLabel: string;
    clarify: string;
  };
  submitLabel: string;
  resumeLabel: string;
  resumeHref: string;
  wordmark: string;
  tagline: string;
  contactEmail: string;
  contactEmailHref: string;
  contactPhone: string;
  contactLocation: string;
  elsewhere: FooterLink[];
  legal: string[];
  bottomLine: string;
}

export const footerContent: FooterContent = {
  briefLabel: 'Brief',
  briefIntro:
    "Have a product that needs clearer thinking on screen, for your users or for your team's roadmap? Tell me what's not working yet.",
  formFields: {
    workingOn: 'What are you working on?',
    emailLabel: 'Reach me at, Email *',
    clarify: 'What needs to become clearer?',
  },
  submitLabel: 'Send the Brief →',
  resumeLabel: 'Download Résumé',
  resumeHref: '/resume.pdf',
  wordmark: 'Hazra Farhin',
  tagline:
    'UX/UI Designer building interfaces that reduce friction and hold up to business requirements, across FinTech, commerce, dashboards, and whatever comes next.',
  contactEmail: 'hazrafarhinwork@gmail.com',
  contactEmailHref: 'mailto:hazrafarhinwork@gmail.com',
  contactPhone: '+91 93992 18725',
  contactLocation: 'Bhilai, Chhattisgarh, India (Remote)',
  // Only checkpoint-confirmed URLs from 03-05-SUMMARY.md -- Website omitted
  // (no real URL supplied), never fabricated.
  elsewhere: [
    { label: 'LinkedIn ↗', href: 'https://www.linkedin.com/in/hazra-/' },
    { label: 'Behance ↗', href: 'https://www.behance.net/hazra_' },
  ],
  legal: ['Privacy Policy', 'Terms'],
  bottomLine:
    '© 2026 Hazra Farhin · Available for on-site and remote engagements across Europe, the Gulf, and North America',
};
