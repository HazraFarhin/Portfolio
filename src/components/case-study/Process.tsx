import { cn } from '../../lib/cn';
import { Body, Heading, Label } from '../ui/Typography';
import { ImagePlaceholder } from './ImagePlaceholder';

/**
 * "Process" body section (item 9 of the case-study template's document
 * order, per D-11). Renders exactly 5 fixed sub-stages in this hardcoded
 * order: Discovery & Research, Define, Ideate & Wireframe, Design & Prototype,
 * Test & Iterate. Exactly 3 of the 5 stages include a stage-sized
 * ImagePlaceholder (Discovery & Research, Ideate & Wireframe, Design &
 * Prototype) -- the other 2 (Define, Test & Iterate) do not.
 *
 * The component NEVER iterates Object.keys(stages) or Object.entries(stages) --
 * it always maps over a hardcoded 5-item descriptor array to guarantee the
 * fixed count and order regardless of what the stages prop actually contains.
 */

export interface ProcessStages {
  discoveryResearch: string;
  define: string;
  ideateWireframe: string;
  designPrototype: string;
  testIterate: string;
}

interface ProcessProps {
  stages: ProcessStages;
}

// Fixed, hardcoded descriptor array -- this array's structure is what
// guarantees the "always exactly 5, never variable-length" constraint (D-11).
// Never derive this from Object.keys(stages) or Object.entries(stages).
const STAGE_DESCRIPTORS: Array<{
  key: keyof ProcessStages;
  label: string;
  hasImage: boolean;
}> = [
  { key: 'discoveryResearch', label: 'Discovery & Research', hasImage: true },
  { key: 'define', label: 'Define', hasImage: false },
  { key: 'ideateWireframe', label: 'Ideate & Wireframe', hasImage: true },
  { key: 'designPrototype', label: 'Design & Prototype', hasImage: true },
  { key: 'testIterate', label: 'Test & Iterate', hasImage: false },
];

export function Process({ stages }: ProcessProps) {
  return (
    <section>
      <Heading as="h2">Process</Heading>
      <div className={cn('flex flex-col gap-xl')}>
        {STAGE_DESCRIPTORS.map(({ key, label, hasImage }, index) => (
          <div key={key}>
            {/* Numbered eyebrow label (h3) reusing the Label-as-eyebrow
                pattern from Hero's existing label+statement pairing */}
            <Label as="h3">{`${String(index + 1).padStart(2, '0')} — ${label}`}</Label>
            <Body>{stages[key]}</Body>
            {hasImage && (
              <ImagePlaceholder
                caption={`${label} artifact — pending`}
                size="stage"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
