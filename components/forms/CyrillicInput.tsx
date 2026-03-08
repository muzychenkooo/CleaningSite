'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { sanitizeCyrillic } from '@/lib/form-validation';

export interface CyrillicInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  maxLength?: number;
  error?: boolean;
  /** Allow commas (e.g. for "Тип услуги", Q7 Другое) */
  allowCommas?: boolean;
  /** Allow spaces (e.g. Q7 Другое: "только текст" — буквы, пробелы, запятые) */
  allowSpaces?: boolean;
}

export const CyrillicInput = React.forwardRef<HTMLInputElement, CyrillicInputProps>(
  ({ value, onChange, maxLength = 30, error, allowCommas = false, allowSpaces = false, className, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeCyrillic(e.target.value, { allowCommas, allowSpaces }).slice(0, maxLength);
      onChange(sanitized);
    };

    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={handleChange}
        maxLength={maxLength}
        className={cn(error && 'border-red-500', className)}
        aria-invalid={error}
        {...props}
      />
    );
  }
);
CyrillicInput.displayName = 'CyrillicInput';
