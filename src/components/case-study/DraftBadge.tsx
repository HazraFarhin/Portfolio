import { cn } from '../../lib/cn';
import type { CaseStudyFrontmatter } from '../../content/case-studies/schema';
import { Label } from '../ui/Typography';

/**
 * Draft content badge (D-03). Renders a quiet, neutral status marker when
 * `status === 'Draft'`; returns null when `status === 'Published'`. Visibility
 * toggles purely on the status field with no component change required (D-12).
 *
 * Intentionally uses secondary/line color tokens rather than destructive/red
 * -- this must read as a neutral "pending" marker, not a warning or error
 * (per UI-SPEC's explicit exclusion of destructive colors for this component).
 */

interface DraftBadgeProps {
  status: CaseStudyFrontmatter['status'];
}

export function DraftBadge({ status }: DraftBadgeProps) {
  if (status !== 'Draft') {
    return null;
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-xs rounded-full border border-line bg-secondary/40 px-sm py-xs'
      )}
    >
      <Label>Draft content — pending final copy</Label>
    </span>
  );
}
