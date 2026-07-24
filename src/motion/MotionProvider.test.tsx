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
  const instances: Array<{ on: ReturnType<typeof vi.fn>; raf: ReturnType<typeof vi.fn>; destroy: ReturnType<typeof vi.fn> }> = [];
  const LenisMock = vi.fn().mockImplementation(() => {
    const instance = { on: vi.fn(), raf: vi.fn(), destroy: vi.fn() };
    instances.push(instance);
    return instance;
  });
  return { default: LenisMock, __instances: instances };
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

    tickerCallback(1, 0, 0, false);
    expect(lenisInstance.raf).toHaveBeenCalled();
  });

  it('cleans up symmetrically under StrictMode phantom mount-unmount-mount, leaving no leaked ticker/Lenis state', () => {
    const addSpy = vi.spyOn(gsap.ticker, 'add');
    const removeSpy = vi.spyOn(gsap.ticker, 'remove');

    const { unmount } = render(
      <StrictMode>
        <MotionProvider>
          <div>content</div>
        </MotionProvider>
      </StrictMode>
    );

    unmount();

    expect(addSpy).toHaveBeenCalledTimes(removeSpy.mock.calls.length);

    const lenisInstances = (Lenis as unknown as ReturnType<typeof vi.fn>).mock.results.map(
      (r) => r.value
    );
    expect(lenisInstances.length).toBeGreaterThan(0);
    lenisInstances.forEach((instance) => {
      expect(instance.destroy).toHaveBeenCalled();
    });
  });
});
