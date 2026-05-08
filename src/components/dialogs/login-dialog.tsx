'use client';

import { SignInButton } from '@/components/auth/sign-in-button';
import { Logo } from '@/components/logo';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { siteConfig } from '@/lib/sitemap';

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <Logo size="lg" />
          <DialogTitle className="text-2xl">{siteConfig.name}</DialogTitle>
          <DialogDescription>
            Sync your environment variables across devices securely
          </DialogDescription>
        </DialogHeader>
        <SignInButton />
        <DialogFooter className="text-muted-foreground">
          By signing in, you agree to sync your environment variables securely.
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
