'use client';

import { LoginDialog } from '@/components/modal/login-dialog';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';
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
        <Button
          onClick={handlePrimaryClick}
          size={'lg'}
          className="cursor-pointer"
        >
          {primaryLabel}
        </Button>
        <Button
          variant="outline"
          className="cursor-pointer"
          size={'lg'}
          onClick={() => {
            window.location.href = secondaryHref;
          }}
        >
          <FaGithub className="w-4 h-4" /> {secondaryLabel}
        </Button>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
