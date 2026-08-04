import { useId, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Body, Label } from '../ui/Typography';
import { footerContent } from '../../content/footer';
import { useScrollReveal } from '../../motion/useScrollReveal';

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

/**
 * Combined Contact/Brief + Footer section (HOME-08, CONT-04, D-07/D-15/D-16)
 * -- the phase's closing section. Two blocks:
 *
 * 1. Brief: a 3-field contact form wired to `POST /api/contact` (CONT-01,
 *    CONT-02). A hidden honeypot field (`name="company"`) short-circuits
 *    obvious bot submissions before any network call, rendering the
 *    identical success block so response timing/shape never leaks the
 *    detection mechanism (D-10). Submitting/success/error states are
 *    inline, per 04-UI-SPEC.md's Interaction & Motion Contract (D-09) --
 *    success replaces the form in place; error banners above it with all
 *    entered values preserved (uncontrolled inputs). The résumé CTA sits
 *    beside it, wired to the real converted PDF from Plan 03-05 (D-15).
 * 2. Footer: wordmark/tagline plus 3 columns -- Contact (literal items),
 *    Elsewhere (mapped from `footerContent.elsewhere`, checkpoint-confirmed
 *    URLs only), and Legal (plain non-interactive text, never an <a>, since
 *    no Privacy Policy/Terms destination exists this phase). Every
 *    `target="_blank"` anchor pairs with `rel="noopener noreferrer"`
 *    (T-03-01, reverse-tabnabbing mitigation).
 */
export function Footer() {
  const ref = useRef<HTMLElement>(null);
  useScrollReveal(ref);

  const workingOnId = useId();
  const emailId = useId();
  const clarifyId = useId();

  const [status, setStatus] = useState<SubmitStatus>('idle');

  const fieldClasses =
    'w-full rounded-md border border-line bg-secondary/55 px-md py-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot (D-10): a non-empty value means a bot filled every field,
    // including one that's invisible to real users. Render the identical
    // success block with zero network calls so response shape/timing never
    // leaks the detection mechanism.
    if (data.get('company')) {
      setStatus('success');
      return;
    }

    setStatus('submitting');

    const workingOn = String(data.get('workingOn') ?? '');
    const email = String(data.get('email') ?? '');
    const clarify = String(data.get('clarify') ?? '');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ workingOn, email, clarify }),
      });
      const json = await res.json();
      setStatus(res.ok && json.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <section id="contact-footer" ref={ref}>
      {/* Brief block */}
      <div>
        <Label>{footerContent.briefLabel}</Label>
        <Body className="max-w-[62ch]">{footerContent.briefIntro}</Body>

        {status === 'error' && (
          <div className="mt-lg flex items-start gap-xs rounded-md border border-destructive/40 bg-destructive/10 px-md py-sm transition-opacity duration-200 ease-out">
            <AlertCircle className="mt-1 h-5 w-5 shrink-0 text-destructive" aria-hidden="true" />
            <div className="flex flex-col gap-xs">
              <Body as="span" className="font-extrabold text-destructive">
                {footerContent.errorHeadline}
              </Body>
              <Body as="span">{footerContent.errorBody}</Body>
            </div>
          </div>
        )}

        {status === 'success' ? (
          <div className="mt-lg flex items-start gap-xs transition-opacity duration-200 ease-out">
            <CheckCircle2 className="mt-1 h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
            <div className="flex flex-col gap-xs">
              <Body as="span" className="font-extrabold text-accent">
                {footerContent.successHeadline}
              </Body>
              <Body as="span">{footerContent.successBody}</Body>
            </div>
          </div>
        ) : (
          <form
            className="flex flex-col gap-md mt-lg"
            onSubmit={handleSubmit}
            aria-busy={status === 'submitting'}
          >
            {/* Honeypot (D-10): invisible to real users, accessible-hidden
                (not display:none, which some bots/autofill skip). Never
                receives a visible spacing token. */}
            <input
              type="text"
              name="company"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute w-px h-px overflow-hidden opacity-0"
            />

            <div className="flex flex-col gap-xs">
              <label htmlFor={workingOnId}>
                <Label as="span">{footerContent.formFields.workingOn}</Label>
              </label>
              <input
                id={workingOnId}
                name="workingOn"
                type="text"
                required
                className={fieldClasses}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label htmlFor={emailId}>
                <Label as="span">{footerContent.formFields.emailLabel}</Label>
              </label>
              <input
                id={emailId}
                name="email"
                type="email"
                required
                className={fieldClasses}
              />
            </div>

            <div className="flex flex-col gap-xs">
              <label htmlFor={clarifyId}>
                <Label as="span">{footerContent.formFields.clarify}</Label>
              </label>
              <textarea
                id={clarifyId}
                name="clarify"
                rows={4}
                required
                className={fieldClasses}
              />
            </div>

            <Button
              variant="primary"
              type="submit"
              disabled={status === 'submitting'}
              className="self-start"
            >
              {status === 'submitting' ? footerContent.submittingLabel : footerContent.submitLabel}
            </Button>
          </form>
        )}

        <Button
          variant="primary"
          href={footerContent.resumeHref}
          download
          className="mt-lg self-start"
        >
          {footerContent.resumeLabel}
        </Button>
      </div>

      {/* Footer block */}
      <div className="mt-3xl">
        <Label>{footerContent.wordmark}</Label>
        <Body className="max-w-[62ch]">{footerContent.tagline}</Body>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-lg mt-xl">
          <div className="flex flex-col gap-sm">
            <Button variant="ghost" href={footerContent.contactEmailHref}>
              {footerContent.contactEmail}
            </Button>
            <Body>{footerContent.contactPhone}</Body>
            <Body>{footerContent.contactLocation}</Body>
          </div>

          <div className="flex flex-col gap-sm">
            {footerContent.elsewhere.map((link) => (
              <Button
                key={link.href}
                variant="ghost"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {link.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col gap-sm">
            <Label>{footerContent.legal[0]}</Label>
            <Label>{footerContent.legal[1]}</Label>
          </div>
        </div>

        <Body className="text-center mt-2xl">{footerContent.bottomLine}</Body>
      </div>
    </section>
  );
}
