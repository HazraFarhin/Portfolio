import { useParams } from 'react-router';
import { Challenge } from '../components/case-study/Challenge';
import { DraftBadge } from '../components/case-study/DraftBadge';
import { ImagePlaceholder } from '../components/case-study/ImagePlaceholder';
import { LearningsReflections } from '../components/case-study/LearningsReflections';
import { NextProject } from '../components/case-study/NextProject';
import { OutcomeImpact } from '../components/case-study/OutcomeImpact';
import { Overview } from '../components/case-study/Overview';
import { Process } from '../components/case-study/Process';
import { Solution } from '../components/case-study/Solution';
import { ToolsUsed } from '../components/case-study/ToolsUsed';
import { Button } from '../components/ui/Button';
import { Heading, Body } from '../components/ui/Typography';
import { getCaseStudyBySlug, getNextCaseStudy } from '../content/case-studies/loader';
import { cn } from '../lib/cn';

/**
 * CaseStudyPage — the capstone route component for Phase 2 (D-07).
 *
 * Composes every Phase 2 artifact into the fixed D-11 document order:
 * 1. Cover banner (ImagePlaceholder, banner size)
 * 2. Title (h1)
 * 3. One-line summary
 * 4. DraftBadge (visible only for Draft status)
 * 5. Overview (role/outcome above the fold, CASE-03)
 * 6. Tools Used
 * 7. Outcome & Impact
 * 8. The Challenge
 * 9. Process
 * 10. Solution
 * 11. Learnings & Reflections
 * 12. Next Project
 *
 * NO hardcoded slug literals appear anywhere in this file (CASE-04).
 * Rendering is a literal, hardcoded JSX sequence -- never a `.map()` over
 * a section-descriptor array derived from parsed content, guaranteeing the
 * fixed document order regardless of markdown heading order (T-02-17).
 */

// Consistent inter-section spacing per UI-SPEC: py-xl on mobile, py-2xl on desktop.
const sectionClass = cn('py-xl md:py-2xl');

export default function CaseStudyPage() {
  const { slug } = useParams<{ slug: string }>();

  // Defensive lookup: getCaseStudyBySlug returns undefined for deferred/unknown
  // slugs without throwing (T-02-15, T-02-16).
  const caseStudy = slug ? getCaseStudyBySlug(slug) : undefined;

  // Case-study-specific not-found fallback (data miss: slug matched the route
  // pattern, but no content file exists for it). Distinct copy from NotFoundRoute
  // (routing miss for unmatched paths).
  if (!caseStudy) {
    return (
      <div className="flex flex-col items-center justify-center gap-md min-h-[50vh] text-center px-lg">
        <Body>Case study not found.</Body>
        <Body>This project isn&apos;t available yet. Browse the case studies that are live today.</Body>
        <Button variant="ghost" href="/">
          ← Back to home
        </Button>
      </div>
    );
  }

  // Circular Next Project computation (Plan 02-08). Defensive guard (`next &&`)
  // since an edge case with 0-1 loaded files could theoretically return undefined,
  // even though Plan 02-08's circular guarantee means this is safe for all 6 real slugs.
  const next = getNextCaseStudy(caseStudy.slug);

  return (
    <article>
      {/* 1. Cover banner */}
      <ImagePlaceholder caption="Cover image — pending" size="banner" />

      {/* 2. Title */}
      <Heading as="h1">{caseStudy.title}</Heading>

      {/* 3. One-line summary */}
      <Body className="max-w-[62ch]">{caseStudy.summary}</Body>

      {/* 4. Draft badge (null for Published) */}
      <DraftBadge status={caseStudy.status} />

      {/* 5. Overview (CASE-03: role/outcome visible without scrolling) */}
      <section className={sectionClass}>
        <Overview
          client={caseStudy.client}
          industry={caseStudy.industry}
          role={caseStudy.role}
          team={caseStudy.team}
          timeline={caseStudy.timeline}
          external_link={caseStudy.external_link}
        />
      </section>

      {/* 6. Tools Used */}
      <section className={sectionClass}>
        <ToolsUsed content={caseStudy.sections.toolsUsed} />
      </section>

      {/* 7. Outcome & Impact */}
      <section className={sectionClass}>
        <OutcomeImpact content={caseStudy.sections.outcomeImpact} />
      </section>

      {/* 8. The Challenge */}
      <section className={sectionClass}>
        <Challenge content={caseStudy.sections.challenge} />
      </section>

      {/* 9. Process */}
      <section className={sectionClass}>
        <Process stages={caseStudy.sections.process} />
      </section>

      {/* 10. Solution */}
      <section className={sectionClass}>
        <Solution content={caseStudy.sections.solution} />
      </section>

      {/* 11. Learnings & Reflections */}
      <section className={sectionClass}>
        <LearningsReflections content={caseStudy.sections.learnings} />
      </section>

      {/* 12. Next Project (circular, always defined for all 6 real slugs) */}
      <section className={sectionClass}>
        {next && <NextProject nextTitle={next.title} nextSlug={next.slug} />}
      </section>
    </article>
  );
}
