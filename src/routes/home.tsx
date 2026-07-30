import { useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Label, Body } from '../components/ui/Typography';
import { heroContent } from '../content/hero';
import { useScrollReveal } from '../motion/useScrollReveal';
import { Nav } from '../components/home/Nav';
import { ProofStrip } from '../components/home/ProofStrip';
import { SelectedWork } from '../components/home/SelectedWork';
import { FieldArchive } from '../components/home/FieldArchive';
import { HowIWork } from '../components/home/HowIWork';
import { SkillsTools } from '../components/home/SkillsTools';
import { About } from '../components/home/About';
import { Footer } from '../components/home/Footer';

/**
 * The homepage route -- the phase's capstone integration point
 * (03-07-PLAN.md). Composes the persistent Nav plus every homepage section
 * (Hero, Proof Strip, Selected Work, Field Archive, How I Work, Skills &
 * Tools, About, Contact/Footer) in locked Information Architecture order.
 * Each imported section component already owns its own root section
 * wrapper -- this route renders them as plain siblings, adding no new
 * wrapping markup of its own.
 */
export default function HomeRoute() {
  const heroRef = useRef<HTMLElement>(null);
  useScrollReveal(heroRef);

  return (
    <>
      <Nav />
      <section id="hero" ref={heroRef}>
        <Label>{heroContent.eyebrow}</Label>
        <Body className="max-w-[62ch]">{heroContent.statement}</Body>
        <Button href={heroContent.ctaHref}>{heroContent.ctaLabel}</Button>
        <Card>
          <Body>{heroContent.metaDescription}</Body>
          <Label>{heroContent.metaStatus}</Label>
        </Card>
      </section>
      <ProofStrip />
      <SelectedWork />
      <FieldArchive />
      <HowIWork />
      <SkillsTools />
      <About />
      <Footer />
    </>
  );
}
