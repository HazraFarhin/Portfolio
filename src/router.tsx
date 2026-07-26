import { createBrowserRouter } from 'react-router';
import App from './App';
import HomeRoute from './routes/home';
import CaseStudyPage from './routes/case-study';
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
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      { path: 'case-study/:slug', element: <CaseStudyPage /> },
      { path: '*', element: <NotFoundRoute /> },
    ],
  },
]);
