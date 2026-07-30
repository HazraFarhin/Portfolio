import { useRef } from 'react';
import { Body, Label } from '../ui/Typography';
import { ImagePlaceholder } from '../case-study/ImagePlaceholder';
import { fieldArchiveContent } from '../../content/field-archive';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * Field Archive gallery (D-04, 03-RESEARCH.md Pattern 4). A native
 * `overflow-x-auto` horizontally-scrollable region -- never a
 * ScrollTrigger-pinned, container-driven scroll-jacked gallery
 * (REQUIREMENTS.md's explicit anti-scroll-jacking ban, RESEARCH.md
 * Pitfall 2). The section's only motion call is its own decorative
 * fade/rise entrance reveal; it is never scroll-position-linked
 * horizontal motion.
 */
export function FieldArchive() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="field-archive" ref={sectionRef}>
      <Label>{fieldArchiveContent.label}</Label>
      <Body>{fieldArchiveContent.copy}</Body>
      <div
        className="flex gap-md overflow-x-auto snap-x snap-proximity"
        role="region"
        aria-label="Field Archive gallery"
        tabIndex={0}
      >
        {fieldArchiveContent.captions.map((caption) => (
          <div key={caption} className="snap-start shrink-0">
            <ImagePlaceholder caption={caption} size="stage" />
          </div>
        ))}
      </div>
    </section>
  );
}
