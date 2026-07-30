import { Label } from '../ui/Typography';
import { navContent } from '../../content/nav';

/**
 * Persistent nav bar (D-06). Fixed/sticky glass overlay, mounted inside
 * home.tsx only (D-06 clarified: homepage-only scope) -- never imported by
 * App.tsx, and never rendered on /case-study/:slug. Plain in-page anchor
 * hrefs throughout, never a router-driven link component -- Open Question
 * 2 resolved to homepage-only, so no cross-route navigation is needed.
 *
 * Persistent chrome, not a reveal-on-scroll content section -- deliberately
 * carries no scroll-triggered entrance motion of its own.
 */
export function Nav() {
  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-16 bg-dominant/80 backdrop-blur-lg border-b border-line flex items-center justify-between px-md md:px-lg">
      <Label as="a" href={navContent.wordmarkHref}>
        {navContent.wordmark}
      </Label>
      <div className="flex gap-md">
        {navContent.links.map((link) => (
          <Label as="a" href={link.href} key={link.href}>
            {link.label}
          </Label>
        ))}
      </div>
    </nav>
  );
}
