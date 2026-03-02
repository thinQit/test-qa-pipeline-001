import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = ({ className, ...props }: CardProps) => (
  <div
    className={cn('rounded-lg border border-border bg-background shadow-sm', className)}
    {...props}
  />
);

export const CardHeader = ({ className, ...props }: CardProps) => (
  <div className={cn('border-b border-border px-6 py-4', className)} {...props} />
);

export const CardContent = ({ className, ...props }: CardProps) => (
  <div className={cn('px-6 py-4', className)} {...props} />
);

export const CardFooter = ({ className, ...props }: CardProps) => (
  <div className={cn('border-t border-border px-6 py-4', className)} {...props} />
);

export default Card;
