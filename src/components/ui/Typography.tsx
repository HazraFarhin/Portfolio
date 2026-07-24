import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  className?: string;
  children: ReactNode;
}

export function Label({ as: Tag = 'span', className, children, ...rest }: TypographyProps) {
  return (
    <Tag
      className={cn(
        'text-label font-normal uppercase tracking-[0.14em] text-muted-foreground',
        className
      )}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Body({ as: Tag = 'p', className, children, ...rest }: TypographyProps) {
  return (
    <Tag className={cn('text-body font-normal text-foreground', className)} {...rest}>
      {children}
    </Tag>
  );
}

export function Heading({ as: Tag = 'h2', className, children, ...rest }: TypographyProps) {
  return (
    <Tag
      className={cn('text-heading font-extrabold tracking-tight text-foreground', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function Display({ as: Tag = 'p', className, children, ...rest }: TypographyProps) {
  return (
    <Tag
      className={cn('text-display font-extrabold tracking-tight text-foreground', className)}
      {...rest}
    >
      {children}
    </Tag>
  );
}
