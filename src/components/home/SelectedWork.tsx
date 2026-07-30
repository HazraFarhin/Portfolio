import { useRef, useState } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Body, Heading, Label } from '../ui/Typography';
import { ImagePlaceholder } from '../case-study/ImagePlaceholder';
import { caseStudies } from '../../content/case-studies/loader';
import { deferredCaseStudies } from '../../content/case-studies/deferred';
import { selectedWorkContent } from '../../content/selected-work';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * Selected Work section (HOME-03/HOME-04, D-08/D-09/D-10). Renders the real
 * 6 loader-sourced case studies on initial mount, and appends the 5 deferred
 * coming-soon stubs into the SAME grid behind a persistent "see more" toggle
 * (D-09 -- the toggle button never unmounts). Deferred cards always carry a
 * visible "Coming soon" label so they're never mistaken for shipped work
 * (D-10).
 */
export function SelectedWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  const [expanded, setExpanded] = useState(false);

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

        {expanded &&
          deferredCaseStudies.map((dcs) => (
            <Card key={dcs.slug}>
              <ImagePlaceholder caption={`${dcs.title} cover — pending`} size="stage" />
              <Heading as="h3">{dcs.title}</Heading>
              <Label>Coming soon</Label>
              <Button variant="ghost" href={`/case-study/${dcs.slug}`}>
                View case study →
              </Button>
            </Card>
          ))}
      </div>

      <Button
        variant="ghost"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
      >
        {expanded ? selectedWorkContent.seeLessLabel : selectedWorkContent.seeMoreLabel}
      </Button>

      <Body>{selectedWorkContent.footnote}</Body>
    </section>
  );
}
