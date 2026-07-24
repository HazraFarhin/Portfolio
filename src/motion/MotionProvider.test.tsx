import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, renderHook } from '@testing-library/react';
import { StrictMode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  MotionProvider,
  usePrefersReducedMotionContext,
} from './MotionProvider';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

vi.mock('lenis', () => {
  const LenisMock = vi.fn().mockImplementation(function LenisMockImpl() {
    return { on: vi.fn(), raf: vi.fn(), destroy: vi.fn() };
  });
  return { default: LenisMock };
});

function mockMatchMedia(initialMatches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue({
      matches: initialMatches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  );
}

function ContextReader({ onValue }: { onValue: (value: boolean) => void }) {
  onValue(usePrefersReducedMotionContext());
  return null;
}

beforeEach(() => {
  mockMatchMedia(false);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.clearAllMocks();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});

describe('MotionProvider', () => {
  it('mounts with zero consumers without throwing and registers no ScrollTrigger instances', () => {
    expect(() => {
      render(
        <MotionProvider>
          <div>no motion consumers</div>
        </MotionProvider>
      );
    }).not.toThrow();

    expect(ScrollTrigger.getAll().length).toBe(0);
  });

  it('sources its context value from usePrefersReducedMotion (no duplicate matchMedia read)', () => {
    const { result: standalone } = renderHook(() => usePrefersReducedMotion());

    let contextValue: boolean | undefined;
    render(
      <MotionProvider>
        <ContextReader onValue={(v) => (contextValue = v)} />
      </MotionProvider>
    );

    expect(contextValue).toBe(standalone.current);
  });

  it('instantiates Lenis with autoRaf: false and drives it via gsap.ticker.add', () => {
    const addSpy = vi.spyOn(gsap.ticker, 'add');

    render(
      <MotionProvider>
        <div>content</div>
      </MotionProvider>
    );

    expect(Lenis).toHaveBeenCalledWith(
      expect.objectContaining({ autoRaf: false })
    );

    expect(addSpy).toHaveBeenCalledTimes(1);
    const tickerCallback = addSpy.mock.calls[0][0];
    const lenisInstance = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;

    tickerCallback(1, 0, 0, 0);
    expect(lenisInstance.raf).toHaveBeenCalled();
  });

  it('cleans up symmetrically under StrictMode phantom mount-unmount-mount, leaving no leaked ticker/Lenis state', () => {
    // gsap.ticker.add() internally calls remove() first as a dedup safety
    // step, so raw add/remove call *counts* are not directly comparable.
    // The real assertion of "no leak" is: the ticker's actual listener list
    // returns to its pre-mount length after unmount (see gsap-core.js's
    // ticker.add/.remove implementation, which mutates a shared `_listeners`
    // array exposed at `gsap.ticker._listeners`).
    const baselineListenerCount = (
      gsap.ticker as unknown as { _listeners: unknown[] }
    )._listeners.length;

    const { unmount } = render(
      <StrictMode>
        <MotionProvider>
          <div>content</div>
        </MotionProvider>
      </StrictMode>
    );

    unmount();

    const finalListenerCount = (
      gsap.ticker as unknown as { _listeners: unknown[] }
    )._listeners.length;
    expect(finalListenerCount).toBe(baselineListenerCount);

    const lenisInstances = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.results.map(
      (r) => r.value
    );
    expect(lenisInstances.length).toBeGreaterThan(0);
    lenisInstances.forEach((instance) => {
      expect(instance.destroy).toHaveBeenCalled();
    });
  });
});
