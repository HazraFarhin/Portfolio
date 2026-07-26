import { describe, expect, it } from 'vitest';
import { CaseStudyFrontmatterSchema } from './schema';

const VALID_FRONTMATTER = {
  title: 'Test Project',
  slug: 'test-project',
  client: 'Test Client',
  industry: 'FinTech',
  role: 'Lead UX Designer',
  team: 'Solo',
  timeline: 'Jan 2026 - Feb 2026',
  status: 'Draft',
  featured: true,
  cover_image: '/images/test-project/cover.jpg',
  tags: ['UX', 'UI'],
  summary: 'A one-line summary.',
  order: 0,
};

describe('CaseStudyFrontmatterSchema', () => {
  it('accepts a valid frontmatter object with all 13 keys and no external_link', () => {
    const result = CaseStudyFrontmatterSchema.safeParse(VALID_FRONTMATTER);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toMatchObject(VALID_FRONTMATTER);
      expect(result.data.external_link).toBeUndefined();
    }
  });

  it('accepts a valid frontmatter with a well-formed https external_link', () => {
    const result = CaseStudyFrontmatterSchema.safeParse({
      ...VALID_FRONTMATTER,
      external_link: 'https://www.figma.com/file/abc123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects external_link with a javascript: protocol', () => {
    const result = CaseStudyFrontmatterSchema.safeParse({
      ...VALID_FRONTMATTER,
      external_link: 'javascript:alert(1)',
    });
    expect(result.success).toBe(false);
  });

  it('rejects external_link with an ftp: protocol', () => {
    const result = CaseStudyFrontmatterSchema.safeParse({
      ...VALID_FRONTMATTER,
      external_link: 'ftp://example.com/file',
    });
    expect(result.success).toBe(false);
  });

  it('rejects frontmatter missing the role key with an issue path of ["role"]', () => {
    const { role: _role, ...withoutRole } = VALID_FRONTMATTER;
    const result = CaseStudyFrontmatterSchema.safeParse(withoutRole);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join('.') === 'role')).toBe(true);
    }
  });

  it('rejects featured as a string with an issue path of ["featured"]', () => {
    const result = CaseStudyFrontmatterSchema.safeParse({
      ...VALID_FRONTMATTER,
      featured: 'yes',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.join('.') === 'featured')).toBe(true);
    }
  });

  it('rejects a status value outside the allowed enum', () => {
    const result = CaseStudyFrontmatterSchema.safeParse({
      ...VALID_FRONTMATTER,
      status: 'Archived',
    });
    expect(result.success).toBe(false);
  });

  it('rejects an extra, unrecognized key (schema is .strict())', () => {
    const result = CaseStudyFrontmatterSchema.safeParse({
      ...VALID_FRONTMATTER,
      notes: 'internal only',
    });
    expect(result.success).toBe(false);
  });

  it('rejects a negative order and a non-integer order', () => {
    const negative = CaseStudyFrontmatterSchema.safeParse({ ...VALID_FRONTMATTER, order: -1 });
    expect(negative.success).toBe(false);

    const nonInteger = CaseStudyFrontmatterSchema.safeParse({ ...VALID_FRONTMATTER, order: 1.5 });
    expect(nonInteger.success).toBe(false);
  });

  it('defaults tags to an empty array when omitted entirely', () => {
    const { tags: _tags, ...withoutTags } = VALID_FRONTMATTER;
    const result = CaseStudyFrontmatterSchema.safeParse(withoutTags);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual([]);
    }
  });
});
