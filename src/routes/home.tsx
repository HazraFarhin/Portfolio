import { useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Label, Body } from '../components/ui/Typography';
import { heroContent } from '../content/hero';
import { useScrollReveal } from '../motion/useScrollReveal';

/**
 * The Hero section -- the phase's capstone integration point (01-06-PLAN.md).
 * Composed entirely from components/ui/ primitives and heroContent data,
 * animated via useScrollReveal. Hero-only scope this phase (D-06); Phase 3
 * adds the remaining homepage sections as siblings within this same route.
 */
export default function HomeRoute() {
  const heroRef = useRef<HTMLElement>(null);
  useScrollReveal(heroRef);

  return (
    <section id="hero" ref={heroRef}>
      <Label>{heroContent.eyebrow}</Label>
      <Body className="max-w-[62ch]">{heroContent.statement}</Body>
      <Button href={heroContent.ctaHref}>{heroContent.ctaLabel}</Button>
      <Card>
        <Body>{heroContent.metaDescription}</Body>
        <Label>{heroContent.metaStatus}</Label>
      </Card>
    </section>
  );
}
