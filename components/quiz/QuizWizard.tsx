'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QUIZ_STEPS, QUIZ_MICROCOPY, type QuizServiceType } from '@/data/quiz';
import { quizContactsSchema, quizStateToPricingParams, type QuizState } from '@/lib/quiz';
import { calculatePrice } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuizSummaryCard } from '@/components/quiz/QuizSummaryCard';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { CyrillicInput } from '@/components/forms/CyrillicInput';
import { cn } from '@/lib/utils';

const QUIZ_STORAGE_KEY = 'quiz_state';

/** Keep only Cyrillic letters, commas, and spaces */
function sanitizeCyrillicComma(value: string): string {
  return value.replace(/[^А-Яа-яЁё,\s]/g, '');
}

/** Keep only digit characters */
function filterNumericInput(value: string): string {
  return value.replace(/[^0-9]/g, '');
}

function loadState(): Partial<QuizState> {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(QUIZ_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      type: parsed.type as QuizServiceType | undefined,
      area: typeof parsed.area === 'number' ? parsed.area : undefined,
      rooms: typeof parsed.rooms === 'number' ? parsed.rooms : undefined,
      bathrooms: typeof parsed.bathrooms === 'number' ? parsed.bathrooms : undefined,
      extras: typeof parsed.extras === 'object' && parsed.extras ? (parsed.extras as Record<string, boolean>) : undefined,
      urgency: typeof parsed.urgency === 'string' ? parsed.urgency : undefined,
      customTypeLabel: typeof parsed.customTypeLabel === 'string' ? parsed.customTypeLabel : undefined,
      customExtrasLabel: typeof parsed.customExtrasLabel === 'string' ? parsed.customExtrasLabel : undefined,
    };
  } catch {
    return {};
  }
}

function saveState(state: QuizState) {
  if (typeof window === 'undefined') return;
  try {
    const { name, phone, consent, ...rest } = state;
    void name; void phone; void consent;
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // ignore
  }
}

type ContactsForm = { name: string; phone: string; consent: boolean; website?: string };

type QuizWizardProps = {
  onSuccessClose?: () => void;
};

