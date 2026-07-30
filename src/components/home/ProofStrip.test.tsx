import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProofStrip } from './ProofStrip';
import { proofStripContent } from '../../content/proof-strip';

describe('ProofStrip', () => {
  it('exposes exactly 4 stats matching Homepage Copy V2.md §05, in order', () => {
    expect(proofStripContent.stats.map((s) => s.value)).toEqual([
      '~4',
      '8+',
      '3',
      '30%',
    ]);
  });

  it('renders <section id="proof-strip"> with all 4 stat values and captions', () => {
    const { container } = render(<ProofStrip />);
    const section = container.querySelector('#proof-strip');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');

    for (const stat of proofStripContent.stats) {
      expect(screen.getByText(stat.value)).toBeInTheDocument();
      expect(screen.getByText(stat.caption)).toBeInTheDocument();
    }
  });

  it('renders the supporting line', () => {
    render(<ProofStrip />);
    expect(
      screen.getByText(proofStripContent.supportingLine)
    ).toBeInTheDocument();
  });

  it('carries text-accent on all 4 stat-value elements only', () => {
    render(<ProofStrip />);
    for (const stat of proofStripContent.stats) {
      const el = screen.getByText(stat.value);
      expect(el.className).toContain('text-accent');
    }
    for (const stat of proofStripContent.stats) {
      const caption = screen.getByText(stat.caption);
      expect(caption.className).not.toContain('text-accent');
    }
  });
});
