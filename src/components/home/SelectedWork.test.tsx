import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SelectedWork } from './SelectedWork';
import { caseStudies } from '../../content/case-studies/loader';

const DEFERRED_SLUGS = ['riyaah', 'icici-bank-atm-kiosk', 'ambit', 'northernarc', 'citrus'];

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

  it('renders no "see more" toggle button of any kind', () => {
    render(<SelectedWork />);
    expect(screen.queryByRole('button', { name: /see more/i })).not.toBeInTheDocument();
  });

  it('never renders a link to any of the 5 deferred slugs', () => {
    render(<SelectedWork />);

    const links = screen.getAllByRole('link');
    links.forEach((link) => {
      const href = link.getAttribute('href') ?? '';
      DEFERRED_SLUGS.forEach((slug) => {
        expect(href).not.toBe(`/case-study/${slug}`);
      });
    });
  });

  it('never renders any superseded fictional project title from Homepage Copy V2.md §07', () => {
    render(<SelectedWork />);
    SUPERSEDED_TITLES.forEach((title) => {
      expect(screen.queryByText(title)).not.toBeInTheDocument();
    });
  });
});
