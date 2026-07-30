import { useRef } from 'react';
import { Body, Heading, Label } from '../ui/Typography';
import { proofStripContent } from '../../content/proof-strip';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * Proof Strip credibility section (HOME-02). Renders exactly 4 fixed,
 * hardcoded stat blocks (indexed 0..3 into proofStripContent.stats,
 * mirroring Process.tsx's numbered literal-sequence discipline) --
 * never derived via array iteration -- so the 4-stat count and order is
 * guaranteed regardless of what the content module actually contains.
 *
 * Only the 4 stat-value figures carry `text-accent` (UI-SPEC's 10%-accent
 * budget); captions and supporting copy stay on the default foreground
 * color scale.
 */
export function ProofStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section id="proof-strip" ref={sectionRef}>
      <Label>{proofStripContent.label}</Label>
      <Heading as="h2">{proofStripContent.heading}</Heading>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-lg">
        {/* Stat 0: ~4 years in product design */}
        <div>
          <Heading as="p" className="text-accent">
            {proofStripContent.stats[0].value}
          </Heading>
          <Label as="p">{proofStripContent.stats[0].caption}</Label>
        </div>

        {/* Stat 1: 8+ industries shipped across */}
        <div>
          <Heading as="p" className="text-accent">
            {proofStripContent.stats[1].value}
          </Heading>
          <Label as="p">{proofStripContent.stats[1].caption}</Label>
        </div>

        {/* Stat 2: 3 regions designed for */}
        <div>
          <Heading as="p" className="text-accent">
            {proofStripContent.stats[2].value}
          </Heading>
          <Label as="p">{proofStripContent.stats[2].caption}</Label>
        </div>

        {/* Stat 3: 30% avg. reduction in reporting/task time */}
        <div>
          <Heading as="p" className="text-accent">
            {proofStripContent.stats[3].value}
          </Heading>
          <Label as="p">{proofStripContent.stats[3].caption}</Label>
        </div>
      </div>
      <Body>{proofStripContent.supportingLine}</Body>
    </section>
  );
}
