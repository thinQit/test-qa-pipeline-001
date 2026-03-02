import type { HTMLAttributes } from 'react';
import React from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

type CardSectionProps = HTMLAttributes<HTMLDivElement>;

export default function Card({ className, ...props }: CardProps) {
  const classes = ['rounded-lg border border-border bg-white shadow-sm', className]
    .filter(Boolean)
    .join(' ');

  return <div className={classes} {...props} />;
}

export function CardHeader({ className, ...props }: CardSectionProps) {
  const classes = ['border-b border-border px-6 py-4', className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

export function CardContent({ className, ...props }: CardSectionProps) {
  const classes = ['px-6 py-4', className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}

export function CardFooter({ className, ...props }: CardSectionProps) {
  const classes = ['border-t border-border px-6 py-4', className].filter(Boolean).join(' ');
  return <div className={classes} {...props} />;
}
