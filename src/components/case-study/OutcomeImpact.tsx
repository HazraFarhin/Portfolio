import Markdown from 'react-markdown';
import { Body, Heading } from '../ui/Typography';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * "Outcome & Impact" body section (item 7 of the case-study template's
 * document order, per Project Page- Template.md / D-11). Renders the
 * section's markdown-body string via react-markdown, remapping `img` to
 * ImagePlaceholder (D-02). Falls back to an italic placeholder sentence
 * when the section content is empty -- a defensive backstop per
 * 02-UI-SPEC.md's Copywriting Contract.
 */

interface OutcomeImpactProps {
  content: string;
}

const FALLBACK_COPY =
  'Outcome details pending — qualitative summary of impact and stakeholder reception to follow.';

export function OutcomeImpact({ content }: OutcomeImpactProps) {
  const hasContent = content.trim().length > 0;

  return (
    <section>
      <Heading as="h2">Outcome & Impact</Heading>
      {hasContent ? (
        <Markdown
          components={{
            p: ({ children }) => <Body>{children}</Body>,
            li: ({ children }) => <Body as="li">{children}</Body>,
            img: () => <ImagePlaceholder caption="Outcome visual — pending" size="stage" />,
          }}
        >
          {content}
        </Markdown>
      ) : (
        <Body className="italic">{FALLBACK_COPY}</Body>
      )}
    </section>
  );
}
