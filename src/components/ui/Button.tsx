import type { ButtonHTMLAttributes } from 'react';
import React from 'react';

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ className, ...props }: ButtonProps) {
  const classes = ['inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-white', className]
    .filter(Boolean)
    .join(' ');

  return <button className={classes} {...props} />;
}
