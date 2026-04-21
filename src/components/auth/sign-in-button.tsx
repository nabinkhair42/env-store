'use client';

import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { HugeiconsIcon } from '@hugeicons/react';
import { GithubIcon } from '@hugeicons/core-free-icons';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { redirectTo: '/dashboard' });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Spinner />
          Signing In
        </>
      ) : (
        <>
          <HugeiconsIcon icon={GithubIcon} size={18} />
          Continue with GitHub
        </>
      )}
    </Button>
  );
}
