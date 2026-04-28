'use client';
import { UserDropdown } from '@/components/layouts/user-control';
import { NotificationBell } from '@/components/notifications';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { ModeSwitcher } from '@/components/ui/theme-toggle';
import { siteConfig } from '@/lib/sitemap';
import { useSession } from 'next-auth/react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const LoginDialog = dynamic(
  () => import('@/components/dialogs/login-dialog').then((m) => m.LoginDialog),
  { ssr: false },
);

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Logo size="md" />
            <span className="text-lg font-semibold tracking-tight">
              {siteConfig.name}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <ModeSwitcher />
            {status === 'loading' ? (
              <div className="size-8 rounded-full bg-muted animate-pulse" />
            ) : session ? (
              <>
                <NotificationBell />
                <UserDropdown />
              </>
            ) : (
              <Button onClick={() => setLoginOpen(true)} size="sm">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
