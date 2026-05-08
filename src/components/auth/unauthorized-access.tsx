'use client';

import { LoginDialog } from '@/components/dialogs/login-dialog';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

export function UnauthorizedAccess() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleOpenChange = useCallback(
    (next: boolean) => {
      setOpen(next);
      if (!next) router.push('/');
    },
    [router],
  );

  return <LoginDialog open={open} onOpenChange={handleOpenChange} />;
}
