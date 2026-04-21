'use client';

import { LoginDialog } from '@/components/dialogs/login-dialog';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/lib/sitemap';
import { GithubIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CTAButtonsProps {
  primaryLabel?: string;
  secondaryLabel?: string;
}

export function CTAButtons({
  primaryLabel = 'Get Started',
  secondaryLabel = 'View Source',
}: CTAButtonsProps) {
  const [loginOpen, setLoginOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  return (
    <>
      <div className="flex flex-col items-center gap-3 sm:flex-row">
        <Button
          size="lg"
          onClick={() =>
            session ? router.push('/dashboard') : setLoginOpen(true)
          }
        >
          {primaryLabel}
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link href={siteConfig.repo}>
            <HugeiconsIcon icon={GithubIcon} size={16} />
            {secondaryLabel}
          </Link>
        </Button>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
