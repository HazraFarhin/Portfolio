import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders a native <button type="button"> when no href is provided', () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button.tagName).toBe('BUTTON');
    expect(button).toHaveAttribute('type', 'button');
  });

  it('renders a native <a> element with the given href when href is provided', () => {
    render(<Button href="/work">View work</Button>);
    const link = screen.getByRole('link', { name: 'View work' });
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/work');
  });

  it('produces a different className string for variant="ghost" vs the default "primary"', () => {
    const { container: primaryContainer } = render(<Button>Primary</Button>);
    const { container: ghostContainer } = render(<Button variant="ghost">Ghost</Button>);
    const primaryClassName = primaryContainer.querySelector('button')?.className;
    const ghostClassName = ghostContainer.querySelector('button')?.className;
    expect(primaryClassName).not.toEqual(ghostClassName);
  });

  it('renders a long CTA string in full, untruncated, with no truncation utility classes', () => {
    render(<Button>View Selected Work →</Button>);
    const button = screen.getByText('View Selected Work →');
    expect(button).toBeInTheDocument();
    expect(button.className).not.toMatch(/truncate/);
    expect(button.className).not.toMatch(/overflow-hidden/);
    expect(button.className).not.toMatch(/text-ellipsis/);
  });

  it('gates the hover-lift utility behind motion-safe: and never applies it unguarded', () => {
    render(<Button>Hover me</Button>);
    const button = screen.getByRole('button', { name: 'Hover me' });
    expect(button.className).toContain('motion-safe:hover:-translate-y-0.5');

    const withoutGuarded = button.className.replace('motion-safe:hover:-translate-y-0.5', '');
    expect(withoutGuarded).not.toMatch(/hover:-translate-y/);
  });
});
