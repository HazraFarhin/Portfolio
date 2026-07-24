import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from 'react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'ghost';

interface BaseButtonProps {
  variant?: ButtonVariant;
  href?: string;
  className?: string;
  children: ReactNode;
}

type ButtonProps = BaseButtonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps> &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;

const baseClasses =
  'inline-flex items-center justify-center gap-2 rounded-full px-lg py-md min-h-11 text-label font-extrabold tracking-wide transition-colors motion-safe:transition-transform motion-safe:hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent';

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'border border-accent/40 text-foreground hover:border-accent hover:bg-accent/10',
  ghost: 'border border-line text-foreground hover:border-foreground/40',
};

export function Button({
  variant = 'primary',
  href,
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
