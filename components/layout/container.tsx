import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Global content container.
 * Mobile: comfortable max-width for text blocks, centered.
 * Desktop: wider max-width matching the overall layout grid.
 */
const CONTAINER_CLASS =
  'mx-auto w-full min-w-0 max-w-[560px] sm:max-w-[1440px] px-4 sm:px-6 lg:px-8';

export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(CONTAINER_CLASS, className)}
      {...props}
    />
  );
}
