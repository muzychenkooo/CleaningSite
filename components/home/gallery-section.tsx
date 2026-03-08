'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/container';
import { completedReports } from '@/data/reports';
import { VideoWithOverlay } from '@/components/ui/VideoWithOverlay';
import { assetUrl } from '@/lib/asset-url';

/* ─── Gallery photos ─────────────────────────────────────────────────── */
const galleryPhotos = [
  { src: '/assets/gallery/1000004534.jpg', alt: 'Уборка — фото 1' },
  { src: '/assets/gallery/1000006679.jpg', alt: 'Уборка — фото 2' },
  { src: '/assets/gallery/20220806.jpg', alt: 'Уборка — фото 5' },
  { src: '/assets/gallery/20250219.jpg', alt: 'Уборка — фото 6' },
  { src: '/assets/gallery/20250709.jpg', alt: 'Уборка — фото 7' },
  { src: '/assets/gallery/IMG_20230225.jpg', alt: 'Уборка — фото 8' },
  { src: '/assets/gallery/IMG_20230310.jpg', alt: 'Уборка — фото 9' },
  { src: '/assets/gallery/IMG_20230723.jpg', alt: 'Уборка — фото 10' },
  { src: '/assets/gallery/IMG_20240712.jpg', alt: 'Уборка — фото 11' },
  { src: '/assets/gallery/IMG_20241113.jpg', alt: 'Уборка — фото 12' },
  /* Загруженные фото «Мы в процессе» */
  { src: '/assets/gallery/20220806_164020-c7d28d52-3992-4159-8afe-a3f5d89057b7.png', alt: 'Уборка — мы в процессе 1' },
  { src: '/assets/gallery/20220813_174255-c717d6d5-822e-4659-9ddb-2c2d1126cdd9.png', alt: 'Уборка — мы в процессе 2' },
  { src: '/assets/gallery/20220820_104103-528b32bf-58d5-4674-a726-ff0798582ce7.png', alt: 'Уборка — мы в процессе 3' },
  { src: '/assets/gallery/20220820_164514-c5b22d81-7cf5-48c4-b295-c68d235d4f66.png', alt: 'Уборка — мы в процессе 4' },
  { src: '/assets/gallery/20250605_141357-efb6b450-47a9-4854-824d-dba77bbff624.png', alt: 'Уборка — мы в процессе 5' },
  { src: '/assets/gallery/20260123_102724-98ec1710-c4ce-4951-b4d5-2633e1686d18.png', alt: 'Уборка — мы в процессе 6' },
  { src: '/assets/gallery/20260123_142851-cc64339a-e665-42d4-91e3-27234782a2df.png', alt: 'Уборка — мы в процессе 7' },
  { src: '/assets/gallery/IMG_20230223_155646-2fd95a99-a08a-4a96-9ac5-028456b4bc52.png', alt: 'Уборка — мы в процессе 8' },
  { src: '/assets/gallery/IMG_20230223_163415-2a667984-8ce1-4c91-8d32-565162f85261.png', alt: 'Уборка — мы в процессе 9' },
  { src: '/assets/gallery/IMG_20230310_141722-4598cb79-2af4-40cb-affd-4d2404f6aede.png', alt: 'Уборка — мы в процессе 10' },
  { src: '/assets/gallery/IMG_20230512_140333-698f9d1e-039c-47be-a1fe-0970b223a327.png', alt: 'Уборка — мы в процессе 11' },
  { src: '/assets/gallery/IMG_20240601_150532-e9ff74c5-40cf-4bf3-9fa8-c22d4a905c0b.png', alt: 'Уборка — мы в процессе 12' },
  { src: '/assets/gallery/IMG_20240614_103400-073c0ed1-5b21-4d0f-b4e2-cdd971406c9f.png', alt: 'Уборка — мы в процессе 13' },
];

/* ─── Carousel constants ─────────────────────────────────────────────── */
const TOTAL = galleryPhotos.length;

/**
 * Build the extended array for infinite-loop carousel.
 *   [ tail clones | originals | head clones ]
 * The clone count equals `visible` so that we always have enough
 * buffer on each side when sliding.
 */
function buildExtended(visible: number) {
  const clone = visible;
  return {
    extended: [
      ...galleryPhotos.slice(-clone),
      ...galleryPhotos,
      ...galleryPhotos.slice(0, clone),
    ],
    clone,
    initOffset: clone,
  };
}

