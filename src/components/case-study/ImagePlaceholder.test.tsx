import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { ImagePlaceholder } from './ImagePlaceholder';

describe('ImagePlaceholder', () => {
  const sizes = ['banner', 'stage', 'centerpiece'] as const;

  it('never renders a real <img> element for any size', () => {
    for (const size of sizes) {
      const { container } = render(<ImagePlaceholder caption="Test caption" size={size} />);
      expect(container.querySelector('img')).toBeNull();
    }
  });

  it('produces a distinct className string per size containing its aspect-ratio/max-height classes', () => {
    const classNames: Record<(typeof sizes)[number], string> = {
      banner: '',
      stage: '',
      centerpiece: '',
    };
    for (const size of sizes) {
      const { container } = render(<ImagePlaceholder caption="Test caption" size={size} />);
      classNames[size] = container.firstElementChild?.className ?? '';
    }

    expect(classNames.banner).toContain('aspect-[21/9]');
    expect(classNames.banner).toContain('max-h-[clamp(140px,20vh,220px)]');
    expect(classNames.stage).toContain('aspect-video');
    expect(classNames.stage).toContain('max-h-[200px]');
    expect(classNames.centerpiece).toContain('aspect-[4/3]');
    expect(classNames.centerpiece).toContain('max-h-[360px]');

    expect(classNames.banner).not.toEqual(classNames.stage);
    expect(classNames.stage).not.toEqual(classNames.centerpiece);
    expect(classNames.banner).not.toEqual(classNames.centerpiece);
  });

  it('renders the caption text via a Label', () => {
    const { getByText } = render(
      <ImagePlaceholder caption="Cover image — pending" size="banner" />
    );
    expect(getByText('Cover image — pending')).toBeInTheDocument();
  });
});

describe('ImagePlaceholder — portrait size (HOME-07, D-13, Pitfall 5)', () => {
  it('never renders a real <img> element for the portrait size', () => {
    const { container } = render(<ImagePlaceholder caption="Test caption" size="portrait" />);
    expect(container.querySelector('img')).toBeNull();
  });

  it('applies the portrait aspect-ratio/max-height classes, distinct from banner/stage/centerpiece', () => {
    const { container } = render(<ImagePlaceholder caption="Test caption" size="portrait" />);
    const className = container.firstElementChild?.className ?? '';

    expect(className).toContain('aspect-[3/4]');
    expect(className).toContain('max-h-[320px]');
  });

  it('renders the caption text via a Label for the portrait size', () => {
    const { getByText } = render(
      <ImagePlaceholder caption="Hazra Farhin — photo pending" size="portrait" />
    );
    expect(getByText('Hazra Farhin — photo pending')).toBeInTheDocument();
  });
});
