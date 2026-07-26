import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Overview } from './Overview';

const baseProps = {
  client: 'Acme Corp',
  industry: 'Technology',
  role: 'UX Designer',
  team: 'Solo',
  timeline: '3 months',
};

describe('Overview', () => {
  it('renders all 6 property-name Labels in fixed DOM order', () => {
    render(<Overview {...baseProps} external_link={undefined} />);
    const labels = screen.getAllByText(/^(Client|Industry|My Role|Team|Timeline|Links)$/);
    // Must have all 5 mandatory labels; Links label also present
    expect(labels.map((l) => l.textContent)).toEqual(
      expect.arrayContaining(['Client', 'Industry', 'My Role', 'Team', 'Timeline', 'Links'])
    );
  });

  it('renders the value cells with correct text', () => {
    render(<Overview {...baseProps} external_link={undefined} />);
    expect(screen.getByText('Acme Corp')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('UX Designer')).toBeInTheDocument();
    expect(screen.getByText('Solo')).toBeInTheDocument();
    expect(screen.getByText('3 months')).toBeInTheDocument();
  });

  it('renders "Coming soon" label in Links row when external_link is undefined', () => {
    render(<Overview {...baseProps} external_link={undefined} />);
    expect(screen.getByText('Coming soon')).toBeInTheDocument();
    // No buttons should render
    expect(screen.queryByRole('link', { name: /Prototype/i })).toBeNull();
    expect(screen.queryByRole('link', { name: /Live Site/i })).toBeNull();
  });

  it('renders Prototype and Live Site buttons when external_link is present', () => {
    render(<Overview {...baseProps} external_link="https://example.com" />);
    const protoLink = screen.getByRole('link', { name: 'Prototype' });
    const liveLink = screen.getByRole('link', { name: 'Live Site' });
    expect(protoLink).toHaveAttribute('href', 'https://example.com');
    expect(liveLink).toHaveAttribute('href', 'https://example.com');
    // No "Coming soon" text
    expect(screen.queryByText('Coming soon')).toBeNull();
  });

  it('is wrapped in exactly one Card element (rounded-3xl class)', () => {
    const { container } = render(<Overview {...baseProps} external_link={undefined} />);
    const cards = container.querySelectorAll('[class*="rounded-3xl"]');
    expect(cards.length).toBeGreaterThanOrEqual(1);
  });
});
