import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DraftBadge } from './DraftBadge';

describe('DraftBadge', () => {
  it('renders the exact copy text when status is "Draft"', () => {
    render(<DraftBadge status="Draft" />);
    expect(screen.getByText('Draft content — pending final copy')).toBeInTheDocument();
  });

  it('renders null (no DOM output) when status is "Published"', () => {
    const { container } = render(<DraftBadge status="Published" />);
    expect(container.firstChild).toBeNull();
  });

  it('does not contain any destructive/red CSS class when rendering Draft', () => {
    const { container } = render(<DraftBadge status="Draft" />);
    const element = container.firstChild as HTMLElement;
    const allClasses = element?.className || '';
    expect(allClasses).not.toMatch(/destructive|bg-red|text-red|border-red/);
  });

  it('exports a named DraftBadge function accepting status prop', () => {
    // TypeScript compilation confirms the shape; rendering confirms behavior
    render(<DraftBadge status="Draft" />);
    expect(screen.getByText('Draft content — pending final copy')).toBeTruthy();
  });
});