export function QuizWizard({ onSuccessClose }: QuizWizardProps = {}) {
  const [state, setState] = React.useState<QuizState>(() => loadState());
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitStartTime] = React.useState(() => Date.now());

  // ─── String state for numeric fields (allows fully empty while editing) ───
  const [areaStr, setAreaStr] = React.useState<string>(() => {
    const s = loadState();
    return s.area !== undefined ? String(s.area) : '';
  });
  const [roomsStr, setRoomsStr] = React.useState<string>(() => {
    const s = loadState();
    return s.rooms !== undefined ? String(s.rooms) : '';
  });
  const [bathroomsStr, setBathroomsStr] = React.useState<string>(() => {
    const s = loadState();
    return s.bathrooms !== undefined ? String(s.bathrooms) : '';
  });

  // ─── Validation error state ───
  const [areaError, setAreaError] = React.useState<string | null>(null);
  const [roomsBathroomsError, setRoomsBathroomsError] = React.useState<string | null>(null);

  // ─── "Другое" in Тип уборки ───
  const [isOtherTypeSelected, setIsOtherTypeSelected] = React.useState<boolean>(() => {
    const s = loadState();
    return !!s.customTypeLabel;
  });
  const [customTypeText, setCustomTypeText] = React.useState<string>(() => {
    const s = loadState();
    return s.customTypeLabel ?? '';
  });
  const [customTypeError, setCustomTypeError] = React.useState<string | null>(null);

  // ─── "Другое" in Дополнительные услуги ───
  const [isOtherExtrasSelected, setIsOtherExtrasSelected] = React.useState<boolean>(() => {
    const s = loadState();
    return !!s.customExtrasLabel;
  });
  const [customExtrasText, setCustomExtrasText] = React.useState<string>(() => {
    const s = loadState();
    return s.customExtrasLabel ?? '';
  });
  const [customExtrasError, setCustomExtrasError] = React.useState<string | null>(null);

  const effectiveStepIds = React.useMemo(() => {
    const type = state.type;
    return QUIZ_STEPS.filter((s) => {
      if (!('skipFor' in s) || !s.skipFor) return true;
      return !type || !s.skipFor.includes(type);
    }).map((s) => s.id);
  }, [state.type]);

  const totalSteps = effectiveStepIds.length;
  const stepId = effectiveStepIds[currentIndex];
  const stepConfig = QUIZ_STEPS.find((s) => s.id === stepId);
  const isFirst = currentIndex === 0;
  const isContactsStep = stepId === 'contacts';

  React.useEffect(() => {
    saveState(state);
  }, [state]);

  const update = React.useCallback((patch: Partial<QuizState>) => {
    setState((prev) => ({ ...prev, ...patch }));
  }, []);

  const goNext = React.useCallback(() => {
    if (currentIndex < totalSteps - 1) setCurrentIndex((i) => i + 1);
  }, [currentIndex, totalSteps]);

  const goBack = React.useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // ─── Area validation ───
  const validateAndNextArea = React.useCallback(() => {
    const trimmed = areaStr.trim();
    if (!trimmed) {
      setAreaError('Данные введены некорректно');
      return;
    }
    const val = parseInt(trimmed, 10);
    if (isNaN(val) || val < 1) {
      setAreaError('Данные введены некорректно');
      return;
    }
    if (val > 100000) {
      setAreaError(
        'Введенное значение не попадает в интервал допустимых значений. Введите корректное значение не менее 1 и не более 100.000'
      );
      return;
    }
    setAreaError(null);
    update({ area: val });
    goNext();
  }, [areaStr, update, goNext]);

  // ─── Rooms/bathrooms validation ───
  const validateAndNextRooms = React.useCallback(() => {
    const rTrimmed = roomsStr.trim();
    const bTrimmed = bathroomsStr.trim();
    if (!rTrimmed || !bTrimmed) {
      setRoomsBathroomsError('Количество комнат / санузлов указано некорректно');
      return;
    }
    const rooms = parseInt(rTrimmed, 10);
    const bathrooms = parseInt(bTrimmed, 10);
    if (isNaN(rooms) || isNaN(bathrooms)) {
      setRoomsBathroomsError('Количество комнат / санузлов указано некорректно');
      return;
    }
    if (rooms < 1 || rooms > 30 || bathrooms < 1 || bathrooms > 30) {
      setRoomsBathroomsError(
        'Количество комнат / санузлов не может превышать 30, но и не может быть менее 1'
      );
      return;
    }
    setRoomsBathroomsError(null);
    update({ rooms, bathrooms });
    goNext();
  }, [roomsStr, bathroomsStr, update, goNext]);

  // ─── Extras validation ───
  const validateAndNextExtras = React.useCallback(() => {
    if (isOtherExtrasSelected && !customExtrasText.trim()) {
      setCustomExtrasError('Укажите дополнительные услуги');
      return;
    }
    if (isOtherExtrasSelected) {
      update({ customExtrasLabel: customExtrasText.trim() });
    }
    goNext();
  }, [isOtherExtrasSelected, customExtrasText, update, goNext]);

  const contactsForm = useForm<ContactsForm>({
    resolver: zodResolver(quizContactsSchema),
    defaultValues: {
      name: state.name ?? '',
      phone: state.phone && state.phone !== '+' ? state.phone : '+7',
      consent: state.consent ?? false,
      website: '',
    },
  });

  const onSubmitContacts = (data: ContactsForm) => {
    const elapsed = Date.now() - submitStartTime;
    if (elapsed < 2000) return;
    if (data.website) return;
    update({ name: data.name, phone: data.phone, consent: data.consent });
    setSubmitted(true);
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as unknown as { gtag: (a: string, b: string, c?: object) => void }).gtag?.('event', 'quiz_submit', {});
    }
  };

  if (submitted) {
    return (
      <div
        className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg shadow-slate-200/50 text-center animate-[fadeIn_0.3s_ease-out]"
        role="status"
        aria-live="polite"
      >
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-primary-600 mb-6" aria-hidden>
          <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">{QUIZ_MICROCOPY.successTitle}</h2>
        <p className="mt-2 text-slate-600">{QUIZ_MICROCOPY.successMessage}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {onSuccessClose && (
            <Button type="button" size="lg" className="rounded-xl" onClick={onSuccessClose}>
              Закрыть
            </Button>
          )}
          <Button asChild size="lg" className="rounded-xl">
            <Link href="/">{QUIZ_MICROCOPY.successCta}</Link>
          </Button>
        </div>
      </div>
    );
  }

  const estimateParams = quizStateToPricingParams(state);
  const estimate = estimateParams ? calculatePrice(estimateParams) : null;

  // Determine which Next handler to use for the mobile sticky button
  const mobileStickyNextHandler =
    stepId === 'area'
      ? validateAndNextArea
      : stepId === 'rooms'
      ? validateAndNextRooms
      : stepId === 'extras'
      ? validateAndNextExtras
      : goNext;

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr,340px] lg:gap-12">
        <div className="min-w-0">
          {/* Quiz frame — step header + content in one bordered card */}
          <div
            key={stepId}
            className="rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50 overflow-hidden transition-opacity duration-200 motion-reduce:duration-0"
            role="form"
            aria-label={stepConfig?.title}
          >
            {/* ── Header: Назад (left) + Шаг n из N (right) ── */}
            <div className="flex items-center justify-between gap-4 px-6 pt-5 pb-4 border-b border-slate-100 sm:px-8">
              {!isFirst ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={goBack}
                  className="text-slate-600 -ml-2"
                >
                  {QUIZ_MICROCOPY.back}
                </Button>
              ) : (
                <div aria-hidden />
              )}
              <p className="text-sm font-medium text-slate-500" aria-live="polite">
                {QUIZ_MICROCOPY.stepLabel(currentIndex + 1, totalSteps)}
              </p>
            </div>

            {/* ── Step content with stable min-height ── */}
            <div className="p-6 sm:p-8 min-h-[420px] flex flex-col">

              {/* ═══ STEP: ТИП УБОРКИ ═══ */}
              {stepConfig && stepId === 'type' && (() => {
                const typeStep = QUIZ_STEPS.find((s) => s.id === 'type');
                const opts = typeStep && 'options' in typeStep ? typeStep.options : [];
                return (
                  <>
                    <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                      {stepConfig.title}
                    </h3>
                    <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-wrap sm:flex-row" role="group" aria-label={stepConfig.title}>
                      {opts.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setIsOtherTypeSelected(false);
                            update({ type: opt.value, customTypeLabel: undefined });
                            goNext();
                          }}
                          className={cn(
                            'inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 px-5 py-3.5 text-left text-sm font-medium transition-all duration-200',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                            'motion-reduce:transition-none',
                            !isOtherTypeSelected && state.type === opt.value
                              ? 'border-primary-500 bg-primary-50 text-primary-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                      {/* Другое */}
                      <button
                        type="button"
                        onClick={() => {
                          setIsOtherTypeSelected(true);
                          setCustomTypeError(null);
                          update({ type: undefined });
                        }}
                        className={cn(
                          'inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 px-5 py-3.5 text-left text-sm font-medium transition-all duration-200',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                          'motion-reduce:transition-none',
                          isOtherTypeSelected
                            ? 'border-primary-500 bg-primary-50 text-primary-800'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                        )}
                      >
                        Другое
                      </button>
                    </div>

                    {isOtherTypeSelected && (
                      <div className="mt-4 space-y-3">
                        <Input
                          autoFocus
                          value={customTypeText}
                          onChange={(e) => {
                            const filtered = sanitizeCyrillicComma(e.target.value);
                            setCustomTypeText(filtered);
                            setCustomTypeError(null);
                          }}
                          placeholder="Укажите тип уборки"
                          className={cn('rounded-lg', customTypeError && 'border-red-500')}
                          aria-label="Укажите тип уборки"
                        />
                        {customTypeError && (
                          <p className="text-sm text-red-600" role="alert">
                            {customTypeError}
                          </p>
                        )}
                        <Button
                          type="button"
                          onClick={() => {
                            if (!customTypeText.trim()) {
                              setCustomTypeError('Укажите тип уборки');
                              return;
                            }
                            update({ type: undefined, customTypeLabel: customTypeText.trim() });
                            goNext();
                          }}
                          size="lg"
                          className="rounded-xl"
                        >
                          {QUIZ_MICROCOPY.next}
                        </Button>
                      </div>
                    )}
                  </>
                );
              })()}

              {/* ═══ STEP: ПЛОЩАДЬ ═══ */}
              {stepConfig && stepId === 'area' && 'presets' in stepConfig && (
                <>
                  <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                    {stepConfig.title}
                  </h3>
                  <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                  <div className="mt-6 space-y-4 flex-1">
                    <div className="flex flex-wrap gap-2">
                      {stepConfig.presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            const s = String(preset);
                            setAreaStr(s);
                            setAreaError(null);
                            update({ area: preset });
                            goNext();
                          }}
                          className={cn(
                            'rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                            state.area === preset && !areaStr.trim() || state.area === preset
                              ? 'border-primary-500 bg-primary-50 text-primary-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                          )}
                        >
                          {preset} {stepConfig.unit}
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-4">
                      <Label htmlFor="quiz-area" className="text-slate-700 font-medium shrink-0">
                        Или укажите точнее:
                      </Label>
                      <Input
                        id="quiz-area"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={areaStr}
                        placeholder="100"
                        onChange={(e) => {
                          const filtered = filterNumericInput(e.target.value);
                          setAreaStr(filtered);
                          setAreaError(null);
                        }}
                        className={cn('max-w-[120px] rounded-lg', areaError && 'border-red-500')}
                        aria-describedby="quiz-area-hint"
                      />
                      <span id="quiz-area-hint" className="text-slate-500 text-sm">
                        {stepConfig.unit}
                      </span>
                    </div>
                    <div>
                      {areaError && (
                        <p className="mb-2 text-sm text-red-600" role="alert">
                          {areaError}
                        </p>
                      )}
                      <Button
                        type="button"
                        onClick={validateAndNextArea}
                        size="lg"
                        className="rounded-xl"
                      >
                        {QUIZ_MICROCOPY.next}
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* ═══ STEP: КОМНАТЫ / САНУЗЛЫ ═══ */}
              {stepConfig && stepId === 'rooms' && 'roomsMin' in stepConfig && (
                <>
                  <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                    {stepConfig.title}
                  </h3>
                  <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                  <div className="mt-6 grid grid-cols-2 gap-6 max-w-sm">
                    <div>
                      <Label htmlFor="quiz-rooms" className="text-slate-700 font-medium">
                        {'roomsLabel' in stepConfig ? stepConfig.roomsLabel : 'Комнат'}
                      </Label>
                      <Input
                        id="quiz-rooms"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={roomsStr}
                        placeholder="3"
                        onChange={(e) => {
                          const filtered = filterNumericInput(e.target.value);
                          setRoomsStr(filtered);
                          setRoomsBathroomsError(null);
                        }}
                        className={cn('mt-2 rounded-lg', roomsBathroomsError && 'border-red-500')}
                      />
                    </div>
                    <div>
                      <Label htmlFor="quiz-bathrooms" className="text-slate-700 font-medium">
                        {'bathroomsLabel' in stepConfig ? stepConfig.bathroomsLabel : 'Санузлов'}
                      </Label>
                      <Input
                        id="quiz-bathrooms"
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        value={bathroomsStr}
                        placeholder="1"
                        onChange={(e) => {
                          const filtered = filterNumericInput(e.target.value);
                          setBathroomsStr(filtered);
                          setRoomsBathroomsError(null);
                        }}
                        className={cn('mt-2 rounded-lg', roomsBathroomsError && 'border-red-500')}
                      />
                    </div>
                  </div>
                  <div className="mt-6">
                    {roomsBathroomsError && (
                      <p className="mb-2 text-sm text-red-600" role="alert">
                        {roomsBathroomsError}
                      </p>
                    )}
                    <Button type="button" onClick={validateAndNextRooms} size="lg" className="rounded-xl">
                      {QUIZ_MICROCOPY.next}
                    </Button>
                  </div>
                </>
              )}

              {/* ═══ STEP: ДОП. УСЛУГИ ═══ */}
              {stepConfig && stepId === 'extras' && (() => {
                const extrasStep = QUIZ_STEPS.find((s) => s.id === 'extras');
                const opts = extrasStep && 'options' in extrasStep ? extrasStep.options : [];
                return (
                  <>
                    <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                      {stepConfig.title}
                    </h3>
                    <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                    <div className="mt-6 space-y-3">
                      {opts.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50 has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50/50"
                        >
                          <input
                            type="checkbox"
                            checked={state.extras?.[opt.key] ?? false}
                            onChange={(e) =>
                              update({
                                extras: { ...state.extras, [opt.key]: e.target.checked },
                              })
                            }
                            className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                          />
                          <span className="font-medium text-slate-800">{opt.label}</span>
                        </label>
                      ))}
                      {/* Другое */}
                      <label
                        className={cn(
                          'flex cursor-pointer items-center gap-3 rounded-xl border-2 border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50',
                          isOtherExtrasSelected && 'border-primary-500 bg-primary-50/50'
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={isOtherExtrasSelected}
                          onChange={(e) => {
                            setIsOtherExtrasSelected(e.target.checked);
                            setCustomExtrasError(null);
                            if (!e.target.checked) {
                              setCustomExtrasText('');
                              update({ customExtrasLabel: undefined });
                            }
                          }}
                          className="h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="font-medium text-slate-800">Другое</span>
                      </label>
                      {isOtherExtrasSelected && (
                        <div className="px-1 space-y-1">
                          <Input
                            autoFocus
                            value={customExtrasText}
                            onChange={(e) => {
                              const filtered = sanitizeCyrillicComma(e.target.value);
                              setCustomExtrasText(filtered);
                              setCustomExtrasError(null);
                            }}
                            placeholder="Укажите дополнительные услуги"
                            className={cn('rounded-lg', customExtrasError && 'border-red-500')}
                            aria-label="Укажите дополнительные услуги"
                          />
                          {customExtrasError && (
                            <p className="text-sm text-red-600" role="alert">
                              {customExtrasError}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="mt-6">
                      <Button
                        type="button"
                        onClick={validateAndNextExtras}
                        size="lg"
                        className="rounded-xl"
                      >
                        {QUIZ_MICROCOPY.next}
                      </Button>
                    </div>
                  </>
                );
              })()}

              {/* ═══ STEP: СРОЧНОСТЬ ═══ */}
              {stepConfig && stepId === 'urgency' && (() => {
                const urgencyStep = QUIZ_STEPS.find((s) => s.id === 'urgency');
                const opts = urgencyStep && 'options' in urgencyStep ? urgencyStep.options : [];
                return (
                  <>
                    <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                      {stepConfig.title}
                    </h3>
                    <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                    <div className="mt-6 flex flex-col gap-3 sm:flex-wrap sm:flex-row">
                      {opts.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            update({ urgency: opt.value });
                            goNext();
                          }}
                          className={cn(
                            'inline-flex w-full sm:w-auto items-center justify-center rounded-xl border-2 px-5 py-3.5 text-sm font-medium transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                            state.urgency === opt.value
                              ? 'border-primary-500 bg-primary-50 text-primary-800'
                              : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </>
                );
              })()}

              {/* ═══ STEP: КОНТАКТЫ ═══ */}
              {stepConfig && stepId === 'contacts' && 'consentText' in stepConfig && (
                <>
                  <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">
                    {stepConfig.title}
                  </h3>
                  <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                  {estimate && (
                    <div className="mt-4 rounded-xl border border-primary-200 bg-primary-50/50 px-4 py-3">
                      <p className="font-semibold text-primary-900">
                        Ориентировочная стоимость: {estimate.totalPrice.toLocaleString('ru-RU')} ₽
                      </p>
                      <p className="mt-1 text-sm text-primary-800">
                        Точную цену озвучит менеджер после уточнения деталей.
                      </p>
                    </div>
                  )}
                  {!estimate && (
                    <p className="mt-4 text-slate-600">
                      {QUIZ_MICROCOPY.resultTitle} Уточним детали по телефону.
                    </p>
                  )}
                  <form
                    onSubmit={contactsForm.handleSubmit(onSubmitContacts)}
                    className="mt-6 space-y-4"
                  >
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      className="absolute opacity-0 pointer-events-none h-0 w-0"
                      aria-hidden
                      {...contactsForm.register('website')}
                    />
                    <div>
                      <Label htmlFor="quiz-name" className="text-slate-700 font-medium">
                        Имя *
                      </Label>
                      <Controller
                        name="name"
                        control={contactsForm.control}
                        render={({ field }) => (
                          <CyrillicInput
                            id="quiz-name"
                            className="mt-2"
                            placeholder={stepConfig.namePlaceholder}
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
                      <Label htmlFor="quiz-phone" className="text-slate-700 font-medium">
                        Телефон *
                      </Label>
                      <Controller
                        name="phone"
                        control={contactsForm.control}
                        render={({ field }) => (
                          <PhoneInput
                            id="quiz-phone"
                            className="mt-2"
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
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                        {...contactsForm.register('consent')}
                        aria-invalid={!!contactsForm.formState.errors.consent}
                      />
                      <span className="text-sm text-slate-600">
                        {stepConfig.consentText}{' '}
                        <a
                          href={stepConfig.consentLinkHref}
                          className="text-primary-600 underline hover:text-primary-700"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {stepConfig.consentLinkText}
                        </a>
                      </span>
                    </label>
                    {contactsForm.formState.errors.consent && (
                      <p className="text-sm text-red-600" role="alert">
                        {contactsForm.formState.errors.consent.message}
                      </p>
                    )}
                    <Button type="submit" size="lg" className="w-full rounded-xl mt-4">
                      {stepConfig.submitLabel}
                    </Button>
                  </form>
                </>
              )}

            </div>
          </div>

          {/* Mobile sticky bottom CTA (area / rooms / extras steps only) */}
          {!isContactsStep && stepId !== 'type' && stepId !== 'urgency' && (
            <div className="mt-6 sticky bottom-[76px] left-0 right-0 z-50 p-2 bg-white/95 backdrop-blur sm:hidden rounded-xl border border-slate-200 shadow-lg">
              <Button
                type="button"
                onClick={mobileStickyNextHandler}
                size="lg"
                className="w-full rounded-xl"
              >
                {QUIZ_MICROCOPY.next}
              </Button>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <QuizSummaryCard state={state} />
        </div>
      </div>
    </div>
  );
}
