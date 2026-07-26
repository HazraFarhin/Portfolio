/**
 * Pure frontmatter/body parsing for case-study `.md` files (D-04/D-05, D-11,
 * Pitfall 1/2 of 02-RESEARCH.md). Uses a regex + `js-yaml` split instead of
 * `gray-matter`/`front-matter`, which call `Buffer.isBuffer`/`toBuffer` and
 * throw `Buffer is not defined` in a browser-bundled Vite build (Pitfall 1).
 *
 * These functions take raw strings and a file path, never touch
 * `import.meta.glob` or the filesystem directly -- that's Plan 02-08's
 * loader's job -- which keeps them fully unit-testable against fixture
 * strings.
 */
import { load } from 'js-yaml';
import { CaseStudyFrontmatterSchema, type CaseStudyFrontmatter } from './schema';

export interface CaseStudyProcessStages {
  discoveryResearch: string;
  define: string;
  ideateWireframe: string;
  designPrototype: string;
  testIterate: string;
}

export interface CaseStudySections {
  toolsUsed: string;
  outcomeImpact: string;
  challenge: string;
  process: CaseStudyProcessStages;
  solution: string;
  learnings: string;
}

export interface CaseStudy extends CaseStudyFrontmatter {
  body: string;
  sections: CaseStudySections;
}

// Matches a leading `---`-delimited YAML block: group 1 is the frontmatter
// text, group 2 is everything after the closing `---` (the Markdown body).
const FRONTMATTER_REGEX = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/;

// Top-level `## Heading` lines used to split the body into named sections.
const H2_REGEX = /^##[ \t]+(.+?)[ \t]*$/gm;

// `### 1. Stage Name` sub-headings inside the "Process" section, matched
// positionally (1st match -> discoveryResearch, 2nd -> define, ...) rather
// than by heading text, per the plan's fixed 5-stage ordering.
const H3_REGEX = /^###[ \t]*\d+\.[ \t]*(.+?)[ \t]*$/gm;

const HEADING_TO_SECTION_KEY: Record<string, keyof Omit<CaseStudySections, 'process'>> = {
  'Tools Used': 'toolsUsed',
  'Outcome & Impact': 'outcomeImpact',
  'The Challenge': 'challenge',
  Solution: 'solution',
  'Learnings & Reflections': 'learnings',
};

const PROCESS_STAGE_ORDER: Array<keyof CaseStudyProcessStages> = [
  'discoveryResearch',
  'define',
  'ideateWireframe',
  'designPrototype',
  'testIterate',
];

/**
 * Splits a top-level-heading-delimited block of text into named ranges.
 * Shared by the H2 (body sections) and H3 (process stages) passes below --
 * both need "everything between this heading and the next" semantics.
 */
function splitByHeadings(text: string, regex: RegExp): Array<{ heading: string; content: string }> {
  const matches = [...text.matchAll(regex)];
  return matches.map((match, index) => {
    const heading = match[1].trim();
    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < matches.length ? (matches[index + 1].index ?? text.length) : text.length;
    return { heading, content: text.slice(start, end).trim() };
  });
}

/**
 * Splits a case-study Markdown body into its 6 named top-level sections,
 * further splitting "Process" into its 5 fixed sub-stages. A missing
 * heading degrades to an empty string rather than throwing -- deliberately
 * different from frontmatter validation's fail-fast behavior, since a
 * missing body section should fall back to each component's own
 * already-designed empty-state copy, not break the app.
 */
export function splitBodyIntoSections(body: string): CaseStudySections {
  const sections: CaseStudySections = {
    toolsUsed: '',
    outcomeImpact: '',
    challenge: '',
    process: {
      discoveryResearch: '',
      define: '',
      ideateWireframe: '',
      designPrototype: '',
      testIterate: '',
    },
    solution: '',
    learnings: '',
  };

  let processRawText = '';

  for (const { heading, content } of splitByHeadings(body, H2_REGEX)) {
    if (heading === 'Process') {
      processRawText = content;
      continue;
    }
    const key = HEADING_TO_SECTION_KEY[heading];
    if (key) {
      sections[key] = content;
    }
  }

  const stages = splitByHeadings(processRawText, H3_REGEX);
  PROCESS_STAGE_ORDER.forEach((stageKey, index) => {
    const stage = stages[index];
    if (stage) {
      sections.process[stageKey] = stage.content;
    }
  });

  return sections;
}

/**
 * Parses a raw `.md` file's text into a validated, typed `CaseStudy`
 * object. Throws a file-path-specific `Error` for a missing/malformed
 * frontmatter block, a schema validation failure, or a filename/frontmatter
 * slug mismatch -- fail-fast on all three, since these are content-integrity
 * problems that should never silently reach the rendered app (T-02-05).
 */
export function parseCaseStudyFile(raw: string, filePath: string): CaseStudy {
  const match = raw.match(FRONTMATTER_REGEX);
  if (!match) {
    throw new Error(`${filePath}: missing or malformed frontmatter block`);
  }

  const [, frontmatterBlock, body] = match;

  let loaded: unknown;
  try {
    loaded = load(frontmatterBlock);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${filePath}: failed to parse frontmatter YAML -- ${message}`);
  }

  const result = CaseStudyFrontmatterSchema.safeParse(loaded);
  if (!result.success) {
    const issues = result.error.issues
      .map((issue) => `${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('; ');
    throw new Error(`${filePath}: invalid frontmatter -- ${issues}`);
  }

  const filenameSlug = filePath.replace(/^.*\//, '').replace(/\.md$/, '');
  if (filenameSlug !== result.data.slug) {
    throw new Error(
      `${filePath}: filename-derived slug "${filenameSlug}" does not match frontmatter slug "${result.data.slug}"`,
    );
  }

  return {
    ...result.data,
    body: body.trim(),
    sections: splitBodyIntoSections(body),
  };
}
