import { ImageOff } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Label } from '../ui/Typography';

/**
 * Shared placeholder block for every image slot in the case-study template
 * (D-02). No real project assets exist this phase, so this component
 * renders unconditionally in place of a native image element -- never one
 * pointed at a nonexistent path (see 02-UI-SPEC.md "Placeholder Image
 * Blocks").
 */

export type ImagePlaceholderSize = 'banner' | 'stage' | 'centerpiece' | 'portrait';

interface ImagePlaceholderProps {
  caption: string;
  size: ImagePlaceholderSize;
}

const baseClasses =
  'rounded-2xl border border-line bg-gradient-to-br from-secondary to-dominant flex flex-col items-center justify-center gap-sm';

const sizeClasses: Record<ImagePlaceholderSize, string> = {
  // Cover image (1x per page) -- 21:9 desktop, 16:9 on mobile per UI-SPEC.
  banner: 'aspect-[21/9] max-sm:aspect-video max-h-[clamp(140px,20vh,220px)]',
  // Process sub-stage images (3x per page).
  stage: 'aspect-video max-h-[200px]',
  // Solution images (2x per page) -- the largest placeholder size on the page.
  centerpiece: 'aspect-[4/3] max-h-[360px]',
  // About headshot (Phase 3) -- compact portrait aspect.
  portrait: 'aspect-[3/4] max-h-[320px]',
};

export function ImagePlaceholder({ caption, size }: ImagePlaceholderProps) {
  return (
    <div className={cn(baseClasses, sizeClasses[size])}>
      <ImageOff className="text-muted-foreground" />
      <Label>{caption}</Label>
    </div>
  );
}
