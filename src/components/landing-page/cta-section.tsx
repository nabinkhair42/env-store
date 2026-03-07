'use client';

import { LoginDialog } from '@/components/modal/login-dialog';
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
      <section className="relative">
        {/* Dot pattern background */}
        <div className="dot-pattern absolute inset-0" aria-hidden="true" />

        <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-6 py-20 text-center sm:py-28">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to secure your environment variables?
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted-foreground sm:text-lg">
            Join developers who trust ENV Store for reliable config management.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <button
              onClick={handleGetStarted}
              className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-lg bg-foreground text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5),0_0_32px_rgba(255,255,255,0.1)] transition-opacity hover:opacity-80"
            >
              Get Started Free
            </button>
            <Link
              href="https://github.com/nabinkhair42/env-store"
              className="inline-flex h-11 w-44 items-center justify-center gap-2 rounded-lg border border-border text-sm font-medium text-foreground transition-colors hover:bg-muted/30"
            >
              View on GitHub
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-emerald-500/60"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Free forever</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-blue-500/60"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Open source</span>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="h-4 w-4 text-purple-500/60"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Self-hostable</span>
            </div>
          </div>
        </div>
      </section>

      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
