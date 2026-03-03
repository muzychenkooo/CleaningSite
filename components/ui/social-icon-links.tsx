'use client';

import Image from 'next/image';
import { site } from '@/data/site';
import { assetUrl } from '@/lib/asset-url';
import { cn } from '@/lib/utils';

const ICON_PX = 32;

const sizeClasses = {
  sm: 'h-8 w-8 min-h-8 min-w-8',
  md: 'h-8 w-8 min-h-8 min-w-8',
  lg: 'h-10 w-10 min-h-10 min-w-10',
  xl: 'h-12 w-12 min-h-12 min-w-12',
} as const;

type Size = 'sm' | 'md' | 'lg' | 'xl';

const linkClass =
  'inline-flex shrink-0 items-center justify-center rounded-full overflow-hidden transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 [&>span]:!block [&>span]:!h-full [&>span]:!w-full [&>span]:!min-w-0';

const SOCIAL_IMAGES = {
  max: '/assets/social/max.webp',
  vk: '/assets/social/vk.png',
  telegram: '/assets/social/telegram.png',
} as const;

export function SocialIconLinks({
  size = 'md',
  className,
}: {
  size?: Size;
  className?: string;
}) {
  const linkSizeClass = sizeClasses[size];

  return (
    <div className={cn('flex items-center gap-2', className)} role="group" aria-label="Мессенджеры">
      <a
        href={site.social.max}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkClass, linkSizeClass)}
        aria-label="Написать в MAX"
      >
        <span className="sr-only">MAX</span>
        <Image
          src={assetUrl(SOCIAL_IMAGES.max)}
          alt=""
          width={ICON_PX}
          height={ICON_PX}
          className="h-full w-full object-cover"
          aria-hidden
        />
      </a>
      <a
        href={site.social.vk}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkClass, linkSizeClass)}
        aria-label="ВКонтакте"
      >
        <span className="sr-only">VK</span>
        <Image
          src={assetUrl(SOCIAL_IMAGES.vk)}
          alt=""
          width={ICON_PX}
          height={ICON_PX}
          className="h-full w-full object-cover"
          aria-hidden
        />
      </a>
      <a
        href={site.social.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(linkClass, linkSizeClass)}
        aria-label="Telegram"
      >
        <span className="sr-only">Telegram</span>
        <Image
          src={assetUrl(SOCIAL_IMAGES.telegram)}
          alt=""
          width={ICON_PX}
          height={ICON_PX}
          className="h-full w-full object-cover"
          aria-hidden
        />
      </a>
    </div>
  );
}
