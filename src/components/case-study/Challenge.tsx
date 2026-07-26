import Markdown from 'react-markdown';
import { cn } from '../../lib/cn';
import { Body, Heading } from '../ui/Typography';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * "The Challenge" body section (item 8 of the case-study template's document
 * order, per D-11). Renders the challenge narrative via react-markdown.
 *
 * The template's one explicitly-optional sub-element is the pull-quote: when
 * the markdown body contains a blockquote (`> ...`), react-markdown renders it
 * via the custom `blockquote` component with italic + left-border styling.
 * When no blockquote is present in the source, react-markdown simply emits
 * nothing for the tag -- no extra conditional logic needed here.
 *
 * Any img markup in content is remapped to ImagePlaceholder (defensive per
 * D-02; this section has no structural image slot of its own per D-11).
 */

interface ChallengeProps {
  content: string;
}

export function Challenge({ content }: ChallengeProps) {
  return (
    <section>
      <Heading as="h2">The Challenge</Heading>
      <Markdown
        components={{
          p: ({ children }) => <Body>{children}</Body>,
          li: ({ children }) => <Body as="li">{children}</Body>,
          // Pull-quote treatment: italic + left accent border (UI-SPEC optional sub-element).
          // react-markdown only calls this component when a blockquote actually
          // appears in the source -- so when absent, no empty shell is rendered.
          blockquote: ({ children }) => (
            <blockquote className={cn('italic border-l-2 border-line pl-md')}>
              {children}
            </blockquote>
          ),
          // Defensive img remap (D-02 -- no structural image slot for this section per D-11).
          img: () => (
            <ImagePlaceholder caption="Challenge artifact — pending" size="stage" />
          ),
        }}
      >
        {content}
      </Markdown>
    </section>
  );
}
