'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Logo } from '@/components/ui/Logo';
import { SignInButton } from '@/components/auth/sign-in-button';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-4">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <DialogTitle className="text-2xl font-medium text-center">
            ENV Store
          </DialogTitle>
          <DialogDescription className="text-center">
            Sync your environment variables across devices securely
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <SignInButton />
          <p className="text-xs text-center text-muted-foreground">
            By signing in, you agree to sync your environment variables
            securely.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
