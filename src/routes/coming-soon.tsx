import { Button } from '../components/ui/Button';
import { Body } from '../components/ui/Typography';

/**
 * ComingSoonRoute — fallback route for the 5 deferred case-study slugs (D-10).
 *
 * Rendered by router.tsx's 5 literal `case-study/<deferred-slug>` routes,
 * which outrank the generic `case-study/:slug` route for those exact paths
 * (D-11). Copy is intentionally distinct from both of the app's other two
 * fallback routes (`not-found.tsx`'s app-level 404 for a routing miss, and
 * `case-study.tsx`'s own fallback for a real-pattern data miss) -- this route
 * signals a deliberately deferred project, not an error state.
 *
 * Mirrors Phase 2's not-found fallback visual pattern exactly (same "quiet,
 * centered, one CTA back" composition) -- no new component introduced.
 */

const DEFERRED_TITLES: Record<string, string> = {
  riyaah: 'Riyaah',
  'icici-bank-atm-kiosk': 'ICICI Bank ATM Kiosk',
  ambit: 'Ambit',
  northernarc: 'NorthernArc',
  citrus: 'Citrus',
};

export default function ComingSoonRoute({ slug }: { slug: string }) {
  const title = DEFERRED_TITLES[slug] ?? slug;

  return (
    <div className="flex flex-col items-center justify-center gap-md min-h-[50vh] text-center px-lg">
      <h1 className="sr-only">{`${title} — coming soon`}</h1>
      <Body>Coming soon.</Body>
      <Body>This case study hasn&apos;t shipped yet. Explore the six live projects instead.</Body>
      <Button variant="ghost" href="/#selected-work">
        ← Back to Selected Work
      </Button>
    </div>
  );
}
