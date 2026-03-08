'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CALCULATOR_PLACE_OPTIONS,
  CALCULATOR_STEPS,
  CALCULATOR_BRANCH_STEP_IDS,
  BATHROOMS_SURCHARGE,
  getApartmentHouseStepIds,
  type CalculatorBranchId,
  type CalculatorPrimaryPlaceValue,
  type CalculatorStepId,
  type ChoiceStepConfig,
  type MultiStepConfig,
} from '@/data/detailed-calculator';
import { calculateDetailedPrice } from '@/lib/detailed-calculator-pricing';
import { quizContactsSchema } from '@/lib/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { CyrillicInput } from '@/components/forms/CyrillicInput';
import { cn } from '@/lib/utils';
import { FORM_MESSAGES } from '@/lib/form-validation';

const MAX_PLACE_OTHER_LENGTH = 80;
const MAX_SERVICE_TYPE_OTHER_LENGTH = 80;
const MAX_EXTRAS_OTHER_LENGTH = 80;

/** Cyrillic only, no digits, no punctuation (for Q1/Q2 "Другое") */
function sanitizeCyrillicOnly(value: string): string {
  return value.replace(/[^А-Яа-яЁё\s]/g, '');
}

/** Cyrillic + spaces + commas (for Q7 "Другое") */
function sanitizeCyrillicCommaSpaces(value: string): string {
  return value.replace(/[^А-Яа-яЁё\s,]/g, '');
}

