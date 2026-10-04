import * as React from 'react';
import { cn } from '../../lib/utils.ts';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'stealth';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 disabled:pointer-events-none disabled:opacity-40 select-none cursor-pointer tracking-tight';

    const variants = {
      default:
        'bg-white text-black font-semibold hover:bg-zinc-200 active:scale-[0.98] shadow-sm',
      destructive:
        'bg-zinc-900 text-zinc-300 border border-zinc-700 hover:bg-zinc-800 hover:text-white active:scale-[0.98]',
      outline:
        'border border-zinc-800 bg-black text-zinc-300 hover:bg-zinc-900 hover:text-white hover:border-zinc-700 active:scale-[0.98]',
      secondary:
        'bg-zinc-900 text-zinc-200 hover:bg-zinc-800 hover:text-white border border-zinc-800 active:scale-[0.98]',
      ghost:
        'text-zinc-400 hover:text-white hover:bg-zinc-900/80',
      link:
        'text-white underline-offset-4 hover:underline p-0 h-auto',
      stealth:
        'bg-zinc-900/80 text-white border border-zinc-700 hover:bg-zinc-800 active:scale-[0.98]',
    };

    const sizes = {
      default: 'h-9 px-4 py-2 text-xs sm:text-sm',
      sm: 'h-8 px-3 text-xs',
      lg: 'h-11 px-6 text-sm font-medium',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
