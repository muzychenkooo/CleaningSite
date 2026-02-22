'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface VideoWithOverlayProps {
  /** URL of the video file */
  src: string;
  /** Optional poster/cover image URL shown before playback */
  poster?: string;
  /** aria-label for the <video> element */
  label?: string;
  /** Extra Tailwind classes applied to the outer wrapper (relative + overflow-hidden are always added) */
  wrapperClassName?: string;
  /** Extra Tailwind classes applied to the <video> element */
  videoClassName?: string;
}

/**
 * A video element with a full-cover clickable overlay that disappears (fade)
 * when the user clicks anywhere on it, then starts playback immediately.
 *
 * - Fully accessible: overlay is a <button> with aria-label.
 * - Handles autoplay-blocked promise gracefully.
 * - Respects prefers-reduced-motion for the fade transition.
 */
export function VideoWithOverlay({
  src,
  poster,
  label,
  wrapperClassName,
  videoClassName,
}: VideoWithOverlayProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = React.useState(false);

  const handlePlay = () => {
    // Hide overlay immediately; even if autoplay is blocked, native controls remain
    setPlaying(true);
    videoRef.current?.play().catch(() => {
      // Silently swallow — browser blocked autoplay. Overlay is already hidden
      // so user can click the native play button.
    });
  };

  return (
    <div className={cn('relative overflow-hidden', wrapperClassName)}>
      <video
        ref={videoRef}
        src={src}
        controls
        preload="metadata"
        playsInline
        className={videoClassName}
        aria-label={label}
      />

      {/* ── Overlay ── */}
      <button
        type="button"
        onClick={handlePlay}
        aria-label="Запустить видео"
        aria-hidden={playing}
        tabIndex={playing ? -1 : 0}
        className={cn(
          // Base layout
          'group absolute inset-0 flex items-center justify-center',
          // Focus ring matching site design tokens
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
          // Smooth fade-out; respects prefers-reduced-motion
          'transition-opacity duration-300 motion-reduce:transition-none',
          playing ? 'pointer-events-none opacity-0' : 'opacity-100',
        )}
        style={
          poster
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.50) 100%), url('${poster}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : {
                background: 'linear-gradient(135deg, rgba(15,23,42,0.75) 0%, rgba(15,23,42,0.90) 100%)',
              }
        }
      >
        {/* Play button — round circle with primary-colored triangle */}
        <span
          aria-hidden
          className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-primary-600 shadow-xl ring-2 ring-white/30 transition-all duration-200 group-hover:scale-110 group-hover:bg-white group-focus-visible:scale-110"
        >
          {/* Material "play_arrow" path */}
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-7 w-7 translate-x-0.5"
            aria-hidden
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    </div>
  );
}
