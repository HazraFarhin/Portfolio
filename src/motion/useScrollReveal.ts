import type { RefObject } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { usePrefersReducedMotionContext } from './MotionProvider';

interface ScrollRevealOptions {
  /** px travel distance, default 32 (xl spacing token) */
  y?: number;
  duration?: number;
  /** ScrollTrigger start position */
  start?: string;
}

/**
 * The single public motion-authoring hook every animated component uses to
 * opt into scroll-driven reveal motion (D-09). Internally no-ops when the
 * user prefers reduced motion -- callers never write their own
 * `matchMedia`/reduced-motion check.
 *
 * Built on `@gsap/react`'s `useGSAP()` (not a hand-rolled `useEffect` +
 * `gsap.context()`), so cleanup -- including React StrictMode's dev-only
 * phantom mount-unmount-mount cycle -- is inherited for free.
 */
export function useScrollReveal(
  // RefObject<HTMLElement | null> -- not RefObject<HTMLElement> -- because
  // React 19's useRef<T>(null) types the ref as RefObject<T | null> (the
  // ref genuinely starts out null before the DOM node mounts); callers pass
  // exactly the ref useRef(null) already gives them, no extra cast needed.
  ref: RefObject<HTMLElement | null>,
  { y = 32, duration = 0.8, start = 'top 85%' }: ScrollRevealOptions = {}
): void {
  const prefersReducedMotion = usePrefersReducedMotionContext();

  useGSAP(
    () => {
      if (!ref.current || prefersReducedMotion) return;

      gsap.from(ref.current, {
        y,
        opacity: 0,
        duration,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start },
      });
    },
    // scope: ref -- so useGSAP's context reverts (kills any ScrollTrigger
    // created above) on every unmount, including StrictMode's phantom one.
    // dependencies: [prefersReducedMotion] -- so the effect reverts and
    // re-runs if the reduced-motion preference flips mid-session.
    { scope: ref, dependencies: [prefersReducedMotion] }
  );
}
