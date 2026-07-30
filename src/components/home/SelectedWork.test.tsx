import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectedWork } from './SelectedWork';
import { caseStudies } from '../../content/case-studies/loader';
import { deferredCaseStudies } from '../../content/case-studies/deferred';

const SUPERSEDED_TITLES = [
  'AI-Native Banking Interface',
  'Cloud Migration Platform',
  'Luxury Beauty Commerce Platform',
  'AI-Based Astrology Platform',
  'Analytics Dashboards',
];

describe('SelectedWork', () => {
  it('renders exactly 6 real case-study cards, in caseStudies order, on initial render', () => {
    render(<SelectedWork />);

    caseStudies.forEach((cs) => {
      expect(screen.getByRole('heading', { level: 3, name: cs.title })).toBeInTheDocument();
    });

    const links = screen.getAllByRole('link', { name: /View case study/ });
    expect(links).toHaveLength(6);
    links.forEach((link, index) => {
      expect(link).toHaveAttribute('href', `/case-study/${caseStudies[index].slug}`);
    });
  });

  it('renders zero "Coming soon" labels on initial render', () => {
    render(<SelectedWork />);
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
  });

  it('reveals exactly 5 deferred coming-soon cards when the toggle is clicked', () => {
    render(<SelectedWork />);

    const toggle = screen.getByRole('button', { name: 'See more' });
    fireEvent.click(toggle);

    const comingSoonLabels = screen.getAllByText('Coming soon');
    expect(comingSoonLabels).toHaveLength(5);

    deferredCaseStudies.forEach((dcs) => {
      const heading = screen.getByRole('heading', { level: 3, name: dcs.title });
      expect(heading).toBeInTheDocument();
    });

    const allCardLinks = screen.getAllByRole('link', { name: /View case study/ });
    expect(allCardLinks).toHaveLength(11);
    const hrefs = allCardLinks.map((link) => link.getAttribute('href'));
    deferredCaseStudies.forEach((dcs) => {
      expect(hrefs).toContain(`/case-study/${dcs.slug}`);
    });
  });

  it('collapses back to 6 cards on a second toggle click, keeping the toggle button present', () => {
    render(<SelectedWork />);

    const toggle = screen.getByRole('button', { name: 'See more' });
    fireEvent.click(toggle);
    expect(screen.getAllByRole('link', { name: /View case study/ })).toHaveLength(11);

    const expandedToggle = screen.getByRole('button', { name: 'See less' });
    fireEvent.click(expandedToggle);

    expect(screen.getAllByRole('link', { name: /View case study/ })).toHaveLength(6);
    expect(screen.queryByText('Coming soon')).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'See more' })).toBeInTheDocument();
  });

  it('the toggle label reads "See more" collapsed and "See less" expanded', () => {
    render(<SelectedWork />);

    expect(screen.getByRole('button', { name: 'See more' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'See more' }));
    expect(screen.getByRole('button', { name: 'See less' })).toBeInTheDocument();
  });

  it('never renders any superseded fictional project title from Homepage Copy V2.md §07', () => {
    render(<SelectedWork />);
    SUPERSEDED_TITLES.forEach((title) => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });
  });
});
