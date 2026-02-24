'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { formatPhoneDisplay, parsePhoneToDigits } from '@/lib/form-validation';

export interface PhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, error, className, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    const digits = React.useMemo(() => parsePhoneToDigits(value || ''), [value]);
    const displayValue = React.useMemo(() => {
      if (!digits || digits === '7') return '+7';
      return formatPhoneDisplay(digits);
    }, [digits]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      const newDigits = raw.replace(/\D/g, '');
      if (newDigits.length === 0) {
        onChange('+7');
        return;
      }
      const normalized = newDigits.startsWith('8') ? '7' + newDigits.slice(1) : newDigits.startsWith('7') ? newDigits : '7' + newDigits;
      onChange(formatPhoneDisplay(normalized.slice(0, 11)));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && displayValue === '+7') e.preventDefault();
    };

    return (
      <input
        ref={(el) => {
          (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
          if (typeof ref === 'function') ref(el);
          else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
        }}
        type="tel"
        autoComplete="tel"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="+7 (___) ___-__-__"
        className={cn(
          'flex h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';
