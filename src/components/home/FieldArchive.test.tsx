import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { FieldArchive } from './FieldArchive';
import { fieldArchiveContent } from '../../content/field-archive';

describe('FieldArchive', () => {
  it('exposes exactly 6 captions matching Homepage Copy V2.md §06, in order', () => {
    expect(fieldArchiveContent.captions).toHaveLength(6);
    expect(fieldArchiveContent.captions).toEqual([
      'Early flow mapping, digital banking self-service',
      'Wireframe iteration, cloud migration dashboard',
      'Component states, RTL-optimised commerce UI',
      'Usability test notes, AI-native agent tooling',
      'Stakeholder review notes, requirement changes tracked',
      'Handoff spec, production-ready HTML/CSS',
    ]);
  });

  it('renders <section id="field-archive"> with a keyboard-focusable, native scroll region', () => {
    const { container } = render(<FieldArchive />);
    const section = container.querySelector('#field-archive');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');

    const region = screen.getByRole('region', {
      name: 'Field Archive gallery',
    });
    expect(region).toHaveAttribute('tabIndex', '0');
    expect(region.className).toMatch(/overflow-x-auto/);
  });

  it('renders exactly 6 caption texts and 6 image placeholders', () => {
    const { container } = render(<FieldArchive />);
    for (const caption of fieldArchiveContent.captions) {
      expect(screen.getByText(caption)).toBeInTheDocument();
    }

    const placeholders = container.querySelectorAll('[role="region"] > div');
    expect(placeholders).toHaveLength(6);
  });
});
