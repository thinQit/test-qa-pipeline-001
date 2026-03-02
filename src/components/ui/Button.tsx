import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost';
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', type = 'button', ...props }, ref) => {
    const variantClasses =
      variant === 'secondary'
        ? 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
        : variant === 'ghost'
        ? 'bg-transparent hover:bg-secondary/20'
        : 'bg-primary text-primary-foreground hover:bg-primary/90';

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50',
          variantClasses,
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export default Button;
