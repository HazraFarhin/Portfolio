import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { OutcomeImpact } from './OutcomeImpact';

const FALLBACK =
  'Outcome details pending — qualitative summary of impact and stakeholder reception to follow.';

describe('OutcomeImpact', () => {
  it('renders the exact fallback sentence with an italic className when content is empty', () => {
    const { getByText } = render(<OutcomeImpact content="" />);
    const fallback = getByText(FALLBACK);
    expect(fallback).toBeInTheDocument();
    expect(fallback.className).toContain('italic');
  });

  it('renders the fallback when content is whitespace-only', () => {
    const { getByText } = render(<OutcomeImpact content={'   \n '} />);
    expect(getByText(FALLBACK)).toBeInTheDocument();
  });

  it('renders authored content instead of the fallback when content is non-empty', () => {
    const { getByText, queryByText } = render(
      <OutcomeImpact content="Stakeholders approved the redesigned flow." />
    );
    expect(getByText('Stakeholders approved the redesigned flow.')).toBeInTheDocument();
    expect(queryByText(FALLBACK)).not.toBeInTheDocument();
  });

  it('renders the section heading "Outcome & Impact" as an h2', () => {
    const { getByRole } = render(<OutcomeImpact content="Some outcome." />);
    expect(getByRole('heading', { level: 2, name: 'Outcome & Impact' })).toBeInTheDocument();
  });
});
