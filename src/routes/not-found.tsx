import { Button } from '../components/ui/Button';
import { Body } from '../components/ui/Typography';

/**
 * App-level catch-all 404 route (T-02-16). Renders for any path that does
 * not match any registered route pattern (e.g. a missing page, a mistyped
 * URL, or an empty `/case-study/` segment without a slug).
 *
 * Distinct from CaseStudyPage's own "Case study not found." fallback -- this
 * route renders when the path itself doesn't match any route pattern at all
 * (routing miss), while CaseStudyPage's fallback renders for a routing hit
 * where the matched :slug has no corresponding content file (data miss).
 */
export default function NotFoundRoute() {
  return (
    <div className="flex flex-col items-center justify-center gap-md min-h-[50vh] text-center px-lg">
      <Body>Page not found.</Body>
      <Body>{"This page doesn't exist. Let's get you back to the homepage."}</Body>
      <Button variant="ghost" href="/">
        ← Back to home
      </Button>
    </div>
  );
}
