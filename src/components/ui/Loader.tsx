'use client';

import { cn } from '@/lib/utils';
import { LoadingFreeIcons } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';

type LoaderProps = {
  className?: string;
};

const LoaderScreen = ({ className }: LoaderProps) => {
  return (
    <div className="min-h-svh  flex items-center justify-center border border-dashed border-t-0 border-b-0 max-w-4xl mx-auto">
      <div className="text-center flex flex-col items-center ">
        <HugeiconsIcon icon={LoadingFreeIcons} strokeWidth={2} />
        <span
          role="status"
          aria-label="Loading"
          className={cn(
            'inline-block h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/40 border-t-foreground',
            className
          )}
        />
      </div>
    </div>
  );
};

export default LoaderScreen;
