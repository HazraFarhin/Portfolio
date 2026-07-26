import { describe, it, expect } from 'vitest';
import { loadCaseStudiesFromRawFiles, caseStudies, getCaseStudyBySlug, getNextCaseStudy } from './loader';

// ──────────────────────────────────────────────────────────────────────────────
// Shared fixture helpers
// ──────────────────────────────────────────────────────────────────────────────

function makeFrontmatter(overrides: Record<string, unknown> = {}) {
  return {
    title: 'Test Case Study',
    slug: 'test-slug',
    client: 'Acme',
    industry: 'Tech',
    role: 'Designer',
    team: 'Solo',
    timeline: '1 month',
    status: 'Published',
    featured: true,
    cover_image: '/images/test/cover.jpg',
    tags: [],
    summary: 'A test summary.',
    order: 0,
    ...overrides,
  };
}

function makeRawMd(frontmatterObj: Record<string, unknown>, body = '') {
  const lines = Object.entries(frontmatterObj).map(([k, v]) =>
    typeof v === 'string'
      ? `${k}: "${v}"`
      : Array.isArray(v)
      ? `${k}: [${v.map((s) => `"${s}"`).join(', ')}]`
      : `${k}: ${v}`
  );
  return `---\n${lines.join('\n')}\n---\n${body}`;
}

// ──────────────────────────────────────────────────────────────────────────────
// loadCaseStudiesFromRawFiles
// ──────────────────────────────────────────────────────────────────────────────

describe('loadCaseStudiesFromRawFiles', () => {
  it('returns an empty array when given an empty map', () => {
    expect(loadCaseStudiesFromRawFiles({})).toEqual([]);
  });

  it('parses a single well-formed file and returns it as a CaseStudy', () => {
    const fm = makeFrontmatter({ slug: 'my-project', order: 0 });
    const raw = makeRawMd(fm);
    const result = loadCaseStudiesFromRawFiles({ '/src/content/case-studies/my-project.md': raw });
    expect(result).toHaveLength(1);
    expect(result[0].slug).toBe('my-project');
  });

  it('sorts returned array ascending by order field regardless of input map key order', () => {
    const files: Record<string, string> = {};
    // Deliberately insert in reverse order (order: 5, 4, 3, 2, 1, 0)
    for (let i = 5; i >= 0; i--) {
      const slug = `case-${i}`;
      files[`/src/content/case-studies/${slug}.md`] = makeRawMd(
        makeFrontmatter({ slug, order: i })
      );
    }
    const result = loadCaseStudiesFromRawFiles(files);
    expect(result.map((cs) => cs.order)).toEqual([0, 1, 2, 3, 4, 5]);
  });

  it('isolates a malformed file - does not throw, excludes it from results', () => {
    const goodFm = makeFrontmatter({ slug: 'good-case', order: 0 });
    const badRaw = '---\nmissing_required_fields: true\n---\n';
    const files = {
      '/src/content/case-studies/good-case.md': makeRawMd(goodFm),
      '/src/content/case-studies/bad-case.md': badRaw,
    };
    let result: ReturnType<typeof loadCaseStudiesFromRawFiles>;
    expect(() => {
      result = loadCaseStudiesFromRawFiles(files);
    }).not.toThrow();
    expect(result!).toHaveLength(1);
    expect(result![0].slug).toBe('good-case');
  });

  it('returns 6 case studies from 6 well-formed + 1 malformed (isolation test)', () => {
    const files: Record<string, string> = {};
    for (let i = 0; i < 6; i++) {
      const slug = `valid-${i}`;
      files[`/src/content/case-studies/${slug}.md`] = makeRawMd(
        makeFrontmatter({ slug, order: i })
      );
    }
    // One malformed entry
    files['/src/content/case-studies/broken.md'] = 'not-frontmatter-at-all';
    const result = loadCaseStudiesFromRawFiles(files);
    expect(result).toHaveLength(6);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// Real glob-wired caseStudies export
// ──────────────────────────────────────────────────────────────────────────────

describe('caseStudies (real glob)', () => {
  it('contains exactly 6 case studies', () => {
    expect(caseStudies).toHaveLength(6);
  });

  it('returns slugs in IA order (ascending by order field)', () => {
    expect(caseStudies.map((cs) => cs.slug)).toEqual([
      'cad',
      'verzion-cloud-migration',
      'tata-capital-ai-interface',
      'mashreq',
      'astrosure.ai',
      'adreport.io',
    ]);
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getCaseStudyBySlug
// ──────────────────────────────────────────────────────────────────────────────

describe('getCaseStudyBySlug', () => {
  it('returns the correct case study for a known slug', () => {
    const result = getCaseStudyBySlug('cad');
    expect(result).toBeDefined();
    expect(result?.slug).toBe('cad');
  });

  it('returns the correct case study for dotted slugs (astrosure.ai)', () => {
    const result = getCaseStudyBySlug('astrosure.ai');
    expect(result).toBeDefined();
    expect(result?.slug).toBe('astrosure.ai');
  });

  it('returns undefined (not throw) for a deferred slug like riyaah', () => {
    expect(() => getCaseStudyBySlug('riyaah')).not.toThrow();
    expect(getCaseStudyBySlug('riyaah')).toBeUndefined();
  });

  it('returns undefined for an unknown slug', () => {
    expect(getCaseStudyBySlug('nonexistent-slug')).toBeUndefined();
  });
});

// ──────────────────────────────────────────────────────────────────────────────
// getNextCaseStudy
// ──────────────────────────────────────────────────────────────────────────────

describe('getNextCaseStudy', () => {
  it('returns the next case study for the first slug (cad -> verzion-cloud-migration)', () => {
    const next = getNextCaseStudy('cad');
    expect(next).toBeDefined();
    expect(next?.slug).toBe('verzion-cloud-migration');
  });

  it('wraps circularly: last slug (adreport.io) -> first slug (cad)', () => {
    const next = getNextCaseStudy('adreport.io');
    expect(next).toBeDefined();
    expect(next?.slug).toBe('cad');
  });

  it('returns undefined (not throw) for an unknown slug', () => {
    expect(() => getNextCaseStudy('some-unknown-slug')).not.toThrow();
    expect(getNextCaseStudy('some-unknown-slug')).toBeUndefined();
  });
});
