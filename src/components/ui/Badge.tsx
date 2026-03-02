import type { HTMLAttributes } from 'react';
import React from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export default function Badge({ className, ...props }: BadgeProps) {
  const classes = ['inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground', className]
    .filter(Boolean)
    .join(' ');

  return <span className={classes} {...props} />;
}
