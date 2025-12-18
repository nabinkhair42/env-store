'use client';
import { Logo } from '@/components/ui/logo';
import { ModeSwitcher } from '@/components/ui/mode';
import { UserDropdown } from '@/components/ui/user-dropdown';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { LoginDialog } from '@/components/modal/login-dialog';
import { useState } from 'react';

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <div className="sticky top-0 z-10 bg-background border-b border-dashed">
        <div className="flex justify-between items-center h-16 max-w-4xl mx-auto px-4 border-dashed border-l border-r">
          <div
            className="flex items-center cursor-pointer"
            onClick={() => router.push('/')}
          >
            <Logo size="md" className="mr-3" />
            <h1 className="text-xl font-semibold">ENV Store</h1>
          </div>
          <div className="flex items-center gap-4">
            <ModeSwitcher />
            {session ? (
              <UserDropdown />
            ) : (
              <Button onClick={() => setLoginOpen(true)}>Login</Button>
            )}
          </div>
        </div>
      </div>
      <LoginDialog open={loginOpen} onOpenChange={setLoginOpen} />
    </>
  );
}
