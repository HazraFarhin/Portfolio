import { useRef } from 'react';
import { Card } from '../ui/Card';
import { Body, Heading, Label } from '../ui/Typography';
import { skillsToolsContent, skillTags } from '../../content/skills-tools';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * Skills & Tools section (HOME-06, D-03, D-14 clarified). Renders exactly
 * 5 literal capability cards in fixed sequence -- never a dynamic loop over
 * the cards array -- plus a data-driven tool-chip row over the real,
 * computed `skillTags` export (the intentional exception to the
 * fixed-sequence rule, since that list's length legitimately varies with
 * case-study content).
 */
export function SkillsTools() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section id="skills-tools" ref={ref}>
      <Label>{skillsToolsContent.label}</Label>
      <Heading as="h2">{skillsToolsContent.heading}</Heading>
      <Body className="max-w-[62ch]">{skillsToolsContent.leadLine}</Body>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {/* Card 0 */}
        <Card>
          <Heading as="h3">{skillsToolsContent.cards[0].title}</Heading>
          <Body>{skillsToolsContent.cards[0].description}</Body>
        </Card>
        {/* Card 1 */}
        <Card>
          <Heading as="h3">{skillsToolsContent.cards[1].title}</Heading>
          <Body>{skillsToolsContent.cards[1].description}</Body>
        </Card>
        {/* Card 2 */}
        <Card>
          <Heading as="h3">{skillsToolsContent.cards[2].title}</Heading>
          <Body>{skillsToolsContent.cards[2].description}</Body>
        </Card>
        {/* Card 3 */}
        <Card>
          <Heading as="h3">{skillsToolsContent.cards[3].title}</Heading>
          <Body>{skillsToolsContent.cards[3].description}</Body>
        </Card>
        {/* Card 4 */}
        <Card>
          <Heading as="h3">{skillsToolsContent.cards[4].title}</Heading>
          <Body>{skillsToolsContent.cards[4].description}</Body>
        </Card>
      </div>

      <Body>{skillsToolsContent.closingNote}</Body>

      <div className="flex flex-wrap gap-sm">
        {skillTags.map((tag) => (
          <Label key={tag} as="span" className="rounded-full border border-line px-md py-xs">
            {tag}
          </Label>
        ))}
      </div>
    </section>
  );
}
