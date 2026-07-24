import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, renderHook, act } from '@testing-library/react';
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

/**
 * Fake MediaQueryList used to drive matchMedia mocks per-test.
 * Captures the registered 'change' listener so tests can invoke it directly,
 * and tracks addEventListener/removeEventListener calls for cleanup assertions.
 * Mirrors the class in usePrefersReducedMotion.test.ts.
 */
class FakeMediaQueryList {
  matches: boolean;
  addEventListener = vi.fn((_type: string, listener: EventListener) => {
    this.listener = listener;
  });
  removeEventListener = vi.fn();
  listener: EventListener | undefined;

  constructor(matches: boolean) {
    this.matches = matches;
  }

  triggerChange(matches: boolean) {
    this.matches = matches;
    this.listener?.(new Event('change'));
  }
}

function mockMatchMedia(initialMatches: boolean) {
  const mql = new FakeMediaQueryList(initialMatches);
  vi.stubGlobal('matchMedia', vi.fn().mockReturnValue(mql));
  return mql;
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

  it('does not instantiate Lenis or register a gsap.ticker callback when prefersReducedMotion is true at mount', () => {
    mockMatchMedia(true);
    const addSpy = vi.spyOn(gsap.ticker, 'add');

    render(
      <MotionProvider>
        <div>content</div>
      </MotionProvider>
    );

    expect(Lenis).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
  });

  it('creates no Lenis instance or ticker callback under StrictMode when prefersReducedMotion is true', () => {
    mockMatchMedia(true);
    const addSpy = vi.spyOn(gsap.ticker, 'add');

    const { unmount } = render(
      <StrictMode>
        <MotionProvider>
          <div>content</div>
        </MotionProvider>
      </StrictMode>
    );

    expect(Lenis).not.toHaveBeenCalled();
    expect(addSpy).not.toHaveBeenCalled();
    expect(() => unmount()).not.toThrow();
  });

  it('tears down Lenis when prefersReducedMotion toggles to true mid-session, and re-initializes it when toggled back to false', () => {
    const mql = mockMatchMedia(false);

    render(
      <MotionProvider>
        <div>content</div>
      </MotionProvider>
    );

    expect(Lenis).toHaveBeenCalledTimes(1);
    const firstInstance = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.results[0].value;

    act(() => {
      mql.triggerChange(true);
    });

    expect(firstInstance.destroy).toHaveBeenCalledTimes(1);
    expect(Lenis).toHaveBeenCalledTimes(1);

    act(() => {
      mql.triggerChange(false);
    });

    expect(Lenis).toHaveBeenCalledTimes(2);
    expect(
      (Lenis as unknown as ReturnType<typeof vi.fn>).mock.results[1].value.destroy
    ).not.toHaveBeenCalled();
  });
});
