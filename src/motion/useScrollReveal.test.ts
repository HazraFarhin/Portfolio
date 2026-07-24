import { describe, it, expect, vi, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import { createElement, useRef, StrictMode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useScrollReveal } from './useScrollReveal';

vi.mock('./MotionProvider', () => ({
  usePrefersReducedMotionContext: vi.fn(),
}));

import { usePrefersReducedMotionContext } from './MotionProvider';

// Mocking './MotionProvider' above means its module-scope
// `gsap.registerPlugin(ScrollTrigger)` side effect never runs. useGSAP
// requires the plugin to be registered for `scrollTrigger` options to take
// effect, so register it directly here (mirrors what MotionProvider does).
gsap.registerPlugin(ScrollTrigger);

/** Harness: mounts a ref'd div and wires it into useScrollReveal. */
function Harness({
  options,
  onContextValue,
}: {
  options?: Parameters<typeof useScrollReveal>[1];
  onContextValue?: (value: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  onContextValue?.(usePrefersReducedMotionContext());
  useScrollReveal(ref, options);
  return createElement('div', { ref });
}

afterEach(() => {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  vi.clearAllMocks();
});

describe('useScrollReveal', () => {
  it('registers a ScrollTrigger-driven gsap.from animation when motion is enabled', () => {
    vi.mocked(usePrefersReducedMotionContext).mockReturnValue(false);

    render(createElement(Harness));

    expect(ScrollTrigger.getAll().length).toBe(1);
  });

  it('is a no-op (zero ScrollTrigger instances) when reduced motion is on', () => {
    vi.mocked(usePrefersReducedMotionContext).mockReturnValue(true);

    render(createElement(Harness));

    expect(ScrollTrigger.getAll().length).toBe(0);
  });

  it('honors custom options for y/duration/start instead of the defaults', () => {
    vi.mocked(usePrefersReducedMotionContext).mockReturnValue(false);
    const fromSpy = vi.spyOn(gsap, 'from');

    render(
      createElement(Harness, {
        options: { y: 64, duration: 1.2, start: 'top 90%' },
      })
    );

    expect(fromSpy).toHaveBeenCalledWith(
      expect.anything(),
      expect.objectContaining({
        y: 64,
        duration: 1.2,
        scrollTrigger: expect.objectContaining({ start: 'top 90%' }),
      })
    );
  });

  it('multiple call sites observe an identical reduced-motion value regardless of mount order', () => {
    vi.mocked(usePrefersReducedMotionContext).mockReturnValue(false);
    const valuesA: boolean[] = [];
    const valuesB: boolean[] = [];

    function HarnessB() {
      const ref = useRef<HTMLDivElement>(null);
      valuesB.push(usePrefersReducedMotionContext());
      useScrollReveal(ref);
      return createElement('div', { ref });
    }

    function HarnessA() {
      const ref = useRef<HTMLDivElement>(null);
      valuesA.push(usePrefersReducedMotionContext());
      useScrollReveal(ref);
      return createElement('div', { ref });
    }

    // HarnessB mounts before HarnessA in source order -- reversed relative
    // to the "A then B" naming -- to prove no call site races another for a
    // stale/different context read regardless of mount order.
    render(createElement('div', null, createElement(HarnessB), createElement(HarnessA)));

    expect(valuesA.length).toBeGreaterThan(0);
    expect(valuesB.length).toBeGreaterThan(0);
    expect(valuesA[0]).toBe(valuesB[0]);
  });

  it('unmount, including StrictMode phantom mount-unmount-mount, leaves zero orphaned ScrollTrigger instances', () => {
    vi.mocked(usePrefersReducedMotionContext).mockReturnValue(false);

    const { unmount } = render(createElement(StrictMode, null, createElement(Harness)));

    expect(ScrollTrigger.getAll().length).toBe(1);

    unmount();

    expect(ScrollTrigger.getAll().length).toBe(0);
  });
});
