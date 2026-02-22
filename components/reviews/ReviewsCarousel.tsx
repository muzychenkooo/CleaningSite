'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { reviews, PLATFORM_CONFIG, type Platform } from '@/data/reviews';

// ─── constants ───────────────────────────────────────────────────────────────

const GAP = 20; // px — horizontal gap between cards
const LEAVE_REVIEW_URL = PLATFORM_CONFIG.yandex.leaveReviewUrl;

// ─── helpers ─────────────────────────────────────────────────────────────────

function pluralReviews(n: number) {
  if (n % 10 === 1 && n % 100 !== 11) return 'отзыв';
  if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 'отзыва';
  return 'отзывов';
}

// ─── Stars ───────────────────────────────────────────────────────────────────

function Stars({ n }: { n: number }) {
  return (
    <span className="flex gap-px" aria-label={`${n} из 5 звёзд`} role="img">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={cn('h-3.5 w-3.5 shrink-0', i <= n ? 'text-amber-400' : 'text-slate-200')}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </span>
  );
}

// ─── ChevronArrow (prev/next button icon) ────────────────────────────────────

function ArrowIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'}
      />
    </svg>
  );
}

// ─── ExternalLinkIcon ────────────────────────────────────────────────────────

function ExternalLinkIcon() {
  return (
    <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
      />
    </svg>
  );
}

// ─── ReviewCard ──────────────────────────────────────────────────────────────

interface ReviewCardProps {
  review: (typeof reviews)[0];
}

function ReviewCard({ review }: ReviewCardProps) {
  const cfg = PLATFORM_CONFIG[review.platform];

  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-200 hover:shadow-md">
      {/* Header: avatar + name + date + stars */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold leading-none"
          style={{ backgroundColor: cfg.bgColor, color: cfg.color }}
          aria-hidden
        >
          {review.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="truncate text-sm font-semibold text-slate-900">{review.authorName}</span>
            <Stars n={review.rating} />
          </div>
          <p className="mt-0.5 text-xs text-slate-500">{review.date}</p>
        </div>
      </div>

      {/* Review text — clamped to 4 lines */}
      <p className="mt-3 flex-1 text-sm leading-relaxed text-slate-600 line-clamp-4">
        {review.text}
      </p>

      {/* Platform source link */}
      <a
        href={review.platformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-medium text-primary-600 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded"
      >
        <span
          className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-bold text-white"
          style={{ backgroundColor: cfg.color }}
          aria-hidden
        >
          {cfg.label[0]}
        </span>
        Отзыв из {cfg.label}
        <ExternalLinkIcon />
      </a>
    </article>
  );
}

// ─── PlatformPill ────────────────────────────────────────────────────────────

interface PlatformPillProps {
  platform: Platform | 'all';
  label: string;
  rating?: number;
  color?: string;
  active: boolean;
  onClick: () => void;
}

function PlatformPill({ platform, label, rating, color, active, onClick }: PlatformPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        active
          ? 'bg-primary-600 text-white'
          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      )}
    >
      {platform !== 'all' && color && (
        <span
          className="inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full text-[8px] font-bold text-white"
          style={{ backgroundColor: active ? 'rgba(255,255,255,0.4)' : color }}
          aria-hidden
        >
          {label[0]}
        </span>
      )}
      {label}
      {rating !== undefined && (
        <span className={cn('font-semibold', active ? 'text-white/80' : 'text-slate-500')}>
          ★ {rating.toFixed(1)}
        </span>
      )}
    </button>
  );
}

// ─── ReviewsCarousel ─────────────────────────────────────────────────────────

