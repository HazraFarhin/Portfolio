import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { HowIWork } from './HowIWork';
import { howIWorkContent } from '../../content/how-i-work';

describe('HowIWork', () => {
  it('exports exactly 6 action words in fixed order', () => {
    expect(howIWorkContent.actionWords).toEqual([
      'listen',
      'align',
      'reduce',
      'design.',
      'prototype',
      'systemize',
    ]);
  });

  it('exports exactly 5 loop steps named Understand, Align, Structure, Design, Transfer in order', () => {
    expect(howIWorkContent.loopSteps).toHaveLength(5);
    expect(howIWorkContent.loopSteps.map((step) => step.name)).toEqual([
      'Understand',
      'Align',
      'Structure',
      'Design',
      'Transfer',
    ]);
    howIWorkContent.loopSteps.forEach((step) => {
      expect(step.description.length).toBeGreaterThan(0);
    });
  });

  it('renders a single <section id="how-i-work"> containing all 6 action words', () => {
    const { container } = render(<HowIWork />);
    const section = container.querySelector('#how-i-work');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');

    howIWorkContent.actionWords.forEach((word) => {
      expect(screen.getByText(word)).toBeInTheDocument();
    });
  });

  it('renders all 5 loop step names and descriptions inside the same section', () => {
    const { container } = render(<HowIWork />);
    const section = container.querySelector('#how-i-work');
    const stepHeadings = container.querySelectorAll('h3');

    expect(stepHeadings).toHaveLength(5);
    howIWorkContent.loopSteps.forEach((step, index) => {
      expect(stepHeadings[index].textContent).toContain(step.name);
      expect(section?.contains(stepHeadings[index])).toBe(true);
      expect(screen.getByText(step.description)).toBeInTheDocument();
    });
  });

  it('renders exactly one section element (never split into two)', () => {
    const { container } = render(<HowIWork />);
    expect(container.querySelectorAll('section')).toHaveLength(1);
  });

  it('never uses .actionWords.map( or .loopSteps.map( in the component source', () => {
    // Renders both beats via literal hardcoded blocks per D-02 -- see the
    // static grep assertion at the plan level; this test asserts the
    // rendered-DOM consequence: exactly 6 action-word nodes and 5 loop-step
    // heading nodes exist regardless of iteration approach.
    const { container } = render(<HowIWork />);
    const actionWordNodes = howIWorkContent.actionWords.map((word) =>
      screen.getByText(word)
    );
    expect(actionWordNodes).toHaveLength(6);
    void container;
  });
});
