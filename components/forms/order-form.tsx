'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { trackFormSubmit } from '@/lib/analytics';
import { orderFormSchema, type OrderFormData } from '@/lib/form-validation';
import { PhoneInput } from '@/components/forms/PhoneInput';
import { CyrillicInput } from '@/components/forms/CyrillicInput';
import { AddressInput } from '@/components/forms/AddressInput';
import { DatePicker } from '@/components/forms/DatePicker';
import { TimePicker } from '@/components/forms/TimePicker';

const MIN_SUBMIT_SECONDS = 3;

function trackConversion(formName: string) {
  trackFormSubmit(formName);
}

export function OrderForm({
  onSuccess,
  className,
  compact,
  submitLabel = 'Отправить заявку',
  formName = 'order',
}: {
  onSuccess?: () => void;
  className?: string;
  compact?: boolean;
  submitLabel?: string;
  formName?: string;
}) {
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const mountedAt = React.useRef<number>(Date.now());

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      honeypot: '',
      name: '',
      phone: '+7',
      address: '',
      date: '',
      time: '',
      serviceType: '',
    },
  });

  const onSubmit = async (data: OrderFormData) => {
    if (data.honeypot) return;
    if (Date.now() - mountedAt.current < MIN_SUBMIT_SECONDS * 1000) return;
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      trackConversion(formName);
      reset({
        honeypot: '',
        name: '',
        phone: '+7',
        address: '',
        date: '',
        time: '',
        serviceType: '',
      });
      setSuccessOpen(true);
      onSuccess?.();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={cn('w-full min-w-0 space-y-4', className)}
        noValidate
      >
        <input
          type="text"
          autoComplete="off"
          tabIndex={-1}
          className="absolute -left-[9999px]"
          aria-hidden
          {...register('honeypot')}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="order-name">Имя *</Label>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <CyrillicInput
                  id="order-name"
                  placeholder="Иван"
                  value={field.value ?? ''}
                  onChange={(v) => field.onChange(v)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={!!errors.name}
                />
              )}
            />
            {errors.name && (
              <p className="text-sm text-red-600" role="alert">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="order-phone">Телефон *</Label>
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <PhoneInput
                  id="order-phone"
                  value={field.value ?? '+7'}
                  onChange={(v) => field.onChange(v)}
                  onBlur={field.onBlur}
                  ref={field.ref}
                  error={!!errors.phone}
                />
              )}
            />
            {errors.phone && (
              <p className="text-sm text-red-600" role="alert">{errors.phone.message}</p>
            )}
          </div>
        </div>
        {!compact && (
          <>
            <div className="space-y-2">
              <Label htmlFor="order-address">Адрес</Label>
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <AddressInput
                    id="order-address"
                    value={field.value ?? ''}
                    onChange={(v) => field.onChange(v)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    error={!!errors.address}
                  />
                )}
              />
              {errors.address && (
                <p className="text-sm text-red-600" role="alert">{errors.address.message}</p>
              )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="order-date">Желаемая дата</Label>
                <Controller
                  name="date"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      id="order-date"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={!!errors.date}
                    />
                  )}
                />
                {errors.date && (
                  <p className="text-sm text-red-600" role="alert">{errors.date.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="order-time">Время</Label>
                <Controller
                  name="time"
                  control={control}
                  render={({ field }) => (
                    <TimePicker
                      id="order-time"
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      error={!!errors.time}
                    />
                  )}
                />
                {errors.time && (
                  <p className="text-sm text-red-600" role="alert">{errors.time.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-service">Тип услуги</Label>
                <Controller
                  name="serviceType"
                  control={control}
                  render={({ field }) => (
                    <CyrillicInput
                      id="order-service"
                      placeholder="Например: генеральная уборка квартиры"
                      maxLength={100}
                      allowCommas
                      value={field.value ?? ''}
                      onChange={(v) => field.onChange(v)}
                      onBlur={field.onBlur}
                      ref={field.ref}
                      error={!!errors.serviceType}
                    />
                  )}
                />
              {errors.serviceType && (
                <p className="text-sm text-red-600" role="alert">{errors.serviceType.message}</p>
              )}
            </div>
          </>
        )}
        <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
          {submitting ? 'Отправка…' : submitLabel}
        </Button>
      </form>
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
            aria-labelledby="success-title"
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
            <h3 id="success-title" className="text-lg font-semibold">Заявка принята</h3>
            <p className="mt-2 text-sm text-slate-500">
              Мы свяжемся с вами в ближайшее время для уточнения деталей и расчёта стоимости.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
