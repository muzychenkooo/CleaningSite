'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { assetUrl } from '@/lib/asset-url';
import { reviews, PLATFORM_CONFIG, type Platform } from '@/data/reviews';

// ─── constants ───────────────────────────────────────────────────────────────

const GAP = 20; // px — horizontal gap between cards
const TRANSITION_MS = 320;
const LEAVE_REVIEW_URL = PLATFORM_CONFIG.yandex.leaveReviewUrl;

// Total review count across all platforms
const TOTAL_REVIEW_COUNT = Object.values(PLATFORM_CONFIG).reduce(
  (sum, cfg) => sum + cfg.reviewCount,
  0,
);

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

// ─── ArrowIcon ───────────────────────────────────────────────────────────────

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
      {/* Header: avatar + name + date */}
      <div className="flex items-start gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-bold text-slate-600"
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

      {/* Review text */}
      <div className="mt-3 flex-1">
        <ReviewText text={review.text} />
      </div>

      {/* Platform source link */}
      <a
        href={review.platformUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3 text-xs font-medium text-slate-600 hover:text-primary-600 hover:underline focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-500 rounded transition-colors"
      >
        <img
          src={assetUrl(cfg.icon)}
          alt={cfg.label}
          className="h-4 w-4 shrink-0 object-contain"
        />
        Отзыв из {cfg.label}
        <ExternalLinkIcon />
      </a>
    </article>
  );
}

function ReviewText({ text }: { text: string }) {
  const [expanded, setExpanded] = React.useState(false);
  const shouldClamp = text.length > 260;

  return (
    <>
      <p
        className={cn(
          'text-sm leading-relaxed text-slate-600',
          !expanded && shouldClamp && 'line-clamp-4',
        )}
      >
        {text}
      </p>
      {shouldClamp && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-2 text-xs font-semibold text-primary-600 hover:text-primary-700"
        >
          {expanded ? 'Свернуть' : 'Ещё'}
        </button>
      )}
    </>
  );
}

// ─── PlatformPill ────────────────────────────────────────────────────────────

interface PlatformPillProps {
  platform: Platform | 'all';
  label: string;
  rating?: number;
  icon?: string;
  active: boolean;
  onClick: () => void;
}

function PlatformPill({ platform, label, rating, icon, active, onClick }: PlatformPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-1',
        active ? 'bg-primary-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
      )}
    >
      {platform !== 'all' && icon && (
        <span className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white overflow-hidden">
          <img
            src={assetUrl(icon)}
            alt={label}
            className="h-3.5 w-3.5 object-contain"
          />
        </span>
      )}
      <span>{label}</span>
      {rating !== undefined && (
        <span className={cn('font-semibold', active ? 'text-white/80' : 'text-slate-500')}>
          ★ {rating.toFixed(1)}
        </span>
      )}
    </button>
  );
}

// ─── Infinite Carousel Logic ─────────────────────────────────────────────────

/**
 * Builds an extended "infinite loop" array from source items:
 * [clone of last page] + [all items padded to full pages] + [clone of first page]
 * The track starts at extendedPage=1 (the first real page).
 */
function buildInfiniteTrack<T>(items: T[], perPage: number): T[] {
  if (items.length === 0) return [];
  // Pad so total is divisible by perPage
  const padded = [...items];
  while (padded.length % perPage !== 0) {
    padded.push(items[padded.length % items.length]);
  }
  // Prepend last perPage items, append first perPage items
  const head = padded.slice(-perPage);
  const tail = padded.slice(0, perPage);
  return [...head, ...padded, ...tail];
}

// ─── ReviewsCarousel ─────────────────────────────────────────────────────────