function filterNumeric(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

function placeToBranch(place: CalculatorPrimaryPlaceValue): CalculatorBranchId {
  if (place === 'apartment' || place === 'house') return 'apartment_house';
  if (place === 'non_residential') return 'non_residential';
  if (place === 'windows_facade') return 'windows_facade';
  return 'custom';
}

type ContactsForm = { name: string; phone: string; consent: boolean; website?: string };

const IMAGE_MIME_REGEX = /^image\/(jpeg|png|gif|webp|bmp)/i;
const MAX_PHOTO_FILES = 5;
const MAX_PHOTO_TOTAL_BYTES = 10 * 1024 * 1024;

export function DetailedCalculator() {
  const [place, setPlace] = React.useState<CalculatorPrimaryPlaceValue | null>(null);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitStartTime] = React.useState(() => Date.now());

  /** On first screen: which option is selected (so we can show "Другое" input without leaving screen) */
  const [firstScreenSelection, setFirstScreenSelection] = React.useState<CalculatorPrimaryPlaceValue | null>(null);
  const [customPlaceText, setCustomPlaceText] = React.useState('');
  const [placeOtherError, setPlaceOtherError] = React.useState<string | null>(null);

  // ─── Branch-specific state (extras must be above useMemo that uses it) ───
  const [serviceType, setServiceType] = React.useState<string>('');
  const [customTypeText, setCustomTypeText] = React.useState('');
  const [areaStr, setAreaStr] = React.useState('');
  const [nonresAreaStr, setNonresAreaStr] = React.useState('');
  const [bathroomsValue, setBathroomsValue] = React.useState<string>('1');
  const [extras, setExtras] = React.useState<Record<string, boolean>>({});
  const [extrasOtherText, setExtrasOtherText] = React.useState('');
  const [windowsCountStr, setWindowsCountStr] = React.useState('');
  const [ozoneAreaStr, setOzoneAreaStr] = React.useState('');
  const [windowsFacadeChoice, setWindowsFacadeChoice] = React.useState('');
  const [windowsFacadeAreaStr, setWindowsFacadeAreaStr] = React.useState('');
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([]);
  const [photoError, setPhotoError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [stepError, setStepError] = React.useState<string | null>(null);

  const branch: CalculatorBranchId | null = place ? placeToBranch(place) : null;
  const branchStepIds = React.useMemo(() => {
    if (!branch) return [];
    if (branch === 'apartment_house') return getApartmentHouseStepIds(extras);
    return CALCULATOR_BRANCH_STEP_IDS[branch];
  }, [branch, extras]);
  const totalBranchSteps = branchStepIds.length;
  const currentStepId: CalculatorStepId | null =
    branch && stepIndex < branchStepIds.length ? branchStepIds[stepIndex]! : null;
  const stepConfig = currentStepId ? CALCULATOR_STEPS[currentStepId] : null;

  const isFirstBranchStep = stepIndex === 0;
  const isContactsStep = currentStepId === 'contacts';

  const progressPercent =
    totalBranchSteps <= 1 ? 100 : Math.round((stepIndex / (totalBranchSteps - 1)) * 100);

  const contactsForm = useForm<ContactsForm>({
    resolver: zodResolver(quizContactsSchema),
    defaultValues: {
      name: '',
      phone: '+7',
      consent: false,
      website: '',
    },
  });

  const goBack = React.useCallback(() => {
    if (stepIndex > 0) {
      setStepIndex((i) => i - 1);
      setStepError(null);
      setPhotoError(null);
    } else {
      setPlace(null);
      setStepIndex(0);
      setStepError(null);
      setPlaceOtherError(null);
      setPhotoError(null);
    }
  }, [stepIndex]);

  const goNext = React.useCallback(() => {
    if (stepIndex < totalBranchSteps - 1) {
      setStepIndex((i) => i + 1);
      setStepError(null);
      setPhotoError(null);
    }
  }, [stepIndex, totalBranchSteps]);

  const onSubmitContacts = (data: ContactsForm) => {
    const elapsed = Date.now() - submitStartTime;
    if (elapsed < 2000) return;
    if (data.website) return;
    setSubmitted(true);
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (a: string, b: string, c?: object) => void }).gtag?.('event', 'calculator_submit', {});
    }
  };

  // Reset branch state when place changes (e.g. user goes back to Q1 and picks another option)
  const setPlaceAndReset = React.useCallback((p: CalculatorPrimaryPlaceValue | null) => {
    setPlace(p);
    setStepIndex(0);
    setStepError(null);
    setPlaceOtherError(null);
    setServiceType('');
    setCustomTypeText('');
    setAreaStr('');
    setNonresAreaStr('');
    setBathroomsValue('1');
    setExtras({});
    setExtrasOtherText('');
    setWindowsCountStr('');
    setOzoneAreaStr('');
    setWindowsFacadeChoice('');
    setWindowsFacadeAreaStr('');
    setPhotoFiles([]);
    setPhotoError(null);
  }, []);

  if (submitted) {
    return (
      <div
        className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 text-center"
        role="status"
        aria-live="polite"
      >
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-6" aria-hidden>
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-display text-xl font-semibold text-slate-900">Заявка отправлена</h3>
        <p className="mt-2 text-slate-600">Менеджер свяжется с вами в ближайшее время для уточнения деталей и расчёта стоимости.</p>
      </div>
    );
  }

  // ─── First screen: Q1 — Где нужно провести клининг? ───
  if (!branch) {
    const isOtherSelected = firstScreenSelection === 'custom';
    const selection = place ?? firstScreenSelection;
    return (
      <div
        className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden"
        style={{ minHeight: '420px' }}
      >
        <div className="p-6 sm:p-8">
          <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
            Где нужно провести клининг?
          </h3>
          <p className="mt-1 text-slate-600">Выберите тип объекта</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {CALCULATOR_PLACE_OPTIONS.map((opt) => {
              const selected = selection === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    if (opt.value === 'custom') {
                      setFirstScreenSelection('custom');
                      setPlaceOtherError(null);
                    } else {
                      setPlaceAndReset(opt.value);
                      setFirstScreenSelection(null);
                      setPlaceOtherError(null);
                    }
                  }}
                  className={cn(
                    'flex flex-col items-start rounded-xl border-2 px-4 py-4 text-left text-sm font-medium transition-all',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                    selected
                      ? 'border-primary-500 bg-primary-50 text-primary-800'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300'
                  )}
                >
                  <span className="font-semibold">{opt.label}</span>
                  {opt.description && <span className="mt-1 text-xs text-slate-500">{opt.description}</span>}
                </button>
              );
            })}
          </div>
          {isOtherSelected && (
            <div className="mt-6">
              <Label htmlFor="place-other" className="text-slate-700">Опишите кратко</Label>
              <CyrillicInput
                id="place-other"
                value={customPlaceText}
                onChange={(v) => {
                  setCustomPlaceText(sanitizeCyrillicOnly(v).slice(0, MAX_PLACE_OTHER_LENGTH));
                  setPlaceOtherError(null);
                }}
                maxLength={MAX_PLACE_OTHER_LENGTH}
                placeholder="Например: несколько помещений"
                className={cn('mt-2', placeOtherError && 'border-red-500')}
                error={!!placeOtherError}
              />
              {placeOtherError && <p className="mt-1 text-sm text-red-600" role="alert">{placeOtherError}</p>}
              <Button
                type="button"
                size="lg"
                className="mt-4 rounded-xl"
                onClick={() => {
                  setPlaceOtherError(null);
                  setPlace('custom');
                  setStepIndex(0);
                  setFirstScreenSelection(null);
                }}
              >
                Далее
              </Button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Custom branch: only contacts (no steps in between) ───
  if (branch === 'custom' && currentStepId === 'contacts') {
    const stepConfigContacts = CALCULATOR_STEPS.contacts;
    return (
      <div
        className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden"
        style={{ minHeight: '420px' }}
      >
        <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 sm:px-8">
          <Button type="button" variant="ghost" size="sm" onClick={goBack} className="text-slate-600 -ml-2">
            Назад
          </Button>
          <p className="text-sm font-medium text-slate-500">Шаг 1 из 1</p>
        </div>
        <div className="p-6 sm:p-8 min-h-[380px] overflow-y-auto">
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfigContacts.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfigContacts.subtitle}</p>
          <form onSubmit={contactsForm.handleSubmit(onSubmitContacts)} className="mt-6 space-y-4">
            <input type="text" tabIndex={-1} autoComplete="off" className="absolute opacity-0 w-0 h-0" aria-hidden {...contactsForm.register('website')} />
            <div>
              <Label htmlFor="calc-name" className="text-slate-700">Имя *</Label>
              <Controller
                name="name"
                control={contactsForm.control}
                render={({ field }) => (
                  <CyrillicInput
                    id="calc-name"
                    className="mt-2 rounded-lg"
                    placeholder="Как к вам обращаться?"
                    value={field.value ?? ''}
                    onChange={(v) => field.onChange(v)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={!!contactsForm.formState.errors.name}
                  />
                )}
              />
              {contactsForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">{contactsForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="calc-phone" className="text-slate-700">Телефон *</Label>
              <Controller
                name="phone"
                control={contactsForm.control}
                render={({ field }) => (
                  <PhoneInput
                    id="calc-phone"
                    className="mt-2 rounded-lg"
                    value={field.value ?? '+7'}
                    onChange={(v) => field.onChange(v)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={!!contactsForm.formState.errors.phone}
                  />
                )}
              />
              {contactsForm.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600" role="alert">{contactsForm.formState.errors.phone.message}</p>
              )}
            </div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600"
                {...contactsForm.register('consent')}
              />
              <span className="text-sm text-slate-600">
                Даю согласие на обработку персональных данных.{' '}
                <a href="/legal/" className="font-semibold text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Политика конфиденциальности
                </a>
              </span>
            </label>
            {contactsForm.formState.errors.consent && (
              <p className="text-sm text-red-600" role="alert">{contactsForm.formState.errors.consent.message}</p>
            )}
            <Button type="submit" size="lg" className="w-full rounded-xl mt-4">
              Получить расчёт
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // ─── Branch steps ───
  const renderStepContent = () => {
    if (!stepConfig || !currentStepId) return null;

    // ─── Q2: Какую уборку хотите? (#2 tariff) ───
    if (currentStepId === 'service_type' && stepConfig.kind === 'choice') {
      const cfg = stepConfig as ChoiceStepConfig;
      const isCustomSelected = serviceType === 'custom';
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{cfg.title}</h3>
          <p className="mt-1 text-slate-600">{cfg.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {cfg.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setServiceType(o.value);
                  setStepError(null);
                  if (o.value !== 'custom') goNext();
                }}
                className={cn(
                  'rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                  serviceType === o.value ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          {isCustomSelected && (
            <div className="mt-4">
              <Label htmlFor="service-other" className="text-slate-700">Уточните вариант</Label>
              <CyrillicInput
                id="service-other"
                value={customTypeText}
                onChange={(v) => {
                  setCustomTypeText(sanitizeCyrillicOnly(v).slice(0, MAX_SERVICE_TYPE_OTHER_LENGTH));
                  setStepError(null);
                }}
                maxLength={MAX_SERVICE_TYPE_OTHER_LENGTH}
                allowCommas={false}
                className={cn('mt-2', stepError && 'border-red-500')}
                error={!!stepError}
              />
              {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
              <Button
                type="button"
                size="lg"
                className="mt-4 rounded-xl"
                onClick={() => {
                  setStepError(null);
                  goNext();
                }}
              >
                Далее
              </Button>
            </div>
          )}
        </>
      );
    }

    // ─── Q3: Площадь остекления / фасада ───
    if (currentStepId === 'windows_facade_area' && stepConfig.kind === 'choice') {
      const cfg = stepConfig as ChoiceStepConfig;
      const needInput = windowsFacadeChoice === 'input';
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{cfg.title}</h3>
          <p className="mt-1 text-slate-600">{cfg.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {cfg.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setWindowsFacadeChoice(o.value);
                  setStepError(null);
                  if (o.value !== 'input') goNext();
                }}
                className={cn(
                  'rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all',
                  windowsFacadeChoice === o.value ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
          {needInput && (
            <div className="mt-4 flex items-center gap-2">
              <Input
                type="text"
                inputMode="numeric"
                value={windowsFacadeAreaStr}
                onChange={(e) => {
                  setWindowsFacadeAreaStr(filterNumeric(e.target.value).slice(0, 5));
                  setStepError(null);
                }}
                className={cn('max-w-[120px]', stepError && 'border-red-500')}
                placeholder="м²"
              />
              <span className="text-slate-500 text-sm">м²</span>
              <Button
                type="button"
                size="lg"
                className="rounded-xl"
                onClick={() => {
                  const n = windowsFacadeAreaStr.trim() ? parseInt(windowsFacadeAreaStr, 10) : 0;
                  if (needInput && n < 0) {
                    setStepError(FORM_MESSAGES.fillField('Площадь остекления'));
                    return;
                  }
                  setStepError(null);
                  goNext();
                }}
              >
                Далее
              </Button>
            </div>
          )}
          {needInput && stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
        </>
      );
    }

    // ─── Q4: Площадь квартиры/дома (#4) ───
    if (currentStepId === 'area' && stepConfig.kind === 'numeric') {
      const min = stepConfig.min ?? 0;
      const max = stepConfig.max ?? 999999;
      const maxLen = stepConfig.maxLength ?? 6;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              value={areaStr}
              onChange={(e) => {
                setAreaStr(filterNumeric(e.target.value).slice(0, maxLen));
                setStepError(null);
              }}
              className={cn('max-w-[140px]', stepError && 'border-red-500')}
              placeholder="м²"
            />
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
          <Button
            type="button"
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() => {
              const n = areaStr.trim() ? parseInt(areaStr, 10) : NaN;
              if (isNaN(n) || n < min || n > max) {
                setStepError(FORM_MESSAGES.fillField('Площадь'));
                return;
              }
              setStepError(null);
              goNext();
            }}
          >
            Далее
          </Button>
        </>
      );
    }

    // ─── Q5: Площадь нежилого помещения ───
    if (currentStepId === 'nonres_area' && stepConfig.kind === 'numeric') {
      const min = stepConfig.min ?? 0;
      const max = stepConfig.max ?? 999999;
      const maxLen = stepConfig.maxLength ?? 6;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              value={nonresAreaStr}
              onChange={(e) => {
                setNonresAreaStr(filterNumeric(e.target.value).slice(0, maxLen));
                setStepError(null);
              }}
              className={cn('max-w-[140px]', stepError && 'border-red-500')}
              placeholder="м²"
            />
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
          <Button
            type="button"
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() => {
              const n = nonresAreaStr.trim() ? parseInt(nonresAreaStr, 10) : NaN;
              if (isNaN(n) || n < min || n > max) {
                setStepError(FORM_MESSAGES.fillField('Площадь помещения'));
                return;
              }
              setStepError(null);
              goNext();
            }}
          >
            Далее
          </Button>
        </>
      );
    }

    // ─── Q6: Количество санузлов (#6) ───
    if (currentStepId === 'bathrooms' && stepConfig.kind === 'choice') {
      const cfg = stepConfig as ChoiceStepConfig;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{cfg.title}</h3>
          <p className="mt-1 text-slate-600">{cfg.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {cfg.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setBathroomsValue(o.value);
                  goNext();
                }}
                className={cn(
                  'rounded-xl border-2 px-5 py-3 text-sm font-medium transition-all',
                  bathroomsValue === o.value ? 'border-primary-500 bg-primary-50 text-primary-800' : 'border-slate-200 hover:border-slate-300'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      );
    }

    // ─── Q7: Понадобится ли что-то еще? (#7 sum, triggers Q8/Q9/Q10) ───
    if (currentStepId === 'extras' && stepConfig.kind === 'multi') {
      const cfg = stepConfig as MultiStepConfig;
      const isOtherChecked = extras['other'] ?? false;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{cfg.title}</h3>
          <p className="mt-1 text-slate-600">{cfg.subtitle}</p>
          <div className="mt-6 space-y-3 max-h-[320px] overflow-y-auto">
            {cfg.options.map((opt) => (
              <div key={opt.key} className="flex flex-col gap-2">
                <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 hover:bg-slate-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/50">
                  <input
                    type="checkbox"
                    checked={extras[opt.key] ?? false}
                    onChange={(e) => setExtras((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                    className="h-4 w-4 rounded border-slate-300 text-primary-600"
                  />
                  <span className="font-medium text-slate-800">{opt.label}</span>
                </label>
                {opt.hasCustomInput && (extras[opt.key] ?? false) && (
                  <div className="pl-7">
                    <CyrillicInput
                      value={extrasOtherText}
                      onChange={(v) => setExtrasOtherText(sanitizeCyrillicCommaSpaces(v).slice(0, MAX_EXTRAS_OTHER_LENGTH))}
                      maxLength={MAX_EXTRAS_OTHER_LENGTH}
                      allowCommas={true}
                      allowSpaces={true}
                      placeholder="Только текст (буквы, пробелы, запятые)"
                      className={cn('mt-1', stepError && 'border-red-500')}
                      error={!!stepError}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
          {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
          <Button type="button" size="lg" className="mt-6 rounded-xl" onClick={goNext}>
            Далее
          </Button>
        </>
      );
    }

    // ─── Q8: Сколько окон (#8) — stepper step 1 ───
    if (currentStepId === 'windows_count' && stepConfig.kind === 'numeric') {
      const min = stepConfig.min ?? 0;
      const max = stepConfig.max ?? 999;
      const step = stepConfig.stepperStep ?? 1;
      const num = windowsCountStr.trim() ? parseInt(windowsCountStr, 10) : 0;
      const validNum = isNaN(num) ? min : Math.max(min, Math.min(max, num));
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = Math.max(min, validNum - step);
                setWindowsCountStr(String(next));
                setStepError(null);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Уменьшить"
            >
              −
            </button>
            <Input
              type="text"
              inputMode="numeric"
              value={windowsCountStr}
              onChange={(e) => {
                setWindowsCountStr(filterNumeric(e.target.value).slice(0, 3));
                setStepError(null);
              }}
              className={cn('w-24 text-center', stepError && 'border-red-500')}
            />
            <button
              type="button"
              onClick={() => {
                const next = Math.min(max, validNum + step);
                setWindowsCountStr(String(next));
                setStepError(null);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Увеличить"
            >
              +
            </button>
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
          <Button
            type="button"
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() => {
              const n = windowsCountStr.trim() ? parseInt(windowsCountStr, 10) : NaN;
              if (isNaN(n) || n < min) {
                setStepError(FORM_MESSAGES.fillField('Количество окон'));
                return;
              }
              setStepError(null);
              goNext();
            }}
          >
            Далее
          </Button>
        </>
      );
    }

    // ─── Q9: Фото для химчистки ───
    if (currentStepId === 'photo_upload' && stepConfig.kind === 'file_upload') {
      const cfg = stepConfig;

      const processFiles = (files: FileList | null) => {
        if (!files?.length) return;
        setPhotoError(null);
        const list = Array.from(files);
        const images: File[] = [];
        let totalBytes = 0;
        const allowed = list.filter((f) => {
          if (!IMAGE_MIME_REGEX.test(f.type)) return false;
          if (images.length >= MAX_PHOTO_FILES) return false;
          if (totalBytes + f.size > MAX_PHOTO_TOTAL_BYTES) return false;
          images.push(f);
          totalBytes += f.size;
          return true;
        });
        const rejected = list.length - images.length;
        if (rejected > 0) {
          setPhotoError(
            `Загружено только ${images.length} из ${list.length} файлов. До 5 фото, общий размер до 10 МБ. Не изображения или лишние файлы не добавлены.`
          );
        }
        setPhotoFiles((prev) => {
          const combined = [...prev, ...images];
          const out: File[] = [];
          let size = 0;
          for (const f of combined) {
            if (out.length >= MAX_PHOTO_FILES) break;
            if (size + f.size > MAX_PHOTO_TOTAL_BYTES) break;
            out.push(f);
            size += f.size;
          }
          if (combined.length > out.length) setPhotoError('До 5 фото, общий размер до 10 МБ. Часть файлов не добавлена.');
          return out;
        });
      };

      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{cfg.title}</h3>
          <p className="mt-1 text-slate-600">{cfg.subtitle}</p>
          <p className="mt-2 text-sm text-slate-500">{cfg.helperText}</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="absolute opacity-0 w-0 h-0"
            onChange={(e) => {
              processFiles(e.target.files);
              e.target.value = '';
            }}
            aria-hidden
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 flex h-24 w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-500 hover:border-primary-400 hover:bg-primary-50/50 hover:text-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <span className="text-2xl font-light">+</span>
          </button>
          {photoFiles.length > 0 && (
            <p className="mt-2 text-sm text-slate-600">
              Выбрано файлов: {photoFiles.length}, размер: {(photoFiles.reduce((a, f) => a + f.size, 0) / (1024 * 1024)).toFixed(2)} МБ
            </p>
          )}
          {photoError && <p className="mt-1 text-sm text-red-600" role="alert">{photoError}</p>}
          <Button type="button" size="lg" className="mt-4 rounded-xl" onClick={goNext}>
            Далее
          </Button>
        </>
      );
    }

    // ─── Q10: Площадь озонирования (#10) — stepper step 5 ───
    if (currentStepId === 'ozone_area' && stepConfig.kind === 'numeric') {
      const min = stepConfig.min ?? 0;
      const max = stepConfig.max ?? 999;
      const step = stepConfig.stepperStep ?? 5;
      const num = ozoneAreaStr.trim() ? parseInt(ozoneAreaStr, 10) : 0;
      const validNum = isNaN(num) ? min : Math.max(min, Math.min(max, num));
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const next = Math.max(min, validNum - step);
                setOzoneAreaStr(String(next));
                setStepError(null);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Уменьшить"
            >
              −
            </button>
            <Input
              type="text"
              inputMode="numeric"
              value={ozoneAreaStr}
              onChange={(e) => {
                setOzoneAreaStr(filterNumeric(e.target.value).slice(0, 3));
                setStepError(null);
              }}
              className={cn('w-24 text-center', stepError && 'border-red-500')}
            />
            <button
              type="button"
              onClick={() => {
                const next = Math.min(max, validNum + step);
                setOzoneAreaStr(String(next));
                setStepError(null);
              }}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-slate-300 bg-white text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              aria-label="Увеличить"
            >
              +
            </button>
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
          <Button
            type="button"
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() => {
              const n = ozoneAreaStr.trim() ? parseInt(ozoneAreaStr, 10) : NaN;
              if (isNaN(n) || n < min) {
                setStepError(FORM_MESSAGES.fillField('Площадь озонирования'));
                return;
              }
              setStepError(null);
              goNext();
            }}
          >
            Далее
          </Button>
        </>
      );
    }

    // ─── Contacts (final step) — preserve UI, inject formula price for apartment_house ───
    if (currentStepId === 'contacts' && stepConfig.kind === 'contacts') {
      let calculatedPrice: number | null = null;
      if (branch === 'apartment_house') {
        const tariff =
          serviceType === 'after_repair' ? 250
            : serviceType === 'general' ? 220
            : serviceType === 'support' ? 180
            : serviceType === 'custom' ? 150
            : 0;
        const areaM2 = areaStr.trim() ? parseInt(areaStr, 10) : 0;
        const bathroomsCost = BATHROOMS_SURCHARGE[bathroomsValue] ?? 0;
        const extrasCfg = CALCULATOR_STEPS.extras as MultiStepConfig;
        let extrasCost = 0;
        for (const opt of extrasCfg.options) {
          if (opt.price != null && (extras[opt.key] ?? false)) extrasCost += opt.price;
        }
        const windowsCount = windowsCountStr.trim() ? parseInt(windowsCountStr, 10) : 0;
        const ozoneArea = ozoneAreaStr.trim() ? parseInt(ozoneAreaStr, 10) : 0;
        if (tariff > 0 && areaM2 >= 0) {
          calculatedPrice = calculateDetailedPrice({
            tariffPerM2: tariff,
            areaM2,
            bathroomsCost,
            extrasCost,
            windowsCount,
            ozoneArea,
          });
        }
      }

      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>

          {branch === 'apartment_house' && calculatedPrice != null && calculatedPrice > 0 && (
            <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/50 p-4 space-y-2">
              <p className="font-semibold text-primary-900">Предварительный расчёт стоимости</p>
              <p className="font-semibold text-slate-900 pt-2">
                Итого: {calculatedPrice.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          )}

          <form onSubmit={contactsForm.handleSubmit(onSubmitContacts)} className="mt-6 space-y-4">
            <input type="text" tabIndex={-1} autoComplete="off" className="absolute opacity-0 w-0 h-0" aria-hidden {...contactsForm.register('website')} />
            <div>
              <Label htmlFor="calc-name" className="text-slate-700">Имя *</Label>
              <Controller
                name="name"
                control={contactsForm.control}
                render={({ field }) => (
                  <CyrillicInput
                    id="calc-name"
                    className="mt-2 rounded-lg"
                    placeholder="Как к вам обращаться?"
                    value={field.value ?? ''}
                    onChange={(v) => field.onChange(v)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={!!contactsForm.formState.errors.name}
                  />
                )}
              />
              {contactsForm.formState.errors.name && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {contactsForm.formState.errors.name.message}
                </p>
              )}
            </div>
            <div>
              <Label htmlFor="calc-phone" className="text-slate-700">Телефон *</Label>
              <Controller
                name="phone"
                control={contactsForm.control}
                render={({ field }) => (
                  <PhoneInput
                    id="calc-phone"
                    className="mt-2 rounded-lg"
                    value={field.value ?? '+7'}
                    onChange={(v) => field.onChange(v)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={!!contactsForm.formState.errors.phone}
                  />
                )}
              />
              {contactsForm.formState.errors.phone && (
                <p className="mt-1 text-sm text-red-600" role="alert">
                  {contactsForm.formState.errors.phone.message}
                </p>
              )}
            </div>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600"
                {...contactsForm.register('consent')}
              />
              <span className="text-sm text-slate-600">
                Даю согласие на обработку персональных данных.{' '}
                <a href="/legal/" className="font-semibold text-primary-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  Политика конфиденциальности
                </a>
              </span>
            </label>
            {contactsForm.formState.errors.consent && (
              <p className="text-sm text-red-600" role="alert">{contactsForm.formState.errors.consent.message}</p>
            )}
            <Button type="submit" size="lg" className="w-full rounded-xl mt-4">
              Получить расчёт
            </Button>
          </form>
        </>
      );
    }

    return null;
  };

  return (
    <div
      className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden"
      style={{ minHeight: '420px' }}
    >
      <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 sm:px-8">
        <Button type="button" variant="ghost" size="sm" onClick={goBack} className="text-slate-600 -ml-2">
          Назад
        </Button>
        <p className="text-sm font-medium text-slate-500">
          Шаг {stepIndex + 1} из {totalBranchSteps}
        </p>
      </div>
      <div className="p-6 sm:p-8 min-h-[380px] overflow-y-auto">
        {renderStepContent()}
      </div>
      {!isContactsStep && (
        <div className="border-t border-slate-100 bg-slate-50/60 px-6 py-4 sm:px-8">
          <div className="flex items-center justify-between">
            <div className="h-1.5 flex-1 max-w-[200px] rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-primary-500 transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