/* ─── Component ──────────────────────────────────────────────────────── */
export function GallerySection() {
  // Responsive visible count: 1 on mobile (<640px), 2 on sm+
  // SSR-safe: default to 2 (matches most initial renders); corrected on mount.
  const [visibleCount, setVisibleCount] = React.useState(2);
  const visibleRef = React.useRef(2);

  const [offset, setOffset] = React.useState(2); // INIT_OFFSET for visible=2
  const [animated, setAnimated] = React.useState(true);
  const [busy, setBusy] = React.useState(false);

  const [isMobile, setIsMobile] = React.useState(false);

  // Keep a ref so transitionEnd handler always reads the latest offset
  const offsetRef = React.useRef(2);

  /* ─── Reports carousel: 1 on mobile, 2 on sm-md, 3 on lg ─── */
  const TOTAL_REPORTS = completedReports.length;
  const buildExtendedReports = React.useCallback((visible: number) => {
    const clone = visible;
    return {
      extended: [
        ...completedReports.slice(-clone),
        ...completedReports,
        ...completedReports.slice(0, clone),
      ],
      clone,
      initOffset: clone,
    };
  }, []);

  const [reportsVisibleCount, setReportsVisibleCount] = React.useState(3);
  const [reportsOffset, setReportsOffset] = React.useState(3);
  const [reportsAnimated, setReportsAnimated] = React.useState(true);
  const [reportsBusy, setReportsBusy] = React.useState(false);
  const reportsOffsetRef = React.useRef(3);
  const reportsVisibleRef = React.useRef(3);
  const reportsCloneRef = React.useRef(3);
  const { extended: REPORTS_EXTENDED, clone: REPORTS_CLONE } = buildExtendedReports(reportsVisibleCount);
  const REPORTS_EXT_LEN = REPORTS_EXTENDED.length;
  reportsCloneRef.current = REPORTS_CLONE;

  const reportsTouchX = React.useRef(0);
  const reportsHandleTouchStart = (e: React.TouchEvent) => {
    reportsTouchX.current = e.touches[0]?.clientX ?? 0;
  };
  const reportsHandleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = reportsTouchX.current - endX;
    if (Math.abs(diff) > 48) {
      if (diff > 0) reportsHandleNext();
      else reportsHandlePrev();
    }
  };

  React.useEffect(() => {
    function updateReports() {
      const w = window.innerWidth;
      const v = w < 640 ? 1 : w < 1024 ? 2 : 3;
      if (v === reportsVisibleRef.current) return;
      reportsVisibleRef.current = v;
      const { initOffset } = buildExtendedReports(v);
      reportsOffsetRef.current = initOffset;
      setReportsOffset(initOffset);
      setReportsAnimated(false);
      setReportsVisibleCount(v);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setReportsAnimated(true)),
      );
    }
    updateReports();
    window.addEventListener('resize', updateReports, { passive: true });
    return () => window.removeEventListener('resize', updateReports);
  }, [buildExtendedReports]);

  const reportsMoveTo = React.useCallback((newOffset: number, withAnim: boolean) => {
    reportsOffsetRef.current = newOffset;
    setReportsAnimated(withAnim);
    setReportsOffset(newOffset);
  }, []);

  const reportsHandlePrev = () => {
    if (reportsBusy) return;
    setReportsBusy(true);
    reportsMoveTo(reportsOffsetRef.current - 1, true);
  };
  const reportsHandleNext = () => {
    if (reportsBusy) return;
    setReportsBusy(true);
    reportsMoveTo(reportsOffsetRef.current + 1, true);
  };
  const reportsHandleDotClick = (i: number) => {
    if (reportsBusy) return;
    const target = REPORTS_CLONE + i;
    if (target === reportsOffsetRef.current) return;
    setReportsBusy(true);
    reportsMoveTo(target, true);
  };

  const reportsHandleTransitionEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;
      const cur = reportsOffsetRef.current;
      const cl = reportsCloneRef.current;
      if (cur <= cl - 1) {
        const jump = TOTAL_REPORTS + cur;
        reportsMoveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setReportsAnimated(true);
            setReportsBusy(false);
          }),
        );
      } else if (cur >= cl + TOTAL_REPORTS) {
        const jump = cl + (cur - cl - TOTAL_REPORTS);
        reportsMoveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setReportsAnimated(true);
            setReportsBusy(false);
          }),
        );
      } else {
        setReportsBusy(false);
      }
    },
    [reportsMoveTo],
  );

  const reportsLogicalIndex = ((reportsOffset - REPORTS_CLONE) % TOTAL_REPORTS + TOTAL_REPORTS) % TOTAL_REPORTS;
  const reportsTrackStyle: React.CSSProperties = {
    width: `${(REPORTS_EXT_LEN / reportsVisibleCount) * 100}%`,
    transform: `translateX(-${(reportsOffset / REPORTS_EXT_LEN) * 100}%)`,
    transition: reportsAnimated ? 'transform 420ms cubic-bezier(0.4,0,0.2,1)' : 'none',
  };

  // Rebuild derived values whenever visibleCount changes
  const { extended: EXTENDED, clone: CLONE } = buildExtended(visibleCount);
  const EXT_LEN = EXTENDED.length;

  const touchX = React.useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? 0;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0;
    const diff = touchX.current - endX;
    if (Math.abs(diff) > 48) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Sync responsive visible count and reset carousel on breakpoint change
  React.useEffect(() => {
    function update() {
      const v = window.innerWidth < 640 ? 1 : 2;
      if (v === visibleRef.current) return;
      visibleRef.current = v;
      const { initOffset } = buildExtended(v);
      offsetRef.current = initOffset;
      setOffset(initOffset);
      setAnimated(false);
      setVisibleCount(v);
      setIsMobile(v === 1);
      // Re-enable animation after DOM settles
      requestAnimationFrame(() => requestAnimationFrame(() => setAnimated(true)));
    }
    update();
    window.addEventListener('resize', update, { passive: true });
    return () => window.removeEventListener('resize', update);
  }, []);

  const moveTo = React.useCallback((newOffset: number, withAnim: boolean) => {
    offsetRef.current = newOffset;
    setAnimated(withAnim);
    setOffset(newOffset);
  }, []);

  const handlePrev = () => {
    if (busy) return;
    setBusy(true);
    moveTo(offsetRef.current - 1, true);
  };

  const handleNext = () => {
    if (busy) return;
    setBusy(true);
    moveTo(offsetRef.current + 1, true);
  };

  const handleDotClick = (i: number) => {
    if (busy) return;
    const target = CLONE + i; // CLONE is current from closure
    if (target === offsetRef.current) return;
    setBusy(true);
    moveTo(target, true);
  };

  /**
   * After each CSS transition:
   * - If we slid into the start-clone zone (offset ≤ CLONE-1), snap to the
   *   matching real position at the tail end of the originals.
   * - If we slid into the end-clone zone (offset ≥ CLONE+TOTAL), snap back
   *   to the matching real position at the head of the originals.
   * In both cases, disable animation for the snap, then re-enable immediately
   * on the next two animation frames so the user never sees the jump.
   *
   * Uses refs for clone/total to avoid stale closure bugs on resize.
   */
  const cloneRef2 = React.useRef(CLONE);
  cloneRef2.current = CLONE;

  const handleTransitionEnd = React.useCallback(
    (e: React.TransitionEvent<HTMLDivElement>) => {
      if (e.propertyName !== 'transform') return;

      const cur = offsetRef.current;
      const cl = cloneRef2.current;

      if (cur <= cl - 1) {
        const jump = TOTAL + cur;
        moveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimated(true);
            setBusy(false);
          }),
        );
      } else if (cur >= cl + TOTAL) {
        const jump = cl + (cur - cl - TOTAL);
        moveTo(jump, false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            setAnimated(true);
            setBusy(false);
          }),
        );
      } else {
        setBusy(false);
      }
    },
    [moveTo],
  );

  // Which original photo index is at the left of the visible window
  const logicalIndex = ((offset - CLONE) % TOTAL + TOTAL) % TOTAL;

  /* ─── Lightbox для фото «Мы в процессе» ─── */
  const [lightboxIndex, setLightboxIndex] = React.useState<number | null>(null);
  const openLightbox = (extendedIndex: number) => {
    const originalIndex = ((extendedIndex - CLONE) % TOTAL + TOTAL) % TOTAL;
    setLightboxIndex(originalIndex);
  };
  const closeLightbox = () => setLightboxIndex(null);
  const lightboxPrev = () => {
    setLightboxIndex((prev) => (prev === null ? null : (prev - 1 + TOTAL) % TOTAL));
  };
  const lightboxNext = () => {
    setLightboxIndex((prev) => (prev === null ? null : (prev + 1) % TOTAL));
  };
  React.useEffect(() => {
    if (lightboxIndex === null) return;
    const onEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
    };
    document.addEventListener('keydown', onEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onEscape);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  /**
   * CSS math:
   *   Track width  = (EXT_LEN / visibleCount) * 100%  of container
   *   Item width   = (1 / EXT_LEN) * 100%              of track
   *   translateX   = -(offset / EXT_LEN) * 100%        of track
   *
   * Simplifies to:
   *   Each item  = (1 / visibleCount) * 100% of container
   *   Each step  = (1 / visibleCount) * 100% of container
   */
  const trackStyle: React.CSSProperties = {
    width: `${(EXT_LEN / visibleCount) * 100}%`,
    transform: `translateX(-${(offset / EXT_LEN) * 100}%)`,
    transition: animated ? 'transform 420ms cubic-bezier(0.4,0,0.2,1)' : 'none',
  };

  return (
    <section id="foto-video" className="w-full py-16 sm:py-24 bg-slate-50 scroll-mt-20">
      <Container>

        {/* ── Фото с места ── */}
        <h2 className="font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Мы в процессе
        </h2>

        <div className="mt-6 relative">
          {/* Viewport — занимает почти всю ширину; стрелки поверх */}
          <div
            className="mx-0 sm:mx-12 overflow-hidden touch-pan-y"
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div
              style={trackStyle}
              onTransitionEnd={handleTransitionEnd}
              className="flex"
            >
              {EXTENDED.map((photo, i) => (
                <div
                  key={i}
                  style={{ width: `${(1 / EXT_LEN) * 100}%` }}
                  className="shrink-0 px-1 sm:px-2"
                >
                  <button
                    type="button"
                    onClick={() => openLightbox(i)}
                    className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-slate-200 shadow-sm block cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
                    aria-label={`Открыть ${photo.alt}`}
                  >
                    <Image
                      src={assetUrl(photo.src)}
                      alt={photo.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 639px) 100vw, 60vw"
                      loading="lazy"
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Prev — только на sm+, поверх фото, полупрозрачные; на мобиле скрыты, свайп работает */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={busy}
            aria-label="Предыдущее фото"
            className="carousel-arrow flex absolute left-3 sm:left-12 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-0 bg-white/70 shadow-md text-slate-800 hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-xl sm:text-2xl select-none z-10"
          >
            ‹
          </button>

          {/* Next */}
          <button
            type="button"
            onClick={handleNext}
            disabled={busy}
            aria-label="Следующее фото"
            className="carousel-arrow flex absolute right-3 sm:right-12 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-0 bg-white/70 shadow-md text-slate-800 hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-xl sm:text-2xl select-none z-10"
          >
            ›
          </button>
        </div>

        {/* Lightbox: полноэкранный просмотр фото */}
        {lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Просмотр фото"
          >
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute inset-0 cursor-default"
              aria-label="Закрыть"
            />
            <div
              className="relative z-10 max-h-full max-w-full w-full h-full flex items-center justify-center cursor-default"
              onClick={closeLightbox}
              role="presentation"
            >
              <Image
                src={assetUrl(galleryPhotos[lightboxIndex].src)}
                alt={galleryPhotos[lightboxIndex].alt}
                width={1920}
                height={1440}
                className="max-h-full max-w-full w-auto h-auto object-contain cursor-default"
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <button
              type="button"
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              aria-label="Закрыть"
            >
              ×
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); lightboxPrev(); }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 shadow-md text-slate-800 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-2xl select-none"
              aria-label="Предыдущее фото"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); lightboxNext(); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex h-12 w-12 items-center justify-center rounded-full border-0 bg-white/70 shadow-md text-slate-800 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white transition-colors text-2xl select-none"
              aria-label="Следующее фото"
            >
              ›
            </button>
          </div>
        )}

        {/* Dots (windowed, чтобы не выезжали за экран) */}
        <div className="mt-4 flex justify-center gap-1" role="group" aria-label="Слайды">
          {(() => {
            const MAX_DOTS = 7;
            let start = 0;
            let end = TOTAL - 1;
            if (TOTAL > MAX_DOTS) {
              const half = Math.floor(MAX_DOTS / 2);
              start = Math.max(0, logicalIndex - half);
              end = start + MAX_DOTS - 1;
              if (end >= TOTAL) {
                end = TOTAL - 1;
                start = end - MAX_DOTS + 1;
              }
            }
            return Array.from({ length: end - start + 1 }).map((_, idx) => {
              const i = start + idx;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleDotClick(i)}
                  aria-label={`Фото ${i + 1}`}
                  aria-current={i === logicalIndex ? 'true' : undefined}
                  className="flex h-6 w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 ${
                      i === logicalIndex
                        ? 'h-2 w-6 bg-primary-600'
                        : 'h-2 w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                </button>
              );
            });
          })()}
        </div>

        {/* ── Видео с объектов ── */}
        <h2 className="font-display mt-16 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Видео с объектов
        </h2>
        <div className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-start">
          <VideoWithOverlay
            src={assetUrl('/assets/videos/video1.mp4')}
            poster={assetUrl('/assets/gallery/video1-poster.png')}
            label="Видео с объектов — 1"
            wrapperClassName="flex-1 rounded-xl bg-slate-900 shadow-sm"
            videoClassName="w-full aspect-video object-cover"
          />
          <VideoWithOverlay
            src={assetUrl('/assets/videos/video2.mp4')}
            poster={assetUrl('/assets/gallery/video2-poster.png')}
            label="Видео с объектов — 2"
            wrapperClassName="flex-1 rounded-xl bg-slate-900 shadow-sm"
            videoClassName="w-full aspect-video object-cover"
          />
        </div>

        {/* ── Выполненные работы (слайдер: 1 на мобиле, 3 на ПК) ── */}
        <h2 className="font-display mt-16 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Выполненные работы
        </h2>
        <div className="mt-6 relative">
          <div
            className="mx-0 sm:mx-12 overflow-hidden touch-pan-y"
            onTouchStart={reportsHandleTouchStart}
            onTouchEnd={reportsHandleTouchEnd}
          >
            <div
              style={reportsTrackStyle}
              onTransitionEnd={reportsHandleTransitionEnd}
              className="flex"
            >
              {REPORTS_EXTENDED.map((report, i) => (
                <div
                  key={`${report.id}-${i}`}
                  style={{ width: `${(1 / REPORTS_EXT_LEN) * 100}%` }}
                  className="shrink-0 px-1 sm:px-2"
                >
                  <div className="rounded-xl border border-slate-200 bg-white p-6 h-full flex flex-col">
                    <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden bg-slate-200">
                      <Image
                        src={assetUrl('image' in report && report.image ? report.image : '/assets/restaurant/restaurant.png')}
                        alt={report.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, (max-width: 1023px) 50vw, 33vw"
                        loading="lazy"
                        style={'imagePosition' in report && report.imagePosition ? { objectPosition: report.imagePosition } : undefined}
                      />
                    </div>
                    <div className="mt-4 flex-1 flex flex-col min-h-0">
                      <h3 className="font-semibold text-slate-900">{report.title}</h3>
                      <p className="mt-2 text-sm text-slate-600 line-clamp-3">{report.excerpt}</p>
                      <div className="flex-1 min-h-0" aria-hidden />
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <Link
                          href={report.href}
                          className="text-sm font-medium text-primary-600 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
                        >
                          Читать далее
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={reportsHandlePrev}
            disabled={reportsBusy}
            aria-label="Предыдущие работы"
            className="carousel-arrow flex absolute left-3 sm:left-12 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-0 bg-white/70 shadow-md text-slate-800 hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-xl sm:text-2xl select-none z-10"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={reportsHandleNext}
            disabled={reportsBusy}
            aria-label="Следующие работы"
            className="carousel-arrow flex absolute right-3 sm:right-12 top-1/2 -translate-y-1/2 h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full border-0 bg-white/70 shadow-md text-slate-800 hover:bg-white/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 transition-colors disabled:opacity-40 text-xl sm:text-2xl select-none z-10"
          >
            ›
          </button>
        </div>
        <div className="mt-4 flex justify-center gap-1" role="group" aria-label="Слайды выполненных работ">
          {Array.from({ length: TOTAL_REPORTS }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => reportsHandleDotClick(i)}
              aria-label={`Работа ${i + 1}`}
              aria-current={i === reportsLogicalIndex ? 'true' : undefined}
              className="flex h-6 w-6 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 rounded"
            >
              <span
                className={`block rounded-full transition-all duration-300 ${
                  i === reportsLogicalIndex ? 'h-2 w-6 bg-primary-600' : 'h-2 w-2 bg-slate-300 hover:bg-slate-400'
                }`}
              />
            </button>
          ))}
        </div>

      </Container>
    </section>
  );
}
