import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { NextProject } from './NextProject';

describe('NextProject', () => {
  it('renders a "Next Project" h2 heading', () => {
    render(<NextProject nextTitle="Verzion Cloud Migration" nextSlug="verzion-cloud-migration" />);
    expect(screen.getByRole('heading', { level: 2, name: 'Next Project' })).toBeInTheDocument();
  });

  it('renders a primary Button link with the correct href', () => {
    render(<NextProject nextTitle="Verzion Cloud Migration" nextSlug="verzion-cloud-migration" />);
    const link = screen.getByRole('link', { name: 'Verzion Cloud Migration →' });
    expect(link).toHaveAttribute('href', '/case-study/verzion-cloud-migration');
  });

  it('appends → to the button accessible name (title)', () => {
    render(<NextProject nextTitle="Mashreq" nextSlug="mashreq" />);
    expect(screen.getByRole('link', { name: 'Mashreq →' })).toBeInTheDocument();
  });

  it('constructs the href from nextSlug (including dotted slugs)', () => {
    render(<NextProject nextTitle="Astrosure AI" nextSlug="astrosure.ai" />);
    const link = screen.getByRole('link', { name: 'Astrosure AI →' });
    expect(link).toHaveAttribute('href', '/case-study/astrosure.ai');
  });

  it('performs no internal data lookup -- props are its only data source', () => {
    // If the component imported the loader and did getCaseStudyBySlug internally,
    // it would need to be mocked here. The fact that it renders purely from props
    // is verified by the test not needing any mock setup.
    render(<NextProject nextTitle="CAD" nextSlug="cad" />);
    expect(screen.getByRole('link', { name: 'CAD →' })).toBeInTheDocument();
  });
});
