import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface CardProps {
  variant?: 'glass';
  className?: string;
  children: ReactNode;
}

export function Card({ variant = 'glass', className, children }: CardProps) {
  void variant;

  return (
    <div
      className={cn(
        'rounded-3xl border border-line bg-secondary/55 backdrop-blur-lg shadow-[0_24px_80px_rgba(0,0,0,0.5)] p-lg',
        className
      )}
    >
      {children}
    </div>
  );
}
