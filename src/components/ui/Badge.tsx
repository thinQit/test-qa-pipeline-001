import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'secondary';
};

const Badge = ({ className, variant = 'default', ...props }: BadgeProps) => {
  const variantClasses =
    variant === 'secondary'
      ? 'bg-secondary text-secondary-foreground'
      : 'bg-primary text-primary-foreground';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variantClasses,
        className
      )}
      {...props}
    />
  );
};

export default Badge;
