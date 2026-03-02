import type { InputHTMLAttributes } from 'react';
import React from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export default function Input({ className, ...props }: InputProps) {
  const classes = ['w-full rounded-md border border-border px-3 py-2 text-sm', className]
    .filter(Boolean)
    .join(' ');

  return <input className={classes} {...props} />;
}
