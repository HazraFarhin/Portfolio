/**
 * Field Archive gallery copy (D-04), sourced verbatim from
 * `Portfolio-Documentation/Homepage Copy V2.md` §06. Kept in a dedicated
 * content module -- not hardcoded in JSX -- because the homepage copy is
 * an explicit rough draft expected to be rewritten after visual iteration
 * (see PROJECT.md Context).
 */
export interface FieldArchiveContent {
  label: string;
  copy: string;
  captions: string[];
}

export const fieldArchiveContent: FieldArchiveContent = {
  label: 'Field Archive',
  copy: 'Fragments from research boards, wireframes, and shipped interfaces, before the system takes final shape.',
  captions: [
    'Early flow mapping, digital banking self-service',
    'Wireframe iteration, cloud migration dashboard',
    'Component states, RTL-optimised commerce UI',
    'Usability test notes, AI-native agent tooling',
    'Stakeholder review notes, requirement changes tracked',
    'Handoff spec, production-ready HTML/CSS',
  ],
};
