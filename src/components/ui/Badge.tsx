import * as React from 'react';
import { cn } from '@/lib/utils';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    className={cn(
      'inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground',
      className
    )}
    {...props}
  />
));

Badge.displayName = 'Badge';

export default Badge;
