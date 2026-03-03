'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CALCULATOR_PLACE_OPTIONS,
  CALCULATOR_BRANCH_STEP_IDS,
  CALCULATOR_STEPS,
  type CalculatorBranchId,
  type CalculatorPrimaryPlaceValue,
  type CalculatorStepId,
} from '@/data/detailed-calculator';
import { calculateApartmentHousePrice, type ApartmentHouseCleaningType } from '@/lib/detailed-calculator-pricing';
import { quizContactsSchema } from '@/lib/quiz';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { CyrillicInput } from '@/components/forms/CyrillicInput';
import { cn } from '@/lib/utils';
import { FORM_MESSAGES } from '@/lib/form-validation';

type ContactsForm = { name: string; phone: string; consent: boolean; website?: string };

function sanitizeCyrillicComma(value: string): string {
  return value.replace(/[^А-Яа-яЁё,\s]/g, '');
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

export function DetailedCalculator() {
  const [place, setPlace] = React.useState<CalculatorPrimaryPlaceValue | null>(null);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitStartTime] = React.useState(() => Date.now());

  const branch: CalculatorBranchId | null = place ? placeToBranch(place) : null;
  const branchStepIds = branch ? CALCULATOR_BRANCH_STEP_IDS[branch] : [];
  const totalBranchSteps = branchStepIds.length;
  const currentStepId: CalculatorStepId | null =
    branch && stepIndex < branchStepIds.length ? branchStepIds[stepIndex]! : null;
  const stepConfig = currentStepId ? CALCULATOR_STEPS[currentStepId] : null;

  const isFirstBranchStep = stepIndex === 0;
  const isContactsStep = currentStepId === 'contacts';

  const progressPercent =
    totalBranchSteps <= 1 ? 100 : Math.round((stepIndex / (totalBranchSteps - 1)) * 100);

  // ─── Branch-specific state ───
  const [serviceType, setServiceType] = React.useState<string>('');
  const [areaStr, setAreaStr] = React.useState('');
  const [bathroomsStr, setBathroomsStr] = React.useState('1');
  const [extras, setExtras] = React.useState<Record<string, boolean>>({});
  const [extrasNumeric, setExtrasNumeric] = React.useState<Record<string, string>>({});
  const [dirtiness, setDirtiness] = React.useState(5);
  const [nonresTypeText, setNonresTypeText] = React.useState('');
  const [nonresAreaStr, setNonresAreaStr] = React.useState('');
  const [nonresExtras, setNonresExtras] = React.useState<Record<string, boolean>>({});
  const [windowsTypeVal, setWindowsTypeVal] = React.useState('');
  const [windowsNumbersStr, setWindowsNumbersStr] = React.useState('');
  const [customDescription, setCustomDescription] = React.useState('');

  const [stepError, setStepError] = React.useState<string | null>(null);

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
    } else {
      setPlace(null);
      setStepIndex(0);
      setStepError(null);
    }
  }, [stepIndex]);

  const goNext = React.useCallback(() => {
    if (stepIndex < totalBranchSteps - 1) {
      setStepIndex((i) => i + 1);
      setStepError(null);
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

  // ─── Place selection (first screen) ───
  if (!branch) {
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
              const isCustom = opt.value === 'custom';
              const selected = place === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setPlace(opt.value);
                    setStepIndex(0);
                    setStepError(null);
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
        </div>
      </div>
    );
  }

  // ─── Branch steps ───
  const renderStepContent = () => {
    if (!stepConfig || !currentStepId) return null;

    if (currentStepId === 'service_type' && stepConfig.kind === 'choice') {
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {stepConfig.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setServiceType(o.value);
                  goNext();
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
        </>
      );
    }

    if (currentStepId === 'area' && stepConfig.kind === 'numeric') {
      const presets = stepConfig.presets ?? [50, 100];
      const min = stepConfig.min ?? 10;
      const max = stepConfig.max ?? 1000;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setAreaStr(String(p));
                  setStepError(null);
                  goNext();
                }}
                className={cn(
                  'rounded-xl border-2 px-4 py-2.5 text-sm font-medium',
                  areaStr === String(p) ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
                )}
              >
                {p} {stepConfig.unit}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Label className="shrink-0">Или укажите:</Label>
            <Input
              type="text"
              inputMode="numeric"
              value={areaStr}
              onChange={(e) => {
                setAreaStr(filterNumeric(e.target.value));
                setStepError(null);
              }}
              className={cn('max-w-[120px]', stepError && 'border-red-500')}
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
                setStepError('Заполните поле «Площадь» корректно');
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

    if (currentStepId === 'bathrooms' && stepConfig.kind === 'numeric') {
      const presets = stepConfig.presets ?? [1, 2, 3];
      const n = bathroomsStr ? parseInt(bathroomsStr, 10) : 1;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setBathroomsStr(String(p));
                  goNext();
                }}
                className={cn(
                  'rounded-xl border-2 px-4 py-2.5 text-sm font-medium',
                  n === p ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
                )}
              >
                {p} {stepConfig.unit}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              value={bathroomsStr}
              onChange={(e) => setBathroomsStr(filterNumeric(e.target.value))}
              className="max-w-[80px] rounded-lg"
            />
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          <Button type="button" size="lg" className="mt-4 rounded-xl" onClick={goNext}>
            Далее
          </Button>
        </>
      );
    }

    if (currentStepId === 'extras' && stepConfig.kind === 'multi') {
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 space-y-3 max-h-[320px] overflow-y-auto">
            {stepConfig.options.map((opt) => (
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
                {opt.hasNumericValue && (extras[opt.key] ?? false) && (
                  <div className="flex items-center gap-2 pl-7">
                    <Input
                      type="text"
                      inputMode="numeric"
                      placeholder={`Кол-во (${opt.unitLabel})`}
                      value={extrasNumeric[opt.key] ?? ''}
                      onChange={(e) =>
                        setExtrasNumeric((prev) => ({ ...prev, [opt.key]: filterNumeric(e.target.value) }))
                      }
                      className="w-24 rounded-lg"
                    />
                    <span className="text-slate-500 text-sm">{opt.unitLabel}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <Button type="button" size="lg" className="mt-6 rounded-xl" onClick={goNext}>
            Далее
          </Button>
        </>
      );
    }

    if (currentStepId === 'dirtiness' && stepConfig.kind === 'slider') {
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6">
            <input
              type="range"
              min={stepConfig.min}
              max={stepConfig.max}
              step={stepConfig.step}
              value={dirtiness}
              onChange={(e) => setDirtiness(Number(e.target.value))}
              className="w-full accent-primary-600"
            />
            <div className="mt-2 flex justify-between text-sm text-slate-500">
              <span>1 — чисто</span>
              <span className="font-medium text-slate-700">{dirtiness}</span>
              <span>10 — очень сильно</span>
            </div>
          </div>
          <Button type="button" size="lg" className="mt-6 rounded-xl" onClick={goNext}>
            Далее
          </Button>
        </>
      );
    }

    if (currentStepId === 'nonres_type' && stepConfig.kind === 'textarea') {
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6">
            <textarea
              value={nonresTypeText}
              onChange={(e) => {
                setNonresTypeText(sanitizeCyrillicComma(e.target.value));
                setStepError(null);
              }}
              placeholder="Офис, склад, салон красоты"
              className={cn('w-full min-h-[100px] rounded-lg border border-slate-300 px-3 py-2 text-sm', stepError && 'border-red-500')}
              maxLength={stepConfig.maxLength ?? 120}
            />
            {stepError && <p className="mt-1 text-sm text-red-600" role="alert">{stepError}</p>}
            <Button
              type="button"
              size="lg"
              className="mt-4 rounded-xl"
              onClick={() => {
                if (!nonresTypeText.trim()) {
                  setStepError(FORM_MESSAGES.fillField('Тип нежилого помещения'));
                  return;
                }
                setStepError(null);
                goNext();
              }}
            >
              Далее
            </Button>
          </div>
        </>
      );
    }

    if (currentStepId === 'nonres_area' && stepConfig.kind === 'numeric') {
      const presets = stepConfig.presets ?? [50, 100, 200];
      const min = stepConfig.min ?? 20;
      const max = stepConfig.max ?? 5000;
      const num = nonresAreaStr ? parseInt(nonresAreaStr, 10) : 0;
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setNonresAreaStr(String(p));
                  goNext();
                }}
                className="rounded-xl border-2 px-4 py-2.5 text-sm font-medium border-slate-200 hover:border-primary-500"
              >
                {p} {stepConfig.unit}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              value={nonresAreaStr}
              onChange={(e) => setNonresAreaStr(filterNumeric(e.target.value))}
              className="max-w-[120px] rounded-lg"
            />
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          <Button
            type="button"
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() => {
              const n = nonresAreaStr ? parseInt(nonresAreaStr, 10) : NaN;
              if (isNaN(n) || n < min || n > max) {
                setStepError('Заполните поле «Площадь»');
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

    if (currentStepId === 'nonres_extras' && stepConfig.kind === 'multi') {
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 space-y-3">
            {stepConfig.options.map((opt) => (
              <label key={opt.key} className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 p-4 hover:bg-slate-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/50">
                <input
                  type="checkbox"
                  checked={nonresExtras[opt.key] ?? false}
                  onChange={(e) => setNonresExtras((prev) => ({ ...prev, [opt.key]: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-primary-600"
                />
                <span className="font-medium text-slate-800">{opt.label}</span>
              </label>
            ))}
          </div>
          <Button type="button" size="lg" className="mt-6 rounded-xl" onClick={goNext}>
            Далее
          </Button>
        </>
      );
    }

    if (currentStepId === 'windows_type' && stepConfig.kind === 'choice') {
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {stepConfig.options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => {
                  setWindowsTypeVal(o.value);
                  goNext();
                }}
                className={cn(
                  'rounded-xl border-2 px-5 py-3 text-sm font-medium',
                  windowsTypeVal === o.value ? 'border-primary-500 bg-primary-50' : 'border-slate-200'
                )}
              >
                {o.label}
              </button>
            ))}
          </div>
        </>
      );
    }

    if (currentStepId === 'windows_numbers' && stepConfig.kind === 'numeric') {
      const presets = stepConfig.presets ?? [4, 8, 12, 20];
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => {
                  setWindowsNumbersStr(String(p));
                  goNext();
                }}
                className="rounded-xl border-2 px-4 py-2.5 text-sm font-medium border-slate-200 hover:border-primary-500"
              >
                {p}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Input
              type="text"
              inputMode="numeric"
              value={windowsNumbersStr}
              onChange={(e) => setWindowsNumbersStr(filterNumeric(e.target.value))}
              className="max-w-[120px] rounded-lg"
            />
            <span className="text-slate-500 text-sm">{stepConfig.unit}</span>
          </div>
          <Button
            type="button"
            size="lg"
            className="mt-4 rounded-xl"
            onClick={() => {
              const n = windowsNumbersStr ? parseInt(windowsNumbersStr, 10) : NaN;
              if (isNaN(n) || n < 1) {
                setStepError('Заполните поле');
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

    if (currentStepId === 'custom_description' && stepConfig.kind === 'textarea') {
      const text = place === 'custom' ? customDescription : '';
      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
          <div className="mt-6">
            <textarea
              value={text}
              onChange={(e) => setCustomDescription(sanitizeCyrillicComma(e.target.value))}
              placeholder="Комплексная уборка нескольких объектов"
              className="w-full min-h-[100px] rounded-lg border border-slate-300 px-3 py-2 text-sm"
              maxLength={stepConfig.maxLength ?? 200}
            />
            <Button
              type="button"
              size="lg"
              className="mt-4 rounded-xl"
              onClick={() => {
                if (!text.trim()) {
                  setStepError('Заполните поле «Опишите свой вариант»');
                  return;
                }
                setStepError(null);
                goNext();
              }}
            >
              Далее
            </Button>
          </div>
        </>
      );
    }

    if (currentStepId === 'contacts' && stepConfig.kind === 'contacts') {
      const apartmentPrice =
        branch === 'apartment_house' &&
        serviceType &&
        areaStr &&
        bathroomsStr
          ? (() => {
              const area = parseInt(areaStr, 10);
              const bathrooms = parseInt(bathroomsStr, 10);
              if (isNaN(area) || isNaN(bathrooms)) return null;
              return calculateApartmentHousePrice({
                cleaningType: serviceType as ApartmentHouseCleaningType,
                areaSqm: area,
                bathroomsCount: bathrooms,
                extras: {
                  windowsCount: extras.windows ? parseInt(extrasNumeric.windows ?? '0', 10) || undefined : undefined,
                  balconyAreaSqm: extras.balcony ? parseInt(extrasNumeric.balcony ?? '0', 10) || undefined : undefined,
                  ozoneAreaSqm: extras.ozone ? parseInt(extrasNumeric.ozone ?? '0', 10) || undefined : undefined,
                  photoChem: extras.photo_chem,
                  fridge: extras.fridge,
                  microwave: extras.microwave,
                  oven: extras.oven,
                  chandelier: extras.chandelier,
                },
                dirtinessLevel: dirtiness,
              });
            })()
          : null;

      return (
        <>
          <h3 className="font-display text-xl font-semibold text-slate-900">{stepConfig.title}</h3>
          <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>

          {branch === 'apartment_house' && apartmentPrice && (
            <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/50 p-4 space-y-2">
              <p className="font-semibold text-primary-900">Предварительный расчёт стоимости</p>
              <ul className="text-sm text-slate-700 space-y-1">
                {apartmentPrice.breakdown.map((item) => (
                  <li key={item.label}>
                    {item.label}: {item.amount > 0 ? `${item.amount.toLocaleString('ru-RU')} ₽` : 'по запросу'}
                  </li>
                ))}
              </ul>
              <p className="font-semibold text-slate-900 pt-2 border-t border-primary-200">
                Итого: {apartmentPrice.totalBeforeDiscount.toLocaleString('ru-RU')} ₽
              </p>
              <p className="text-primary-700 font-medium">
                Со скидкой 10% при заказе в течение 24 часов: {apartmentPrice.totalWithDiscount.toLocaleString('ru-RU')} ₽
              </p>
            </div>
          )}

          {(branch === 'non_residential' || branch === 'windows_facade') && (
            <p className="mt-4 text-slate-600">Коммерческое предложение почти готово. Оставьте контакты — мы вышлем расчёт.</p>
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
            <Button type="button" size="sm" className="rounded-full px-6 ml-4" onClick={goNext} style={{ display: 'none' }}>
              Далее
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
