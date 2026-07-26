import { cn } from '../../lib/cn';
import type { CaseStudyFrontmatter } from '../../content/case-studies/schema';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Body, Label } from '../ui/Typography';

/**
 * Overview metadata table (CASE-03's "role/outcome visible without scrolling"
 * component, per D-08). Renders a fixed, hardcoded 6-row definition grid
 * inside a Card: Client, Industry, My Role, Team, Timeline, Links.
 *
 * Row order is NEVER derived from Object.entries(props) or iteration order --
 * the 6 rows are written as literal, hardcoded JSX elements in fixed sequence
 * to guarantee the CASE-03 skimmable layout regardless of how props are
 * constructed upstream (T-02-12).
 *
 * The Links row branches on `external_link`: two ghost-variant Buttons
 * ("Prototype" and "Live Site", both pointing at external_link) when present;
 * a muted "Coming soon" Label when absent.
 */

type OverviewProps = Pick<
  CaseStudyFrontmatter,
  'client' | 'industry' | 'role' | 'team' | 'timeline' | 'external_link'
>;

export function Overview({
  client,
  industry,
  role,
  team,
  timeline,
  external_link,
}: OverviewProps) {
  return (
    <Card>
      {/* Responsive definition grid: full-width stacked on mobile,
          label-column + value-column on md+ */}
      <dl className={cn('grid grid-cols-1 md:grid-cols-[auto_1fr] gap-x-md gap-y-sm')}>
        {/* Row 1: Client */}
        <Label as="dt">Client</Label>
        <Body as="dd">{client}</Body>

        {/* Row 2: Industry */}
        <Label as="dt">Industry</Label>
        <Body as="dd">{industry}</Body>

        {/* Row 3: My Role */}
        <Label as="dt">My Role</Label>
        <Body as="dd">{role}</Body>

        {/* Row 4: Team */}
        <Label as="dt">Team</Label>
        <Body as="dd">{team}</Body>

        {/* Row 5: Timeline */}
        <Label as="dt">Timeline</Label>
        <Body as="dd">{timeline}</Body>

        {/* Row 6: Links — branches on external_link presence */}
        <Label as="dt">Links</Label>
        <dd>
          {external_link ? (
            <div className={cn('flex gap-sm flex-wrap')}>
              <Button variant="ghost" href={external_link}>
                Prototype
              </Button>
              <Button variant="ghost" href={external_link}>
                Live Site
              </Button>
            </div>
          ) : (
            <Label>Coming soon</Label>
          )}
        </dd>
      </dl>
    </Card>
  );
}
