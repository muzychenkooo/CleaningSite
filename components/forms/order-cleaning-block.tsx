'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { trackFormSubmit } from '@/lib/analytics';
import {
  orderCleaningFormSchema,
  type OrderCleaningFormData,
} from '@/lib/form-validation';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { CyrillicInput } from '@/components/forms/CyrillicInput';

const OBJECT_TYPES = [
  { value: 'apartment', label: 'Квартира' },
  { value: 'cottage', label: 'Коттедж' },
  { value: 'office', label: 'Офис' },
  { value: 'non_residential', label: 'Нежилое помещение' },
  { value: 'windows', label: 'Мойка окон' },
] as const;

const CLEANING_TYPES = [
  { value: 'general', label: 'Генеральная' },
  { value: 'maintenance', label: 'Поддерживающая' },
  { value: 'after_repair', label: 'После ремонта' },
] as const;

const WASHING_TYPES = [
  { value: 'seasonal', label: 'Сезонная' },
  { value: 'after_repair', label: 'После ремонта' },
] as const;

const AREA_STEP = 10;
const MIN_AREA = 0;

const MIN_SUBMIT_SECONDS = 3;

const selectClassName =
  'flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-9 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 disabled:opacity-50 appearance-none bg-no-repeat bg-[length:1.25rem] bg-[right_0.5rem_center] cursor-pointer [&>option]:bg-white [&>option]:text-slate-900';

export function OrderCleaningBlock() {
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const mountedAt = React.useRef<number>(Date.now());

  const objectType = useForm<OrderCleaningFormData>({
    resolver: zodResolver(orderCleaningFormSchema),
    defaultValues: {
      honeypot: '',
      objectType: 'apartment',
      cleaningType: 'general',
      washingType: 'seasonal',
      area: 0,
      name: '',
      phone: '+7',
      consent: false,
    },
  });

  const watchObjectType = objectType.watch('objectType');
  const isWashing = watchObjectType === 'windows';

  const onSubmit = async (data: OrderCleaningFormData) => {
    if (data.honeypot) return;
    if (Date.now() - mountedAt.current < MIN_SUBMIT_SECONDS * 1000) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      trackFormSubmit('order-cleaning');
      objectType.reset({
        honeypot: '',
        objectType: 'apartment',
        cleaningType: 'general',
        washingType: 'seasonal',
        area: 0,
        name: '',
        phone: '+7',
        consent: false,
      });
      setSuccessOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full min-w-0 max-w-[1280px] px-4 sm:px-6 lg:px-8">
        <form
          id="order-cleaning-form"
          onSubmit={objectType.handleSubmit(onSubmit)}
          noValidate
          className="lg:grid lg:grid-cols-2 lg:gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50"
        >
          {/* Левая колонка — тип объекта, вид уборки/мойки, площадь */}
          <div className="p-6 sm:p-8 min-h-[320px] flex flex-col gap-6">
              <input
                type="text"
                autoComplete="off"
                tabIndex={-1}
                className="absolute -left-[9999px]"
                aria-hidden
                {...objectType.register('honeypot')}
              />

              <div className="space-y-2">
                <Label htmlFor="object-type" className="font-semibold text-slate-900">
                  Тип объекта
                </Label>
                <select
                  id="object-type"
                  className={cn(selectClassName)}
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                  }}
                  {...objectType.register('objectType')}
                >
                  {OBJECT_TYPES.map(({ value, label }) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {!isWashing ? (
                <div className="space-y-2">
                  <Label htmlFor="cleaning-type" className="font-semibold text-slate-900">
                    Вид уборки
                  </Label>
                  <select
                    id="cleaning-type"
                    className={cn(selectClassName)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    }}
                    {...objectType.register('cleaningType')}
                  >
                    {CLEANING_TYPES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="washing-type" className="font-semibold text-slate-900">
                    Вид мойки
                  </Label>
                  <select
                    id="washing-type"
                    className={cn(selectClassName)}
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748b'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    }}
                    {...objectType.register('washingType')}
                  >
                    {WASHING_TYPES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="area" className="font-semibold text-slate-900">
                  Площадь м²
                </Label>
                <Input
                  id="area"
                  type="number"
                  min={MIN_AREA}
                  step={AREA_STEP}
                  {...objectType.register('area', {
                    valueAsNumber: true,
                    setValueAs: (v) => {
                      if (v === '' || Number.isNaN(Number(v))) return 0;
                      const n = Number(v);
                      return n < MIN_AREA ? MIN_AREA : n;
                    },
                  })}
                />
                <p className="text-sm text-slate-500">
                  Скидка за объем 200 м² и более! Уточняйте у менеджера.
                </p>
              </div>
          </div>

          {/* Правая колонка — контакты (как на сайте) */}
          <div className="bg-sky-50/80 p-6 sm:p-8 flex flex-col gap-4">
              <div className="space-y-2">
                <Label htmlFor="order-cleaning-name" className="font-semibold text-slate-900">
                  Имя *
                </Label>
                <Controller
                  name="name"
                  control={objectType.control}
                  render={({ field }) => (
                    <CyrillicInput
                      id="order-cleaning-name"
                      placeholder="Имя"
                      value={field.value ?? ''}
                      onChange={(v) => field.onChange(v)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      error={!!objectType.formState.errors.name}
                    />
                  )}
                />
                {objectType.formState.errors.name && (
                  <p className="text-sm text-red-600" role="alert">
                    {objectType.formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="order-cleaning-phone" className="font-semibold text-slate-900">
                  Телефон *
                </Label>
                <Controller
                  name="phone"
                  control={objectType.control}
                  render={({ field }) => (
                    <PhoneInput
                      id="order-cleaning-phone"
                      value={field.value ?? '+7'}
                      onChange={(v) => field.onChange(v)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      error={!!objectType.formState.errors.phone}
                    />
                  )}
                />
                {objectType.formState.errors.phone && (
                  <p className="text-sm text-red-600" role="alert">
                    {objectType.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                  {...objectType.register('consent')}
                  aria-invalid={!!objectType.formState.errors.consent}
                />
                <span className="text-sm text-slate-600">
                  Я принимаю условия обработки данных.{' '}
                  <a
                    href="/legal/"
                    className="font-semibold text-primary-600 hover:text-primary-700"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Политика конфиденциальности
                  </a>
                </span>
              </label>
              {objectType.formState.errors.consent && (
                <p className="text-sm text-red-600" role="alert">
                  {objectType.formState.errors.consent.message}
                </p>
              )}

              <Button
                type="submit"
                disabled={submitting}
                className="w-full mt-2"
              >
                {submitting ? 'Отправка…' : 'Свяжитесь со мной'}
              </Button>
          </div>
        </form>
      </div>

      {successOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50"
            aria-hidden
            onClick={() => setSuccessOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-cleaning-success-title"
            className="relative z-[101] w-full max-w-lg rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
          >
            <button
              type="button"
              onClick={() => setSuccessOpen(false)}
              className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              aria-label="Закрыть"
            >
              ×
            </button>
            <h3 id="order-cleaning-success-title" className="text-lg font-semibold">
              Заявка принята
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Мы свяжемся с вами в ближайшее время для уточнения деталей и расчёта стоимости.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
