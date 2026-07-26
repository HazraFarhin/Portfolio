/**
 * Case-study frontmatter schema (D-04/D-05/D-11), sourced field-for-field
 * from `Portfolio-Documentation/Project Page- Template.md`'s CMS-fields
 * block. This is the single source of typed, validated truth for
 * "typed, file-based content" (CASE-04) -- every other Phase 2 component
 * and the loader import `CaseStudyFrontmatter` from here rather than
 * re-declaring the shape.
 *
 * `.strict()` is load-bearing: it rejects any key not explicitly declared
 * below (T-02-04), rather than Zod's default of silently stripping unknown
 * keys. `external_link`'s `.refine()` closes a gap in Zod's bare `.url()`
 * validator, which accepts any URL-spec-valid scheme -- including
 * `javascript:`/`ftp:`/`mailto:` -- restricting it to `http://`/`https://`
 * only before the value ever reaches an `<a href>` (T-02-03).
 */
import { z } from 'zod';

export const CaseStudyFrontmatterSchema = z
  .object({
    title: z.string().min(1),
    slug: z.string().min(1),
    client: z.string().min(1),
    industry: z.string().min(1),
    role: z.string().min(1),
    team: z.string().min(1),
    timeline: z.string().min(1),
    status: z.enum(['Published', 'Draft']),
    featured: z.boolean(),
    cover_image: z.string().min(1),
    tags: z.array(z.string()).default([]),
    external_link: z
      .string()
      .url()
      .refine((value) => /^https?:\/\//i.test(value), {
        message: 'external_link must use the http:// or https:// protocol',
      })
      .optional(),
    summary: z.string().min(1),
    order: z.number().int().nonnegative(),
  })
  .strict();

export type CaseStudyFrontmatter = z.infer<typeof CaseStudyFrontmatterSchema>;
