import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LearningsReflections } from './LearningsReflections';

describe('LearningsReflections', () => {
  it('renders a "Learnings & Reflections" h2 heading', () => {
    render(<LearningsReflections content="Some learnings from this project." />);
    expect(screen.getByRole('heading', { level: 2, name: 'Learnings & Reflections' })).toBeInTheDocument();
  });

  it('renders the markdown content as body text', () => {
    render(<LearningsReflections content="We learned to iterate faster." />);
    expect(screen.getByText('We learned to iterate faster.')).toBeInTheDocument();
  });

  it('never renders a native <img> element', () => {
    const { container: c1 } = render(<LearningsReflections content="No image here." />);
    expect(c1.querySelector('img')).toBeNull();

    const { container: c2 } = render(<LearningsReflections content="![Alt](https://example.com/img.png)" />);
    expect(c2.querySelector('img')).toBeNull();
  });

  it('renders empty content without crashing', () => {
    const { container } = render(<LearningsReflections content="" />);
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    // No blockquote shell should be rendered for empty content
    expect(container.querySelector('blockquote')).toBeNull();
  });
});
