import '@testing-library/jest-dom';
import { vi } from 'vitest';

// jsdom does not implement window.matchMedia. GSAP's ScrollTrigger plugin
// calls it at registration time (module scope), so a default stub must exist
// globally before any test-specific mock is installed, otherwise importing
// any module that registers ScrollTrigger throws immediately on import.
// Individual tests may override this via vi.stubGlobal('matchMedia', ...).
if (!window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}
