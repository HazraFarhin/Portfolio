import { render, screen, within } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Process, type ProcessStages } from './Process';

const fullStages: ProcessStages = {
  discoveryResearch: 'We researched user needs extensively.',
  define: 'We defined the problem statement.',
  ideateWireframe: 'We ideated and created wireframes.',
  designPrototype: 'We designed and prototyped the solution.',
  testIterate: 'We tested and iterated on our designs.',
};

const emptyStages: ProcessStages = {
  discoveryResearch: '',
  define: '',
  ideateWireframe: '',
  designPrototype: '',
  testIterate: '',
};

describe('Process', () => {
  it('renders a "Process" h2 heading', () => {
    render(<Process stages={fullStages} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Process' })).toBeInTheDocument();
  });

  it('renders exactly 5 numbered eyebrow labels in fixed order', () => {
    const { container } = render(<Process stages={fullStages} />);
    const headings = container.querySelectorAll('h3');
    expect(headings).toHaveLength(5);
    expect(headings[0].textContent).toContain('01');
    expect(headings[0].textContent).toContain('Discovery & Research');
    expect(headings[1].textContent).toContain('02');
    expect(headings[1].textContent).toContain('Define');
    expect(headings[2].textContent).toContain('03');
    expect(headings[2].textContent).toContain('Ideate & Wireframe');
    expect(headings[3].textContent).toContain('04');
    expect(headings[3].textContent).toContain('Design & Prototype');
    expect(headings[4].textContent).toContain('05');
    expect(headings[4].textContent).toContain('Test & Iterate');
  });

  it('renders exactly 3 stage-sized ImagePlaceholder blocks at fixed positions', () => {
    const { container } = render(<Process stages={fullStages} />);
    // stage size has aspect-video class from ImagePlaceholder.tsx
    const stagePlaceholders = container.querySelectorAll('[class*="aspect-video"]');
    expect(stagePlaceholders).toHaveLength(3);
  });

  it('renders 5 stages even when all stage strings are empty (defensive)', () => {
    const { container } = render(<Process stages={emptyStages} />);
    const headings = container.querySelectorAll('h3');
    expect(headings).toHaveLength(5);
  });

  it('renders exactly 3 ImagePlaceholder blocks even with empty stage strings', () => {
    const { container } = render(<Process stages={emptyStages} />);
    const stagePlaceholders = container.querySelectorAll('[class*="aspect-video"]');
    expect(stagePlaceholders).toHaveLength(3);
  });

  it('never renders a native <img> element', () => {
    const { container: c1 } = render(<Process stages={fullStages} />);
    expect(c1.querySelector('img')).toBeNull();

    const { container: c2 } = render(<Process stages={emptyStages} />);
    expect(c2.querySelector('img')).toBeNull();
  });

  it('renders Discovery & Research stage content', () => {
    render(<Process stages={fullStages} />);
    expect(screen.getByText('We researched user needs extensively.')).toBeInTheDocument();
  });

  it('exports the ProcessStages interface (type check via usage)', () => {
    // This test confirms the component accepts the ProcessStages type shape without TS errors
    const stages: ProcessStages = {
      discoveryResearch: 'a',
      define: 'b',
      ideateWireframe: 'c',
      designPrototype: 'd',
      testIterate: 'e',
    };
    render(<Process stages={stages} />);
    expect(screen.getByRole('heading', { level: 2, name: 'Process' })).toBeInTheDocument();
  });
});
