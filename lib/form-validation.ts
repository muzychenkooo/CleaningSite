/**
 * Centralized form validation and masking utilities.
 * Used across OrderForm, QuizWizard, and all site forms.
 */

import { z } from 'zod';
import { validateAddress, parseAddressString } from '@/data/addresses';

// ─── Constants ───
export const NAME_MAX_LENGTH = 30;
export const PHONE_DIGITS_COUNT = 11; // 7 + 10 digits
export const DATE_MIN = '2026-01-01';
export const DATE_MAX = '2100-12-31';

// ─── Cyrillic only (буквы кириллицы + запятая) ───
const CYRILLIC_COMMA_REGEX_STRICT = /^[А-Яа-яЁё,]*$/;
export function sanitizeCyrillic(
  value: string,
  options?: { allowSpaces?: boolean; allowHyphens?: boolean; allowCommas?: boolean }
): string {
  // По умолчанию: только буквы кириллицы и запятая (как в Имя, Тип услуги)
  const allowSpaces = options?.allowSpaces ?? false;
  const allowHyphens = options?.allowHyphens ?? false;
  const allowCommas = options?.allowCommas ?? true;
  return value
    .split('')
    .filter((c) => {
      if (/[А-Яа-яЁё]/.test(c)) return true;
      if (allowSpaces && c === ' ') return true;
      if (allowHyphens && c === '-') return true;
      if (allowCommas && c === ',') return true;
      return false;
    })
    .join('');
}

export function isValidCyrillicName(value: string): boolean {
  return CYRILLIC_COMMA_REGEX_STRICT.test(value) && value.length >= 2 && value.length <= NAME_MAX_LENGTH;
}

// ─── Phone mask (RU +7) ───
const PHONE_PREFIX = '+7';
export function formatPhoneDisplay(digits: string): string {
  const d = digits.replace(/\D/g, '');
  if (!d || d === '7') return PHONE_PREFIX;
  const normalized = d.startsWith('7') ? d : '7' + d;
  const rest = normalized.slice(1);
  if (rest.length <= 3) return `${PHONE_PREFIX} (${rest}`;
  if (rest.length <= 6) return `${PHONE_PREFIX} (${rest.slice(0, 3)}) ${rest.slice(3)}`;
  if (rest.length <= 8) return `${PHONE_PREFIX} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6)}`;
  return `${PHONE_PREFIX} (${rest.slice(0, 3)}) ${rest.slice(3, 6)}-${rest.slice(6, 8)}-${rest.slice(8, 10)}`;
}

export function parsePhoneToDigits(value: string): string {
  return value.replace(/\D/g, '').replace(/^8/, '7').replace(/^7?/, '7').slice(0, 11);
}

export function isPhoneValid(digits: string): boolean {
  return digits.length === PHONE_DIGITS_COUNT && digits.startsWith('7');
}

// ─── Error messages (unified) ───
export const FORM_MESSAGES = {
  nameRequired: 'Введите свое имя',
  fillField: (label: string) => `Заполните поле ${label}`,
  addressInvalid: 'Такого адреса не существует',
  dateInvalid: 'Укажите корректную дату',
  timeInvalid: 'Укажите корректное время',
  phoneInvalid: 'Введите корректный номер телефона',
} as const;

// ─── Zod schemas ───
export const nameSchema = z
  .string()
  .min(1, FORM_MESSAGES.nameRequired)
  .max(NAME_MAX_LENGTH, `Максимум ${NAME_MAX_LENGTH} символов`)
  .refine((v) => isValidCyrillicName(v), FORM_MESSAGES.nameRequired);

export const phoneSchema = z
  .string()
  .refine((v) => {
    const d = parsePhoneToDigits(v);
    if (d.length <= 1) return false;
    return isPhoneValid(d);
  }, (v) => {
    const d = parsePhoneToDigits(v);
    if (d.length <= 1) return { message: FORM_MESSAGES.fillField('телефон') };
    return { message: FORM_MESSAGES.phoneInvalid };
  });

export const serviceTypeSchema = z
  .string()
  .optional()
  .refine((v) => !v || v.trim().length === 0 || CYRILLIC_COMMA_REGEX_STRICT.test(v), 'Допустимы только кириллица и запятая')
  .transform((v) => v?.trim() || undefined);

export const dateSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v || v.trim() === '') return true;
      const d = new Date(v);
      const y = d.getFullYear();
      return !isNaN(d.getTime()) && y >= 2026 && y <= 2100;
    },
    { message: FORM_MESSAGES.dateInvalid }
  );

const ALLOWED_MINUTES = [0, 10, 20, 30, 40, 50];
export const timeSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v || v.trim() === '') return true;
      const [h, m] = v.split(':').map(Number);
      return h >= 0 && h <= 23 && !isNaN(m) && ALLOWED_MINUTES.includes(m);
    },
    { message: FORM_MESSAGES.timeInvalid }
  );

// ─── Address validation (optional; if filled must be valid) ───
export const addressSchema = z
  .string()
  .optional()
  .refine(
    (v) => {
      if (!v || v.trim() === '') return true;
      const parts = parseAddressString(v);
      return validateAddress(parts);
    },
    { message: FORM_MESSAGES.addressInvalid }
  );

// ─── Order form schema ───
export const orderFormSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  address: addressSchema,
  date: dateSchema,
  time: timeSchema,
  serviceType: serviceTypeSchema,
  honeypot: z.string().max(0).optional(),
});

export type OrderFormData = z.infer<typeof orderFormSchema>;
