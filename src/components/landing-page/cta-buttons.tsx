'use client';

import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa';

interface CTAButtonsProps {
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CTAButtons({
  primaryHref = '/dashboard',
  primaryLabel = 'Open App',
  secondaryHref = 'https://github.com/nabinkhair42/env-store',
  secondaryLabel = 'View Source',
}: CTAButtonsProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
      <Button asChild size="lg" className="px-8">
        <Link href={primaryHref}>
          {primaryLabel} <ChevronRight className="w-4 h-4" />
        </Link>
      </Button>

      <Button asChild variant="outline" size="lg" className="px-8">
        <Link href={secondaryHref} target="_blank" rel="noopener noreferrer">
          <FaGithub className="w-4 h-4" />
          {secondaryLabel}
        </Link>
      </Button>
    </div>
  );
}
