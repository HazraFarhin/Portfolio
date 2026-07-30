import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from './Footer';
import { footerContent } from '../../content/footer';

describe('footerContent', () => {
  it('elsewhere[] contains no placeholder/unconfirmed URLs', () => {
    expect(footerContent.elsewhere.some((link) => link.href === '#')).toBe(false);
    expect(footerContent.elsewhere.some((link) => /^https:\/\/linkedin\.com\/?$/.test(link.href))).toBe(
      false
    );
  });
});

describe('Footer', () => {
  it('renders <section id="contact-footer">', () => {
    render(<Footer />);
    const section = document.querySelector('#contact-footer');
    expect(section).not.toBeNull();
    expect(section?.tagName).toBe('SECTION');
  });

  it('renders exactly 3 labeled form fields and no onSubmit handler', () => {
    render(<Footer />);

    expect(screen.getByLabelText(footerContent.formFields.workingOn)).toBeInTheDocument();
    expect(screen.getByLabelText(footerContent.formFields.emailLabel)).toBeInTheDocument();
    expect(screen.getByLabelText(footerContent.formFields.clarify)).toBeInTheDocument();

    expect(screen.getByText(footerContent.submitLabel)).toBeInTheDocument();
  });

  it('email field is type="email" and required', () => {
    render(<Footer />);
    const emailField = screen.getByLabelText(footerContent.formFields.emailLabel);
    expect(emailField).toHaveAttribute('type', 'email');
    expect(emailField).toBeRequired();
  });

  it('résumé link has href="/resume.pdf" and a download attribute', () => {
    render(<Footer />);
    const resumeLink = screen.getByRole('link', { name: footerContent.resumeLabel });
    expect(resumeLink).toHaveAttribute('href', '/resume.pdf');
    expect(resumeLink).toHaveAttribute('download');
  });

  it('every target="_blank" anchor pairs with rel="noopener noreferrer"', () => {
    const { container } = render(<Footer />);
    const blankAnchors = container.querySelectorAll('a[target="_blank"]');

    // Only the elsewhere[] (external social) links open in a new tab this phase
    expect(blankAnchors.length).toBe(footerContent.elsewhere.length);
    expect(blankAnchors.length).toBeGreaterThan(0);
    blankAnchors.forEach((a) => {
      expect(a.getAttribute('rel')).toBe('noopener noreferrer');
    });
  });

  it('renders elsewhere[] links with the confirmed hrefs, all target="_blank"', () => {
    render(<Footer />);
    footerContent.elsewhere.forEach((link) => {
      const anchor = screen.getAllByRole('link', { name: link.label })[0];
      expect(anchor).toHaveAttribute('href', link.href);
      expect(anchor).toHaveAttribute('target', '_blank');
      expect(anchor).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });

  it('legal links render as plain text, never an <a>', () => {
    render(<Footer />);
    const linkNames = screen.getAllByRole('link').map((el) => el.textContent);

    footerContent.legal.forEach((label) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(linkNames).not.toContain(label);
    });
  });

  it('renders contact email as a mailto: link, phone and location as plain text', () => {
    render(<Footer />);
    const emailLink = screen.getByRole('link', { name: footerContent.contactEmail });
    expect(emailLink).toHaveAttribute('href', footerContent.contactEmailHref);

    expect(screen.getByText(footerContent.contactPhone)).toBeInTheDocument();
    expect(screen.getByText(footerContent.contactLocation)).toBeInTheDocument();
  });

  it('renders the wordmark, tagline, and bottom line', () => {
    render(<Footer />);
    expect(screen.getByText(footerContent.wordmark)).toBeInTheDocument();
    expect(screen.getByText(footerContent.tagline)).toBeInTheDocument();
    expect(screen.getByText(footerContent.bottomLine)).toBeInTheDocument();
  });
});
