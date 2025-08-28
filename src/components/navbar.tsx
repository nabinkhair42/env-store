'use client';
import { Logo } from '@/components/ui/Logo';
import { ModeSwitcher } from '@/components/ui/mode';
import { UserDropdown } from '@/components/ui/user-dropdown';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="sticky top-0 z-10 bg-background border-b border-dashed">
      <div className="flex justify-between items-center h-16 max-w-7xl mx-auto px-4">
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
            <Button onClick={() => router.push('/login')}>Login</Button>
          )}
        </div>
      </div>
    </div>
  );
}
