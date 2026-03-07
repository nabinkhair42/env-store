'use client';

import { LoginDialog } from '@/components/modal/login-dialog';
import Link from 'next/link';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface CTAButtonsProps {
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export function CTAButtons({
  primaryLabel = 'Get Started',
  secondaryHref = 'https://github.com/nabinkhair42/env-store',
  secondaryLabel = 'View Source',
}: CTAButtonsProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handlePrimaryClick = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <button
          onClick={handlePrimaryClick}
          className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5),0_0_32px_rgba(255,255,255,0.1)] transition-opacity hover:opacity-80"
        >
          {primaryLabel}
        </button>

        <Link
          href={secondaryHref}
          className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted/30"
        >
          <FaGithub className="w-4 h-4" /> {secondaryLabel}
        </Link>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
