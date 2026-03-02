import * as React from 'react';
import { cn } from '@/lib/utils';

type CardProps = React.HTMLAttributes<HTMLDivElement>;

const Card = React.forwardRef<HTMLDivElement, CardProps>(function Card(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-sm', className)}
      {...props}
    />
  );
});

const CardHeader = React.forwardRef<HTMLDivElement, CardProps>(function CardHeader(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />;
});

const CardContent = React.forwardRef<HTMLDivElement, CardProps>(function CardContent(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />;
});

const CardFooter = React.forwardRef<HTMLDivElement, CardProps>(function CardFooter(
  { className, ...props },
  ref
) {
  return <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />;
});

export { Card as default, CardHeader, CardContent, CardFooter };
