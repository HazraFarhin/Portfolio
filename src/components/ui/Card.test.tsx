import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Card } from './Card';

describe('Card', () => {
  it('renders children inside a single wrapping element with rounded-3xl and backdrop-blur-lg', () => {
    const { container } = render(<Card>content</Card>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper).toBeTruthy();
    expect(wrapper.className).toContain('rounded-3xl');
    expect(wrapper.className).toContain('backdrop-blur-lg');
    expect(wrapper.textContent).toBe('content');
  });

  it('renders long content without overflow-hidden, truncate, or a fixed height class', () => {
    const longText =
      'This is a long paragraph of content that exceeds one hundred and fifty characters in length to verify the card never clips or truncates its content regardless of how much text is passed in as children here.';
    const { container } = render(<Card>{longText}</Card>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.textContent).toBe(longText);
    expect(wrapper.className).not.toMatch(/overflow-hidden/);
    expect(wrapper.className).not.toMatch(/truncate/);
    expect(wrapper.className).not.toMatch(/(^|\s)h-\d/);
  });

  it('merges a caller-supplied className with the base glass styling', () => {
    const { container } = render(<Card className="custom-class">content</Card>);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain('rounded-3xl');
    expect(wrapper.className).toContain('custom-class');
  });
});
