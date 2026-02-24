'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));
const MONTHS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
const MIN_YEAR = 2026;
const MAX_YEAR = 2100;
const YEARS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => String(MIN_YEAR + i));

const MONTH_NAMES = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
];

export interface DatePickerProps {
  value: string; // YYYY-MM-DD or ''
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: boolean;
  className?: string;
  id?: string;
}

function parseValue(value: string): { day: number; month: number; year: number } | null {
  if (!value || value.length < 10) return null;
  const [y, m, d] = value.split('-').map(Number);
  if (!y || !m || !d) return null;
  return { day: d, month: m, year: y };
}

function toISO(day: number, month: number, year: number): string {
  const d = String(day).padStart(2, '0');
  const m = String(month).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// ─── Desktop: dropdown list ───
function DesktopList({
  items,
  selectedIndex,
  onSelect,
  onClose,
  label,
  className,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  label?: string;
  className?: string;
}) {
  const listRef = React.useRef<HTMLDivElement>(null);
  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const row = el.querySelector(`[data-index="${selectedIndex}"]`);
    row?.scrollIntoView({ block: 'nearest', behavior: 'auto' });
  }, [selectedIndex]);

  return (
    <div
      className={cn(
        'absolute left-0 right-0 top-full z-50 mt-1 max-h-56 overflow-auto rounded-lg border border-slate-200 bg-white py-1 shadow-lg',
        className
      )}
      role="listbox"
    >
      {label && (
        <div className="sticky top-0 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-500">
          {label}
        </div>
      )}
      {items.map((item, index) => (
        <button
          key={item}
          type="button"
          role="option"
          aria-selected={index === selectedIndex}
          data-index={index}
          className={cn(
            'w-full px-3 py-2.5 text-left text-sm transition-colors',
            index === selectedIndex
              ? 'bg-primary-50 font-medium text-primary-800'
              : 'text-slate-700 hover:bg-slate-50'
          )}
          onClick={() => {
            onSelect(index);
            onClose();
          }}
        >
          {item}
        </button>
      ))}
    </div>
  );
}

// ─── Mobile: wheel column ───
const WHEEL_ITEM_HEIGHT = 44;
const WHEEL_VISIBLE_COUNT = 5;
const WHEEL_PADDING = WHEEL_ITEM_HEIGHT * 2;

function WheelColumn({
  items,
  selectedIndex,
  onSelect,
  label,
  className,
}: {
  items: string[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  label?: string;
  className?: string;
}) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const isScrollingRef = React.useRef(false);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const targetScroll = selectedIndex * WHEEL_ITEM_HEIGHT;
    el.scrollTop = Math.max(0, targetScroll);
  }, [selectedIndex]);

  const handleScroll = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const index = Math.round((scrollTop + WHEEL_ITEM_HEIGHT / 2) / WHEEL_ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    onSelect(clamped);
  }, [items.length, onSelect]);

  const scrollEndTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const handleScrollEnd = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollTop = el.scrollTop;
    const index = Math.round((scrollTop + WHEEL_ITEM_HEIGHT / 2) / WHEEL_ITEM_HEIGHT);
    const clamped = Math.max(0, Math.min(items.length - 1, index));
    const targetScroll = clamped * WHEEL_ITEM_HEIGHT;
    el.scrollTo({ top: Math.max(0, targetScroll), behavior: 'smooth' });
    onSelect(clamped);
  }, [items.length, onSelect]);

  const scheduleScrollEnd = React.useCallback(() => {
    if (scrollEndTimerRef.current) clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = setTimeout(handleScrollEnd, 150);
  }, [handleScrollEnd]);

  return (
    <div className={cn('flex flex-col flex-1 min-w-0', className)}>
      {label && (
        <div className="text-center text-xs font-medium text-slate-500 mb-1">{label}</div>
      )}
      <div
        className="relative overflow-hidden"
        style={{ height: WHEEL_ITEM_HEIGHT * WHEEL_VISIBLE_COUNT }}
      >
        <div
          className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[44px] border-y border-slate-200 pointer-events-none z-10"
          aria-hidden
        />
        <div
          ref={scrollRef}
          className="overflow-y-auto overflow-x-hidden w-full h-full snap-y snap-mandatory overscroll-contain"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'y mandatory',
          }}
          onScroll={() => {
            handleScroll();
            scheduleScrollEnd();
          }}
          onTouchEnd={scheduleScrollEnd}
          onWheel={scheduleScrollEnd}
        >
          <div style={{ height: WHEEL_PADDING, minHeight: WHEEL_PADDING }} />
          {items.map((item, index) => (
            <div
              key={item}
              className="flex items-center justify-center text-lg font-medium text-slate-800 snap-center"
              style={{ height: WHEEL_ITEM_HEIGHT }}
              onClick={() => onSelect(index)}
            >
              {item}
            </div>
          ))}
          <div style={{ height: WHEEL_PADDING, minHeight: WHEEL_PADDING }} />
        </div>
      </div>
    </div>
  );
}

