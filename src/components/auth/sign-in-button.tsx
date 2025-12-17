'use client';

import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FaGithub } from 'react-icons/fa6';

export function SignInButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    try {
      await signIn('github', { redirectTo: '/dashboard' });
    } catch (error) {
      console.error('Sign in error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleSignIn}
      disabled={isLoading}
      className="w-full flex items-center justify-center gap-2"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader className="h-5 w-5 animate-spin" /> Signing In
        </>
      ) : (
        <>
          <FaGithub className="h-5 w-5" />
          Continue with GitHub
        </>
      )}
    </Button>
  );
}