export function ReviewsCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [activePlatform, setActivePlatform] = React.useState<Platform | 'all'>('all');
  const [currentPage, setCurrentPage] = React.useState(0);
  const [cardsPerView, setCardsPerView] = React.useState(3);
  const [containerW, setContainerW] = React.useState(0);

  // ── Measure container width (client-only) ──────────────────────────────────
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setContainerW(el.clientWidth));
    ro.observe(el);
    setContainerW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  // ── Responsive cards-per-view ──────────────────────────────────────────────
  React.useEffect(() => {
    function update() {
      if (window.innerWidth >= 1024) setCardsPerView(3);
      else if (window.innerWidth >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    }
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Reset page on filter or breakpoint change ──────────────────────────────
  React.useEffect(() => {
    setCurrentPage(0);
  }, [activePlatform, cardsPerView]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const filtered =
    activePlatform === 'all' ? reviews : reviews.filter((r) => r.platform === activePlatform);

  const totalPages = Math.max(1, Math.ceil(filtered.length / cardsPerView));
  const page = Math.min(currentPage, totalPages - 1);

  // translateX: each page = containerW + one gap
  const translateX = containerW > 0 ? page * (containerW + GAP) : 0;

  const uniquePlatforms = Array.from(new Set(reviews.map((r) => r.platform))) as Platform[];

  // ── Navigation ─────────────────────────────────────────────────────────────
  function goToPage(p: number) {
    setCurrentPage(Math.max(0, Math.min(p, totalPages - 1)));
  }

  // ── Touch swipe ────────────────────────────────────────────────────────────
  const touchX = React.useRef(0);
  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) goToPage(page + (diff > 0 ? 1 : -1));
  }

  // ── Card width formula (CSS Grid column — % relative to grid container) ────
  // Each column = (100% - (K-1)*GAP) / K  where 100% = overflow container width
  const colWidth = `calc((100% - ${(cardsPerView - 1) * GAP}px) / ${cardsPerView})`;

  return (
    <div>
      {/* ── Top controls ─────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {/* Platform filter pills */}
          <div className="flex flex-wrap items-center gap-2">
            <PlatformPill
              platform="all"
              label="Все отзывы"
              active={activePlatform === 'all'}
              onClick={() => setActivePlatform('all')}
            />
            {uniquePlatforms.map((p) => {
              const cfg = PLATFORM_CONFIG[p];
              return (
                <PlatformPill
                  key={p}
                  platform={p}
                  label={cfg.label}
                  rating={cfg.rating}
                  color={cfg.color}
                  active={activePlatform === p}
                  onClick={() => setActivePlatform(p)}
                />
              );
            })}
          </div>

          {/* Count line */}
          <p className="mt-2 text-sm text-slate-500">
            {filtered.length} {pluralReviews(filtered.length)}
            {activePlatform === 'all' && ` из ${uniquePlatforms.length} источников`}
          </p>
        </div>

        {/* Leave-review CTA */}
        <a
          href={LEAVE_REVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        >
          Оставить отзыв
          <ExternalLinkIcon />
        </a>
      </div>

      {/* ── Carousel track ───────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="mt-6 overflow-hidden"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label="Слайдер с отзывами"
        aria-roledescription="carousel"
      >
        {/*
          CSS Grid single-row layout:
          - N columns, each `(100% - (K-1)*GAP) / K` wide (100% = container width)
          - translateX = -page * (containerW + GAP) moves exactly one "page" per step
        */}
        <div
          className="transition-transform duration-300 ease-in-out"
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${filtered.length}, ${colWidth})`,
            columnGap: `${GAP}px`,
            transform: `translateX(-${translateX}px)`,
            willChange: 'transform',
          }}
          aria-live="polite"
        >
          {filtered.map((r, idx) => {
            const isVisible = idx >= page * cardsPerView && idx < (page + 1) * cardsPerView;
            return (
              <div key={r.id} aria-hidden={!isVisible ? true : undefined}>
                <ReviewCard review={r} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dots + arrows navigation ────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Prev */}
          <button
            type="button"
            onClick={() => goToPage(page - 1)}
            disabled={page === 0}
            aria-label="Предыдущие отзывы"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ArrowIcon dir="left" />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-0.5" role="group" aria-label="Страницы отзывов">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToPage(i)}
                aria-label={`Страница ${i + 1}`}
                aria-current={i === page ? 'true' : undefined}
                className="flex h-6 w-6 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
              >
                <span
                  className={cn(
                    'block rounded-full transition-all duration-200',
                    i === page
                      ? 'h-2.5 w-6 bg-primary-600'
                      : 'h-2.5 w-2.5 bg-slate-300 hover:bg-slate-400'
                  )}
                />
              </button>
            ))}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages - 1}
            aria-label="Следующие отзывы"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-600 disabled:cursor-not-allowed disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}
