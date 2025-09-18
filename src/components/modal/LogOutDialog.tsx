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
import { LogOut, Loader } from 'lucide-react';
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
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Sign Out
          </DialogTitle>
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
            className="flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader className="h-5 w-5 animate-spin" /> Signing Out
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                Sign Out
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
