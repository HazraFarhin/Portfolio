import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Body, Display, Heading, Label } from './Typography';

describe('Typography', () => {
  it('Label renders a <span> by default with text-label and uppercase classes', () => {
    render(<Label>Eyebrow</Label>);
    const el = screen.getByText('Eyebrow');
    expect(el.tagName).toBe('SPAN');
    expect(el.className).toContain('text-label');
    expect(el.className).toContain('uppercase');
  });

  it('Body renders a <p> by default with text-body class', () => {
    render(<Body>Paragraph text</Body>);
    const el = screen.getByText('Paragraph text');
    expect(el.tagName).toBe('P');
    expect(el.className).toContain('text-body');
  });

  it('Heading renders an <h2> by default with text-heading and font-extrabold classes', () => {
    render(<Heading>Section title</Heading>);
    const el = screen.getByText('Section title');
    expect(el.tagName).toBe('H2');
    expect(el.className).toContain('text-heading');
    expect(el.className).toContain('font-extrabold');
  });

  it('Display renders with text-display and font-extrabold classes', () => {
    render(<Display>Big statement</Display>);
    const el = screen.getByText('Big statement');
    expect(el.className).toContain('text-display');
    expect(el.className).toContain('font-extrabold');
  });

  it('each of the four accepts an "as" prop overriding the rendered tag', () => {
    render(<Heading as="h1">Main title</Heading>);
    const el = screen.getByText('Main title');
    expect(el.tagName).toBe('H1');
  });

  it('renders a 400+ character Body string in full with no truncation class', () => {
    const longText = 'A'.repeat(410);
    render(<Body>{longText}</Body>);
    const el = screen.getByText(longText);
    expect(el.textContent).toHaveLength(410);
    expect(el.className).not.toMatch(/truncate/);
    expect(el.className).not.toMatch(/overflow-hidden/);
    expect(el.className).not.toMatch(/text-ellipsis/);
  });
});
