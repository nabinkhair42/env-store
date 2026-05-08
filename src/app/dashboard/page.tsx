'use client';

import { UnauthorizedAccess } from '@/components/auth/unauthorized-access';
import { Dashboard } from '@/components/dashboard/dashboard';
import { DashboardSkeleton } from '@/components/loaders';
import { useSession } from 'next-auth/react';

export default function Home() {
  const { status } = useSession();

  if (status === 'loading') {
    return (
      <div className="mx-auto w-full max-w-4xl px-6">
        <div className="py-8 space-y-2">
          <div className="h-3 w-16 rounded bg-muted animate-pulse" />
          <div className="h-8 w-48 rounded bg-muted animate-pulse" />
          <div className="h-4 w-64 rounded bg-muted animate-pulse" />
        </div>
        <DashboardSkeleton />
      </div>
    );
  }

  if (status === 'unauthenticated') return <UnauthorizedAccess />;

  return <Dashboard />;
}
