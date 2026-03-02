import * as React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', type = 'button', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const variants: Record<ButtonProps['variant'], string> = {
      primary: 'bg-black text-white hover:bg-black/90 focus:ring-black',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-300',
      ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 focus:ring-gray-300'
    };

    return (
      <button ref={ref} type={type} className={cn(baseStyles, variants[variant], className)} {...props} />
    );
  }
);

Button.displayName = 'Button';

export default Button;
