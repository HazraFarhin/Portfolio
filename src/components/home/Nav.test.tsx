import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Nav } from './Nav';
import { navContent } from '../../content/nav';

describe('Nav', () => {
  it('renders exactly one <nav> containing 5 links total (wordmark + 4 nav links)', () => {
    const { container } = render(<Nav />);
    const navs = container.querySelectorAll('nav');
    expect(navs).toHaveLength(1);

    const links = navs[0].querySelectorAll('a');
    expect(links).toHaveLength(5);
  });

  it('renders the wordmark link pointing at wordmarkHref', () => {
    render(<Nav />);
    const wordmark = screen.getByRole('link', { name: navContent.wordmark });
    expect(wordmark).toHaveAttribute('href', navContent.wordmarkHref);
  });

  it('renders navContent.links 1:1 -- exactly 4 entries with matching label/href', () => {
    render(<Nav />);
    expect(navContent.links).toHaveLength(4);

    for (const link of navContent.links) {
      const el = screen.getByRole('link', { name: link.label });
      expect(el).toHaveAttribute('href', link.href);
    }
  });

  it('exposes navContent.links in the exact order: Work, Method, Skills, Contact', () => {
    expect(navContent.links.map((l) => l.label)).toEqual([
      'Work',
      'Method',
      'Skills',
      'Contact',
    ]);
    expect(navContent.links.map((l) => l.href)).toEqual([
      '#selected-work',
      '#how-i-work',
      '#skills-tools',
      '#contact-footer',
    ]);
  });

  it('renders every link as a plain in-page anchor, never a router-driven "/#" href', () => {
    const { container } = render(<Nav />);
    const links = container.querySelectorAll('nav a');
    for (const link of links) {
      const href = link.getAttribute('href');
      expect(href).toMatch(/^#/);
    }
  });
});
