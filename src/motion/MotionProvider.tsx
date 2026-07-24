import { createContext, useContext, useEffect, type ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

// Registered once per module load -- never inside the component body or an
// effect, so re-renders/remounts never re-register the plugin.
gsap.registerPlugin(ScrollTrigger);

const ReducedMotionContext = createContext(false);

/** Reads the reduced-motion boolean sourced by MotionProvider. */
export const usePrefersReducedMotionContext = () => useContext(ReducedMotionContext);

/**
 * App-wide provider (D-10) that owns:
 *  - GSAP ScrollTrigger plugin registration (module scope, above)
 *  - Lenis smooth-scroll initialization, driven by GSAP's single ticker
 *    (not Lenis's own internal rAF loop -- see 01-RESEARCH.md Pitfall 2)
 *  - The reduced-motion Context value every motion hook reads from, sourced
 *    directly from usePrefersReducedMotion (no duplicate matchMedia read)
 *
 * Mount exactly once, at the app root.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    const lenis = new Lenis({
      autoRaf: false,
      duration: 1.05,
      smoothWheel: true,
      wheelMultiplier: 0.85,
      touchMultiplier: 1.15,
    });

    lenis.on('scroll', ScrollTrigger.update);

    // Single rAF loop: GSAP's ticker drives Lenis, not Lenis's own loop.
    // gsap.ticker passes seconds; Lenis.raf expects milliseconds.
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
      lenis.destroy();
    };
  }, []);

  return (
    <ReducedMotionContext.Provider value={prefersReducedMotion}>
      {children}
    </ReducedMotionContext.Provider>
  );
}
