import { useId, useRef } from 'react';
import { Button } from '../ui/Button';
import { Body, Label } from '../ui/Typography';
import { footerContent } from '../../content/footer';
import { useScrollReveal } from '../../motion/useScrollReveal';

/**
 * Combined Contact/Brief + Footer section (HOME-08, CONT-04, D-07/D-15/D-16)
 * -- the phase's closing section. Two blocks:
 *
 * 1. Brief: a static 3-field contact form. Deliberately has NO `onSubmit`
 *    handler (D-07) -- CONT-01 (delivery) and CONT-02 (feedback) are
 *    Phase 4's job, wired onto this same markup later. The résumé CTA sits
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

  const fieldClasses =
    'w-full rounded-md border border-line bg-secondary/55 px-md py-sm text-foreground placeholder:text-muted-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

  return (
    <section id="contact-footer" ref={ref}>
      {/* Brief block */}
      <div>
        <Label>{footerContent.briefLabel}</Label>
        <Body className="max-w-[62ch]">{footerContent.briefIntro}</Body>

        <form className="flex flex-col gap-md mt-lg">
          <div className="flex flex-col gap-xs">
            <label htmlFor={workingOnId}>
              <Label as="span">{footerContent.formFields.workingOn}</Label>
            </label>
            <input id={workingOnId} type="text" className={fieldClasses} />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor={emailId}>
              <Label as="span">{footerContent.formFields.emailLabel}</Label>
            </label>
            <input id={emailId} type="email" required className={fieldClasses} />
          </div>

          <div className="flex flex-col gap-xs">
            <label htmlFor={clarifyId}>
              <Label as="span">{footerContent.formFields.clarify}</Label>
            </label>
            <textarea id={clarifyId} rows={4} className={fieldClasses} />
          </div>

          <Button variant="primary" type="submit" className="self-start">
            {footerContent.submitLabel}
          </Button>
        </form>

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
