import { createBrowserRouter } from 'react-router';
import App from './App';
import HomeRoute from './routes/home';

/**
 * React Router Data Mode route tree (01-RESEARCH.md, Architecture Patterns
 * -> Pattern 3). `App` renders the shared root layout (an `Outlet`); the
 * home route is the only route this phase ships (D-06).
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomeRoute /> },
      // Reserved for Phase 2 (D-11) -- do not implement here:
      // { path: 'case-study/:slug', element: <CaseStudyRoute /> },
    ],
  },
]);
