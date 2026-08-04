import { createBrowserRouter } from 'react-router';
import App from './App';
import HomeRoute from './routes/home';
import CaseStudyPage from './routes/case-study';
import ComingSoonRoute from './routes/coming-soon';
import NotFoundRoute from './routes/not-found';

/**
 * React Router Data Mode route tree (01-RESEARCH.md, Architecture Patterns
 * -> Pattern 3). `App` renders the shared root layout (an `Outlet`).
 *
 * Phase 2 additions (D-11):
 * - `case-study/:slug` — renders CaseStudyPage for any matched slug,
 *   including slugs that contain dots (T-02-15)
 * - `*` catch-all — renders NotFoundRoute for any unmatched path (T-02-16),
 *   including an empty `/case-study/` segment that has no `:slug` to match
 */

// D-07 (Phase 4): these routes are intentionally kept registered as-is. A
// stray/cached link to `/case-study/riyaah` etc. resolves to the coming-soon
// page instead of a 404. Only the homepage's inbound links to these routes
// were removed (see src/components/home/SelectedWork.tsx, Plan 04-04).
const DEFERRED_SLUGS = ['riyaah', 'icici-bank-atm-kiosk', 'ambit', 'northernarc', 'citrus'] as const;
const DEFERRED_SLUG_ROUTES = DEFERRED_SLUGS.map((slug) => ({
  path: `case-study/${slug}`,
  element: <ComingSoonRoute slug={slug} />,
}));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      ...DEFERRED_SLUG_ROUTES,
      { path: 'case-study/:slug', element: <CaseStudyPage /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]);
