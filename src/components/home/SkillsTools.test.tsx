import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SkillsTools } from './SkillsTools';
import { skillsToolsContent, skillTags } from '../../content/skills-tools';

describe('skillsToolsContent', () => {
  it('has exactly 5 capability cards in D-03 order', () => {
    expect(skillsToolsContent.cards).toHaveLength(5);
    expect(skillsToolsContent.cards.map((c) => c.title)).toEqual([
      'Discovery & Research',
      'UX Strategy & IA',
      'UI Design & Prototyping',
      'Stakeholder & Developer Alignment',
      'Design Systems & Dev Handoff',
    ]);
  });
});

describe('skillTags', () => {
  it('equals the real, computed, alphabetically-sorted tag values', () => {
    expect(skillTags).toEqual([
      'AI Interface',
      'Banking',
      'Cloud',
      'Dashboard',
      'Design System',
      'Enterprise',
      'InsurTech',
      'Mobile',
      'UI',
      'UX',
    ]);
  });
});

describe('SkillsTools', () => {
  it('renders section id="skills-tools", the label/heading/leadLine, and all 5 capability cards', () => {
    render(<SkillsTools />);

    const section = document.querySelector('#skills-tools');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');

    expect(screen.getByText(skillsToolsContent.label)).toBeInTheDocument();
    expect(screen.getByText(skillsToolsContent.heading)).toBeInTheDocument();
    expect(screen.getByText(skillsToolsContent.leadLine)).toBeInTheDocument();
    expect(screen.getByText(skillsToolsContent.closingNote)).toBeInTheDocument();

    for (const card of skillsToolsContent.cards) {
      expect(screen.getByText(card.title)).toBeInTheDocument();
      expect(screen.getByText(card.description)).toBeInTheDocument();
    }
  });

  it('renders all 10 real tool chips inside a flex-wrap row that never scrolls or clips', () => {
    const { container } = render(<SkillsTools />);

    for (const tag of skillTags) {
      expect(screen.getByText(tag)).toBeInTheDocument();
    }

    const chipRow = container.querySelector('.flex.flex-wrap');
    expect(chipRow).not.toBeNull();
    expect(chipRow?.className).not.toMatch(/overflow-x-auto/);
  });

  it('never uses .cards.map() -- the 5 cards are literal, fixed-sequence JSX', () => {
    // Structural guarantee mirrored at the source level by the plan's own
    // acceptance criterion (grep -c '\.cards\.map(' returns 0); here we
    // assert the same card set renders in the exact declared order.
    render(<SkillsTools />);
    const headings = screen.getAllByRole('heading', { level: 3 });
    expect(headings.map((h) => h.textContent)).toEqual(
      skillsToolsContent.cards.map((c) => c.title)
    );
  });
});
