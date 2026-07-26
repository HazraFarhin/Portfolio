import { describe, expect, it } from 'vitest';
import { parseCaseStudyFile, splitBodyIntoSections } from './parse';

function buildFixture(overrides: { slug?: string; omitRole?: boolean; omitToolsUsed?: boolean } = {}) {
  const { slug = 'test-project', omitRole = false, omitToolsUsed = false } = overrides;

  const frontmatterLines = [
    '---',
    'title: "Test Project"',
    `slug: "${slug}"`,
    'client: "Test Client"',
    'industry: "FinTech"',
    ...(omitRole ? [] : ['role: "Lead UX Designer"']),
    'team: "Solo"',
    'timeline: "Jan 2026 - Feb 2026"',
    'status: "Draft"',
    'featured: true',
    'cover_image: "/images/test-project/cover.jpg"',
    'tags: ["UX", "UI"]',
    'summary: "A one-line summary."',
    'order: 0',
    '---',
  ].join('\n');

  const toolsUsedSection = omitToolsUsed
    ? ''
    : ['## Tools Used', '', '- Figma', '- FigJam', ''].join('\n');

  const bodyLines = [
    '',
    toolsUsedSection,
    '## Outcome & Impact',
    '',
    '- Stakeholders approved the redesign',
    '',
    '## The Challenge',
    '',
    'The onboarding flow was confusing.',
    '',
    '## Process',
    '',
    '### 1. Discovery & Research',
    '',
    'Interviewed users to find pain points.',
    '',
    '### 2. Define',
    '',
    'Framed the core problem.',
    '',
    '### 3. Ideate & Wireframe',
    '',
    'Sketched simplified layouts.',
    '',
    '### 4. Design & Prototype',
    '',
    'Built high-fidelity screens.',
    '',
    '### 5. Test & Iterate',
    '',
    'Tested with users and refined.',
    '',
    '## Solution',
    '',
    'A simplified onboarding flow.',
    '',
    '## Learnings & Reflections',
    '',
    'Jargon was invisible to the internal team.',
    '',
  ].join('\n');

  return `${frontmatterLines}\n${bodyLines}`;
}

describe('parseCaseStudyFile', () => {
  it('parses a well-formed fixture into frontmatter fields, body, and ordered sections', () => {
    const fixture = buildFixture();
    const result = parseCaseStudyFile(fixture, 'test-project.md');

    expect(result.title).toBe('Test Project');
    expect(result.slug).toBe('test-project');
    expect(result.status).toBe('Draft');
    expect(typeof result.body).toBe('string');

    expect(result.sections.toolsUsed).toContain('Figma');
    expect(result.sections.outcomeImpact).toContain('Stakeholders approved the redesign');
    expect(result.sections.challenge).toContain('onboarding flow was confusing');
    expect(result.sections.solution).toContain('simplified onboarding flow');
    expect(result.sections.learnings).toContain('invisible to the internal team');

    expect(result.sections.process.discoveryResearch).toContain('Interviewed users');
    expect(result.sections.process.define).toContain('Framed the core problem');
    expect(result.sections.process.ideateWireframe).toContain('Sketched simplified layouts');
    expect(result.sections.process.designPrototype).toContain('Built high-fidelity screens');
    expect(result.sections.process.testIterate).toContain('Tested with users');
  });

  it('throws an error naming the file path and the missing field for malformed frontmatter', () => {
    const fixture = buildFixture({ omitRole: true });
    expect(() => parseCaseStudyFile(fixture, 'bad.md')).toThrow(/bad\.md/);
    expect(() => parseCaseStudyFile(fixture, 'bad.md')).toThrow(/role/);
  });

  it('throws an error mentioning "frontmatter" when no frontmatter block is present', () => {
    const fixture = 'Just some plain prose with no frontmatter delimiter at all.';
    expect(() => parseCaseStudyFile(fixture, 'no-frontmatter.md')).toThrow(/frontmatter/i);
  });

  it('does not throw when a body omits "## Tools Used" -- toolsUsed defaults to an empty string', () => {
    const fixture = buildFixture({ omitToolsUsed: true });
    const result = parseCaseStudyFile(fixture, 'test-project.md');
    expect(result.sections.toolsUsed).toBe('');
    // other sections should still parse correctly
    expect(result.sections.outcomeImpact).toContain('Stakeholders approved the redesign');
  });

  it('derives the correct dotted filename-slug for astrosure.ai.md and succeeds when matching', () => {
    const fixture = buildFixture({ slug: 'astrosure.ai' });
    const result = parseCaseStudyFile(fixture, 'astrosure.ai.md');
    expect(result.slug).toBe('astrosure.ai');
  });

  it('throws a mismatch error naming the file path when the frontmatter slug does not match the dotted filename', () => {
    const fixture = buildFixture({ slug: 'astrosure' });
    expect(() => parseCaseStudyFile(fixture, 'astrosure.ai.md')).toThrow(/astrosure\.ai\.md/);
  });
});

describe('splitBodyIntoSections', () => {
  it('returns an empty string for a section whose heading is entirely missing', () => {
    const body = ['## Outcome & Impact', '', 'Some impact copy.', ''].join('\n');
    const sections = splitBodyIntoSections(body);
    expect(sections.toolsUsed).toBe('');
    expect(sections.outcomeImpact).toContain('Some impact copy.');
  });
});
