import { useEffect, useState } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Reads the OS-level `prefers-reduced-motion` accessibility setting and keeps
 * it live for the lifetime of the component: the initial value is read
 * synchronously at mount (so the first render already reflects the OS
 * setting -- no flash of the wrong state), and a `matchMedia` 'change'
 * listener keeps it updated if the user toggles the setting mid-session.
 *
 * This is the single source of truth for reduced-motion detection in the
 * app -- consumed internally by MotionProvider (D-10). No other component
 * should read `matchMedia` directly (D-09).
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches
  );

  useEffect(() => {
    const mql = window.matchMedia(REDUCED_MOTION_QUERY);
    const listener = () => setPrefersReducedMotion(mql.matches);
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}
