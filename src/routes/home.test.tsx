import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomeRoute from './home';
import { heroContent } from '../content/hero';

describe('HomeRoute', () => {
  it('renders the eyebrow, statement, CTA, and meta card copy from heroContent', () => {
    render(<HomeRoute />);

    expect(screen.getByText(heroContent.eyebrow)).toBeInTheDocument();
    expect(screen.getByText(heroContent.statement)).toBeInTheDocument();

    const cta = screen.getByRole('link', { name: heroContent.ctaLabel });
    expect(cta).toHaveAttribute('href', heroContent.ctaHref);

    expect(screen.getByText(heroContent.metaDescription)).toBeInTheDocument();
    expect(screen.getByText(heroContent.metaStatus)).toBeInTheDocument();
  });

  it('gives the Hero section root an id="hero" matching the CTA href target', () => {
    const { container } = render(<HomeRoute />);
    const section = container.querySelector('#hero');

    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');
    expect(heroContent.ctaHref).toBe('#hero');
  });

  it('composes the CTA via the Button primitive, not a raw ad-hoc anchor', () => {
    render(<HomeRoute />);
    const cta = screen.getByRole('link', { name: heroContent.ctaLabel });

    expect(cta.className).toContain('rounded-full');
  });

  it('constrains the statement paragraph to a max-width with no truncation classes', () => {
    render(<HomeRoute />);
    const statement = screen.getByText(heroContent.statement);

    expect(statement.className).toMatch(/max-w-\[62ch\]/);
    expect(statement.className).not.toMatch(/truncate/);
    expect(statement.className).not.toMatch(/overflow-hidden/);
  });
});
