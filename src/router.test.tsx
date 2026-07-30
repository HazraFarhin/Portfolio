import { describe, it, expect } from 'vitest';
import { router } from './router';

describe('router', () => {
  const rootChildren = router.routes[0].children ?? [];

  const deferredSlugs = [
    'riyaah',
    'icici-bank-atm-kiosk',
    'ambit',
    'northernarc',
    'citrus',
  ];

  it.each(deferredSlugs)('contains a literal route for case-study/%s', (slug) => {
    const match = rootChildren.find((r) => r.path === `case-study/${slug}`);
    expect(match).toBeDefined();
  });

  it('contains exactly 5 literal deferred-slug routes', () => {
    const matches = rootChildren.filter((r) =>
      deferredSlugs.some((slug) => r.path === `case-study/${slug}`)
    );
    expect(matches).toHaveLength(5);
  });

  it('still contains exactly one dynamic case-study/:slug route', () => {
    const matches = rootChildren.filter((r) => r.path === 'case-study/:slug');
    expect(matches).toHaveLength(1);
  });

  it('still contains exactly one catch-all * route', () => {
    const matches = rootChildren.filter((r) => r.path === '*');
    expect(matches).toHaveLength(1);
  });
});
