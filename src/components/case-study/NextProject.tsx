import { Button } from '../ui/Button';
import { Heading } from '../ui/Typography';

/**
 * "Next Project" footer nav component (item 12 of the case-study template's
 * document order, per D-11). A pure presentational component -- it performs
 * NO internal case-study data lookup of its own. The caller (CaseStudyPage)
 * is responsible for calling Plan 02-08's `getNextCaseStudy()` and passing
 * the already-resolved title/slug down as plain string props.
 */

interface NextProjectProps {
  nextTitle: string;
  nextSlug: string;
}

export function NextProject({ nextTitle, nextSlug }: NextProjectProps) {
  return (
    <section>
      <Heading as="h2">Next Project</Heading>
      <Button variant="primary" href={`/case-study/${nextSlug}`}>
        {nextTitle} →
      </Button>
    </section>
  );
}
