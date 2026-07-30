import { useRef } from 'react';
import { ImagePlaceholder } from '../case-study/ImagePlaceholder';
import { Body, Heading, Label } from '../ui/Typography';
import { aboutContent } from '../../content/about';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * About section (HOME-07, D-12, D-13). A compact, fresh bio alongside a
 * portrait-sized headshot placeholder, reusing the shared `ImagePlaceholder`
 * component's new `portrait` size (this plan's own additive extension of
 * that Phase 2 component). The bio renders in full -- no truncation class --
 * since the 2-4 sentence cap is a copy-authoring constraint, not a CSS clamp.
 */
export function About() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section id="about" ref={ref}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-xl items-center">
        <ImagePlaceholder caption={aboutContent.headshotCaption} size="portrait" />
        <div>
          <Label>{aboutContent.label}</Label>
          <Heading as="h2">{aboutContent.heading}</Heading>
          <Body>{aboutContent.bio}</Body>
        </div>
      </div>
    </section>
  );
}
