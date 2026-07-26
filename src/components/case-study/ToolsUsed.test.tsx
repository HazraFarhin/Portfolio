import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ToolsUsed } from './ToolsUsed';

describe('ToolsUsed', () => {
  it('renders "Tools list pending." and no markdown output when content is empty', () => {
    const { getByText, queryByText } = render(<ToolsUsed content="" />);
    expect(getByText('Tools list pending.')).toBeInTheDocument();
    expect(queryByText('Figma')).not.toBeInTheDocument();
  });

  it('renders "Tools list pending." when content is whitespace-only', () => {
    const { getByText } = render(<ToolsUsed content={'   \n  '} />);
    expect(getByText('Tools list pending.')).toBeInTheDocument();
  });

  it('renders the authored tool list when content contains a bullet item', () => {
    const { getByText, queryByText } = render(<ToolsUsed content={'- Figma\n- Miro'} />);
    expect(getByText('Figma')).toBeInTheDocument();
    expect(getByText('Miro')).toBeInTheDocument();
    expect(queryByText('Tools list pending.')).not.toBeInTheDocument();
  });

  it('renders the section heading "Tools Used" as an h2', () => {
    const { getByRole } = render(<ToolsUsed content="- Figma" />);
    expect(getByRole('heading', { level: 2, name: 'Tools Used' })).toBeInTheDocument();
  });

  it('applies flex-wrap classes to the rendered tool list wrapper', () => {
    const { container } = render(<ToolsUsed content="- Figma" />);
    const wrapper = container.querySelector('section > div');
    expect(wrapper?.className).toContain('flex-wrap');
  });
});
