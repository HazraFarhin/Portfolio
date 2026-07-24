import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// tailwind-merge's default `font-size` class group only recognizes stock
// Tailwind scale keys (xs, sm, base, lg, ...). This project declares custom
// font-size tokens in the `@theme` block (--text-label, --text-body,
// --text-heading, --text-display), which twMerge otherwise misclassifies as
// conflicting with `text-{color}` utilities and silently drops. Registering
// them under `font-size` keeps them from being stripped when merged with
// text-color classes (e.g. `text-label ... text-muted-foreground`).
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': ['text-label', 'text-body', 'text-heading', 'text-display'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
