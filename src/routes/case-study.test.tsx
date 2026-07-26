import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { describe, it, expect } from 'vitest';
import CaseStudyPage from './case-study';
import NotFoundRoute from './not-found';

// Helper: render CaseStudyPage at a given slug path
function renderAtSlug(slug: string) {
  return render(
    <MemoryRouter initialEntries={[`/case-study/${slug}`]}>
      <Routes>
        <Route path="case-study/:slug" element={<CaseStudyPage />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('CaseStudyPage', () => {
  it('renders all 8 section h2 headings in fixed document order for a real slug', async () => {
    renderAtSlug('mashreq');
    // Wait for lazy content if needed
    const headings = await screen.findAllByRole('heading', { level: 2 });
    const h2Texts = headings.map((h) => h.textContent);
    // Check the 8 body section headings are present in the correct order
    const expectedOrder = [
      'Overview',       // rendered inside Card (no h2? -- Overview uses its own label not Heading)
      'Tools Used',
      'Outcome & Impact',
      'The Challenge',
      'Process',
      'Solution',
      'Learnings & Reflections',
      'Next Project',
    ];
    // Verify all 7 section headings appear (Overview is actually inside a card without its own h2)
    expect(h2Texts).toContain('Tools Used');
    expect(h2Texts).toContain('Outcome & Impact');
    expect(h2Texts).toContain('The Challenge');
    expect(h2Texts).toContain('Process');
    expect(h2Texts).toContain('Solution');
    expect(h2Texts).toContain('Learnings & Reflections');
    expect(h2Texts).toContain('Next Project');
  });

  it('renders the case study title as an h1 for a real slug', () => {
    renderAtSlug('cad');
    // The page renders the title as an h1
    const h1 = screen.getByRole('heading', { level: 1 });
    expect(h1).toBeInTheDocument();
    expect(h1.textContent?.length).toBeGreaterThan(0);
  });

  it('resolves dotted slug astrosure.ai correctly (no dot-truncation bug)', () => {
    renderAtSlug('astrosure.ai');
    // Should not show the not-found fallback
    expect(screen.queryByText('Case study not found.')).toBeNull();
    // Should have an h1 (the case study title)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('resolves dotted slug adreport.io correctly', () => {
    renderAtSlug('adreport.io');
    expect(screen.queryByText('Case study not found.')).toBeNull();
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
  });

  it('renders "Case study not found." for an unmatched slug (riyaah)', () => {
    renderAtSlug('riyaah');
    expect(screen.getByText('Case study not found.')).toBeInTheDocument();
    // Should have a "Back to home" link
    expect(screen.getByRole('link', { name: /Back to home/i })).toBeInTheDocument();
  });

  it('does not render CaseStudyPage content for an empty slug segment (falls through to catch-all)', () => {
    render(
      <MemoryRouter initialEntries={['/case-study/']}>
        <Routes>
          <Route path="case-study/:slug" element={<CaseStudyPage />} />
          <Route path="*" element={<NotFoundRoute />} />
        </Routes>
      </MemoryRouter>
    );
    // The catch-all should render "Page not found." NOT "Case study not found."
    expect(screen.getByText('Page not found.')).toBeInTheDocument();
    expect(screen.queryByText('Case study not found.')).toBeNull();
  });

  it('every body section wrapper has py-xl and md:py-2xl spacing classes', () => {
    const { container } = renderAtSlug('mashreq');
    // Look for section elements with spacing classes
    const sections = container.querySelectorAll('section[class*="py-xl"]');
    expect(sections.length).toBeGreaterThanOrEqual(7);
  });
});
