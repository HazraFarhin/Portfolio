import Markdown from 'react-markdown';
import { cn } from '../../lib/cn';
import { Heading, Label } from '../ui/Typography';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * "Tools Used" body section (item 6 of the case-study template's document
 * order, per Project Page- Template.md / D-11). Renders the section's
 * markdown-body string via react-markdown, remapping `img` to
 * ImagePlaceholder (D-02) and `li` to a chip-styled pill. Falls back to a
 * muted "Tools list pending." label when the section content is empty --
 * a defensive backstop per 02-UI-SPEC.md's Copywriting Contract, since all
 * placeholder files ship at least 3 generic tools (D-01).
 */

interface ToolsUsedProps {
  content: string;
}

const chipClasses =
  'text-body font-normal text-foreground rounded-full border border-line px-sm py-xs';

export function ToolsUsed({ content }: ToolsUsedProps) {
  const hasContent = content.trim().length > 0;

  return (
    <section>
      <Heading as="h2">Tools Used</Heading>
      {hasContent ? (
        <div className="flex flex-wrap gap-sm">
          <Markdown
            components={{
              // `display: contents` lets the chip <li>s participate directly
              // in the wrapping div's flex layout instead of being trapped
              // inside a single block-level <ul> child.
              ul: ({ children }) => <ul className="contents">{children}</ul>,
              li: ({ children }) => <li className={cn(chipClasses)}>{children}</li>,
              img: () => <ImagePlaceholder caption="Tool icon — pending" size="stage" />,
            }}
          >
            {content}
          </Markdown>
        </div>
      ) : (
        <Label>Tools list pending.</Label>
      )}
    </section>
  );
}
