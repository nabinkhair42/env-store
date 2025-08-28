'use client';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

type GlimpseProps = ComponentProps<typeof HoverCard>;

export const Glimpse = (props: GlimpseProps) => {
  return <HoverCard {...props} />;
};

type GlimpseContentProps = ComponentProps<typeof HoverCardContent>;

export const GlimpseContent = (props: GlimpseContentProps) => (
  <HoverCardContent {...props} />
);

type GlimpseTriggerProps = ComponentProps<typeof HoverCardTrigger>;

export const GlimpseTrigger = (props: GlimpseTriggerProps) => (
  <HoverCardTrigger {...props} />
);

type GlimpseTitleProps = ComponentProps<'p'>;

export const GlimpseTitle = ({ className, ...props }: GlimpseTitleProps) => {
  return (
    <p className={cn('truncate font-semibold text-sm', className)} {...props} />
  );
};

type GlimpseDescriptionProps = ComponentProps<'p'>;

export const GlimpseDescription = ({
  className,
  ...props
}: GlimpseDescriptionProps) => {
  return (
    <p
      className={cn('line-clamp-2 text-muted-foreground text-sm', className)}
      {...props}
    />
  );
};

import { ImageProps } from 'next/image';

type GlimpseImageProps = Omit<ImageProps, 'src' | 'alt'> & {
  src: string;
  alt?: string;
};

export const GlimpseImage = ({
  className,
  alt,
  src,
  ...props
}: GlimpseImageProps) => (
  <img
    alt={alt ?? ''}
    src={src}
    width={1200}
    height={630}
    className={cn(
      'mb-4 aspect-[120/63] w-full rounded-md border object-cover',
      className
    )}
    {...props}
  />
);
