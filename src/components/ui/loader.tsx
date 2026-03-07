'use client';

import { cn } from '@/lib/utils';

type LoaderProps = {
  className?: string;
};

const LoaderScreen = ({ className }: LoaderProps) => {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <span
        role="status"
        aria-label="Loading"
        className={cn(
          'inline-block size-8 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-foreground',
          className
        )}
      />
    </div>
  );
};

export default LoaderScreen;
