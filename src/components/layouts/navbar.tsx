'use client';
import { ModeSwitcher } from '@/components/ui/theme-toggle';
import { UserDropdown } from '@/components/ui/user-dropdown';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/modal/login-dialog';
import { useState } from 'react';
import { Logo } from '@/components/ui/logo';

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80 cursor-pointer"
          >
            <Logo size="md" />
            <span className="text-lg font-semibold tracking-tight">
              ENV Store
            </span>
          </button>

          {/* Right side: Mode switcher + Auth */}
          <div className="flex items-center gap-3">
            <ModeSwitcher />
            {session ? (
              <UserDropdown />
            ) : (
              <Button
                onClick={() => setLoginOpen(true)}
                className="h-9 rounded-lg bg-foreground px-4 text-sm font-medium text-background shadow-[inset_0_1px_0_rgba(255,255,255,0.25),inset_0_-1px_0_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.2),0_4px_12px_rgba(0,0,0,0.5),0_0_32px_rgba(255,255,255,0.1)] transition-opacity hover:opacity-80"
              >
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
