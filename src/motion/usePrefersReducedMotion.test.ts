import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { usePrefersReducedMotion } from './usePrefersReducedMotion';

/**
 * Fake MediaQueryList used to drive matchMedia mocks per-test.
 * Captures the registered 'change' listener so tests can invoke it directly,
 * and tracks addEventListener/removeEventListener calls for cleanup assertions.
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
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockReturnValue(mql)
  );
  return mql;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('usePrefersReducedMotion', () => {
  it('returns true on first render when matchMedia.matches is true at mount', () => {
    mockMatchMedia(true);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(true);
  });

  it('returns false on first render when matchMedia.matches is false at mount', () => {
    mockMatchMedia(false);

    const { result } = renderHook(() => usePrefersReducedMotion());

    expect(result.current).toBe(false);
  });

  it('updates to true after a change event fires with matches: true, without remount', () => {
    const mql = mockMatchMedia(false);

    const { result } = renderHook(() => usePrefersReducedMotion());
    expect(result.current).toBe(false);

    act(() => {
      mql.triggerChange(true);
    });

    expect(result.current).toBe(true);
  });

  it('removes the change listener from the MediaQueryList on unmount', () => {
    const mql = mockMatchMedia(false);

    const { unmount } = renderHook(() => usePrefersReducedMotion());

    const addedListener = mql.addEventListener.mock.calls[0][1];
    unmount();

    expect(mql.removeEventListener).toHaveBeenCalledWith('change', addedListener);
  });
});
