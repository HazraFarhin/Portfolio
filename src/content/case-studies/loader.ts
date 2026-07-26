/**
 * Case-study content loader (D-06, CASE-04).
 *
 * Uses Vite's `import.meta.glob` with `{ query: '?raw', eager: true }` to
 * discover all `.md` files under `src/content/case-studies/` at build time
 * (no Node-only fs calls, keeping the site fully static). File discovery is
 * glob-only -- no hardcoded slug literals appear anywhere in this file.
 *
 * Per-file failure isolation (T-02-13): a try/catch around each
 * `parseCaseStudyFile` call means one malformed `.md` file is logged and
 * skipped instead of crashing the entire content load.
 *
 * Output is sorted ascending by the `order` frontmatter field (never by
 * `import.meta.glob`'s inherent key-insertion order, which is intentionally
 * non-deterministic across builds per the Vite docs).
 */
import { parseCaseStudyFile, type CaseStudy } from './parse';

/**
 * Pure helper that turns a raw-files map into a validated, sorted CaseStudy[].
 * Exported so tests can exercise it directly with synthetic fixtures -- without
 * needing to touch `import.meta.glob` or real content files.
 *
 * @param rawFiles - Record mapping file paths to their raw `.md` text content
 * @returns CaseStudy[] sorted ascending by `order` field; malformed files are
 *   logged via `console.error` and excluded from the result (never re-thrown)
 */
export function loadCaseStudiesFromRawFiles(rawFiles: Record<string, string>): CaseStudy[] {
  const results: CaseStudy[] = [];

  for (const [filePath, raw] of Object.entries(rawFiles)) {
    try {
      results.push(parseCaseStudyFile(raw, filePath));
    } catch (error) {
      // Per-file isolation (T-02-13): log and continue, never re-throw.
      // A single malformed .md file (e.g. missing a required frontmatter field)
      // must not prevent the other 5 valid case studies from loading.
      console.error(
        `[loader] Failed to parse case study file "${filePath}":`,
        error instanceof Error ? error.message : error
      );
    }
  }

  // Sort by the numeric `order` frontmatter field -- deterministic ordering
  // that is independent of Object.entries()/import.meta.glob's iteration order.
  return results.sort((a, b) => a.order - b.order);
}

// ──────────────────────────────────────────────────────────────────────────────
// Module-level glob wiring
// ──────────────────────────────────────────────────────────────────────────────

// Vite resolves this static glob at build time and replaces it with an inline
// object of { path: raw-string } pairs (eager + ?raw = inline the file text).
// The type assertion is safe: `?raw` imports always resolve to `string`.
const rawFiles = import.meta.glob('/src/content/case-studies/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

/**
 * All successfully-loaded and validated case studies, sorted by `order`.
 * This is the single source of truth for every rendering component that
 * needs the full case-study list (Plan 02-09's CaseStudyPage).
 */
export const caseStudies: CaseStudy[] = loadCaseStudiesFromRawFiles(rawFiles);

/**
 * Look up a case study by its slug. Returns `undefined` (never throws) for
 * any slug not among the loaded files -- including deferred slugs like `riyaah`
 * that exist in the Information Architecture but have no `.md` file yet (D-10).
 */
export function getCaseStudyBySlug(slug: string): CaseStudy | undefined {
  return caseStudies.find((cs) => cs.slug === slug);
}

/**
 * Compute the "next" case study for the footer link (CASE-02, D-11).
 * Wraps circularly: the last case study in IA order returns the first.
 * Returns `undefined` (never throws) if `currentSlug` is not found among
 * the loaded files (e.g. an unknown or not-yet-authored slug).
 */
export function getNextCaseStudy(currentSlug: string): CaseStudy | undefined {
  const idx = caseStudies.findIndex((cs) => cs.slug === currentSlug);
  if (idx === -1) return undefined;
  return caseStudies[(idx + 1) % caseStudies.length];
}
