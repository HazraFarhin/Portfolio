/**
 * Skills & Tools section copy (HOME-06, D-03, D-14 clarified), sourced
 * verbatim from `Homepage Copy V2.md` §04/Operating Stack for the 5
 * capability cards. `heading: 'Operating Stack'` is a planner-derived label
 * matching the source doc's own "04/Operating Stack" section name -- no
 * explicit `Heading:` field exists in the source for this section.
 *
 * `skillTags` is a computed aggregation (never a hand-typed literal) over
 * the real case-study frontmatter `tags` field via
 * `caseStudies.flatMap(...)`, deduplicated and alphabetically sorted for a
 * stable display order independent of `Set` iteration order. Per D-14
 * clarified: this reads the literal frontmatter `tags` field only -- NOT
 * the unstructured `Tools Used` Markdown body -- so it stays honest to real
 * case-study data as those files are edited.
 */
import { caseStudies } from './case-studies/loader';

export interface SkillCard {
  title: string;
  description: string;
}

export interface SkillsToolsContent {
  label: string;
  heading: string;
  leadLine: string;
  cards: SkillCard[];
  closingNote: string;
}

export const skillsToolsContent: SkillsToolsContent = {
  label: 'What I Do',
  heading: 'Operating Stack',
  leadLine:
    'I design the interface layer around a product: research, structure, screens, and the system that holds them together, shaped by conversations with the people who have to approve it and the people who have to build it.',
  cards: [
    {
      title: 'Discovery & Research',
      description:
        "Understanding real user needs and real business goals before a single screen gets drawn, so the two aren't discovered to be in conflict halfway through the project.",
    },
    {
      title: 'UX Strategy & IA',
      description:
        'Turning ambiguous problems into structured flows and wireframes that hold up against edge cases, technical limits, and what the business actually needs the product to do.',
    },
    {
      title: 'UI Design & Prototyping',
      description:
        'High-fidelity interfaces and interactive prototypes built to a standard that survives contact with real developers and real users, not just a review meeting.',
    },
    {
      title: 'Stakeholder & Developer Alignment',
      description:
        'Working directly with clients, product leads, and engineering teams to turn business requirements and technical constraints into design decisions everyone has actually agreed to, not just signed off on.',
    },
    {
      title: 'Design Systems & Dev Handoff',
      description:
        "Reusable components and production-ready screens that shorten the distance between design and shipped product, so quality doesn't erode at handoff.",
    },
  ],
  closingNote:
    'I focus on what to minimize before planning out the additions, and on getting the business, the user, and the dev team reading from the same brief.',
};

/**
 * Distinct, alphabetically-sorted tag values aggregated from every loaded
 * case study's frontmatter `tags` field. MUST remain a computed expression
 * (RESEARCH.md Don't Hand-Roll) -- never reassigned to a hardcoded literal
 * array duplicating these values.
 */
export const skillTags: string[] = [...new Set(caseStudies.flatMap((cs) => cs.tags))].sort();
