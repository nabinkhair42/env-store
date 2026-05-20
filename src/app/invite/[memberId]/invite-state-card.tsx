'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { GithubIcon } from '@hugeicons/core-free-icons';
import { HugeiconsIcon } from '@hugeicons/react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useState } from 'react';

interface InviteStateCardProps {
  title: string;
  description: string;
  showSignIn?: boolean;
  callbackPath?: string;
  ctaHref?: string;
  ctaLabel?: string;
}

export function InviteStateCard({
  title,
  description,
  showSignIn,
  callbackPath,
  ctaHref,
  ctaLabel,
}: InviteStateCardProps) {
  const [signingIn, setSigningIn] = useState(false);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-md items-center px-6 pt-24 pb-12">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        {(showSignIn || ctaHref) && (
          <>
            <CardContent />
            <CardFooter>
              {showSignIn && (
                <Button
                  size="lg"
                  disabled={signingIn}
                  onClick={() => {
                    setSigningIn(true);
                    signIn('github', {
                      redirectTo: callbackPath ?? '/dashboard',
                    }).catch(() => setSigningIn(false));
                  }}
                  className="w-full"
                >
                  {signingIn ? (
                    <>
                      <Spinner />
                      Signing in
                    </>
                  ) : (
                    <>
                      <HugeiconsIcon icon={GithubIcon} size={18} />
                      Continue with GitHub
                    </>
                  )}
                </Button>
              )}
              {!showSignIn && ctaHref && (
                <Button asChild size="lg" className="w-full">
                  <Link href={ctaHref}>{ctaLabel ?? 'Continue'}</Link>
                </Button>
              )}
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  );
}
