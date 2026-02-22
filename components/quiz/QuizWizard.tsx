'use client';

import * as React from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { QUIZ_STEPS, QUIZ_MICROCOPY, type QuizServiceType } from '@/data/quiz';
import { quizContactsSchema, quizStateToPricingParams, type QuizState } from '@/lib/quiz';
import { calculatePrice } from '@/lib/pricing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { QuizSummaryCard } from '@/components/quiz/QuizSummaryCard';
import { cn } from '@/lib/utils';

const QUIZ_STORAGE_KEY = 'quiz_state';

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
    };
  } catch {
    return {};
  }
}

function saveState(state: QuizState) {
  if (typeof window === 'undefined') return;
  try {
    const { name, phone, consent, ...rest } = state;
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(rest));
  } catch {
    // ignore
  }
}

type ContactsForm = { name: string; phone: string; consent: boolean; website?: string };

type QuizWizardProps = {
  /** При встраивании на страницу: закрыть квиз после успешной отправки */
  onSuccessClose?: () => void;
};

export function QuizWizard({ onSuccessClose }: QuizWizardProps = {}) {
  const [state, setState] = React.useState<QuizState>(() => loadState());
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [submitted, setSubmitted] = React.useState(false);
  const [submitStartTime] = React.useState(() => Date.now());

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
  const isLast = currentIndex === totalSteps - 1;
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

  const contactsForm = useForm<ContactsForm>({
    resolver: zodResolver(quizContactsSchema),
    defaultValues: {
      name: state.name ?? '',
      phone: state.phone ?? '',
      consent: state.consent ?? false,
      website: '',
    },
  });

  const onSubmitContacts = (data: ContactsForm) => {
    const elapsed = Date.now() - submitStartTime;
    if (elapsed < 2000) return; // time-based guard
    if (data.website) return; // honeypot
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

  return (
    <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 sm:px-6 lg:px-8">
      <div className="lg:grid lg:grid-cols-[1fr,340px] lg:gap-12">
        <div className="min-w-0">
          <div className="flex items-center justify-between gap-4 mb-6">
            <p className="text-sm font-medium text-slate-500" aria-live="polite">
              {QUIZ_MICROCOPY.stepLabel(currentIndex + 1, totalSteps)}
            </p>
            {!isFirst && (
              <Button type="button" variant="ghost" size="sm" onClick={goBack} className="text-slate-600">
                {QUIZ_MICROCOPY.back}
              </Button>
            )}
          </div>

          <div
            key={stepId}
            className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg shadow-slate-200/50 transition-opacity duration-200 motion-reduce:duration-0"
            role="form"
            aria-label={stepConfig?.title}
          >
            {stepConfig && stepId === 'type' && (() => {
              const typeStep = QUIZ_STEPS.find((s) => s.id === 'type');
              const opts = typeStep && 'options' in typeStep ? typeStep.options : [];
              return (
              <>
                <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{stepConfig.title}</h3>
                <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                <div
                  className="mt-6 flex flex-wrap gap-3"
                  role="group"
                  aria-label={stepConfig.title}
                >
                  {opts.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        update({ type: opt.value });
                        goNext();
                      }}
                      className={cn(
                        'inline-flex items-center justify-center rounded-xl border-2 px-5 py-3.5 text-left text-sm font-medium transition-all duration-200',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                        'motion-reduce:transition-none',
                        state.type === opt.value
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

            {stepConfig && stepId === 'area' && 'presets' in stepConfig && (
              <>
                <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{stepConfig.title}</h3>
                <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                <div className="mt-6 space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {stepConfig.presets.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => {
                            update({ area: preset });
                            goNext();
                          }}
                          className={cn(
                            'rounded-xl border-2 px-4 py-2.5 text-sm font-medium transition-all',
                            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
                            state.area === preset
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
                      type="number"
                      min={stepConfig.min}
                      max={stepConfig.max}
                      step={stepConfig.step}
                      value={state.area ?? 50}
                      onChange={(e) => update({ area: Number(e.target.value) || undefined })}
                      className="max-w-[120px] rounded-lg"
                      aria-describedby="quiz-area-hint"
                    />
                    <span id="quiz-area-hint" className="text-slate-500 text-sm">
                      {stepConfig.unit}
                    </span>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      const area = state.area ?? 50;
                      const clamped = Math.min(stepConfig.max, Math.max(stepConfig.min, area));
                      update({ area: clamped });
                      goNext();
                    }}
                    size="lg"
                    className="rounded-xl mt-2"
                  >
                    {QUIZ_MICROCOPY.next}
                  </Button>
                </div>
              </>
            )}

            {stepConfig && stepId === 'rooms' && 'roomsMin' in stepConfig && (
              <>
                <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{stepConfig.title}</h3>
                <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                <div className="mt-6 grid grid-cols-2 gap-6 max-w-sm">
                  <div>
                    <Label htmlFor="quiz-rooms" className="text-slate-700 font-medium">
                      {'roomsLabel' in stepConfig ? stepConfig.roomsLabel : 'Комнат'}
                    </Label>
                    <Input
                      id="quiz-rooms"
                      type="number"
                      min={stepConfig.roomsMin}
                      max={stepConfig.roomsMax}
                      value={state.rooms ?? 2}
                      onChange={(e) => update({ rooms: Number(e.target.value) || undefined })}
                      className="mt-2 rounded-lg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quiz-bathrooms" className="text-slate-700 font-medium">
                      {'bathroomsLabel' in stepConfig ? stepConfig.bathroomsLabel : 'Санузлов'}
                    </Label>
                    <Input
                      id="quiz-bathrooms"
                      type="number"
                      min={stepConfig.bathroomsMin}
                      max={stepConfig.bathroomsMax}
                      value={state.bathrooms ?? 1}
                      onChange={(e) => update({ bathrooms: Number(e.target.value) || undefined })}
                      className="mt-2 rounded-lg"
                    />
                  </div>
                </div>
                <Button type="button" onClick={goNext} size="lg" className="rounded-xl mt-6">
                  {QUIZ_MICROCOPY.next}
                </Button>
              </>
            )}

            {stepConfig && stepId === 'extras' && (() => {
              const extrasStep = QUIZ_STEPS.find((s) => s.id === 'extras');
              const opts = extrasStep && 'options' in extrasStep ? extrasStep.options : [];
              return (
              <>
                <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{stepConfig.title}</h3>
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
                </div>
                <Button type="button" onClick={goNext} size="lg" className="rounded-xl mt-6">
                  {QUIZ_MICROCOPY.next}
                </Button>
              </>
              );
            })()}

            {stepConfig && stepId === 'urgency' && (() => {
              const urgencyStep = QUIZ_STEPS.find((s) => s.id === 'urgency');
              const opts = urgencyStep && 'options' in urgencyStep ? urgencyStep.options : [];
              return (
              <>
                <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{stepConfig.title}</h3>
                <p className="mt-1 text-slate-600">{stepConfig.subtitle}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {opts.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => {
                        update({ urgency: opt.value });
                        goNext();
                      }}
                      className={cn(
                        'inline-flex items-center justify-center rounded-xl border-2 px-5 py-3.5 text-sm font-medium transition-all',
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

            {stepConfig && stepId === 'contacts' && 'consentText' in stepConfig && (
              <>
                <h3 className="font-display text-xl font-semibold text-slate-900 sm:text-2xl">{stepConfig.title}</h3>
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
                <form onSubmit={contactsForm.handleSubmit(onSubmitContacts)} className="mt-6 space-y-4">
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
                      Имя
                    </Label>
                    <Input
                      id="quiz-name"
                      className={cn('mt-2 rounded-lg', contactsForm.formState.errors.name && 'border-red-500')}
                      placeholder={stepConfig.namePlaceholder}
                      {...contactsForm.register('name')}
                      aria-invalid={!!contactsForm.formState.errors.name}
                    />
                    {contactsForm.formState.errors.name && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {contactsForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="quiz-phone" className="text-slate-700 font-medium">
                      Телефон
                    </Label>
                    <Input
                      id="quiz-phone"
                      type="tel"
                      autoComplete="tel"
                      className={cn('mt-2 rounded-lg', contactsForm.formState.errors.phone && 'border-red-500')}
                      placeholder={stepConfig.phonePlaceholder}
                      {...contactsForm.register('phone')}
                      aria-invalid={!!contactsForm.formState.errors.phone}
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

          {/* Mobile: sticky bottom CTA when not on contacts step and step has explicit Next (not type/urgency auto-advance) */}
          {/* bottom-[76px] clears the global StickyCta bar (~68px) so this button is never covered */}
          {!isContactsStep && stepId !== 'type' && stepId !== 'urgency' && (
            <div className="mt-6 sticky bottom-[76px] left-0 right-0 z-50 p-2 bg-white/95 backdrop-blur sm:hidden rounded-xl border border-slate-200 shadow-lg">
              <Button type="button" onClick={goNext} size="lg" className="w-full rounded-xl">
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
