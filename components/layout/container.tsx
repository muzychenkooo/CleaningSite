import * as React from 'react';
import { cn } from '@/lib/utils';

/** Single content width for the whole site: 1280px max + consistent horizontal padding. min-w-0 prevents flex overflow. */
const CONTAINER_CLASS = 'mx-auto w-full min-w-0 max-w-[1280px] px-4 sm:px-6 lg:px-8';

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
