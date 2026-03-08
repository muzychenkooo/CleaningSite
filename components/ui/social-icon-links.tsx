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

const BUTTON_ITEMS = [
  {
    key: 'max' as const,
    hrefKey: 'max' as const,
    label: 'Написать в MAX',
    borderClass: 'border-violet-300 hover:border-violet-400',
    iconSize: 20,
  },
  {
    key: 'vk' as const,
    hrefKey: 'vk' as const,
    label: 'Написать в VK',
    borderClass: 'border-blue-400 hover:border-blue-500',
    iconSize: 20,
  },
  {
    key: 'telegram' as const,
    hrefKey: 'telegram' as const,
    label: 'Написать в Telegram',
    borderClass: 'border-sky-400 hover:border-sky-500',
    iconSize: 20,
  },
] as const;

export function SocialIconLinks({
  size = 'md',
  variant = 'icons',
  className,
}: {
  size?: Size;
  variant?: 'icons' | 'buttons';
  className?: string;
}) {
  const linkSizeClass = sizeClasses[size];

  if (variant === 'buttons') {
    return (
      <div
        className={cn('flex flex-wrap lg:flex-nowrap items-center justify-center lg:justify-start gap-2 sm:gap-3 w-full min-w-0', className)}
        role="group"
        aria-label="Мессенджеры"
      >
        {BUTTON_ITEMS.map((item) => (
          <a
            key={item.key}
            href={site.social[item.hrefKey]}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 h-10 rounded-full border-2 bg-white px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-slate-900 transition-colors shrink-0',
              item.borderClass,
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2'
            )}
            aria-label={item.label}
          >
            <Image
              src={assetUrl(SOCIAL_IMAGES[item.key])}
              alt=""
              width={item.iconSize}
              height={item.iconSize}
              className="h-5 w-5 shrink-0 object-contain"
              aria-hidden
            />
            <span>{item.label}</span>
          </a>
        ))}
      </div>
    );
  }

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
