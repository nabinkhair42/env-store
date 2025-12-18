'use client';

import { LoginDialog } from '@/components/modal/login-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function UnauthorizedAccess() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (!open) {
      router.push('/');
    }
  }, [open, router]);

  return <LoginDialog open={open} onOpenChange={setOpen} />;
}
