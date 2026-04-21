'use client';

import { LoginDialog } from '@/components/modal/login-dialog';
import { HugeiconsIcon } from '@hugeicons/react';
import { GithubIcon } from '@hugeicons/core-free-icons';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '../ui/button';

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
        <Button onClick={handlePrimaryClick} size="lg">
          {primaryLabel}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={() => {
            window.location.href = secondaryHref;
          }}
        >
          <HugeiconsIcon icon={GithubIcon} size={16} />
          {secondaryLabel}
        </Button>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
