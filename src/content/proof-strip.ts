/**
 * Proof Strip stats copy (HOME-02), sourced verbatim from
 * `Portfolio-Documentation/Homepage Copy V2.md` §05 Telemetry. Kept in a
 * dedicated content module -- not hardcoded in JSX -- because the homepage
 * copy is an explicit rough draft expected to be rewritten after visual
 * iteration (see PROJECT.md Context).
 */
export interface ProofStat {
  value: string;
  caption: string;
}

export interface ProofStripContent {
  label: string;
  heading: string;
  stats: ProofStat[];
  supportingLine: string;
}

export const proofStripContent: ProofStripContent = {
  label: 'In Practice',
  heading: 'Design, In Numbers',
  stats: [
    { value: '~4', caption: 'years in product design' },
    {
      value: '8+',
      caption:
        'industries shipped across -- FinTech, e-commerce, telecom, martech, beauty, sports tech',
    },
    {
      value: '3',
      caption: 'regions designed for -- India, UAE, Saudi Arabia, Canada, USA',
    },
    {
      value: '30%',
      caption: 'avg. reduction in reporting/task time on shipped projects',
    },
  ],
  supportingLine:
    'Working across industries and directly with founders, product leads, and engineering teams has shown me that user needs and business goals rarely conflict. They just need someone translating between design, product, and engineering.',
};
