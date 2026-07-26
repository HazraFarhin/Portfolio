import Markdown from 'react-markdown';
import { Body, Heading } from '../ui/Typography';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * "Learnings & Reflections" body section (item 11 of the case-study template's
 * document order, per D-11). Renders the learnings narrative via react-markdown,
 * following the exact same structural pattern as ToolsUsed/OutcomeImpact
 * (Plan 02-04).
 *
 * No bespoke empty-state fallback -- UI-SPEC's Copywriting Contract only
 * specifies empty-state copy for Tools Used, Outcome & Impact, and Overview's
 * Links row. D-01 guarantees all 6 authored files populate this section, so
 * rendering nothing for an empty string is the correct, spec-accurate behavior.
 *
 * Any img markup in content is remapped to ImagePlaceholder (defensive per
 * D-02; this section has no structural image slot of its own per D-11).
 */

interface LearningsReflectionsProps {
  content: string;
}

export function LearningsReflections({ content }: LearningsReflectionsProps) {
  return (
    <section>
      <Heading as="h2">Learnings &amp; Reflections</Heading>
      <Markdown
        components={{
          p: ({ children }) => <Body>{children}</Body>,
          li: ({ children }) => <Body as="li">{children}</Body>,
          // Defensive img remap (D-02 -- no structural image slot for this section per D-11).
          img: () => (
            <ImagePlaceholder caption="Reflection artifact — pending" size="stage" />
          ),
        }}
      >
        {content}
      </Markdown>
    </section>
  );
}
