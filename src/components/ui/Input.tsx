'use client';

import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label ? (
          <label htmlFor={id} className="block text-sm font-medium text-gray-300">
            {label}
          </label>
        ) : null}
        <input
          ref={ref}
          id={id}
          className={cn(
            'block w-full rounded-lg border bg-gray-900/50 px-3 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            error
              ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30'
              : 'border-gray-700 focus:border-amber-500/50 focus:ring-amber-500/20',
            className
          )}
          {...props}
        />
        {error ? <p className="text-xs text-red-400">{error}</p> : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
export { Input };
