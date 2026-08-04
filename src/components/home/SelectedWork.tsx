import { useRef } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Body, Heading, Label } from '../ui/Typography';
import { ImagePlaceholder } from '../case-study/ImagePlaceholder';
import { caseStudies } from '../../content/case-studies/loader';
import { selectedWorkContent } from '../../content/selected-work';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * Selected Work section (HOME-03, D-07/D-08). Renders only the 6 real
 * loader-sourced case studies -- no expand/collapse state, no "see more"
 * toggle, and no links to the 5 deferred slugs. The deferred case studies'
 * routes remain registered in `router.tsx` (D-07) but are never linked from
 * this section per DEPL-03; HOME-04's original "see more" expansion is
 * intentionally removed (superseded by DEPL-03, see REQUIREMENTS.md).
 */
export function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section id="selected-work" ref={ref}>
      <Label>{selectedWorkContent.label}</Label>
      <Heading>{selectedWorkContent.heading}</Heading>
      <Body className="max-w-[62ch]">{selectedWorkContent.supportingCopy}</Body>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-lg">
        {caseStudies.map((cs) => (
          <Card key={cs.slug}>
            <ImagePlaceholder caption={`${cs.title} cover — pending`} size="stage" />
            <Heading as="h3">{cs.title}</Heading>
            <Label>{cs.client}</Label>
            <Body className="line-clamp-2">{cs.summary}</Body>
            <Button variant="ghost" href={`/case-study/${cs.slug}`}>
              View case study →
            </Button>
          </Card>
        ))}
      </div>

      <Body>{selectedWorkContent.footnote}</Body>
    </section>
  );
}
