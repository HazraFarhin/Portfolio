/**
 * How I Work section copy (HOME-05, D-02). Combines the Studio Method
 * action-words and the 5-step Operating Loop into a single content module
 * because the user explicitly locked these two content beats as ONE
 * section, never two separate sections (D-02). Action words + methodIntro
 * sourced verbatim from `Portfolio-Documentation/Homepage Copy V2.md` §03;
 * loopSteps sourced verbatim from §09.
 */
export interface LoopStep {
  name: string;
  description: string;
}

export interface HowIWorkContent {
  label: string;
  heading: string;
  methodIntro: string;
  actionWords: string[];
  loopSteps: LoopStep[];
}

export const howIWorkContent: HowIWorkContent = {
  label: 'How I Work',
  heading: 'The Loop',
  methodIntro:
    "The method doesn't change per industry, only the constraints do. Understand what's actually breaking for the user and what the business needs to move forward. Align with clients and developers early on what's feasible, not after the designs are done. Cut the interface back to what earns its place on screen, then build it in a way the next designer or developer can pick up without a briefing.",
  actionWords: ['listen', 'align', 'reduce', 'design.', 'prototype', 'systemize'],
  loopSteps: [
    {
      name: 'Understand',
      description:
        "Research the product, the users, and the real constraint, technical, business, or regulatory, that's actually shaping the problem.",
    },
    {
      name: 'Align',
      description:
        "Sit down with clients and developers early to confirm what's actually needed and what's actually buildable, before it's baked into a design nobody can ship.",
    },
    {
      name: 'Structure',
      description:
        'Turn findings into information architecture and flows the whole team, including developers and stakeholders, can agree on before a single pixel is final.',
    },
    {
      name: 'Design',
      description:
        'Build high-fidelity screens and interactive prototypes tested against real content and edge cases, not idealised data.',
    },
    {
      name: 'Transfer',
      description:
        'Document components, states, and logic, and hand off production-ready screens, so the system keeps working without me.',
    },
  ],
};
