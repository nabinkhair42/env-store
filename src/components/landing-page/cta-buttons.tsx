'use client';

import { Button } from '@/components/ui/button';
import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  GlimpseTitle,
  GlimpseTrigger,
} from '@/components/ui/glimpse';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { FaGithub } from 'react-icons/fa6';
import { LoginDialog } from '@/components/modal/LoginDialog';
import { useState } from 'react';

interface CTAButtonsProps {
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  glimpseData?: {
    image: string | null;
    title: string;
    description: string;
  };
}

export function CTAButtons({
  primaryLabel = 'Get Started',
  secondaryHref = 'https://github.com/nabinkhair42/env-store',
  secondaryLabel = 'View Source',
  glimpseData,
}: CTAButtonsProps) {
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Button size="default" onClick={() => setLoginOpen(true)}>
          {primaryLabel} <ChevronRight className="w-4 h-4" />
        </Button>

        <Glimpse closeDelay={0} openDelay={0}>
          <GlimpseTrigger asChild>
            <Button asChild variant="outline">
              <Link href={secondaryHref}>
                <FaGithub className="w-4 h-4" /> {secondaryLabel}
              </Link>
            </Button>
          </GlimpseTrigger>
          {glimpseData && (
            <GlimpseContent className="w-80">
              <GlimpseImage src={glimpseData.image ?? ''} />
              <GlimpseTitle>{glimpseData.title}</GlimpseTitle>
              <GlimpseDescription>{glimpseData.description}</GlimpseDescription>
            </GlimpseContent>
          )}
        </Glimpse>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
