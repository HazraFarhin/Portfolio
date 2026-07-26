import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Solution } from './Solution';

describe('Solution', () => {
  it('renders the "Solution" h2 heading', () => {
    render(<Solution content="Some solution content." />);
    const heading = screen.getByRole('heading', { level: 2, name: 'Solution' });
    expect(heading).toBeInTheDocument();
  });

  it('renders exactly 2 centerpiece-sized ImagePlaceholder blocks when content is non-empty', () => {
    const { container } = render(<Solution content="A solution narrative." />);
    const placeholders = container.querySelectorAll('[class*="aspect-[4/3]"]');
    expect(placeholders).toHaveLength(2);
  });

  it('renders exactly 2 centerpiece-sized ImagePlaceholder blocks when content is empty', () => {
    const { container } = render(<Solution content="" />);
    const placeholders = container.querySelectorAll('[class*="aspect-[4/3]"]');
    expect(placeholders).toHaveLength(2);
  });

  it('renders exactly 2 centerpiece-sized ImagePlaceholder blocks when content is whitespace-only', () => {
    const { container } = render(<Solution content="   " />);
    const placeholders = container.querySelectorAll('[class*="aspect-[4/3]"]');
    expect(placeholders).toHaveLength(2);
  });

  it('never renders a native <img> element for any prop value', () => {
    const { container: c1 } = render(<Solution content="Text with no image" />);
    expect(c1.querySelector('img')).toBeNull();

    const { container: c2 } = render(<Solution content="" />);
    expect(c2.querySelector('img')).toBeNull();

    const { container: c3 } = render(<Solution content="![Alt](https://example.com/img.png)" />);
    expect(c3.querySelector('img')).toBeNull();
  });

  it('renders the markdown content as body text', () => {
    render(<Solution content="This is the solution narrative paragraph." />);
    expect(screen.getByText('This is the solution narrative paragraph.')).toBeInTheDocument();
  });

  it('has distinct captions on both centerpiece placeholders for accessibility', () => {
    render(<Solution content="Some content" />);
    expect(screen.getByText('Final solution — pending')).toBeInTheDocument();
    expect(screen.getByText('Final solution detail — pending')).toBeInTheDocument();
  });
});