export function DatePicker({ value, onChange, onBlur, error, className, id }: DatePickerProps) {
  const parsed = React.useMemo(() => parseValue(value), [value]);
  const [day, setDay] = React.useState(parsed?.day ?? 1);
  const [month, setMonth] = React.useState(parsed?.month ?? 1);
  const [year, setYear] = React.useState(parsed?.year ?? MIN_YEAR);

  React.useEffect(() => {
    if (parsed) {
      setDay(parsed.day);
      setMonth(parsed.month);
      setYear(parsed.year);
    } else {
      setDay(1);
      setMonth(1);
      setYear(MIN_YEAR);
    }
  }, [value, parsed?.day, parsed?.month, parsed?.year]);

  const syncToValue = React.useCallback(
    (d: number, m: number, y: number) => {
      const daysInMonth = new Date(y, m, 0).getDate();
      const safeDay = Math.min(d, daysInMonth);
      onChange(toISO(safeDay, m, y));
    },
    [onChange]
  );

  const handleDayChange = React.useCallback(
    (index: number) => {
      const d = index + 1;
      setDay(d);
      syncToValue(d, month, year);
    },
    [month, year, syncToValue]
  );
  const handleMonthChange = React.useCallback(
    (index: number) => {
      const m = index + 1;
      setMonth(m);
      const daysInMonth = new Date(year, m, 0).getDate();
      setDay((prev) => Math.min(prev, daysInMonth));
      syncToValue(Math.min(day, daysInMonth), m, year);
    },
    [year, day, syncToValue]
  );
  const handleYearChange = React.useCallback(
    (index: number) => {
      const y = MIN_YEAR + index;
      setYear(y);
      syncToValue(day, month, y);
    },
    [day, month, syncToValue]
  );

  const [openPart, setOpenPart] = React.useState<'day' | 'month' | 'year' | null>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!openPart) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenPart(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openPart]);

  const isMobile = useIsMobile();

  // Lock background scroll while mobile wheel is open so picker does not "scroll away"
  React.useEffect(() => {
    if (!isMobile || !mobileOpen) return;
    if (typeof document === 'undefined') return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';
    return () => {
      body.style.overflow = prevOverflow;
    };
  }, [isMobile, mobileOpen]);

  return (
    <>
      <div ref={containerRef} className={cn('relative', className)}>
        {isMobile ? (
          <button
            type="button"
            id={id}
            onClick={() => setMobileOpen(true)}
            onBlur={onBlur}
            className={cn(
              'flex h-10 w-full min-w-0 items-center rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-left ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
              error && 'border-red-500 focus-visible:ring-red-500',
              !value && 'text-slate-500'
            )}
            aria-haspopup="dialog"
            aria-expanded={mobileOpen}
          >
            {value
              ? `${String(day).padStart(2, '0')}.${String(month).padStart(2, '0')}.${year}`
              : 'День · Месяц · Год'}
          </button>
        ) : (
          <div
            id={id}
            onBlur={onBlur}
            className={cn(
              'flex h-10 w-full min-w-0 rounded-lg border border-slate-300 bg-white overflow-hidden ring-offset-white focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2',
              error && 'border-red-500 focus-within:ring-red-500'
            )}
          >
            <button
              type="button"
              className={cn(
                'flex-1 min-w-0 px-2 py-2 text-sm text-center border-r border-slate-200 hover:bg-slate-50',
                openPart === 'day' && 'bg-primary-50 text-primary-800'
              )}
              onClick={() => setOpenPart((p) => (p === 'day' ? null : 'day'))}
              aria-haspopup="listbox"
              aria-expanded={openPart === 'day'}
            >
              {value ? String(day).padStart(2, '0') : '—'}
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 min-w-0 px-2 py-2 text-sm text-center border-r border-slate-200 hover:bg-slate-50',
                openPart === 'month' && 'bg-primary-50 text-primary-800'
              )}
              onClick={() => setOpenPart((p) => (p === 'month' ? null : 'month'))}
              aria-haspopup="listbox"
              aria-expanded={openPart === 'month'}
            >
              {value ? String(month).padStart(2, '0') : '—'}
            </button>
            <button
              type="button"
              className={cn(
                'flex-1 min-w-0 px-2 py-2 text-sm text-center hover:bg-slate-50',
                openPart === 'year' && 'bg-primary-50 text-primary-800'
              )}
              onClick={() => setOpenPart((p) => (p === 'year' ? null : 'year'))}
              aria-haspopup="listbox"
              aria-expanded={openPart === 'year'}
            >
              {value ? year : '—'}
            </button>
          </div>
        )}

        {!isMobile && openPart === 'day' && (
          <DesktopList
            items={DAYS}
            selectedIndex={day - 1}
            onSelect={handleDayChange}
            onClose={() => setOpenPart(null)}
            label="День"
          />
        )}
        {!isMobile && openPart === 'month' && (
          <DesktopList
            items={MONTHS.map((m, i) => `${m} — ${MONTH_NAMES[i]}`)}
            selectedIndex={month - 1}
            onSelect={handleMonthChange}
            onClose={() => setOpenPart(null)}
            label="Месяц"
          />
        )}
        {!isMobile && openPart === 'year' && (
          <DesktopList
            items={YEARS}
            selectedIndex={year - MIN_YEAR}
            onSelect={handleYearChange}
            onClose={() => setOpenPart(null)}
            label="Год"
          />
        )}
      </div>

      {/* Mobile: bottom sheet with wheels */}
      {isMobile && mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            aria-hidden
            onClick={() => setMobileOpen(false)}
          />
          <div
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl border-t border-slate-200 bg-white shadow-xl safe-area-pb"
            role="dialog"
            aria-modal="true"
            aria-label="Выбор даты"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <button
                type="button"
                className="text-slate-500 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Отмена
              </button>
              <span className="font-semibold text-slate-900">Дата</span>
              <button
                type="button"
                className="text-primary-600 font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Готово
              </button>
            </div>
            <div className="flex gap-2 px-2 py-4" style={{ height: 260 }}>
              <WheelColumn
                items={DAYS}
                selectedIndex={day - 1}
                onSelect={handleDayChange}
                label="День"
              />
              <WheelColumn
                items={MONTHS.map((m, i) => `${m} — ${MONTH_NAMES[i]}`)}
                selectedIndex={month - 1}
                onSelect={handleMonthChange}
                label="Месяц"
              />
              <WheelColumn
                items={YEARS}
                selectedIndex={year - MIN_YEAR}
                onSelect={handleYearChange}
                label="Год"
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return isMobile;
}
