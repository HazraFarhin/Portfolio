import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from './About';
import { aboutContent } from '../../content/about';
import { heroContent } from '../../content/hero';

describe('aboutContent', () => {
  it('bio is 2-4 sentences (by ". " boundary count)', () => {
    const sentenceCount = aboutContent.bio.split(/(?<=[.!?])\s+/).filter(Boolean).length;
    expect(sentenceCount).toBeGreaterThanOrEqual(2);
    expect(sentenceCount).toBeLessThanOrEqual(4);
  });

  it('bio is textually distinct from heroContent.statement', () => {
    expect(aboutContent.bio).not.toBe(heroContent.statement);
  });
});

describe('About', () => {
  it('renders <section id="about"> with the full bio, label, and heading', () => {
    render(<About />);

    const section = document.querySelector('#about');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');

    expect(screen.getByText(aboutContent.label)).toBeInTheDocument();
    expect(screen.getByText(aboutContent.heading)).toBeInTheDocument();
    expect(screen.getByText(aboutContent.bio)).toBeInTheDocument();
  });

  it('renders the bio paragraph with no truncation/clamp/overflow-hidden class', () => {
    render(<About />);
    const bio = screen.getByText(aboutContent.bio);

    expect(bio.className).not.toMatch(/truncate/);
    expect(bio.className).not.toMatch(/line-clamp/);
    expect(bio.className).not.toMatch(/overflow-hidden/);
  });

  it('renders exactly one ImagePlaceholder with size="portrait" (no real <img>, portrait aspect class)', () => {
    const { container } = render(<About />);

    expect(container.querySelector('img')).toBeNull();
    const portraitBlocks = container.querySelectorAll('[class*="aspect-[3/4]"]');
    expect(portraitBlocks).toHaveLength(1);
    expect(screen.getByText(aboutContent.headshotCaption)).toBeInTheDocument();
  });
});