export function ReviewsCarousel() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const trackRef = React.useRef<HTMLDivElement>(null);

  const [activePlatform, setActivePlatform] = React.useState<Platform | 'all'>('all');
  const [cardsPerView, setCardsPerView] = React.useState(3);
  const [containerW, setContainerW] = React.useState(0);

  // extendedPage: position in the extended track (1 = first real page, 0 = clone of last)
  const [extendedPage, setExtendedPage] = React.useState(1);
  const [animated, setAnimated] = React.useState(true);

  // ── Measure container width ────────────────────────────────────────────────
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
      const w = window.innerWidth;
      if (w >= 1280) setCardsPerView(4);
      else if (w >= 1024) setCardsPerView(3);
      else if (w >= 640) setCardsPerView(2);
      else setCardsPerView(1);
    }
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  // ── Reset to page 1 when filter or breakpoint changes ──────────────────────
  React.useEffect(() => {
    setAnimated(false);
    setExtendedPage(1);
    // Re-enable animation after one frame
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [activePlatform, cardsPerView]);

  // ── Derived state ──────────────────────────────────────────────────────────
  const filtered =
    activePlatform === 'all' ? reviews : reviews.filter((r) => r.platform === activePlatform);

  const track = buildInfiniteTrack(filtered, cardsPerView);
  const totalRealPages = filtered.length > 0 ? Math.ceil(filtered.length / cardsPerView) : 1;
  // extendedPage ranges from 0 (clone-last) to totalRealPages+1 (clone-first)

  // Real page for dots (0-indexed)
  const realDotPage = Math.max(0, Math.min(extendedPage - 1, totalRealPages - 1));

  // Dots window: show at most MAX_DOTS around the active page
  const MAX_DOTS = 7;
  let dotStart = 0;
  let dotEnd = totalRealPages - 1;
  if (totalRealPages > MAX_DOTS) {
    const half = Math.floor(MAX_DOTS / 2);
    dotStart = Math.max(0, realDotPage - half);
    dotEnd = dotStart + MAX_DOTS - 1;
    if (dotEnd >= totalRealPages) {
      dotEnd = totalRealPages - 1;
      dotStart = dotEnd - MAX_DOTS + 1;
    }
  }

  // translateX: each page occupies (containerW + GAP) pixels
  const translateX = containerW > 0 ? extendedPage * (containerW + GAP) : 0;

  // ── Silent boundary jump after transition ──────────────────────────────────
  // When extendedPage reaches a clone page (0 or totalRealPages+1),
  // wait for the animation to finish, then instantly reset to the real page.
  React.useEffect(() => {
    if (extendedPage !== 0 && extendedPage !== totalRealPages + 1) return;
    const timer = setTimeout(() => {
      setAnimated(false);
      setExtendedPage(extendedPage <= 0 ? totalRealPages : 1);
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    }, TRANSITION_MS);
    return () => clearTimeout(timer);
  }, [extendedPage, totalRealPages]);

  // ── Navigation ─────────────────────────────────────────────────────────────
  function goNext() {
    setAnimated(true);
    setExtendedPage((p) => p + 1);
  }

  function goPrev() {
    setAnimated(true);
    setExtendedPage((p) => p - 1);
  }

  function goToDot(dotIdx: number) {
    setAnimated(true);
    setExtendedPage(dotIdx + 1);
  }

  // ── Touch swipe ────────────────────────────────────────────────────────────
  const touchX = React.useRef(0);
  function onTouchStart(e: React.TouchEvent) { touchX.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? goNext() : goPrev();
  }

  // ── Card width formula ────────────────────────────────────────────────────
  const colWidth = `calc((100% - ${(cardsPerView - 1) * GAP}px) / ${cardsPerView})`;

  const uniquePlatforms = Array.from(new Set(reviews.map((r) => r.platform))) as Platform[];

  return (
    <div>
      {/* ── Top controls ───────────────────────────────────────────────────── */}
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
                  icon={cfg.icon}
                  active={activePlatform === p}
                  onClick={() => setActivePlatform(p)}
                />
              );
            })}
          </div>

          {/* Count line */}
          <p className="mt-2 text-sm text-slate-500">
            {activePlatform === 'all'
              ? `${TOTAL_REVIEW_COUNT} ${pluralReviews(TOTAL_REVIEW_COUNT)} из ${uniquePlatforms.length} источников`
              : `${PLATFORM_CONFIG[activePlatform].reviewCount} ${pluralReviews(PLATFORM_CONFIG[activePlatform].reviewCount)} на платформе`}
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

      {/* ── Carousel track ─────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="mt-6 overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        aria-label="Слайдер с отзывами"
        aria-roledescription="carousel"
      >
        <div
          ref={trackRef}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${track.length}, ${colWidth})`,
            columnGap: `${GAP}px`,
            transform: `translateX(-${translateX}px)`,
            transition: animated ? `transform ${TRANSITION_MS}ms cubic-bezier(0.4,0,0.2,1)` : 'none',
            willChange: 'transform',
          }}
          aria-live="polite"
        >
          {track.map((r, idx) => {
            const pageOfCard = Math.floor(idx / cardsPerView);
            const isVisible = pageOfCard === extendedPage;
            return (
              <div key={`${r.id}-${idx}`} aria-hidden={!isVisible ? true : undefined}>
                <ReviewCard review={r} />
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Dots + arrows navigation ─────────────────────────────────────── */}
      {totalRealPages > 1 && (
        <div className="mt-6 flex items-center justify-center gap-3">
          {/* Prev */}
          <button
            type="button"
            onClick={goPrev}
            aria-label="Предыдущие отзывы"
            className="carousel-arrow flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ArrowIcon dir="left" />
          </button>

          {/* Dots (windowed to avoid overflow on mobile) */}
          <div className="flex items-center gap-0.5" role="group" aria-label="Страницы отзывов">
            {Array.from({ length: dotEnd - dotStart + 1 }).map((_, idx) => {
              const i = dotStart + idx;
              return (
              <button
                key={i}
                type="button"
                onClick={() => goToDot(i)}
                aria-label={`Страница ${i + 1}`}
                aria-current={i === realDotPage ? 'true' : undefined}
                className="flex h-6 w-6 items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
              >
                <span
                  className={cn(
                    'block rounded-full transition-all duration-200',
                    i === realDotPage
                      ? 'h-2.5 w-6 bg-primary-600'
                      : 'h-2.5 w-2.5 bg-slate-300 hover:bg-slate-400'
                  )}
                />
              </button>
            );})}
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={goNext}
            aria-label="Следующие отзывы"
            className="carousel-arrow flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-sm transition-colors hover:border-primary-300 hover:text-primary-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <ArrowIcon dir="right" />
          </button>
        </div>
      )}
    </div>
  );
}
