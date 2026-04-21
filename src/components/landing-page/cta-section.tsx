'use client';

import { LoginDialog } from '@/components/modal/login-dialog';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function CTASection() {
  const [loginOpen, setLoginOpen] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleGetStarted = () => {
    if (session) {
      router.push('/dashboard');
    } else {
      setLoginOpen(true);
    }
  };

  return (
    <>
      <section className="mx-auto flex w-full max-w-4xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to secure your environment variables?
        </h2>
        <p className="mt-4 max-w-lg text-base text-muted-foreground">
          Join developers who trust ENV Store for reliable config management.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" onClick={handleGetStarted}>
            Get Started Free
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/nabinkhair42/env-store">
              View on GitHub
            </Link>
          </Button>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
          <span>Free forever</span>
          <span>Open source</span>
        </div>
      </section>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
