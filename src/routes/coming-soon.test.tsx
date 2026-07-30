import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ComingSoonRoute from './coming-soon';

describe('ComingSoonRoute', () => {
  it('renders "Coming soon." text', () => {
    render(<ComingSoonRoute slug="riyaah" />);
    expect(screen.getByText('Coming soon.')).toBeInTheDocument();
  });

  it('renders the exact locked descriptive body text', () => {
    render(<ComingSoonRoute slug="riyaah" />);
    expect(
      screen.getByText(
        "This case study hasn't shipped yet. Explore the six live projects instead."
      )
    ).toBeInTheDocument();
  });

  it('renders a ghost Button with href="/#selected-work" and accessible name containing "Back to Selected Work"', () => {
    render(<ComingSoonRoute slug="riyaah" />);
    const link = screen.getByRole('link', { name: /Back to Selected Work/i });
    expect(link).toHaveAttribute('href', '/#selected-work');
  });

  const slugTitleCases: Array<[string, string]> = [
    ['riyaah', 'Riyaah'],
    ['icici-bank-atm-kiosk', 'ICICI Bank ATM Kiosk'],
    ['ambit', 'Ambit'],
    ['northernarc', 'NorthernArc'],
    ['citrus', 'Citrus'],
  ];

  it.each(slugTitleCases)(
    'renders an sr-only heading containing the humanized title for slug "%s"',
    (slug, expectedTitle) => {
      const { container } = render(<ComingSoonRoute slug={slug} />);
      const heading = container.querySelector('h1.sr-only');
      expect(heading).not.toBeNull();
      expect(heading?.textContent).toContain(expectedTitle);
    }
  );

  it('does not contain the not-found route copy', () => {
    render(<ComingSoonRoute slug="riyaah" />);
    expect(screen.queryByText('Page not found.')).toBeNull();
  });

  it('does not contain the case-study-not-found route copy', () => {
    render(<ComingSoonRoute slug="riyaah" />);
    expect(screen.queryByText('Case study not found.')).toBeNull();
  });
});
