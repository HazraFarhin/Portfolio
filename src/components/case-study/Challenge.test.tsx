import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Challenge } from './Challenge';

describe('Challenge', () => {
  it('renders a "The Challenge" h2 heading', () => {
    render(<Challenge content="This is the challenge." />);
    expect(screen.getByRole('heading', { level: 2, name: 'The Challenge' })).toBeInTheDocument();
  });

  it('renders the markdown content as body text', () => {
    render(<Challenge content="A challenging problem to solve." />);
    expect(screen.getByText('A challenging problem to solve.')).toBeInTheDocument();
  });

  it('renders a blockquote distinctly styled when content contains a markdown blockquote', () => {
    const { container } = render(<Challenge content="> This is a pull quote." />);
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).not.toBeNull();
    // The blockquote should have italic and border-l styling
    expect(blockquote?.className).toMatch(/italic/);
    expect(blockquote?.className).toMatch(/border-l/);
  });

  it('renders no blockquote element when content has no blockquote', () => {
    const { container } = render(<Challenge content="Just a regular paragraph." />);
    expect(container.querySelector('blockquote')).toBeNull();
  });

  it('never renders a native <img> element', () => {
    const { container: c1 } = render(<Challenge content="No image here." />);
    expect(c1.querySelector('img')).toBeNull();

    const { container: c2 } = render(<Challenge content="![Alt](https://example.com/img.png)" />);
    expect(c2.querySelector('img')).toBeNull();
  });
});
