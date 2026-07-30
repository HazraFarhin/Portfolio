import { useRef } from 'react';
import { Body, Heading, Label } from '../ui/Typography';
import { howIWorkContent } from '../../content/how-i-work';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * How I Work section (HOME-05, D-02). Renders the 6 Studio Method
 * action-words and the 5-step Operating Loop together inside ONE section --
 * never split into two -- per the user's locked D-02 decision. Both beats
 * are rendered as literal, hardcoded JSX blocks (never `.map()` over the
 * content-module arrays) so the fixed count and order is guaranteed
 * regardless of what `howIWorkContent` actually contains, mirroring
 * `Process.tsx`'s numbered-eyebrow pattern.
 */
export function HowIWork() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  return (
    <section id="how-i-work" ref={ref}>
      <Label>{howIWorkContent.label}</Label>
      <Heading>{howIWorkContent.heading}</Heading>
      <Body className="max-w-[62ch]">{howIWorkContent.methodIntro}</Body>

      <div className="flex flex-wrap gap-md">
        {/* Action word 0 */}
        <Heading as="span">{howIWorkContent.actionWords[0]}</Heading>
        {/* Action word 1 */}
        <Heading as="span">{howIWorkContent.actionWords[1]}</Heading>
        {/* Action word 2 */}
        <Heading as="span">{howIWorkContent.actionWords[2]}</Heading>
        {/* Action word 3 */}
        <Heading as="span">{howIWorkContent.actionWords[3]}</Heading>
        {/* Action word 4 */}
        <Heading as="span">{howIWorkContent.actionWords[4]}</Heading>
        {/* Action word 5 */}
        <Heading as="span">{howIWorkContent.actionWords[5]}</Heading>
      </div>

      <div className="flex flex-col gap-xl">
        {/* Loop step 0 */}
        <div>
          <Label as="h3">{`${String(1).padStart(2, '0')} — ${howIWorkContent.loopSteps[0].name}`}</Label>
          <Body>{howIWorkContent.loopSteps[0].description}</Body>
        </div>
        {/* Loop step 1 */}
        <div>
          <Label as="h3">{`${String(2).padStart(2, '0')} — ${howIWorkContent.loopSteps[1].name}`}</Label>
          <Body>{howIWorkContent.loopSteps[1].description}</Body>
        </div>
        {/* Loop step 2 */}
        <div>
          <Label as="h3">{`${String(3).padStart(2, '0')} — ${howIWorkContent.loopSteps[2].name}`}</Label>
          <Body>{howIWorkContent.loopSteps[2].description}</Body>
        </div>
        {/* Loop step 3 */}
        <div>
          <Label as="h3">{`${String(4).padStart(2, '0')} — ${howIWorkContent.loopSteps[3].name}`}</Label>
          <Body>{howIWorkContent.loopSteps[3].description}</Body>
        </div>
        {/* Loop step 4 */}
        <div>
          <Label as="h3">{`${String(5).padStart(2, '0')} — ${howIWorkContent.loopSteps[4].name}`}</Label>
          <Body>{howIWorkContent.loopSteps[4].description}</Body>
        </div>
      </div>
    </section>
  );
}
