'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  getCitiesByPrefix,
  getStreetsByPrefix,
  validateAddress,
  parseAddressString,
} from '@/data/addresses';

export type AddressPhase = 'city' | 'street' | 'house';

export interface AddressInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
  error?: boolean;
}

export const AddressInput = React.forwardRef<HTMLInputElement, AddressInputProps>(
  ({ value, onChange, onValidationChange, error, className, ...props }, ref) => {
    const [suggestions, setSuggestions] = React.useState<string[]>([]);
    const [showDropdown, setShowDropdown] = React.useState(false);
    const [phase, setPhase] = React.useState<AddressPhase>('city');
    const [city, setCity] = React.useState('');
    const [street, setStreet] = React.useState('');
    const [highlightIndex, setHighlightIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const inputRef = React.useRef<HTMLInputElement | null>(null);

    React.useEffect(() => {
      const parts = parseAddressString(value);
      setCity(parts.city || '');
      setStreet(parts.street || '');
      if (parts.house) setPhase('house');
      else if (parts.street) setPhase('street');
      else setPhase('city');
    }, [value]);

    React.useEffect(() => {
      if (!value.trim()) {
        onValidationChange?.(true);
        return;
      }
      const parts = parseAddressString(value);
      const valid = validateAddress(parts);
      onValidationChange?.(valid);
    }, [value, onValidationChange]);

    React.useEffect(() => {
      function handleClickOutside(e: MouseEvent) {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setShowDropdown(false);
        }
      }
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const updateInput = (newVal: string) => {
      onChange(newVal);
      setShowDropdown(false);
      inputRef.current?.focus();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      onChange(raw);

      const parts = raw.split(',').map((p) => p.trim());
      const lastPart = parts[parts.length - 1] || '';

      if (parts.length <= 1) {
        setPhase('city');
        const opts = getCitiesByPrefix(lastPart);
        setSuggestions(opts);
        setShowDropdown(opts.length > 0);
        setHighlightIndex(-1);
      } else if (parts.length === 2) {
        setPhase('street');
        const cityPart = parts[0];
        const opts = getStreetsByPrefix(cityPart, lastPart);
        setSuggestions(opts);
        setShowDropdown(opts.length > 0);
        setHighlightIndex(-1);
      } else {
        setPhase('house');
        setShowDropdown(false);
      }
    };

    const handleSelect = (s: string) => {
      const parts = value.split(',').map((p) => p.trim()).filter(Boolean);
      if (phase === 'city') {
        updateInput(s + ', ');
      } else if (phase === 'street') {
        const cityPart = parts[0];
        updateInput(`${cityPart}, ${s}, `);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!showDropdown || suggestions.length === 0) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
      } else if (e.key === 'Enter' && highlightIndex >= 0 && suggestions[highlightIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightIndex]);
      }
    };

    return (
      <div ref={containerRef} className="relative">
        <input
          ref={(el) => {
            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
            if (typeof ref === 'function') ref(el);
            else if (ref) (ref as React.MutableRefObject<HTMLInputElement | null>).current = el;
          }}
          type="text"
          autoComplete="off"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            const parts = value.split(',').map((p) => p.trim());
            const last = parts[parts.length - 1] || '';
            if (parts.length <= 1) {
              const opts = getCitiesByPrefix(last);
              setSuggestions(opts);
              setShowDropdown(opts.length > 0);
            } else if (parts.length === 2) {
              const opts = getStreetsByPrefix(parts[0], last);
              setSuggestions(opts);
              setShowDropdown(opts.length > 0);
            }
          }}
          placeholder="Город, улица, дом"
          className={cn(
            'flex h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            error && 'border-red-500 focus-visible:ring-red-500',
            className
          )}
          aria-invalid={error}
          aria-autocomplete="list"
          aria-controls="address-suggestions"
          aria-expanded={showDropdown}
          {...props}
        />
        {showDropdown && suggestions.length > 0 && (
          <ul
            id="address-suggestions"
            role="listbox"
            className="absolute z-50 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
          >
            {suggestions.map((s, i) => (
              <li
                key={s}
                role="option"
                aria-selected={i === highlightIndex}
                className={cn(
                  'cursor-pointer px-3 py-2 text-sm',
                  i === highlightIndex ? 'bg-primary-50 text-primary-900' : 'text-slate-800 hover:bg-slate-50'
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(s);
                }}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
AddressInput.displayName = 'AddressInput';
