'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Spinner } from '@/components/ui/spinner';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

interface LogOutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogOutDialog({ open, onOpenChange }: LogOutDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogOut = async () => {
    setIsLoading(true);
    try {
      await signOut({ callbackUrl: '/' });
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Sign Out</DialogTitle>
          <DialogDescription>
            Are you sure you want to sign out? You will need to log in again to
            access your projects.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleLogOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Signing Out
              </>
            ) : (
              'Sign Out'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
