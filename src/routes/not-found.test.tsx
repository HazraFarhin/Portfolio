import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NotFoundRoute from './not-found';

describe('NotFoundRoute', () => {
  it('renders "Page not found." text', () => {
    render(<NotFoundRoute />);
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
  });

  it('renders the descriptive body text', () => {
    render(<NotFoundRoute />);
    expect(
      screen.getByText("This page doesn't exist. Let's get you back to the homepage.")
    ).toBeInTheDocument();
  });

  it('renders a ghost Button with href="/" and accessible name containing "Back to home"', () => {
    render(<NotFoundRoute />);
    const link = screen.getByRole('link', { name: /Back to home/i });
    expect(link).toHaveAttribute('href', '/');
  });
});
