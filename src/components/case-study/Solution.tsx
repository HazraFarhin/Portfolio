import Markdown from 'react-markdown';
import { cn } from '../../lib/cn';
import { Body, Heading } from '../ui/Typography';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * "Solution" body section (item 10 of the case-study template's document
 * order, per D-11). The centerpiece section -- renders the solution narrative
 * via react-markdown plus 2 fixed, unconditional centerpiece-sized
 * ImagePlaceholder blocks (D-11's structural image slots for this section).
 * The 2 image slots are never conditional on content -- they are always
 * present, regardless of whether the markdown body is empty or not (D-02).
 *
 * Any image markup embedded in the markdown content itself is remapped to
 * ImagePlaceholder (defensive per D-02 -- none of the 6 authored placeholder
 * files embed an image here, but the remap must exist).
 */

interface SolutionProps {
  content: string;
}

export function Solution({ content }: SolutionProps) {
  return (
    <section>
      <Heading as="h2">Solution</Heading>
      <Markdown
        components={{
          p: ({ children }) => <Body>{children}</Body>,
          li: ({ children }) => <Body as="li">{children}</Body>,
          // Defensive remap: any img embedded in the markdown body (e.g. an
          // author accidentally pasting an image link) is remapped to a
          // stage-sized placeholder rather than rendering a native <img>.
          // This is the fallback path; the 2 structural centerpiece slots
          // below are unconditional and distinct from this remap.
          img: () => (
            <ImagePlaceholder caption="Solution detail — pending" size="stage" />
          ),
        }}
      >
        {content}
      </Markdown>
      {/* Structural centerpiece image slots (D-11): always rendered,
          never conditional on content. These 2 slots are the largest
          placeholder size on the page per UI-SPEC. */}
      <div className={cn('grid grid-cols-1 md:grid-cols-2 gap-md')}>
        <ImagePlaceholder caption="Final solution — pending" size="centerpiece" />
        <ImagePlaceholder caption="Final solution detail — pending" size="centerpiece" />
      </div>
    </section>
  );
}
