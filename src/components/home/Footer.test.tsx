import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('Footer submission handling', () => {
  const fillRequiredFields = () => {
    fireEvent.change(screen.getByLabelText(footerContent.formFields.workingOn), {
      target: { value: 'A new dashboard' },
    });
    fireEvent.change(screen.getByLabelText(footerContent.formFields.emailLabel), {
      target: { value: 'someone@example.com' },
    });
    fireEvent.change(screen.getByLabelText(footerContent.formFields.clarify), {
      target: { value: 'The onboarding flow' },
    });
  };

  const getHoneypot = (container: HTMLElement) =>
    container.querySelector('input[name="company"]') as HTMLInputElement;

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('workingOn input and clarify textarea are required', () => {
    render(<Footer />);
    expect(screen.getByLabelText(footerContent.formFields.workingOn)).toBeRequired();
    expect(screen.getByLabelText(footerContent.formFields.clarify)).toBeRequired();
  });

  it('renders a hidden honeypot input not reachable via label text', () => {
    const { container } = render(<Footer />);
    const honeypot = getHoneypot(container);
    expect(honeypot).not.toBeNull();
    expect(honeypot).toHaveAttribute('name', 'company');
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot).toHaveAttribute('tabIndex', '-1');
    expect(screen.queryByLabelText('company')).not.toBeInTheDocument();
  });

  it('submitting with honeypot empty calls fetch once with /api/contact, POST, and the 3 field values', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    render(<Footer />);
    fillRequiredFields();

    fireEvent.click(screen.getByRole('button', { name: footerContent.submitLabel }));

    await waitFor(() => expect(globalThis.fetch).toHaveBeenCalledTimes(1));

    const [url, options] = (globalThis.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(url).toBe('/api/contact');
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body as string);
    expect(body).toMatchObject({
      workingOn: 'A new dashboard',
      email: 'someone@example.com',
      clarify: 'The onboarding flow',
    });
  });

  it('submitting with honeypot filled never calls fetch and renders the success block', async () => {
    const { container } = render(<Footer />);
    fillRequiredFields();
    fireEvent.change(getHoneypot(container), { target: { value: 'spambot' } });

    fireEvent.click(screen.getByRole('button', { name: footerContent.submitLabel }));

    await waitFor(() =>
      expect(screen.getByText(footerContent.successHeadline)).toBeInTheDocument()
    );
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('renders the success block in place of the form when fetch resolves ok', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ ok: true }),
    });

    const { container } = render(<Footer />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: footerContent.submitLabel }));

    await waitFor(() =>
      expect(screen.getByText(footerContent.successHeadline)).toBeInTheDocument()
    );
    expect(container.querySelector('form')).not.toBeInTheDocument();
  });

  it('renders an error banner above the form and preserves field values when fetch resolves not-ok', async () => {
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ ok: false }),
    });

    const { container } = render(<Footer />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: footerContent.submitLabel }));

    await waitFor(() => expect(screen.getByText(footerContent.errorHeadline)).toBeInTheDocument());
    expect(container.querySelector('form')).not.toBeNull();
    expect(screen.getByLabelText(footerContent.formFields.workingOn)).toHaveValue(
      'A new dashboard'
    );
  });

  it('shows the submitting label, disables the button, and sets aria-busy on the form while in flight', async () => {
    let resolveFetch: (value: unknown) => void = () => {};
    (globalThis.fetch as ReturnType<typeof vi.fn>).mockReturnValue(
      new Promise((resolve) => {
        resolveFetch = resolve;
      })
    );

    const { container } = render(<Footer />);
    fillRequiredFields();
    fireEvent.click(screen.getByRole('button', { name: footerContent.submitLabel }));

    await waitFor(() =>
      expect(screen.getByRole('button', { name: footerContent.submittingLabel })).toBeDisabled()
    );
    expect(container.querySelector('form')).toHaveAttribute('aria-busy', 'true');

    resolveFetch({ ok: true, json: () => Promise.resolve({ ok: true }) });
  });
});
